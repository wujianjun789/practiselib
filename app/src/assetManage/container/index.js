/**
 * Created by a on 2017/7/17.
 */
import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {injectIntl} from 'react-intl';

import '../../../public/styles/assetManage-model.less';
import '../../../public/styles/assetManage-statistics.less'

import HeadBar from '../../components/HeadBar'
import SideBar from '../../components/SideBar'
import Overlayer from '../../common/containers/Overlayer'

import {getModelData, TreeData} from '../../data/assetModels'
import {treeViewInit} from '../../common/actions/treeView'

import {sideBarToggled} from '../action/index'
class AssetManageIndex extends Component{
    constructor(props){
        super(props);

        this.initTreeData = this.initTreeData.bind(this);
        this.onToggle = this.onToggle.bind(this);
    }

    componentWillMount(){
        this.mounted = true;
        getModelData(()=>{this.mounted && this.initTreeData()});
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    componentDidMount(){
    }

    initTreeData(){
        this.props.actions.treeViewInit(TreeData)
    }

    onToggle(node){
        const {actions} = this.props;
        actions.sideBarToggled(node);
    }

    render(){
        let path = "";
        const {routes} = this.props;
        if(routes.length>3){
            path = routes[3].path;
        }

        return <div className={"container "+"asset-"+path}>
            <svg className="svgOnload" > 
                <symbol id="icon_statistics"><path d="M187.254,188.308H12.495c-4.968,0-8.995-4.027-8.995-8.995V40.059c0-12.809,18.118-13.059,18.118,0v130.13h165.636c5.003,0,9.059,4.056,9.059,9.059S192.257,188.308,187.254,188.308L187.254,188.308z M125.375,150c-6.625,0-12.008-5.683-12.008-10.65V81.307c0-4.968,5.263-10.64,11.638-10.64c6.375,0,11.621,5.672,11.621,10.64v57.785C136.625,144.06,132,150,125.375,150z M86.75,149.5c-6.625,0-11.676-5.183-11.676-10.15V45.199c0-4.968,5.801-9.824,11.926-9.824s11.332,4.856,11.332,9.824v93.894C98.332,144.06,93.375,149.5,86.75,149.5z M163.992,149.982c-6.5,0-12.075-5.664-12.075-10.632V45.199c0-4.968,5.083-10.449,11.833-10.449s11.425,5.481,11.425,10.449v93.894C175.175,144.06,170.492,149.982,163.992,149.982zM36.653,139.35v-18.118c0-4.968,4.722-10.981,11.972-10.981s11.286,6.014,11.286,10.981v17.861c0,4.968-5.036,10.407-11.286,10.407S36.653,144.317,36.653,139.35z"/></symbol>
            </svg>
            <HeadBar moduleName={this.props.intl.formatMessage({id:"app.asset.manage"})} router={this.props.router}/>
            <SideBar onToggle={this.onToggle}/>
            {this.props.children}
            <Overlayer />
        </div>
    }
}

function mapStateToProps(state) {
    return {
        userCenter:state.userCenter
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            treeViewInit: treeViewInit,
            sideBarToggled: sideBarToggled
        }, dispatch)
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(injectIntl(AssetManageIndex));