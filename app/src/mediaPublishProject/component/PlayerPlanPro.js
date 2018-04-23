/**
 * Created by a on 2017/11/20.
 */
import React, { PureComponent } from 'react';

import { DatePicker, Checkbox, TimePicker} from 'antd';
import  zhCN from 'antd/lib/locale-provider/zh_CN';

const CheckboxGroup = Checkbox.Group;

import moment from 'moment';

import {getProgramById} from '../../api/mediaPublish';
import { NameValid } from '../../util/index';
import {weekTranformArray, arrayTranformWeek} from '../util/index';
import {getNextSeconds} from '../../util/time';

import { FormattedMessage, injectIntl } from 'react-intl';
import {dateAddZero} from '../../util/string';

class PlayerPlanPro extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      //计划
      id: '',
      property:{
        plan: { key: 'plan', title: this.formatIntl('name'), placeholder: this.formatIntl('mediaPublish.inputPlanName'), defaultValue:'', value: '' },
        startDate: { key: 'startDate', title: this.formatIntl('app.date'), placeholder: '', defaultValue: moment(), value: moment() },
        endDate: { key: 'endDate', title: this.formatIntl('mediaPublish.to'), placeholder: '', defaultValue: moment(), value: moment() },
        startTime: { key: 'startTime', title: this.formatIntl('app.time'), placeholder: '', defaultValue: moment(), value: moment() },
        endTime: { key: 'endTime', title: this.formatIntl('mediaPublish.to'), placeholder: '', defaultValue: getNextSeconds(), value: getNextSeconds() },
        week: {
          key: 'week', title:this.formatIntl('mediaPublish.weekday'),
          list: [{ label: this.formatIntl('mediaPublish.monday'), value: 1 }, { label:this.formatIntl('mediaPublish.tuesday'), value: 2 },
            { label:this.formatIntl('mediaPublish.wednesday'), value: 3 }, { label: this.formatIntl('mediaPublish.thursday'), value: 4 },
            { label: this.formatIntl('mediaPublish.friday'), value: 5 }, { label:this.formatIntl('mediaPublish.saturday'), value: 6 },
            { label: this.formatIntl('mediaPublish.sunday'), value: 7 }],
          defaultValue: [],
          value: [],
        },
      },
      prompt:{
        //计划
        plan:false, week:false, startDate:false, startTime:false
        /*action: false, axisX: true, axisY: true, speed: true, repeat: true, resTime: true, flicker: true,*/
      },
    };

    this.formatIntl = this.formatIntl.bind(this);

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

  formatIntl(formatId) {
    const { intl } = this.props;
    return intl ? intl.formatMessage({ id: formatId }) : '';
    // return formatId;
  }

  init() {
    const {projectId, data} = this.props;
    if (!data || !data.id || data.id == this.state.id) {
      return false;
    }

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
    this.state.property.startDate.defaultValue = this.state.property.startDate.value = moment(dateBegin.year + '-' + dateAddZero(dateBegin.month) + '-' + dateAddZero(dateBegin.day));
    this.state.property.endDate.defaultValue = this.state.property.endDate.value = moment(dateEnd.year + '-' + dateAddZero(dateEnd.month) + '-' + dateAddZero(dateEnd.day));
    this.state.property.startTime.defaultValue = this.state.property.startTime.value = moment(dateAddZero(timeBegin.hour) + ':' + dateAddZero(timeBegin.minute) + ':' + dateAddZero(timeBegin.second), "HH:mm:ss");
    this.state.property.endTime.defaultValue = this.state.property.endTime.value = moment(dateAddZero(timeEnd.hour) + ':' + dateAddZero(timeEnd.minute) + ':' + dateAddZero(timeEnd.second), "HH:mm:ss");
    this.state.property.week.defaultValue = this.state.property.week.value = week;

    this.setState({id:data.id, property: Object.assign({}, this.state.property),
      prompt: {plan:!data.name, week: !(week && week.length)}});
  }

    applyHandler = () => {
      const {property, prompt} = this.state;
      let planId = this.props.data.id;

      let data = {
        name: property.plan.value,
        startDate: property.startDate.value,
        endDate: property.endDate.value,
        startTime: property.startTime.value,
        endTime: property.endTime.value,
        week: arrayTranformWeek(property.week.value),
      };

      if(prompt.plan || prompt.week || prompt.startDate || prompt.startTime){
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
        const {startDate, endDate, startTime, endTime} = this.state.property;
        let promptId =  'startTime';
        let promptValue = false;
        if(id == 'startTime' || id == 'endTime'){
          promptId = 'startTime';
          if(!value || id == 'endTime' && !startTime.value || id == 'startTime' && !endTime.value){
            promptValue = true;
          }else{
            const valueSecond = value.hour()*3600+value.minute()*60+value.second();
            const endTimeSecond = endTime.value && endTime.value.hour()*3600+endTime.value.minute()*60+endTime.value.second();
            const startTimeSecond = startTime.value && startTime.value.hour()*3600+startTime.value.minute()*60+startTime.value.second();
            promptValue = !(id == 'startTime'?(valueSecond)<(endTimeSecond) :(startTimeSecond)<(valueSecond));
          }

        }else{
          promptId = 'startDate';
          if(!value || id == 'endDate' && !startDate.value || id == 'startDate' && !endDate.value){
            promptValue = true;
          }else{
            promptValue = !(id == 'startDate'?value.isBefore(endDate.value) || value.isSame(endDate.value):startDate.value.isBefore(value) || startDate.value.isSame(value));
          }
        }
        this.setState({ property: Object.assign({}, this.state.property, { [id]: Object.assign({}, this.state.property[id], { value: value }) }),
          prompt:Object.assign({}, this.state.prompt, {[promptId]:promptValue})});
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
      const Invalid = prompt.plan || prompt.week || prompt.startDate || prompt.startTime;

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
              <DatePicker id="startDate" format="YYYY/MM/DD" placeholder="" style={{ width: '85px' }} local={zhCN}
                defaultValue={property.startDate.value} value={property.startDate.value} onChange={value => this.dateChange('startDate', value)} />
              <div className={prompt.startDate ? 'prompt ' : 'prompt hidden'}><FormattedMessage id="mediaPublish.check"/></div>
            </div>
          </div>
          <div className="form-group pull-right endDate">
            <label className="control-label"
              htmlFor={property.endDate.key}>{/*property.endDate.title*/}-</label>
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
              <TimePicker  placeholder={property.startTime.placeholder}  style={{ width: '85px' }}
                onChange={value => this.dateChange('startTime', value)} defaultValue={property.startTime.value} value={property.startTime.value} />
              <div className={prompt.startTime ? 'prompt ' : 'prompt hidden'}><FormattedMessage id="mediaPublish.check"/></div>
            </div>
          </div>
          <div className="form-group pull-right endTime">
            <label className="control-label"
              htmlFor={property.endTime.key}>{/*property.endTime.title*/}-</label>
            <div className="input-container input-w-2">
              <TimePicker  placeholder={property.endTime.placeholder} style={{ width: '85px' }}
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
          <button className={"btn btn-primary pull-right "+(Invalid?"disabled":"")} onClick={() => this.planClick('apply')}><FormattedMessage id="mediaPublish.apply"/></button>
          <button className="btn btn-gray margin-right-1 pull-right" onClick={() => this.planClick('reset')}><FormattedMessage id="mediaPublish.reset"/></button>
        </div>
      </div>;
    }
}

export default injectIntl(PlayerPlanPro);