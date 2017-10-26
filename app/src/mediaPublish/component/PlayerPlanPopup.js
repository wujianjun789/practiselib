/**
 * Created by a on 2017/10/26.
 */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Panel from './../../components/Panel';
import PanelFooter from './../../components/PanelFooter';

import NotifyPopup from '../../common/containers/NotifyPopup'

import {Name2Valid, numbersValid} from '../../util/index'
import Immutable from 'immutable';
export default class PlayerScenePopup extends PureComponent {
    constructor(props) {
        super(props);
        const { typeList, sceneName, width, height, axisX, axisY } = this.props.data;

        this.state = {
            typeList: Immutable.fromJS({list:[], index:1, name:'场景'}),
            parentList: Immutable.fromJS({list: [{id: 1, name: 'parent1'}, {id: 2, name: 'parent2'}], index: 0, name: 'parent1'}),
            sceneName: sceneName,
            width: width,
            height: height,
            axisX: axisX,
            axisY: axisY,

            prompt: {
                typeList: !Boolean(typeList.length),
                parentList: !Boolean(true),
                sceneName: !Boolean(sceneName),
                width: !Boolean(width),
                height: !Boolean(height),
                axisX: !Boolean(axisX),
                axisY: !Boolean(axisY),
            }
        }
        this.onConfirm = this.onConfirm.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentWillMount() {
        this.mounted = false;
        const {typeList} = this.props.data;
        this.setState({typeList:this.state.typeList.update('list', v=>Immutable.fromJS(typeList))});
    }

    componentWillUnmout() {
        this.mounted = true;
    }

    onConfirm() {
        this.props.onConfirm && this.props.onConfirm(this.state);
    }

    onCancel() {
        this.props.onCancel();
    }

    onChange(e) {
        const id = e.target.id;

        let prompt = false;
        let newValue = e.target.value;
        if(id == "sceneName"){
            if(!Name2Valid(newValue)){
                prompt = true;
            }
            this.setState({[id]: newValue, prompt: Object.assign({}, this.state.prompt, {[id]: prompt})});
        }else if(id=="typeList" || id == "parentList"){
            let curIndex = e.target.selectedIndex;
            this.state[id] = this.state[id].update("index", v=>curIndex);
            this.setState({[id]:this.state[id].update("name", v=>this.state[id].getIn(['list', curIndex, 'name']))});
        }else{
            if(!numbersValid(newValue)){
                prompt = true;
            }

            this.setState({[id]: newValue, prompt: Object.assign({}, this.state.prompt, {[id]: prompt})});
        }
    }

    render() {
        let {typeList, parentList, sceneName, width, height, axisX, axisY, prompt} = this.state;

        let valid = prompt.typeList || prompt.parentName || prompt.sceneName;
        let footer = <PanelFooter funcNames={['onCancel','onConfirm']} btnTitles={['取消','确认']}
                                  btnClassName={['btn-default', 'btn-primary']}
                                  btnDisabled={[false, valid]} onCancel={this.onCancel} onConfirm={this.onConfirm}/>;

        return <div className="playerPlan-popup">
            <Panel title={this.props.title} closeBtn={true} closeClick={this.onCancel}>
                <div className="row">
                    <div className="form-group row">
                        <label className="col-sm-2 control-label" htmlFor="playerName">类型：</label>
                        <div className="col-sm-10">
                            <select className="form-control" id="typeList"  value={typeList && typeList.get('name')?typeList.get('name'):"无"} onChange={this.onChange}>
                                {
                                    typeList && typeList.get('list').map(item => <option key={item.get('id')} value={item.get('name')}>{item.get('name')}</option>)
                                }
                            </select>
                            <span className={prompt.typeList?"prompt ":"prompt hidden"}>{"请选择类型"}</span>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 control-label" htmlFor="playerName">上级：</label>
                        <div className="col-sm-10">
                            <select className="form-control" id="parentList"  value={parentList && parentList.get('name')?parentList.get('name'):"无"} onChange={this.onChange}>
                                {
                                    parentList && parentList.get('list').map(item => <option key={item.get('id')} value={item.get('name')}>{item.get('name')}</option>)
                                }
                            </select>
                            <span className={prompt.parentList?"prompt ":"prompt hidden"}>{"请选择上级"}</span>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 control-label" htmlFor="screenName">名称：</label>
                        <div className="col-sm-10">
                            <input type="text" className={ "form-control " } id="sceneName" placeholder="输入名称" value={sceneName} onChange={this.onChange}/>
                            <span className={prompt.sceneName?"prompt ":"prompt hidden"}>{"名称不合法"}</span>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 control-label" htmlFor="width">宽度：</label>
                        <div className="col-sm-4">
                            <input type="text" className={ "form-control " } id="width" placeholder="输入宽度" value={width} onChange={this.onChange}/>
                            <span className={prompt.width?"prompt ":"prompt hidden"}>{"宽度不合法"}</span>
                        </div>
                        <label className="col-sm-2 control-label" htmlFor="height">高度：</label>
                        <div className="col-sm-4">
                            <input type="text" className={ "form-control " } id="height" placeholder="输入高度" value={height} onChange={this.onChange}/>
                            <span className={prompt.height?"prompt ":"prompt hidden"}>{"高度不合法"}</span>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 control-label" htmlFor="axisX">X轴：</label>
                        <div className="col-sm-4">
                            <input type="text" className={ "form-control " } id="axisX" placeholder="输入X轴" value={axisX} onChange={this.onChange}/>
                            <span className={prompt.axisX?"prompt ":"prompt hidden"}>{"X轴不合法"}</span>
                        </div>
                        <label className="col-sm-2 control-label" htmlFor="axisY">Y轴：</label>
                        <div className="col-sm-4">
                            <input type="text" className={ "form-control " } id="axisY" placeholder="输入Y轴" value={axisY} onChange={this.onChange}/>
                            <span className={prompt.axisY?"prompt ":"prompt hidden"}>{"Y轴不合法"}</span>
                        </div>
                    </div>
                    {footer}
                </div>
                <NotifyPopup />
            </Panel>
        </div>
    }
}

PlayerScenePopup.propTypes = {
    title: PropTypes.string.isRequired,
    data: PropTypes.shape({
        typeList: PropTypes.array.isRequired,
        sceneName: PropTypes.string.isRequired,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        axisX: PropTypes.number.isRequired,
        axisY: PropTypes.number.isRequired
    }).isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
}