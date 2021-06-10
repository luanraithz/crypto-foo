import axios from "axios";
import { MIN_API_URL } from '../config';

export const get = (url) => {
	const endpoint = `${MIN_API_URL}${url}`
	return axios.get(endpoint, { headers: { "Authorization": `Apikey ${process.env.MIN_API_TOKEN}` } }).then(x => x.data)
}