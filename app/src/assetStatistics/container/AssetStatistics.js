/**
 * Created by a on 2017/4/19.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import '../../../public/styles/assetStatistics.less'

import HeadBar from '../../components/HeadBar'
import SideBar from '../../components/SideBar'
import Content from '../../components/Content'

import Table from '../../components/Table'
import SideBarInfo from '../../components/SideBarInfo'
import {TreeData} from '../../data/treeData'

class AssetStatistics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapse:false
        }
        this.columns = [{field:"type", title:"型号"}, {field:"detail", title:"描述"}]

        this.collpseHandler = this.collpseHandler.bind(this);
    }

    componentWillMount(){
        const query = this.props.location.query;
    }

    collpseHandler(){
        this.setState({collapse: !this.state.collapse})
    }

    render() {
        const { data } = this.props
        const { collapse } = this.state;
        return (
            <div className={"container-fluid asset-statistics "+(collapse?'collapsed':'')}>
                <HeadBar moduleName="资产统计"/>
                <SideBar TreeData={TreeData}/>
                <Content>
                    <div className="heading"></div>
                    <SideBarInfo collpseHandler={this.collpseHandler}/>
                </Content>

            </div>
        )
    }
}


function mapStateToProps(state) {
    return {
        data: state.assetStatistics.get('data')
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
)(AssetStatistics);