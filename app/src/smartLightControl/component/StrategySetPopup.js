/**
 * Created by a on 2017/9/13.
 */
import React,{Component} from 'react';

import Panel from '../../components/Panel';
import PanelFooter from '../../components/PanelFooter';
import SearchText from '../../components/SearchText';

import Immutable from 'immutable';
export default class StrategySetPopup extends Component{
    constructor(props){
        super(props);
        this.state = {
            search:Immutable.fromJS({placeholder:'输入设备名称', value:''}),

            curDeviceList:[{id:1, name:"灯"},{id:2, name:"灯2"},{id:3, name:"灯3"},
                {id:4, name:"屏"},{id:5, name:"屏2"},{id:6, name:"屏3"},
                {id:7, name:"灯4"},{id:8, name:"灯5"},{id:9, name:"灯6"}]
        }

        this.deviceList = [{id:1, name:"灯1"},{id:2, name:"灯2"},{id:3, name:"灯3"},
            {id:4, name:"屏"},{id:5, name:"屏2"},{id:6, name:"屏3"},{id:7, name:"屏4"}]

        this.onConfirm = this.onConfirm.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }

    onConfirm(){
        const {onConfirm} = this.props;
        onConfirm && onConfirm();
    }

    onCancel(){
        const {onCancel} = this.props;
        onCancel && onCancel();
    }

    render(){
        const {title} = this.props;
        const {search, curDeviceList} = this.state;

        let valid = false
        let footer = <PanelFooter funcNames={['onCancel','onConfirm']} btnTitles={['取消','保存']}
                                  btnClassName={['btn-default', 'btn-primary']}
                                  btnDisabled={[false, valid]} onCancel={this.onCancel} onConfirm={this.onConfirm}/>;

        return <Panel className="strategy-set-popup" title={title} closeBtn={true} closeClick={this.onCancel} footer={footer}>
                <div className="row form-group">
                    <label className="col-sm-2">设备种类:</label>
                    <input className="col-sm-10" type="text"  disabled="disabled" placeholder="设备种类" value="灯"/>
                </div>
                <div className="row form-group">
                    <label className="col-sm-2">所属域:</label>
                    <div className="col-sm-5">
                        <SearchText placeholder={search.get("placeholder")} value={search.get("value")}/>
                        <ul className="device-all">
                            {
                                this.deviceList.map(device=>{
                                    return <li key={device.id}>{device.name}<span className="glyphicon glyphicon-plus"></span></li>
                                })
                            }
                        </ul>
                    </div>
                    <div className="col-sm-5 device-cur-container">
                        <ul className="device-cur">
                            {
                                curDeviceList.map(device=>{
                                    return <li key={device.id}>{device.name}<span className="icon-table-delete"></span></li>
                                })
                            }
                        </ul>
                    </div>
                </div>
            </Panel>
    }
}