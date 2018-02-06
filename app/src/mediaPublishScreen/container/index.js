/**
 * Created by a on 2018/2/1.
 */
import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Immutable from 'immutable';
import Content from '../../components/Content';
import Select from '../../reporterManage/component/select';
import SearchText from '../../components/SearchText';
import Table from '../../components/Table'
import Page from '../../components/Page'

import ProjectPopup from '../component/ProjectPopup';
import PreViewPopup from '../component/PreViewPopup';

import { getDomainList } from '../../api/domain';
import { getSearchAssets, getSearchCount } from '../../api/asset'
import '../../../public/styles/media-publish-screen.less';

import {overlayerShow, overlayerHide} from '../../common/actions/overlayer';
export class MediaPublishScreen extends Component {
    state = {
        sidebarCollapse: false,
        domainList: [
            { name: '域' }
        ],
        currentDomain: null,
        search: {
            value: '',
            placeholder: '输入设备名称'
        },
        deviceList: [],
        deviceSelectedList: [],
        currentDevice: null,
        page: { total: 0, current: 1, limit: 4 },
        showView: false,
        showPlan: false,
    }
    componentWillMount() {
        this._isMounted = true;
        this.model = 'screen';
        this.deviceColumns = [
            { field: 'name', title: '名称' },
            { field: 'ratio', title: '分辨率' },
            { field: 'screenStatus', title: '屏体状态' },
            { field: 'switchStatus', title: '开关状态' },
            { field: 'onlineStatus', title: '在线状态' }
        ];
        this.initDomainData();
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    //初始化域，更新域列表
    initDomainData = () => {
        getDomainList(data => {
            this._isMounted && this.updateDomainData(data)
        })
    }
    updateDomainData = (data) => {
        if (!data.length) {
            return;
        }
        this.setState({ currentDomain: data[0], domainList: data }, this.initDeviceData);
    }
    initDeviceData = (isSearch) => {
        if (!this._isMounted) {
            return;
        }
        if (isSearch) {
            this.setState({ page: { ...this.state.page, current: 1 } })
        }
        if (this.state.currentDomain) {
            const { currentDomain, search: { value }, page: { current, limit } } = this.state;
            const offset = limit * (current - 1);
            getSearchCount(currentDomain.id, this.model, value, this.updatePageSize)
            getSearchAssets(currentDomain.id, this.model, value, offset, limit, this.updateDeviceData);
        }
    }
    updateDeviceData = (data) => {
        this._isMounted && this.setState({ deviceList: data });
    }
    handleCollapse = () => {
        this.setState({ sidebarCollapse: !this.state.sidebarCollapse })
    }
    handleSelectDomain = (e) => {
        const { domainList } = this.state;
        this.setState({ currentDomain: domainList[e.target.selectedIndex] }, this.initDeviceData)
    }
    handleSearchValue = (value) => {
        this.setState({ search: { ...this.state.search, value } })
    }
    handleSearchSubmit = () => {
        this.initDeviceData(true)
    }
    handlePagination = (index) => {
        this.setState({ page: { ...this.state.page, current: index } }, this.initDeviceData)
    }
    updatePageSize = (data) => {
        this._isMounted && this.setState({ page: { ...this.state.page, total: data.count } });
    }
    handleViewDevice = () => {
        // this.setState({ showView: !this.state.showView })
        const {actions} = this.props;
        actions.overlayerShow(<PreViewPopup title="显示屏预览" data={{url:"http://localhost:8080/images/smartLight/screen_test.png"}} onCancel={()=>{
            actions.overlayerHide();
        }}/>)
    }
    hanldePlanManage = () => {
        // this.setState({ showPlan: !this.state.showPlan })
        const {actions} = this.props;
        const applyProjectList = [{id:'5a67f0216c64c71518b0140f', name:"project1"},{id:'5a67f05c6c64c71518b01410', name:"project3"}];
        actions.overlayerShow(<ProjectPopup title="方案管理" data={{applyProjectList:applyProjectList}} onConfirm={data=>{
               actions.overlayerHide();
        }} onCancel={()=>{
            actions.overlayerHide();
        }}/>)
    }
    componentDidUpdate() {
        const { sidebarCollapse, domainList, currentDomain, search: { value, placeholder } } = this.state;
        console.log(domainList)
        console.log(currentDomain)
        console.log(value)
    }
    render() {
        const { sidebarCollapse, domainList, currentDomain, search: { value, placeholder }, deviceList, deviceSelectedList,
            page: { total, current, limit } } = this.state;
        return (
            <Content id='media-publish-screen' class={`${sidebarCollapse ? 'mr60' : ''}`}>
                <div class='content-left'>
                    <div class='heading'>
                        <Select id='domain' className='select-domain' options={domainList}
                            current={currentDomain} onChange={this.handleSelectDomain} />
                        <SearchText className='search-text' placeholder={placeholder} value={value}
                            onChange={this.handleSearchValue} submit={this.handleSearchSubmit} />
                    </div>
                    <div class='body'>
                        <Table columns={this.deviceColumns} data={Immutable.fromJS(deviceList)} checked={deviceSelectedList}
                            rowCheckChange={this.selectDevice} />
                        <div class={`page-center ${total === 0 ? 'hidden' : ''}`}>
                            <Page class='page' showSizeChanger pageSize={limit} current={current} total={total} onChange={this.handlePagination} />
                        </div>
                    </div>
                </div>

                <div class={`sidebar-info ${sidebarCollapse ? 'sidebar-collapse' : ''}`}>
                    <div class='row collapse-container' onClick={this.handleCollapse}>
                        <span class={sidebarCollapse ? 'icon_horizontal' : 'icon_vertical'}></span>
                    </div>
                    <div>
                        <button onClick={this.handleViewDevice}>预览</button>
                    </div>
                    <div><button onClick={this.hanldePlanManage}>方案管理</button></div>
                </div>
            </Content >
        )
    }
}

function mapStateToProps(state) {
    return {
        sidebarNode: state.domainManage.get('sidebarNode')
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            overlayerShow: overlayerShow,
            overlayerHide: overlayerHide
        }, dispatch)
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MediaPublishScreen);