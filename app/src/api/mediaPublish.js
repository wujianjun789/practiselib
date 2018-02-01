/**
 * Created by a on 2017/10/19.
 */
import { /*HOST_IP,*/ getHttpHeader, httpRequest } from '../util/network';
const HOST_IP = 'http://192.168.155.196:3002/api';
import { HeadBar } from '../components/HeadBar';

//上传文件
// export function uploadMaterialFile(type, file) {

//     const url = 'http://192.168.155.207:3000/api/containers/common/upload';

//     const form = new FormData();
//     form.append('file', file);

//     const xhr = new XMLHttpRequest();
//     xhr.upload.addEventListener('progress',uploadProgress,false);
//     // xhr.addEventListener('load',uploadComplete,false);
//     // xhr.addEventListener('error',uploadFail,false);
//     // xhr.addEventListener('abort',uploadCancel,false)

//     xhr.open('POST',url,true);
//     xhr.send(form)

//     function uploadProgress(e){
//         if(e.lengthComputable){
//             const progress=Math.round((e.loaded/e.total)*100);
//             console.log(progress);
//         }
//     }
// }

//播放方案
export function searchProjectList(type, projectName, offset, limit, cb) {
  let headers = getHttpHeader();
  let obj = Object.assign({}, { 'where': getProjectParam(type, projectName)}, { 'offset': offset, 'limit': limit });

  let param = JSON.stringify(obj);
  let url = HOST_IP + '/projects?filter=' + encodeURIComponent(param);
  httpRequest(url, {
    headers: headers,
    method: 'GET',
  }, response => {
    cb && cb(response);
  });
}

function getProjectParam(type, projectName) {
  let param = {};
  if (type) {
    param = Object.assign(param, {type: type});
  }

  if (projectName) {
    param = Object.assign(param, { name: { like: projectName } });
  }

  return param;
}

export function getProjectByName(type, projectName, cb) {
  let headers = getHttpHeader();
  let obj = { };
  if (projectName) {
    obj = Object.assign({ 'where': { type: type, name: { like: projectName } } }, obj);
  }

  let param = JSON.stringify(obj);
  let url = HOST_IP + '/projects?filter=' + encodeURIComponent(param);
  httpRequest(url, {
    headers: headers,
    method: 'GET',
  }, response => {
    cb && cb(response);
  });
}

export function getProjectList(cb) {
  let headers = getHttpHeader();

  let url = HOST_IP + '/projects';
  httpRequest(url, {
    headers: headers,
    method: 'GET',
  }, response => {
    cb && cb(response);
  });
}

export function getProjectById(data, cb) {
  let headers = getHttpHeader();

  let url = HOST_IP + '/projects/' + data.id;
  httpRequest(url, {
    headers: headers,
    method: 'GET',
  }, response => {
    cb && cb(response);
  });
}

export function getProjectPreviewById(data, cb) {
  let headers = getHttpHeader();

  let url = HOST_IP + '/projects/' + data.id + '/preview';
  httpRequest(url, {
    headers: headers,
    method: 'GET',
  }, response => {
    cb && cb(response);
  });
}


export function addProject(data, cb) {
  let headers = getHttpHeader();

  let url = HOST_IP + '/projects';
  httpRequest(url, {
    headers: headers,
    method: 'POST',
    body: JSON.stringify(data),
  }, response => {
    cb && cb(response);
  });
}

export function updateProjectById(data, cb) {
  let headers = getHttpHeader();

  let url = HOST_IP + '/projects/' + data.id;
  httpRequest(url, {
    headers: headers,
    method: 'PATCH',
    body: JSON.stringify(data),
  }, response => {
    cb && cb(response);
  });
}

export function removeProjectById(id, cb) {
  let headers = getHttpHeader();

  let url = HOST_IP + '/projects/' + id;
  httpRequest(url, {
    headers: headers,
    method: 'DELETE',
  }, response => {
    cb && cb(response);
  });
}

//播放表
export function getProgramList(projectId, cb) {
  let headers = getHttpHeader();

  let url = HOST_IP + '/projects/' + projectId + '/programs';
  httpRequest(url, {
    headers: headers,
    method: 'GET',
  }, response => {
    cb && cb(response);
  });
}

export function getProgramById(projectId, id, cb) {
  let headers = getHttpHeader();

  let url = HOST_IP + '/projects/' + projectId + '/programs/' + id;
  httpRequest(url, {
    headers: headers,
    method: 'GET',
  }, response => {
    cb && cb(response);
  });
}

export function addProgram(projectId, data, cb) {
  let headers = getHttpHeader();

  httpRequest(HOST_IP + '/projects/' + projectId + '/programs', {
    headers: headers,
    method: 'POST',
    body: JSON.stringify(data),
  }, response => {
    cb && cb(response);
  });
}

