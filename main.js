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

// Build an 'original' deck of 'card' objects used to create shuffled decks
const originalDeck = buildOriginalDeck();

/*----- app's state (variables) -----*/
let shuffledDeck = [];
let player = {
  balance: 100,
  cards: [],
  win: false,
  bet: 0,
};
let betOptions = [1, 5, 10, 25, 50, 100];

/*----- cached element references -----*/
let balanceEl = document.getElementById("balance-value");
balanceEl.innerText = player.balance;

let dealButtonEl = document
  .getElementById("deal-button")
  .addEventListener("click", handleDeal);

let betOptionsEl = document.getElementById("bet-options");
betOptionsEl.innerHTML = betOptions;

/*----- event listeners -----*/
function handleDeal() {
  balanceEl.innerText = player.balance;
}

/*----- functions -----*/
// Reshuffle shuffledDeck
function getNewShuffledDeck() {
  // Create a copy of the originalDeck (leave originalDeck untouched!)
  const tempDeck = [...originalDeck];
  let newShuffledDeck = [];
  while (tempDeck.length) {
    // Get a random index for a card still in the tempDeck
    const rndIdx = Math.floor(Math.random() * tempDeck.length);
    // Note the [0] after splice - this is because splice always returns an array and we just want the card object in that array
    newShuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]);
  }
  shuffledDeck = newShuffledDeck;
  return shuffledDeck;
}
//Built the deck
function buildOriginalDeck() {
  const deck = [];
  // Use nested forEach to generate card objects
  suits.forEach(function (suit) {
    ranks.forEach(function (rank) {
      deck.push({
        // The 'face' property maps to the library's CSS classes for cards
        face: `${suit}${rank}`,
        // Setting the 'value' property for game of blackjack, not war
        value: Number(rank) || (rank === "A" ? 11 : 10),
      });
    });
  });
  return deck;
}
buildOriginalDeck();
