import React, { Component } from 'react';
import PreviewContainer from './container';
// import connect from 'react-redux';

const mockProps = {
  areaList: [{
    id: 1,
    style: {
      width: 300, height: 1300, top: 0, left: 0,
    },
    src: '',
  }, {
    id: 2,
    style: {
      width: 300, height: 300, top: 0, left: 100,
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
  
  render() {
    return (<PreviewContainer {...mockProps}/>);
  }
}

// function mapStateToProps(state) { }
// function mapDisptachToProps(dispatch, ownProps) {}

// export default connect(mapStateToProps, mapDisptachToProps)(ImgPreview);
