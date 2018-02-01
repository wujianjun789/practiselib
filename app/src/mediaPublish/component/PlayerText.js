import React, { Component } from 'react'
import reactCSS from 'reactcss'
import { SketchPicker } from 'react-color'
import { FormattedMessage, injectIntl, FormattedDate } from 'react-intl';
import { getItembyId } from '../../api/mediaPublish'
import { numbersValid } from '../../util/index'

class PlayerText extends Component {
    state = {
        name: { title: this.props.intl.formatMessage({ id: 'mediaPublish.materialName' }), value: '' },
        text: { title: this.props.intl.formatMessage({ id: 'mediaPublish.textContent' }), value: '' },
        fontType: { title: this.props.intl.formatMessage({ id: 'mediaPublish.selectFont' }), list: [{ id: 0, name: '微软雅黑' }, { id: 1, name: '宋体' }, { id: 2, name: 'serif' }, { id: 3, name: 'monospace' }], index: 0 },
        fontColor: {
            title: this.props.intl.formatMessage({ id: 'mediaPublish.fontColor' }),
            value: { r: 241, g: 112, b: 19, a: 1, },
        },
        fontSize: { title: this.props.intl.formatMessage({ id: 'mediaPublish.fontSize' }), list: [{ id: 0, name: '12pt' }, { id: 1, name: '13pt' }, { id: 2, name: '14pt' }, { id: 3, name: '15pt' }, { id: 4, name: '16pt' },], index: 0 },
        bgColor: {
            title: this.props.intl.formatMessage({ id: 'mediaPublish.bgColor' }),
            value: { r: 241, g: 112, b: 19, a: 1, },
        },
        bgTransparent: { title: this.props.intl.formatMessage({ id: 'mediaPublish.bgTransparent' }), value: false },
        alignment: {
            title: this.props.intl.formatMessage({ id: 'mediaPublish.alignment' }),
            list: [{ id: 0, name: '左上' }, { id: 1, name: '左中' }, { id: 2, name: '左下' }, { id: 3, name: '中上' }, { id: 4, name: '上下居中' }, { id: 5, name: '中下' }, { id: 6, name: '右上' }, { id: 7, name: '右中' }, { id: 8, name: '右下' },],
            index: 0
        },
        playDuration: { title: this.props.intl.formatMessage({ id: 'mediaPublish.playDuration' }), placeholder: '秒', value: '' },
        animation: {
            title: this.props.intl.formatMessage({ id: 'mediaPublish.animation' }),
            list: [
                { id: 0, name: '立即显示' }, { id: 1, name: '闪烁' }, { id: 2, name: '长串左移' },
                { id: 3, name: '上移' }, { id: 4, name: '下移' }, { id: 5, name: '左移' }, { id: 6, name: '右移' },
                { id: 7, name: '自上而下展现' }, { id: 8, name: '自下而上展现' }, { id: 9, name: '自右而左展现' }, { id: 10, name: '自左而右展现' },
                { id: 11, name: '自上而下百叶窗' }, { id: 12, name: '自下而上百叶窗' }, { id: 13, name: '自右而左百叶窗' }, { id: 14, name: '自左而右百叶窗' },
                { id: 15, name: '自上而下棋盘格' }, { id: 16, name: '自下而上棋盘格' }, { id: 17, name: '自右而左棋盘格' }, { id: 18, name: '自左而右棋盘格' },
                { id: 19, name: '上下向中间合拢' }, { id: 20, name: '中间向上下展开' }, { id: 21, name: '左右向中间合拢' }, { id: 22, name: '中间向左右展开' },
                { id: 23, name: '矩形自四周向中心合拢' }, { id: 24, name: '矩形自中心向四周展开' }, { id: 25, name: '向左拉幕' }, { id: 26, name: '向右拉幕' },
                { id: 27, name: '向上拉幕' }, { id: 28, name: '向下拉幕' }, { id: 29, name: '矩形自左下向右上展现' }, { id: 30, name: '矩形自左上向右下展现' },
                { id: 31, name: '矩形自右下向左上展现' }, { id: 32, name: '矩形自右上向左下展现' }, { id: 33, name: '斜线自左上向右下展现' }, { id: 34, name: '斜线自右下向左上展现' },
                { id: 35, name: '随机' }
            ], index: 0
        },
        playSpeed: { title: this.props.intl.formatMessage({ id: 'mediaPublish.playSpeed' }), placeholder: '秒', value: '' },
        rowSpace: { title: this.props.intl.formatMessage({ id: 'mediaPublish.lineSpacing' }), placeholder: 'pt', value: '' },
        charSpace: { title: this.props.intl.formatMessage({ id: 'mediaPublish.wordSpacing' }), placeholder: 'pt', value: '' },
        showFontColor: false,
        showBgColor: false,
    }

