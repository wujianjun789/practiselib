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
import { FormattedMessage,injectIntl } from 'react-intl';

class TimingPlanPopup extends PureComponent {
    constructor(props) {
        super(props);
        const {startTime,startDate, endDate} = this.props.data;

        this.state = {
            startTime: startTime,
            startDate: startDate,
            endDate: endDate,
            appoint: false,
            week: {
                list: [
                    {label: this.props.intl.formatMessage({id:'mediaPublish.monday'}), value: 1},
                    {label: this.props.intl.formatMessage({id:'mediaPublish.tuesday'}), value: 2},
                    {label: this.props.intl.formatMessage({id:'mediaPublish.wednesday'}), value: 3},
                    {label: this.props.intl.formatMessage({id:'mediaPublish.thursday'}), value: 4},
                    {label: this.props.intl.formatMessage({id:'mediaPublish.friday'}), value: 5},
                    {label: this.props.intl.formatMessage({id:'mediaPublish.saturday'}), value: 6},
                    {label: this.props.intl.formatMessage({id:'mediaPublish.sunday'}), value: 7},
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
        this.onChange = this.onChange.bind(this);
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

    onChange(id, event){
        if(id == "appoint"){
            this.setState({[id]:!this.state[id]})
        }
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
        let {startTime, startDate, endDate, appoint, week, prompt} = this.state;

        let valid = false;
            valid = prompt.startTime || prompt.startDate || prompt.endDate || prompt.week;
        let footer = <PanelFooter funcNames={['onCancel','onConfirm']} btnTitles={[this.props.intl.formatMessage({id:'button.cancel'}),this.props.intl.formatMessage({id:'button.confirm'})]}
                                  btnClassName={['btn-default', 'btn-primary']}
                                  btnDisabled={[false, valid]} onCancel={this.onCancel} onConfirm={this.onConfirm}/>;

        return <div className="timingPlan-popup">
            <Panel title={this.props.title} closeBtn={true} closeClick={this.onCancel}>
                <div className="form-group row startTime">
                    <label className="col-sm-2 control-label" htmlFor="startTime"><FormattedMessage id='mediaPublish.startTime'/></label>
                    <div className="input-container">
                        <TimePicker size="large" placeholder="点击选择开始时间"  style={{ width: "100px" }} onChange={value => this.dateChange("startTime", value)}
                                    defaultValue={startTime} value={startTime} />
                        <span className={prompt.startTime?"prompt ":"prompt hidden"}>{"请输入日期"}</span>
                    </div>
                </div>
                <div className="form-group row startEndDate">
                    <label className="col-sm-2 control-label" htmlFor="startDate"><FormattedMessage id='mediaPublish.startDate'/></label>
                    <div className="input-container">
                        <DatePicker id="startDate" showTime format="YYYY/MM/DD" placeholder="点击选择开始日期" style={{ width: "100px" }}
                                    defaultValue={startDate} onChange={value=>this.dateChange('startDate', value)}/>
                        <span className={prompt.startDate?"prompt ":"prompt hidden"}>{"请输入日期"}</span>
                    </div>
                    <label className="col-sm-2 control-label endDate" htmlFor="endDate"><FormattedMessage id='mediaPublish.endDate'/></label>
                    <div className="input-container">
                        <DatePicker id="endDate" showTime format="YYYY/MM/DD" placeholder="点击选择结束日期" style={{ width: "100px" }}
                                    defaultValue={endDate} onChange={value=>this.dateChange('endDate', value)}/>
                        <span className={prompt.endDate?"prompt ":"prompt hidden"}>{"请输入日期"}</span>
                    </div>
                    <label className="control-label">指定日期</label>
                    <div className="input-container">
                        <Checkbox checked={appoint} onChange={event => this.onChange("appoint", event)} />
                    </div>
                </div>
                <div className="form-group row week">
                    <label className="col-sm-2 control-label" htmlFor="axisX"><FormattedMessage id='mediaPublish.weekday'/></label>
                    <div className="input-container">
                        <CheckboxGroup id="startTime" options={week.list} defaultValue={week.value}
                                       onChange={value=>this.dateChange('week', value)}/>
                        <span className={prompt.week?"prompt ":"prompt hidden"}><FormattedMessage id='mediaPublish.selectWeekday'/></span>
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

export default injectIntl(TimingPlanPopup)