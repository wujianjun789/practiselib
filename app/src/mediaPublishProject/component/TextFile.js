import React, { Component } from 'react'
import reactCSS from 'reactcss'
import { SketchPicker } from 'react-color'
import { FormattedMessage, injectIntl, FormattedDate } from 'react-intl';
import { getItembyId } from '../../api/mediaPublish'
import { numbersValid } from '../../util/index'

function getIdByValue(list, value) {
    const index = list.findIndex(item => item.name === value)
    if (index !== -1) {
        return list[index].id
    } else {
        return list[0].id
    }
}
function getValueById(list, id) {
    const index = list.findIndex(item => item.id === id);
    if (index !== -1) {
        return list[index].name
    } else {
        return list[0].name
    }
}
class TextFile extends Component {
    state = {
        name: { title: this.props.intl.formatMessage({ id: 'mediaPublish.materialName' }), value: '' },
        text: { title: this.props.intl.formatMessage({ id: 'mediaPublish.textContent' }), value: '' },
        fontType: { title: this.props.intl.formatMessage({ id: 'mediaPublish.selectFont' }), list: [{ id: 0, name: '宋体' }, { id: 1, name: '黑体' }], index: 0 },//index代表当前选中项的id，非下标
        fontColor: {
            title: this.props.intl.formatMessage({ id: 'mediaPublish.fontColor' }),
            value: { r: 255, g: 255, b: 255, a: 0, },
        },
        fontSize: {
            title: this.props.intl.formatMessage({ id: 'mediaPublish.fontSize' }),
            list: [
                { id: 0, name: 12 }, { id: 1, name: 13 }, { id: 2, name: 14 }, { id: 3, name: 15 }, { id: 4, name: 16 },
                { id: 5, name: 17 }, { id: 6, name: 18 }, { id: 7, name: 19 }, { id: 8, name: 20 }, { id: 9, name: 21 },
                { id: 10, name: 22 }, { id: 11, name: 23 }, { id: 12, name: 24 }, { id: 13, name: 25 }, { id: 14, name: 26 },
                { id: 15, name: 27 }, { id: 16, name: 28 }, { id: 17, name: 29 }, { id: 18, name: 30 }, { id: 19, name: 31 },
                { id: 20, name: 32 }, { id: 21, name: 33 }, { id: 22, name: 34 }, { id: 23, name: 35 }, { id: 24, name: 36 },
                { id: 25, name: 37 }, { id: 26, name: 38 }, { id: 27, name: 39 }, { id: 28, name: 40 }, { id: 29, name: 41 },
                { id: 30, name: 42 }, { id: 31, name: 43 }, { id: 32, name: 44 }, { id: 33, name: 45 }, { id: 34, name: 46 },
                { id: 35, name: 47 }, { id: 36, name: 48 }, { id: 37, name: 49 }, { id: 38, name: 50 }, { id: 39, name: 51 },
                { id: 40, name: 52 }, { id: 41, name: 53 }, { id: 42, name: 54 }, { id: 43, name: 55 }, { id: 44, name: 56 },
                { id: 45, name: 57 }, { id: 46, name: 58 }, { id: 47, name: 59 }, { id: 48, name: 60 }
            ],
            index: 0
        },
        bgColor: {
            title: this.props.intl.formatMessage({ id: 'mediaPublish.bgColor' }),
            value: { r: 255, g: 255, b: 255, a: 0, },
        },
        bgTransparent: { title: this.props.intl.formatMessage({ id: 'mediaPublish.bgTransparent' }), value: false },
        alignment: {
            title: this.props.intl.formatMessage({ id: 'mediaPublish.alignment' }),
            list: [{ id: 0, name: '左上' }, { id: 1, name: '左中' }, { id: 2, name: '左下' }, { id: 3, name: '中上' }, { id: 4, name: '上下居中' }, { id: 5, name: '中下' }, { id: 6, name: '右上' }, { id: 7, name: '右中' }, { id: 8, name: '右下' },],
            index: 0
        },
        playDuration: { title: this.props.intl.formatMessage({ id: 'mediaPublish.playDuration' }), placeholder: '毫秒', value: 0 },
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
            ],
            index: 0
        },
        playSpeed: { title: this.props.intl.formatMessage({ id: 'mediaPublish.playSpeed' }), placeholder: '', value: 0 },
        rowSpace: { title: this.props.intl.formatMessage({ id: 'mediaPublish.lineSpacing' }), placeholder: 'pt', value: 0 },
        charSpace: { title: this.props.intl.formatMessage({ id: 'mediaPublish.wordSpacing' }), placeholder: 'pt', value: 0 },
        showFontColor: false,
        showBgColor: false,
        prompt: {
            playDuration: false,
            playSpeed: false,
            rowSpace: false,
            charSpace: false
        }
    }

    componentDidMount() {
        this._isMounted = true;
        this.initPlayerText();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.data.id !== this.id) {
            this.initPlayerText()
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    initPlayerText = () => {
        const { projectId, sceneId, planId, areaId, data } = this.props;
        this.id = data.id;
        getItembyId(projectId, planId, sceneId, areaId, data.id, 2, res => {
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
                name: { ...this.state.name, value: data.name ? data.name : '' },
                text: { ...this.state.text, value: text },
                fontType: { ...this.state.fontType, index: getIdByValue(this.state.fontType.list, name) },
                fontColor: {
                    ...this.state.fontColor, value: {
                        r: fontColor.red,
                        g: fontColor.green,
                        b: fontColor.blue,
                        a: fontColor.alpha / 255
                    }
                },
                fontSize: { ...this.state.fontSize, index: getIdByValue(this.state.fontSize.list, size) },
                bgColor: {
                    ...this.state.bgColor, value: {
                        r: color.red,
                        g: color.green,
                        b: color.blue,
                        a: color.alpha / 255
                    }
                },
                bgTransparent: { ...this.state.bgTransparent, value: Boolean(transparent) },//返回值为0或1，或者bool值
                alignment: { ...this.state.alignment, index: alignment },//这里返回的即对齐方式的id
                playDuration: { ...this.state.playDuration, value: playDuration },
                animation: { ...this.state.animation, index: transition },//这里返回的即过渡效果的id
                playSpeed: { ...this.state.playSpeed, value: speed },
                rowSpace: { ...this.state.rowSpace, value: rowSpace },
                charSpace: { ...this.state.charSpace, value: charSpace },
                showFontColor: false,
                showBgColor: false,
                prompt: {
                    playDuration: false,
                    playSpeed: false,
                    rowSpace: false,
                    charSpace: false
                }
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
            case 'text': {
                this.setState({
                    [type]: { ...this.state[type], value: e.target.value }
                })
                break;
            }
            case 'playDuration':
            case 'playSpeed':
            case 'rowSpace':
            case 'charSpace': {
                if (!numbersValid(e.target.value)) {
                    this.setState({
                        [type]: { ...this.state[type], value: e.target.value },
                        prompt: { ...this.state.prompt, [type]: true }
                    })
                    return;
                }
                this.setState({
                    [type]: { ...this.state[type], value: Number(e.target.value) },
                    prompt: { ...this.state.prompt, [type]: false }
                })
                break;
            }
            case 'fontType':
            case 'fontSize':
            case 'alignment':
            case 'animation': {
                this.setState({
                    [type]: { ...this.state[type], index: this.state[type].list[e.target.selectedIndex].id }//此处的inde应该是选中项的id
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
            alignment, playDuration, animation, playSpeed, rowSpace, charSpace, prompt } = this.state;
        switch (type) {
            case 'apply': {
                const { baseInfo, background, font } = this._data
                const data = Object.assign({}, this._data, {
                    baseInfo: {
                        ...baseInfo,
                        playDuration: playDuration.value
                    },
                    text: text.value,
                    background: {
                        ...background,
                        transparent: Number(bgTransparent.value),
                        color: {
                            red: bgColor.value.r,
                            green: bgColor.value.g,
                            blue: bgColor.value.b,
                            amber: 0,
                            alpha: 255
                        },
                        colorKey: {
                            red: 255,
                            green: 255,
                            blue: 255,
                            amber: 0,
                            alpha: parseInt(bgColor.value.a * 255)
                        },
                        materialId: Number(this.id)
                    },
                    alignment: alignment.index,
                    charSpace: charSpace.value,
                    rowSpace: rowSpace.value,
                    fontColor: {
                        red: fontColor.value.r,
                        green: fontColor.value.g,
                        blue: fontColor.value.b,
                        amber: 0,
                        alpha: parseInt(fontColor.value.a * 255)
                    },
                    font: {
                        ...font,
                        name: getValueById(fontType.list, fontType.index),
                        size: getValueById(fontSize.list, fontSize.index),
                    },
                    inTransition: {
                        transition: animation.index,
                        speed: playSpeed.value
                    }
                })
                this.props.applyClick && this.props.applyClick(data);
                break;
            }
            case 'reset':
                {
                    this.setState({
                        name: { ...name, value: '' },
                        text: { ...text, value: '' },
                        fontType: { ...fontType, index: 0 },
                        fontColor: { ...fontColor, value: { r: 241, g: 112, b: 19, a: 1, }, },
                        fontSize: { ...fontSize, index: 0 },
                        bgColor: { ...bgColor, value: { r: 241, g: 112, b: 19, a: 1, }, },
                        bgTransparent: { ...bgTransparent, value: false },
                        alignment: { ...alignment, index: 0 },
                        playDuration: { ...playDuration, value: 0 },
                        animation: { ...animation, index: 0 },
                        playSpeed: { ...playSpeed, value: 0 },
                        rowSpace: { ...rowSpace, value: 0 },
                        charSpace: { ...charSpace, value: 0 },
                        showFontColor: false,
                        showBgColor: false,
                        prompt: {
                            playDuration: false,
                            playSpeed: false,
                            rowSpace: false,
                            charSpace: false
                        }
                    })
                    break;
                }
            default:
            break;
        }
    }

    render() {
        const { name, text, fontType, fontColor, fontSize, bgColor, bgTransparent, alignment, playDuration,
            animation, playSpeed, rowSpace, charSpace, showFontColor, showBgColor, prompt } = this.state;
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
                    // display: 'inline-block',
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
                        <label className="control-label">{name.title}</label>
                        <div class='input-container input-w-1'>
                            <input type='text' class='form-control' disabled value={name.value} onChange={f => f} />
                        </div>
                    </div>
                </div>
                <div class='row hide'>
                    <div class='form-group'>
                        <label className="control-label" style={{verticalAlign:'top'}}>{text.title}</label>
                        <div class='input-container input-w-1'>
                            <textarea class='text-content' disabled value={text.value} onChange={e => this.onChange('text', e)} />
                        </div>
                    </div>
                </div>
                <div class='row'>
                    <div class='form-group '>
                        <label className="control-label">{fontType.title}</label>
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
                    </div>
                <div class='row'>
                    <div class='form-group '>
                        <label className="control-label">{fontSize.title}</label>
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
                    </div>
                <div class="row">
                    <div class='form-group font-color' style={{verticalAlign:'top',height:'40px'}}>
                        <label className="control-label" style={{verticalAlign:'top'}}>{fontColor.title}</label>
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
                    <div class='form-group bg-color' style={{verticalAlign:'top',height:'40px'}}>
                        <label className="control-label" style={{verticalAlign:'top'}}>{bgColor.title}</label>
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
                    <div class='form-group checkbox-container'>
                        <label className="control-label">{bgTransparent.title}</label>
                        <div class='input-container'>
                            <input type='checkbox' onClick={this.handleBgTransparent} checked={bgTransparent.value} />
                        </div>
                    </div>
                </div>
                <div class='row'>
                    <div class='form-group '>
                        <label className="control-label">{alignment.title}</label>
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
                    </div>
                <div class="row">
                    <div class="form-group">
                        <label className="control-label">{playDuration.title}</label>
                        <div class="input-container input-w-2">
                            <input type="text" class="form-control"
                                placeholder={playDuration.placeholder} maxLength="8"
                                value={playDuration.value}
                                onChange={e => this.onChange("playDuration", e)} />
                            <span class={prompt.playDuration ? "prompt " : "prompt hidden"}><FormattedMessage id='mediaPublish.check' /></span>
                        </div>
                    </div>
                </div>
                <div class='row'>
                    <div class="form-group">
                        <label className="control-label">{animation.title}</label>
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
                    </div>
                <div className="row">
                    <div class="form-group">
                        <label className="control-label">{playSpeed.title}</label>
                        <div class="input-container input-w-2">
                            <input type="text" class="form-control"
                                placeholder={playSpeed.placeholder} maxLength="8"
                                value={playSpeed.value}
                                onChange={e => this.onChange("playSpeed", e)} />
                            <span class={prompt.playSpeed ? "prompt " : "prompt hidden"}><FormattedMessage id='mediaPublish.check' /></span>
                        </div>
                    </div>
                </div>
                <div class='row'>
                    <div class="form-group ">
                        <label className="control-label">{rowSpace.title}</label>
                        <div class="input-container input-w-2">
                            <input type="text" class="form-control"
                                placeholder={rowSpace.placeholder} maxLength="8"
                                value={rowSpace.value}
                                onChange={e => this.onChange("rowSpace", e)} />
                            <span class={prompt.rowSpace ? "prompt " : "prompt hidden"}><FormattedMessage id='mediaPublish.check' /></span>
                        </div>
                    </div>
                    </div>
                <div class="row">
                    <div class="form-group">
                        <label className="control-label" title={charSpace.title}>{charSpace.title}</label>
                        <div class="input-container input-w-2">
                            <input type="text" class="form-control"
                                placeholder={charSpace.placeholder} maxLength="8"
                                value={charSpace.value}
                                onChange={e => this.onChange("charSpace", e)} />
                            <span class={prompt.charSpace ? "prompt " : "prompt hidden"}><FormattedMessage id='mediaPublish.check' /></span>
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

export default injectIntl(TextFile)