    componentDidMount() {
        this._isMounted = true;
        this.initPlayerText();
    }
    initPlayerText = () => {
        const { projectId, sceneId, planId, areaId, data } = this.props;
        getItembyId(projectId, planId, sceneId, areaId, data.id, 0, res => {
            this._data = res;
            const {
                text,
                font: { name, size },
                fontColor,
                background: { color, transparent },
                alignment,
                baseInfo: { playDuration },
                inTransition: { transition, speed },
                rowSpace,
                charSpace
            } = res;
            this._isMounted && this.setState({
                name: { ...this.state.name, value: data.name },
                text: { ...this.state.text, value: text },
                fontType: { ...this.state.fontType, index: 0 },
                fontColor: {
                    ...this.state.fontColor, value: {
                        r: fontColor.red,
                        g: fontColor.green,
                        b: fontColor.blue,
                        a: fontColor.alpha
                    }
                },
                fontSize: { ...this.state.fontSize, index: 0 },
                bgColor: {
                    ...this.state.bgColor, value: {
                        r: color.red,
                        g: color.green,
                        b: color.blue,
                        a: color.alpha
                    }
                },
                bgTransparent: { ...this.state.bgTransparent, value: Boolean(transparent) },
                alignment: { ...this.state.alignment, index: alignment },
                playDuration: { ...this.state.playDuration, value: playDuration },
                animation: { ...this.state.animation, index: transition },
                playSpeed: { ...this.state.playSpeed, value: speed },
                rowSpace: { ...this.state.rowSpace, value: rowSpace },
                charSpace: { ...this.state.charSpace, value: charSpace },
            })
        })
    }
    handleBgTransparent = (e) => {
        this.setState({
            bgTransparent: { ...this.state.bgTransparent, value: e.target.checked }
        })
    }
    handleColorClick = (e) => {
        this.setState({ [e.target.id]: !this.state[e.target.id] })
    }
    handleColorHide = (e) => {
        this.setState({ [e.target.id]: false })
    }
    onChange = (type, e) => {
        switch (type) {
            case 'fontColor':
            case 'bgColor': {
                this.setState({
                    [type]: { ...this.state[type], value: e.rgb }
                })
                break;
            }
            case 'text':
            case 'playDuration':
            case 'playSpeed':
            case 'rowSpace':
            case 'charSpace': {
                this.setState({
                    [type]: { ...this.state[type], value: e.target.value }
                })
                break;
            }
            case 'fontType':
            case 'fontSize':
            case 'alignment':
            case 'animation': {
                this.setState({
                    [type]: { ...this.state[type], index: e.target.selectedIndex }
                })
                break;
            }
            default:
                // console.log('未知的动作类型')
                break;
        }
    }
    handleSubmit = (type) => {
        const { name, text, fontType, fontColor, fontSize, bgColor, bgTransparent,
            alignment, playDuration, animation, playSpeed, rowSpace, charSpace, } = this.state;
        switch (type) {
            case 'apply':
                let _data = {
                    "baseInfo": {
                        "id": 1,
                        "type": 0,
                        "file": "简单文本",
                        "playDuration": 0,
                        "logFlag": 0,
                        "materialId": "simpleText"
                    },
                    "text": "string",
                    "background": {
                        "transparent": 0,
                        "picture": "string",
                        "picAlignment": 0,
                        "color": {
                            "red": 0,
                            "green": 0,
                            "blue": 0,
                            "amber": 0,
                            "alpha": 0
                        },
                        "colorKey": {
                            "red": 0,
                            "green": 0,
                            "blue": 0,
                            "amber": 0,
                            "alpha": 0
                        },
                        "materialId": ""
                    },
                    "alignment": 0,
                    "charSpace": 0,
                    "rowSpace": 0,
                    "fontColor": {
                        "red": 0,
                        "green": 0,
                        "blue": 0,
                        "amber": 0,
                        "alpha": 0
                    },
                    "font": {
                        "name": "string",
                        "size": 0,
                        "bold": true,
                        "italic": false,
                        "underline": true,
                        "strikeout": false
                    },
                    "inTransition": {
                        "transition": 0,
                        "speed": 0
                    }
                }
                const { baseInfo, background, font } = this._data
                const data = Object.assign({}, this._data, {
                    baseInfo: {
                        ...baseInfo,
                        playDuration: playDuration.value
                    },
                    text: text.value,
                    background: {
                        ...background,
                        transparent: bgTransparent.value,
                        color: {
                            red: bgColor.value.r,
                            greeen: bgColor.value.g,
                            blue: bgColor.value.b,
                            amber: 0,
                            alpha: bgColor.value.a
                        },
                        colorKey: {
                            red: bgColor.value.r,
                            greeen: bgColor.value.g,
                            blue: bgColor.value.b,
                            amber: 0,
                            alpha: bgColor.value.a
                        }
                    },
                    alignment: alignment.list[alignment.index].name,
                    charSpace: charSpace.value,
                    rowSpace: rowSpace.value,
                    fontColor: {
                        red: fontColor.value.r,
                        greeen: fontColor.value.g,
                        blue: fontColor.value.b,
                        amber: 0,
                        alpha: fontColor.value.a
                    },
                    font: {
                        ...font,
                        name: fontType.list[fontType.index].name,
                        size: fontSize.list[fontSize.index].name,
                    },
                    inTransition: {
                        transition: animation.list[animation.index].name,
                        speed: playSpeed.value
                    }
                })
                console.log(data)
                this.props.applyClick && this.props.applyClick(data);
                //after apply
                // this.initPlayerText()
                break;
            case 'reset':
                this.setState({
                    name: { ...name, value: '' },
                    text: { ...text, value: '' },
                    fontType: { ...fontType, index: 0 },
                    fontColor: { ...fontColor, value: { r: 241, g: 112, b: 19, a: 1, }, },
                    fontSize: { ...fontSize, index: 0 },
                    bgColor: { ...bgColor, value: { r: 241, g: 112, b: 19, a: 1, }, },
                    bgTransparent: { ...bgTransparent, value: false },
                    alignment: { ...alignment, index: 0 },
                    playDuration: { ...playDuration, value: '' },
                    animation: { ...animation, index: 0 },
                    playSpeed: { ...playSpeed, value: '' },
                    rowSpace: { ...rowSpace, value: '' },
                    charSpace: { ...charSpace, value: '' },
                })
                break;
        }
    }

