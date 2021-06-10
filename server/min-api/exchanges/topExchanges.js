import { TOP_EXCHANGES } from '../../config';
import { get } from "../get";

const topExchanges = (req, res) => {
  const { crypto = 'BTC', limit = 10 } = req.query;
  return get(`${TOP_EXCHANGES}?fsym=${crypto}&tsym=USD&limit=${limit}`)
      .then(({ Data: { Exchanges }}) => (res.send({exchanges: Exchanges})));
}

export { topExchanges }

