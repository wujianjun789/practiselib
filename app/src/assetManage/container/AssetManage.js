/**
 * Created by a on 2017/4/19.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import HeadBar from '../../components/HeadBar'
import SideBar from '../../components/SideBar'
import Content from '../../components/Content'

import Table from '../../components/Table'
import SideBarInfo from '../../components/SideBarInfo'
import {TreeData} from '../../data/treeData'

class AssetManage extends Component {
    constructor(props) {
        super(props);
        this.columns = [{field:"type", title:"型号"}, {field:"detail", title:"描述"}]
    }

    componentWillMount(){
        const query = this.props.location.query;
    }

    render() {
        const { data } = this.props
        return (
            <div className="container asset-manage">
                <HeadBar moduleName="资产管理"/>
                <SideBar TreeData={TreeData}/>
                <Content>
                    <div className="row heading">
                        <div className="property"><span></span>设备属性</div>
                        <ul className="property-list">
                            <li>软件版本</li>
                            <li>系统版本</li>
                            <li>内核版本</li>
                        </ul>
                    </div>
                    <div className="row heading">
                        <div className="type"><span></span>设备类别</div>
                        <table className="equipment">
                            <thead>
                                <tr>
                                {
                                    this.columns.map((column,index)=>{
                                        return <th key={index}>{column.title}</th>
                                    })
                                }
                                </tr>
                            </thead>
                            <tbody>
                            {
                                data.map((row, index)=>{
                                    return <tr key={index}>
                                        {
                                            this.columns.map((column,index)=>{
                                                return <td key={index}>{row.get(column.field)}</td>
                                            })
                                        }
                                    </tr>
                                })
                            }
                            </tbody>
                        </table>
                    </div>

                </Content>

            </div>
        )
    }
}

// <SideBarInfo />
function mapStateToProps(state) {
    return {
        data: state.assetManage.get('data')
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