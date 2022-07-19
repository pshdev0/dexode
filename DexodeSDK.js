/* global BigInt */

import { ConstructionOutlined } from "@mui/icons-material";

const throttledQueue = require("throttled-queue");

export class DexodeSdk {
  apiExplorer = undefined;
  coinGeckoAPICall = undefined;
  verbose = undefined;

  constructor(maxCallsPerSecond, verbose) {
    // singleton class
    if (DexodeSdk.singleton) return DexodeSdk.singleton;
    this.apiExplorer = throttledQueue(maxCallsPerSecond, 1000); // maxCalls (usually 5) per 1000ms
    this.apiGecko = throttledQueue(1, 2400); // gecko api is 50 / minutes, but this varies so let's make it much lower
    DexodeSdk.singleton = this;
    this.verbose = verbose;
    return DexodeSdk.singleton;
  }

  async sleep(millis) {
    return await new Promise((resolve) => setTimeout(resolve, millis)); // wait a while
  }

  async callExplorer(url, success, error) {
    return await this.apiExplorer(async () => {
      return fetch(url)
        .then((x) => x.json())
        .then((json) => {
          if (!json) return error("No JSON object returned.");
          if (!json.message) return error("No result returned.");
          if (!json.message.toLowerCase() === "ok") return json.message;
          if (success) success(json);
          return json;
        })
        .catch((e) => {
          if (error) error(e);
          return undefined;
        });
    });
  }

  async callGecko(url, success, error) {
    return await this.apiGecko(async () => {
      return fetch(url)
        .then((x) => x.json())
        .then((json) => json)
        .catch((e) => {
          console.log("ERROR:", e);
          if (error) error(e);
          return undefined;
        });
    });
  }

  getTransactionStatus(chain, hash, success, error) {
    let url =
      chain.url +
      "api?module=transaction&action=gettxreceiptstatus&txhash=" +
      hash +
      "&apikey=" +
      chain.apiKey;

    return this.callExplorer(url, success, error);
  }

  getHighestKnownBlock(array) {
    // array should be an array, each element of which contains a field "block"
    if (array.length === 0) return 0;
    var block = Number(
      array.reduce((a, b) => (Number(a.block) > Number(b.block) ? a : b)).block
    );
    if (!block) return 0;
    return block;
  }

  getNormalTransactionsByAddress(chain, address, startBlock, success, error) {
    // returns the "normal" transactions corresponding to an address
    // e.g. these are the transactions you might find in metamask
    // activity list

    let url =
      chain.url +
      "api?module=account&action=txlist&address=" +
      address +
      "&startblock=" +
      startBlock +
      "&sort=asc&apikey=" +
      chain.apiKey;

    return this.callExplorer(url, success, error);
  }

  getInternalTransactionsByAddress(chain, address, startBlock, success, error) {
    // returns the "internal" transactions corresponding to a tx hash

    let url =
      chain.url +
      "api?module=account&action=txlistinternal&address=" +
      address +
      "&startblock=" +
      startBlock +
      "&apikey=" +
      chain.apiKey;

    return this.callExplorer(url, success, error);
  }

  getInternalTransactionsByHash(chain, hash, success, error) {
    // returns the "internal" transactions corresponding to a tx hash

    let url =
      chain.url +
      "api?module=account&action=txlistinternal&txhash=" +
      hash +
      "&apikey=" +
      chain.apiKey;

    return this.callExplorer(url, success, error);
  }

  getTokenTransfersByAddress(chain, address, startBlock, success, error) {
    // return token transfers corresponding to the given address
    // the txHash of each row can be mapped to thetxHash of the
    // rows returned by getNormal or GetInternal transactions

    let url =
      chain.url +
      "api?module=account&action=tokentx&address=" +
      address +
      "&startblock=" +
      startBlock +
      "&sort=desc&apikey=" +
      chain.apiKey;

    if (this.verbose) console.log(url);

    return this.callExplorer(url, success, error);
  }

