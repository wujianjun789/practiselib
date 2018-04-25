import React, { Component } from 'react';
import PreviewContainer from './container';

const mockProps = {
  areaList: [{
    id: 1,
    style: {
      width: 300, height: 300, top: 0, left: 0,
    },
    src: '',
  }, {
    id: 2,
    style: {
      width: 300, height: 300, top: 0, left: 300,
    },
    src: '',
  }, {
    id: 3,
    style: {
      width: 300, height: 300, top: 0, left: 600,
    },
    src: '',
  }],
  selectedId: 3,
  projectSize: { width: 900, height: 300 },
};

function isArray(array) {
  return Object.prototype.toString.call(array) === '[object Array]';
}

function getScaleObj(obj, scale) {
  let result = {};
  for (let k in obj) {
    result[k] = obj[k] * scale;
  }
  return result;
}

export default class ImgPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }



  getStyleStatus(projectSize, wrapperSize) {
    let status = 0;
    const { width: projectWidth, height: projectHeight } = projectSize;
    const { width: wrapperWidth, height: wrapperHeight } = wrapperSize;
    if (wrapperWidth < projectWidth ) { status = 2; }
    if (wrapperHeight < projectHeight  ) { status = 1; }
    if (wrapperWidth < projectWidth && wrapperHeight < projectHeight ) { status = 3; }
    return status;
  }
  
  render() {
    const { previewProps = mockProps, wrapperSize, scale = 1 } = this.props;
    // console.log('this.props=========', previewProps, wrapperSize);
    const { projectSize, areaList } = previewProps;
    const _areaList = areaList.length > 0 ? areaList.map(areaInfo => {
      const {style} = areaInfo;
      const _style = getScaleObj(style, scale);
      return {id:areaInfo.id, src:areaInfo.src, style:_style};
    }) : areaList;
    const _projectSize = getScaleObj(projectSize, scale);
    const _previewProps = {selectedId:previewProps.selectedId, areaList:_areaList, projectSize:_projectSize};
    // console.log('handleScale=========', _areaList);


    const status = this.getStyleStatus(_projectSize, wrapperSize, scale);
    return (<PreviewContainer status={status} scale={scale} {..._previewProps}/>);
  }
}

