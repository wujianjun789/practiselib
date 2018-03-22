/**
 * Created by a on 2017/11/20.
 */
import React, { PureComponent } from 'react';

import { DatePicker, Checkbox, TimePicker} from 'antd';

const CheckboxGroup = Checkbox.Group;

import moment from 'moment';

import {getProgramById} from '../../api/mediaPublish';
import { NameValid } from '../../util/index';
import {weekTranformArray, arrayTranformWeek} from '../util/index';
import {getNextSeconds} from '../../util/time';

import { FormattedMessage, injectIntl } from 'react-intl';

class PlayerPlanPro extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      //计划
      id: '',
      property:{
        plan: { key: 'plan', title: this.props.intl.formatMessage({id:'name'}), placeholder: this.props.intl.formatMessage({id:'mediaPublish.inputPlanName'}), defaultValue:'', value: '' },
        startDate: { key: 'startDate', title: this.props.intl.formatMessage({id:'app.date'}), placeholder: '', defaultValue: moment(), value: moment() },
        endDate: { key: 'endDate', title: this.props.intl.formatMessage({id:'mediaPublish.to'}), placeholder: '', defaultValue: moment(), value: moment() },
        startTime: { key: 'startTime', title: this.props.intl.formatMessage({id:'app.time'}), placeholder: '', defaultValue: moment(), value: moment() },
        endTime: { key: 'endTime', title: this.props.intl.formatMessage({id:'mediaPublish.to'}), placeholder: '', defaultValue: getNextSeconds(), value: getNextSeconds() },
        week: {
          key: 'week', title:this.props.intl.formatMessage({id:'mediaPublish.weekday'}),
          list: [{ label: this.props.intl.formatMessage({id:'mediaPublish.monday'}), value: 1 }, { label:this.props.intl.formatMessage({id:'mediaPublish.tuesday'}), value: 2 },
            { label:this.props.intl.formatMessage({id:'mediaPublish.wednesday'}), value: 3 }, { label: this.props.intl.formatMessage({id:'mediaPublish.thursday'}), value: 4 },
            { label: this.props.intl.formatMessage({id:'mediaPublish.friday'}), value: 5 }, { label:this.props.intl.formatMessage({id:'mediaPublish.saturday'}), value: 6 },
            { label: this.props.intl.formatMessage({id:'mediaPublish.sunday'}), value: 7 }],
          defaultValue: [],
          value: [],
        },
      },
      prompt:{
        //计划
        plan:false, week:false,
        /*action: false, axisX: true, axisY: true, speed: true, repeat: true, resTime: true, flicker: true,*/
      },
    };

    this.onChange = this.onChange.bind(this);
    this.dateChange = this.dateChange.bind(this);
    this.planClick = this.planClick.bind(this);
    this.initProperty = this.initProperty.bind(this);
  }

  componentWillMount() {
    this.mounted = true;
    this.init();
  }

  componentDidUpdate() {
    this.init();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  init() {
    const {projectId, data} = this.props;
    if (!data || !data.id || data.id == this.state.id) {
      return false;
    }
    console.log('playerPlanPro', projectId, data);
    if (projectId && (typeof data.id == 'number' || data.id.indexOf('plan&&') < 0)) {
      getProgramById(projectId, data.id, response => {this.mounted && this.initProperty(response);});
    } else if (typeof data.id == 'string' && data.id.indexOf('plan&&') > -1) {
      this.state.property.plan.defaultValue = this.state.property.plan.value = data.name;
      this.setState({id:data.id, property: Object.assign({}, this.state.property),
        prompt: {plan:!data.name}});
    }
  }

  initProperty(data) {
    const {dateBegin, dateEnd} = data.dateRange;
    const {timeBegin, timeEnd} = data.timeRange;

    const week = weekTranformArray(data.week);
    this.state.property.plan.defaultValue = this.state.property.plan.value = data.name;
    this.state.property.startDate.defaultValue = this.state.property.startDate.value = moment(dateBegin.year + '-' + dateBegin.month + '-' + dateBegin.day);
    this.state.property.endDate.defaultValue = this.state.property.endDate.value = moment(dateEnd.year + '-' + dateEnd.month + '-' + dateEnd.day);
    this.state.property.startTime.defaultValue = this.state.property.startTime.value = moment(dateBegin.year + '-' + dateBegin.month + '-' + dateBegin.day + ' ' + timeBegin.hour + ':' + timeBegin.minute + ':' + timeBegin.second + ':' + timeBegin.milliseconds);
    this.state.property.endTime.defaultValue = this.state.property.endTime.value = moment(dateEnd.year + '-' + dateEnd.month + '-' + dateEnd.day + ' ' + timeEnd.hour + ':' + timeEnd.minute + ':' + timeEnd.second + ':' + timeEnd.milliseconds);
    this.state.property.week.defaultValue = this.state.property.week.value = week;

    this.setState({id:data.id, property: Object.assign({}, this.state.property),
      prompt: {plan:!data.name, week: !(week && week.length)}});
  }

    applyHandler = () => {
      const {property} = this.state;
      let planId = this.props.data.id;

      let data = {
        name: property.plan.value,
        startDate: property.startDate.value,
        endDate: property.endDate.value,
        startTime: property.startTime.value,
        endTime: property.endTime.value,
        week: arrayTranformWeek(property.week.value),
      };

      const endDateYear = property.endDate.value.format('YYYY');
      const endDateMonth = property.endDate.value.format('MM');
      const endDateDay = property.endDate.value.format('DD');
      const startDateYear = property.startDate.value.format('YYYY');
      const startDateMonth = property.startDate.value.format('MM');
      const startDateDay = property.startDate.value.format('DD');
      const startTimeHour = property.startTime.value.format('HH');
      const startTimeMinute = property.startTime.value.format('mm');
      const startTimeSecond = property.startTime.value.format('ss');
      const endTimeHour = property.endTime.value.format('HH');
      const endTimeMinute = property.endTime.value.format('mm');
      const endTimeSecond = property.endTime.value.format('ss');
      if ( endDateYear < startDateYear
            || endDateMonth < startDateMonth
            || endDateDay < startDateDay
        || endTimeHour < startTimeHour
        || endTimeMinute < startTimeMinute
        || endTimeSecond <= startTimeSecond) {
        this.props.actions.addNotify(0, '请输入正确日期');
        return false;
      }

      if (planId && (typeof planId == 'number' || planId.indexOf('plan&&') < 0)) {
        data = Object.assign({}, data, {id:planId});
      }

      this.props.applyClick && this.props.applyClick(data);
    }

    resetHandler = () => {
      for (let key in this.state.property) {
        this.state.property[key].value = this.state.property[key].defaultValue;
      }

      for (let key in this.state.prompt) {
        if (key == 'week') {
          const defaultValue = this.state.property[key].defaultValue;
          this.state.prompt[key] = !(defaultValue && defaultValue.length);
        } else {
          const defaultValue2 = this.state.property[key].defaultValue;
          this.state.prompt[key] = !defaultValue2;
        }
      }
      this.setState({property:Object.assign({}, this.state.property), prompt:Object.assign({}, this.state.prompt)});
    }

    planClick(id) {
      console.log(id);
      switch (id) {
      case 'apply':
        this.applyHandler();
        break;
      case 'reset':
        this.resetHandler();
        break;
      default:
        break;
      }
    }

    dateChange(id, value) {
      if (id == 'week') {
        console.log(value);
        this.setState({ property: Object.assign({}, this.state.property, { [id]: Object.assign({}, this.state.property[id], { value: value }) }),
          prompt:Object.assign({}, this.state.prompt, {[id]:!value.length})});
      } else {
        this.setState({ property: Object.assign({}, this.state.property, { [id]: Object.assign({}, this.state.property[id], { value: value }) }) });
      }
    }


    onChange(id, value) {
      console.log('id:', id);
      let prompt = false;

      const val = value.target.value;
      if (id == 'plan') {
        if (!NameValid(val)) {
          prompt = true;
        }
      }

      this.setState({
        property: Object.assign({}, this.state.property, { [id]: Object.assign({}, this.state.property[id], { value: val }) }),
        prompt: Object.assign({}, this.state.prompt, { [id]: prompt }),
      });

    }

    render() {
      const {property, prompt} = this.state;
      return <div className={'pro-container playerPlan '}>
        <div className="row">
          <div className="form-group plan">
            <label className="control-label"
              htmlFor={property.plan.key}>{property.plan.title}</label>
            <div className="input-container input-w-1">
              <input type="text" className={'form-control '}
                placeholder={property.plan.placeholder} maxLength="16"
                value={property.plan.value}
                onChange={event => this.onChange('plan', event)} />
              <span className={prompt.plan ? 'prompt ' : 'prompt hidden'}><FormattedMessage id="mediaPublish.check"/></span>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="form-group startDate">
            <label className="control-label"
              htmlFor={property.startDate.key}>{property.startDate.title}</label>
            <div className="input-container input-w-2">
              <DatePicker id="startDate" format="YYYY/MM/DD" placeholder="" style={{ width: '85px' }}
                defaultValue={property.startDate.value} value={property.startDate.value} onChange={value => this.dateChange('startDate', value)} />
              <div className={prompt.startDate ? 'prompt ' : 'prompt hidden'}>{'请选择开始日期'}</div>
            </div>
          </div>
          <div className="form-group pull-right endDate">
            <label className="control-label"
              htmlFor={property.endDate.key}>{property.endDate.title}</label>
            <div className="input-container input-w-2">
              <DatePicker id="endDate" format="YYYY/MM/DD" placeholder="" style={{ width: '85px' }}
                defaultValue={property.endDate.value} value={property.endDate.value} onChange={value => this.dateChange('endDate', value)} />
              <div className={prompt.endDate ? 'prompt ' : 'prompt hidden'}>{'请选择结束日期'}</div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="form-group startTime">
            <label className="control-label"
              htmlFor={property.startTime.key}>{property.startTime.title}</label>
            <div className="input-container input-w-2">
              <TimePicker size="large" placeholder={property.startTime.placeholder}  style={{ width: '85px' }}
                onChange={value => this.dateChange('startTime', value)} defaultValue={property.startTime.value} value={property.startTime.value} />
              <div className={prompt.startTime ? 'prompt ' : 'prompt hidden'}>{'请选择开始时间'}</div>
            </div>
          </div>
          <div className="form-group pull-right endTime">
            <label className="control-label"
              htmlFor={property.endTime.key}>{property.endTime.title}</label>
            <div className="input-container input-w-2">
              <TimePicker  size="large" placeholder={property.endTime.placeholder} style={{ width: '85px' }}
                onChange={value => this.dateChange('endTime', value)} defaultValue={property.endTime.value}value={property.endTime.value} />
              <div className={prompt.endTime ? 'prompt ' : 'prompt hidden'}>{'请选择结束时间'}</div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="form-group week">
            <label className="control-label"
              htmlFor={property.week.key}>{property.week.title}</label>
            <div className="input-container input-w-1 input-container-week">
              <CheckboxGroup id="startTime" options={property.week.list} defaultValue={property.week.value}
                value={property.week.value} onChange={value => this.dateChange('week', value)} />
              <span className={'fixpos ' + (prompt.week ? 'prompt ' : 'prompt hidden')}><FormattedMessage id="mediaPublish.selectWeekday"/></span>
              {/* {
                         property.week.list.map(item=>{
                         return <label>
                         <input type="checkbox" className="checkbox-inline" key={item.value}
                         checked = {item.value}
                         />{item.label}</label>
                         })
                         } */}
              {/* <span className={prompt.week?"prompt ":"prompt hidden"}>{"请输入正确参数"}</span> */}
            </div>
          </div>
        </div>
        <div className="row line">
        </div>
        <div className="row">
          <button className="btn btn-primary pull-right" onClick={() => this.planClick('apply')}><FormattedMessage id="mediaPublish.apply"/></button>
          <button className="btn btn-gray margin-right-1 pull-right" onClick={() => this.planClick('reset')}><FormattedMessage id="mediaPublish.reset"/></button>
        </div>
      </div>;
    }
}

export default injectIntl(PlayerPlanPro);