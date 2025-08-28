"use strict";

// 아주 쉬운 키오스크 스크립트
// - 탭에 따라 메뉴가 바뀜
// - 상품을 누르면 장바구니에 담김
// - 선택한 항목 삭제/전체삭제/결제 가능
// - 120초 타이머 (동작 중 선택/결제로 초기화됨)

// 1) 간단한 유틸: 숫자를 "1,000원"처럼 보여주기
function formatCurrencyKRW(number) {
	try {
		return new Intl.NumberFormat("ko-KR").format(number) + "원";
	} catch (error) {
		// Intl 을 사용할 수 없는 오래된 환경 대비
		const safeNumber = Number(number) || 0;
		return safeNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "원";
	}
}

// 2) 간단한 데이터: 이미지 경로는 test4/메뉴 이미지 폴더를 사용
//    실제 프로젝트에서는 서버/DB에서 불러오면 좋아요.
const IMAGE_BASE = "메뉴 이미지/";

// 메뉴 데이터는 카테고리별로 나눠요.
const MENU_DATA = {
	// 커피
	hot: [
		{ id: "americano", name: "아메리카노", price: 4500, img: IMAGE_BASE + "커피(Coffee)/아메리카노.png" },
		{ id: "caffe-mocha", name: "카페모카", price: 6000, img: IMAGE_BASE + "커피(Coffee)/모카커피.png" },
		{ id: "caffe-latte", name: "카페라떼", price: 5500, img: IMAGE_BASE + "커피(Coffee)/카페라떼.png" },
		{ id: "dabang-coffee", name: "다방커피", price: 4000, img: IMAGE_BASE + "커피(Coffee)/카페라떼.png" },
		{ id: "coldbrew", name: "콜드브루", price: 5000, img: IMAGE_BASE + "커피(Coffee)/더치커피.png" },
		{ id: "cappuccino", name: "카푸치노", price: 5500, img: IMAGE_BASE + "커피(Coffee)/카푸치노.png" }
	],
	// 차
	ice: [
		{ id: "iced-tea", name: "아이스티", price: 4000, img: IMAGE_BASE + "차(Tea)/아이스티.jpg" },
		{ id: "yuja-tea", name: "유자차", price: 4500, img: IMAGE_BASE + "차(Tea)/유자차.png" },
		{ id: "lemon-tea", name: "레몬차", price: 4500, img: IMAGE_BASE + "차(Tea)/레몬티.jpg" },
		{ id: "green-tea", name: "녹차", price: 4000, img: IMAGE_BASE + "차(Tea)/녹차.png" },
		{ id: "herb-tea", name: "허브차", price: 4500, img: IMAGE_BASE + "차(Tea)/허브차.png" },
		{ id: "honey-grapefruit-tea", name: "꿀자몽차", price: 5000, img: IMAGE_BASE + "차(Tea)/허니 자몽티 (ICE).png" }
	],
	// 음료
	ade: [
		{ id: "lemon-ade", name: "레몬 에이드", price: 6000, img: IMAGE_BASE + "음료(Drink)/레몬에이드.jpg" },
		{ id: "grapefruit-ade", name: "자몽 에이드", price: 6500, img: IMAGE_BASE + "음료(Drink)/자몽에이드.jpg" },
		{ id: "green-grape-ade", name: "청포도 에이드", price: 6000, img: IMAGE_BASE + "음료(Drink)/청포도 에이드.png" },
		{ id: "orange-juice", name: "오렌지 주스", price: 5500, img: IMAGE_BASE + "음료(Drink)/오렌지 주스.png" },
		{ id: "grape-juice", name: "포도 주스", price: 6000, img: IMAGE_BASE + "음료(Drink)/포도 주스.png" },
		{ id: "kiwi-juice", name: "키위 주스", price: 6500, img: IMAGE_BASE + "음료(Drink)/키위 주스.png" },
		{ id: "strawberry-smoothie", name: "딸기 스무디", price: 7000, img: IMAGE_BASE + "음료(Drink)/딸기 스무디.jpg" },
		{ id: "mango-smoothie", name: "망고 스무디", price: 7500, img: IMAGE_BASE + "음료(Drink)/망고 스무디.jpg" },
		{ id: "blueberry-smoothie", name: "블루베리 스무디", price: 7000, img: IMAGE_BASE + "음료(Drink)/블루베리 스무디.jpg" }
	]
};

