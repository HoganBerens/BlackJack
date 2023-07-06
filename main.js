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
  availableBalance: 0,
  balance: 100,
  cards: [],
  currentBet: 0,
  totalBet: 0,
  total: [],
  numsTotal: 0,
  lost: false,
  won: false,
  bust: false,
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

let backOfCardImgEl = document.getElementById("back-of-card");

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

let showAfterHandEl = document.getElementById("show-after-hand");

let resultsEl = document.getElementById("results");

/*----- event listeners -----*/

function handleHit() {
  player.cards.push(getRandomCard());
  createCard(player.cards, playerCardsEl, player.total);
  player.numsTotal = player.numsTotal + player.total[player.total.length - 1];
  playerTotalEl.innerText = `(${player.numsTotal})`;
  if (player.numsTotal > 21) {
    playerTotalEl.innerText = "Bust! " + player.numsTotal;
    handlePlayerBust();
  }
}

function handleStand() {
  backOfCardImgEl.style.display = "none";
  if (dealer.numsTotal < 17) {
    dealer.cards.push(getRandomCard());
    createCard(dealer.cards, dealerCardsEl, dealer.total);
    dealer.numsTotal = dealer.numsTotal + dealer.total[dealer.total.length - 1];
    dealerTotalEl.innerText = `(${dealer.numsTotal})`;
    if (dealer.numsTotal > 21) {
      handlePlayerWon();
    } else if (dealer.numsTotal < 17) {
      setTimeout(handleStand, 1000);
    } else if (player.numsTotal === dealer.numsTotal) {
      handlePush();
    } else if (player.numsTotal > dealer.numsTotal) {
      handlePlayerWon();
    } else {
      handlePlayerLost();
    }
  } else {
    if (dealer.numsTotal > 21) {
      handlePlayerWon();
    } else if (player.numsTotal === dealer.numsTotal) {
      handlePush();
    } else if (player.numsTotal > dealer.numsTotal) {
      handlePlayerWon();
    } else {
      handlePlayerLost();
    }
  }
}

function handleDeal() {
  if (player.totalBet === 0) {
    betTextEl.innerText = "Please select bet";
  } else {
    getNewShuffledDeck();
    player.availableBalance = player.balance - player.totalBet;
    balanceEl.innerText = player.availableBalance;
    dealEl.style.display = "flex";
    betEl.style.display = "none";
    betForHandEl.innerText = player.totalBet;
    giveCards();
    createCardTotal(player.total, player, playerTotalEl);
    createCardTotal(dealer.total, dealer, dealerTotalEl);
    setCardTotal();
    if (player.numsTotal === 21) {
      setTimeout(handleBlackjack, 1000);
    }
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

function handleBlackjack() {
  showAfterHandEl.style.display = "flex";
  player.balance = player.totalBet * 3 + player.availableBalance;
  player.totalBet = 0;
  resultsEl.innerHTML = `Blackjack! You won ${
    player.balance - availableBalance
  }`;

  setTimeout(backToStart, 4000);
}

function backToStart() {
  showAfterHandEl.style.display = "none";
  dealEl.style.display = "none";
  betEl.style.display = "flex";
  balanceEl.innerText = player.balance;
  betTextEl.innerText = "Select Bet";
  dealer.cards = [];
  dealer.total = [];
  dealer.numsTotal = 0;
  player.total = [];
  player.numsTotal = 0;
  player.lost = false;
  player.won = false;
  player.cards = [];
  player.totalBet = 0;
  backOfCardImgEl.style.display = "flex";
}

function handleEndOfHand() {
  showAfterHandEl.style.display = "flex";
  if (player.lost === true) {
    resultsEl.innerHTML = `Dealer won! Player: ${player.numsTotal}  Dealer: ${dealer.numsTotal}`;
    setTimeout(backToStart, 4000);
  } else if (player.won === true) {
    resultsEl.innerHTML = `You won! Player: ${player.numsTotal} Dealer: ${dealer.numsTotal}`;
    setTimeout(backToStart, 4000);
  } else if (player.bust === true) {
    resultsEl.innerHTML = `You Busted!`;
    setTimeout(backToStart, 4000);
  } else {
    resultsEl.innerHTML = `Push, you both had ${player.numsTotal}`;
    setTimeout(backToStart, 4000);
  }
}

function handlePush() {
  setTimeout(handleEndOfHand, 2000);
  player.balance = player.totalBet + player.availableBalance;
}

function handlePlayerWon() {
  setTimeout(handleEndOfHand, 2000);
  player.balance = player.totalBet * 2 + player.availableBalance;
  player.totalBet = 0;
  player.won = true;
}
function handlePlayerBust() {
  setTimeout(handleEndOfHand, 2000);
  player.totalBet = 0;
  player.balance = player.availableBalance;
  player.bust = true;
}

function handlePlayerLost() {
  setTimeout(handleEndOfHand, 2000);
  player.totalBet = 0;
  player.balance = player.availableBalance;
  player.lost = true;
}

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
