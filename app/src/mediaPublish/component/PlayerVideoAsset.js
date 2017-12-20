import React,{ PureComponent } from 'react';
import { numbersValid } from '../../util/index';
import moment from 'moment';
import { TimePicker } from 'antd';
import {FormattedMessage,injectIntl, FormattedDate} from 'react-intl';
class PlayerPicAsset extends PureComponent{
    constructor(props){
        super(props);
        this.state = {
            //计划
            property:{
                //视频素材
                assetName: { key: "assetName", title: this.props.intl.formatMessage({id:'mediaPublish.materialName'}), placeholder: this.props.intl.formatMessage({id:'mediaPublish.materialName'}), value: "" },
                playTimes: { key: "playTimes", title: this.props.intl.formatMessage({id:'mediaPublish.repeatTimes'}), placeholder: this.props.intl.formatMessage({id:'mediaPublish.number'}), value: "" },
                playType: { key: "playType", title: this.props.intl.formatMessage({id:'mediaPublish.playType'}), list: [{ id: 1, name: '片段播放' }, { id: 2, name: '完整播放' }], index: 0, name: "片段播放" },
                clipsRage: { key: "clipsRage", title: this.props.intl.formatMessage({id:'mediaPublish.fragmentRange'}), clipsRage1: moment('00:00:00', 'HH:mm:ss'), clipsRage2: moment('00:00:00', 'HH:mm:ss') },
                scaling: { key: "scaling", title: this.props.intl.formatMessage({id:'mediaPublish.scalingRatio'}), list: [{ id: 1, name: '铺满' }, { id: 2, name: '原始比例' }, { id: 3, name: '4:3' }, { id: 4, name: '5:4' }, { id: 5, name: '16.9' }], index: 0, name: "铺满" },
                volume: {
                    key: "volume", title: this.props.intl.formatMessage({id:'mediaPublish.volume'}), list: [{ id: 1, name: '100' }, { id: 2, name: '90' }, { id: 3, name: '80' },
                    { id: 4, name: '70' }, { id: 5, name: '60' }, { id: 6, name: '50' }, { id: 7, name: '40' }, { id: 8, name: '30' }, { id: 9, name: '20' }, { id: 10, name: '10' }, { id: 11, name: '11' }], index: 0, name: "100"
                },
            },
            prompt:{
                //计划
                playTimes: true, clipsRage: true,
            }
        }
        this.onChange = this.onChange.bind(this);
        this.playerVideoAssetClick = this.playerVideoAssetClick.bind(this);
    }

    componentWillMount(){
        this.initData();
    }

    initData(){
        // getVideoAsset((data)=>{
        //     this.setState({})
        // })
    }

    onChange(id, value) {
        console.log("id:", id);
        let prompt = false;        
        if(id == "playTimes"){
            const val = value.target.value;
            if (!numbersValid(val)) {
                prompt = true;
            }
    
            this.setState({
                property: Object.assign({}, this.state.property, { [id]: Object.assign({}, this.state.property[id], { value: val }) }),
                prompt: Object.assign({}, this.state.prompt, { [id]: prompt })
            })
        }
        else if(id == "clipsRage1" || id == "clipsRage2") {
            prompt = !value;
            this.setState({
                property: Object.assign({}, this.state.property, { clipsRage: Object.assign({}, this.state.property.clipsRage, { [id]: value }) }),
                prompt: Object.assign({}, this.state.prompt, { clipsRage: prompt })
            })
            
        }
        else{
            const curIndex = value.target.selectedIndex;
            this.setState({
                property: Object.assign({}, this.state.property, {
                    [id]: Object.assign({}, this.state.property[id], {
                        index: curIndex,
                        name: this.state.property[id].list[curIndex].name
                    })
                })
            })
        }
    }

    playerVideoAssetClick(id) {
        const { playTimes, playType, clipsRage, scaling, volume } = this.state.property;
        switch (id) {
            case "apply":
                break;
            case "reset":
                this.initData()
                break;
        }
    }

    render(){
        const {property, prompt} = this.state;
        return <div className="pro-container playerVideoAsset">
            <div className="row">
                <div className="form-group">
                    <label className="control-label">{property.assetName.title}</label>
                    <div className="input-container input-w-1">
                        <input type="text" className="form-control" disabled="disabled"
                            value={property.assetName.value} />
                    </div>
                </div>
            </div>          
            <div className="row">
                <div className="form-group">
                    <label className="control-label">{property.playTimes.title}</label>
                    <div className="input-container input-w-2">
                        <input type="text" className="form-control"
                            placeholder={property.playTimes.placeholder} maxLength="8"
                            value={property.playTimes.value}
                            onChange={event => this.onChange("playTimes", event)} />
                        <span className={prompt.playTimes ? "prompt " : "prompt hidden"}><FormattedMessage id='mediaPublish.check'/></span>
                    </div>
                </div>
                <div className="form-group pull-right">
                    <label className="control-label">{property.scaling.title}</label>
                    <div className="input-container input-w-2">
                        <select className="form-control" value={property.scaling.name}
                            onChange={event => this.onChange("scaling", event)}>
                            {
                                property.scaling.list.map((option, index) => {
                                    let value = option.name;
                                    return <option key={index} value={value}>
                                        {value}
                                    </option>
                                })}
                        </select>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="form-group">
                    <label className="control-label">{property.playType.title}</label>
                    <div className="input-container input-w-2">
                        <select className="form-control" value={property.playType.name}
                            onChange={event => this.onChange("playType", event)}>
                            {
                                property.playType.list.map((option, index) => {
                                    let value = option.name;
                                    return <option key={index} value={value}>
                                        {value}
                                    </option>
                                })}
                        </select>
                    </div>
                </div>
                <div className="form-group pull-right clipsRage">
                    <label className="control-label">{property.clipsRage.title}</label>
                    <div className="input-container input-w-2">
                        <TimePicker disabled={property.playType.name == "完整播放"?true:false} size="large" onChange={value => this.onChange("clipsRage1", value)} value={property.clipsRage.clipsRage1} />
                        <span className="text"><FormattedMessage id='mediaPublish.to'/></span>
                        <TimePicker disabled={property.playType.name == "完整播放"?true:false} size="large" onChange={value => this.onChange("clipsRage2", value)} value={property.clipsRage.clipsRage2} />
                        <span className={prompt.clipsRage ? "prompt " : "prompt hidden"}><FormattedMessage id='mediaPublish.check'/></span>
                    </div>
                </div>
            </div> 
            <div className="row">
                <div className="form-group pull-right">
                    <label className="control-label">{property.volume.title}</label>
                    <div className="input-container input-w-2">
                        <select className="form-control" value={property.volume.name}
                            onChange={event => this.onChange("volume", event)}>
                            {
                                property.volume.list.map((option, index) => {
                                    let value = option.name;
                                    return <option key={index} value={value}>
                                        {value}
                                    </option>
                                })}
                        </select>
                    </div>
                </div>
            </div>
            <div className="row">
                <button className="btn btn-primary pull-right" onClick={() => { this.playerVideoAssetClick('apply') }}><FormattedMessage id='mediaPublish.apply'/></button>
                <button className="btn btn-gray margin-right-1 pull-right" onClick={() => { this.playerVideoAssetClick('reset') }}><FormattedMessage id='mediaPublish.reset'/></button>
            </div>
        </div>
    }
}

export default injectIntl(PlayerPicAsset)