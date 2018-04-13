import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Table from '../../components/Table';
import Page from '../../components/Page';
import SideBarInfo from '../../components/SideBarInfo';
import Select from '../../components/Select.1';
import ConfirmPopup from '../../components/ConfirmPopup';
import Immutable from 'immutable';
import { overlayerShow, overlayerHide } from '../../common/actions/overlayer';

import Content from '../../components/Content';
import { treeViewInit } from '../../common/actions/treeView';
import { injectIntl } from 'react-intl';
import { getChildDomainList } from '../../api/domain';
import { DatePicker } from 'antd';
import moment from 'moment';
import PieChart from '../../lightManage/utils/pieChart';
import { spliceInArray } from '../../util/algorithm';
import { getFaultOrAlertList } from '../../api/asset';

export class Fault extends Component {
  constructor(props) {
    super(props);
    this.state = {
      model: '',
      collapse: false,
      infoCollapse: false,
      page: Immutable.fromJS({
        pageSize: 15,
        current: 1,
        total: 0
      }),
      data: Immutable.fromJS([]),
      domainList: {
        titleField: 'name',
        valueField: 'name',
        index: 0,
        value: '',
        options: []
      },
      levelList: {
        titleField: 'title',
        valueField: 'name',
        index: 0,
        value: 'deadly',
        options: [
          {
            title: '致命',
            name: 'deadly'
          },
          {
            title: '严重',
            name: 'seriousness'
          },
          {
            title: '一般',
            name: 'ordinary'
          },
          {
            title: '提示',
            name: 'energy'
          }
        ]
      },
      start: moment(),
      end: moment(),
      statisticalInfo: {
        deadly: 50,
        serious: 30,
        general: 10,
        hint: 10
      }
    };

    this.columns = [
      {
        id: 0,
        field: 'model',
        title: this.props.intl.formatMessage({
          id: 'sysOperation.alarm.device.model'
        })
      },
      {
        id: 1,
        field: 'name',
        title: this.props.intl.formatMessage({ id: 'app.device.name' })
      },
      {
        id: 3,
        field: 'param',
        title: this.props.intl.formatMessage({ id: 'sysOperation.alarm.param' })
      },
      {
        id: 3,
        field: 'level',
        title: this.props.intl.formatMessage({ id: 'sysOperation.alarm.level' })
      },
      {
        id: 4,
        field: 'threshold',
        title: this.props.intl.formatMessage({
          id: 'sysOperation.alarm.threshold'
        })
      },
      {
        id: 5,
        field: 'value',
        title: this.props.intl.formatMessage({
          id: 'sysOperation.alarm.test.value'
        })
      },
      {
        id: 6,
        field: 'time',
        title: this.props.intl.formatMessage({ id: 'sysOperation.fault.time' })
      }
    ];
  }

