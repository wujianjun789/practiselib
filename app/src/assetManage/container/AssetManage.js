/**
 * Created by a on 2017/4/19.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import '../../../public/styles/assetmanage.less';


import Content from '../../components/Content'

import {getModelData, getModelProps, getModelTypes, first_child} from '../../data/models'
import Immutable from 'immutable';

class AssetManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            devicePro:Immutable.fromJS([
                "软件版本",
                "系统版本",
                "内核版本"
            ]),
            data:Immutable.fromJS([
                {type:"LC300", detail:"LC300灯控"},
                {type:"LC600", detail:"LC600灯控"},
                {type:"LCMINI", detail:"智慧路灯用"}
            ]),
            
        }

        this.columns = [{field:"type", title:"型号"}, {field:"detail", title:"描述"}]

        this.onToggle = this.onToggle.bind(this);
        this.initTreeData = this.initTreeData.bind(this);
    }

    componentWillMount(){
        const query = this.props.location.query;
        getModelData(this.initTreeData);
    }

    componentWillReceiveProps(nextProps){
        const {sidebarNode} = nextProps;
        if(sidebarNode){
            this.onToggle(sidebarNode);
        }
    }

    initTreeData(){
        this.setState({
            devicePro:Immutable.fromJS(getModelProps(first_child.id)),
            data: Immutable.fromJS(getModelTypes(first_child.id))
        })
    }

    onToggle(node){
       if(node.hasOwnProperty('level') && node.level==1){
           return;
       }

        this.setState({
            devicePro:Immutable.fromJS(getModelProps(node.id)),
            data: Immutable.fromJS(getModelTypes(node.id))
        })
    }

    render() {
        const { data, devicePro } = this.state
        return (
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
        )
    }
}


function mapStateToProps(state) {
    return {
        sidebarNode: state.assetManage.get('sidebarNode')
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