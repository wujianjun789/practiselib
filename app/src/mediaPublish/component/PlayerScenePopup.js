/**
 * Created by a on 2017/10/26.
 */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Panel from './../../components/Panel';
import PanelFooter from './../../components/PanelFooter';

import NotifyPopup from '../../common/containers/NotifyPopup'

import {Name2Valid} from '../../util/index'
import Immutable from 'immutable';
export default class PlayerScenePopup extends PureComponent {
    constructor(props) {
        super(props);
        const { typeList, sceneName } = this.props.data;

        this.state = {
            typeList: Immutable.fromJS({list:[], index:1, name:'场景'}),
            parentList: Immutable.fromJS({list: [{id: 1, name: 'parent1'}, {id: 2, name: 'parent2'}], index: 0, name: 'parent1'}),
            sceneName: sceneName,

            prompt: {
                typeList: !Boolean(typeList.length),
                parentList: !Boolean(true),
                sceneName: !Boolean(sceneName)
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

        if(id == "sceneName"){
            let prompt = false;
            let newValue = e.target.value;
            if(!Name2Valid(newValue)){
                prompt = true;
            }
            this.setState({[id]: newValue, prompt: Object.assign({}, this.state.prompt, {[id]: prompt})});
        }else{

            let curIndex = e.target.selectedIndex;
            console.log("curIndex:", curIndex);
            this.state[id] = this.state[id].update("index", v=>curIndex);
            this.setState({[id]:this.state[id].update("name", v=>this.state[id].getIn(['list', curIndex, 'name']))},()=>{
                if(id == 'typeList'){
                    this.props.onChange && this.props.onChange(this.state);
                }
            });
        }


    }

    render() {
        let {typeList, parentList, sceneName, prompt} = this.state;

        let valid = false;
        if(typeList.get('index') == 1){
            valid = prompt.typeList || prompt.parentName || prompt.sceneName;
        }
console.log(valid);
        let footer = <PanelFooter funcNames={['onCancel','onConfirm']} btnTitles={['取消','确认']}
                                  btnClassName={['btn-default', 'btn-primary']}
                                  btnDisabled={[false, valid]} onCancel={this.onCancel} onConfirm={this.onConfirm}/>;

        return <div className="playerScene-popup">
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
                        <label className="col-sm-2 control-label" htmlFor="screen-size">名称：</label>
                        <div className="col-sm-10">
                            <input type="text" className={ "form-control " } id="sceneName" placeholder="输入名称" value={sceneName} onChange={this.onChange}/>
                            <span className={prompt.sceneName?"prompt ":"prompt hidden"}>{"名称不合法"}</span>
                        </div>
                    </div>
                    {footer}
                </div>
                <NotifyPopup />
            </Panel>
        </div>
    }
}

/*
PlayerScenePopup.propTypes = {
    title: PropTypes.string.isRequired,
    data: PropTypes.shape({
        typeList: PropTypes.array.isRequired,
        sceneName: PropTypes.string.isRequired
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
}*/
