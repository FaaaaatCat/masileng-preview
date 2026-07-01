// 베이스주별 재료 데이터
const INGREDIENTS_BY_BASE = {
  "럼": [
    { emoji: "🍾", name: "화이트 럼", type: "술(약한 도수)", abvStr: "40.0%", amount: "45ml" },
    { emoji: "🍋", name: "라임 주스", type: "주스", abvStr: null, amount: "30ml" },
    { emoji: "🍯", name: "슈거 시럽", type: "시럽", abvStr: null, amount: "15ml" },
    { emoji: "🌿", name: "민트잎", type: "가니쉬", abvStr: null, amount: "적당량" },
    { emoji: "🧊", name: "얼음", type: "기타", abvStr: null, amount: "적당량" },
  ],
  "보드카": [
    { emoji: "🍸", name: "보드카", type: "술(약한 도수)", abvStr: "40.0%", amount: "45ml" },
    { emoji: "🍊", name: "트리플 섹", type: "리큐르", abvStr: "30.0%", amount: "20ml" },
    { emoji: "🍋", name: "라임 주스", type: "주스", abvStr: null, amount: "15ml" },
    { emoji: "🧊", name: "얼음", type: "기타", abvStr: null, amount: "적당량" },
  ],
  "위스키": [
    { emoji: "🥃", name: "버번 위스키", type: "술(강한 도수)", abvStr: "47.4%", amount: "45ml" },
    { emoji: "🍷", name: "스위트 베르무트", type: "술(약한 도수)", abvStr: "18.0%", amount: "30ml" },
    { emoji: "💧", name: "앙고스투라 비터스", type: "비터스", abvStr: null, amount: "2dash" },
    { emoji: "🍊", name: "오렌지 필", type: "가니쉬", abvStr: null, amount: "1개" },
    { emoji: "🧊", name: "얼음", type: "기타", abvStr: null, amount: "적당량" },
  ],
  "진": [
    { emoji: "🌿", name: "드라이 진", type: "술(강한 도수)", abvStr: "40.0%", amount: "45ml" },
    { emoji: "🍸", name: "드라이 베르무트", type: "술(약한 도수)", abvStr: "18.0%", amount: "15ml" },
    { emoji: "🫒", name: "올리브", type: "가니쉬", abvStr: null, amount: "2개" },
    { emoji: "🧊", name: "얼음", type: "기타", abvStr: null, amount: "적당량" },
  ],
  "데킬라": [
    { emoji: "🌵", name: "실버 데킬라", type: "술(강한 도수)", abvStr: "38.0%", amount: "45ml" },
    { emoji: "🍊", name: "트리플 섹", type: "리큐르", abvStr: "30.0%", amount: "20ml" },
    { emoji: "🍋", name: "라임 주스", type: "주스", abvStr: null, amount: "30ml" },
    { emoji: "🧂", name: "소금", type: "기타", abvStr: null, amount: "적당량" },
    { emoji: "🧊", name: "얼음", type: "기타", abvStr: null, amount: "적당량" },
  ],
  "브랜디": [
    { emoji: "🍷", name: "브랜디", type: "술(강한 도수)", abvStr: "40.0%", amount: "45ml" },
    { emoji: "🍋", name: "레몬 주스", type: "주스", abvStr: null, amount: "25ml" },
    { emoji: "🍯", name: "슈거 시럽", type: "시럽", abvStr: null, amount: "15ml" },
    { emoji: "🧊", name: "얼음", type: "기타", abvStr: null, amount: "적당량" },
  ],
  "소주": [
    { emoji: "🍶", name: "소주", type: "술(약한 도수)", abvStr: "25.0%", amount: "45ml" },
    { emoji: "🍑", name: "복숭아 주스", type: "주스", abvStr: null, amount: "60ml" },
    { emoji: "🫧", name: "탄산수", type: "탄산", abvStr: null, amount: "적당량" },
    { emoji: "🧊", name: "얼음", type: "기타", abvStr: null, amount: "적당량" },
  ],
};

