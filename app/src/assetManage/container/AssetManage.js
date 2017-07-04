/**
 * Created by a on 2017/4/19.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import HeadBar from '../../components/HeadBar'
import SideBar from '../../components/SideBar'
import Content from '../../components/Content'

import {TreeData} from '../../data/treeData'
class AssetManage extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount(){
        const query = this.props.location.query;
    }

    render() {
        return (
            <div className="container asset-manage">
                <HeadBar moduleName="资产管理"/>
                <SideBar TreeData={TreeData}/>
                <Content>
                    <div className="row">
                        <div className="property"><span></span>设备属性</div>
                        <ul className="property-list">
                            <li>软件版本</li>
                            <li>系统版本</li>
                            <li>内核版本</li>
                        </ul>
                    </div>
                    <div className="row">
                        <div className="type"><span></span>设备类别</div>
                    </div>
                </Content>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        isLogin: state.login.get('isLogin')
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
        }, dispatch)
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AssetManage);