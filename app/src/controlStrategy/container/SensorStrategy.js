/**
 * Created by a on 2017/8/14.
 */
import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import Content from '../../components/Content';
import SearchText from '../../components/SearchText';
import Table from '../../components/Table';
import {overlayerHide, overlayerShow} from '../../common/actions/overlayer';
import SensorStrategyPopup from '../component/SensorStrategyPopup';
import ConfirmPopup from '../../components/ConfirmPopup';
import Page from '../../components/Page';
import Immutable from 'immutable';

export class SensorStrategy extends Component{
    constructor(props){
        super(props);
        this.state = {
            data: [
                {strategyName: '策略一', sensorType: '传感器'},
            ],
            search: {
                placeholder: '输入策略名称',
                value: ''
            },
            page: {
                pageSize: 10,
                current: 1,
                total: 1
            }
        }

        this.columns = [
            {field: 'strategyName', title: '策略名称'},
            {field: 'sensorType', title: '传感器类型'}
        ];

        this.searchChange = this.searchChange.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
        this.onClick = this.onClick.bind(this);
        this.tableRowClick = this.tableRowClick.bind(this);
        this.tableRowEdit = this.tableRowEdit.bind(this);
        this.tableRowDelete = this.tableRowDelete.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.pageChange = this.pageChange.bind(this);
        
    }

    searchChange(value) {
        this.setState({search: Object.assign({}, this.state.search, {value})});
    }

    searchSubmit() {
        
    }

    tableRowEdit(id) {
        const initData = {
            id: '',
            strategyName: '',
            sensorType: 'windy',
            controlDevice: '',
            screenSwitch: 'on',
            sensorParam: '',
            lightness: '' 
        };
        this.props.actions.overlayerShow(<SensorStrategyPopup className='sensor-strategy-popup' title="修改策略" data={initData} overlayerHide={this.props.actions.overlayerHide}/>);
    }

    tableRowDelete(id) {
        this.props.actions.overlayerShow(<ConfirmPopup tips="是否删除选中策略？" iconClass="icon_popup_delete" cancel={ this.props.actions.overlayerHide } confirm={ this.confirmDelete }/>);
    }

    tableRowClick(id) {

    }

    pageChange(page) {
        
    }

    onClick(e) {
        const {id} = e.target;
        const initData = {
            id: '',
            strategyName: '',
            // sensorType: '',
            controlDevice: '',
            screenSwitch: 'on',
            sensorParam: '',
            lightness: '' 
        };
        id=='add-sensor' && this.props.actions.overlayerShow(<SensorStrategyPopup className='sensor-strategy-popup' title="新建策略" data={initData} overlayerHide={this.props.actions.overlayerHide}/>);
    }

    confirmDelete() {
        this.props.actions.overlayerHide();
    }

    render() {
        const {data, search, page} = this.state;
        return <Content className="sensor-strategy">
            <div className="content-title">
                <SearchText placeholder={search.placeholder} value={search.value} onChange={this.searchChange} submit={this.searchSubmit}/>
                <button id="add-sensor" className="btn btn-primary" onClick={this.onClick}>添加</button>
            </div>
            <div className="content-body">
                <Table columns={this.columns} keyField='id' data={Immutable.fromJS(data)} isEdit rowEdit={this.tableRowEdit} rowDelete={this.tableRowDelete} rowClick={this.tableRowClick}/>
                <div className='pagination'><Page className={`${page.total==0?"hidden":''}`} showSizeChanger pageSize={page.pageSize} current={page.current} total={page.total}  onChange={this.pageChange}/></div>
            </div>
        </Content>
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            overlayerHide,
            overlayerShow
        }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SensorStrategy);