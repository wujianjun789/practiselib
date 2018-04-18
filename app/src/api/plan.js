import {HOST_IP, getHttpHeader, httpRequest} from '../util/network';

/**
 *  通过策略类型获取策略列表
 * @param type(0:时钟计划，1:经纬度计划)
 */
export function getStrategyList(type, cb) {
  let headers = getHttpHeader();
  let param = {'where':{'type':type}};
  let paramStr = JSON.stringify(param);
  let url = HOST_IP + '/plans?filter=' + encodeURIComponent(paramStr);

  httpRequest(url, {
    headers: headers,
    method: 'GET',
  }, response => {
    cb && cb(response);
  });
}

/**
 * 添加策略
 */
export function addStrategy(data, cb) {
  let headers = getHttpHeader();
  httpRequest(HOST_IP + '/plans', {
    headers: headers,
    method: 'POST',
    body: JSON.stringify(data),
  }, response => {
    cb && cb(response);
  });
}

/**
 * 获取所有未分组的策略
 */
export function getNoGroupStrategy(type, cb) {
  let headers = getHttpHeader();
  httpRequest(HOST_IP + '/plans?filter=' + encodeURIComponent(
    JSON.stringify({'where':{'groupId':null, 'type':type}})), {
    headers:headers,
    method: 'GET',
  }, response => {
    cb && cb(response);
  });    
}

/**
 * 删除策略
 * @param id
 */
export function delStrategy(id, cb) {
  let headers = getHttpHeader();
  httpRequest(HOST_IP + '/plans/' + id, {
    headers: headers,
    method: 'DELETE',
  }, response => {
    cb && cb(response);
  });
}

/**
 * 修改策略
 * @param data
 */
export function updateStrategy(data, cb) {
  let headers = getHttpHeader();
  httpRequest(HOST_IP + '/plans/' + data.id, {
    headers: headers,
    method: 'PATCH',
    body: JSON.stringify(data),
  }, response => {
    cb && cb(response);
  });
}

/**
 * 获取所有分组
 */
export function getGroupList(type, cb) {
  let headers = getHttpHeader();
  httpRequest(HOST_IP + '/planGroups?filter=' + encodeURIComponent(JSON.stringify(
    {'where':{'type':type}})), {
    headers:headers,
    method: 'GET',
  }, response => {
    cb && cb(response);
  });
}

/**
 * 获取所有分组以及分组下的策略
 */
export function getGroupListPlan(type, cb) {
  let headers = getHttpHeader();
  httpRequest(HOST_IP + '/planGroups?filter=' + encodeURIComponent(JSON.stringify(
    {'include':['plans'], 'where':{'type':type}})), {
    headers:headers,
    method: 'GET',
  }, response => {
    cb && cb(response);
  });
}

/**
 * 通过计划id获取计划
 * @param {*} id 
 * @param {*} cb 
 */
export function getPlanById(id, cb) {
  let headers = getHttpHeader();
  httpRequest(HOST_IP + '/plans/'+id, {
    headers:headers,
    method: 'GET',
  }, response => {
    cb && cb(response);
  });
}

/**
 * 添加分组
 */
export function addGroup(data, cb) {
  let headers = getHttpHeader();
  httpRequest(HOST_IP + '/planGroups', {
    headers: headers,
    method: 'POST',
    body: JSON.stringify(data),
  }, response => {
    cb && cb();
  });
}

/**
 * 删除分组
 */
export function delGroup(id, cb) {
  let headers = getHttpHeader();
  httpRequest(HOST_IP + '/planGroups/' + id, {
    headers: headers,
    method: 'DELETE',
  }, response => {
    cb && cb(response);
  });
}

export function updateGroup(data, cb) {
  let headers = getHttpHeader();
  httpRequest(HOST_IP + '/planGroups/' + data.id, {
    headers: headers,
    method: 'PATCH',
    body: JSON.stringify(data),
  }, response => {
    cb && cb(response);
  });
}

export function getPlanStatus(id, cb) {
  let headers = getHttpHeader();
  httpRequest(HOST_IP + '/plans/' + id + '/status', {
    headers:headers,
    method: 'GET',
  }, response => {
    cb && cb(response);
  });
}

export function startPlan(id, cb) {
  let headers = getHttpHeader();
  httpRequest(`${HOST_IP}/plans/${id}/enable`, {
    headers:headers,
    method: 'PUT',
  }, response => {
    cb && cb();
  });
}

export function pausePlan(id, cb) {
  let headers = getHttpHeader();
  httpRequest(`${HOST_IP}/plans/${id}/disable`, {
    headers:headers,
    method: 'PUT',
  }, response => {
    cb && cb();
  });
}