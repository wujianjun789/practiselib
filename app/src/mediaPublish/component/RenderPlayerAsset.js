/**
 * Created by a on 2018/2/1.
 */
import React from 'react';
const RenderPlayerAsset = props=>{
    const {playerListAsset, playerAssetSelect,playerAssetMove,playerAssetRemove} = props;
    return <ul>
        {
            playerListAsset.get('list').map((item, index) => {
                const itemId = item.get('id');
                const name = item.get('name');
                const curId = playerListAsset.get('id');

                return <li key={itemId} className="player-list-asset" onClick={() => playerAssetSelect(item)}>
                    <div className={"background " + (curId == itemId ? '' : 'hidden')}></div>
                    <span className="icon"></span>
                    <span className="name" title={name}>{name}</span>
                    {curId == itemId && index > 0 && <span className="glyphicon glyphicon-triangle-left move-left" title="左移" onClick={(event) => { event.stopPropagation(); playerAssetMove('left', item) }}></span>}
                    {curId == itemId && index < playerListAsset.get("list").size - 1 && <span className="glyphicon glyphicon-triangle-right move-right" title="右移" onClick={(event) => { event.stopPropagation(); playerAssetMove('right', item) }}></span>}
                    {!playerListAsset.get('isEdit') && item.get("assetType") == "source" && <span className="icon_delete_c remove" title="删除" onClick={(event) => { event.stopPropagation(); playerAssetRemove(item) }}></span>}
                </li>
            })
        }
    </ul>
}

export default RenderPlayerAsset;