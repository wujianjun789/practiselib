import React, { Component } from 'react';

export default class SiderBarComponent extends Component {
  render() {
    return (<div className="panel panel-default device-statics-info">
              <div className="panel-heading">
                <span className="icon_sys_select"></span>选中设备
              </div>
              <div className="panel-body domain-property">
                <span className="domain-name"></span>
                <button id="sys-update" className="btn btn-primary pull-right" onClick={ this.props.onClick }>编辑
                </button>
              </div>
            </div>)
  }
}