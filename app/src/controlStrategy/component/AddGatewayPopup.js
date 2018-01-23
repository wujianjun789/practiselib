import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Panel from '../../components/Panel';
import PanelFooter from '../../components/PanelFooter';
import {FormattedMessage} from 'react-intl';
import { intlFormat } from '../../util/index';
import SearchText from '../../components/SearchText'
import Table from '../../components/Table'
import Immutable from 'immutable';
import { getDomainList } from '../../api/domain'
import { getSearchAssets, getSearchCount } from '../../api/asset'
import Page from '../../components/Page';
import {getObjectByKeyObj,spliceInArray,getObjectByKey} from '../../util/algorithm';
import {Name2Valid} from '../../util/index'
export default class AddGatewayPopup extends Component{
    constructor(props){
        super(props);
        this.state = {
            data:Immutable.fromJS([]),
            search: Immutable.fromJS({
                placeholder:intlFormat({en:'please input the name',zh:'输入网关名称'}), 
                value: ''
            }),
            allChecked:false,
            checked:[],
            page: Immutable.fromJS({
                pageSize: 10,
                current: 1,
                total: 0
            }),
            domainList:[]
        }
        this.columns =  [
            {id: 0, field:"id", title:this.formatIntl('id')},
            {id: 1, field: "name", title: this.formatIntl('name')},
            {id: 2, field: "domain", title: this.formatIntl('app.domain')},
        ];
    }

    componentWillMount() {
        this.mounted = true;
        getDomainList(data=>{
            this.setState({domainList: data},()=>{
                this.requestSearch();
            });
        })
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    requestSearch=() =>{
        const {search, page} = this.state
        let name = search.get('value');
        let cur = page.get('current');
        let size = page.get('pageSize');
        let offset = (cur - 1) * size;
        getSearchCount(null, 'gateway', name, data => {
            this.mounted && this.initPageSize(data)
        })

        getSearchAssets(null, 'gateway', name, offset, size, data => {
            this.mounted && this.initData(data);
        })
    }

    initData=(data)=>{
        let checked = [];
        let list = data.map(item=>{
            let domain = getObjectByKeyObj(this.state.domainList, 'id', item.domainId);
            item.domain = domain ? domain.name : "";
            getObjectByKey(this.props.allDevices,'id',item.id) && checked.push(item.id);
            return item;
        })
        this.setState({data:Immutable.fromJS(list),checked:checked,allChecked:data.length === checked.length});
    }

    initPageSize=(data) =>{
        let page = this.state.page.set('total', data.count);
        this.setState({
            page: page
        });
    }

    pageChange=(current, pageSize)=> {
        let page = this.state.page.set('current', current);
        this.setState({
            page: page
        }, () => {
            this.requestSearch();
        });
    }

    formatIntl=(formatId)=>{
        const {intl} = this.props;
        return intl?intl.formatMessage({id:formatId}):null;
    }

    onCancel=()=>{
        this.props.onCancel && this.props.onCancel();

    }

    onConfirm=()=>{
        const {data,checked} = this.state;
        let gateways =[];
        checked.map(id=>{
            gateways.push(getObjectByKey(data,'id',id).toJS());
        })
        this.props.onConfirm && this.props.onConfirm(gateways);
    }

    onChange=(e)=>{
        let prompt = !Name2Valid(e.target.value);
        this.setState({name:e.target.value,prompt:prompt});
    }

    searchChange=(value)=>{
        this.setState({
            search: this.state.search.update('value', () => value)
        });
    }

    searchSubmit=()=>{
        let page = this.state.page.set('current', 1);
        this.setState({page:page},()=>{
            this.requestSearch();
        });   
    }

    allCheckChange=(value)=>{
        const {data} =this.state;
        let checked = [];
        value && data.map(item=>{
            checked.push(item.get("id"))
        })
        this.setState({allChecked:value,checked:checked})
    }

    rowCheckChange=(id,value)=>{
        let {data,checked} =this.state;
        value?checked.push(id):spliceInArray(checked,id);
        let allChecked = data.size == checked.length;
        this.setState({allChecked:allChecked,checked:checked})        
    }
    
    render() {
        let {className = '',title = '',isEdit=false} = this.props;
        let {data,search,allChecked,checked,page} = this.state;
        let footer = <PanelFooter funcNames={['onCancel','onConfirm']} btnTitles={['button.cancel','button.confirm']} btnClassName={['btn-default', 'btn-primary']} btnDisabled={[false, false]} onCancel={this.onCancel} onConfirm={this.onConfirm}/>;
        return (
            <Panel className={className} title = {title} footer = {footer} closeBtn = {true} closeClick = {this.onCancel}>
                <SearchText placeholder={search.get('placeholder')} value={search.get('value')} onChange={this.searchChange} submit={this.searchSubmit}/>
                <div className="table-container">              
                    <Table columns={this.columns} data={data} allChecked={allChecked} checked={checked} allCheckChange={this.allCheckChange} rowCheckChange={this.rowCheckChange}/>
                    <Page className={ "page " + (page.get('total') == 0 ? "hidden" : '') } pageSize={ page.get('pageSize') } current={ page.get('current') } total={ page.get('total') } onChange={ this.pageChange }/>
                </div>
            </Panel>
        )
    }
}