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
import {makeTree} from '../../util/index'
import {updateUserDomain} from '../../api/permission'
import {FormattedMessage,injectIntl} from 'react-intl';

export class DomainPopup extends Component{
    constructor(props){
        super(props);
        this.state={
            toggle:'hidden',
            search:Immutable.fromJS({placeholder:'permission.input.domain', value:''}),
            domainList:Immutable.fromJS([]),
            tree:[],
            nodes:Immutable.fromJS([])
        }
        this.formatIntl = this.formatIntl.bind(this);

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
    }

    componentWillMount(){
        this.mounted = true;
        getUserDomainList(this.props.id,(response)=>{this.mounted && this.userDomainHandle(response)});
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    formatIntl(formatId){
        const {intl} = this.props;
        return intl?intl.formatMessage({id:formatId}):null;
        // return formatId;
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
        let tree = makeTree(response);
        this.setState({tree:tree});
    }

    userDomainHandle(datas){
        this.setState({domainList:Immutable.fromJS(datas.domains)},
            getDomainList((response)=>{
                this.mounted && this.domainHandle(response);
            })
        ) 
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
        updateUserDomain(this.props.id,domainIds)
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
        let footer = <PanelFooter funcNames={['onCancel','onConfirm']} btnTitles={['button.cancel','button.confirm']} btnClassName={['btn-default', 'btn-primary']} btnDisabled={[false, false]} onCancel={this.onCancel} onConfirm={this.onConfirm}/>;
        return (
            <Panel className={className} title = {title} footer = {footer} closeBtn = {true} closeClick = {this.onCancel}>
                <div className = 'form-group row domain-per'>
                    <label className="control-label"><FormattedMessage id='permission.domain'/>:</label>
                    <div className="domain-content">
                        <div className='domain-tree'>
                                <SearchText className="search" placeholder={this.formatIntl(search.get('placeholder'))} value={search.get('value')} onChange={(value)=>this.searchChange(value)}/>
                                <div className='domain-tree-list'>
                                {
                                    tree && tree.map((node)=>{
                                        return <Node key={node.id} tree={node} nodes={nodes} onToggle={this.onToggle} onClick={this.domainAdd}/>
                                    })
                                }
                                </div>
                        </div>
                        <div className='domain-list'>
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

export default connect(mapStateToprops, mapDispatchToProps)(injectIntl(DomainPopup)) 