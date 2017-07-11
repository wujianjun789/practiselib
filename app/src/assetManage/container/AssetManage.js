/**
 * Created by a on 2017/4/19.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import '../../../public/styles/assetmanage.less';

import HeadBar from '../../components/HeadBar'
import SideBar from '../../components/SideBar'
import Content from '../../components/Content'

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
        const { data, devicePro } = this.props
        return (
            <div className="container asset-manage">
                <HeadBar moduleName="资产管理"/>
                <SideBar TreeData={TreeData}/>
                <Content>
                    <div className="row heading">
                        <div className="property"><span></span>设备属性</div>
                        <ul className="property-list">
                            {
                                devicePro.map((item,index)=>{
                                    return <li key={index}>{item}</li>
                                })
                            }
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


function mapStateToProps(state) {
    return {
        data: state.assetManage.get('data'),
        devicePro: state.assetManage.get('devicePro')
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