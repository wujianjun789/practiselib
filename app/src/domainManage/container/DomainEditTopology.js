/**
 * Created by a on 2017/8/1.
 */
import React,{Component} from 'react'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import Content from '../../components/Content'
import SideBarInfo from '../../components/SideBarInfo'
import SearchText from '../../components/SearchText'

import DomainPopup from '../component/DomainPopup'
import ConfirmPopup from '../../components/ConfirmPopup'
import {overlayerShow, overlayerHide} from '../../common/actions/overlayer'

import {getDomainList, getParentDomainList, getDomainListByParentId, addDomain, updateDomainById, deleteDomainById} from '../../api/domain'

import Immutable from 'immutable';
import {getStringlistByLanguage, validEnglishStr, validChinaStr} from '../../util/string'
import {getLanguage, getObjectByKey, getIndexByKey, getElementOffwidth} from '../../util/index'
import {FormattedMessage,injectIntl} from 'react-intl';
import { intlFormat } from '../../util/index';

class DomainEditTopology extends Component{
    constructor(props){
        super(props)
        this.state = {
            language: getLanguage(),
            collapse: false,
            IsUpdate:false,
            domainUpdate:{id:null, domain:null},

            selectDomain: {
                id:"domain",
                latlng:{lng: null, lat: null},
                position: [/*{
                 "device_id": 1,
                 "device_type": 'DEVICE',
                 lng: 121.49971691534425,
                 lat: 31.239658843127756
                 }*/],
                parentId:null,
                data: []
            },
            // search: Immutable.fromJS({placeholder: '输入域名称', value: ''}),
            search: Immutable.fromJS({placeholder:intlFormat({en:'please input the name',zh:'输入域名称'}), value: ''}),
            domainList:[]
        }

        this.domainList = [];

        this.getDatalist = this.getDatalist.bind(this);
        this.renderChild = this.renderChild.bind(this);
        this.itemClick = this.itemClick.bind(this);
        this.initSelectDomain = this.initSelectDomain.bind(this);
        this.updateSelectDomain = this.updateSelectDomain.bind(this);

        this.collpseHandler = this.collpseHandler.bind(this);
        this.domainHandler = this.domainHandler.bind(this);
        this.getDomainParentList = this.getDomainParentList.bind(this);

        this.requestDomain = this.requestDomain.bind(this);
        this.requestCurDomain = this.requestCurDomain.bind(this);
        this.initDomain = this.initDomain.bind(this);
        this.updateDomain = this.updateDomain.bind(this);
        this.delDomain = this.delDomain.bind(this);
    }

