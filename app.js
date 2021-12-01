let grid = document.querySelector("#crypto-grid");
let coins = 10;

let showMore = document.querySelector("#show-more");

// load top 10 marketcap coins
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
  // specify number of columns depending on how many coins are showing
  grid.style.gridTemplateRows = `repeat(${numColumns}, 1fr)`;

  // add the name to the cryptoName div
  for (let i = 0; i < info.length; i++) {
    document.querySelector("#cryptoName" + [i]).innerHTML +=
      i + 1 + "." + " " + info[i].symbol;
    // add the image to the cryptoImage div
    document.querySelector("#cryptoImage" + [i]).src = info[i].image;
    // add the price to the cryptoPrice div
    document.querySelector("#cryptoPrice" + [i]).innerHTML =
      "Price:" + " " + "$" + info[i].current_price;
    // add the marketcap to the cryptoCap div
    document.querySelector("#cryptoCap" + [i]).innerHTML =
      "Market Cap:" + " " + info[i].market_cap;
    // add the daily change to the cryptoChange div
    document.querySelector("#cryptoChange" + [i]).innerHTML =
      "Daily Change:" + " " + info[i].price_change_percentage_24h;
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

    //create an img tag for crptocoin image
    let cryptoImage = document.createElement("img");
    cryptoImage.setAttribute("id", "cryptoImage" + i);
    div.appendChild(cryptoImage);

    //create p tag for crypto price
    let cryptoPrice = document.createElement("p");
    cryptoPrice.setAttribute("id", "cryptoPrice" + i);
    div.appendChild(cryptoPrice);

    //create p tag for crypto marketcap
    let cryptoCap = document.createElement("p");
    cryptoCap.setAttribute("id", "cryptoCap" + i);
    div.appendChild(cryptoCap);

    //create p tag for 24h daily change (percentage)
    let cryptoChange = document.createElement("p");
    cryptoChange.setAttribute("id", "cryptoChange" + i);
    div.appendChild(cryptoChange);
  }
  removeElements(info);
}

function removeElements(info) {
  showMore.addEventListener("click", (e) => {
    for (let i = 0; i < info.length; i++) {
      grid.removeChild(grid.childNodes[0]);
    }
    coins = 100;
    requestApi();
  });
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
