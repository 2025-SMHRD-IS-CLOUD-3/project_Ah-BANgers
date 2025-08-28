# AI 스마트 키오스크 (AI SMART KIOSK)

**멀티모달 AI 기술을 활용한 스마트 카페 키오스크 시스템**

> "복잡한 주문 과정, AI 음성 안내와 함께 간편하게 해결하세요!"

## 프로젝트 소개

AI 스마트 키오스크는 사용자의 터치 입력과 AI 음성 안내를 통해, 직관적이고 편리한 카페 주문 경험을 제공하는 스마트 키오스크 시스템입니다. 

**핵심 가치**: 접근성 향상, 사용자 경험 개선, 운영 효율성 증대

---

## 핵심 기능

### 입력 처리
- **터치스크린 입력**: 직관적인 터치 기반 메뉴 선택
- **음성 안내**: 각 단계별 자동 음성 안내 (TTS)
- **멀티모달 인터랙션**: 시각 + 청각을 통한 복합적 사용자 경험

### AI 음성 안내 (TTS)
- **자동 음성 안내**: 각 화면마다 상황별 맞춤 음성 메시지
- **한국어 음성 지원**: 자연스러운 한국어 발음과 억양
- **사용자 행동 추적**: 클릭 이벤트에 따른 실시간 음성 피드백

### 메뉴 선택 시스템
- **커피 메뉴**: 아메리카노, 카페라떼, 카푸치노, 모카커피, 더치커피
- **차 메뉴**: 녹차, 레몬티, 아이스티, 유자차, 허니자몽티, 허브차
- **음료 메뉴**: 스무디, 에이드, 주스 등 다양한 음료

### 결제 시스템
- **카드 결제**: 실제 카드 결제 연동 및 실시간 상태 표시
- **쿠폰 결제**: 쿠폰 번호 입력을 통한 간편 결제
- **결제 진행**: 단계별 진행 상황 및 완료 알림

### 백엔드 서버
- **Flask 기반**: Python Flask 웹 프레임워크 사용
- **AWS 연동**: AWS Rekognition을 통한 AI 기능
- **Oracle DB**: 주문 및 사용자 데이터 저장 및 관리

---

## 기술 스택

| 분야 | 기술 |
|------|------|
| **프론트엔드** | HTML5, CSS3, JavaScript, Web Speech API |
| **디자인** | 반응형 터치스크린 UI/UX, CSS3 애니메이션 |
| **백엔드 / 언어** | Python 3.x, Flask, Flask-CORS |
| **서버** | Flask Development Server, Production Ready |
| **데이터베이스** | Oracle Database, OracleDB Python Driver |
| **AI** | AWS Rekognition, Web Speech API (TTS) |
| **결제** | 카드 결제 시스템, 쿠폰 결제 시스템 |
| **협업** | Git, GitHub, VS Code |
| **개발도구** | Python, HTML/CSS/JS, Oracle SQL Developer |

---

## 프로젝트 구조

```
AI_SMART_KIOSK/
├── 📁 메인 파일들
│   ├── main.html              # 메인 시작 화면
│   ├── server.py              # Flask 백엔드 서버
│   ├── app.js                 # 메인 JavaScript 로직
│   └── style.css              # 전체 스타일시트
│
├── 📁 메뉴 관련 페이지
│   ├── menu.html              # 메인 메뉴 선택 화면
│   ├── menu-selection.html    # 메뉴 카테고리 선택
│   ├── menu-coffee.html       # 커피 메뉴 화면
│   ├── menu-tea.html          # 차 메뉴 화면
│   ├── menu-drink.html        # 음료 메뉴 화면
│   ├── menu-list.html         # 전체 메뉴 리스트
│   └── drink_*.html           # 각 음료별 상세 페이지
│
├── 📁 주문 및 결제
│   ├── order-type.html        # 포장/매장식 선택
│   ├── order-type2.html       # 주문 타입 선택 2
│   ├── pay-method.html        # 결제 방법 선택
│   ├── pay-card.html          # 카드 결제 화면
│   ├── pay_coupon.html        # 쿠폰 결제 화면
│   ├── pay-ing.html           # 결제 진행 중 화면
│   └── pay-end.html           # 결제 완료 화면
│
├── 📁 AI 기능
│   └── tts(2차 수정)/
│       └── tts_2.js           # TTS(음성 안내) 기능
│
├── 📁 이미지 및 리소스
│   ├── img/                   # 기본 이미지들
│   ├── 메뉴 이미지/            # 메뉴별 이미지
│   │   ├── 커피(Coffee)/      # 커피 메뉴 이미지
│   │   ├── 차(Tea)/          # 차 메뉴 이미지
│   │   └── 음료(Drink)/      # 음료 메뉴 이미지
│   ├── card.png               # 카드 이미지
│   └── placehold.png          # 플레이스홀더 이미지
│
├── 📁 설정 및 로그
│   ├── requirements.txt        # Python 패키지 의존성
│   ├── server.log             # 서버 로그 파일
│   └── __pycache__/           # Python 캐시 폴더
│
└── 📁 기타
    ├── loading.html            # 로딩 화면
    └── .vscode/                # VS Code 설정
```

