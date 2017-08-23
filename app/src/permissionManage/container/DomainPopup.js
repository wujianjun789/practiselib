import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Panel from '../../components/Panel';
import PanelFooter from '../../components/PanelFooter';
import {overlayerHide} from '../../common/actions/overlayer';
import '../../../public/styles/permissionManage.less';
import Immutable from 'immutable';
import {Treebeard} from 'react-treebeard';
// import treeStyle from '../../components/treeStyle';
import MapView from '../../../src/components/MapView';
import {getDomainList,getDomainById,getDomainListByParentId} from '../../api/domain';
import {getUserDomainList} from '../../api/permission';
import SearchText from '../../components/SearchText';
import Node from '../../components/Node';
import {getIndexByKey,getObjectByKey,getListKeyByKeyFuzzy,getObjectByKeyObj,getListKeyByKey} from '../../util/algorithm';
const _ = require('lodash');
import {updateUserDomain} from '../../api/permission'
export class DomainPopup extends Component{
    constructor(props){
        super(props);
        this.state={
            toggle:'hidden',
            search:Immutable.fromJS({placeholder:'输入域名称', value:''}),
            domainList:Immutable.fromJS([{id:1,name:'中国-杭州'},{id:2,name:'中国-上海'}]),
            tree:[],
            nodes:Immutable.fromJS([
                {id:1,name:'中国',toggle:true,isAdd:false,hidden:false},
                {id:2,name:'上海',toggle:true,isAdd:false,hidden:false},
                {id:3,name:'武汉',toggle:true,isAdd:true,hidden:false},
                {id:4,name:'闵行',toggle:false,isAdd:true,hidden:false},
                {id:5,name:'莘庄',toggle:true,isAdd:true,hidden:true},
                {id:6,name:'七宝',toggle:true,isAdd:true,hidden:false},
                {id:7,name:'浦东',toggle:true,isAdd:false,hidden:false}
            ])
        }
        this.onCancel = this.onCancel.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.toggleOpen = this.toggleOpen.bind(this);
        this.selectDomain = this.selectDomain.bind(this);
        this.domainDelete = this.domainDelete.bind(this);
        this.domainHandle = this.domainHandle.bind(this);
        this.userDomainHandle = this.userDomainHandle.bind(this);
        this.onToggle = this.onToggle.bind(this);
        this.searchChange = this.searchChange.bind(this);
        this.getParentDomain = this.getParentDomain.bind(this);
        this.getChildsDomain = this.getChildsDomain.bind(this);
        this.domainAdd = this.domainAdd.bind(this);
        this.dataInit =this.dataInit.bind(this);
    }

    componentWillMount(){
        this.mounted = true;
        this.dataInit();
    }

