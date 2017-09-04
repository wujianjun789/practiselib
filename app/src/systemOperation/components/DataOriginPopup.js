import React,{Component} from 'react';
import Panel from '../../components/Panel';
import PanelFooter from '../../components/PanelFooter';
import SearchText from '../../components/SearchText';
import Table from '../../components/Table2';
import Immutable from 'immutable';
import Select from '../../components/Select.1'

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
            dataOrigin:'rfid'
        }

        this.onCancel = this.onCancel.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.onChange = this.onChange.bind(this);
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
        this.props.overlayerHide();
        this.props.onConfirm && this.props.onConfirm();
    }

    onChange(e){
        this.setState({dataOrigin:this.state.dataOriList.options[e.target.selectedIndex].value})
    }

    render() {
        let {className='',sensorTypeList} = this.props;
        const {dataOriList,dataOrigin} = this.state;
        let footer = <PanelFooter funcNames={['onCancel','onConfirm']} btnTitles={['取消','确认']} btnClassName={['btn-default', 'btn-primary']}
                                  btnDisabled={[false, false]} onCancel={this.onCancel} onConfirm={this.onConfirm}/>;

        return <div className={className}>
            <Panel title='数据源' footer={footer} closeBtn={true} closeClick={this.onCancel}>
                <div className="form-group clearfix">
                    <label htmlFor="dataOrigin" className="control-label">选择数据源：</label>
                    <div className="col-sm-9">
                        <Select id="dataOrigin" onChange={this.onChange} titleField={dataOriList.titleField}
                            valueField={dataOriList.valueField} options={dataOriList.options} value={dataOrigin}/>
                    </div>
                </div>
                <div className="selectItem">
                    <div className = 'select-Sensor'>
                        <label className="control-label">{dataOrigin == 'sensor'?'选择传感器：':'修改标签：'}</label>
                        {
                            dataOrigin == 'sensor'?
                            <div className = 'col-sm-9 select-Sensor'>
                                {
                                    sensorTypeList.map(item=>{
                                        return <label className="checkbox-inline" key={item.value}>
                                            <input type="checkbox" value={item.value} /> {item.title}
                                        </label>
                                    })
                                }
                            </div>
                            :
                            <div className="col-sm-9 rfid-label">
                                <div className="form-group clearfix">
                                    <input type="text" className="form-control" placeholder="输入编号添加" />
                                    <button className='btn btn-primary'>添加</button>
                                </div>
                                <ul className = 'label-list'>
                                    
                                </ul>
                            </div>
                        }
                    </div>
                </div>
            </Panel>
        </div>
    }
}
