import React, { Component } from 'react';

export default class sideBarInfoChildren extends Component {
    render() {
        return (
            <div className="panel panel-default device-statics-info">
              <div className="panel-heading">
                <span className="icon_sys_select"></span>选中设备 --- 智慧路灯配置
              </div>
              <div className="panel-body domain-property">
                <span className="domain-name"></span>
                <button id="sys-update" className="btn btn-primary pull-right" id="test1">编辑
                </button>
                <button id="sys-delete" className="btn btn-danger pull-right">删除
                </button>
              </div>
            </div>
        )
    }
}