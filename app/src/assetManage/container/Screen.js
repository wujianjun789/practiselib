/**
 * Created by a on 2017/8/23.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import Content from '../../components/Content';

import {getModelData, getModelProps, getModelTypes, getModelDefaultsValues, getModelDefaults} from '../../data/assetModels';
import Immutable from 'immutable';

import {FormattedMessage,injectIntl} from 'react-intl';
import { intlFormat } from '../../util/index';

export class Screen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            model:'screen',
            devicePro:Immutable.fromJS([
                '软件版本',
                '系统版本',
                '内核版本'
            ]),
            data:Immutable.fromJS([
                {type:'LC300', detail:'LC300灯控'},
                {type:'LC600', detail:'LC600灯控'},
                {type:'LCMINI', detail:'智慧路灯用'}
            ]),
            dataDefaults: [],
            dataDefaultsValues: Immutable.fromJS([]),
        };

        // this.columns = [{field:"type", title:"型号"}, {field:"detail", title:"描述"}]
        this.columns = [{field:'type', title:intlFormat({en:'type',zh:'型号'})}, {field:'detail', title:intlFormat({en:'detail',zh:'描述'})}]; 

        this.initTreeData = this.initTreeData.bind(this);
    }

    componentWillMount(){
        this.mounted = true;
        getModelData(()=>{this.mounted && this.initTreeData();});
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    initTreeData(){
        const {model} = this.state;
        this.setState({
            devicePro:Immutable.fromJS(getModelProps(model)),
            data: Immutable.fromJS(getModelTypes(model)),
            dataDefaults: getModelDefaults(model),
            dataDefaultsValues: Immutable.fromJS(getModelDefaultsValues(model)),
        });
    }

    render() {
        const { data, devicePro, dataDefaults, dataDefaultsValues } = this.state;
        return (
            <Content>
                <div className="row heading">
                    <div className="property"><span></span>{this.props.intl.formatMessage({id:'asset.property'})}</div>
                    <ul className="property-list">
                        {
                            devicePro.map((item,index)=>{
                                return <li key={index}>{item}</li>;
                            })
                        }
                    </ul>
                </div>
                <div className="row heading">
                    <div className="type"><span></span>{this.props.intl.formatMessage({id:'asset.type'})}</div>
                    <table className="equipment">
                        <thead>
                            <tr>
                                {
                                    this.columns.map((column,index)=>{
                                        return <th key={index}>{column.title}</th>;
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
                                                return <td key={index}>{row.get(column.field)}</td>;
                                            })
                                        }
                                    </tr>;
                                })
                            }
                        </tbody>
                    </table>
                </div>
                <div className="row heading">
                    <div className="param"><span></span>{this.props.intl.formatMessage({id:'asset.param'})}</div>
                    <table className="equipment">
                        <thead>
                            <tr>
                                {
                                    this.columns.map((column,index)=>{
                                        return <th key={index}>{column.title}</th>;
                                    })
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                dataDefaultsValues.map((row, index)=>{
                                    return <tr key={index}>
                                        {
                                            this.columns.map((column,index)=>{
                                                return <td key={index}>{row.get(column.field)}</td>;
                                            })
                                        }
                                    </tr>;
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </Content>
        );
    }
}


function mapStateToProps(state) {
    return {
        sidebarNode: state.assetManage.get('sidebarNode')
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
        }, dispatch)
    };
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(injectIntl(Screen));