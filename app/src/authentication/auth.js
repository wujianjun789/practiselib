import {getCookie,setCookie,deleteCookie} from '../util/cache'
export function isLogin(auth) {
  return auth && auth.id?false:true;
}

export function isAuthed(auth) {
  return auth && auth.id?true:false;
}

export function isAdmin(auth) {
  return auth && auth.role && auth.role=='admin'?true:false;
}

export function getAuth() {
  // from storage or cookie
  let user = getCookie('user');
  return user;
}

export function setAuth(auth) {
  // user storage or cookie
  setCookie('user',auth);
}

export function clearAuth(){
  deleteCookie('user');
}

export function hasAssetModule(auth){
  return auth.role=='admin' || auth.modules.indexOf('asset')>-1?true:false;
}
export function hasDomainModule(auth){
  return auth.role=='admin' || auth.modules.indexOf('domain')>-1?true:false;
}
export function hasPermissionModule(auth){
  return auth.role=='admin' || auth.modules.indexOf('permission')>-1?true:false;
}
export function hasMaintenanceModule(auth){
  return auth.role=='admin' || auth.modules.indexOf('maintenance')>-1?true:false;
}
export function hasLightModule(auth){
  return auth.role=='admin' || auth.modules.indexOf('light')>-1?true:false;
}
export function hasReportModule(auth){
  return auth.role=='admin' || auth.modules.indexOf('report')>-1?true:false;
}
export function hasPublishModule(auth){
  return auth.role=='admin' || auth.modules.indexOf('publish')>-1?true:false;
}