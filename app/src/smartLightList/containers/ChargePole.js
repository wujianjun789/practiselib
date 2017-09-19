/**
 * Created by Azrael on 2017/9/1.
 */
import '../../../public/styles/smartLightManage-list.less';
import React,{Component} from 'react';
import Content from '../../components/Content';
import Select from '../../components/Select.1';
import SearchText from '../../components/SearchText';
import Table from '../../components/Table2';
import Page from '../../components/Page';
import {getDomainList} from '../../api/domain'
import {getSearchAssets,getSearchCount} from '../../api/asset'
export default class ChargePole extends Component {
    constructor(props){
        super(props);
        this.state={
            page:{
                total:0,
                current:1,
                limit:10
            },
            search:{
                value:'',
                placeholder:'请输入设备名称',
            },
            sidebarCollapse:false,
            currentDevice:null,
            deviceList:[],
            currentDomain:null,
            domainList:{
                titleField:'name',
                valueField:'name',
                options:[]
            },
            currentSwitchStatus:''
        }
    }
    componentWillMount(){
        this.mounted=true;//实例属性
        this.initData();
    }
    componentWillMount(){
        this.mounted=false;
    }
    initData=()=>{
        getDomainList(data=>{
            this.mounted&&this.updateDomainData(data);
            this.mounted&&this.initDeviceData();
        });
    }
    updateDomainData=(data)=>{
        let currentDomain,
            options=data;
        if(data.length===0){
            currentDomain=null;
        }else{
            currentDomain=data[0];
        }
        this.setState({domainList:{...this.state.domainList,options},currentDomain})
    }
    initDeviceData=isSearch=>{
        const {search:{value},page,currentDomain}=this.state;
        if(isSearch){
            page.current=1;
            this.setState({page:page})
        }
        const {limit,current}=this.state.page;
        const offset=limit*(current-1);
        getSearchAssets(currentDomain?currentDomain.id:null,this.model,value,offset,limit,this.mounted&&this.updateDeviceData);
        getSearchCount(currentDomain?currentDomain.id:null,this.model,value,this.mounted&&this.updatePageSize)
    }
    updateDeviceData=data=>{
        let currentDevice=data.length===0?null:data[0];
        this.setState({deviceList:data,currentDevice});
    }
    updatePageSize=data=>{
        this.setState({page:{...this.state.page,total:data.count}})
    }
    render(){
        const {page:{total,current,limit},sidebarCollapse,currentDevice,deviceList,
                search:{value,placeholder},currentDomain,domainList,deviceSwitchList}=this.state;
        const disabled=deviceList.length===0?true:false;
        return <Content className={`list-charge-pole ${sidebarCollapse?'collapse':''}`}>
                    <div className='content-left'>
                        <div className="heading">
                            <Select id='domain' titleField={domainList.titleField} valueField={domainList.valueField}
                                options={domainList.options} value={currentDomain===null?'':currentDomain[domainList.valueField]}/>
                            <SearchText/>
                        </div>
                        <div className="table-container">
                            <Table/>
                            <Page className='page'/>
                        </div>
                    </div>
                    <div className="container-fluid sidebar-info">
                        <div className="row collapse-container">
                            <span className="icon_verital"></span>
                        </div>
                        <div className="panel panel-default panel-1">
                            <div className="panel-heading">
                                <svg><use xlinkHref={"#icon_sys_select"} transform="scale(0.08,0.08)" x="0" y="0" viewBox="0 0 20 20" width="200" height="200"/></svg>选中设备
                            </div>
                            <div className="panel-body">
                                <span className="domain-name"></span>
                            </div>
                        </div>
                    </div>
                </Content>
    }
}