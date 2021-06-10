import axios from 'axios';
import { MIN_API_URL, COIN_LIST } from '../../config';
import { get } from '../get';

export const allCurrencies = async (_req, res) => {

  const { Data } = await get(COIN_LIST);
  res.send({
    coins: Object.entries(Data).map(([_key, value]) => {
      return {
        name: value.Name,
        displayName: value.FullName
      }
    })
  });
}