// 3) 상태 관리: 장바구니와 타이머
const state = {
	activeCategory: "hot",
	cartItems: [], // {id, name, price, quantity}
	leftSeconds: 120,
	timerId: null
};

// 4) DOM 요소 찾기 (에러 방지: 없으면 조용히 종료)
const $menuGrid = document.getElementById("menuGrid");
const $tabs = document.querySelectorAll(".tab");
const $cartList = document.getElementById("cartList");
const $totalPrice = document.getElementById("totalPrice");
const $leftSeconds = document.getElementById("leftSeconds");
const $btnClearAll = document.getElementById("btnClearAll");
const $btnRemoveSelected = document.getElementById("btnRemoveSelected");
const $btnPay = document.getElementById("btnPay");
const $modal = document.getElementById("modal");
const $modalText = document.getElementById("modalText");
const $modalClose = document.getElementById("modalClose");
// 상단 바 버튼 요소들
const $btnHome = document.getElementById("btnHome");
const $btnZoom = document.getElementById("btnZoom");
// 옵션 모달 요소
const $optionModal = document.getElementById("optionModal");
const $optionForm = document.getElementById("optionForm");
const $optQty = document.getElementById("optQty");
const $optPrice = document.getElementById("optPrice");
const $optCancel = document.getElementById("optCancel");
const $optConfirm = document.getElementById("optConfirm");
const $qtyMinus = document.getElementById("qtyMinus");
const $qtyPlus = document.getElementById("qtyPlus");
const $optItemImg = document.getElementById("optItemImg");
const $optItemName = document.getElementById("optItemName");
const $segmented = document.querySelector('.segmented');

// 결제 방식 선택 모달 요소
const $payMethodModal = document.getElementById("payMethodModal");
const $btnPayCard = document.getElementById("btnPayCard");
const $btnPayCoupon = document.getElementById("btnPayCoupon");
const $btnPayBack = document.getElementById("btnPayBack");
const $paySummaryList = document.getElementById("paySummaryList");
const $paySummaryTotal = document.getElementById("paySummaryTotal");
const $paySummaryCount = document.getElementById("paySummaryCount");
// 카드 모달 요소
const $cardModal = document.getElementById('cardModal');
const $cardCloseX = document.getElementById('cardCloseX');
const $btnCardCancel = document.getElementById('btnCardCancel');
const $btnCardApprove = document.getElementById('btnCardApprove');
const $cardTotalAmount = document.getElementById('cardTotalAmount');
// 주문 완료 모달 요소
const $orderEndModal = document.getElementById('orderEndModal');
const $orderEndNumber = document.getElementById('orderEndNumber');

// 쿠폰 모달 요소
const $couponModal = document.getElementById('couponModal');
const $couponNumber = document.getElementById('couponNumber');
const $couponName = document.getElementById('couponName');
const $couponApplyAmount = document.getElementById('couponApplyAmount');
const $couponKeypad = document.getElementById('couponKeypad');
const $couponQuery = document.getElementById('couponQuery');
const $couponUse = document.getElementById('couponUse');
const $couponCloseX = document.getElementById('couponCloseX');
const $couponPayAmountEl = document.getElementById('couponPayAmount');
let couponDiscount = 0; // 현재 적용된 쿠폰 할인액(원)

if (!$menuGrid || !$tabs || !$cartList) {
	console.error("필수 DOM 요소가 없습니다. index.html을 확인해주세요.");
}

// 5) 타이머 관련 함수

function resetTimer() {
	state.leftSeconds = 120;
	updateTimerText();
	startTimer();
}

function updateTimerText() {
	if ($leftSeconds) $leftSeconds.textContent = String(state.leftSeconds);
}

function startTimer() {
	stopTimer();
	state.timerId = setInterval(() => {
		state.leftSeconds -= 1;
		if (state.leftSeconds <= 0) {
			stopTimer();
			openModal("시간이 초과되었습니다. 처음부터 다시 시도해주세요.");
			clearCart();
			state.leftSeconds = 120;
		}
		updateTimerText();
	}, 1000);
}

function stopTimer() {
	if (state.timerId) {
		clearInterval(state.timerId);
		state.timerId = null;
	}
}

// 6) 메뉴 그리드 렌더링
function renderMenu() {
	let items = MENU_DATA[state.activeCategory];
	if (!items) {
		state.activeCategory = "hot";
		items = MENU_DATA[state.activeCategory] || [];
		if ($tabs && $tabs.length) {
			$tabs.forEach(t => t.classList.toggle("active", t.dataset.category === state.activeCategory));
		}
	}
	$menuGrid.innerHTML = (items || []).map(item => createMenuCardHTML(item)).join("");
}