    componentWillMount(){
        this.mounted = true;
        this.requestDomain();
        this.requestCurDomain(null);
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    requestDomain(){
        getParentDomainList(data=>{if(this.mounted){this.domainList=data;this.domainList.unshift({id:null, name:"无"});}});
    }

    requestCurDomain(parentId){
        getDomainListByParentId(parentId, (parentId,data)=>{this.mounted && this.initDomain(parentId, data)})
    }

    initDomain(parentId, data){
        if(parentId == null){
            this.setState({domainList:data})
            return;
        }
        if(this.state.IsUpdate && this.state.domainUpdate.id){
            this.state.domainList = this.delDomain(this.state.domainUpdate.id, this.state.domainList);
        }

        let newlist = this.updateDomain(parentId, data, this.state.domainList);
        this.setState({domainList:newlist});
    }

    delDomain(id, list){
        let curIndex = getIndexByKey(list, 'id', id);
       if(curIndex >-1){
           this.state.domainUpdate.domain = list.splice(curIndex, 1);
           return list;
       }else{
           return list.map(domain=>{
               if(domain.children){
                   domain.children = this.delDomain(id, domain.children);
                   return domain;
               }

               return domain
           })
       }
    }

    updateDomain(parentId, data, list){
        return list.map(domain=>{
            if(this.IsCurGroup(parentId, list)){
                if(this.state.IsUpdate && data && data.length){
                    if(domain.id == parentId){
                        let childrens = [];
                        if(!domain.children){
                            domain.children = [];
                        }

                       childrens = data.map(children=>{
                           let curDomain = getObjectByKey(domain.children, 'id', children.id)
                           if(curDomain){
                               return Object.assign({}, curDomain, children);
                           }else{
                               return children;
                           }

                       })

                        domain.active = true;
                        domain.children = childrens;
                        return domain;
                    }else{
                        domain.active = false;
                    }

                    if(domain.children && domain.children.length){
                        this.updateDomain(parentId, data, domain.children);
                    }

                    return domain;
                }

                if(domain.id == parentId){
                    // if(data.length){
                    domain.active = true;
                    domain.children = data;
                    return domain;
                }else{
                    // if(!data.length){
                        domain.active = false;
                    // }
                }
            }

            if(domain.children && domain.children.length){
                this.updateDomain(parentId, data, domain.children)
            }
            return domain;
        })
    }

    IsCurGroup(parentId, list){
        for(let key in list){
            if(list[key].id == parentId){
                return true;
            }
        }

        return false;
    }

    itemClick(item){
        this.setState({IsUpdate:false}, ()=>{
            this.requestCurDomain(item.id);
            this.updateSelectDomain(item);
        })
    }

    initSelectDomain(){
        let selectDomain = this.state.selectDomain;
        this.setState({selectDomain:Object.assign({}, selectDomain, {latlng:{lng:null, lat:null}},{position:[]}, {parentId:null}, {data:[]})})
    }

    updateSelectDomain(domain){
        let selectDomain = this.state.selectDomain;
        selectDomain.latlng = domain.geoPoint;
        selectDomain.position.splice(0)
        selectDomain.position.push(Object.assign({}, {"device_id":domain.id, "device_type":"DEVICE"}, domain.geoPoint))
        selectDomain.parentId = domain.parentId;
        selectDomain.data.splice(0);
        selectDomain.data.push({id:domain.id, name:domain.name});
        this.setState({selectDomain:selectDomain})
    }

    getDomainParentList(){
        const {selectDomain} = this.state;
        let domainList = this.domainList.slice(0);
        let domainId = selectDomain.data.length && selectDomain.data[0].id;
        if(domainId){
            let index = getIndexByKey(domainList, 'id', domainId);
            if(index>-1){
                domainList.splice(index, 1);
            }
        }

        return domainList;
    }

    domainHandler(id){
        const {selectDomain} = this.state
        const {actions} = this.props;
        switch(id){
            case 'add':
                actions.overlayerShow(<DomainPopup title={intlFormat({en:'add domain',zh:'添加域'})} data={{domainId:"", domainName:"",
                lat:"", lng:"", prevDomain:''}}
                                                   domainList={{titleKey:'name', valueKey:'name', options:this.domainList}}
                                                   onConfirm={(data)=>{
                                                        let domain = {};
                                                        domain.name = data.domainName;
                                                        domain.geoType = 0;
                                                        domain.geoPoint = {lat:data.lat, lng:data.lng};
                                                        domain.parentId = data.prevDomain;

                                                        addDomain(domain, ()=>{
                                                            actions.overlayerHide();
                                                            this.requestDomain();
                                                            this.requestCurDomain(data.prevDomain);
                                                        })
                                                   }}
                                                   onCancel={()=>{actions.overlayerHide()}}/>);
                break;
            case 'update':
                let lat="", lng="",updateId="",name="",parentId="";

                if(selectDomain.position && selectDomain.position.length){
                    let latlng = selectDomain.position[0];
                    lat = latlng.lat?latlng.lat:"";
                    lng = latlng.lng?latlng.lng:"";
                }

                if(selectDomain.data && selectDomain.data.length){
                    let data = selectDomain.data[0];
                    updateId = data.id;
                    name = data.name;
                }
                actions.overlayerShow(<DomainPopup title={intlFormat({en:'edit domain',zh:'修改域属性'})} data={{domainId:updateId, domainName:name,
                lat:lat, lng:lng, prevDomain:selectDomain.parentId?selectDomain.parentId:''}}
                                                   domainList={{titleKey:'name', valueKey:'name', options:this.getDomainParentList()}}
                                                   onConfirm={(data)=>{
                                                        let domain = {};
                                                        domain.id = data.domainId;
                                                        domain.name = data.domainName;
                                                        domain.geoType = 0;
                                                        domain.geoPoint = {lat:data.lat, lng:data.lng};
                                                        domain.parentId = data.prevDomain;
                                                        updateDomainById(domain, ()=>{
                                                            actions.overlayerHide();
                                                            this.requestDomain();
                                                            this.setState({IsUpdate:true, domainUpdate:{id:data.domainId}}, ()=>{
                                                                this.requestCurDomain(data.prevDomain);
                                                            })
                                                        })
                                                    }}
                                                   onCancel={()=>{actions.overlayerHide()}}/>);
                break;
            case 'delete':
                let curId="";
                if(selectDomain.data && selectDomain.data.length){
                    let data = selectDomain.data[0];
                    curId = data.id;
                }
                actions.overlayerShow(<ConfirmPopup iconClass="icon_popup_delete" tips={intlFormat({en:'delete the domain?',zh:'是否删除选中域？'})}
                                                    cancel={()=>{actions.overlayerHide()}}
                                                    confirm={()=>{deleteDomainById(curId,()=>{
                                                            actions.overlayerHide();
                                                            this.requestDomain();
                                                            this.requestCurDomain(selectDomain.parentId);
                                                            if(selectDomain.parentId){
                                                                let parentDomain = getObjectByKey(this.domainList, 'id', selectDomain.parentId);
                                                                this.updateSelectDomain(parentDomain);
                                                            }
                                                        })
                                                   }}/>);
                break;
        }
    }

    collpseHandler() {
        this.setState({collapse: !this.state.collapse})
    }

    getDatalist(list, renderList){
        list.map(domain=>{
            domain.active && renderList.push(domain) && domain.children && this.getDatalist(domain.children, renderList);
        })
    }

    renderChild(list, depth, parentLen){
        return <div key={depth} className='row'>
        <ul className={(depth==0?"topology-0 ":("topology-x "))+(list && list.length?'children':'')+" topology-list"} style={{minWidth:parentLen*154+"px"}}>
            {
                list.map(item=>{

                    if(!item.name){
                        return <li key={item.id} className={(item.active?'active ':' ')+(item.children && item.children.length?'children':'')} title={item.name}
                                   onClick={()=>this.itemClick(item)}></li>
                    }

                    let len = 0;
                    let curIndex = 0

                    for(var i=0;i<item.name.length;i++){
                         let s = item.name.charAt(i);
                        if(validChinaStr(s)){
                            len += 2;
                        }else{
                            len += 1;
                        }

                        if(len>=12){
                            curIndex = i+1;
                            break;
                        }else if(i==item.name.length-1){
                            curIndex = i+1;
                        }
                    }

                    let value = item.name.slice(0, curIndex);

                        return <li key={item.id} className={(item.active?'active ':' ')+(item.children && item.children.length?'children':'')} title={item.name}
                                   onClick={()=>this.itemClick(item)}><div>{value}</div></li>

                    let strs = getStringlistByLanguage(value);
                    return <li key={item.id} className={(item.active?'active ':' ')+(item.children && item.children.length?'children':'')} title={item.name}
                    onClick={()=>this.itemClick(item)}>{
                        strs.map((str, index)=>{
                            let className = ""
                            let width = 0;
                            if(validEnglishStr(str)){
                                className = "en";
                                width = getElementOffwidth(str, "16px")-16;
                            }else{
                                className = "zh";
                                width = 0;
                            }
                            return <div key={index} className={className} style={{"marginBottom":width}}>{str}</div>
                        })
                    }</li>
                })
            }
        </ul>
      </div>
    }

    render(){
        const {language, collapse, search,  selectDomain, domainList} = this.state;
        
        let curDomain = domainList;
        let renderList = [];
        this.getDatalist(curDomain, renderList);
        let lastParentLen = curDomain.length;
        let parentLen = null;
        let disabled = selectDomain.data.length?false:true;
        return <Content className={'offset-right topology-mode '+(collapse?'collapsed':'')}>
                <div className="heading">
                    <SearchText placeholder={search.get('placeholder')} value={search.get('value')}
                                onChange={this.searchChange} submit={this.searchSubmit}/>
                    <button className="btn btn-primary add-domain" onClick={()=>this.domainHandler('add')}>{this.props.intl.formatMessage({id:'button.add'})}</button>
                </div>
                <div className={"topology-mode "+language}>
                    {
                        this.renderChild(curDomain, 0, 0)
                    }
                    {
                        renderList.map((domain, index)=>{
                             if(parentLen) {lastParentLen = parentLen;}
                             parentLen = domain.children.length;
                            return this.renderChild(domain.children, index+1, lastParentLen)
                        })
                    }
                </div>
                <SideBarInfo mapDevice={selectDomain} collpseHandler={this.collpseHandler}>
                    <div className="panel panel-default device-statics-info">
                        <div className="panel-heading">
                            <span className="icon_info"></span>{this.props.intl.formatMessage({id:'domain.property'})}
                        </div>
                        <div className="panel-body domain-property">
                            <span className="domain-name">{selectDomain.data.length?selectDomain.data[0].name:""}</span>
                            <button className="btn btn-primary pull-right" onClick={()=>this.domainHandler('update')} disabled = {disabled}>{this.props.intl.formatMessage({id:'button.edit'})}</button>
                            <button className="btn btn-danger pull-right" onClick={()=>this.domainHandler('delete')} disabled = {disabled}>{this.props.intl.formatMessage({id:'button.delete'})}</button>
                        </div>
                    </div>
                </SideBarInfo>
            </Content>

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
)(injectIntl(DomainEditTopology));