import React,{Component} from 'react';
import Panel from '../../components/Panel';
import PanelFooter from '../../components/PanelFooter';
import SearchText from '../../components/SearchText';
import Table from '../../components/Table2';
import Immutable from 'immutable';
import Select from '../../components/Select.1'
import {getIndexByKey2} from '../../util/algorithm'
export default class DataOriginPopup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataOriList: {
                titleField: 'title',
                valueField: 'value',
                options: [   
                    { value: 'rfid',title: "RFID标签"}, 
                    { value: 'sensor',title: "传感器"}
                ]
            },
            rfidList:[
                {id:1,name:'00158D0000CABAD5'},
                {id:2,name:'00158D0000CABAD5'},
                {id:3,name:'00158D0000CABAD5'},
                {id:4,name:'00158D0000CABAD5'},
                {id:5,name:'00158D0000CABAD5'},
                {id:6,name:'00158D0000CABAD5'},
            ]
        }

        this.onCancel = this.onCancel.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.rfidDelete = this.rfidDelete.bind(this);
        this.rfidAdd = this.rfidAdd.bind(this);
    }

    componentWillMount(){  
        this.mounted = true;
    }

    componentWillUnmount(){
        this.mounted = false;
    }


    onCancel() {
        this.props.overlayerHide();
    }

    onConfirm() {
        let data = this.props.type == 'XES-200S'?getCheckedSensor():this.state.rfidList;
        this.props.overlayerHide();
        this.props.onConfirm && this.props.onConfirm(data,this.props.type);
    }

    getCheckedSensor(){
        let sensors = document.getElementsByName('sensor');
        let checked_val = [];
        for(let i in sensors){
            if(sensors[i].checked)
                checked_val.push(sensors[i].value);
        }
        return checked_val;
    }

    rfidAdd(id){
        let {rfidList} = this.state;
        rfidList.push();
        this.setState({rfidList:rfidList});
    }

    rfidDelete(id){
        let {rfidList} = this.state;
        let index = getIndexByKey2(rfidList,'id',id);
        rfidList.splice(index,1);
        this.setState({rfidList:rfidList});        
    }

    render() {
        let {className='',sensorTypeList,type} = this.props;
        const {dataOriList,rfidList} = this.state;
        let footer = <PanelFooter funcNames={['onCancel','onConfirm']} btnTitles={['button.cancel','button.confirm']} btnClassName={['btn-default', 'btn-primary']}
                                  btnDisabled={[false, false]} onCancel={this.onCancel} onConfirm={this.onConfirm}/>;

        return <div className={className}>
            <Panel title='数据源' footer={footer} closeBtn={true} closeClick={this.onCancel}>
                <div className="selectItem">
                        <label className="control-label">{type == 'XES-200S'?'选择传感器：':'修改标签：'}</label>
                        {
                            type == 'XES-200S'?
                            <div className = 'select-Sensor'>
                                {
                                    sensorTypeList.map(item=>{
                                        return <label className="checkbox-inline" key={item.value}>
                                            <input type="checkbox" name='sensor' value={item.value} /> {item.title}
                                        </label>
                                    })
                                }
                            </div>
                            :
                            <div className="rfid-label">
                                <div className="form-group clearfix">
                                    <input type="text" className="form-control" placeholder="输入编号添加" />
                                    <button className='btn btn-primary' onClick={this.rfidAdd}>添加</button>
                                </div>
                                <ul className = 'label-list'>
                                    <li>标签</li>
                                    {
                                        rfidList.map((item,index)=>{
                                        return <li key = {index}>
                                            <span className="icon-table-delete" onClick={()=>this.rfidDelete(item.id)}></span>
                                                {item.name}
                                        </li>
                                    })
                                    }                                  
                                </ul>
                            </div>
                        }
                </div>
            </Panel>
        </div>
    }
}
