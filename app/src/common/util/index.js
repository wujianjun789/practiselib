/**
 * Created by a on 2017/9/14.
 */
/**设备控制 mode**/
export const ASSET_CONTROL_MODE_STRATEGY = "STRATEGY";
export const ASSET_CONTROL_MODE_MANUAL = "MANUAL";

export function treeViewNavigator(data, router) {
    let path = location.pathname;

    let href = data[0] ? data[0].link:null;
    if(href && href.indexOf(path)>-1 && href != path && path.length < href.length){
        router.push(href);//默认路径设置
    }
}

export const DOMAIN_LEVEL = 4;