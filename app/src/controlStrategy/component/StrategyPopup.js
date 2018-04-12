import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Panel from '../../components/Panel';
import PanelFooter from '../../components/PanelFooter';
import {getMomentDate} from '../../util/time';
import {STRATEGY_NAME_LENGTH, Name2Valid} from '../../util/index';
import {getGroupList, addGroup} from '../../api/plan';
import { DatePicker} from 'antd';
import moment from 'moment';
import {getObjectByKeyObj} from '../../util/algorithm';

export default class TimeStrategyPopup extends Component {
  constructor(props) {
    super(props);
    const {data = {}} = this.props;
    let {name = '', level = 0, start = moment(), end = moment(), retryNumber = '', retryInterval = '', groupId = ''}
     = data;
    this.state = {
      name:name,
      level:level,
      start:getMomentDate(start, 'YYYY-MM-DDTHH:mm:ss.SSSZ'),
      end:getMomentDate(end, 'YYYY-MM-DDTHH:mm:ss.SSSZ'),
      retryNumber:retryNumber,
      retryInterval:retryInterval,
      groupId:groupId,
      groupList:[],
      search:'',
      prompt:{
        name:false,
        date:false,
      },
    };
    this.levelList = {
      titleField: 'title',
      valueField: 'value',
      options: [
        {value: 0, title: this.formatIntl('app.strategy.platform')},
        {value: 1, title: this.formatIntl('sysOperation.gateway')},
        {value: 2, title: this.formatIntl('app.device')},
      ],
    };
  }

  componentWillMount() {
    this.mounted = true;
        
    getGroupList(this.props.type, data => {
      this.setState({groupList:data});
    });

  }

    formatIntl=(formatId) => {
      const {intl} = this.props;
      return intl ? intl.formatMessage({id:formatId}) : null;
      // return formatId;
    }

    onChange=(event) => {
      let id = event.target.id;
      let value = event.target.value;
      let prompt = false;
      if (id == 'name') {
        prompt = !Name2Valid(value);
        this.setState({[id]:value, prompt:Object.assign({}, this.state.prompt, {[id]:prompt})});
        return;
      }
      this.setState({[id]:value});
    }

    dateChange=(id, value) => {
      this.setState({[id]: value}, () => {
        const {start, end} = this.state;  
        let prompt = (start && end) && end.isBefore(start);                  
        this.setState({prompt:Object.assign({}, this.state.prompt, {date:prompt})});
      });
    }

    onConfirm=() => {
      const {name, level, start, end, retryNumber, retryInterval, groupId} = this.state;
      let data = {
        name:name,
        level:level,
        start:start,
        end:end,
      };
      retryNumber && (data.retryNumber = retryNumber);
      retryInterval && (data.retryInterval = retryInterval);
      data.groupId = groupId?groupId:null;
      this.props.onConfirm && this.props.onConfirm(data);
    }

    onCancel=() => {
      this.props.onCancel && this.props.onCancel();
    }

    searchSubmit=(group) => {
      this.setState({search:group.name, groupId:group.id});
    }
    
    addGroup=() => {
      const {search} = this.state;
      addGroup({name:search, type:this.props.type}, () => {
        getGroupList(this.props.type, data => {
          this.setState({groupList:data, search:''});
        });
      });
    }

