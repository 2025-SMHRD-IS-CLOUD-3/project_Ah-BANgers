[README.md](https://github.com/user-attachments/files/22020478/README.md)
# AI 스마트 키오스크 (AI SMART KIOSK)

## 📋 프로젝트 개요
AI 기술을 활용한 스마트 카페 키오스크 시스템입니다. 사용자가 터치스크린을 통해 메뉴를 선택하고, AI 음성 안내와 함께 주문을 완료할 수 있는 키오스크입니다.

## 🏗️ 프로젝트 구조

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

## 🚀 주요 기능

### 1. 🎯 메뉴 선택 시스템
- **커피 메뉴**: 아메리카노, 카페라떼, 카푸치노, 모카커피, 더치커피
- **차 메뉴**: 녹차, 레몬티, 아이스티, 유자차, 허니자몽티, 허브차
- **음료 메뉴**: 스무디, 에이드, 주스 등 다양한 음료

### 2. 🗣️ AI 음성 안내 (TTS)
- 각 화면마다 자동 음성 안내
- 한국어 음성 지원
- 사용자 행동에 따른 맞춤형 안내 메시지

### 3. 💳 결제 시스템
- **카드 결제**: 실제 카드 결제 연동
- **쿠폰 결제**: 쿠폰 번호 입력을 통한 결제
- **결제 진행**: 실시간 결제 상태 표시

### 4. 🔧 백엔드 서버
- **Flask 기반**: Python Flask 웹 프레임워크 사용
- **AWS 연동**: AWS Rekognition을 통한 AI 기능
- **Oracle DB**: 주문 및 사용자 데이터 저장

## 🛠️ 기술 스택

### Frontend
- **HTML5**: 웹 페이지 구조
- **CSS3**: 스타일링 및 반응형 디자인
- **JavaScript**: 사용자 인터랙션 및 TTS 기능
- **Web Speech API**: 브라우저 내장 TTS 사용

### Backend
- **Python 3.x**: 서버 로직 구현
- **Flask**: 웹 프레임워크
- **Flask-CORS**: 크로스 오리진 요청 처리
- **Boto3**: AWS SDK (Rekognition 연동)
- **Oracle DB**: 데이터베이스 연결

### AI & Cloud
- **AWS Rekognition**: 이미지 인식 및 분석
- **Web Speech API**: 텍스트를 음성으로 변환

## 📦 설치 및 실행 방법

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

## 🎮 사용 방법

### 1. 메인 화면
- 터치스크린을 터치하여 키오스크 시작

### 2. 메뉴 선택
- 포장/매장식 선택
- 음료 카테고리 선택 (커피/차/음료)
- 원하는 메뉴 선택 및 옵션 설정

### 3. 주문 완료
- 장바구니에 담기
- 결제 방법 선택 (카드/쿠폰)
- 결제 진행 및 완료

## 🔧 개발자 가이드

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

## 📝 주의사항

1. **TTS 기능**: HTTPS 환경에서만 작동합니다 (보안 정책)
2. **AWS 연동**: 유효한 AWS 자격증명이 필요합니다
3. **Oracle DB**: 데이터베이스 연결 정보가 올바르게 설정되어야 합니다
4. **이미지 파일**: 메뉴 이미지는 적절한 크기와 형식으로 준비해야 합니다

## 🐛 문제 해결

### TTS가 작동하지 않는 경우
- 브라우저가 HTTPS를 지원하는지 확인
- 브라우저 설정에서 음성 권한 허용
- `tts_2.js` 파일이 올바르게 로드되었는지 확인

### 서버 연결 오류
- `requirements.txt`의 모든 패키지가 설치되었는지 확인
- 환경 변수가 올바르게 설정되었는지 확인
- 방화벽 설정 확인

## 📞 지원 및 문의

프로젝트 관련 문의사항이나 버그 리포트는 개발팀에 연락해주세요.

## 📄 라이선스

이 프로젝트는 교육 목적으로 제작되었습니다.

---

**마지막 업데이트**: 2024년 12월
**버전**: 1.0.0
**개발팀**: AI 스마트 키오스크 개발팀
