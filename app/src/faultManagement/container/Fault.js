import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import Table from '../../components/Table';
import Page from '../../components/Page';
import SideBarInfo from '../../components/SideBarInfo';
import Select from '../../components/Select.1';
import ConfirmPopup from '../../components/ConfirmPopup';
import Immutable from 'immutable';
import {overlayerShow, overlayerHide} from '../../common/actions/overlayer';

import Content from '../../components/Content';
import {treeViewInit} from '../../common/actions/treeView';
import {injectIntl} from 'react-intl';
import {getChildDomainList} from '../../api/domain';
import { DatePicker} from 'antd';
import moment from 'moment';
import PieChart from '../../lightManage/utils/pieChart';
import {spliceInArray} from '../../util/algorithm';

export class Fault extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: false,
      infoCollapse:false,
      allChecked:false,
      checked:[],
      page: Immutable.fromJS({
        pageSize: 10,
        current: 1,
        total: 0,
      }),
      data: Immutable.fromJS([]
      ),
      domainList: {
        titleField: 'name',
        valueField: 'name',
        index: 0,
        value: '',
        options: [],
      },
      typeList: {
        titleField: 'name',
        valueField: 'name',
        index: 0,
        value: '通用',
        options: [
          {
            name:'通用',
          },
          {
            name:'传感器',
          },
          {
            name:'能量',
          },
          {
            name:'照明',
          },
          {
            name:'显示',
          },
          {
            name:'资源',
          },
          
        ],
      },
      levelList: {
        titleField: 'name',
        valueField: 'name',
        index: 0,
        value: '致命',
        options: [
          {
            name:'致命',
          },
          {
            name:'严重',
          },
          {
            name:'一般',
          },
          {
            name:'提示',
          },
        ],
      },
      start:moment(),
      end:moment(),
      statisticalInfo:{
        deadly:50,
        serious:30,
        general:10,
        hint:10,
      },
    };

    
    this.columns = [
        {
            id: 1,
            field: 'id',
            title: this.props.intl.formatMessage({id:'sysOperation.fault.id'}),
          },
        {
          id: 1,
          field: 'model',
          title: this.props.intl.formatMessage({id:'sysOperation.alarm.device.model'}),
        },
        {
          id: 2,
          field: 'name',
          title: this.props.intl.formatMessage({id:'app.device.name'}),
        },
        {
          id: 3,
          field: 'level',
          title: this.props.intl.formatMessage({id:'sysOperation.fault.level'}),
        },
        {
          id: 4,
          field: 'time',
          title: this.props.intl.formatMessage({id:'sysOperation.fault.time'}),
        },
        {
          id: 5,
          field: 'status',
          title: this.props.intl.formatMessage({id:'sysOperation.fault.status'}),
        },
        {
          id: 6,
          field: 'person',
          title: this.props.intl.formatMessage({id:'sysOperation.alarm.person'}),
        },
        {
          id: 7,
          field: 'handleTime',
          title: this.props.intl.formatMessage({id:'sysOperation.alarm.handle.time'}),
        },
      ];
  }

  componentWillMount() {
    this.mounted = true;
    getChildDomainList(data => {
      this.mounted && this.initDomainList(data);
    });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidMount() {}

  formatIntl=(formatId) => {
    const {intl} = this.props;
    return intl ? intl.formatMessage({id:formatId}) : null;
  }

  initDomainList=(data) => {
    let domainList = Object.assign({}, this.state.domainList, {index: 0},
      {value: data.length ? data[0].name : ''}, {options: data});
    this.setState({domainList: domainList});
    this.requestSearch();
  }

  requestSearch=() => {

  }
  
  initPageSize=(data) => {
    let page = this.state.page.set('total', data.count);
    this.setState({
      page: page,
    });
  }

  pageChange=(current, pageSize) => {
    let page = this.state.page.set('current', current);
    this.setState({
      page: page,
    }, () => {
      this.requestSearch();
    });
  }

  collapseHandler=(id) => {
    this.setState({
      [id]: !this.state[id],
    });
  }

  selectChange=(event, key) => {
    let index = event.target.selectedIndex;
    let list = this.state[key];
    list.index = index;
    list.value = list.options[index].name;
    this.setState({[key]: list}, () => {
      this.requestSearch();
    });
  }

  dateChange=(id, value) => {
    this.setState({[id]: value}, () => {
      const {start, end} = this.state;  
      let prompt = (start && end) && end.isBefore(start);                  
      this.setState({prompt:Object.assign({}, this.state.prompt, {date:prompt})});
    });
  }

  drawChart=(ref) => {
    if (ref == null) {
      this.piechart.destroy();
    } else {
      const {statisticalInfo} = this.state;
      let data = [
        statisticalInfo.deadly,
        statisticalInfo.serious,
        statisticalInfo.general,
        statisticalInfo.hint,
      ];
      this.piechart = new PieChart({
        wrapper: ref,
        data: data,
        color:['#F83D59', '#FA919C', '#FA9E17', '#FBEF35'],
      });
    }
  }

  allCheckChange=(value) => {
    const {data} = this.state;
    let checked = [];
    value && data.map(item => {
      checked.push(item.get('id'));
    });
    this.setState({allChecked:value, checked:checked});
  }

  rowCheckChange=(id, value) => {
    let {data, checked} = this.state;
    value ? checked.push(id) : spliceInArray(checked, id);
    let allChecked = data.size == checked.length;
    this.setState({allChecked:allChecked, checked:checked});        
  }

  handlePopup=(key) => {
    const {actions} = this.props;
    actions.overlayerShow(<ConfirmPopup iconClass="icon_fault" tips={`是否${this.props.intl.formatMessage({id:'button.' + key})}选中故障`}
      cancel={() => {actions.overlayerHide();}} confirm={() => {
        actions.overlayerHide();
      }}/>);
  }

  render() {
    const {collapse, infoCollapse, page, data, domainList, typeList, levelList, start, end, statisticalInfo, allChecked, checked}
     = this.state;
    return <Content className={'offset-right ' + (collapse ? 'collapsed' : '')}>
      <div className="heading">
        <Select id="domain" titleField={domainList.valueField} valueField={domainList.valueField} 
          options={domainList.options} value={domainList.value}
          onChange={(e) => {this.selectChange(e, 'domainList');}}/>
        <Select id="type" titleField={typeList.valueField} valueField={typeList.valueField}
          options={typeList.options} value={typeList.value} onChange={(e) => {this.selectChange(e, 'typeList');}}/>
        <Select id="level" titleField={levelList.valueField} valueField={levelList.valueField}
          options={levelList.options} value={levelList.value} onChange={(e) => {this.selectChange(e, 'levelList');}}/>
        <div className="datePicker">
          <DatePicker id="startDate" format="YYYY/MM/DD" placeholder="点击选择开始日期" style={{ width: '106px' }}
            defaultValue={start} value={start} onChange={value => this.dateChange('start', value)} />
          <span>-</span>
          <DatePicker id="endDate" format="YYYY/MM/DD" placeholder="点击选择结束日期" style={{ width: '106px' }}
            defaultValue={end} value={end} onChange={value => this.dateChange('end', value)} />
        </div>
        <div className="button-group">
          <button className="btn btn-primary" onClick={() => {this.handlePopup('acceptable');}}>{this.props.intl.formatMessage({id:'button.acceptable'})}</button>
          <button className="btn btn-primary" onClick={() => {this.handlePopup('hangUp');}}>{this.props.intl.formatMessage({id:'button.hangUp'})}</button>
          <button className="btn btn-primary" onClick={() => {this.handlePopup('solve');}}>{this.props.intl.formatMessage({id:'button.solve'})}</button>
        </div>
      </div>
      <div className="table-container">
        <Table columns={this.columns} data={data} allChecked={allChecked} checked={checked}
          allCheckChange={this.allCheckChange} rowCheckChange={this.rowCheckChange}/>
        <Page className={'page ' + (page.get('total') == 0 ? 'hidden' : '')} pageSize={page.get('pageSize')}
          current={page.get('current')} total={page.get('total')}  onChange={this.pageChange}/>
      </div>
      <SideBarInfo collapseHandler={this.collapseHandler} 
        className={(infoCollapse ? 'infoCollapse ' : '')}>
        <div className="panel panel-default statistical-info">
          <div className="panel-heading" role="presentation"
            onClick={() => { !collapse && this.collapseHandler('infoCollapse'); }}>
            <span className="icon_select"></span>
            {this.props.intl.formatMessage({id:'sysOperation.fault.statistical.info'})}
            <span className="icon icon_collapse pull-right"></span>      
          </div>
          <div className={'panel-body' + (infoCollapse ? 'collapsed' : '')}>
            <div className="left">
              <div id="fault" className="circle" ref={this.drawChart}></div>
            </div>
            <div className="right">
              <div className="count deadly">
                <div className="dot"></div>
                {this.formatIntl('sysOperation.count.deadly')} :  { statisticalInfo.deadly ?
                  statisticalInfo.deadly : this.formatIntl('sysOperation.noCount')}
              </div>
              <div className="count serious">
                <div className="dot"></div>
                {this.formatIntl('sysOperation.count.serious')} :  {statisticalInfo.serious ?
                  statisticalInfo.serious : this.formatIntl('sysOperation.noCount')}
              </div>
              <div className="count general">
                <div className="dot"></div>
                {this.formatIntl('sysOperation.count.general') } :  { statisticalInfo.general ?
                  statisticalInfo.general : this.formatIntl('sysOperation.noCount')}
              </div>
              <div className="count hint">
                <div className="dot"></div>
                {this.formatIntl('sysOperation.count.hint') } :  {statisticalInfo.hint ?
                  statisticalInfo.hint : this.formatIntl('sysOperation.noCount')}
              </div>
            </div>
          </div>
        </div>
      </SideBarInfo>
    </Content>;
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
  };
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    treeViewInit,
    overlayerShow,
    overlayerHide,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Fault));