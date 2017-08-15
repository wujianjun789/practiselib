/**
 * Created by a on 2017/8/14.
 */
import React,{Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

import '../../../public/styles/systemOperation-strategy.less';

import Content from '../../components/Content'
import SearchText from '../../components/SearchText'
import Table from '../../components/Table'
import Page from '../../components/Page'

import {overlayerShow, overlayerHide} from '../../common/actions/overlayer'
import TimeStrategyPopup from '../component/TimeStrategyPopup'

import Immutable from 'immutable';
class TimeStrategy extends Component{
    constructor(props){
        super(props);
        this.state = {
            search: Immutable.fromJS({
                placeholder: '输入策略名称',
                value: ''
            }),
            selectDevice:{

            },
            page: Immutable.fromJS({
                pageSize: 10,
                current: 1,
                total: 14
            }),
            data:Immutable.fromJS([
                {id:1, name:"夏季路灯使用策略", timeRange:"5月1日-9月30日"},
                {id:2, name:"冬季路灯使用策略", timeRange:"10月1日-4月30日"},{id:1, name:"夏季路灯使用策略", timeRange:"5月1日-9月30日"},
                {id:2, name:"冬季路灯使用策略", timeRange:"10月1日-4月30日"},{id:1, name:"夏季路灯使用策略", timeRange:"5月1日-9月30日"},
                {id:2, name:"冬季路灯使用策略", timeRange:"10月1日-4月30日"},{id:1, name:"夏季路灯使用策略", timeRange:"5月1日-9月30日"},
                {id:2, name:"冬季路灯使用策略", timeRange:"10月1日-4月30日"},{id:1, name:"夏季路灯使用策略", timeRange:"5月1日-9月30日"},
            ])
        }

        this.columns =  [
            {id: 0, field:"name", title:"策略名称"},
            {id: 1, field: "timeRange", title: "时间范围"}
        ];

        this.searchChange = this.searchChange.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
        this.pageChange = this.pageChange.bind(this);
        this.addHandler = this.addHandler.bind(this);
        this.tableClick = this.tableClick.bind(this);
        this.tableEdit = this.tableEdit.bind(this);
        this.tableDelete = this.tableDelete.bind(this);

        this.requestSearch = this.requestSearch.bind(this);
    }

    requestSearch() {

    }

    addHandler(){
        const {actions} = this.props;
        actions.overlayerShow(<TimeStrategyPopup title="新建策略" data={{name:"夏季路灯使用策略", deviceName:"灯"}}
                                                 deviceList={{titleKey:"name", valueKey:"name", options:[{id:1, name:"灯"},{id:2, name:"控制器"}]}}
                                                 strategyList={[{id:1,time:"15:00", light:"开"},{id:2,time:"16:00", light:"关"}]}
                                                 onConfirm={()=>{}} onCancel={()=>{
                                                    actions.overlayerHide();
                                                 }}/>)
    }

    tableEdit(){

    }

    tableDelete(){

    }

    tableClick(){

    }

    pageChange(current, pageSize){
        let page = this.state.page.set('current', current);
        this.setState({page: page}, ()=> {
            this.requestSearch();
        });
    }

    searchSubmit(){

    }

    searchChange(){

    }

    render(){
        const {search, selectDevice, page, data} = this.state;

        return <Content className="time-strategy">
            <div className="heading">
                <SearchText placeholder={search.get('placeholder')} value={search.get('value')}
                            onChange={this.searchChange} submit={this.searchSubmit}/>
                <button id="sys-add" className="btn btn-default add-domain" onClick={this.addHandler}>添加</button>
            </div>
            <div className="table-container">
                <Table isEdit={true} columns={this.columns} data={data} activeId={selectDevice && selectDevice.id}
                       rowClick={this.tableClick} rowEdit={this.tableEdit} rowDelete={this.tableDelete}/>
                <Page className={"page "+(page.get('total')==0?"hidden":'')} showSizeChanger pageSize={page.get('pageSize')}
                      current={page.get('current')} total={page.get('total')}  onChange={this.pageChange}/>
            </div>
        </Content>
    }
}

function mapStateToProps(state) {
    return {

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
)(TimeStrategy);