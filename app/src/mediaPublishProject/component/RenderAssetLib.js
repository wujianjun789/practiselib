/**
 * Created by a on 2018/2/1.
 */
import React from 'react';
import {HOST_IP_FILE} from '../../util/network';

const RenderAssetLib = props=>{
    const {assetList, lastPress, isPressed, mouseXY, assetSelect, assetLibRemove} = props;
    return <ul className="asset-list">
        {
            assetList.get('list').map((item, index) => {
                
                let x, y;
                const id = item.get('id');
                const assetType = item.get('assetType');
                const thumbnail = item.get('thumbnail');
                const curId = assetList.get('id');
                if (id == lastPress && isPressed) {
                    [x, y] = mouseXY;
                } else {
                    [x, y] = [0, 0];
                }

                return <li key={id} className={index > 0 && (index+1) % 5 == 0 ? "margin-right" : ""}
                           style={{ transform: `translate(${x}px,${y}px)`, zIndex: id == lastPress ? 99 : 0 }}
                           onClick={() => assetSelect(item)}>
                    {/*onMouseDown={event=>{this.handleMouseDown(item, [x, y],{pageX:event.pageX, pageY:event.pageY})}}*/}
                    <div className={"background " + (curId == id ? '' : 'hidden')}></div>
                    <span className="icon">
                        <img src={assetType==="system"?thumbnail:HOST_IP_FILE+"/api/file/thumbnail/"+thumbnail}/>
                    </span>
                    <span className="name" title={item.get('name')}>{item.get('name')}</span>
                    {!assetList.get('isEdit') && item.get("assetType") == "source" && <span className="icon_delete_c remove" title="删除" onClick={(event) => { event.stopPropagation(); assetLibRemove(item) }}></span>}
                </li>
            })
        }
    </ul>
}

export default RenderAssetLib;