    render() {
        const { name, text, fontType, fontColor, fontSize, bgColor, bgTransparent,
            alignment, playDuration, animation, playSpeed, rowSpace, charSpace, showFontColor, showBgColor } = this.state;
        const styles = reactCSS({
            'default': {
                fontColor: {
                    width: '40px',
                    height: '40px',
                    borderRadius: '2px',
                    background: `rgba(${fontColor.value.r}, ${fontColor.value.g}, ${fontColor.value.b}, ${fontColor.value.a})`,
                },
                bgColor: {
                    width: '40px',
                    height: '40px',
                    borderRadius: '2px',
                    background: `rgba(${bgColor.value.r}, ${bgColor.value.g}, ${bgColor.value.b}, ${bgColor.value.a})`,
                },
                swatch: {
                    // padding: '5px',
                    background: '#fff',
                    borderRadius: '1px',
                    boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                    display: 'inline-block',
                    cursor: 'pointer',
                },
                popover: {
                    position: 'absolute',
                    zIndex: '2',
                    top: '40px',
                    left: '-204px'
                },
                cover: {
                    position: 'fixed',
                    top: '0px',
                    right: '0px',
                    bottom: '0px',
                    left: '0px',
                },
            },
        });
        return (
            <div class='pro-container playerText'>
                <div class='row'>
                    <div class='form-group'>
                        <label>{name.title}</label>
                        <div class='input-container input-w-1'>
                            <input type='text' class='form-control' disabled='disabled' value={name.value} />
                        </div>
                    </div>
                </div>
                <div class='row'>
                    <div class='form-group'>
                        <label>{text.title}</label>
                        <div class='input-container input-w-1'>
                            <textarea class='text-content' value={text.value} onChange={e => this.onChange('text', e)} />
                        </div>
                    </div>
                </div>
                <div class='row'>
                    <div class='form-group margin-right-2'>
                        <label>{fontType.title}</label>
                        <div class='input-container input-w-2'>
                            <select class='form-control' value={fontType.index}
                                onChange={e => this.onChange('fontType', e)}>
                                {
                                    fontType.list.map((item, i) => {
                                        return <option key={i} value={item.id}>{item.name}</option>
                                    })
                                }
                            </select>
                        </div>
                    </div>
                    <div class='form-group'>
                        <label>{fontColor.title}</label>
                        <div class='input-container'>
                            <div style={styles.swatch} >
                                <div id='showFontColor' style={styles.fontColor} onClick={this.handleColorClick} />
                            </div>
                            {showFontColor ? <div style={styles.popover}>
                                <div id='showFontColor' style={styles.cover} onClick={this.handleColorHide} />
                                <SketchPicker color={fontColor.value} onChange={e => this.onChange('fontColor', e)} />
                            </div> : null}
                        </div>
                    </div>
                </div>
                <div class='row'>
                    <div class='form-group margin-right-2'>
                        <label>{fontSize.title}</label>
                        <div class='input-container input-w-2'>
                            <select class='form-control' value={fontSize.index}
                                onChange={e => this.onChange('fontSize', e)}>
                                {
                                    fontSize.list.map((item, i) => {
                                        return <option key={i} value={item.id}>{item.name}</option>
                                    })
                                }
                            </select>
                        </div>
                    </div>
                    <div class='form-group'>
                        <label>{bgColor.title}</label>
                        <div class='input-container'>
                            <div style={styles.swatch} >
                                <div id='showBgColor' style={styles.bgColor} onClick={this.handleColorClick} />
                            </div>
                            {showBgColor ? <div style={styles.popover}>
                                <div id='showBgColor' style={styles.cover} onClick={this.handleColorHide} />
                                <SketchPicker color={bgColor.value} onChange={e => this.onChange('bgColor', e)} />
                            </div> : null}
                        </div>
                    </div>
                    <div class='form-group'>
                        <label>{bgTransparent.title}</label>
                        <div class='input-container'>
                            <input type='checkbox' onClick={this.handleBgTransparent} checked={bgTransparent.value} />
                        </div>
                    </div>
                </div>
                <div class='row'>
                    <div class='form-group margin-right-2'>
                        <label>{alignment.title}</label>
                        <div class='input-container input-w-2'>
                            <select class='form-control' value={alignment.index}
                                onChange={e => this.onChange('alignment', e)}>
                                {
                                    alignment.list.map((item, i) => {
                                        return <option key={i} value={item.id}>{item.name}</option>
                                    })
                                }
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>{playDuration.title}</label>
                        <div class="input-container input-w-2">
                            <input type="text" class="form-control"
                                placeholder={playDuration.placeholder} maxLength="8"
                                value={playDuration.value}
                                onChange={e => this.onChange("playDuration", e)} />
                            {/* <span class={prompt.playDuration ? "prompt " : "prompt hidden"}><FormattedMessage id='mediaPublish.check' /></span> */}
                        </div>
                    </div>
                </div>
                <div class='row'>
                    <div class="form-group margin-right-2">
                        <label>{animation.title}</label>
                        <div class="input-container input-w-2">
                            <select class="form-control" value={animation.index}
                                onChange={e => this.onChange("animation", e)}>
                                {
                                    animation.list.map((item, i) => {
                                        return <option key={i} value={item.id}>{item.name}</option>
                                    })}
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>{playSpeed.title}</label>
                        <div class="input-container input-w-2">
                            <input type="text" class="form-control"
                                placeholder={playSpeed.placeholder} maxLength="8"
                                value={playSpeed.value}
                                onChange={e => this.onChange("playSpeed", e)} />
                            {/* <span class={prompt.playSpeed ? "prompt " : "prompt hidden"}><FormattedMessage id='mediaPublish.check' /></span> */}
                        </div>
                    </div>
                </div>
                <div class='row'>
                    <div class="form-group margin-right-2">
                        <label>{rowSpace.title}</label>
                        <div class="input-container input-w-2">
                            <input type="text" class="form-control"
                                placeholder={rowSpace.placeholder} maxLength="8"
                                value={rowSpace.value}
                                onChange={e => this.onChange("rowSpace", e)} />
                            {/* <span class={prompt.rowSpace ? "prompt " : "prompt hidden"}><FormattedMessage id='mediaPublish.check' /></span> */}
                        </div>
                    </div>
                    <div class="form-group">
                        <label title={charSpace.title}>{charSpace.title}</label>
                        <div class="input-container input-w-2">
                            <input type="text" class="form-control"
                                placeholder={charSpace.placeholder} maxLength="8"
                                value={charSpace.value}
                                onChange={e => this.onChange("charSpace", e)} />
                            {/* <span class={prompt.charSpace ? "prompt " : "prompt hidden"}><FormattedMessage id='mediaPublish.check' /></span> */}
                        </div>
                    </div>
                </div>
                <div class="row">
                    <button class="btn btn-primary pull-right" onClick={() => { this.handleSubmit('apply') }}><FormattedMessage id='mediaPublish.apply' /></button>
                    <button class="btn btn-gray pull-right margin-right-1" onClick={() => { this.handleSubmit('reset') }}><FormattedMessage id='mediaPublish.reset' /></button>
                </div>
            </div>
        )
    }
}

export default injectIntl(PlayerText)