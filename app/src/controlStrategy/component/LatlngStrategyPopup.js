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

import {getLightLevelConfig, getStrategyDeviceConfig} from '../../util/network';

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
                name:{hidden:true,text:this.formatIntl('app.strategy.name.userd')},
                device:{hidden:true,text:this.formatIntl('sysOperation.select.device')},
                sunrise:{hidden:true,text:this.formatIntl('sysOperation.select.instruction')},
                sunset:{hidden:true,text:this.formatIntl('sysOperation.select.instruction')},
                sunriseTime:{hidden:true,text:this.formatIntl('app.input.numbers')},
                sunsetTime:{hidden:true,text:this.formatIntl('app.input.numbers')},
            },
            deviceList: {
                titleField: 'title',
                valueField: 'value',
                // options: [
                //     {value: 'lc', title: this.formatIntl('app.lamp')},
                //     {value: 'screen', title: this.formatIntl('app.screen')}
                // ]
            },
            brightnessList: {
                titleField: 'title',
                valueField: 'value',
                options: []
            },
            screenSwitchList: {
                titleField: 'title',
                valueField: 'value',
                options: [
                    // {value: '', title: '选择屏幕开关'},
                    {value: 'off', title: this.formatIntl('app.close')},
                    {value: 'on', title: this.formatIntl('app.open')}
                ]
            },
        }

        this.formatIntl = this.formatIntl.bind(this);

        this.onCancel = this.onCancel.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.onChange = this.onChange.bind(this);

        this.updateControlDeviceList = this.updateControlDeviceList.bind(this);
        this.updateBrightnessList = this.updateBrightnessList.bind(this);
    }

    componentWillMount(){
        getStrategyDeviceConfig(this.updateControlDeviceList);
        getLightLevelConfig(this.updateBrightnessList);
    }

    formatIntl(formatId){
        const {intl} = this.props;
        return intl?intl.formatMessage({id:formatId}):null;
        // return formatId;
    }

    updateControlDeviceList(data) {
        // ["lc", "screen"]
        let opt = [];
        data.forEach(value => {
            let title = '';
            if(value == 'lc') {
                title = this.formatIntl('app.lamp');
            } else if (value == 'screen') {
                title = this.formatIntl('app.screen');
            }
            opt.push({title, value});
        })
        this.setState({deviceList: Object.assign({}, this.state.deviceList, {options: opt} )});
    }

    updateBrightnessList(data){
        console.log("data:", data);
        let opt = [];
        data.forEach(value => {
            let val = value;
            let title = `${this.formatIntl('app.brightness')} ${val}`;
            if(value == '关') {
                val = 'off';
                title = this.formatIntl('app.close');
            }
            opt.push({value: val, title});
        });
        this.setState({brightnessList: Object.assign({}, this.state.brightnessList, {options: opt})});
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
                        prompt={hidden:false,text:this.formatIntl('mediaPublish.prompt')};
                    break;
                case'sunriseTime':
                case'sunsetTime': 
                    if(value&&!numbersValid(value))
                        prompt={hidden:false,text:this.formatIntl('app.input.numbers')};
                    if(value&&value>1440)
                        prompt={hidden:false,text:this.formatIntl('app.exceed.maximum.support')};
                    break;
            }
            this.setState({[id]:event.target.value,prompt:Object.assign(this.state.prompt,{[id]:prompt})});
        }
    }

    render() {
        let {className = '',title = '',isEdit=false} = this.props;
        let {name, device, sunrise, sunset, sunriseTime, sunsetTime,prompt,deviceList,brightnessList,screenSwitchList} = this.state;
        const disabled = (sunriseTime === '' || sunsetTime === ''|| deviceList.length == 0) ? true : false;
        let footer = <PanelFooter funcNames={['onCancel','onConfirm']} btnTitles={['button.cancel','button.confirm']} btnClassName={['btn-default', 'btn-primary']}
        btnDisabled={[false, disabled]} onCancel={this.onCancel} onConfirm={this.onConfirm}/>;
        console.log(brightnessList);
        return (
            <Panel className={className} title = {title} footer = {footer} closeBtn = {true} closeClick = {this.onCancel}>
                <div className="form-group">
                    <label htmlFor="name" className="control-label" title={this.formatIntl('app.strategy.name')}>{this.formatIntl('app.strategy.name')}</label>
                    <div className="form-group-input">
                        <input type="text" className="form-control" id="name" placeholder={this.formatIntl('app.latlng.strategy')} value={name} maxLength = {16}
                                onChange={this.onChange}/>
                        <span className={prompt.name.hidden?"prompt hidden":"prompt"}>{prompt.name.text}</span>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="device" className="control-label">{this.formatIntl('app.control.device')}</label>
                    <div className="form-group-input">
                        <Select id="device" onChange={this.onChange} titleField={deviceList.titleField}
                                valueField={deviceList.valueField} options={deviceList.options} value={device}/>
                        <span className={prompt.device.hidden?"prompt hidden":"prompt"}>{prompt.device.text}</span>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="sunrise" className="control-label">{this.formatIntl('app.sunrise')}</label>
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
                    <label htmlFor="sunriseTime" className="control-label" title={this.formatIntl('app.sunrise.time.difference')}>{this.formatIntl('app.sunrise.time.difference')}</label>
                    <div className="form-group-input">
                        <input type="text" className="form-control" id="sunriseTime" placeholder={this.formatIntl('app.input.minute')} value={sunriseTime} maxLength = {16}
                                onChange={this.onChange}/>
                        <span className={prompt.sunriseTime.hidden?"prompt hidden":"prompt"}>{prompt.sunriseTime.text}</span>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="sunset" className="control-label">{this.formatIntl('app.sunset')}</label>
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
                    <label htmlFor="sunsetTime" className="control-label" title={this.formatIntl('app.sunset.time.difference')}>{this.formatIntl('app.sunset.time.difference')}</label>
                    <div className="form-group-input">
                        <input type="text" className="form-control" id="sunsetTime" placeholder={this.formatIntl('app.input.minute')} value={sunsetTime} maxLength = {16}
                                onChange={this.onChange}/>
                        <span className={prompt.sunsetTime.hidden?"prompt hidden":"prompt"}>{prompt.sunsetTime.text}</span>
                    </div>
                </div>
                <NotifyPopup />
            </Panel>
        )
    }
}