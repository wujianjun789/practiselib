import React from 'react';

export default class PreviewImgList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previewPlayList: [],
    };
  }

  componentDidMount() {
    console.log('DIDMOUNT');
  }

  componentDidUpdate() {
    this.setPlayItemArray();
  }

  setPlayItemArray() {
    let arealist = [];
    let targetType = '';
    const props = this.props.props;
    if (props.parentNode) {
      targetType = props.parentNode.type;
    }
  
    if (targetType === 'scene') {
      arealist = props.parentNode.children; 
    }
    console.log('激活setPlayItemArray', targetType, arealist);
    if (arealist === [] || targetType === '') {
      return undefined;
    } else {
      const itemList = arealist.map(item => {
        if (item.id === props.curNode.id) {
          return {areaId:item.id, playItemId:props.playerListAsset.get('id')};
        } else {
          const playlist = this.state.previewPlayList;
          if (playlist === []) {
            return { areaId: item.id, playItemId: 65535 };
          } else {
            for (let i = 0; i < playlist.length; i++) {
              if (playlist[i].areaId === item.id) {
                return playlist[i];
              } else {
                return { areaId: item.id, playItemId:item.id || 65535 };
              }
            }
          }
          return { areaId: item.id, playItemId: 65535 };
        }
      });
      // console.log('ITEMLIST', itemList);
      // if (this.state.previewPlayList !== itemList) {
      //   this.setState({
      //     previewPlayList: itemList,
      //   });
      // }  
    }
  }

  getPreviewImg() {
    const projectId = this.props.project.id;
    const programId = this.props.parentParentNode.id;
    const sceneId = this.props.parentNode.id;
    const zoneId = this.props.curNode.id;
    const items = this.props.previewPlayList.map(item => { return item.playItemId; });
    const requestJson = ({ projectId, programId, sceneId, zoneId, items });
    return console.log(requestJson);
    // return previewPlayItem(requestJson, data => { this.setprops({ previewSrc:data }); });
  }

  render() {
    return null;
  }
}

// function curry(func, fixedParams) {
//   if ( !Array.isArray(fixedParams) ) { fixedParams = []; }
//   return function() {
//     let newParams = Array.prototype.slice.call(arguments); // 新传的所有参数
//     if ( (fixedParams.length + newParams.length) < func.length ) {
//       return curry(func, fixedParams.concat(newParams));
//     } else {
//       return func.apply(undefined, fixedParams.concat(newParams));
//     }
//   };
// }