/** Created By ChrisWen
 *  18/03/19
 *  ImgPreview Component
 */
import React from 'react';
import '../../../../public/styles/imgPreview.less';

const mockProps = {
  areaList: [{
    id: 1,
    style: {width: 0, height: 0, top: 0, left: 0 },
    src: '',
  }],
  selectedId: 65535,
  projectSize: { width: 0, height: 0 },
};
const { areaList: initAreaList, selectedId: initSelectedId, projectSize: initProjectSize } = mockProps;

function renderAreaList(areaList, selectedId) {
  const renderList = areaList.map((area) => {
    const { id, style } = area;
    const className = id === selectedId ? 'active' : '';
    return (
      <div className={`areaEle ${className}`} key={id} style={style}>
        <img src={area.src} alt="" style={{width:style.width, height: style.height}}/>
      </div>);
  });
  return renderList;
}

function getCorrectStyle(status, projectSize) {
  let style = {};
  switch (status) {
  case 0:
    style = { marginLeft: -0.5 * projectSize.width, marginTop: -0.5 * projectSize.height, ...projectSize };
    return style;
  case 1:
    style = { top: 0, marginLeft: -0.5 * projectSize.width, ...projectSize };
    return style;
  case 2:
    style = { left: 0, marginTop: -0.5 * projectSize.height, ...projectSize };
    return style;
  case 3:
    style = { left: 0, top: 0, ...projectSize };
    return style;  
  default:
    return style;
  }
}

const PreviewContainer = (props) => {
  /* We have reached an agreement that 65535 is the number can not be touched.
   * 65535 means null;
   */
  const { projectSize = initProjectSize, areaList = initAreaList, selectedId = initSelectedId, status = 0, ...otherProps } = props;
  const style = getCorrectStyle(status, projectSize);
  const areaListEle = renderAreaList(areaList, selectedId);
  return (
    <div className="container-wapper">
      <div id="preview-container" style={style}>{areaListEle}</div>
    </div>
  );
};


export default PreviewContainer;