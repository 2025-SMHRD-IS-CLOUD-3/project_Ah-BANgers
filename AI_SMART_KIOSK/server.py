import os
import base64

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
import boto3
import oracledb


def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app)
    load_dotenv()

    # =============================
    # AWS Rekognition 클라이언트
    # =============================
    # =============================
    # AWS 자격정보 설정 방법 (둘 중 하나만 하면 돼요)
    # 1) .env 또는 시스템 환경변수에 키를 넣기 (권장)
    # 2) 아래 상수(HARDCODED_*)에 직접 적기
    #    예) HARDCODED_AWS_ACCESS_KEY_ID = "AKIA..." (따옴표 안에)
    #    비워두면 자동으로 환경변수(.env 포함)를 사용해요.
    HARDCODED_AWS_ACCESS_KEY_ID = ""
    HARDCODED_AWS_SECRET_ACCESS_KEY = ""
    HARDCODED_AWS_SESSION_TOKEN = ""  # 임시자격증명일 때만 사용, 아니면 빈문자열 그대로 두세요

    def _create_rekognition_client():
        """AWS Rekognition 클라이언트를 만들어요.
        - 순서대로 자격증명을 찾습니다: 환경변수(.env 포함) → 하드코딩 상수 → 기본 자격증명 체인
        """
        aws_region = os.environ.get("AWS_REGION", "ap-northeast-2")

        # 1) 환경변수(.env 포함)에서 먼저 찾기
        access_key = os.environ.get("AWS_ACCESS_KEY_ID") or HARDCODED_AWS_ACCESS_KEY_ID
        secret_key = os.environ.get("AWS_SECRET_ACCESS_KEY") or HARDCODED_AWS_SECRET_ACCESS_KEY
        session_token = os.environ.get("AWS_SESSION_TOKEN") or HARDCODED_AWS_SESSION_TOKEN or None

        # 2) 값이 있으면 세션을 만들어 사용
        if access_key and secret_key:
            session = boto3.session.Session(
                aws_access_key_id=access_key,
                aws_secret_access_key=secret_key,
                aws_session_token=session_token,
                region_name=aws_region,
            )
            return session.client("rekognition")

        # 3) 값이 없으면 기본 자격증명 체인 사용 (예: ~/.aws/credentials)
        return boto3.client("rekognition", region_name=aws_region)

    rekognition = _create_rekognition_client()
    BASE_DIR = os.path.dirname(__file__)

    # =============================
    # Oracle DB 연결 설정
    # =============================
    def _init_oracle_thick_if_available():
        try:
            client_dir = os.environ.get("ORACLE_CLIENT_LIB_DIR") or os.environ.get("OCI_LIB_DIR")
            if client_dir and os.path.isdir(client_dir):
                oracledb.init_oracle_client(lib_dir=client_dir)
                print(f"[DB] thick 모드 (lib_dir={client_dir})")
            else:
                try:
                    oracledb.init_oracle_client()
                    print("[DB] thick 모드 (PATH)")
                except Exception:
                    print("[DB] Instant Client 없음 → thin 모드")
        except Exception as e:
            print("[DB] thick 초기화 실패:", e)

    def _build_dsn_from_env():
        host = os.environ.get("ORACLE_HOST", "project-db-campus.smhrd.com").strip()
        port = int(os.environ.get("ORACLE_PORT", 1524))
        service = os.environ.get("ORACLE_SERVICE_NAME", "").strip()
        sid = os.environ.get("ORACLE_SID", "xe").strip()
        if not host:
            return None
        if service:
            return oracledb.makedsn(host, port, service_name=service)
        if sid:
            return oracledb.makedsn(host, port, sid=sid)
        return None

    def _create_oracle_pool():
        try:
            user = os.environ.get("ORACLE_USER") or "campus_24IS_CLOUD3_p2_3"
            password = os.environ.get("ORACLE_PASSWORD") or "smhrd3"
            dsn = _build_dsn_from_env()
            if not dsn:
                print("[DB] DSN 없음 → 풀 생성 생략")
                return None
            pool = oracledb.ConnectionPool(
                user=user,
                password=password,
                dsn=dsn,
                min=1,
                max=5,
                increment=1,
                homogeneous=True,
                encoding="UTF-8",
            )
            print("[DB] 커넥션 풀 생성 성공")
            return pool
        except Exception as e:
            print("[DB] 풀 생성 실패:", e)
            return None

    _init_oracle_thick_if_available()
    oracle_pool = _create_oracle_pool()

    # =============================
    # 유틸 (이미지 디코드, 나이 추정)
    # =============================
    def _decode_base64_image(data_url: str) -> bytes:
        try:
            if "," in data_url:
                data_url = data_url.split(",", 1)[1]
            return base64.b64decode(data_url)
        except Exception:
            return b""

    def _estimate_age_from_faces(face_details: list[dict]) -> float | None:
        if not face_details:
            return None
        age = face_details[0].get("AgeRange", {})
        low = float(age.get("Low", 0))
        high = float(age.get("High", 0))
        return (low + high) / 2.0

    # =============================
    # API: AWS Rekognition (나이 추정)
    # =============================
    @app.post("/analyze-age")
    def analyze_age():
        try:
            payload = request.get_json(silent=True) or {}
            images = payload.get("images", [])
            if not isinstance(images, list) or not images:
                return jsonify({"error": "images 배열이 필요합니다."}), 400

            estimates: list[float] = []
            for one_image in images:
                image_bytes = _decode_base64_image(str(one_image))
                if not image_bytes:
                    continue
                try:
                    result = rekognition.detect_faces(Image={"Bytes": image_bytes}, Attributes=["ALL"])  # type: ignore
                    est = _estimate_age_from_faces(result.get("FaceDetails", []))
                    if est is not None:
                        estimates.append(est)
                except Exception as e:
                    print("[WARN] detect_faces 실패:", e)
                    continue

            average = round(sum(estimates) / len(estimates), 1) if estimates else 0.0
            return jsonify({"estimates": estimates, "average": average})
        except Exception as e:
            print("[ERROR] /analyze-age:", e)
            return jsonify({"error": "server_error", "message": str(e)}), 500

    # =============================
    # API: DB 연결 확인
    # =============================
    @app.get("/db-test")
    def db_test():
        if oracle_pool is None:
            return jsonify({"ok": False, "error": "db_not_configured"}), 500
        try:
            with oracle_pool.acquire() as conn:
                with conn.cursor() as cur:
                    cur.execute("select 1 from dual")
                    row = cur.fetchone()
                    value = int(row[0]) if row else 0
            return jsonify({"ok": value == 1})
        except Exception as e:
            print("[DB] /db-test 오류:", e)
            return jsonify({"ok": False, "error": str(e)}), 500

    # =============================
    # API: 특정 테이블 컬럼 조회
    # =============================
    @app.get("/db/columns")
    def db_columns():
        table = request.args.get("table", "").upper()
        if not table:
            return jsonify({"error": "table 파라미터 필요"}), 400
        if oracle_pool is None:
            return jsonify({"error": "db_not_configured"}), 500
        try:
            with oracle_pool.acquire() as conn:
                with conn.cursor() as cur:
                    cur.execute("""
                        SELECT column_name, data_type, data_length, nullable
                        FROM user_tab_columns
                        WHERE table_name = :table
                        ORDER BY column_id
                    """, [table])
                    cols = [
                        {
                            "name": r[0],
                            "type": r[1],
                            "length": r[2],
                            "nullable": r[3]
                        }
                        for r in cur.fetchall()
                    ]
            return jsonify({"table": table, "columns": cols})
        except Exception as e:
            print("[DB] /db/columns 오류:", e)
            return jsonify({"error": str(e)}), 500

    # =============================
    # 정적 파일 서빙 (개발용)
    # - http://localhost:5000/         → main.html
    # - http://localhost:5000/파일명   → 해당 정적 파일
    # =============================
    @app.get("/")
    def _serve_index():
        try:
            return send_from_directory(BASE_DIR, "main.html")
        except Exception:
            return send_from_directory(BASE_DIR, "index.html")

    @app.get("/<path:filename>")
    def _serve_any_static(filename: str):
        return send_from_directory(BASE_DIR, filename)

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5000, debug=True)
