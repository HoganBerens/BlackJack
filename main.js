/*----- constants -----*/
const suits = ["s", "c", "d", "h"];
const ranks = [
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "J",
  "Q",
  "K",
  "A",
];

const originalDeck = buildOriginalDeck();

/*----- app's state (variables) -----*/
let shuffledDeck = [];

let dealer = {
  cards: [],
  total: [],
  numsTotal: 0,
};

let player = {
  balance: 100,
  cards: [],
  win: false,
  currentBet: 0,
  totalBet: 0,
  total: [],
  numsTotal: 0,
};

let betOptions = [1, 10, 25, 100, 500];

/*----- cached element references -----*/
let renderEl = document.getElementById("conditional-page-render");

let dealEl = document.getElementById("show-during-hand");

let betEl = document.getElementById("show-between-hands");

let balanceEl = document.getElementById("balance-value");
balanceEl.innerText = player.balance;

let dealButtonEl = document
  .getElementById("deal-button")
  .addEventListener("click", handleDeal);

let betOptionsContainerEl = document.getElementById("bet-options");

let betTextEl = document.getElementById("bet-title");

let betErrorEl = document.getElementById("bet-error");

let betPromptEl = document.getElementById("show-between-hands");

let betForHandEl = document.getElementById("bet-for-hand");

let dealerCardsEl = document.getElementById("dealer-cards");

let playerCardsEl = document.getElementById("player-cards");

let playerTotalEl = document.getElementById("player-total");

let dealerTotalEl = document.getElementById("dealer-total");

let hitButtonEl = document
  .getElementById("hit-button")
  .addEventListener("click", handleHit);

let standButtonEl = document
  .getElementById("stand-button")
  .addEventListener("click", handleStand);

/*----- event listeners -----*/

function handleHit() {
  console.log(player, dealer);
}

function handleStand() {
  console.log(player, dealer);
}

function handleDeal() {
  if (player.totalBet === 0) {
    betTextEl.innerText = "Please select bet";
  } else {
    getNewShuffledDeck();
    balanceEl.innerText = player.balance - player.totalBet;
    dealEl.style.display = "flex";
    betEl.style.display = "none";
    betForHandEl.innerText = player.totalBet;
    giveCards();
    createCardTotal(player.total, player, playerTotalEl);
    createCardTotal(dealer.total, dealer, dealerTotalEl);
    setCardTotal();
  }
}

function handleBet(event) {
  let text = JSON.parse(event.target.textContent);
  if (player.totalBet + text > player.balance) {
    betErrorEl.innerText = "Not enough Money";
    return;
  } else {
    betErrorEl.innerText = "";
    player.currentBet = text;
    player.totalBet = player.totalBet + player.currentBet;
    player.currentBet = 0;

    betTextEl.innerText = `Total Bet: ${player.totalBet}`;
  }
}

/*----- functions -----*/

function setCardTotal() {
  dealerTotalEl.innerText = `(${dealer.numsTotal})`;
  playerTotalEl.innerText = `(${player.numsTotal})`;
}

function createCardTotal(arr, person, totalEl) {
  let total = arr.reduce((partialSum, a) => partialSum + a, 0);
  person.numsTotal = total;
}

function giveCards() {
  player.cards.push(getRandomCard());
  player.cards.push(getRandomCard());
  createCard(player.cards, playerCardsEl, player.total);
  dealer.cards.push(getRandomCard());
  createCard(dealer.cards, dealerCardsEl, dealer.total);
}

function createCard(arr, element, numArr) {
  let cardsHtml = "";
  arr.forEach(function (card) {
    cardsHtml += `<div class="card ${card.face}"></div>`;
    numArr.push(card.value);
  });
  element.innerHTML = cardsHtml;
}

function getRandomCard() {
  let randomCard =
    shuffledDeck[Math.floor(Math.random() * shuffledDeck.length)];
  return randomCard;
}

function getNewShuffledDeck() {
  const tempDeck = [...originalDeck];
  let newShuffledDeck = [];
  while (tempDeck.length) {
    const rndIdx = Math.floor(Math.random() * tempDeck.length);

    newShuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]);
  }
  shuffledDeck = newShuffledDeck;
  return shuffledDeck;
}

function buildOriginalDeck() {
  const deck = [];
  suits.forEach(function (suit) {
    ranks.forEach(function (rank) {
      deck.push({
        face: `${suit}${rank}`,
        value: Number(rank) || (rank === "A" ? 11 : 10),
      });
    });
  });
  return deck;
}

betOptions.map((betOption, betOptionIndex) => {
  let betOptionEl = document.createElement("div");
  betOptionEl.innerText = betOptions[betOptionIndex];
  betOptionEl.setAttribute("id", betOptionIndex);
  betOptionEl.className = "bet-option";
  betOptionEl.addEventListener("click", handleBet);
  betOptionsContainerEl.appendChild(betOptionEl);
});

buildOriginalDeck();