// 테마별 레시피 스텝
const STEPS_BY_THEME = {
  "Sour": [
    "셰이커에 얼음을 가득 채웁니다.",
    "모든 재료를 순서대로 셰이커에 넣습니다.",
    "20초간 힘차게 셰이킹합니다.",
    "스트레이너로 걸러 칠드된 잔에 따릅니다.",
    "레몬 필이나 체리로 가니쉬하여 완성합니다.",
  ],
  "Party": [
    "큰 잔에 얼음을 가득 채웁니다.",
    "베이스 주류를 먼저 붓습니다.",
    "리큐르와 믹서를 순서대로 추가합니다.",
    "가볍게 저어 재료를 섞습니다.",
    "과일 슬라이스로 화려하게 장식하여 완성합니다.",
  ],
  "Sparkling": [
    "잔에 얼음을 채웁니다.",
    "베이스 재료와 리큐르를 먼저 넣습니다.",
    "탄산음료를 잔 가득 조심스럽게 따릅니다.",
    "탄산이 날아가지 않도록 살짝만 저어줍니다.",
    "레몬 웨지나 민트로 장식하여 완성합니다.",
  ],
  "City": [
    "믹싱 글라스에 얼음을 채웁니다.",
    "모든 재료를 계량하여 넣습니다.",
    "바 스푼으로 30회 천천히 저어줍니다.",
    "스트레이너로 걸러 차가운 칵테일 잔에 따릅니다.",
    "오렌지 필이나 체리로 우아하게 가니쉬합니다.",
  ],
  "Tropical": [
    "믹서에 얼음과 모든 재료를 넣습니다.",
    "부드럽게 갈아 슬러시 상태로 만듭니다.",
    "허리케인 잔이나 큰 잔에 담습니다.",
    "파인애플 슬라이스와 체리로 화려하게 장식합니다.",
    "빨대를 꽂아 열대 칵테일의 분위기를 완성합니다.",
  ],
  "Fruity": [
    "셰이커에 얼음과 재료를 모두 넣습니다.",
    "15초간 잘 흔들어 줍니다.",
    "얼음이 채워진 잔에 스트레이너로 걸러 따릅니다.",
    "신선한 과일로 화사하게 가니쉬합니다.",
    "즉시 제공하여 신선한 과일향을 즐깁니다.",
  ],
  "Creamy": [
    "셰이커에 얼음을 가득 채웁니다.",
    "크림과 리큐르를 계량하여 넣습니다.",
    "베이스 주류를 추가합니다.",
    "충분히 흔들어 크림이 잘 섞이도록 합니다.",
    "차가운 잔에 걸러 담고 시나몬 파우더를 뿌려 완성합니다.",
  ],
  "Hot": [
    "잔을 뜨거운 물로 예열합니다.",
    "따뜻한 물 또는 핫 믹서를 잔에 먼저 붓습니다.",
    "베이스 주류와 리큐르를 추가합니다.",
    "가볍게 저어 잘 섞어줍니다.",
    "생크림이나 시나몬 스틱으로 마무리합니다.",
  ],
};

// 테마별 맛 프로필
const FLAVOR_BY_THEME = {
  "Sour":     { sweet: 2, sour: 4, bitter: 2, body: 2 },
  "Party":    { sweet: 3, sour: 2, bitter: 1, body: 2 },
  "Sparkling":{ sweet: 3, sour: 3, bitter: 1, body: 1 },
  "City":     { sweet: 1, sour: 1, bitter: 3, body: 4 },
  "Tropical": { sweet: 4, sour: 2, bitter: 1, body: 2 },
  "Fruity":   { sweet: 4, sour: 3, bitter: 1, body: 1 },
  "Creamy":   { sweet: 4, sour: 1, bitter: 1, body: 4 },
  "Hot":      { sweet: 3, sour: 1, bitter: 2, body: 3 },
};

// 난이도 코드별 텍스트
const DIFFICULTY_LABEL = ["보통", "쉬움", "보통", "중급", "고급"];

// 태그 생성
export function getCardTags(card) {
  const tags = [];
  if (card.abv === 0) tags.push("#무알콜");
  else if (card.abv <= 15) tags.push("#낮은 도수");
  else tags.push("#높은 도수");

  if (card.base) {
    const bases = Array.isArray(card.base) ? card.base : [card.base];
    bases.forEach((b) => tags.push(`#${b} 베이스`));
  }
  if (card.theme) tags.push(`#${card.theme}`);
  if (card.iba) tags.push("#IBA");

  return tags;
}

export function getCardDetail(card) {
  const ingredients = (card.ingredients ?? []).map((ing) => {
    if (typeof ing === "object" && ing !== null) {
      return { emoji: "🍸", name: ing.name, type: "", abvStr: null, amount: ing.amount ?? "적당량" };
    }
    return { emoji: "🍸", name: ing, type: "", abvStr: null, amount: "적당량" };
  });
  const steps =
    card.steps?.length > 0
      ? card.steps
      : STEPS_BY_THEME[card.theme] ?? STEPS_BY_THEME["City"];
  const flavor = FLAVOR_BY_THEME[card.theme] ?? { sweet: 2, sour: 2, bitter: 2, body: 2 };
  const abvLabel = card.abv > 0 ? `약 ${card.abv}%` : "0%";
  const difficulty = DIFFICULTY_LABEL[card.difficulty ?? 0] ?? "보통";

  return { ingredients, steps, flavor, abvLabel, difficulty };
}
