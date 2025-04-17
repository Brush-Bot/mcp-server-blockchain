import Binance from "node-binance-api";

const binance = new Binance().options({
  APIKEY: process.env.API_KEY,
  APISECRET: process.env.SECRET_KEY,
  test: true,
});

export default binance;
