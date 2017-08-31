import React,{Component} from 'react';
import Panel from '../../components/Panel';
import PanelFooter from '../../components/PanelFooter';
import SearchText from '../../components/SearchText';
import Table from '../../components/Table2';
import Immutable from 'immutable';

import {getWhiteListById} from '../../api/domain';

import {getAssetsBaseByModel} from '../../api/asset'

export default class WhiteListPopup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            whiteList: [],     /*白名单列表*/
            // search: Immutable.fromJS({
            //     placeholder: '输入素材名称',
            //     value: '',
            //     curIndex: -1
            // }), 
            search: {placeholder: '输入素材名称', value: '', curIndex: -1},
            lcsList: [{id: 1, name: "lamp1"}, {id: 2, name: "lamp2"}, {id: 3, name: "lamp3"}],        /*可添加的设备列表*/
        }

        this.columns = [
            {field: "id", title: "名称"},
            {field: "id", title: "编号"},
        ];

        this.onCancel = this.onCancel.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.searchChange = this.searchChange.bind(this);
        this.itemDelete = this.itemDelete.bind(this);
        this.initWhiteList = this.initWhiteList.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
        this.itemClick = this.itemClick.bind(this);
        this.initLcsList = this.initLcsList.bind(this);
    }

    componentWillMount(){  //需要更新data
        this.mounted = true;
        const {id}  = this.props;
        getWhiteListById(id, data=>{ 
            this.mounted && this.initWhiteList(data)
        });
        let model = "lc";
        getAssetsBaseByModel(model, data =>{
            this.mounted && this.initLcsList(data)
        });
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    initWhiteList(data){
        this.setState({whiteList:data});
    }

    /*获取可添加到白名单的单灯列表*/
    initLcsList(data) {
        this.setState({lcsList:data});
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

    onAdd() {
        this.props.onAdd && this.props.onAdd();
    }

    searchChange(value){

        const { search } = this.state;
        let newValue = Object.assign({}, search, {value:value});
        this.setState({search:newValue});

    }


    itemClick(itemIndex){
        const {search} = this.state;
        let newValue = Object.assign({}, search, {curIndex:itemIndex});
        this.setState({search:newValue});
    }

    searchSubmit(){
        const {search} = this.state;
        let value = search.value;
        this.props.searchSubmit && this.props.searchSubmit(value);
        let newValue = Object.assign({}, search, {value: value})
        this.setState({search: newValue});
    }

    itemDelete(e) {
        this.props.itemDelete && this.props.itemDelete(e.target);
    }

    render() {
        let {className='', data, id} = this.props;
        let {search, whiteList} = this.state;
        let {lcsList} = this.state;   //可添加的单灯数据
        // console.log("lcsList:", lcsList);  //数据已成功获取
        let datalist = [];
        for(var key in lcsList){
            let item = lcsList[key];
            let value = search.value;
            if (!value || item.name.indexOf(value)>-1){
                datalist.push({id:item.id, value:item.name})
            }
        }

        let footer = <PanelFooter funcNames={['onCancel','onConfirm']} btnTitles={['取消','确认']} btnClassName={['btn-default', 'btn-primary']}
                                  btnDisabled={[false, false]} onCancel={this.onCancel} onConfirm={this.onConfirm}/>;

        return <div className={className}>
            <Panel title='白名单' footer={footer} closeBtn={true} closeClick={this.onCancel}>
                <div className="row search-group">
                    <SearchText IsTip={true} datalist = {datalist} placeholder={search.placeholder}  value={search.value} 
                        onChange={this.searchChange} itemClick={this.itemClick} submit={this.searchSubmit}/>
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
                                        <div key={subIndex} className="tables-cell">{item[subItem.field]}</div>
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