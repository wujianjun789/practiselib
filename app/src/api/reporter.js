import {HOST_IP, getHttpHeader, httpRequest} from '../util/network';
/**
 * @param {{
 *
 * }}
 */
export function getHistoriesDataByAssetId(options) {
	let _url = `${HOST_IP}/histories`;
	_url += `?filter=${encodeURIComponent(JSON.stringify(options))}`;
	return fetch(_url, {
		headers: getHttpHeader(),
		method: 'GET'
	})
	.then(res => res.json());
}
