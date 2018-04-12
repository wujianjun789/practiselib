import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Panel from '../../components/Panel';
import PanelFooter from '../../components/PanelFooter';
import { intlFormat } from '../../util/index';
import '../../../public/styles/permissionManage.less';
import {IsExitInArray,getObjectByKeyObj,spliceInArray,getIndexByKey2} from '../../util/algorithm';
import {FormattedMessage} from 'react-intl';
import {getWhiteListById} from '../../api/domain';
import {getSearchAssets2} from '../../api/asset';
import Immutable from 'immutable';
import SearchText from '../../components/SearchText';
import {updateStrategy} from '../../api/plan';

export default class AddDevicePopup extends Component{
    constructor(props){
        super(props);
        this.state = {
            search: Immutable.fromJS({
                placeholder:intlFormat({en:'please input the name', zh:'输入网关名称'}), 
                value: '',
            }),
            allDevices:[],
            selectedDevices:[],
            devicesId:[],
            allCollapsed:[],
            selectCollapsed:[]
        }
        this.onCancel = this.onCancel.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.requestSearch = this.requestSearch.bind(this);
        this.getWhiteList = this.getWhiteList.bind(this);
        this.addGateway = this.addGateway.bind(this);
        this.addDevice = this.addDevice.bind(this);
        this.deviceDelete = this.deviceDelete.bind(this);
        this.searchChange = this.searchChange.bind(this);
        this.collapsedClick =this.collapsedClick.bind(this);
    }

    componentWillMount() {
        this.mounted = true;
        this.setState({devicesId:this.props.devicesId.concat(),selectedDevices:JSON.parse(JSON.stringify(this.props.selectedDevicesData))})
        this.requestSearch();
      }
    
    componentWillUnmount() {
        this.mounted = false;
    }

    requestSearch() {
        let name = this.state.search.get('value');        
        getSearchAssets2('ssgw',name, data=>this.getWhiteList(data));
    }

    getWhiteList(data){
        if(data.length==0){
            this.setState({allDevices:data});
        }
        let allDevices = []     
        let len = 0;
        const promise = new Promise((resolve, reject) => {
          data.map(item => {
            getWhiteListById(item.id, (res) => {
              len++;
              item.whiteList = res;
              allDevices.push(item)
              if (len == data.length) {
                resolve(allDevices);
              }
            });
          });
        });
        promise.then(allDevices => {
            this.setState({allDevices:allDevices});
        });
    }

    onCancel(){
        this.props.overlayerHide();
    }

    onConfirm(){
        this.props.onConfirm && this.props.onConfirm(this.state.devicesId);
    }

    addGateway(id){
        let{selectedDevices,devicesId,allDevices}=this.state;
        let gateway = getObjectByKeyObj(allDevices,'id',id);

        if(!gateway.whiteList || gateway.whiteList.length==0) return;

        let selectGateway = JSON.parse(JSON.stringify(gateway))

        if(getIndexByKey2(selectedDevices,'id',id)>-1){
            selectedDevices[getIndexByKey2(selectedDevices,'id',id)] = selectGateway;
        }
        else{
            selectedDevices.push(selectGateway);
        }

        gateway.whiteList.map(item=>{
            if(devicesId.indexOf(item.id)<0){
                devicesId.push(item.id);
            }
        })
        this.setState({devicesId:devicesId,selectedDevices:selectedDevices});
    }

    addDevice(deviceId,gatewayId){
        let{selectedDevices,devicesId,allDevices}=this.state;

        let gateway = JSON.parse(JSON.stringify(getObjectByKeyObj(allDevices,'id',gatewayId)));  
        let device = getObjectByKeyObj(gateway.whiteList,'id',deviceId);

        if(!getObjectByKeyObj(selectedDevices,'id',gatewayId)){
            let selectGateway = {
                id : gateway.id,
                name : gateway.name,
                whiteList :[]
            };
            selectGateway.whiteList.push(device);
            selectedDevices.push(selectGateway);
        }
        else{
            selectedDevices[getIndexByKey2(selectedDevices,'id',gateway.id)].whiteList.push(device)
        }
        devicesId.push(deviceId);
        this.setState({devicesId:devicesId,selectedDevices:selectedDevices});
    }