function createMenuCardHTML(item) {
	// 안전을 위해 잘못된 이미지 경로일 경우 대비해 alt로 안내
	return (
		`<button class="card" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}" data-img="${item.img}">` +
			`<img src="${item.img}" alt="${item.name} 이미지" onerror="this.src='placehold.png'" />` +
			`<div class="name">${item.name}</div>` +
			`<div class="price">${formatCurrencyKRW(item.price)}</div>` +
		`</button>`
	);
}

// 7) 장바구니 렌더링
function renderCart() {
	if (!Array.isArray(state.cartItems)) return;
	if (state.cartItems.length === 0) {
		$cartList.innerHTML = `<p style="margin:4px;color:#777;">선택한 상품이 없습니다.</p>`;
		$totalPrice.textContent = formatCurrencyKRW(0);
		return;
	}
	$cartList.innerHTML = state.cartItems.map((item, idx) => {
		const subtotal = item.price * item.quantity;
		return (
			`<div class="cart-item">` +
				`<div class="title">${item.name} x ${item.quantity}</div>` +
				`<button aria-label="수량감소" data-minus="${idx}">－</button>` +
				`<div class="subtotal">${formatCurrencyKRW(subtotal)}</div>` +
				`<button aria-label="수량추가" data-plus="${idx}">＋</button>` +
			`</div>`
		);
	}).join("");

	const total = state.cartItems.reduce((sum, it) => sum + it.price * it.quantity, 0);
	$totalPrice.textContent = formatCurrencyKRW(total);
}

// 8) 장바구니 조작
function addToCart(id, name, price) {
	const found = state.cartItems.find(it => it.id === id);
	if (found) {
		found.quantity += 1;
	} else {
		state.cartItems.push({ id, name, price, quantity: 1 });
	}
	renderCart();
	resetTimer();
}

function clearCart() {
	state.cartItems = [];
	renderCart();
}

function removeSelectedFromCart() {
	const checks = $cartList.querySelectorAll('input[type="checkbox"]');
	const remained = [];
	state.cartItems.forEach((item, idx) => {
		const checked = Array.from(checks).some(ch => Number(ch.dataset.index) === idx && ch.checked);
		if (!checked) remained.push(item);
	});
	state.cartItems = remained;
	renderCart();
}

// 9) 모달
function openModal(message) {
	$modalText.textContent = message;
	$modal.hidden = false;
}
function closeModal() { $modal.hidden = true; }

// 결제 방식 모달 열기/닫기
function openPayMethodModal() {
	if (!$payMethodModal) return;
	renderPaySummary();
	$payMethodModal.hidden = false;
}
function closePayMethodModal() {
	if (!$payMethodModal) return;
	$payMethodModal.hidden = true;
}

// 결제 요약 렌더링: 장바구니 내용을 결제 모달에 표시
function renderPaySummary() {
	if (!$paySummaryList || !$paySummaryTotal) return;
	if (!Array.isArray(state.cartItems) || state.cartItems.length === 0) {
		$paySummaryList.innerHTML = `<p style="margin:4px;color:#777;">선택한 상품이 없습니다.</p>`;
		$paySummaryTotal.textContent = formatCurrencyKRW(0);
		if ($paySummaryCount) $paySummaryCount.textContent = `수량 0개`;
		return;
	}
	const rows = state.cartItems.map((item) => {
		const subtotal = item.price * item.quantity;
		return (
			`<div class="cart-item">`+
				`<div class="title">${item.name} x ${item.quantity}</div>`+
				`<div></div>`+
				`<div class="subtotal">${formatCurrencyKRW(subtotal)}</div>`+
				`<div></div>`+
			`</div>`
		);
	}).join("");
	$paySummaryList.innerHTML = rows;
	const total = state.cartItems.reduce((sum, it) => sum + it.price * it.quantity, 0);
	$paySummaryTotal.textContent = formatCurrencyKRW(total);
	const totalQty = state.cartItems.reduce((sum, it) => sum + it.quantity, 0);
	if ($paySummaryCount) $paySummaryCount.textContent = `수량 ${totalQty}개`;
}

