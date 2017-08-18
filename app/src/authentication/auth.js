import {getCookie} from '../util/cache';

export function isAuthed(auth) {
	let logData = getCookie('user');
	if(logData.userId!=''||logData.userId!=null||logData.userId!=undefined){
		return true
	}else{return false}
}

export function isAdmin(auth) {
let logData = getCookie('user');
	if(logData.userId==1){
  		return true;
  	}else{
  		return false;
  	}

}

export function getAuth() {
  // from storage or cookie
  return {}
}
export function setAuth(auth) {
  // user storage or cookie
  return {}
}


