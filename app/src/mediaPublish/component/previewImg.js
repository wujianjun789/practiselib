/** Created By ChrisWen
 *  18/2/1
 *  PreviewImg component
 */ 

import React, {Component} from 'react';
import '../../../public/styles/previewImg.less';

// scaling - 缩放等级，默认1.大于1则放大，小于1则缩小.
// imgInfo - 图片信息，包括图片的src及宽长
// parentInfo - 父元素宽高，用来匹配各种style

const PreviewImg = (props) => {
  const initImgInfo = { width: 400, height: 300, src: '' };
  const { imgInfo:noHandleImgInfo = initImgInfo, scaling, parentInfo = initImgInfo } = props;
  const { src } = noHandleImgInfo;
  const imgInfo = { width: noHandleImgInfo.width * scaling, height: noHandleImgInfo.height * scaling };
  //const imgInfo = {width:initImgInfo.width * scaling, height:initImgInfo.height * scaling};
  const imgStyle = getPreviewStyle(imgInfo, parentInfo);
  return (
    <div id="preview-content">
      <img className="preview-img" src={src} style={imgStyle} role="presentation"/>
    </div>
  ); 
};

export default PreviewImg;

//     position: absolute; top:50%; left:50%;
function getPreviewStyle(imgInfo, parentInfo) {
  let style = {};
  const { width: imgWidth, height: imgHeight } = imgInfo;
  const dipslayStyle = getDisplayStyle(imgInfo, parentInfo);
  style = { width: imgWidth, height: imgHeight, ...dipslayStyle };
  return style;
}

function getDisplayStyle(imgInfo, parentInfo) {
  let dipslayStyle = {};
  const { width: imgWidth, height: imgHeight } = imgInfo;
  const { width: parentWidth, height: parentHeight } = parentInfo;
  // 当且仅当图片宽度小于容器宽度的时候才存在position居中样式选择的问题
  // 图片宽度小于容器宽度一定存在X轴居中
  if (imgWidth < parentWidth) {
    const marginLeft = -(1 / 2 * imgWidth);
    // 如果图片高度大于或等于容器高度，不做Y轴居中。
    if (imgHeight < parentHeight) {
      const marginTop = -(1 / 2 * imgHeight);
      dipslayStyle = {position: 'absolute', top:'50%', left:'50%', marginLeft:marginLeft, marginTop:marginTop};
    } else {
      dipslayStyle = { position: 'absolute', left: '50%', marginLeft: marginLeft, marginTop: 0};
    }
  } else if (imgHeight < parentHeight) {
    const marginTop = -(1 / 2 * imgHeight);
    dipslayStyle = { position: 'absolute', top: '50%', marginTop: marginTop };
  } 
  return dipslayStyle;
}

// export default class PreviewImg extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {};
//   }

//   render() {
//     const initImgInfo = { width: 400, height: 300, src: '' }; 
//     return (
//       <div id="preview-content">
//         <img className="preview-img" src={src} style={imgStyle} role="presentation"/>
//       </div>
//     ); 
//   }
// }