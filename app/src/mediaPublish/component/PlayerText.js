import React, { PureComponent } from 'react'
import { numbersValid } from '../../util/index'

import ColorPicker from '../../components/ColorPicker'

import { FormattedMessage, injectIntl, FormattedDate } from 'react-intl';

class PlayerText extends PureComponent {
    state = {
        property: {
            assetName: { key: "assetName", title: this.props.intl.formatMessage({ id: 'mediaPublish.materialName' }), placeholder: this.props.intl.formatMessage({ id: 'mediaPublish.materialName' }), value: "" },

            textContent: { key: 'textContent', title: this.props.intl.formatMessage({ id: 'mediaPublish.textContent' }), value: '' },
            fontType: { key: 'fontType', title: this.props.intl.formatMessage({ id: 'mediaPublish.selectFont' }), list: [{ id: 1, name: '微软雅黑' }, { id: 2, name: '宋体' }, { id: 3, name: 'serif' }, { id: 4, name: 'monospace' }], index: 0 },
            alignment: { key: 'alignment', title: this.props.intl.formatMessage({ id: 'mediaPublish.alignment' }), list: [{ id: 1, name: '左上' }, { id: 2, name: '左中' }, { id: 3, name: '左下' }, { id: 4, name: '中上' }, { id: 5, name: '上下居中' }, { id: 6, name: '中下' }, { id: 7, name: '右上' }, { id: 8, name: '右中' }, { id: 9, name: '右下' },], index: 0 },
            fontSize: { key: 'fontSize', title: this.props.intl.formatMessage({ id: 'mediaPublish.fontSize' }), list: [{ id: 1, name: '12pt' }, { id: 2, name: '13pt' }, { id: 3, name: '14pt' }, { id: 4, name: '15pt' }, { id: 5, name: '16pt' },], index: 0 },
            wordSpacing: { key: 'wordSpacing', title: this.props.intl.formatMessage({ id: 'mediaPublish.wordSpacing' }), placeholder: 'pt', value: '' },
            lineSpacing: { key: 'lineSpacing', title: this.props.intl.formatMessage({ id: 'mediaPublish.lineSpacing' }), placeholder: 'pt', value: '' },
            fontColor: { key: 'fontColor', title: this.props.intl.formatMessage({ id: 'mediaPublish.fontColor' }), value: '#456' },
            bgColor: { key: 'bgColor', title: this.props.intl.formatMessage({ id: 'mediaPublish.bgColor' }), value: '#789' },
            bgTransparent: { key: 'bgTransparent', title: this.props.intl.formatMessage({ id: 'mediaPublish.bgTransparent' }), value: false },
            playDuration: { key: "playDuration", title: this.props.intl.formatMessage({ id: 'mediaPublish.playDuration' }), placeholder: 's', value: "" },
            playSpeed: { key: "playSpeed", title: this.props.intl.formatMessage({ id: 'mediaPublish.playSpeed' }), placeholder: 'm/s', value: "" },
            animation: {
                key: "animation", title: this.props.intl.formatMessage({ id: 'mediaPublish.animation' }),
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
        },
        prompt: {
            lineSpacing: false, wordSpacing: false, playDuration: false, playSpeed: false
        },
        //字体颜色，背景颜色,背景透明
        displayFontColorPicker: false,
        displayBgColorPicker: false,
    }
    onChange = (id, value) => {
        console.log("id:", id);
        if (id == "fontType" || id == "alignment" || id == "animation" || id == "fontSize") {
            const curIndex = value.target.selectedIndex;
            this.setState({
                property: Object.assign({}, this.state.property, {
                    [id]: Object.assign({}, this.state.property[id], {
                        index: curIndex,
                        name: this.state.property[id].list[curIndex].name
                    })
                })
            })
        } else if (id == 'bgColor' || id == 'fontColor') {
            this.setState({
                property: Object.assign({}, this.state.property, { [id]: Object.assign({}, this.state.property[id], { value: value }) }),
            })
        }
        else {
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

    handleBgTransparent = (e) => {
        e.stopPropagation();
        this.setState({ property: { ...this.state.property, bgTransparent: { ...this.state.property.bgTransparent, value: e.target.checked } } })
    }
    playerTextClick = (id) => {
        const { textContent, fontType, fontColor, bgColor, bgTransparent, alignment, fontSize, playDuration, animation, playSpeed, wordSpacing, lineSpacing } = this.state.property;
        switch (id) {
            case 'apply':
                break;
            case 'reset':
                this.setState({
                    property: Object.assign({}, this.state.property, {
                        textContent: Object.assign({}, textContent, { value: '' }),
                        fontType: Object.assign({}, fontType, { index: 0, name: '微软雅黑' }),
                        fontColor: Object.assign({}, fontColor),
                        bgColor: Object.assign({}, bgColor),
                        bgTransparent: Object.assign({}, bgTransparent),
                        alignment: Object.assign({}, alignment, { index: 0, name: '左上' }),
                        fontSize: Object.assign({}, fontSize, { index: 0, name: '12pt' }),
                        animation: Object.assign({}, animation, { index: 0, name: "立即显示" }),
                        playDuration: Object.assign({}, playDuration, { value: "" }),
                        playSpeed: Object.assign({}, playSpeed, { value: "" }),
                        wordSpacing: Object.assign({}, wordSpacing, { value: '' }),
                        lineSpacing: Object.assign({}, lineSpacing, { value: '' }),
                        fontColor: Object.assign({}, fontColor, { value: '#789' }),
                        bgColor: Object.assign({}, bgColor, { value: '#456' }),
                        bgTransparent: Object.assign({}, bgTransparent, { value: false }),
                    })
                });
                break;
        }
    }
    render() {
        const { property, prompt } = this.state;
        return <div className={"pro-container playerText "}>
            <div className='row'>
                <div className='form-group'>
                    <label>{property.assetName.title}</label>
                    <div className='input-container input-w-1'>
                        <input type='text' className='form-control' disabled='disabled'
                            value={property.assetName.value} />
                    </div>
                </div>
            </div>
            <div class='row'>
                <div className='form-group'>
                    <label>{property.textContent.title}</label>
                    <div className='input-container input-w-1'>
                        <textarea className='text-content' value={property.textContent.value} onChange={e => this.onChange('textContent', e)} />
                    </div>
                </div>
            </div>
            <div class='row'>
                <div className='form-group margin-right-2'>
                    <label>{property.fontType.title}</label>
                    <div className='input-container input-w-2'>
                        <select className='form-control' value={property.fontType.name}
                            onChange={e => this.onChange('fontType', e)}>
                            {
                                property.fontType.list.map((item, index) => {
                                    return <option key={index} value={item.name}>{item.name}</option>
                                })
                            }
                        </select>
                    </div>
                </div>
                <div className='form-group'>
                    <label>{property.fontColor.title}</label>
                    <div className='input-container'>
                        <ColorPicker onChange={value => this.onChange('fontColor', value)} value={property.fontColor.value} />
                    </div>
                </div>
            </div>
            <div class='row'>
                <div className='form-group margin-right-2'>
                    <label>{property.fontSize.title}</label>
                    <div className='input-container input-w-2'>
                        <select className='form-control' value={property.fontSize.name}
                            onChange={e => this.onChange('fontSize', e)}>
                            {
                                property.fontSize.list.map((item, index) => {
                                    return <option key={index} value={item.name}>{item.name}</option>
                                })
                            }
                        </select>
                    </div>
                </div>
                <div className='form-group'>
                    <label>{property.bgColor.title}</label>
                    <div className='input-container'>
                        <ColorPicker onChange={value => this.onChange('bgColor', value)} value={property.bgColor.value} />
                    </div>
                </div>
                <div className='form-group'>
                    <label>{property.bgTransparent.title}</label>
                    <div className='input-container'>
                        <input type='checkbox' onClick={this.handleBgTransparent} checked={property.bgTransparent.value} />
                    </div>

                </div>
            </div>
            <div class='row'>
                <div className='form-group margin-right-2'>
                    <label>{property.alignment.title}</label>
                    <div className='input-container input-w-2'>
                        <select className='form-control' value={property.alignment.name}
                            onChange={e => this.onChange('alignment', e)}>
                            {
                                property.alignment.list.map((item, index) => {
                                    return <option key={index} value={item.name}>{item.name}</option>
                                })
                            }
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <label>{property.playDuration.title}</label>
                    <div className="input-container input-w-2">
                        <input type="text" className="form-control"
                            placeholder={property.playDuration.placeholder} maxLength="8"
                            value={property.playDuration.value}
                            onChange={event => this.onChange("playDuration", event)} />
                        <span className={prompt.playDuration ? "prompt " : "prompt hidden"}><FormattedMessage id='mediaPublish.check' /></span>
                    </div>
                </div>
            </div>
            <div class='row'>
                <div className="form-group margin-right-2">
                    <label>{property.animation.title}</label>
                    <div className="input-container input-w-2">
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
                    <label>{property.playSpeed.title}</label>
                    <div className="input-container input-w-2">
                        <input type="text" className="form-control"
                            placeholder={property.playSpeed.placeholder} maxLength="8"
                            value={property.playSpeed.value}
                            onChange={event => this.onChange("playSpeed", event)} />
                        <span className={prompt.playSpeed ? "prompt " : "prompt hidden"}><FormattedMessage id='mediaPublish.check' /></span>
                    </div>
                </div>
            </div>
            <div class='row'>
                <div className="form-group margin-right-2">
                    <label>{property.lineSpacing.title}</label>
                    <div className="input-container input-w-2">
                        <input type="text" className="form-control"
                            placeholder={property.lineSpacing.placeholder} maxLength="8"
                            value={property.lineSpacing.value}
                            onChange={event => this.onChange("lineSpacing", event)} />
                        <span className={prompt.lineSpacing ? "prompt " : "prompt hidden"}><FormattedMessage id='mediaPublish.check' /></span>
                    </div>
                </div>
                <div className="form-group">
                    <label>{property.wordSpacing.title}</label>
                    <div className="input-container input-w-2">
                        <input type="text" className="form-control"
                            placeholder={property.wordSpacing.placeholder} maxLength="8"
                            value={property.wordSpacing.value}
                            onChange={event => this.onChange("wordSpacing", event)} />
                        <span className={prompt.wordSpacing ? "prompt " : "prompt hidden"}><FormattedMessage id='mediaPublish.check' /></span>
                    </div>
                </div>
            </div>
            <div className="row">
                <button className="btn btn-primary pull-right" onClick={() => { this.playerTextClick('apply') }}><FormattedMessage id='mediaPublish.apply' /></button>
                <button className="btn btn-gray pull-right margin-right-1" onClick={() => { this.playerTextClick('reset') }}><FormattedMessage id='mediaPublish.reset' /></button>
            </div>
        </div>
    }
}

export default injectIntl(PlayerText)