  componentWillMount() {
    this.mounted = true;
    this.setState({ model: this.props.params.fault }, this.requestSearch);
    getChildDomainList(data => {
      this.mounted && this.initDomainList(data);
    });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidUpdate() {
    const { sidebarNode } = this.props;
    if (
      sidebarNode &&
      !sidebarNode.children &&
      sidebarNode.id != this.state.model
    ) {
      this.setState({ model: sidebarNode.id }, this.requestSearch);
    }
  }

  formatIntl = formatId => {
    const { intl } = this.props;
    return intl ? intl.formatMessage({ id: formatId }) : null;
  };

  initDomainList = data => {
    let domainList = Object.assign(
      {},
      this.state.domainList,
      { index: 0 },
      { value: data.length ? data[0].name : '' },
      { options: data }
    );
    this.setState({ domainList: domainList }, this.requestSearch);
  };

  requestSearch = () => {
    let model = '';
    switch (this.state.model) {
      case 'alarm':
        model = 'alerts';
        break;
      case 'fault':
        model = 'faults';
        break;
    }
    const { domainList, levelList, start, end, page } = this.state;
    const { pageSize, current } = page.toJS();
    if (domainList.options.length) {
      const domainId = domainList.options[domainList.index]['id'];
      // const level = levelList.options[levelList.index]['name'];
      const level = levelList.index;
      const offset = pageSize * (current - 1);
      const limit = pageSize;
      getFaultOrAlertList(
        model,
        domainId,
        level,
        start,
        end,
        offset,
        limit,
        res => {
          this.setState({ data: res });
        }
      );
    }
  };

  initPageSize = data => {
    let page = this.state.page.set('total', data.count);
    this.setState({
      page: page
    });
  };

  pageChange = (current, pageSize) => {
    let page = this.state.page.set('current', current);
    this.setState(
      {
        page: page
      },
      () => {
        this.requestSearch();
      }
    );
  };

  collapseHandler = id => {
    this.setState({
      [id]: !this.state[id]
    });
  };

  selectChange = (event, key) => {
    let index = event.target.selectedIndex;
    let list = this.state[key];
    list.index = index;
    list.value = list.options[index].name;
    this.setState({ [key]: list }, () => {
      this.requestSearch();
    });
  };

  dateChange = (id, value) => {
    this.setState({ [id]: value }, () => {
      const { start, end } = this.state;
      let prompt = start && end && end.isBefore(start);
      this.setState({
        prompt: Object.assign({}, this.state.prompt, { date: prompt })
      });
    });
  };

  drawChart = ref => {
    if (ref == null) {
      this.piechart.destroy();
    } else {
      const { statisticalInfo } = this.state;
      let data = [
        statisticalInfo.deadly,
        statisticalInfo.serious,
        statisticalInfo.general,
        statisticalInfo.hint
      ];
      this.piechart = new PieChart({
        wrapper: ref,
        data: data,
        color: ['#F83D59', '#FA919C', '#FA9E17', '#FBEF35']
      });
    }
  };

  render() {
    const {
      collapse,
      infoCollapse,
      page,
      data,
      domainList,
      typeList,
      levelList,
      start,
      end,
      statisticalInfo,
      allChecked,
      checked
    } = this.state;
    return (
      <Content className={'offset-right ' + (collapse ? 'collapsed' : '')}>
        <div className="heading">
          <Select
            id="domain"
            titleField={domainList.titleField}
            valueField={domainList.valueField}
            options={domainList.options}
            value={domainList.value}
            onChange={e => {
              this.selectChange(e, 'domainList');
            }}
          />
          {/* <Select id="type" titleField={typeList.titleField} valueField={typeList.valueField}
          options={typeList.options} value={typeList.value} onChange={(e) => {this.selectChange(e, 'typeList');}}/> */}
          <Select
            id="level"
            titleField={levelList.titleField}
            valueField={levelList.valueField}
            options={levelList.options}
            value={levelList.value}
            onChange={e => {
              this.selectChange(e, 'levelList');
            }}
          />
          <div className="datePicker">
            <DatePicker
              id="startDate"
              format="YYYY/MM/DD"
              placeholder="开始日期"
              style={{ width: '106px' }}
              defaultValue={start}
              value={start}
              onChange={value => this.dateChange('start', value)}
            />
            <span>-</span>
            <DatePicker
              id="endDate"
              format="YYYY/MM/DD"
              placeholder="结束日期"
              style={{ width: '106px' }}
              defaultValue={end}
              value={end}
              onChange={value => this.dateChange('end', value)}
            />
          </div>
        </div>
        <div className="table-container">
          <Table columns={this.columns} data={data} />
          <Page
            className={'page ' + (page.get('total') == 0 ? 'hidden' : '')}
            pageSize={page.get('pageSize')}
            current={page.get('current')}
            total={page.get('total')}
            onChange={this.pageChange}
          />
        </div>
        <SideBarInfo
          collapseHandler={this.collapseHandler}
          className={infoCollapse ? 'infoCollapse ' : ''}
        >
          <div className="panel panel-default statistical-info">
            <div
              className="panel-heading"
              role="presentation"
              onClick={() => {
                !collapse && this.collapseHandler('infoCollapse');
              }}
            >
              <span className="icon_chart" />
              {this.props.intl.formatMessage({
                id: 'sysOperation.statistical.info'
              })}
              <span className="icon icon_collapse pull-right" />
            </div>
            <div className={'panel-body' + (infoCollapse ? 'collapsed' : '')}>
              <div className="left">
                <div id="alarm" className="circle" ref={this.drawChart} />
              </div>
              <div className="right">
                <div className="count deadly">
                  <div className="dot" />
                  {this.formatIntl('sysOperation.count.deadly')} :{' '}
                  {statisticalInfo.deadly
                    ? statisticalInfo.deadly
                    : this.formatIntl('sysOperation.noCount')}
                </div>
                <div className="count serious">
                  <div className="dot" />
                  {this.formatIntl('sysOperation.count.serious')} :{' '}
                  {statisticalInfo.serious
                    ? statisticalInfo.serious
                    : this.formatIntl('sysOperation.noCount')}
                </div>
                <div className="count general">
                  <div className="dot" />
                  {this.formatIntl('sysOperation.count.general')} :{' '}
                  {statisticalInfo.general
                    ? statisticalInfo.general
                    : this.formatIntl('sysOperation.noCount')}
                </div>
                <div className="count hint">
                  <div className="dot" />
                  {this.formatIntl('sysOperation.count.hint')} :{' '}
                  {statisticalInfo.hint
                    ? statisticalInfo.hint
                    : this.formatIntl('sysOperation.noCount')}
                </div>
              </div>
            </div>
          </div>
        </SideBarInfo>
      </Content>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    sidebarNode: state.systemOperation.get('sidebarNode')
  };
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      treeViewInit,
      overlayerShow,
      overlayerHide
    },
    dispatch
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Fault));
