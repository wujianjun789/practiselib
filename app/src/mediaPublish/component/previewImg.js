/** Created By ChrisWen
 *  18/2/1
 *  PreviewImg component
 */

import React from 'react';
import '../../../public/styles/previewImg.less';

// scaling - 缩放等级，默认1.
// imgInfo - 图片信息，包括图片的src及宽长

const PreviewImg = (props) => {
  const initImgInfo = { width: 400, height: 300, src: '' };
  const { imgInfo = initImgInfo, scaling = 1 } = props;
  const {width, height, src} = imgInfo;
  const imgStyle = {width: width * scaling, height: height * scaling, marginTop:-(height * 0.5) * scaling, marginLeft:-(width * 0.5) * scaling};
  return (
    <div id="preview-content">
      <img className="preview-img" src={src} style={imgStyle} role="presentation"/>
    </div>
  ); 
};

export default PreviewImg;