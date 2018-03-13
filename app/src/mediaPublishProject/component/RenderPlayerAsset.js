/**
 * Created by a on 2018/2/1.
 */

/** Edit by ChrisWen on 2/2
 * 
 */

import React, { Component } from 'react';
import {HOST_IP_FILE} from '../../util/network';

export default class RenderPlayerAsset extends Component {
  
  onClick(event, direction, item) {
    event.stopPropagation();
    return this.props.playerAssetMove(direction, item);
  }
  
    
  render() {
    const { curNode, playerListAsset, curItem, isEdit, playerAssetSelect, playerAssetRemove } = this.props;
    return (<ul className={curNode && curNode.type==="area" && typeof curNode.id === 'number' || curNode && curNode.assetType?"":"hidden"}>
      {
        playerListAsset.map((item, index) => {
          const itemId = item.id;
          const assetType = item.assetType;
          const name = item.name;
          const thumbnail = item.thumbnail;
          const curId = curItem?curItem.id:undefined;

          return <li key={index} className="player-list-asset" onClick={() => playerAssetSelect(item)}
            role="presentation">
            <div className={'background ' + (curId === itemId ? '' : 'hidden')}></div>
            <span className="icon">
              {thumbnail && <img src={assetType==='system'?thumbnail:HOST_IP_FILE+"/api/file/thumbnail/"+thumbnail}/>}
            </span>
            <span className="name" title={name}>{name}</span>
            {/*curId == itemId && index > 0 &&
                    <span
                      className="glyphicon glyphicon-triangle-left move-left"
                      title="左移"
                      onClick={(e) => { this.onClick(e, 'left', item); }}
                      role="presentation" />*/}
            {/*curId == itemId && index < playerListAsset.get('list').size - 1 &&
                    <span
                      className="glyphicon glyphicon-triangle-right move-right"
                      title="右移"
                      onClick={(e) => { this.onClick(e, 'right', item); }}
                      role="presentation"
                    />*/}
            {curId === itemId  &&
                    <span
                      className="icon_delete_c remove"
                      title="删除"
                      onClick={(e) => { e.stopPropagation(); playerAssetRemove(item); }}
                      role="presentation"
                    />}
          </li>;
        })}
    </ul>);
  }
}




// const RenderPlayerAsset = props => {
//   const {playerListAsset, playerAssetSelect, playerAssetMove, playerAssetRemove} = props;
//   return <ul>
//     {
//       playerListAsset.get('list').map((item, index) => {
//         const itemId = item.get('id');
//         const name = item.get('name');
//         const curId = playerListAsset.get('id');

//         return <li
//           key={itemId}
//           className="player-list-asset"
//           onClick={() => playerAssetSelect(item)}
//           role="presentation">
//           <div className={'background ' + (curId == itemId ? '' : 'hidden')}></div>
//           <span className="icon"></span>
//           <span className="name" title={name}>{name}</span>
//           {curId == itemId && index > 0 &&
//                 <span
//                   className="glyphicon glyphicon-triangle-left move-left"
//                   title="左移"
//                   onClick={(event) => { event.stopPropagation(); playerAssetMove('left', item); }}
//                   role="presentation" />}
//           {curId == itemId && index < playerListAsset.get('list').size - 1 &&
//                 <span
//                   className="glyphicon glyphicon-triangle-right move-right"
//                   title="右移"
//                   onClick={(event) => { event.stopPropagation(); playerAssetMove('right', item); }}
//                   role="presentation"
//                 />}
//           {!playerListAsset.get('isEdit') && item.get('assetType') == 'source' &&
//                 <span
//                   className="icon_delete_c remove"
//                   title="删除"
//                   onClick={(event) => { event.stopPropagation(); playerAssetRemove(item); }}
//                   role="presentation"
//                 />}
//         </li>;
//       })
//     }
//   </ul>;
// };

// export default RenderPlayerAsset;