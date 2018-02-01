import React, { Component } from 'react'
import ColorPicker from '../../components/ColorPicker'
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
            // value: {
            //     'red': 10,
            //     'green': 100,
            //     'blue': 278,
            //     'amber': 0,
            //     'alpha': 0
            // }
            value: '#456'
        },
        fontSize: { title: this.props.intl.formatMessage({ id: 'mediaPublish.fontSize' }), list: [{ id: 0, name: '12pt' }, { id: 1, name: '13pt' }, { id: 2, name: '14pt' }, { id: 3, name: '15pt' }, { id: 4, name: '16pt' },], index: 0 },
        bgColor: {
            title: this.props.intl.formatMessage({ id: 'mediaPublish.bgColor' }),
            // value: {
            //     'red': 10,
            //     'green': 100,
            //     'blue': 278,
            //     'amber': 0,
            //     'alpha': 0
            // }
            value: '#678'
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
    }

    componentDidMount() {
        this._isMounted = true;
        this.initPlayerText();
    }
    initPlayerText = () => {
        const { projectId, sceneId, planId, areaId, data } = this.props;
        getItembyId(projectId, planId, sceneId, areaId, data.id, 0, res => {
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
                    ...this.state.fontColor,
                    // value: {
                    //     'red': 10,
                    //     'green': 100,
                    //     'blue': 278,
                    //     'amber': 0,
                    //     'alpha': 0
                    // }
                    value: '#456'
                },
                fontSize: { ...this.state.fontSize, index: 0 },
                bgColor: {
                    ...this.state.bgColor,
                    // value: {
                    //     'red': 10,
                    //     'green': 100,
                    //     'blue': 278,
                    //     'amber': 0,
                    //     'alpha': 0
                    // }
                    value: '#678'
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
    onChange = (type, e) => {
        switch (type) {
            case 'fontColor':
            case 'bgColor': {
                this.setState({
                    [type]: { ...this.state[type], value: e }
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
    handleBgTransparent = (e) => {
        // e.stopPropagation();
        this.setState({
            bgTransparent: { ...this.state.bgTransparent, value: e.target.checked }
        })
    }
    handleBtnClick = (type) => {
        switch (type) {
            case 'apply':
                console.log('点击应用');
                break;
            case 'reset':
                const { name, text, fontType, fontColor, fontSize, bgColor, bgTransparent,
                    alignment, playDuration, animation, playSpeed, rowSpace, charSpace, } = this.state;
                this.setState({
                    name: { ...name, value: '' },
                    text: { ...text, value: '' },
                    fontType: { ...fontType, index: 0 },
                    fontColor: {
                        ...fontColor,
                        // value: {
                        //     'red': 10,
                        //     'green': 100,
                        //     'blue': 278,
                        //     'amber': 0,
                        //     'alpha': 0
                        // }
                        value: '#456'
                    },
                    fontSize: { ...fontSize, index: 0 },
                    bgColor: {
                        ...bgColor,
                        // value: {
                        //     'red': 10,
                        //     'green': 100,
                        //     'blue': 278,
                        //     'amber': 0,
                        //     'alpha': 0
                        // }
                        value: '#678'
                    },
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
            alignment, playDuration, animation, playSpeed, rowSpace, charSpace, } = this.state;
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
                            <ColorPicker onChange={value => this.onChange('fontColor', value)} value={fontColor.value} />
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
                            <ColorPicker onChange={value => this.onChange('bgColor', value)} value={bgColor.value} />
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
                    <button class="btn btn-primary pull-right" onClick={() => { this.handleBtnClick('apply') }}><FormattedMessage id='mediaPublish.apply' /></button>
                    <button class="btn btn-gray pull-right margin-right-1" onClick={() => { this.handleBtnClick('reset') }}><FormattedMessage id='mediaPublish.reset' /></button>
                </div>
            </div>
        )
    }
}

export default injectIntl(PlayerText)