---

## 기대효과 및 활용 방안

### 소비자 측면
- **접근성 향상**: 시각/청각 장애인도 편리하게 이용 가능
- **사용자 경험 개선**: 직관적인 인터페이스와 음성 안내로 주문 과정 단순화
- **대기 시간 단축**: AI 기반 빠른 메뉴 탐색 및 주문 처리

### 사업자 측면
- **운영 효율성 증대**: 24시간 무인 운영 가능
- **인건비 절약**: 주문 처리 인력 최소화
- **데이터 수집**: 고객 주문 패턴 분석 및 마케팅 활용

### 확장 가능성
- **다양한 업종**: 카페 외에도 패스트푸드, 편의점 등으로 확장 가능
- **B2B 솔루션**: 키오스크 제조업체 대상 솔루션 제공
- **글로벌 진출**: 다국어 음성 안내 지원으로 해외 시장 진출

---

## 팀 소개

| 이름 | 역할 및 담당 |
|------|-------------|
| **개발팀** | 총괄 개발, 시스템 설계, AI 기능 구현 |
| **기획팀** | 사용자 경험 설계, UI/UX 기획 |
| **디자인팀** | 터치스크린 인터페이스 디자인, 시각적 요소 |

---

## 설치 및 실행 방법

### 1. 환경 설정
```bash
# Python 가상환경 생성 (권장)
python -m venv venv

# 가상환경 활성화
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

### 2. 의존성 설치
```bash
pip install -r requirements.txt
```

### 3. 환경 변수 설정
`.env` 파일을 생성하고 다음 내용을 추가하세요:
```env
# AWS 설정
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-northeast-2

# Oracle DB 설정
ORACLE_HOST=project-db-campus.smhrd.com
ORACLE_PORT=1524
ORACLE_USER=campus_24IS_CLOUD3_p2_3
ORACLE_PASSWORD=smhrd3
ORACLE_SID=xe
```

### 4. 서버 실행
```bash
python server.py
```

### 5. 웹 브라우저에서 접속
```
http://localhost:5000
```

---

## 사용 방법

### 1. 메인 화면
- 터치스크린을 터치하여 키오스크 시작
- AI 음성 안내와 함께 사용법 안내

### 2. 메뉴 선택
- 포장/매장식 선택
- 음료 카테고리 선택 (커피/차/음료)
- 원하는 메뉴 선택 및 옵션 설정
- 각 단계별 음성 안내 제공

### 3. 주문 완료
- 장바구니에 담기
- 결제 방법 선택 (카드/쿠폰)
- 결제 진행 및 완료
- 주문 완료 음성 안내

---

## 개발자 가이드

### TTS 기능 추가하기
`tts(2차 수정)/tts_2.js` 파일에서 새로운 버튼과 음성 메시지를 추가할 수 있습니다:

```javascript
// 새로운 버튼 추가
{ id: '#new_button', text: '새로운 음성 메시지입니다.' }
```

### 새로운 메뉴 추가하기
1. `메뉴 이미지/` 폴더에 이미지 추가
2. 해당 HTML 파일에서 메뉴 항목 추가
3. TTS 음성 안내 메시지 추가

### 스타일 수정하기
`style.css` 파일에서 전체적인 디자인을 수정할 수 있습니다.

---

## 주의사항

1. **TTS 기능**: HTTPS 환경에서만 작동합니다 (보안 정책)
2. **AWS 연동**: 유효한 AWS 자격증명이 필요합니다
3. **Oracle DB**: 데이터베이스 연결 정보가 올바르게 설정되어야 합니다
4. **이미지 파일**: 메뉴 이미지는 적절한 크기와 형식으로 준비해야 합니다

---

## 문제 해결

### TTS가 작동하지 않는 경우
- 브라우저가 HTTPS를 지원하는지 확인
- 브라우저 설정에서 음성 권한 허용
- `tts_2.js` 파일이 올바르게 로드되었는지 확인

### 서버 연결 오류
- `requirements.txt`의 모든 패키지가 설치되었는지 확인
- 환경 변수가 올바르게 설정되었는지 확인
- 방화벽 설정 확인

<div align="center">

**🌟 AI 스마트 키오스크로 더 스마트한 카페 경험을 만들어보세요! 🌟**

</div>
