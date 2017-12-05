import React,{ PureComponent } from 'react';
import { numbersValid } from '../../util/index';

import {FormattedMessage,injectIntl, FormattedDate} from 'react-intl';

class PlayerPicAsset extends PureComponent{
    constructor(props){
        super(props);

        this.state = {
            //计划
            property:{
                //图片素材
                assetName: { key: "assetName", title: this.props.intl.formatMessage({id:'mediaPublish.materialName'}), placeholder: this.props.intl.formatMessage({id:'mediaPublish.materialName'}), value: "" },
                displayMode: { key: "displayMode", title: this.props.intl.formatMessage({id:'mediaPublish.displayMethod'}), list: [{ id: 1, name: '铺满' }, { id: 2, name: '原始比例' }, { id: 3, name: '4:3' }, { id: 4, name: '5:4' }, { id: 5, name: '16.9' }], index: 0, name: "铺满" },
                animation: {
                    key: "animation", title: this.props.intl.formatMessage({id:'mediaPublish.animation'}),
                    list: [
                        { id: 1, name: '立即显示' }, { id: 2, name: '闪烁' }, { id: 3, name: '长串左移' },
                        { id: 4, name: '上移' }, { id: 5, name: '下移' }, { id: 6, name: '左移' }, { id: 7, name: '右移' },
                        { id: 8, name: '自上而下展现' }, { id: 9, name: '自下而上展现' }, { id: 10, name: '自右而左展现' }, { id: 11, name: '自左而右展现' },
                        { id: 12, name: '自上而下百叶窗' }, { id: 13, name: '自下而上百叶窗' }, { id: 14, name: '自右而左百叶窗' }, { id: 15, name: '自左而右百叶窗' },
                        { id: 16, name: '自上而下棋盘格' }, { id: 17, name: '自下而上棋盘格' }, { id: 18, name: '自右而左棋盘格' }, { id: 19, name: '自左而右棋盘格' },
                        { id: 20, name: '上下向中间合拢' }, { id: 21, name: '中间向上下展开' }, { id: 22, name: '左右向中间合拢' }, { id: 23, name: '中间向左右展开' },
                        { id: 24, name: '矩形自四周向中心合拢' }, { id: 25, name: '矩形自中心向四周展开' }, { id: 26, name: '向左拉幕' }, { id: 27, name: '向右拉幕' },
                        { id: 28, name: '向上拉幕' }, { id: 29, name: '向下拉幕' }, { id: 30, name: '矩形自左下向右上展现' }, { id: 31, name: '矩形自左上向右下展现' },
                        { id: 32, name: '矩形自右下向左上展现' }, { id: 33, name: '矩形自右上向左下展现' }, { id: 34, name: '斜线自左上向右下展现' }, { id: 35, name: '斜线自右下向左上展现' },
                        { id: 36, name: '随机' }
                    ], index: 0
                },
                playDuration: { key: "playDuration", title: this.props.intl.formatMessage({id:'mediaPublish.playDuration'}), placeholder: 's', value: "" },
                playSpeed: { key: "playSpeed", title: this.props.intl.formatMessage({id:'mediaPublish.playSpeed'}), placeholder: 'm/s', value: "" },
            },
            prompt:{
                //计划
                playDuration: false, playSpeed: false,
            }
        }

        this.onChange = this.onChange.bind(this);
        this.playerPicAssetClick = this.playerPicAssetClick.bind(this);
    }


    onChange(id, value) {
        console.log("id:", id);
        if(id == "displayMode" || id == "animation"){
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
        else{
            let prompt = false;        
            const val = value.target.value;
            if (!numbersValid(val)) {
                prompt = true;
            }
    
            this.setState({
                property: Object.assign({}, this.state.property, { [id]: Object.assign({}, this.state.property[id], { value: val }) }),
                prompt: Object.assign({}, this.state.prompt, { [id]: prompt })
            })
        }
    }

    playerPicAssetClick(id) {
        const { displayMode, animation, playDuration, playSpeed } = this.state.property;
        switch (id) {
            case "apply":
                break;
            case "reset":
                this.setState({
                    property: Object.assign({}, this.state.property, {
                        displayMode: Object.assign({}, displayMode, { index: 0, name: "铺满" }),
                        animation: Object.assign({}, animation, { index: 0, name: "立即显示" }),
                        playDuration: Object.assign({}, playDuration, { value: "" }),
                        playSpeed: Object.assign({}, playSpeed, { value: "" }),
                    })
                })
                break;
        }
    }

    render(){
        const {property, prompt} = this.state;
        return <div className="pro-container playerPicAsset">
            <div className="form-group">
                <label className="control-label">{property.assetName.title}</label>
                <div className="input-container">
                    <input type="text" className="form-control" disabled="disabled"
                        value={property.assetName.value} />
                </div>
            </div>
            <div className="form-group">
                <label className="control-label">{property.displayMode.title}</label>
                <div className="input-container">
                    <select className="form-control" value={property.displayMode.name}
                        onChange={event => this.onChange("displayMode", event)}>
                        {
                            property.displayMode.list.map((option, index) => {
                                let value = option.name;
                                return <option key={index} value={value}>
                                    {value}
                                </option>
                            })}
                    </select>
                </div>
            </div>
            <div className="form-group">
                <label className="control-label">{property.animation.title}</label>
                <div className="input-container">
                    <select className="form-control" value={property.animation.name}
                        onChange={event => this.onChange("animation", event)}>
                        {
                            property.animation.list.map((option, index) => {
                                let value = option.name;
                                return <option key={index} value={value}>
                                    {value}
                                </option>
                            })}
                    </select>
                </div>
            </div>
            <div className="form-group">
                <label className="col-sm-3 control-label">{property.playDuration.title}</label>
                <div className="input-container">
                    <input type="text" className="form-control"
                        placeholder={property.playDuration.placeholder} maxLength="8"
                        value={property.playDuration.value}
                        onChange={event => this.onChange("playDuration", event)} />
                    <span className={prompt.playDuration ? "prompt " : "prompt hidden"}><FormattedMessage id='mediaPublish.check'/></span>
                </div>
            </div>
            <div className="form-group">
                <label className="col-sm-3 control-label">{property.playSpeed.title}</label>
                <div className="input-container">
                    <input type="text" className="form-control"
                        placeholder={property.playSpeed.placeholder} maxLength="8"
                        value={property.playSpeed.value}
                        onChange={event => this.onChange("playSpeed", event)} />
                    <span className={prompt.playSpeed ? "prompt " : "prompt hidden"}><FormattedMessage id='mediaPublish.check'/></span>
                </div>
            </div>
            <div className="row">
                <button className="btn btn-primary pull-right" onClick={() => { this.playerPicAssetClick('apply') }}><FormattedMessage id='mediaPublish.apply'/></button>
                <button className="btn btn-gray pull-right" onClick={() => { this.playerPicAssetClick('reset') }}><FormattedMessage id='mediaPublish.reset'/></button>
            </div>
        </div>
    }
}

export default injectIntl(PlayerPicAsset)