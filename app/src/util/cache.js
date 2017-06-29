/**
 * Created by a on 2017/3/15.
 */
/**
 * 设置cookie
 * @param key
 * @param value
 */
export function setCookie(key, value) {
    try {
        $.cookie(key, JSON.stringify(value), {expires:1});
    }catch (err){
        // console.log('存cookie错误:'+key);
    }

}

export function getCookie(key) {
    let user;
    try {
        user = $.cookie(key);
    }catch (err){
        // console.log('取cookie错误:'+key);
    }

    if(!!user){
        return JSON.parse(user);
    }
    return null;
    // return user = {
    //     token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MiwicGVybWlzc2lvbiI6MiwiaWF0IjoxNDY1Nzk4MzY3fQ.hdvwNm1wzwC61trL_0QcAK5leunhB-F_a5u3F2kStes"
    // }
}

/**
 *  设置缓存
 * @param key
 * @param value
 */
export function setLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    }catch (err){
        console.log('存localStorage错误:'+key);
    }
}

export function getLocalStorage(key) {
    let data = localStorage.getItem(key);
    if(!!data){
        return JSON.parse(data);
    }

    return null;
}

export function removeLocalStorage(key) {
    localStorage.removeItem(key);
}