  async sendTokenToAddress(
    web3,
    tokenAddress,
    fromAddress,
    toAddress,
    decimals,
    amount
  ) {
    let minABI = [
      // transfer
      {
        constant: false,
        inputs: [
          {
            name: "_to",
            type: "address",
          },
          {
            name: "_value",
            type: "uint256",
          },
        ],
        name: "transfer",
        outputs: [
          {
            name: "",
            type: "bool",
          },
        ],
        type: "function",
      },
    ];

    let contract = new web3.eth.Contract(minABI, tokenAddress);
    let value = BigInt(amount) * BigInt(10) ** BigInt(decimals);

    var tx = {
      from: fromAddress,
      to: contract._address,
      data: contract.methods.transfer(toAddress, value.toString()).encodeABI(),
      gas: 22000,
    };
    web3.eth
      .sendTransaction(tx)
      .then((res) => {
        console.log("res", res);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }

  async getContractBalance(web3, tokenAddress, walletAddress, blocks) {
    // this function requires connection to an Archive Node !

    // The minimum ABI required to get the ERC20 Token balance

    const minABI = [
      // balanceOf
      {
        constant: true,
        inputs: [{ name: "_owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "balance", type: "uint256" }],
        type: "function",
      },
    ];

    const contract = new web3.eth.Contract(minABI, tokenAddress);

    if (!blocks) {
      const value = await contract.methods.balanceOf(walletAddress).call();
      return [value];
    }

    var result = [];

    for (var c1 = 0; c1 < blocks.length; c1++) {
      var block = Number(blocks[c1]);

      if (this.verbose)
        console.log(
          "Fetching price of " +
            tokenAddress +
            " at block " +
            block +
            " (0x" +
            block.toString(16) +
            ")"
        );

      const value = await contract.methods
        .balanceOf(walletAddress)
        .call({}, "0x" + block.toString(16));

      result.push(value);

      await new Promise((r) => setTimeout(r, 1000));
    }

    return result;

    // const format = web3.utils.fromWei(result); // 29803630.997051883414242659
  }

  async searchForTokenInfo(str, success = undefined, error = undefined) {
    // searches CoinGeck for coin details
    let url = "https://api.coingecko.com/api/v3/search?query=" + str;
    return await this.callGecko(url, success, error);
  }

  async getHistoricCoinPrices(
    geckoCoinId,
    timeStampsArray,
    inCurrency = "usd"
  ) {
    timeStampsArray = timeStampsArray.sort();

    var from = timeStampsArray[0] - 10000;
    var to = timeStampsArray[timeStampsArray.length - 1] + 10000;

    var url = "https://api.coingecko.com/api/v3/coins/" + geckoCoinId;
    url += "/market_chart/range?vs_currency=" + inCurrency;
    url += "&from=" + from;
    url += "&to=" + to;

    var prices = await fetch(url)
      .then((response) => response.json())
      .then((json) => json)
      .catch((error) => {
        console.log(error);
        return undefined;
      });

    if (!prices || prices.prices.length === 0) return undefined;

    var rtn = {};

    for (var c1 = 0; c1 < timeStampsArray.length; c1++) {
      let timeStamp = timeStampsArray[c1];
      let reqTime = timeStamp * 1000; // switch from seconds to millis

      var np = prices.prices.sort(
        (x, y) => Math.abs(x[0] - reqTime) - Math.abs(y[0] - reqTime)
      );
      np = np.slice(0, 2).reverse();

      // linearly approximate price between the two timestamps
      let t1 = np[0][0];
      let t2 = np[1][0];
      let p1 = np[0][1];
      let p2 = np[1][1];

      let lambda = (reqTime - t1) / (t2 - t1);

      if (lambda < 0) lambda = 0;
      if (lambda > 1) lambda = 1;

      rtn[timeStamp] = p1 + lambda * (p2 - p1);
    }

    return rtn;
  }

  normalise(number, decimals) {
    number = number === undefined ? "0" : number.toString();
    decimals = Number(decimals); // decimals is usually a string

    var rtn;

    if (number === "0") return "0";
    else if (number.length === decimals) rtn = "0." + number;
    else if (number.length > decimals)
      rtn =
        number.slice(0, number.length - decimals) +
        "." +
        number.slice(number.length - decimals);
    else if (number.length < decimals)
      rtn = "0." + "0".repeat(decimals - number.length) + number;
    else {
      console.log("Error!");
      console.log(typeof number);
      console.log(number.length, decimals);
      return "Error! " + number;
    }

    rtn = rtn.replace(/0*$/, ""); // remove trailing zeros
    if (rtn.slice(-1) === ".") return rtn.replace(".", ""); // if it ends with a . remove it

    return rtn;
  }
}
