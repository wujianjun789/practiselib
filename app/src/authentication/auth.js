import {getCookie,setCookie,deleteCookie} from '../util/cache'


export function isAuthed(auth) {
  return auth && auth.id?true:false;
}

export function isAdmin(auth) {
  return auth && auth.roleId && auth.roleId==1?true:false;
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
