import React,{Component} from 'react';
import Panel from '../../components/Panel';
import PanelFooter from '../../components/PanelFooter';
import SearchText from '../../components/SearchText';
import Table from '../../components/Table2';
import Immutable from 'immutable';

import {getWhiteListById, addLcToWhiteListById, delLcFromWhiteListById} from '../../api/domain';

import {getAssetsBaseByModelWithDomain} from '../../api/asset'

export default class WhiteListPopup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            whiteList: [],     /*白名单列表*/
            search: {placeholder: '输入素材名称', value: ''},
            assetsList: [],        /*可添加的设备列表*/
            activeIndex:-1,
        }

        this.columns = [
            {field: "name", title: "名称"},
            {field: "id", title: "编号"},
        ];

        this.onCancel = this.onCancel.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.searchChange = this.searchChange.bind(this);
        this.itemDelete = this.itemDelete.bind(this);
        this.initWhiteList = this.initWhiteList.bind(this);
        this.updateWhiteList = this.updateWhiteList.bind(this);
        this.initAssetsList = this.initAssetsList.bind(this);
    }

    componentWillMount(){  //需要更新data
        this.mounted = true;
        this.initWhiteList();
        ['lc','screen','xes'].forEach(key=>{
            getAssetsBaseByModelWithDomain(key,this.props.domainId, data =>{
                this.mounted && this.initAssetsList(data)
            });
        })  
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    initWhiteList() {
        const {id} = this.props;
        getWhiteListById(id, data=>{ 
            this.mounted && this.updateWhiteList(data)
            this.props.callFun && this.props.callFun();
        });
    }

    updateWhiteList(data){
        let whiteList = data.map(item=>{
            return {id:item.id,name:item.name}
        })
        this.setState({whiteList:whiteList});
    }

    onAdd() {                  //向whitelist中添加需要的数据,然后更新列表视图
        const {search, assetsList} = this.state
        let curItem = null
        for(var key in assetsList){
            if(assetsList[key].name == search.value){
                curItem = assetsList[key];                
            }
        }
        if(curItem == null){
            return;
        }
        let gatewayId = this.props.id;  //灯集中控制器的id
        let lcId = curItem.id;   
        addLcToWhiteListById(gatewayId, lcId, ()=>{
            this.initWhiteList()
            this.searchChange('');
        })
        
    }


    itemDelete(e) {   //从whiteList中删除资产
        let lcId = e.target.id;
        let gatewayId = this.props.id;
        delLcFromWhiteListById(gatewayId, lcId, this.initWhiteList)
    }

    /*获取可添加到白名单的资产列表*/
    initAssetsList(data) {
        let {assetsList} = this.state;
        data.forEach(item=>assetsList.push(item))
        this.setState({assetsList:assetsList});
    }

    onCancel() {
        this.props.overlayerHide();
    }

    onConfirm() {
        this.props.overlayerHide();
        this.props.onConfirm && this.props.onConfirm();
    }

    onChange(e) {
        let id = e.target.id;
        this.setState({[id]: e.target.value});
    }

    searchChange(value){
        const { search } = this.state;
        let newValue = Object.assign({}, search, {value:value});
        this.setState({search:newValue});
    }

    render() {
        let {className='', id} = this.props;
        let {search, whiteList} = this.state;
        let {assetsList} = this.state;   //可添加的资产数据
        let datalist = [];
        for(var key in assetsList){
            let item = assetsList[key];
            let value = search.value;
            if (!value || item.name.indexOf(value)>-1){
                datalist.push({id:item.id, value:item.name})
            }
        }
        let footer = <div className='modal-footer'><button type="button" className='btn btn-primary' onClick={this.onConfirm}>完成</button></div>
            
        return <div className={className}>
            <Panel title='白名单' footer={footer} closeBtn={true} closeClick={this.onCancel}>
                <div className="row search-group">
                    <SearchText IsTip={true} datalist = {datalist} placeholder={search.placeholder}  value={search.value} onChange={this.searchChange}/>
                    <button className="btn btn-primary" onClick={this.onAdd}>添加</button>
                </div>
                <div className="table-list">
                    <ul className="table-header">
                    {
                        this.columns.map((item, index) =>(<li key={index} className="tables-cell">{item.title}</li>))
                    }
                        <li className="tables-cell"></li>
                    </ul>
                    <div className="table-body">
                        <ul>
                        {
                            whiteList.map((item, index) => (
                                <li key={item.id} className="body-row clearfix">
                                {
                                    this.columns.map((subItem, subIndex) => (
                                        <div key={subIndex} className="tables-cell cell-right" title={item[subItem.field]}>{item[subItem.field]}</div>
                                    ))
                                }
                                    <div className="tables-cell">
                                        <span id={item.id} className="glyphicon glyphicon-trash" onClick={this.itemDelete}></span>
                                    </div>
                                </li>
                            ))
                        }
                        </ul>
                    </div>
                </div>
            </Panel>
        </div>
    }
}