import {login} from '../../util/network';

export function loginHandler(username, password,cb) {
    if(username.length <= 2 || password.length <= 4){
        cb && cb();
    }

    login({name:username, password:password}, response=>{
        location.href = location.origin;
    }, err=>{
        cb && cb();
    })
        // location.href = location.origin;
    
}