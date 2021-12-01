let grid = document.querySelector("#crypto-grid");
let coins = 24;

requestApi();

function requestApi() {
  let api = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${coins}&page=1&sparkline=false`;
  fetch(api)
    .then((response) => response.json())
    .then((result) => cryptoDetails(result));
}

function cryptoDetails(info) {
  console.log(info);
  //call addDivs() and pass api information into it
  addDivs(info);

  // specify how many rows are required:
  // number of crypto coins / 4 rows
  let numColumns = info.length / 4;
  // specify number of columns dependant on how many coins are showing
  grid.style.gridTemplateRows = `repeat(${numColumns}, 1fr)`;

  // add the name to the cryptoName div
  for (let i = 0; i < info.length; i++) {
    document.querySelector("#cryptoName" + [i]).innerHTML +=
      i + 1 + "." + " " + info[i].symbol;

    document.querySelector("#cryptoImage" + [i]).src = info[i].image;
  }
}

function addDivs(info) {
  //loop through every api index and add div to every crypto token
  for (let i = 0; i < info.length; i++) {
    //create a div for every crypto coin
    let div = document.createElement("div");
    // create class name "div" + i to make each div unique
    div.setAttribute("id", "div" + i);
    grid.appendChild(div);

    //create a div to store each cryptos name
    let nameHeading = document.createElement("h3");
    nameHeading.setAttribute("id", "cryptoName" + i);
    div.appendChild(nameHeading);

    let cryptoImage = document.createElement("img");
    cryptoImage.setAttribute("id", "cryptoImage" + i);
    div.appendChild(cryptoImage);
  }
}

// function addContent(index) {
//   div[index].innerHTML += info.symbol;
// }

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
