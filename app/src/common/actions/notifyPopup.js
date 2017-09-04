/**
 * Created by a on 2017/9/4.
 */
import {
    NOTIFY_ADD,
    NOTIFY_ANIMATION,
    NOTIFY_DELETE,
    NOTIFY_REMOVE
} from '../actionTypes/notifyPopup'

import {getRandom} from '../../util/algorithm'

/**
 *  添加消息
 * @param notifyType 消息类型(0错误1正确)
 * @param text 消息内容
 * @returns {function()}
 */
export function addNotify(notifyType, text) {
    return dispatch=>{
        let id = getNotifyId();
        dispatch({
            type: NOTIFY_ADD,
            data: {id:id, notifyType:notifyType, text:text}
        });

        dispatch((dispatch,id)=>{
            setTimeout(()=>{
                dispatch({type:NOTIFY_ANIMATION, id:id});
            }, 50);
        });

        if(notifyType>0){
            dispatch((dispatch,id)=>{
                setTimeout(()=>{
                    dispatch({type:NOTIFY_REMOVE, id:id});
                },notifyType==1?10*1000:5*60*1000)
            })

            dispatch((dispatch,id)=>{
                    setTimeout(()=>{
                        dispatch({type:NOTIFY_DELETE, id:id});
                    },(notifyType==1?10*1000:5*60*1000)+50)
            })
        }
    }
}

export function removeNotify(id) {
    return dispatch=>{
        dispatch({type: NOTIFY_REMOVE, id:id})

        dispatch(dispatch=>{
            setTimeout(()=>{
                dispatch({type:NOTIFY_DELETE, id:id})
            }, 50)
        })
    }
}

function getNotifyId() {
    let id = getRandom(1000000000);

    return id;
}

