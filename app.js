let grid = document.querySelector("#crypto-grid");
let coins = 100;

let topCoinsText = document.querySelector("#show-coins");
let cryptoCount = 10;
topCoinsText.innerHTML = cryptoCount;

// show more button
let showMore = document.querySelector("#show-more");

//currency convertor/formatter
const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  notation: "compact",
});

// number style formatter
const numberStyle = new Intl.NumberFormat("en-US", {
  style: "decimal",
});

//nav-bar colour change

//mobile navbar show/hide behaviour
{
  const nav = document.querySelector(".sidebar");
  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    if (lastScrollY < window.scrollY) {
      nav.classList.add("nav--hidden");
      //   console.log(lastScrollY);
    } else {
      nav.classList.remove("nav--hidden");
      //   console.log(lastScrollY);
    }

    lastScrollY = window.scrollY;
  });
}

// show website navigation on hamburger icon click (in mobile)
{
  let hamburgerMenu = document.querySelector(".hamburger-menu");
  let xMenu = document.querySelector(".x-menu");
  let navMenu = document.querySelector(".mobile-navbar");
  let navContent = document.querySelector(".menu-items");

  hamburgerMenu.addEventListener("click", () => {
    console.log("CLICK!");
    // sidebar.style.height = "100%";
    navMenu.style.height = "100vh";
    hamburgerMenu.style.display = "none";
    xMenu.style.display = "block";
    navContent.style.display = "flex";
  });

  xMenu.addEventListener("click", () => {
    navMenu.style.height = "100%";
    hamburgerMenu.style.display = "block";
    xMenu.style.display = "none";
    navContent.style.display = "none";
  });

  // encountered bugs on rezising mobile to desktop view, this fixed it:
  window.addEventListener("resize", function () {
    if (window.matchMedia("(min-width: 1500px)").matches) {
      console.log("Screen width is at least 1500px");
      navMenu.style.height = "100vh";
      hamburgerMenu.style.display = "none";
      xMenu.style.display = "none";
      navContent.style.display = "flex";
    } else {
      console.log("Screen less than 1500px");
      navMenu.style.height = "100%";
      hamburgerMenu.style.display = "block";
      xMenu.style.display = "none";
      navContent.style.display = "none";
    }
  });
}

// load top 10 marketcap coins on application start
window.onload = function () {
  requestApi();
  requestCoinRanking();
};

// coinranking api
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

// insert coinranking api data into application
function coinRank(info) {
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

// coingecko api
function requestApi() {
  let api = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${coins}&page=1&sparkline=false`;
  fetch(api)
    .then((response) => response.json())
    .then((result) => cryptoDetails(result)) //.length = 10
    .catch((err) => {
      console.error(err);
    });
}

// use coingecko api in application
function cryptoDetails(info) {
  //call addDivs() and pass api information into it
  addDivs(info);

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

    //websocket
    let coinType = info[i].symbol;
    let lastPrice = 0;
    let ws = new WebSocket(
      "wss://stream.binance.com:9443/ws/" + coinType + "busd@trade"
    );

    ws.onmessage = (event) => {
      let stockObject = JSON.parse(event.data);
      let price = parseFloat(stockObject.p);
      //changes api price to live price
      document.querySelector("#cryptoPrice" + [i]).innerText =
        "Live Price:" + " " + "$" + parseFloat(stockObject.p);
      // change colour
      document.querySelector("#cryptoPrice" + [i]).style.color =
        !lastPrice || lastPrice === price
          ? "black"
          : price > lastPrice
          ? "green"
          : "red";

      lastPrice = price;
    };

    // check for dailyChange and display it as red OR green percentage
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

    // webSocket(info);
  }
}

// // websocket function
// function webSocket(info) {
//   for (let i = 0; i < info.length; i++) {
//     //gradually loads live ticker as time progresses
//     let coinType = info[i].symbol;
//     let lastPrice = 0;
//     let ws = new WebSocket(
//       "wss://stream.binance.com:9443/ws/" + coinType + "busd@trade"
//     );

//     ws.onmessage = (event) => {
//       let stockObject = JSON.parse(event.data);
//       let price = parseFloat(stockObject.p);
//       //changes api price to live price
//       document.querySelector("#cryptoPrice" + [i]).innerText =
//         "Price:" + " " + "$" + parseFloat(stockObject.p);
//       // change colour
//       document.querySelector("#cryptoPrice" + [i]).style.color =
//         !lastPrice || lastPrice === price
//           ? "black"
//           : price > lastPrice
//           ? "green"
//           : "red";

//       lastPrice = price;
//     };
//   }
// }

// function that adds divs into gridbox and supplementary tags about coin information.
function addDivs(info) {
  //loop through every api index and add div to every crypto token
  for (let i = 0; i < info.length; i++) {
    //create a div for every crypto coin
    let div = document.createElement("div");

    // create class name "div" + i to make each div unique
    div.setAttribute("id", "div" + i);
    grid.appendChild(div);

    //create a h3 to store each cryptos name
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
  //after loop run this function
  hideDiv(info);
}

// hides all cryptocurrencies which aren't supposed to show before user clicks "show more"
function hideDiv(info) {
  for (let i = cryptoCount; i < info.length; i++) {
    let selectDiv = document.querySelector("#div" + i);
    // hide divs that arent supposed to show
    selectDiv.style.display = "none";
  }

  // update the "top 10 cryptocurrencies" text on button click"
  showMore.addEventListener("click", (e) => {
    if (cryptoCount < 100) {
      // add 10 to this variable each click
      cryptoCount += 10;
      topCoinsText.innerHTML = cryptoCount;
      //run this function
      showDiv();
    }
  });
}

// function which is called inside of hideDiv() and shows the next 10 crypto coins on button click
function showDiv() {
  for (let i = cryptoCount - 1; i >= 0; i--) {
    let selectDiv = document.querySelector("#div" + i);
    selectDiv.style.display = "block";
  }
}
