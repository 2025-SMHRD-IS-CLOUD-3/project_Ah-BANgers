// 버튼 ID와 읽을 문장을 배열로 관리
const buttons = [
  { id: '#choice_takeout', text: '안녕하세요. 가게 안에서 드시려면 파란색을 눌러주시고 집에서 드시려면 빨간색을 눌러주세요.' },
  { id: '#take_out', text: '포장을 선택하셨습니다. 포장하시고 싶으신 걸 눌러주세요.' },
  { id: '#eat_in', text: '매장을 선택하셨습니다.  매장에서 드시고 싶으신 걸 눌러주세요.' },
  { id: '#menu_coffee', text: '커피를 선택하셨습니다. 어떤 커피를 원하시나요?.' },
  { id: '#menu_tea', text: '차를 선택하셨습니다. 어떤 차를 원하시나요?' },
  { id: '#menu_drink', text: '음료를 선택하셨습니다. 어떤 음료를 원하시나요?' },
  { id: '#choice_option', text: '어떻게 드시고 싶으세요? 화면을 보고 골라주시고 다 고르셨으면 오른쪽 맨 밑에 있는 장바구니 담기를 눌러주세요.' },
  { id: '#choice_payment', text: '카드로 결제하시려면 카드결제를, 쿠폰을 쓰시려면 쿠폰사용을 눌러주세요.' },
  { id: '#choice_card', text: '카드를 아래쪽에 있는 카드 투입구에 넣어주세요.' },
  { id: '#choice_coupon', text: '쿠폰번호 여섯자리를 입력해주세요.' },
  { id: '#pay_card', text: '결제 중입니다. 결제가 완료됐어요. 감사합니다.' },
  { id: '#fin_order', text: '주문이 완료됐어요. 주문 번호로 불러드릴게요.' },
  { id: '#help_staff', text: '잠시만 기다려주세요. 금방 가서 도와드릴게요.' }
];

// 음성 객체 재사용
function createMessage(text) {
  const msg = new SpeechSynthesisUtterance();
  msg.lang = 'ko-KR';
  msg.pitch = 1;
  msg.rate = 1;
  msg.volume = 1;
  msg.text = text;
  return msg;
}



// 버튼마다 이벤트 리스너 등록
buttons.forEach(({ id, text }) => {
  const button = document.querySelector(id);
  if (!button) return; // 버튼이 없는 경우 무시

button.addEventListener('click', () => {
  console.log(`id: ${button.textContent}, 음성: ${text}`);
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }

  if (id === '#pay_card') {
      // 1. "결제 중입니다."
      window.speechSynthesis.speak(createMessage('결제 중입니다.'));

      // 2. 3초 뒤 → "결제가 완료됐어요. 감사합니다."
      setTimeout(() => {
        window.speechSynthesis.speak(createMessage('결제가 완료됐어요. 감사합니다.'));

        // 3. 그 후 1초 뒤 → #fin_order 자동 실행
        setTimeout(() => {
          const finOrder = buttons.find(b => b.id === '#fin_order');
          if (finOrder) {
            window.speechSynthesis.speak(createMessage(finOrder.text));
            console.log(`자동 실행: "${finOrder.text}"`);
          }
        }, 1000);

      }, 3000);

    } else {
    // 일반 버튼은 기존 방식
    setTimeout(() => {
      window.speechSynthesis.speak(createMessage(text));
    }, 500);
  }
});

});

// 음성 리스트 출력 (디버그용)
function populateVoiceList() {
  if (typeof speechSynthesis === 'undefined') return;

  const voices = speechSynthesis.getVoices();
  const voiceList = voices
    .filter((voice) => voice.lang.includes('en'))
    .map((voice) => `${voice.name} (${voice.lang})`);
  console.log(voiceList);
}

populateVoiceList();
if (typeof speechSynthesis !== 'undefined' &&
    speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

/* =========================
   시작 버튼 클릭 → 짧은 무음 → 첫 음성
========================= */
const startBtn = document.querySelector('#start');
if (startBtn) startBtn.addEventListener('click', () => {
  // 짧은 무음 재생 (권한 확보)
  const silentAudio = new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQAAAAA=");
  silentAudio.play().then(() => {
    // 첫 음성 재생
    const firstButton = buttons.find(b => b.id === '#choice_takeout');
    if (firstButton) {
      window.speechSynthesis.speak(createMessage(firstButton.text));
      console.log(`첫 음성 시작: "${firstButton.text}"`);
    }
  }).catch(err => console.log("무음 재생 실패:", err));
});

// 엔터키 입력 시 시작 버튼 클릭 이벤트 트리거
document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const startButton = document.querySelector('#start');
    if (startButton) startButton.click();
  }
});