export function updateProgramById(projectId, data, cb) {
  let headers = getHttpHeader();

  httpRequest(HOST_IP + '/projects/' + projectId + '/programs/' + data.id, {
    headers: headers,
    method: 'PUT',
    body: JSON.stringify(data),
  }, response => {
    cb && cb(response);
  });
}

export function updateProgramOrders(projectId, data, cb) {
  let headers = getHttpHeader();

  httpRequest(HOST_IP + '/projects/' + projectId + '/orders', {
    headers: headers,
    method: 'POST',
    body: JSON.stringify(data),
  }, response => {
    cb && cb(response);
  });
}

export function removeProgramsById(projectId, id, cb) {
  let headers = getHttpHeader();

  httpRequest(HOST_IP + '/projects/' + projectId + '/programs/' + id, {
    headers: headers,
    method: 'DELETE',
  }, response => {
    cb && cb(response);
  });
}

//场景
export function getSceneList(projectId, programId, cb) {
  let headers = getHttpHeader();
  httpRequest(HOST_IP + '/projects/' + projectId + '/programs/' + programId + '/scenes', {
    headers: headers,
    method: 'GET',
  }, response => {
    cb && cb(response);
  });
}

export function getSceneById(projectId, programId, id, cb) {
  let headers = getHttpHeader();
  httpRequest(HOST_IP + '/projects/' + projectId + '/programs/' + programId + '/scenes/' + id, {
    headers: headers,
    method: 'GET',
  }, response => {
    cb && cb(response);
  });
}

export function addScene(projectId, programId, data, cb) {
  let headers = getHttpHeader();
  httpRequest(HOST_IP + '/projects/' + projectId + '/programs/' + programId + '/scenes', {
    headers: headers,
    method: 'POST',
    body: JSON.stringify(data),
  }, response => {
    cb && cb(response);
  });
}

export function updateSceneById(projectId, programId, data, cb) {
  let headers = getHttpHeader();
  httpRequest(HOST_IP + '/projects/' + projectId + '/programs/' + programId + '/scenes/' + data.id, {
    headers: headers,
    method: 'PUT',
    body: JSON.stringify(data),
  }, response => {
    cb && cb(response);
  });
}

export function updateSceneOrders(projectId, programId, data, cb) {
  let headers = getHttpHeader();

  httpRequest(HOST_IP + '/projects/' + projectId + '/programs/' + programId + '/orders', {
    headers: headers,
    method: 'POST',
    body: JSON.stringify(data),
  }, response => {
    cb && cb(response);
  });
}

export function removeSceneById(projectId, programId, id, cb) {
  let headers = getHttpHeader();
  httpRequest(HOST_IP + '/projects/' + projectId + '/programs/' + programId + '/scenes/' + id, {
    headers: headers,
    method: 'DELETE',
  }, response => {
    cb && cb(response);
  });
}

//区域
export function getZoneList(projectId, programId, sceneId, cb) {
  let headers = getHttpHeader();
  httpRequest(HOST_IP + '/projects/' + projectId + '/programs/' + programId + '/scenes/' + sceneId + '/zones', {
    headers: headers,
    method: 'GET',
  }, response => {
    cb && cb(response);
  });
}

export function getZoneById(projectId, programId, sceneId, id, cb) {
  let headers = getHttpHeader();
  httpRequest(HOST_IP + '/projects/' + projectId + '/programs/' + programId + '/scenes/' + sceneId + '/zones/' + id, {
    headers: headers,
    method: 'GET',
  }, response => {
    cb && cb(response);
  });
}

export function addZone(projectId, programId, sceneId, data, cb) {
  let headers = getHttpHeader();
  httpRequest(HOST_IP + '/projects/' + projectId + '/programs/' + programId + '/scenes/' + sceneId + '/zones', {
    headers: headers,
    method: 'POST',
    body: JSON.stringify(data),
  }, response => {
    cb && cb(response);
  });
}

export function updateZoneById(projectId, programId, sceneId, data, cb) {
  let headers = getHttpHeader();
  httpRequest(HOST_IP + '/projects/' + projectId + '/programs/' + programId + '/scenes/' + sceneId + '/zones/' + data.id, {
    headers: headers,
    method: 'PUT',
    body: JSON.stringify(data),
  }, response => {
    cb && cb(response);
  });
}

export function updateZoneOrders(projectId, programId, sceneId, data, cb) {
  let headers = getHttpHeader();
  httpRequest(HOST_IP + '/projects/' + projectId + '/programs/' + programId + '/scenes/' + sceneId + '/orders', {
    headers: headers,
    method: 'POST',
    body: JSON.stringify(data),
  }, response => {
    cb && cb(response);
  });
}

export function removeZoneById(projectId, programId, sceneId, id, cb) {
  let headers = getHttpHeader();
  httpRequest(HOST_IP + '/projects/' + projectId + '/programs/' + programId + '/scenes/' + sceneId + '/zones/' + id, {
    headers: headers,
    method: 'DELETE',
  }, response => {
    cb && cb(response);
  });
}

