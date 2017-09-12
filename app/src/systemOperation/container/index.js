/**
 * Created by a on 2017/8/1.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import '../../../public/styles/systemOperation-config.less';
import '../../../public/styles/systemOperation-strategy.less';
import '../../../public/styles/systemOperation-sysConfig.less';
import '../../../public/styles/systemOperation-serviceMonitoring.less';

import HeadBar from '../../components/HeadBar'
import SideBar from '../../components/SideBar'
import Overlayer from '../../common/containers/Overlayer'

import { getModelData, TreeData } from '.././../data/systemModel'
import { treeViewInit } from '../../common/actions/treeView'
import { sideBarToggled } from '../action/index'
import { intlFormat, getClassByModel } from '../../util/index'

class SystemOperationIndex extends Component {
    constructor(props) {
        super(props);
        this.initTreeData = this.initTreeData.bind(this);
        this.onToggle = this.onToggle.bind(this);
    }

    componentWillMount() {
        this.mounted = true;
        getModelData(null, () => {
            this.mounted && this.initTreeData()
        })
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    componentDidMount() {}

    initTreeData() {
        this.props.actions.treeViewInit(TreeData);
    }

    onToggle(node) {
        // console.log(node); this.props.actions.sideBarToggled(node);
    }

    render() {
        let parentPath = "";
        let childPath = "";
        const {routes} = this.props;
        if(routes.length>3){
            parentPath = routes[3].path;
        }

        if(routes.length>4){
            childPath = routes[4].path;
        }

        return <div className={ "container " +"systemOperation-"+parentPath+" "+parentPath+"-"+childPath }>
                    <svg className="svgOnload" >
                        <symbol id="icon_sys_select"><path d="M155.345,71.726c-0.216-3.823-1.282-6.092-3.889-8.699c-5.287-5.287-13.352-1.437-15.38,0.625l-50.994,52.11L62.997,93.429
        c-4.147-4.283-10.981-4.393-15.263-0.246c-0.083,0.081-0.165,0.162-0.246,0.246c-4.256,4.342-4.256,11.291,0,15.633l30.15,30.15
        c4.147,4.283,10.981,4.393,15.263,0.246c0.083-0.081,59.18-60.172,59.18-60.172c2.07-2.111,3.229-4.764,3.266-7.54l25.295-10.278
        c0.002,28.048,0.006,84.131,0.006,94.365c0,14.98-14.471,24.814-24.814,24.814c-10.343,0-94.496,0-111.665,0
        s-24.814-16.66-24.814-24.814c0-8.155,0-100.749,0-111.665s8.427-24.814,24.814-24.814c17.065,0,110.857,0,110.857,0
        s25.622-0.021,25.622,30.097c0.915-0.328,12.407-4.704,12.407-4.704c0-20.557-16.665-37.8-37.222-37.8H44.167
        c-20.557,0-37.222,16.665-37.222,37.222v111.665c0,20.557,16.665,37.222,37.222,37.222h111.665
        c20.557,0,37.222-16.665,37.222-37.222V44.767l-12.415,4.72c0,0,0.001-0.907,0.002,11.956L155.345,71.726z"/></symbol>
                        <symbol id="icon_sys_whitelist"><path d="M52.523,80.28h74.953c3.45,0,6.246-2.796,6.246-6.246c0-3.45-2.796-6.246-6.246-6.246H52.523
        c-3.45,0-6.246,2.796-6.246,6.246C46.277,77.484,49.074,80.28,52.523,80.28z M52.523,117.757h74.953c3.45,0,6.246-2.796,6.246-6.246
        c0-3.45-2.796-6.246-6.246-6.246H52.523c-3.45,0-6.246,2.796-6.246,6.246C46.277,114.961,49.074,117.757,52.523,117.757z
         M52.523,155.234h74.953c3.45,0,6.246-2.796,6.246-6.246c0-3.45-2.796-6.246-6.246-6.246H52.523c-3.45,0-6.246,2.796-6.246,6.246
        C46.277,152.437,49.074,155.234,52.523,155.234z M152.461,30.311c-3.45,0-6.246,2.796-6.246,6.246s2.796,6.246,6.246,6.246
        s6.246,2.796,6.246,6.246v124.922c0,3.45-2.796,6.246-6.246,6.246H27.539c-3.45,0-6.246-2.796-6.246-6.246V49.05
        c0-3.45,2.796-6.246,6.246-6.246s6.246-2.796,6.246-6.246s-2.796-6.246-6.246-6.246c-10.349,0-18.738,8.389-18.738,18.738v124.922
        c0,10.349,8.389,18.738,18.738,18.738h124.922c10.349,0,18.738-8.389,18.738-18.738V49.05
        C171.199,38.701,162.81,30.311,152.461,30.311z M52.523,42.804h74.953c3.45,0,6.246-2.796,6.246-6.246s-2.796-6.246-6.246-6.246
        h-6.871C117.174,13.408,100.688,2.488,83.785,5.92C71.495,8.416,61.89,18.021,59.394,30.311h-6.871c-3.45,0-6.246,2.796-6.246,6.246
        S49.074,42.804,52.523,42.804z M90,17.819c7.888,0.038,14.895,5.043,17.489,12.492H72.511C75.105,22.862,82.112,17.857,90,17.819z"/></symbol>
                        <symbol id="icon_sys_xes"><path d="M194.498,99.725c-0.547-9.32-5.152-17.932-12.6-23.562c7.48-5.658,12.089-14.323,12.6-23.688
    c0-26.082-42.335-47.249-94.498-47.249S5.502,26.395,5.502,52.476c0.511,9.365,5.12,18.03,12.6,23.688
    c-7.448,5.63-12.053,14.242-12.6,23.562c0.511,9.365,5.12,18.03,12.6,23.688c-7.448,5.63-12.053,14.242-12.6,23.562
    c0,26.082,42.335,47.249,94.498,47.249s94.498-21.168,94.498-47.249c-0.547-9.32-5.152-17.932-12.6-23.562
    C189.379,117.755,193.987,109.09,194.498,99.725z M100,17.827c46.871,0,81.898,18.27,81.898,34.649S146.871,87.126,100,87.126
    s-81.898-18.9-81.898-34.649S53.129,17.827,100,17.827z M181.898,146.975c0,16.38-35.027,34.649-81.898,34.649
    s-81.898-18.27-81.898-34.649c1.065-6.61,5.043-12.393,10.836-15.75c22.001,11.102,46.432,16.517,71.063,15.75
    c24.631,0.767,49.062-4.648,71.063-15.75C176.856,134.582,180.834,140.364,181.898,146.975z M100,134.375
    c-46.871,0-81.898-18.27-81.898-34.649c0.939-6.756,4.936-12.704,10.836-16.128C50.904,94.831,75.337,100.376,100,99.725
    c24.663,0.65,49.096-4.895,71.063-16.128c5.887,3.437,9.879,9.378,10.836,16.128C181.898,116.105,146.871,134.375,100,134.375z"/></symbol>
                    </svg>
                    <HeadBar moduleName={ "系统运维" } router={ this.props.router } />
                    <SideBar onToggle={ this.onToggle } />
                    { this.props.children }
                    <Overlayer/>
                </div>
    }
}

function mapStateToProps(state) {
    return {
        userCenter: state.userCenter
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
export default connect(mapStateToProps, mapDispatchToProps)(SystemOperationIndex);