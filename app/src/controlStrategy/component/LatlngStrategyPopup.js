import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Panel from '../../components/Panel';
import PanelFooter from '../../components/PanelFooter';
import {overlayerHide} from '../../common/actions/overlayer';
import Select from '../../components/Select.1';
import Immutable from 'immutable';
import {NameValid,numbersValid} from '../../util/index';

export class LatlngStrategyPopup extends Component{
    constructor(props){
        super(props);
        const {data={},isEdit=false} = this.props;
        const defaultDev = this.props.deviceList.options.length>0?this.props.deviceList.options[0].value:''
        const {name="", device=defaultDev,strategy=[]} = data;
        let sunriseTime='';
        let sunsetTime='';        
        strategy.forEach((item)=>{
            if('sunrise' in item.condition){
                sunriseTime=item.condition.sunrise;
            }
            else{
                sunsetTime=item.condition.sunset;
            }
        });
        this.state={
            name:name,
            device:device,
            sunrise:'',
            sunset:'',
            sunriseTime:sunriseTime,
            sunsetTime:sunsetTime,
            prompt:{
                name:{hidden:true,text:'策略名已使用'},
                device:{hidden:true,text:'请选择设备'},
                sunrise:{hidden:true,text:'请选择指令'},
                sunset:{hidden:true,text:'请选择指令'},
                sunriseTime:{hidden:true,text:'仅能输入数字'},
                sunsetTime:{hidden:true,text:'仅能输入数字'},
            },
            orderList:{
                // titleField: 'title',
                // valueField: 'value',
                // options: [
                //     {value: 0, title: '关闭'},
                //     {value: 100, title: '亮度100'}
                // ]
            }
        }
        this.onCancel = this.onCancel.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onCancel(){
        this.props.action.overlayerHide();
    }

    onConfirm(){
        const {name, device, sunrise, sunset, sunriseTime, sunsetTime} = this.state;
        const datas = {
            name: name,
            type: "latlng",
            asset: device,
            expire: {
                expireRange: [],
                executionRange: [],
                week: 0
            },
            strategy:
            [
                {
                    condition: {
                        sunrise: sunriseTime
                    },
                    rpc: {}
                },
                {
                    condition: {
                        sunset: sunsetTime
                    },
                    rpc: {}
                }
            ]
        }
        this.props.onConfirm(Object.assign(datas,this.props.isEdit?{id:this.props.data.id}:{}),this.props.isEdit);
        this.props.action.overlayerHide();
    }

    onChange(event){
        const id = event.target.id;
        if(id == "device") {
            this.setState({device: this.props.deviceList.options[event.target.selectedIndex].value});
        }
        else if(id == 'sunrise'||id == 'sunset') {
            this.setState({[id]: this.state.orderList.options[event.target.selectedIndex].value});
        }
        else{
            let prompt ={hidden:true,text:''};
            let value = event.target.value;
            switch(id){
                case'name':
                    if(value&&!NameValid(value))
                        prompt={hidden:false,text:'仅能使用字母、数字或下划线'};
                    break;
                case'sunriseTime':
                case'sunsetTime': 
                    if(value&&!numbersValid(value))
                        prompt={hidden:false,text:'仅能输入数字'};
                    break;
            }
            this.setState({[id]:event.target.value,prompt:Object.assign(this.state.prompt,{[id]:prompt})});
        }
    }

    render() {
        let {className = '',title = '',isEdit=false,deviceList} = this.props;
        let {name, device, sunrise, sunset, sunriseTime, sunsetTime,prompt,orderList} = this.state;
        let footer = <PanelFooter funcNames={['onCancel','onConfirm']} btnTitles={['取消','确认']} btnClassName={['btn-default', 'btn-primary']} btnDisabled={[false, false]} onCancel={this.onCancel} onConfirm={this.onConfirm}/>;
        return (
            <Panel className={className} title = {title} footer = {footer} closeBtn = {true} closeClick = {this.onCancel}>
                <div className='row'>
                    <div className="form-group col-sm-6">
                        <label htmlFor="name" className="col-sm-4 control-label">策略名称：</label>
                        <div className="col-sm-8">
                            <input type="text" className="form-control" id="name" placeholder="请输入策略名" value={name} maxLength = {16}
                                    onChange={this.onChange}/>
                            <span className={prompt.name.hidden?"prompt hidden":"prompt"}>{prompt.name.text}</span>
                        </div>
                    </div>
                    <div className="form-group col-sm-6">
                        <label htmlFor="device" className="col-sm-4 control-label">控制设备：</label>
                        <div className="col-sm-8">
                            <Select id="device" className="form-control" onChange={this.onChange} titleField={deviceList.titleField}
                                    valueField={deviceList.valueField} options={deviceList.options} value={device}/>
                            <span className={prompt.device.hidden?"prompt hidden":"prompt"}>{prompt.device.text}</span>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className="form-group col-sm-6">
                        <label htmlFor="sunrise" className="col-sm-4 control-label">日出：</label>
                        <div className="col-sm-8">
                            <Select id="sunrise" className="form-control" onChange={this.onChange} titleField={orderList.titleField}
                                    valueField={orderList.valueField} options={orderList.options} value={sunrise}/>
                            <span className={prompt.sunrise.hidden?"prompt hidden":"prompt"}>{prompt.sunrise.text}</span>
                        </div>
                    </div>
                    <div className="form-group col-sm-6">
                        <label htmlFor="sunriseTime" className="col-sm-4 control-label">日出时间差：</label>
                        <div className="col-sm-8">
                            <input type="text" className="form-control" id="sunriseTime" placeholder="输入分钟数（日出后为正数）" value={sunriseTime} maxLength = {16}
                                    onChange={this.onChange}/>
                            <span className={prompt.sunriseTime.hidden?"prompt hidden":"prompt"}>{prompt.sunriseTime.text}</span>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className="form-group col-sm-6">
                        <label htmlFor="sunset" className="col-sm-4 control-label">日落：</label>
                        <div className="col-sm-8">
                            <Select id="sunset" className="form-control" onChange={this.onChange} titleField={orderList.titleField}
                                    valueField={orderList.valueField} options={orderList.options} value={sunset}/>                    
                            <span className={prompt.sunset.hidden?"prompt hidden":"prompt"}>{prompt.sunset.text}</span>
                        </div>
                    </div>
                    <div className="form-group col-sm-6">
                        <label htmlFor="sunsetTime" className="col-sm-4 control-label">日落时间差：</label>
                        <div className="col-sm-8">
                            <input type="text" className="form-control" id="sunsetTime" placeholder="输入分钟数（日落后为正数）" value={sunsetTime} maxLength = {16}
                                    onChange={this.onChange}/>
                            <span className={prompt.sunsetTime.hidden?"prompt hidden":"prompt"}>{prompt.sunsetTime.text}</span>
                        </div>
                    </div>
                </div>
            </Panel>
        )
    }
}

const mapStateToprops = (state, ownProps) => {
    return{

    }
}

const mapDispatchToProps = (dispatch, ownProps) =>{
    return {
        action: bindActionCreators({
            overlayerHide:overlayerHide,
        }, dispatch)
    }
}

export default connect(mapStateToprops, mapDispatchToProps)(LatlngStrategyPopup) 