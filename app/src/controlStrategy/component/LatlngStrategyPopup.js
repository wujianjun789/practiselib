import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Panel from '../../components/Panel';
import PanelFooter from '../../components/PanelFooter';
import {overlayerHide} from '../../common/actions/overlayer';
import Select from '../../components/Select.1';
import Immutable from 'immutable';
import {NameValid,numbersValid} from '../../util/index';
import NotifyPopup from '../../common/containers/NotifyPopup'

let options = (function generateLampLightnessList() {
    let opt = [];
    for(let i=0; i<11; i++){
        let val = i*10;
        opt.push({value: val, title: `亮度${val}`});
    }
    opt.unshift({value: 'off', title: '关'});
    // opt.unshift({value: '', title: '选择灯亮度'});
    return opt;
})();

export default class LatlngStrategyPopup extends Component{
    constructor(props){
        super(props);
        const {data={},isEdit=false} = this.props;      
        let {name="", device='lc',strategy=[],sunrise='off',sunset='off'} = data;
        let sunriseTime='';
        let sunsetTime='';        
        strategy.forEach((item)=>{
            if('sunrise' in item.condition){
                sunriseTime=item.condition.sunrise;
                sunrise = item.rpc.value;
            }
            else{
                sunsetTime=item.condition.sunset;
                sunset = item.rpc.value;
            }
        });
        this.state={
            name:name,
            device:device,
            sunrise:sunrise,
            sunset:sunset,
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
            deviceList: {
                titleField: 'title',
                valueField: 'value',
                options: [
                    {value: 'lc', title: '灯'},                    
                    {value: 'screen', title: '屏幕'}
                ]
            },
            brightnessList: {
                titleField: 'title',
                valueField: 'value',
                options: options
            },
            screenSwitchList: {
                titleField: 'title',
                valueField: 'value',
                options: [
                    // {value: '', title: '选择屏幕开关'},
                    {value: 'off', title: '屏幕关'},
                    {value: 'on', title: '屏幕开'}
                ]
            },
        }
        this.onCancel = this.onCancel.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onCancel(){
        this.props.onCancel() && this.props.onCancel();        
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
                    rpc: {'value':sunrise}
                },
                {
                    condition: {
                        sunset: sunsetTime
                    },
                    rpc: {'value':sunset}
                }
            ]
        }
        this.props.onConfirm(Object.assign(datas,this.props.isEdit?{id:this.props.data.id}:{}),this.props.isEdit);
    }

    onChange(event){
        const id = event.target.id;
        if(id == "device") {
            this.setState({device: this.state.deviceList.options[event.target.selectedIndex].value});
        }
        else if(id == 'sunrise'||id == 'sunset') {
            const list = this.state.device=='lc'?this.state.brightnessList:this.state.screenSwitchList;
            this.setState({[id]: list.options[event.target.selectedIndex].value});
        }
        else{
            let prompt ={hidden:true,text:''};
            let value = event.target.value;
            switch(id){
                case'name':
                    if(value&&!NameValid(value))
                        prompt={hidden:false,text:'仅能使用字母、数字或下划线且首个不能为数字'};
                    break;
                case'sunriseTime':
                case'sunsetTime': 
                    if(value&&!numbersValid(value))
                        prompt={hidden:false,text:'仅能输入数字'};
                    if(value&&value>1440)
                        prompt={hidden:false,text:'超过最大支持范围'};
                    break;
            }
            this.setState({[id]:event.target.value,prompt:Object.assign(this.state.prompt,{[id]:prompt})});
        }
    }

    render() {
        let {className = '',title = '',isEdit=false} = this.props;
        let {name, device, sunrise, sunset, sunriseTime, sunsetTime,prompt,deviceList,brightnessList,screenSwitchList} = this.state;
        const disabled = (sunriseTime === '' || sunsetTime === ''|| deviceList.length == 0) ? true : false;
        let footer = <PanelFooter funcNames={['onCancel','onConfirm']} btnTitles={['取消','确认']} btnClassName={['btn-default', 'btn-primary']} 
        btnDisabled={[false, disabled]} onCancel={this.onCancel} onConfirm={this.onConfirm}/>;
        return (
            <Panel className={className} title = {title} footer = {footer} closeBtn = {true} closeClick = {this.onCancel}>
                <div className="form-group">
                    <label htmlFor="name" className="control-label">策略名称：</label>
                    <div className="form-group-input">
                        <input type="text" className="form-control" id="name" placeholder="请输入策略名" value={name} maxLength = {16}
                                onChange={this.onChange}/>
                        <span className={prompt.name.hidden?"prompt hidden":"prompt"}>{prompt.name.text}</span>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="device" className="control-label">控制设备：</label>
                    <div className="form-group-input">
                        <Select id="device" onChange={this.onChange} titleField={deviceList.titleField}
                                valueField={deviceList.valueField} options={deviceList.options} value={device}/>
                        <span className={prompt.device.hidden?"prompt hidden":"prompt"}>{prompt.device.text}</span>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="sunrise" className="control-label">日出：</label>
                    <div className="form-group-input">
                        {
                            device == 'lc' ?
                            <Select id="sunrise" onChange={this.onChange} titleField={brightnessList.titleField}
                                    valueField={brightnessList.valueField} options={brightnessList.options} value={sunrise}/>
                            :
                            <Select id="sunrise" onChange={this.onChange} titleField={screenSwitchList.titleField}
                                    valueField={screenSwitchList.valueField} options={screenSwitchList.options} value={sunrise}/>
                        }
                        <span className={prompt.sunrise.hidden?"prompt hidden":"prompt"}>{prompt.sunrise.text}</span>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="sunriseTime" className="control-label">日出时间差：</label>
                    <div className="form-group-input">
                        <input type="text" className="form-control" id="sunriseTime" placeholder="输入分钟数（日出后为正数）" value={sunriseTime} maxLength = {16}
                                onChange={this.onChange}/>
                        <span className={prompt.sunriseTime.hidden?"prompt hidden":"prompt"}>{prompt.sunriseTime.text}</span>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="sunset" className="control-label">日落：</label>
                    <div className="form-group-input">
                        {
                            device == 'lc' ?
                            <Select id="sunset" onChange={this.onChange} titleField={brightnessList.titleField}
                                    valueField={brightnessList.valueField} options={brightnessList.options} value={sunset}/>
                            :
                            <Select id="sunset" onChange={this.onChange} titleField={screenSwitchList.titleField}
                                    valueField={screenSwitchList.valueField} options={screenSwitchList.options} value={sunset}/>
                        }                
                        <span className={prompt.sunset.hidden?"prompt hidden":"prompt"}>{prompt.sunset.text}</span>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="sunsetTime" className="control-label">日落时间差：</label>
                    <div className="form-group-input">
                        <input type="text" className="form-control" id="sunsetTime" placeholder="输入分钟数（日落后为正数）" value={sunsetTime} maxLength = {16}
                                onChange={this.onChange}/>
                        <span className={prompt.sunsetTime.hidden?"prompt hidden":"prompt"}>{prompt.sunsetTime.text}</span>
                    </div>
                </div>
                <NotifyPopup />
            </Panel>
        )
    }
}