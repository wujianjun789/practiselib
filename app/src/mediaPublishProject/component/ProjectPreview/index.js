/** Created By ChrisWen
 *  18/03/19
 *  ProjectPreview Component
 */

import React, { Component } from 'react';
import PreviewContainer from './container';
import '../../../../public/styles/projectPreview.less';

export default class ProjectPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { props } = this;
    return (<PreviewContainer {...props}/>);
  }
}

