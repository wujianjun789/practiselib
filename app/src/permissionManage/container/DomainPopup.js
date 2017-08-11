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
import {getDomainList,getDomainById} from '../../api/domain';
import {getUserDomainList} from '../../api/permission';
export class DomainPopup extends Component{
    constructor(props){
        super(props);
        this.state={
            toggle:'hidden',
            domainList:[{id:1,name:'中国-杭州'},{id:2,name:'中国-上海'}],
            data:{
                name: "中国",
                toggled: true,
                children: [
                    {
                        name: "上海",
                        children: [
                            {
                                name: "闵行",
                            },
                            {
                                name: "徐汇"
                            }
                        ],
                        toggled: true
                    },
                    {
                        name: "江苏",
                        children: [
                            {
                                name: "南京",
                                children: [
                                    {
                                        name: "江浦"
                                    },
                                    {
                                        name: "江宁"
                                    }
                                ],
                                toggled: true
                            },
                            {
                                name: "苏州"
                            }
                        ],
                        toggled: true
                    },
                    {
                        name: "浙江",
                        children: [
                            {
                                name: "杭州"
                            },
                            {
                                name: "金华"
                            }
                        ],
                        toggled: true
                    }
                ],
            }
        }
        this.onCancel = this.onCancel.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.toggleOpen = this.toggleOpen.bind(this);
        this.selectDomain = this.selectDomain.bind(this);
        this.domainDelete = this.domainDelete.bind(this);
        this.domainHandle = this.domainHandle.bind(this);
        this.userDomainHandle = this.userDomainHandle.bind(this);
    }

    componentWillMount(){
        this.mounted = true;
        getUserDomainList(this.props.id,(response)=>{this.mounted && this.userDomainHandle(response)})
        getDomainList((response)=>{this.mounted && this.domainHandle(response)});

    }

    componentWillUnmount(){
        this.mounted = false;
    }

    domainHandle(response){
        console.log('domain');
        console.log(response);
        // response.map((item)=>{

        // })
    }

    userDomainHandle(datas){
        console.log('userDomain');
        console.log(datas);
        // let domainList=[];
        // datas.domains.forEach(item=>{
        //     if(item.parentId>0){ 
        //         getDomainById(item.parentId,(response)=>{
        //             item.name=response.name+'-'+item.name;
        //             domainList.push({id:item.id,name:item.name});
        //             this.setState({domainList:domainList})
        //         })
        //     }
        //     else{
        //         domainList.push({id:item.id,name:item.name});
        //         this.setState({domainList:domainList})
        //     }
                
        // });

        
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

    domainDelete(index){
        let domainList = this.state.domainList;
        domainList.splice(index,1);
        this.setState({domainList:domainList});
    }

    onConfirm(){
        this.props.action.overlayerHide();
    }
    
    render() {
        let {className = '',title = ''} = this.props;
        let {toggle,domainList,data} = this.state;
        let footer = <PanelFooter funcNames={['onCancel','onConfirm']} btnTitles={['取消','确认']} btnClassName={['btn-default', 'btn-primary']} btnDisabled={[false, false]} onCancel={this.onCancel} onConfirm={this.onConfirm}/>;
        return (
            <Panel className={className} title = {title} footer = {footer} closeBtn = {true} closeClick = {this.onCancel}>
                <div className = 'form-group row domain-per'>
                    <label className="col-sm-2 control-label">域权限:</label>
                    <div className="col-sm-10">
                        <div className='col-sm-6 domain-add'>
                            <div className='row'>
                                <button className="btn btn-primary" onClick = {this.toggleOpen}>添加域</button>
                            </div>
                            <div className={`dropdown ${toggle}`}>
                                <button className="dropdown-toggle" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                    选择区域
                                    <span className="glyphicon glyphicon-triangle-bottom"></span>
                                </button>
                                    <div className="dropdown-menu" aria-labelledby="dropdownMenu1" >
                                    <Treebeard data={data} onToggle={(item)=>{this.selectDomain(item)}}/>
                                </div> 
                            </div>
                            <ul className={`domain-list${toggle=='hidden'?'-l':''}`}>
                                {
                                    domainList.map((item,index)=>{
                                        return <li key = {index}>
                                            <span className="icon-table-delete" onClick={()=>this.domainDelete(item.id)}></span>
                                                {item.name}
                                        </li>
                                    })
                                }
                            </ul>
                        </div>
                        <div className='col-sm-6 domain-add-map map-container'>
                            <MapView  option={{mapZoom:false}} mapData={{id:'example'}} />
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