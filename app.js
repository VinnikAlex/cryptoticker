let grid = document.querySelector("#crypto-grid");
let coins = 10;

let showMore = document.querySelector("#show-more");

//currency convertor/formatter
const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  notation: "compact",
});

const numberStyle = new Intl.NumberFormat("en-US", {
  style: "decimal",
});

// load top 10 marketcap coins
requestApi();
requestCoinRanking();

function requestCoinRanking() {
  fetch("https://coinranking1.p.rapidapi.com/stats", {
    method: "GET",
    headers: {
      "x-rapidapi-host": "coinranking1.p.rapidapi.com",
      "x-rapidapi-key": "93b53fd986msh44a95fbb6e42559p104f53jsna297e577f5ff",
    },
  })
    .then((response) => response.json())
    .then((result) => coinRank(result))
    .catch((err) => {
      console.error(err);
    });
}

function coinRank(info) {
  console.log(info);
  let volume = document.querySelector("#volume");
  let totalCoins = document.querySelector("#total-coins");
  let totalExchange = document.querySelector("#total-exchange");
  let totalMarketCap = document.querySelector("#total-market-cap");
  let totalMarkets = document.querySelector("#total-markets");

  volume.innerHTML = formatter.format(info.data.total24hVolume);
  totalCoins.innerHTML = numberStyle.format(info.data.totalCoins);
  totalExchange.innerHTML = numberStyle.format(info.data.totalExchanges);
  totalMarketCap.innerHTML = formatter.format(info.data.totalMarketCap);
  totalMarkets.innerHTML = numberStyle.format(info.data.totalMarkets);
}

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

  // number of crypto coins / 4 rows
  let numColumns = info.length / 4;
  // specify number of columns depending on how many coins are showing
  grid.style.gridTemplateRows = `repeat(${numColumns}, 1fr)`;

  // add the name to the cryptoName div
  for (let i = 0; i < info.length; i++) {
    document.querySelector("#cryptoName" + [i]).innerHTML +=
      i + 1 + "." + " " + info[i].symbol.toUpperCase();
    // add the image to the cryptoImage div
    document.querySelector("#cryptoImage" + [i]).src = info[i].image;
    // add the price to the cryptoPrice div
    document.querySelector("#cryptoPrice" + [i]).innerHTML =
      "Price:" + " " + "$" + info[i].current_price;
    // add the marketcap to the cryptoCap div
    document.querySelector("#cryptoCap" + [i]).innerHTML =
      "Market Cap:" + " " + formatter.format(info[i].market_cap);
    // add the daily change to the cryptoChange div
    let cryptoChange = document.querySelector("#cryptoChange" + [i]);
    // check for dailyChange
    if (info[i].price_change_percentage_24h > 0) {
      cryptoChange.innerHTML =
        "Daily Change:" +
        " " +
        "+" +
        info[i].price_change_percentage_24h.toFixed(2) +
        "%";
      cryptoChange.style.color = "green";
    } else if (info[i].price_change_percentage_24h < 0) {
      cryptoChange.innerHTML =
        "Daily Change:" +
        " " +
        info[i].price_change_percentage_24h.toFixed(2) +
        "%";
      cryptoChange.style.color = "red";
    } else {
      cryptoChange.innerHTML =
        "Daily Change:" +
        " " +
        info[i].price_change_percentage_24h.toFixed(2) +
        "%";
      cryptoChange.style.color = "black";
    }

    //gradually loads live ticker as time progresses
    let coinType = info[i].symbol;
    let lastPrice = 0;
    let ws = new WebSocket(
      "wss://stream.binance.com:9443/ws/" + coinType + "busd@trade"
    );

    ws.onmessage = (event) => {
      let stockObject = JSON.parse(event.data);
      let price = parseFloat(stockObject.p);
      document.querySelector("#cryptoPrice" + [i]).innerText =
        "Price:" + " " + "$" + parseFloat(stockObject.p);
      // change colour
      document.querySelector("#cryptoPrice" + [i]).style.color =
        !lastPrice || lastPrice === price
          ? "black"
          : price > lastPrice
          ? "green"
          : "red";

      lastPrice = price;
    };
  }
}

function addDivs(info) {
  console.log(info.length);
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

  // removeDivs(info);
}

// function removeDivs(info) {
//   showMore.addEventListener("click", (e) => {
//     for (let i = 0; i < info.length; i++) {
//       grid.removeChild(grid.childNodes[0]);
//       coins++;
//       console.log("OKOK" + info.length);
//     }

//     requestApi();
//   });
// }
