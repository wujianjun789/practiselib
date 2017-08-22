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
