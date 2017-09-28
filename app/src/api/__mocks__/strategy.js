/**
 * Created by a on 2017/8/17.
 */
import {HOST_IP, getHttpHeader, httpRequest} from '../../util/network';

/**
 *  通过策略类型和名字获取策略列表
 * @param model(时间、传感器、经纬度策略)
 * @param name
 * @param offset
 * @param limit
 */
export function getStrategyListByName(model,name,offset, limit, cb) {
	let response;
	const sensorRes = [
		{"name":"风速传感器1","type":"sensor","expire":{"expireRange":[],"executionRange":[],"week":0},"asset":"lc","strategy":[{"condition":{"windSpeed":"1"},"rpc":{"value":"0","title":"亮度0"}},{"condition":{"windSpeed":"2"},"rpc":{"value":"20","title":"亮度20"}},{"condition":{"windSpeed":"3"},"rpc":{"value":"70","title":"亮度70"}},{"condition":{"windSpeed":"4"},"rpc":{"value":"30","title":"亮度30"}},{"condition":{"windSpeed":"5"},"rpc":{"value":"70","title":"亮度70"}}],"id":1},
		{"name":"风速传感器2","type":"sensor","expire":{"expireRange":[],"executionRange":[],"week":0},"asset":"lc","strategy":[{"condition":{"windSpeed":"2"},"rpc":{"value":"30","title":"亮度30"}},{"condition":{"windSpeed":"3"},"rpc":{"value":"60","title":"亮度60"}}],"id":2}
	];
	switch(model) {
		case 'sensor':
			response = sensorRes;
			break;
		default:
			response = [];
	}
	cb && cb(response);
}

/**
 *  通过策略类型和名字获取策略数量
 * @param model(时间、传感器、经纬度策略)
 * @param name
 * @param cb
 */
export function getStrategyCountByName(model, name, cb) {
	let response;
	const sensorRes = {"count": 2};
	switch(model) {
		case 'sensor':
			response = sensorRes;
		default:
			response = {"count": 0};
	}
	cb && cb(response);
}

function getStrategyParam(model,name) {
    let param = {}
    if(model){
        Object.assign(param, {type:model});
    }

    if(name){
        Object.assign(param, {"name":{"like":name}})
    }

    return param;
}

/**
 * 添加策略
 * @param data
 */
export function addStrategy(data, cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/strategies',{
        headers: headers,
        method: 'POST',
        body: JSON.stringify(data)
    }, response=>{
        cb && cb(response);
    })
}

/**
 * 修改策略
 * @param data
 */
export function updateStrategy(data, cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/strategies/'+data.id,{
        headers: headers,
        method: 'PUT',
        body: JSON.stringify(data)
    }, response=>{
        cb && cb(response);
    })
}

/**
 * 删除策略
 * @param id
 */
export function delStrategy(id, cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/strategies/'+id,{
        headers: headers,
        method: 'DELETE'
    }, response=>{
        cb && cb(response);
    })
}

/**
 *  通过AssetControls获取设备
 * @param prop
 * @param mode
 * @param value
 */

export function getDeviceByAssetControls(prop, mode, value, cb) {
    let headers = getHttpHeader();
    let param = {};
    if(prop){
        param = Object.assign({}, param, {prop:prop});
    }
    if(mode){
        param = Object.assign({}, param, {mode:mode});
    }
    if(value){
        param = Object.assign({}, param, {value:value});
    }
    param ={where:param};
    let paramStr = JSON.stringify(param);
    httpRequest(HOST_IP+'/AssetControls?filter='+encodeURIComponent(paramStr),{
        headers:headers,
        method:"GET"
    },response=>{
        cb && cb(response, value);
    })
}

/**
 * 添加设备到策略
 * @param data
 */
export function addDeviceToStrategy(data, cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/AssetControls',{
        headers: headers,
        method: "POST",
        body: JSON.stringify(data)
    }, response=>{
        cb && cb(response);
    })
}

/**
 * 更新策略绑定设备
 * @param data
 */
export function updateDeviceToStrategy(data, cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/AssetControls',{
        headers: headers,
        method: "PUT",
        body: JSON.stringify(data)
    }, response=>{
        cb && cb(response);
    })
}
