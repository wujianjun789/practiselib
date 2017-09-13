import React, { Component } from 'react';

export default class SiderBarComponent extends Component {
  render() {
    const props = this.props;

    return (<div className="panel panel-default device-statics-info">
              <div className="panel-heading">
                <span className="icon_sys_select"></span>选中设备
              </div>
              <div className="panel-body domain-property">
                <span className="domain-name">{ props.name }</span>
                <button id="sys-update" className="btn btn-primary pull-right" {...props}>编辑
                </button>
              </div>
            </div>)
  }
}