// 옵션 모달 제어
let optionTargetItem = null; // 사용자가 누른 원 상품 데이터 저장
function resetOptionFormToDefaults() {
	if (!$optionForm) return;
	try { $optionForm.reset(); } catch (error) {}
	if ($optQty) { $optQty.value = "1"; }
}
function openOptionModal(item) {
	optionTargetItem = item;
	// 새 메뉴를 선택할 때마다 옵션들을 전부 기본값으로 초기화
	resetOptionFormToDefaults();
	updateOptionPrice();
	// 헤더 이미지/이름 설정
	if ($optItemImg) {
		$optItemImg.src = item.img || "placehold.png";
	}
	if ($optItemName) $optItemName.textContent = item.name;
	// 음료(ade) 카테고리에서는 HOT/ICED 선택을 숨김
	if ($segmented) {
		if (state.activeCategory === 'ade') {
			$segmented.style.display = 'none';
		} else {
			$segmented.style.display = '';
		}
	}
	$optionModal.hidden = false;
}
function closeOptionModal() {
	$optionModal.hidden = true;
	optionTargetItem = null;
}

function getOptionValues() {
	const formData = new FormData($optionForm);
	const temp = formData.get("temp") || "HOT";
	const extraShot = formData.get("extraShot") ? 1 : 0;
	const syrup = formData.get("syrup") ? 1 : 0;
	const light = formData.get("light") ? 1 : 0;
	const noIce = formData.get("noIce") ? 1 : 0;
	const tumbler = formData.get("tumbler") ? 1 : 0;
	const size = formData.get("size") || "TALL";
	const qty = Math.max(1, Number($optQty.value) || 1);
	return { temp, extraShot, syrup, light, noIce, tumbler, size, qty };
}

function calcOptionPrice(basePrice) {
	// 샷 +500, 시럽 +300, 사이즈 가산, 텀블러(과거) -300
	const { extraShot, syrup, tumbler, size, qty } = getOptionValues();
	let add = 0;
	if (extraShot) add += 500;
	if (syrup) add += 300;
	if (size === 'REGULAR') add += 300;
	if (size === 'LARGE') add += 600;
	if (tumbler) add -= 300;
	return (basePrice + add) * qty;
}

function updateOptionPrice() {
	if (!optionTargetItem) return;
	$optPrice.textContent = formatCurrencyKRW(calcOptionPrice(optionTargetItem.price));
}

