/**
 * Created by a on 2017/7/17.
 */
import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import HeadBar from '../../components/HeadBar'
import SideBar from '../../components/SideBar'
import Overlayer from '../../common/containers/Overlayer'
import {sideBarToggled} from '../action/index'
class AssetManageIndex extends Component{
    constructor(props){
        super(props);
        this.onToggle = this.onToggle.bind(this);
    }

    onToggle(node){
        this.props.actions.sideBarToggled(node);
    }

    render(){
        let path = this.props.children.props.route.path;
        return <div className={"container "+"asset-"+path}>
            <HeadBar moduleName="资产管理" router={this.props.router}/>
            <SideBar onToggle={this.onToggle}/>
            {this.props.children}
            <Overlayer />
        </div>
    }
}

function mapStateToProps(state) {
    return {
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            sideBarToggled: sideBarToggled
        }, dispatch)
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AssetManageIndex);