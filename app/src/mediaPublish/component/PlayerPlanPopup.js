/**
 * Created by a on 2017/10/26.
 */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Panel from './../../components/Panel';
import PanelFooter from './../../components/PanelFooter';

import 'antd/lib/date-picker/style';
import 'antd/lib/checkbox/style';
import {DatePicker, Checkbox} from 'antd';
const CheckboxGroup = Checkbox.Group;
import NotifyPopup from '../../common/containers/NotifyPopup'

import {Name2Valid, numbersValid} from '../../util/index'
import Immutable from 'immutable';
export default class PlayerPlanPopup extends PureComponent {
    constructor(props) {
        super(props);
        const { typeList, sceneName, startDate, endDate, startTime, endTime } = this.props.data;

        this.state = {
            typeList: Immutable.fromJS({list:[], index:0, name:'场景'}),
            parentList: Immutable.fromJS({list: [{id: 1, name: 'parent1'}, {id: 2, name: 'parent2'}], index: 0, name: 'parent1'}),
            sceneName: sceneName,
            startDate: startDate,
            endDate: endDate,
            startTime: startTime,
            endTime: endTime,
            week: {list:[
                {label:'周一', value:1},
                {label:'周二', value:2},
                {label:'周三', value:3},
                {label:'周四', value:4},
                {label:'周五', value:5},
                {label:'周六', value:6},
                {label:'周日', value:7},
            ], value:[]},

            prompt: {
                typeList: !Boolean(typeList.length),
                parentList: !Boolean(true),
                sceneName: !Boolean(sceneName),
                startDate: !Boolean(startDate),
                endDate: !Boolean(endDate),
                startTime: !Boolean(startTime),
                endTime: !Boolean(endTime),
                week: false
            }
        }
        this.onConfirm = this.onConfirm.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onChange = this.onChange.bind(this);
        this.dateChange = this.dateChange.bind(this);
    }

    componentWillMount() {
        this.mounted = false;
        const {typeList, week} = this.props.data;
        let weekData = [];
        week.map((item,index)=>{
            item==1 && weekData.push(parseInt(index+1));
        })
        this.setState({typeList:this.state.typeList.update('list', v=>Immutable.fromJS(typeList)), week:Object.assign({}, this.state.week, {value:weekData})});
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

    dateChange(id, value){
        if(id == "week"){
            console.log(value);
            this.setState({[id]:Object.assign({}, this.state.week, {value:value})});
        }else{
            this.setState({[id]:value});
        }
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
        }
    }

    render() {
        let {typeList, parentList, sceneName, startDate, endDate, startTime, endTime, week, prompt} = this.state;

        let valid = false;
        if(typeList.get('index') == 0){
            valid = prompt.typeList || prompt.parentName || prompt.sceneName;
        }
        let footer = <PanelFooter funcNames={['onCancel','onConfirm']} btnTitles={['取消','确认']}
                                  btnClassName={['btn-default', 'btn-primary']}
                                  btnDisabled={[false, valid]} onCancel={this.onCancel} onConfirm={this.onConfirm}/>;

        return <div className="playerArea-popup">
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
                        <label className="col-sm-2 control-label" htmlFor="startDate">开始日期：</label>
                        <div className="col-sm-4">
                            <DatePicker id="startDate" showTime format="YYYY-MM-DD" placeholder="点击选择开始日期" defaultValue={startDate} onChange={value=>this.dateChange('startDate', value)}/>
                            <span className={prompt.startDate?"prompt ":"prompt hidden"}>{"请输入日期"}</span>
                        </div>
                        <label className="col-sm-2 control-label endDate" htmlFor="endDate">结束日期：</label>
                        <div className="col-sm-4">
                            <DatePicker id="endDate" showTime format="YYYY-MM-DD" placeholder="点击选择结束日期" defaultValue={endDate} onChange={value=>this.dateChange('endDate', value)}/>
                            <span className={prompt.endDate?"prompt ":"prompt hidden"}>{"请输入日期"}</span>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 control-label" htmlFor="startTime">开始时间：</label>
                        <div className="col-sm-4">
                            <DatePicker id="startTime" showTime format="HH:mm:ss" placeholder="点击选择开始时间" defaultValue={startTime} onChange={value=>this.dateChange('startTime', value)}/>
                            <span className={prompt.startTime?"prompt ":"prompt hidden"}>{"请输入日期"}</span>
                        </div>
                        <label className="col-sm-2 control-label endTime" htmlFor="endTime">结束时间：</label>
                        <div className="col-sm-4">
                            <DatePicker id="endTime"  showTime format="HH:mm:ss" placeholder="点击选择结束时间"  defaultValue={endTime} onChange={value=>this.dateChange('endTime', value)}/>
                            <span className={prompt.endTime?"prompt ":"prompt hidden"}>{"请输入日期"}</span>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 control-label" htmlFor="axisX">工作日：</label>
                        <div className="col-sm-10">
                            <CheckboxGroup id="startTime" options={week.list} defaultValue={week.value} onChange={value=>this.dateChange('week', value)}/>
                            <span className={prompt.week?"prompt ":"prompt hidden"}>{"请输入日期"}</span>
                        </div>
                    </div>
                    {footer}
                </div>
                <NotifyPopup />
            </Panel>
        </div>
    }
}

PlayerPlanPopup.propTypes = {
    title: PropTypes.string.isRequired,
    data: PropTypes.shape({
        typeList: PropTypes.array.isRequired,
        sceneName: PropTypes.string.isRequired,
        startDate: PropTypes.object.isRequired,
        endDate: PropTypes.object.isRequired,
        startTime: PropTypes.object.isRequired,
        endTime: PropTypes.object.isRequired
    }).isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
}