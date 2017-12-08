/**
 * Created by a on 2017/11/16.
 */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Panel from './../../components/Panel';
import PanelFooter from './../../components/PanelFooter';

import {DatePicker, Checkbox, TimePicker} from 'antd';
const CheckboxGroup = Checkbox.Group;
import NotifyPopup from '../../common/containers/NotifyPopup'

export default class TimingPlanPopup extends PureComponent {
    constructor(props) {
        super(props);
        const {startTime,startDate, endDate} = this.props.data;

        this.state = {
            startTime: startTime,
            startDate: startDate,
            endDate: endDate,
            week: {
                list: [
                    {label: '周一', value: 1},
                    {label: '周二', value: 2},
                    {label: '周三', value: 3},
                    {label: '周四', value: 4},
                    {label: '周五', value: 5},
                    {label: '周六', value: 6},
                    {label: '周日', value: 7},
                ], value: [1,5]
            },

            prompt: {
                startTime: !Boolean(startTime),
                startDate: !Boolean(startDate),
                endDate: !Boolean(endDate),
                week: true
            }
        }
        this.onConfirm = this.onConfirm.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.dateChange = this.dateChange.bind(this);
    }

    componentWillMount() {
        this.mounted = false;
        const {week} = this.props.data;
        let weekData = [];
        week.map((item, index)=> {
            item == 1 && weekData.push(parseInt(index + 1));
        })

        this.setState({
            week: Object.assign({}, this.state.week, {value: weekData}),
            prompt: Object.assign({}, this.state.prompt, {week:!weekData.length})
        });
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

    dateChange(id, value) {
        if (id == "week") {
            this.setState({[id]: Object.assign({}, this.state.week, {value: value}),
                prompt: Object.assign({}, this.state.prompt, {week:!value.length})});
        } else {
            this.setState({[id]: value});
        }
    }

    render() {
        let {startTime, startDate, endDate, week, prompt} = this.state;

        let valid = false;
            valid = prompt.startTime || prompt.startDate || prompt.endDate || prompt.week;
        let footer = <PanelFooter funcNames={['onCancel','onConfirm']} btnTitles={['取消','确认']}
                                  btnClassName={['btn-default', 'btn-primary']}
                                  btnDisabled={[false, valid]} onCancel={this.onCancel} onConfirm={this.onConfirm}/>;

        return <div className="timingPlan-popup">
            <Panel title={this.props.title} closeBtn={true} closeClick={this.onCancel}>
                <div className="form-group row startTime">
                    <label className="col-sm-2 control-label" htmlFor="startTime">开始时间</label>
                    <div className="input-container">
                        <TimePicker size="large" placeholder="点击选择开始时间"  style={{ width: "100px" }} onChange={value => this.dateChange("startTime", value)}
                                    defaultValue={startTime} value={startTime} />
                        <span className={prompt.startTime?"prompt ":"prompt hidden"}>{"请输入日期"}</span>
                    </div>
                </div>
                <div className="form-group row startEndDate">
                    <label className="col-sm-2 control-label" htmlFor="startDate">开始日期</label>
                    <div className="input-container">
                        <DatePicker id="startDate" showTime format="YYYY/MM/DD" placeholder="点击选择开始日期" style={{ width: "100px" }}
                                    defaultValue={startDate} onChange={value=>this.dateChange('startDate', value)}/>
                        <span className={prompt.startDate?"prompt ":"prompt hidden"}>{"请输入日期"}</span>
                    </div>
                    <label className="col-sm-2 control-label endDate" htmlFor="endDate">结束日期</label>
                    <div className="input-container">
                        <DatePicker id="endDate" showTime format="YYYY/MM/DD" placeholder="点击选择结束日期" style={{ width: "100px" }}
                                    defaultValue={endDate} onChange={value=>this.dateChange('endDate', value)}/>
                        <span className={prompt.endDate?"prompt ":"prompt hidden"}>{"请输入日期"}</span>
                    </div>
                </div>

                <div className="form-group row week">
                    <label className="col-sm-2 control-label" htmlFor="axisX">工作日：</label>
                    <div className="input-container">
                        <CheckboxGroup id="startTime" options={week.list} defaultValue={week.value}
                                       onChange={value=>this.dateChange('week', value)}/>
                        <span className={prompt.week?"prompt ":"prompt hidden"}>{"请选择工作日"}</span>
                    </div>
                </div>
                {footer}
                <NotifyPopup />
            </Panel>
        </div>
    }
}

TimingPlanPopup.propTypes = {
    title: PropTypes.string.isRequired,
    data: PropTypes.shape({
        startTime: PropTypes.object.isRequired,
        startDate: PropTypes.object.isRequired,
        endDate: PropTypes.object.isRequired,
    }).isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
}
