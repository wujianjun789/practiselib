/**
 * Created by a on 2018/2/1.
 */

/** Edit by ChrisWen on 2/2
 * 
 */

import React, { Component } from 'react';
import Draggable,{DraggableCore} from 'react-draggable';
import {HOST_IP_FILE} from '../../util/network';

export default class RenderPlayerAsset extends Component {
  constructor(props){
    super(props);
    this.state = {
      IsPopup: false
    }
    this.mouseDown = this.mouseDown.bind(this);
    this.itemClick = this.itemClick.bind(this);

    this.onStop = this.onStop.bind(this);
    this.addClick = this.addClick.bind(this);
  }

  onStart(event){
    // console.log('start:',event, event.data);
  }

  onStop(event){
    const index = parseInt((event.x-180)/86);

    this.props.playerAssetMove(index);
  }

  mouseDown(event, item){
    this.props.playerAssetSelect(item);
  }

  itemClick(event, item){
    this.props.playerAssetSelect(item);
  }

  addClick(){
    this.setState({IsPopup: true});
  }

  playerAssetAdd(type){
    this.setState({IsPopup: false}, ()=>{
      this.props.playerAssetAdd(type);
    });
  }

  render() {
    const {IsPopup} = this.state;
    const { curNode, playerListAsset, curItem, playerAssetRemove } = this.props;
    return (<ul className={curNode && curNode.type==="area" && typeof curNode.id === 'number' || curNode && curNode.assetType?"":"hidden"}>
      {
        playerListAsset.map((item, index) => {
          const itemId = item.id;
          const assetType = item.assetType;
          const name = item.name;
          const thumbnail = item.thumbnail;
          const curId = curItem?curItem.id:undefined;

          return <Draggable key={index} axis="x" bounds="parent" position={{x:0, y:0}} onMouseDown={(event)=>{this.mouseDown(event, item)}} onStart={this.onStart} onStop={this.onStop}>
            <li key={index} className={"player-list-asset "+(curId ===itemId?"active":"")} role="presentation"
                 onClick={(event)=>this.itemClick(event, item)}>
            <div className={'background ' + (curId === itemId ? '' : 'hidden')}></div>
            <span className="icon">
              {thumbnail && <img src={assetType==='system'?thumbnail:HOST_IP_FILE+"/api/file/thumbnail/"+thumbnail}/>}
            </span>
            <span className="name" title={name}>{name}</span>
            {curId === itemId  &&
                    <span
                      className="icon_delete_c remove"
                      title="删除"
                      onClick={(e) => { e.stopPropagation(); playerAssetRemove(item); }}
                      role="presentation"
                    />}
          </li>
          </Draggable>
        })}
        <li key={199} className="player-list-asset" role="presentation" onClick={this.addClick}>
          <span className="icon glyphicon glyphicon-plus">
          </span>
          <span className="name" title={name}>添加</span>
        </li>
        <div className={"add-popup "+(IsPopup?"":"hidden")}>
          <span className="icon icon-img" role="button" onClick={()=>this.playerAssetAdd("image")}></span>
          <span className="icon icon-text" role="button" onClick={()=>this.playerAssetAdd("text")}></span>
          <span className="icon icon-video" role="button" onClick={()=>this.playerAssetAdd("video")}></span>
          <span className="glyphicon glyphicon-triangle-bottom"></span>
        </div>
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