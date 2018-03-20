import _ from 'lodash';
import { HOST_IP, getHttpHeader, httpRequest } from '../util/network';

// export function getHistoriesDataByAssetId(options) {
// 	let _url = `${HOST_IP}/histories`;
// 	_url += `?filter=${encodeURIComponent(JSON.stringify(options))}`;
// 	return fetch(_url, {
// 		headers: getHttpHeader(),
// 		method: 'GET'
// 	})
// 		.then(res => res.json());
// }

//统计-照明
export function getStatDeviceCount(domain,cb) {
	if(domain.id===6){
		if(!domain){
			return;
		}
		//模拟实现
		console.log('发起请求')
		setTimeout(() => {
		  const res = {
			count: 500,
			inline: 380,
			outline: 120,
			normal: 410,
			fault: 90
		  };
		  cb && cb(res)
		}, 300)
  }else{
	if(!domain){
		return;
	}
	//模拟实现
	console.log('发起请求')
	setTimeout(() => {
	  const res = {
		count: 1000,
		inline: 680,
		outline: 320,
		normal: 590,
		fault: 410
	  };
	  cb && cb(res)
	}, 300)
  }
}


export function getHistoriesDataInDevice(mode, currentId, queryList, start, end, type, list, name, cb) {
	const _querystring = JSON.stringify({
		where: {
			[mode]: currentId,
			or: queryList,
			timestamp: {
				between: [start, end]
			}
		}
	});
	const querystring = `/histories?filter=${_querystring}`;
	httpRequest(HOST_IP + querystring, {
		headers: getHttpHeader(),
		method: 'GET'
	}, response => {
		if(!response.length){
			cb&&cb('请求的数据为空');
			return;
		}
		const _obj = _.groupBy(response, (item) => {
			return item[type]
		})
		const _data = [];
		const _arr = Object.keys(_obj);
		_arr.forEach(item => {
			let _item = {
				name: list[item][name],
				values: _obj[item]
			}
			_data.push(_item)
		})
		console.log(_data)
		cb && cb(_data)
	}, undefined, err => {
		console.log(err)
	})
}

export function getHistoriesDataInStat(mode, id, start, end, name, cb) {
	const _querystring = JSON.stringify({
		where: {
			dateTime: {
				between: [start, end]
			}
		}
	})
	const querystring = `/${mode}/${id}/statistic?filter=${_querystring}`
	httpRequest(HOST_IP + querystring, {
		headers: getHttpHeader(),
		method: 'GET'
	}, response => {
		if(!response.length){
			cb&&cb('请求的数据为空');
			return;
		}
		const _data = [];
		const _response = response.map(item => {
			return {
				timestamp: item["dateTime"],
				value: item.value
			}
		})
		const _obj = {
			name: name,
			values: _response
		};
		_data.push(_obj);
		cb && cb(_data)
	}, undefined, err => {
		console.log(err)
	})
}