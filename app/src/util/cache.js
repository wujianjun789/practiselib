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
        let cookie = document.cookie
        if(getCookie(key)){
            return;
        }

        document.cookie = key+"="+JSON.stringify(value)+"; path=/";
        // $.cookie(key, JSON.stringify(value), {expires:1});
    }catch (err){
        console.log('存cookie错误:'+key);
    }

}

export function getCookie(key) {
    let user;
    try {
        // user = $.cookie(key);
        var name = key + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) 
        {
            var c = ca[i].trim();
            if (c.indexOf(name)==0) {
                user = c.substring(name.length,c.length);
            } 
        }
    }catch (err){
        console.log('取cookie错误:'+key);
    }

    if(!!user){
        return JSON.parse(user);
    }
    return null;
    // return user = {
    //     token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MiwicGVybWlzc2lvbiI6MiwiaWF0IjoxNDY1Nzk4MzY3fQ.hdvwNm1wzwC61trL_0QcAK5leunhB-F_a5u3F2kStes"
    // }
}

export function deleteCookie(key){
    try{
        document.cookie = key+"=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    }catch (err){
        console.log('删cookie错误:'+key);
    }
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