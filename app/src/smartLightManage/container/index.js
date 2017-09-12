/**
 * Created by a on 2017/8/24.
 */
import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import '../../../public/styles/smartLightManage-map.less';
import '../../../public/styles/smartLightManage-control.less';

import HeadBar from '../../components/HeadBar'
import SideBar from '../../components/SideBar'
import Overlayer from '../../common/containers/Overlayer'

import {TreeData} from '.././../data/smartLightModel'
import {treeViewInit} from '../../common/actions/treeView'
// import {sideBarToggled} from '../action/index'
class SystemOperationIndex extends Component{
    constructor(props){
        super(props);
        this.initTreeData = this.initTreeData.bind(this);
        this.onToggle = this.onToggle.bind(this);
    }

    componentWillMount(){

        this.mounted = true;
        this.mounted && this.initTreeData();
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    componentDidMount(){
    }

    initTreeData(){
        this.props.actions.treeViewInit(TreeData);
    }

    onToggle(node){
        // console.log(node);
        // this.props.actions.sideBarToggled(node);
    }

    render(){
        let path = "";
        const {children} = this.props;
        if(children){
            path = children.props.route.path;
        }
        return <div className={"container smartLight-"+path}>
            <svg className="svgOnload" >
                <symbol id="icon_sys_select"><path d="M155.345,71.726c-0.216-3.823-1.282-6.092-3.889-8.699c-5.287-5.287-13.352-1.437-15.38,0.625l-50.994,52.11L62.997,93.429
        c-4.147-4.283-10.981-4.393-15.263-0.246c-0.083,0.081-0.165,0.162-0.246,0.246c-4.256,4.342-4.256,11.291,0,15.633l30.15,30.15
        c4.147,4.283,10.981,4.393,15.263,0.246c0.083-0.081,59.18-60.172,59.18-60.172c2.07-2.111,3.229-4.764,3.266-7.54l25.295-10.278
        c0.002,28.048,0.006,84.131,0.006,94.365c0,14.98-14.471,24.814-24.814,24.814c-10.343,0-94.496,0-111.665,0
        s-24.814-16.66-24.814-24.814c0-8.155,0-100.749,0-111.665s8.427-24.814,24.814-24.814c17.065,0,110.857,0,110.857,0
        s25.622-0.021,25.622,30.097c0.915-0.328,12.407-4.704,12.407-4.704c0-20.557-16.665-37.8-37.222-37.8H44.167
        c-20.557,0-37.222,16.665-37.222,37.222v111.665c0,20.557,16.665,37.222,37.222,37.222h111.665
        c20.557,0,37.222-16.665,37.222-37.222V44.767l-12.415,4.72c0,0,0.001-0.907,0.002,11.956L155.345,71.726z"/></symbol>
                </svg>
            <HeadBar moduleName={"智慧路灯"} router={this.props.router}/>
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
            // sideBarToggled: sideBarToggled
        }, dispatch)
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SystemOperationIndex);