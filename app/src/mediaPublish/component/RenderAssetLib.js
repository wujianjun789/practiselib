/**
 * Created by a on 2018/2/1.
 */
import React from 'react';

const RenderAssetLib = props=>{
    const {playerListAsset, assetList, lastPress, isPressed, mouseXY, assetSelect, addClick, assetLibRemove} = props;
    return <ul className="asset-list">
        {
            assetList.get('list').map((item, index) => {
                let x, y;
                const id = item.get('id');
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
                    <span className="icon"></span>
                    <span className="name" title={item.get('name')}>{item.get('name')}</span>
                    {!playerListAsset.get('isEdit') && <span className="icon_add_c add" title="添加" onClick={(event) => { event.stopPropagation(); addClick(item) }}></span>}
                    {!assetList.get('isEdit') && item.get("assetType") == "source" && <span className="icon_delete_c remove" title="删除" onClick={(event) => { event.stopPropagation(); assetLibRemove(item) }}></span>}
                </li>
            })
        }
    </ul>
}

export default RenderAssetLib;