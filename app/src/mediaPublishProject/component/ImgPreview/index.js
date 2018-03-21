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

export default class ImgPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getStyleStatus(projectSize, wrapperSize) {
    let status = 0;
    const { width: projectWidth, height: projectHeight } = projectSize;
    const { width: wrapperWidth, height: wrapperHeight } = wrapperSize;
    if (wrapperWidth < projectWidth) { status = 1; }
    if (wrapperHeight < projectHeight) { status = 2; }
    if (wrapperWidth < projectWidth && wrapperHeight < projectHeight) { status = 3; }
    return status;
  }
  
  render() {
    const { previewProps = mockProps, wrapperSize } = this.props;
    const { projectSize } = previewProps;
    const status = this.getStyleStatus(projectSize, wrapperSize);
    return (<PreviewContainer status={status} {...previewProps}/>);
  }
}