    deviceDelete(deviceId,gatewayId){
        let{selectedDevices,devicesId}=this.state;
        spliceInArray(devicesId,deviceId);
        
        let gateway = getObjectByKeyObj(selectedDevices,'id',gatewayId);

        if(gateway.whiteList.length==1){
            selectedDevices.splice(getIndexByKey2(selectedDevices,'id',gatewayId),1)
        }
        else{
            let index = getIndexByKey2(gateway.whiteList,'id',deviceId);
            selectedDevices[getIndexByKey2(selectedDevices,'id',gatewayId)].whiteList.splice(index,1);
        }
        this.setState({devicesId:devicesId,selectedDevices:selectedDevices});        
    }

    gatewayDelete(id){
        let{selectedDevices,devicesId}=this.state;
        let gateway = Object.assign({},getObjectByKeyObj(selectedDevices,'id',id));          
        selectedDevices.splice(getIndexByKey2(selectedDevices,'id',id),1);
        gateway.whiteList.map(item=>{
            spliceInArray(devicesId,item.id);
        })
        this.setState({devicesId:devicesId,selectedDevices:selectedDevices})        
    }

    searchChange(value){
        this.setState({
          search: this.state.search.update('value', () => value),
        });
    }

    collapsedClick(key,id){
        this.state[key].indexOf(id)>-1?this.state[key].splice(this.state[key].indexOf(id),1):this.state[key].push(id);
        this.setState({[key]:this.state[key]})
    }

    render() {
        let {className = '',title = '',id} = this.props;
        let {allDevices,selectedDevices,search,allCollapsed,selectCollapsed,devicesId} = this.state;
        
        let footer = <PanelFooter funcNames={['onCancel','onConfirm']} btnTitles={['button.cancel','button.confirm']} btnClassName={['btn-default', 'btn-primary']} btnDisabled={[false, false]} onCancel={this.onCancel} onConfirm={this.onConfirm}/>;
        return (
            <Panel className={className} title = {title} footer = {footer} closeBtn = {true} closeClick = {this.onCancel}>
                <div className = 'form-group device-per'>
                    <label className="control-label"><FormattedMessage id='manage.link.gateway'/>:</label>
                    <div className="device-content">
                        <div className='all-device-list'>
                            <SearchText placeholder={search.get('placeholder')} value={search.get('value')}
                                onChange={this.searchChange} submit={this.requestSearch}/>
                            <ul>
                            {
                                allDevices.map((item,index)=>{
                                    return <li key = {index}>
                                        <span className={"glyphicon " + (allCollapsed.indexOf(item.id)>-1 ? "glyphicon-triangle-right" : "glyphicon-triangle-bottom")}  
                                            onClick={()=>{this.collapsedClick('allCollapsed',item.id)}}></span>
                                        <span className={"glyphicon glyphicon-plus"} onClick={()=>{
                                            this.addGateway(item.id)
                                        }}></span>
                                        {item.name}
                                        {allCollapsed.indexOf(item.id)<0 && <ul>
                                            {
                                                item.whiteList.map((device,index)=>{
                                                    return <li key = {index}>
                                                        {    
                                                            devicesId.indexOf(device.id)>-1?<span className='list-node-add'><FormattedMessage id='permission.added'/></span>:
                                                            <span className={'glyphicon glyphicon-plus'} onClick={()=>{
                                                                this.addDevice(device.id,item.id)
                                                            }}></span>
                                                        }
                                                        {device.name}
                                                        </li>
                                                })
                                            }
                                        </ul>}                                  
                                    </li>
                                })
                            }
                            </ul>
                        </div>
                        <div className='device-list'>
                            <ul>
                                {
                                    
                                    selectedDevices.map((item,index)=>{
                                        return <li key = {index}>
                                            <span className={"glyphicon " + (selectCollapsed.indexOf(item.id)>-1 ? "glyphicon-triangle-right" : "glyphicon-triangle-bottom")}  
                                                onClick={()=>{this.collapsedClick('selectCollapsed',item.id)}}></span>
                                            <span className="icon_delete" onClick={()=>this.gatewayDelete(item.id)}></span>
                                            {item.name}
                                            {selectCollapsed.indexOf(item.id)<0 && <ul>
                                            {
                                                item.whiteList.map((device,index)=>{
                                                    return <li key = {index}>
                                                        {    
                                                            <span className="icon_delete" onClick={()=>{
                                                                this.deviceDelete(device.id,item.id)
                                                            }}></span>
                                                        }
                                                        {device.name}
                                                        </li>
                                                })
                                            }
                                        </ul>} 
                                        </li>
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </Panel>
        )
    }
}