//播放项
export function getItemList(projectId, programId, sceneId, zoneId, cb) {
  let headers = getHttpHeader();
  httpRequest(HOST_IP + '/projects/' + projectId + '/programs/' + programId + '/scenes/' + sceneId + '/zones/' + zoneId + '/items', {
    headers: headers,
    method: 'GET',
  }, response => {
    cb && cb(response);
  });
}

export function getItembyId(projectId, programId, sceneId, zoneId, id, type, cb) {
  let headers = getHttpHeader();
  httpRequest(HOST_IP + '/projects/' + projectId + '/programs/' + programId + '/scenes/' + sceneId + '/zones/' + zoneId + '/items/' + id + '?itemType=' + type, {
    headers: headers,
    method: 'GET',
  }, response => {
    cb && cb(response);
  });
}

export function getItemPreviewbyId(id, cb) {
  let headers = getHttpHeader();
  httpRequest(HOST_IP + '/items/' + id + '/preview', {
    headers: headers,
    method: 'GET',
  }, response => {
    cb && cb(response);
  });
}

export function addItem(projectId, programId, sceneId, zoneId, itemType, data, cb) {
  let headers = getHttpHeader();
  httpRequest(HOST_IP + '/projects/' + projectId + '/programs/' + programId + '/scenes/' + sceneId + '/zones/' + zoneId + '/items?itemType=' + itemType, {
    headers: headers,
    method: 'POST',
    body: JSON.stringify(data),
  }, response => {
    cb && cb(response);
  });
}

export function updateItemById(projectId, programId, sceneId, zoneId, data, cb) {
  let headers = getHttpHeader();
  httpRequest(HOST_IP + '/projects/' + projectId + '/programs/' + programId + '/scenes/' + sceneId + '/zones/' + zoneId + '/items/' + data.baseInfo.id + '?itemType=' + data.baseInfo.type, {
    headers: headers,
    method: 'PUT',
    body: JSON.stringify(data),
  }, response => {
    cb && cb(response);
  });
}

export function updateItemOrders(projectId, programId, sceneId, zoneId, data, cb) {
  let headers = getHttpHeader();
  httpRequest(HOST_IP + '/projects/' + projectId + '/programs/' + programId + '/scenes/' + sceneId + '/zones/' + zoneId + '/orders', {
    headers: headers,
    method: 'POST',
    body: JSON.stringify(data),
  }, response => {
    cb && cb(response);
  });
}

export function removeItemById(projectId, programId, sceneId, zoneId, id, itemType, cb) {
  let headers = getHttpHeader();
  httpRequest(HOST_IP + '/projects/' + projectId + '/programs/' + programId + '/scenes/' + sceneId + '/zones/' + zoneId + '/items/' + id + '?itemType=' + itemType, {
    headers: headers,
    method: 'DELETE',
  }, response => {
    cb && cb(response);
  });
}

//素材库
const FILE_HOST_IP = 'http://192.168.155.196:3001/api';
export function getAssetList(cb) {
  let headers = getHttpHeader();
  httpRequest(FILE_HOST_IP + '/file', {
    headers: headers,
    method: 'GET',
  }, response => {
    cb && cb(response);
  });
}

export function searchAssetList(type, name, offset, limit, cb) {
  let headers = getHttpHeader();
  let obj = Object.assign({}, { 'where': getAssetParam(type, name)}, { 'offset': offset, 'limit': limit });

  let param = JSON.stringify(obj);
  let url = FILE_HOST_IP + '/file?filter=' + encodeURIComponent(param);
  httpRequest(url, {
    headers: headers,
    method: 'GET',
  }, response => {
    cb && cb(response);
  });
}

function getAssetParam(type, name) {
  let param = {};
  // if(type){
  //     param = Object.assign(param, {type: type});
  // }

  if (name) {
    param = Object.assign(param, { name: { like: name }});
  }

  return param;
}
/**
 *
 * @param data({"id": "string",
                    "name": "string",
                    "fingerprint": "string",
                    "filepath": "string",
                    "size": 0})
 * @param cb
 */
export function addAsset(data, cb) {
  let headers = getHttpHeader();
  httpRequest(FILE_HOST_IP + '/file', {
    headers: headers,
    method: 'POST',
    body: JSON.stringify(data),
  }, response => {
    cb && cb(response);
  });
}

export function getAssetById(id, cb) {
  let headers = getHttpHeader();
  httpRequest(FILE_HOST_IP + '/file/' + id, {
    headers: headers,
    method: 'GET',
  }, response => {
    cb && cb(response);
  });
}

export function removeAssetById(id, cb) {
  let headers = getHttpHeader();
  httpRequest(FILE_HOST_IP + '/file/' + id, {
    headers: headers,
    method: 'DELETE',
  }, response => {
    cb && cb(response);
  });
}