    render() {
      const {name, level, start, end, retryNumber, retryInterval, prompt, groupList, groupId, search} = this.state;
      let {titleField, valueField, options} = this.levelList;
      let valid = !name || prompt.name || !options.length || prompt.date || !start || !end;

      let footer = <PanelFooter funcNames={['onCancel', 'onConfirm']} btnTitles={['button.cancel', 'button.save']}
        btnClassName={['btn-default', 'btn-primary']}
        btnDisabled={[false, valid]} onCancel={this.onCancel} onConfirm={this.onConfirm}/>;
      return <div className="time-strategy-popup">
        <Panel title={this.props.title} closeBtn={true} closeClick={this.onCancel} footer={footer}>
          <div className="form-group">
            <label className="control-label" htmlFor="name" title={this.formatIntl('app.strategy.name')}>
              {this.formatIntl('app.strategy.name')}:</label>
            <div className="input-container">
              <input type="text" className="form-control" id="name" placeholder={this.formatIntl(
                'app.input.strategy.name')} maxLength={STRATEGY_NAME_LENGTH} value={name} onChange={this.onChange}/>
              <span className={prompt.name ? 'prompt ' : 'prompt hidden'}>{this.formatIntl('mediaPublish.prompt')}
              </span>
            </div>
          </div>
          <div className="form-group">
            <label className="control-label" htmlFor="level" title={this.formatIntl('app.strategy.level')}>
              {this.formatIntl('app.strategy.level')}:</label>
            <div className="input-container">
              <select className="form-control" id="level" value={level ? level[valueField] : ''}
                onChange={this.onChange}>
                {
                  options.map(item => <option key={item.title} value={item[valueField]}>{item[titleField]}</option>)
                }
              </select>
              <span className={prompt.level ? 'prompt ' : 'prompt hidden'}>
                {this.formatIntl('sysOperation.select.device')}</span>                            
            </div>

          </div>
          <div className="form-group">
            <label className="control-label" htmlFor="startDate">{this.formatIntl('mediaPublish.startDate')}</label>
            <div className="input-container">
              <DatePicker id="startDate" format="YYYY/MM/DD" placeholder="点击选择开始日期" style={{ width: '240px' }}
                defaultValue={start} value={start} onChange={value => this.dateChange('start', value)} />
              <div className={prompt.date ? 'prompt' : 'prompt hidden'}>{this.formatIntl('app.date.error')}</div>
            </div>
          </div>
          <div className="form-group pull-right ">
            <label className="control-label" htmlFor="endDate">{this.formatIntl('mediaPublish.endDate')}</label>
            <div className="input-container input-w-2">
              <DatePicker id="endDate" format="YYYY/MM/DD" placeholder="点击选择结束日期" style={{ width: '240px' }}
                defaultValue={end} value={end} onChange={value => this.dateChange('end', value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="control-label" htmlFor="retryNumber" title={this.formatIntl('app.strategy.retryNumber')}>
              {this.formatIntl('app.strategy.retryNumber')}:</label>
            <div className="input-container">
              <input type="text" className="form-control" id="retryNumber" placeholder={this.formatIntl("mediaPublish.number")} value={retryNumber}
                onChange={this.onChange}/>
            </div>
          </div>
          <div className="form-group">
            <label className="control-label" htmlFor="retryInterval" title={this.formatIntl(
              'app.strategy.retryInterval')}>{this.formatIntl('app.strategy.retryInterval')}:</label>
            <div className="input-container">
              <input type="text" className="form-control" id="retryInterval" placeholder={this.formatIntl("app.second")} value={retryInterval}
                onChange={this.onChange}/>
            </div>
          </div>
          <div className="form-group">
            <label className="control-label" htmlFor="search" title={this.formatIntl('app.strategy.select.group')}>
              {this.formatIntl('app.strategy.select.group')}:</label>
            <div className="search-list">
              <input type="text" id="search" className="form-control" placeholder={this.formatIntl("search.or.create.group")} value={search}
                onChange={this.onChange}/>
              <ul className="group-list">
                {
                  groupList.map((item, index) => {
                    return item.name.indexOf(search) > -1 ? <li role="presentation" 
                      className={item.id === groupId ? 'active' : ''} key={index} value={item.name}
                      onClick={() => this.searchSubmit(item)}>{item.name}</li> : '';
                  })
                }
                {
                  (search && !getObjectByKeyObj(groupList, 'name', search)) && <li role="presentation"
                    onClick={this.addGroup}><span className="glyphicon glyphicon-plus">
                    </span>{`${this.formatIntl('app.add.group')}“${search}”`}</li>                                
                }                           
              </ul>
            </div>
          </div>
        </Panel>
      </div>;
    }
}

TimeStrategyPopup.propTypes = {
  title: PropTypes.string.isRequired,
  // data: PropTypes.shape({
  //     name: PropTypes.string.isRequired,
  //     level: PropTypes.object.isRequired
  // }).isRequired,
  // levelList: PropTypes.shape({
  //     titleKey: PropTypes.string.isRequired,
  //     valueKey: PropTypes.string.isRequired,
  //     options: PropTypes.array.isRequired
  // }).isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};