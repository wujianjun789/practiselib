/**
 * Created by a on 2018/2/1.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Immutable from 'immutable';
import Content from '../../components/Content';
import Select from '../../reporterManage/component/select';
import SearchText from '../../components/SearchText';
import Table from '../../components/Table'
import Page from '../../components/Page'
import MapView from '../../components/MapView'
import ProjectPopup from '../component/ProjectPopup';
import PreViewPopup from '../component/PreViewPopup';
import { getDomainList } from '../../api/domain';
import { getSearchAssets, getSearchCount } from '../../api/asset'
import '../../../public/styles/media-publish-screen.less';

import { overlayerShow, overlayerHide } from '../../common/actions/overlayer';
export class MediaPublishScreen extends Component {
    state = {
        sidebarCollapse: false,
        domainList: [
            { name: '域' }
        ],
        currentDomain: null,
        deviceList: [],
        currentDevice: null,
        search: { value: '', placeholder: '输入设备名称' },
        page: { total: 0, current: 1, limit: 10 },
        showView: false,
        showPlan: false,
        playScheme: [
            { name: '播放方案1', id: 0 },
            { name: '播放方案2', id: 1 },
            { name: '播放方案3', id: 2 },
            { name: '方案管理...', id: 'manage' }
        ],
        currentPlan: null
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
    initDeviceData = () => {
        if (!this._isMounted) {
            return;
        }
        if (this.state.currentDomain) {
            const { currentDomain, search: { value }, page: { current, limit } } = this.state;
            const offset = limit * (current - 1);
            getSearchCount(currentDomain.id, this.model, value, this.updatePageSize)
            getSearchAssets(currentDomain.id, this.model, value, offset, limit, this.updateDeviceData);
        }
    }
    updatePageSize = (data) => {
        this._isMounted && this.setState({ page: { ...this.state.page, total: data.count } });
    }
    updateDeviceData = (data) => {
        this._isMounted && this.setState({ deviceList: data, currentDevice: data.length ? data[0] : null });
    }
    handleCollapse = () => {
        this.setState({ sidebarCollapse: !this.state.sidebarCollapse })
    }
    handleSelectDomain = (e) => {
        const { domainList, page } = this.state;
        this.setState({ currentDomain: domainList[e.target.selectedIndex], page: { ...page, current: 1 } }, this.initDeviceData)
    }
    handleSearchValue = (value) => {
        this.setState({ search: { ...this.state.search, value } })
    }
    handleSearchSubmit = () => {
        this.setState({ page: { ...this.state.page, current: 1 } }, this.initDeviceData)
    }
    handlePagination = (current) => {
        this.setState({ page: { ...this.state.page, current, } }, this.initDeviceData)
    }
    handleViewDevice = () => {
        // this.setState({ showView: !this.state.showView })
        const { actions } = this.props;
        actions.overlayerShow(<PreViewPopup title="显示屏预览" data={{ url: "http://localhost:8080/images/smartLight/screen_test.png" }} onCancel={() => {
            actions.overlayerHide();
        }} />)
    }
    hanldePlanManage = () => {
        // this.setState({ showPlan: !this.state.showPlan })
        const { actions } = this.props;
        const applyProjectList = [{ id: '5a67f0216c64c71518b0140f', name: "project1" }, { id: '5a67f05c6c64c71518b01410', name: "project3" }];
        actions.overlayerShow(<ProjectPopup title="方案管理" data={{ applyProjectList: applyProjectList }} onConfirm={data => {
            actions.overlayerHide();
        }} onCancel={() => {
            actions.overlayerHide();
        }} />)
    }
    selectDevice = (currentDevice) => {
        this.setState({ currentDevice: currentDevice.toJS() })
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const { currentDevice } = this.state;
        console.log(e.target)
        console.log('应用设备开关', currentDevice)
    }
    handleSelectPlayScheme = (e) => {
        const { playScheme, currentPlan } = this.state;
        const id = playScheme[e.target.selectedIndex].id
        if (id === 'manage') {
            this.setState({ currentPlan: null }, this.hanldePlanManage)
            return;
        }
        this.setState({ currentPlan: playScheme[e.target.selectedIndex] })
    }
    handlePlanApply = () => {
        const { currentDevice, currentPlan } = this.state;
        console.log('应用当前方案', currentDevice, currentPlan)
    }
    componentDidUpdate() {
        const { sidebarCollapse, domainList, currentDomain, deviceList, currentDevice, showView, showPlan,
            search: { value, placeholder }, page: { total, current, limit }, playScheme, currentPlan } = this.state;
        // console.log('currentDevice', currentDevice)
        // console.log(domainList)
        // console.log(currentDomain)
        // console.log(value)
        console.log(currentDevice)
        console.log(currentPlan)
        console.log(showPlan)
    }
    render() {
        const { sidebarCollapse, domainList, currentDomain, deviceList, currentDevice,
            search: { value, placeholder }, page: { total, current, limit }, playScheme, currentPlan } = this.state;
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
                        <Table columns={this.deviceColumns} data={Immutable.fromJS(deviceList)} activeId={deviceList.length && currentDevice.id}
                            rowClick={this.selectDevice} />
                        <div class={`page-center ${total === 0 ? 'hidden' : ''}`}>
                            <Page class='page' showSizeChanger pageSize={limit} current={current} total={total} onChange={this.handlePagination} />
                        </div>
                    </div>
                </div>
                <div class={`sidebar-info ${sidebarCollapse ? 'sidebar-collapse' : ''}`}>
                    <div class='row collapse-container' onClick={this.handleCollapse}>
                        <span class={sidebarCollapse ? 'icon_horizontal' : 'icon_vertical'}></span>
                    </div>
                    <div class='panel panel-default'>
                        <div class='panel-heading'>
                            <span class="icon_select"></span>选中设备
                        <span class="icon icon_collapse pull-right"></span>
                        </div>
                        <div class='panel-body'>
                            <span title={currentDevice === null ? '无设备' : currentDevice.name}>{currentDevice === null ? '无设备' : currentDevice.name}</span>
                            <button onClick={this.handleViewDevice} class='btn btn-primary pull-right' disabled={currentDevice === null ? true : false}>预览</button>
                        </div>
                    </div>
                    <div class='panel panel-default'>
                        <div class='panel-heading'>
                            <span class='icon_touch'></span>设备操作
                            <span class="icon icon_collapse pull-right"></span>
                        </div>
                        <div class='panel-body'>
                            <div class='item'>
                                <form onSubmit={this.handleSubmit}>
                                    <span>设备开关：</span>
                                    <input type='radio' name='operation' value='open' defaultChecked /><span class='action'>开</span>
                                    <input type='radio' name='operation' value='close' /><span class='action'>关</span>
                                    <button class='btn btn-primary pull-right' type='submit' disabled={currentDevice === null ? true : false}>应用</button>
                                </form>
                            </div>
                            <div class='item'>
                                <span>方案列表：</span>
                                <Select id='playScheme' className='play-scheme' options={playScheme} onChange={this.handleSelectPlayScheme} />
                                <button class='btn btn-primary pull-right' onClick={this.handlePlanApply}
                                    disabled={(currentDevice !== null && currentPlan !== null) ? false : true}>应用</button>
                            </div>
                        </div>
                    </div>
                    <div class='panel panel-default'>
                        <div class='panel-heading'>
                            <span class="icon_map"></span><span>地图位置</span>
                            <span class="icon icon_collapse pull-right"></span>
                        </div>
                        <div className='panel-body map-container'>
                            <MapView option={{ mapZoom: false }} mapData={{ id: 'example' }} />
                        </div>
                    </div>
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