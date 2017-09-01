/** Created By ChrisWen
 *  系统配置/智慧路灯模块
 *  约定： 以 smartLight 命名 智慧路灯,sysConfig 代表系统配置模块（systemConfig）
 *  拼接命名根据驼峰原则进行对应的大小写转化
 *  约定： sysConfigSmartLightChildren 对象提供该模块所有区域组件的子组件
 */

import React, { Component } from 'react';

//import 各区域组件和样式表
import '../../../../public/styles/systemOperation-sysConfig.less';

import SearchText from '../../../components/SearchText';
import Table from '../../../components/Table';
import Page from '../../../components/Page';
import SideBarInfo from '../../../components/SideBarInfo';
import Select from '../../../components/Select.1';
import WhiteListPopup from '../../components/WhiteListPopup';
import CentralizedControllerPopup from '../../components/CentralizedControllerPopup';
import ConfirmPopup from '../../../components/ConfirmPopup';
import Content from '../../../components/Content.js';

//import 功能函数


//import 各区域组件子组件
import { sysConfigSmartLightChildren } from './smartLightComponent/index.js';


export default class sysConfigSmartLight extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapse: false
        }
    }

    render() {
        const {collapse} = this.state;
        const SideBarInfoChildren = sysConfigSmartLightChildren.sideBar();

        return (
            <div id='sysConfigSmartLight'>
              <Content className={ 'offset-right ' + (collapse ? 'collapsed' : '') }>
                <header>
                  <Select id="domain" />
                  <SearchText />
                  <button id="sys-add" className="btn btn-primary add-domain">添加</button>
                </header>
                <div class='smartLight'>
                  <div className="table-container">
                    <Table/>
                    <Page/>
                  </div>
                </div>
                <SideBarInfo>
                  { SideBarInfoChildren }
                </SideBarInfo>
              </Content>
            </div>
        )

    }
}