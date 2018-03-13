/** Created By ChrisWen
 *  18/03/13
 *  PreviewImgComponent
 */
import React from 'react';
import '../../../public/styles/imgPreview.less';

/** props
 *  1. wapperSize --- the size of whole component 
 *  1. projectSize --- Container Size
 *  2. arealist --- [{areaId,areaStyle,playItemUrl}]
 *  3. areaStyle: {width, height, top(offsetY), left(offsetX)}
 *  4. selectedId --- selectedArea highLight
 */

const initSize = { width: 1000, height: 1000 };

function renderAreaList(areaList, selectedId) {
  const renderList = areaList.map((area) => {
    const {id, style} = area;

    const className = id === selectedId ? 'active' : '';
    return (
      <div className={`areaEle ${className}`} key={id} style={style}>
        <img src={area.src} alt="" />
      </div>);
  });
  return renderList;
}

const PreviewContainer = (props) => {
  /* We have reached an agreement that 65535 is the number can not be touched.
   * 65535 means null;
   */
  const { wapperSize = initSize, projectSize = initSize, areaList, selectedId = 65535 } = props;
  const areaListEle = renderAreaList(areaList, selectedId);
  return (
    <div className="container-wapper" style={wapperSize}>
      <div id="preview-container" style={projectSize}>{areaListEle}</div>
    </div>
  );
};


export default PreviewContainer;
