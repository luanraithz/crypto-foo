import {
  CRYPTOCOMPARE_WEBSITE,
  TOP_EXCHANGES,
  MIN_API_URL
} from '../../config';
import {
  getSymbol
} from '../../utils/Symbol';
import { get } from '../get';

const cryptoInfoAndExchanges = async (req, res) => {
  const {
    crypto = "BTC", symbol = 'USD', limit = 10
  } = req.query;
  const {
    Data: {
      Exchanges,
      CoinInfo
    }
  } = await get(`${TOP_EXCHANGES}/full?fsym=${crypto}&tsym=${symbol}&limit=${limit}`);

  if (!CoinInfo) {
    res.send({
      error: true,
      errorType: 'INFO_NOT_FOUND',
      message: 'There is not info about this cryptocurrency'
    })
  } else if (!Exchanges || !Exchanges.length) {
    res.send({
      error: true,
      errorType: 'NONE_EXCHANGE_FOUND',
      message: 'There is not info about this cryptocurrency',
      coinInfo: {
        name: CoinInfo.Name,
        displayName: CoinInfo.FullName,
        imageUrl: `${CRYPTOCOMPARE_WEBSITE}${CoinInfo.ImageUrl}`,
        overviewUrl: `${CRYPTOCOMPARE_WEBSITE}${CoinInfo.Url}`,
        totalCoinsMined: CoinInfo.TotalCoinsMined
      }
    })
  } else {
    res.send({
      exchanges: (Exchanges || []).map(market => ({
        name: market.MARKET,
        price: `${getSymbol(market.TOSYMBOL)} ${Number(market.PRICE).toFixed(2)}`,
        lastUpdate: new Date(market.LASTUPDATE),
        highLast24Hours: market.HIGH24HOUR
      })),
      coinInfo: {
        name: CoinInfo.Name,
        displayName: CoinInfo.FullName,
        imageUrl: `${CRYPTOCOMPARE_WEBSITE}${CoinInfo.ImageUrl}`,
        overviewUrl: `${CRYPTOCOMPARE_WEBSITE}${CoinInfo.Url}`,
        totalCoinsMined: CoinInfo.TotalCoinsMined
      }
    })
  }
}

export {
  cryptoInfoAndExchanges
};