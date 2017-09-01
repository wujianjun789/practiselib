/** Created By ChrisWen
 *  /系统配置/智慧路灯模块
 *  约定： 以 smartLight 命名 智慧路灯,sysConfig 代表系统配置模块（systemConfig）
 *  拼接命名根据驼峰原则进行对应的大小写转化
 */

import React, { Component } from 'react';

//import 各个组件和样式表
import SearchText from '../../../components/SearchText';
import Table from '../../../components/Table';
import Page from '../../../components/Page';
import SideBarInfo from '../../../components/SideBarInfo';
import Select from '../../../components/Select.1';
import WhiteListPopup from '../../components/WhiteListPopup';
import CentralizedControllerPopup from '../../components/CentralizedControllerPopup';
import ConfirmPopup from '../../../components/ConfirmPopup';
import Content from '../../../components/Content.js';

import '../../../../public/styles/systemOperation-sysConfig.less';

//import 功能函数


export default class sysConfigSmartLight extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Content>
              <SideBarInfo>
                <div className="panel panel-default device-statics-info">
                  <div className="panel-heading">
                    <span className="icon_sys_select"></span>选中设备
                  </div>
                  <div className="panel-body domain-property">
                    <span className="domain-name"></span>
                    <button id="sys-update" className="btn btn-primary pull-right">编辑
                    </button>
                    <button id="sys-delete" className="btn btn-danger pull-right">删除
                    </button>
                  </div>
                </div>
              </SideBarInfo>
            </Content>
        )

    }
}