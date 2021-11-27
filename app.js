let userInput = document.querySelector("#search");
let userSearch = document.querySelector("#searchCoin");

// let cryptoContainer = document.querySelector("#crypto-container");

let vetPriceElement = document.querySelector("#vet");
let lastPrice = null;

userSearch.addEventListener("click", () => {
  console.log("YAY!");
  requestApi();
});

function requestApi() {
  let api = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false`;
  fetch(api)
    .then((response) => response.json())
    .then((result) => cryptoDetails(result));
}

function cryptoDetails(info) {
  info.forEach((element) => {
    document.querySelector("#crypto-list").innerHTML += element.symbol + " ";
    console.log(element);
  });
}

// function updateCoinPair() {
//   vet.onmessage = (event) => {
//     let cryptoObject = JSON.parse(event.data);
//     //return VET price to 6 decimal points
//     let vetPrice = parseFloat(cryptoObject.p).toFixed(6);
//     vetPriceElement.innerText = "$" + vetPrice;

//     //change colour depending on if price goes up/down/stays the same.
//     vetPriceElement.style.color =
//       !lastPrice || lastPrice === vetPrice
//         ? "black"
//         : vetPrice > lastPrice
//         ? "green"
//         : "red";

//     lastPrice = vetPrice;

//     console.log(cryptoObject);
//   };
// }