// 10) 이벤트 바인딩
function attachEvents() {
	// 홈 버튼 → main.html 이동
	if ($btnHome) {
		$btnHome.addEventListener("click", () => {
			window.location.href = "main.html";
		});
	}

	// 화면 확대 버튼 → order-type.html 이동
	if ($btnZoom) {
		$btnZoom.addEventListener("click", () => {
			window.location.href = "order-type.html";
		});
	}
	// 탭 변경
	$tabs.forEach(tab => {
		tab.addEventListener("click", () => {
			$tabs.forEach(t => t.classList.remove("active"));
			tab.classList.add("active");
			state.activeCategory = tab.dataset.category;
			renderMenu();
			resetTimer();
		});
	});

	// 메뉴 카드를 클릭하면 옵션 모달 열기 (모든 카테고리 공통)
	$menuGrid.addEventListener("click", (e) => {
		const card = e.target.closest(".card");
		if (!card) return;
		const id = card.dataset.id;
		const name = card.dataset.name;
		const price = Number(card.dataset.price) || 0;
		const img = card.dataset.img;
		openOptionModal({ id, name, price, img });
	});

	// 장바구니 - 수량 추가 버튼
	$cartList.addEventListener("click", (e) => {
		const plusIndex = e.target.getAttribute("data-plus");
		const minusIndex = e.target.getAttribute("data-minus");
		if (plusIndex !== null) {
			const index = Number(plusIndex);
			const item = state.cartItems[index];
			if (!item) return;
			item.quantity += 1;
			renderCart();
			resetTimer();
			return;
		}
		if (minusIndex !== null) {
			const index = Number(minusIndex);
			const item = state.cartItems[index];
			if (!item) return;
			item.quantity -= 1;
			if (item.quantity <= 0) {
				// 수량이 0이면 해당 항목 제거
				state.cartItems.splice(index, 1);
			} 
			renderCart();
			resetTimer();
		}
	});

	// 전체삭제
	$btnClearAll.addEventListener("click", () => {
		if (state.cartItems.length === 0) return;
		clearCart();
		resetTimer();
	});

	// 선택 삭제
	// 선택 삭제 버튼이 없을 수 있으므로 안전하게 체크
	if ($btnRemoveSelected) {
		$btnRemoveSelected.addEventListener("click", () => {
			removeSelectedFromCart();
			resetTimer();
		});
	}

	// 결제 버튼 → 결제 방식 선택 모달 열기
	$btnPay.addEventListener("click", () => {
		const total = state.cartItems.reduce((sum, it) => sum + it.price * it.quantity, 0);
		if (total <= 0) {
			openModal("먼저 상품을 선택해 주세요.");
			return;
		}
		openPayMethodModal();
	});

	// 결제 방식 모달 버튼 동작들
	if ($btnPayCard) {
		$btnPayCard.addEventListener("click", () => {
			// 카드 결제 모달 열기
			if ($cardModal) {
				const total = state.cartItems.reduce((sum, it) => sum + it.price * it.quantity, 0);
				if ($cardTotalAmount) $cardTotalAmount.textContent = formatCurrencyKRW(total);
				$cardModal.hidden = false;
			}
		});
	}
	if ($btnPayCoupon) {
		$btnPayCoupon.addEventListener("click", () => {
			// 쿠폰 모달 열기
			if ($couponModal) {
				couponDiscount = 0;
				$couponNumber && ($couponNumber.value = "");
				$couponName && ($couponName.textContent = "-");
				$couponApplyAmount && ($couponApplyAmount.textContent = formatCurrencyKRW(0));
				if ($couponPayAmountEl) {
					const total = state.cartItems.reduce((s,i)=>s+i.price*i.quantity,0);
					$couponPayAmountEl.textContent = formatCurrencyKRW(total);
				}
				if ($payMethodModal) $payMethodModal.hidden = true;
				$couponModal.hidden = false;
			}
		});
	}
	if ($btnPayBack) {
		$btnPayBack.addEventListener("click", () => {
			closePayMethodModal();
		});
	}
	if ($payMethodModal) {
		$payMethodModal.addEventListener("click", (e) => {
			if (e.target === $payMethodModal) closePayMethodModal();
		});
	}

	// 카드 모달 동작
	if ($cardCloseX) {
		$cardCloseX.addEventListener('click', () => { if ($cardModal) $cardModal.hidden = true; });
	}
	if ($btnCardCancel) {
		$btnCardCancel.addEventListener('click', () => { if ($cardModal) $cardModal.hidden = true; });
	}
	if ($btnCardApprove) {
		$btnCardApprove.addEventListener('click', () => {
			const total = state.cartItems.reduce((sum, it) => sum + it.price * it.quantity, 0);
			if ($cardModal) $cardModal.hidden = true;
			closePayMethodModal();
			// 주문번호 생성: A + 4자리
			const num = 'A' + String(Math.floor(1000 + Math.random()*9000));
			if ($orderEndNumber) $orderEndNumber.textContent = num;
			if ($orderEndModal) $orderEndModal.hidden = false;
			clearCart();
			resetTimer();
			couponDiscount = 0;
			// 10초 후 자동 복귀
			setTimeout(() => { if ($orderEndModal && !$orderEndModal.hidden) window.location.href = 'main.html'; }, 10000);
		});
	}

// 주문 완료 모달 터치 시 메인으로 복귀
if ($orderEndModal) {
	$orderEndModal.addEventListener('click', () => { window.location.href = 'main.html'; });
}

	// 쿠폰 모달 동작
	if ($couponKeypad && $couponNumber) {
		$couponKeypad.addEventListener('click', (e) => {
			const btn = e.target.closest('button');
			if (!btn) return;
			const key = btn.getAttribute('data-key');
			const action = btn.getAttribute('data-action');
			if (key) {
				$couponNumber.value = ($couponNumber.value + key).slice(0, 20);
			}
			if (action === 'back') {
				$couponNumber.value = $couponNumber.value.slice(0, -1);
			}
			if (action === 'clear') {
				$couponNumber.value = "";
			}
		});
	}

	if ($couponQuery) {
		$couponQuery.addEventListener('click', () => {
			const num = ($couponNumber?.value || '').trim();
			const total = state.cartItems.reduce((s,i)=>s+i.price*i.quantity,0);
			if (num === '1111') {
				couponDiscount = Math.min(2000, total);
				if ($couponName) $couponName.textContent = '모바일 상품권';
			} else {
				couponDiscount = 0;
				if ($couponName) $couponName.textContent = '-';
			}
			if ($couponApplyAmount) $couponApplyAmount.textContent = formatCurrencyKRW(couponDiscount);
			if ($couponPayAmountEl) $couponPayAmountEl.textContent = formatCurrencyKRW(Math.max(0, total - couponDiscount));
		});
	}

	if ($couponUse) {
		$couponUse.addEventListener('click', () => {
			const total = state.cartItems.reduce((sum, it) => sum + it.price * it.quantity, 0);
			const final = Math.max(0, total - couponDiscount);
			if ($couponModal) $couponModal.hidden = true;
			if ($cardTotalAmount) $cardTotalAmount.textContent = formatCurrencyKRW(final);
			if ($cardModal) $cardModal.hidden = false;
		});
	}

	if ($couponCloseX) {
		$couponCloseX.addEventListener('click', () => {
			if ($couponModal) $couponModal.hidden = true;
		});
	}

	// 모달 닫기
	$modal.addEventListener("click", (e) => {
		if (e.target === $modal) closeModal();
	});
	$modalClose.addEventListener("click", closeModal);

	// 옵션 변경 시 즉시 가격 갱신
	[...$optionForm.elements].forEach(el => {
		el.addEventListener("change", updateOptionPrice);
		el.addEventListener("input", updateOptionPrice);
	});

	// 샷추가(optShot)와 연하게(optLight)는 둘 중 하나만 선택되게 처리
	// - 샷추가를 체크하면 연하게를 자동 해제
	// - 연하게를 체크하면 샷추가를 자동 해제
	const $chkShot = document.getElementById("optShot");
	const $chkLight = document.getElementById("optLight");
	if ($chkShot && $chkLight) {
		$chkShot.addEventListener("change", () => {
			if ($chkShot.checked) {
				$chkLight.checked = false;
				updateOptionPrice();
			}
		});
		$chkLight.addEventListener("change", () => {
			if ($chkLight.checked) {
				$chkShot.checked = false;
				updateOptionPrice();
			}
		});
	}

	// 수량 스테퍼
	$qtyMinus.addEventListener("click", () => {
		const cur = Math.max(1, Number($optQty.value) || 1);
		$optQty.value = String(Math.max(1, cur - 1));
		updateOptionPrice();
	});
	$qtyPlus.addEventListener("click", () => {
		const cur = Math.max(1, Number($optQty.value) || 1);
		$optQty.value = String(cur + 1);
		updateOptionPrice();
	});

	$optCancel.addEventListener("click", () => {
		closeOptionModal();
	});

	$optConfirm.addEventListener("click", () => {
		if (!optionTargetItem) return;
		const opts = getOptionValues();
		const priced = calcOptionPrice(optionTargetItem.price);
		// 장바구니에 옵션 표시를 위해 이름에 간단 표기 추가
		const optionNoteParts = [opts.temp];
		if (opts.extraShot) optionNoteParts.push("샷추가");
		if (opts.syrup) optionNoteParts.push("시럽");
		if (opts.light) optionNoteParts.push("연하게");
		if (opts.noIce) optionNoteParts.push("얼음빼기");
		if (opts.size) optionNoteParts.push(opts.size);
		// 텀블러 옵션은 제거됨
		const nameWithOption = `${optionTargetItem.name} (${optionNoteParts.join(', ')})`;

		// 동일 옵션은 한 줄로 합쳐 담기: 단가 * 수량 형태
		const qty = Math.max(1, Number(opts.qty) || 1);
		const unitPrice = priced / qty;
		const stableId = `${optionTargetItem.id}|${optionNoteParts.join('|')}|${unitPrice}`;

		// 기존 addToCart는 +1만 처리하므로 여기서 수량만큼 누적하도록 보조 루프 사용
		const existing = state.cartItems.find(it => it.id === stableId);
		if (existing) {
			existing.quantity += qty;
		} else {
			state.cartItems.push({ id: stableId, name: nameWithOption, price: unitPrice, quantity: qty });
		}
		renderCart();
		resetTimer();
		closeOptionModal();
	});
}

// 11) 시작 함수
function init() {
	if ($tabs && $tabs.length) {
		$tabs.forEach(t => t.classList.toggle("active", t.dataset.category === state.activeCategory));
	}
	renderMenu();
	renderCart();
	attachEvents();
	startTimer();
}

// DOM이 준비되면 시작
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", init);
} else {
	init();
}