    dataInit(){
        getUserDomainList(this.props.id,(response)=>{this.mounted && this.userDomainHandle(response)})
        getDomainList((response)=>{this.mounted && this.domainHandle(response)});
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    domainHandle(response){
        let domainList = this.state.domainList;
        
        response.map(item=>{
            let parent = getObjectByKeyObj(response,'id',item.parentId);
            item.isAdd = parent && parent.isAdd?true:(getIndexByKey(domainList,'id',item.id)>-1?true:false);
            item.toggle = true;
            item.hidden = false;            
        })
        this.setState({nodes:Immutable.fromJS(response)});
        let tree = this.makeTree(response);
        this.setState({tree:tree});
    }

    makeTree(pre) {
        const data = pre.map((v)=>{
          if(!v.parentId) v.parentId='';
          return v;
        })
        let groupedByParents = _.groupBy(data, 'parentId');
        let keysById = _.keyBy(data, 'id');
        _.each(_.omit(groupedByParents, ''), function(children, parentId) {
            keysById[parentId].children = children; 
        });
        return groupedByParents[''];
      }

    userDomainHandle(datas){
        this.setState({domainList:Immutable.fromJS(datas.domains)})
    }

    onCancel(){
        this.props.action.overlayerHide();
    }

    toggleOpen(){
        this.setState({toggle:''});
    }

    selectDomain(){
        this.setState({toggle:'hidden'});
    }

    domainDelete(id){
        let {domainList} = this.state;
        let index = getIndexByKey(domainList,'id',id)
        this.setState({domainList:domainList.delete(index)},()=>{this.isAddDataHandle(id)});
    }

    domainAdd(id){
        let {domainList} = this.state;
        let node = getObjectByKey(this.state.nodes,'id',id);
        this.setState({domainList:domainList.push(node)},()=>{this.isAddDataHandle(id)});
    }
    
    isAddDataHandle(id){
        let {domainList,nodes} = this.state;
        // let index = getIndexByKey(nodes,'id',id);
        // let node = getObjectByKey(nodes,'id',id)
        // node = node.update('isAdd',v=>!v);
        // nodes= nodes.set(index,node);
        // let newNodes = nodes.map(item=>{
        //     let parent = getObjectByKey(nodes,'id',item.get('parentId'));
        //     return item.update('isAdd',v=>(parent && parent.get('isAdd'))?true:(getIndexByKey(domainList,'id',item.get('id'))>-1?true:false));
        // })
        let newNodes = nodes.toJS();
        newNodes.map(item=>{
            let parent = getObjectByKeyObj(newNodes,'id',item.parentId);
            item.isAdd = parent && parent.isAdd?true:(getIndexByKey(domainList,'id',item.id)>-1?true:false);
        })
        this.setState({nodes:Immutable.fromJS(newNodes)});
    }
    
    onConfirm(){
        let {domainList} = this.state;
        let domainIds = [];
        domainList.map(item=>{
            domainIds.push(item.get('id'));
        })
        updateUserDomain(this.props.id,domainIds,this.dataInit)
        this.props.action.overlayerHide();
    }

    onToggle(id){
        let nodes = this.state.nodes;
        let index = getIndexByKey(nodes,'id',id);
        let node = getObjectByKey(nodes,'id',id)
        node = node.update('toggle',v=>!v);
        nodes= nodes.set(index,node);
        this.setState({nodes:nodes});
    }

    searchChange(value){
        let {nodes} = this.state;
        let searchNodes = getListKeyByKeyFuzzy(this.state.nodes,'name',value,'id');
        let searchResult=[];
        searchNodes.map(id=>{
            searchResult.push(id);
            this.getParentDomain(id,searchResult);
            this.getChildsDomain(id,searchResult);
        })
        let newNodes = nodes.map(item=>{
            return item.update('hidden',v=>searchResult.indexOf(item.get('id'))<0?true:false).update('toggle',v=>true);
        })
        this.setState({search:this.state.search.update('value', v=>value),nodes:newNodes})
    }

    getParentDomain(id,searchResult){
        let {nodes} = this.state;    
        let parent = getListKeyByKey(nodes,'id',id,'parentId');
        parent[0] && searchResult.push(parent[0]) && this.getParentDomain(parent[0],searchResult);
    }

    getChildsDomain(id,searchResult){
        let {nodes} = this.state;  
        let childs = getListKeyByKey(nodes,'parentId',id,'id');
        childs.length!==0 && childs.forEach(id=>{
            searchResult.push(id);
            this.getChildsDomain(id,searchResult);
        });
    }

    render() {
        let {className = '',title = ''} = this.props;
        let {toggle,domainList,data,tree,nodes,search} = this.state;
        let footer = <PanelFooter funcNames={['onCancel','onConfirm']} btnTitles={['取消','确认']} btnClassName={['btn-default', 'btn-primary']} btnDisabled={[false, false]} onCancel={this.onCancel} onConfirm={this.onConfirm}/>;
        return (
            <Panel className={className} title = {title} footer = {footer} closeBtn = {true} closeClick = {this.onCancel}>
                <div className = 'form-group row domain-per'>
                    <label className="col-sm-2 control-label">域权限:</label>
                    <div className="col-sm-10">
                        <div className='col-sm-6 domain-add'>
                            <SearchText className="search" placeholder={search.get('placeholder')} value={search.get('value')} onChange={(value)=>this.searchChange(value)}/> 
                            <div className='domain-tree'>
                                {
                                    tree && tree.map((node)=>{
                                        return <Node key={node.id} tree={node} nodes={nodes} onToggle={this.onToggle} onClick={this.domainAdd}/>
                                    })
                                }
                            </div>
                        </div>
                        <div className='col-sm-6 domain-list'>
                            <ul>
                                {
                                    domainList.map((item,index)=>{
                                        return <li key = {index}>
                                            <span className="icon-table-delete" onClick={()=>this.domainDelete(item.get('id'))}></span>
                                                {item.get('name')}
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

const mapStateToprops = (state, ownProps) => {
    return{
        
    }
}

const mapDispatchToProps = (dispatch, ownProps) =>{
    return {
        action: bindActionCreators({
            overlayerHide:overlayerHide,
        }, dispatch)
    }
}

export default connect(mapStateToprops, mapDispatchToProps)(DomainPopup) 