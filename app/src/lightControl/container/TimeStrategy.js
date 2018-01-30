/**
 * Created by a on 2017/8/14.
 */
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import Content from '../../components/Content';
import SearchText from '../../components/SearchText';
import Table from '../../components/Table3';
import Page from '../../components/Page';
import {injectIntl} from 'react-intl';
import {overlayerShow, overlayerHide} from '../../common/actions/overlayer';
import ConfirmPopup from '../../components/ConfirmPopup';
import Immutable from 'immutable';
import {dateStringFormat} from '../../util/string';
import {getMomentDate, momentDateFormat} from '../../util/time';
import moment from 'moment';
import {getIndexByKey, getProByKey, getIndexsByKey, getListByKey2} from '../../util/algorithm';
import { getGroupListPlan, getNoGroupStrategy, getPlanStatus, startPlan, pausePlan} from '../../api/plan';
import {getAssetsBaseById} from '../../api/asset';
import { Promise } from 'es6-promise';
import TaskRecordPopup from '../component/TaskRecordPopup';

class TimeStrategy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      model:'time',
      search: Immutable.fromJS({
        placeholder: this.formatIntl('app.input.strategys.name'),
        value: '',
      }),
      page: Immutable.fromJS({
        pageSize: 10,
        current: 1,
        total: 0,
      }),
      selectStrategy:{},
      deviceList:{titleKey:'name', valueKey:'name', options:[/*{id:1, name:"test灯"},{id:2, name:"test显示屏"}*/]},
      strategyData:Immutable.fromJS([]),
      sidebarInfo: {
        collapsed: false,
        propertyCollapsed: false,
        parameterCollapsed: false,
        devicesCollapsed: false,
      },
      selectItem: {},
      selectedDevicesData:[],
      lightList:[{id:1, name:'0'}, {id:2, name:'10'}, {id:3, name:'20'}, {id:4, name:'30'}],
      taskData:[],
    };
    this.columns =  [
      {id: 0, field:'name', title:this.formatIntl('app.strategy.name')},
      {id: 1, field: 'timeRange', title: this.formatIntl('app.time.range')},
      {id: 2, field: 'status', title: this.formatIntl('app.strategy.state')},            
    ];

    this.deviceColumns = [
      {id: 0, field:'name', title:this.formatIntl('app.device.name')},
      {id: 1, field: 'extendType', title: this.formatIntl('app.type')},
    ];

    this.taskColumns = [
      {id: 0, field:'create', title:this.formatIntl('app.task.create.time')},
      {id: 1, field: 'time', title: this.formatIntl('app.task.execute.time')},
      {id: 2, field: 'result', title: this.formatIntl('app.task.execute.result')},  
    ];
  }

  componentWillMount() {
    this.mounted = true;
    this.requestSearch();
  }

  componentWillUnmount() {
    this.mounted = false;
  }


    formatIntl=(formatId) => {
      const {intl} = this.props;
      return intl ? intl.formatMessage({id:formatId}) : null;
    }

    requestSearch=() => {
      getGroupListPlan(0, data => {
        data.map(item => {
          item.plans = getListByKey2(item.plans, 'type', 0);
        });
        getNoGroupStrategy(0, res => {
          if (res.length) {
            res.map(item => {
              item.groupId = 0;
            });
            data.push({
              id:0,
              name:'未分组',
              plans:res,
            });
          }
          this.initTableData('strategyData', data);
        });
      });
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
    
    initTableData=(key, data) => {
      let result = [];
      const {search} = this.state;
      data.map(parent => {
        if (parent.name.indexOf(search.get('value')) > -1) {
          parent.collapsed = false;
          result.push(parent);
          if (parent.plans) {
            parent.plans.map(item => {
              item.hidden = parent.collapsed;
              item.timeRange = dateStringFormat(item.start) + '-' + dateStringFormat(item.end);
              result.push(item);
            });
          }
        } else {
          parent.plans.map(item => {
            if (item.name.indexOf(search.get('value')) > -1) {
              parent.collapsed = false;
              result.push(parent);

              item.hidden = parent.collapsed;
              item.timeRange = dateStringFormat(item.start) + '-' + dateStringFormat(item.end);
              result.push(item);
            }
          });
        }
      });

      if (result.length > 0) {
        let len1 = 0;
        let len2 = 0;
        result.map(item => {
          item.key = (item.plans ? 'group' : 'plan') + item.id;
          !item.plans && len1++;
        });
        const promise = new Promise((resolve, reject) => {
          result.map(item => {
            !item.plans && getPlanStatus(item.id, res => {
              len2++;
              item.status = res.status && res.status == 1 ? this.formatIntl('app.status.started')
                : this.formatIntl('app.status.paused');
              if (len2 == len1) {
                resolve(result);
              }
            });
          });
        });
    
        promise.then(result => {
          this.setState({[key]:Immutable.fromJS(result)});
          result.length > 0 && this.setState({selectItem:result[0]}, () => {
            this.getGroupTasks(this.state.selectItem.id);
          });
        });
      }
    }

    getGroupTasks=(id) => {
      let data = [
        {
          id:1,
          create:moment(),
          time:moment(),
          result:'成功',
        },
      ];
      this.mounted && this.initPageSize(data.length);
      this.mounted && this.initTaskData(data);
    }

    initPageSize=(data) => {
      let page = this.state.page.set('total', data);
      this.setState({
        page: page,
      });
    }

    pageChange=(current, pageSize) => {
      let page = this.state.page.set('current', current);
      this.setState({
        page: page,
      }, () => {
        // this.getGroupTasks(this.props.selectItem.id,()=>{});
      });
    }

    initTaskData=(data) => {
      let result = data.map(item => {
        item.create = item.create ? momentDateFormat(getMomentDate(item.create, 'YYYY-MM-DDTHH:mm:ss.SSSZ'),
          'YYYY-MM-DD HH:mm:ss') : '';
        item.time = item.time ? momentDateFormat(getMomentDate(item.time, 'YYYY-MM-DDTHH:mm:ss.SSSZ'),
          'YYYY-MM-DD HH:mm:ss') : '';
        return item;
      });
      this.setState({taskData:Immutable.fromJS(result)});
    }

    getDeviceData=(devices) => {
      let gatewayIds = [];
      let gateways = [];
      let selectedDevices = [];
      let selectedDevicesData = [];
        
      if (devices) {
        const promise = new Promise((resolve, reject) => {
          let len = 0;
          devices.map(id => {
            getAssetsBaseById(parseInt(id, 10), (res) => {
              len++;
              selectedDevices.push(res);
              //所有网关Id          
              !gatewayIds.includes(res.gatewayId) && gatewayIds.push(res.gatewayId);
              if (len == devices.length) {
                resolve(gatewayIds);
              }
                        
            });
          });
        });
            
        promise.then(gatewayIds => {
          return new Promise((resolve, reject) => {
            let len = 0;
            gatewayIds.map(id => {
              getAssetsBaseById(parseInt(id, 10), (res) => {
                len++;
                //所有网关
                gateways.push(res);
                if (len == gatewayIds.length) {
                  resolve(gateways);
                }
              });
            });
          });
                
        }).then(gateways => {
          return new Promise((resolve, reject) => {
            gateways.forEach(item => {
              //网关白名单中的选中设备
              selectedDevicesData.push(Object.assign({}, item, {whiteList:
                getListByKey2(selectedDevices, 'gatewayId', item.id)}));
            });
            this.initDeviceData('selectedDevicesData', selectedDevicesData);
          });
                
        });
      } else {
        this.setState({selectedDevicesData:Immutable.fromJS([])});
      }
    
    }
    
    initDeviceData=(key, data) => {
      let result = [];
      data.map(parent => {
        parent.collapsed = false;
        result.push(parent);
        if (parent.whiteList) {
          parent.whiteList.map(item => {
            item.hidden = parent.collapsed;
            result.push(item);
          });
        }
      });
      this.setState({[key]:Immutable.fromJS(result)});
    }

    tableClick=(row) => {
      this.updateSelectItem(row.toJS());
    }

    updateSelectItem=(item) => {
      let selectItem = item;
      if (!item.plans) {
        selectItem.start = item.start.split('T')[0];
        selectItem.end = item.end.split('T')[0];
        switch (selectItem.level) {
        case 0:
          selectItem.levelTitle = this.formatIntl('app.strategy.platform');
          break;
        case 1:
          selectItem.levelTitle = this.formatIntl('sysOperation.gateway');
          break;
        case 2:
          selectItem.levelTitle = this.formatIntl('app.device');
          break;
        default:
          selectItem.levelTitle = this.formatIntl('app.strategy.platform');
        }
      }
       
      this.setState({
        selectItem: selectItem,
      }, () => {
        !item.plans && this.getDeviceData(this.state.selectItem.devices);
        // item.plans && this.getGroupTasks(this.state.selectItem.id);            
        item.plans && this.getGroupTasks(this.state.selectItem.id);

      });
    }

    searchSubmit=() => {
      this.requestSearch();
    }

    searchChange=(value) => {
      this.setState({search:this.state.search.update('value', v => value)});
    }

    collapseHandler=(id) => {
      this.setState({ sidebarInfo: Object.assign({}, this.state.sidebarInfo, { [id]: !this.state.sidebarInfo[id] }) });
    }

    collapseClick=(id, key, data) => {
      let childs;
      if (key == 'strategy') {
        let parentId = getProByKey(data, 'key', id, 'id');
        childs = getIndexsByKey(data, 'groupId', parentId);
      } else {
        childs = getIndexsByKey(data, 'gatewayId', id);
      }
      childs.length !== 0 && childs.map(item => {
        data = data.setIn([item, 'hidden'], !data.getIn([item, 'hidden']));
      });
      this.setState({[`${key}Data`]:data.setIn([getIndexByKey(data, key == 'strategy' ? 'key' : 'id', id), 'collapsed'],
        !getProByKey(data, key == 'strategy' ? 'key' : 'id', id, 'collapsed'))});
    }

    taskRecordPopup=() => {
      const {actions} = this.props;
      actions.overlayerShow(<TaskRecordPopup className="task-record-popup" intl={this.props.intl}
        title={this.formatIntl('app.task.record')} id={this.state.selectItem.id} onCancel={() => {
          actions.overlayerHide();
        }}/>);
    }

    switchStrategy=(key) => {
      const {selectItem} = this.state;
      const {actions} = this.props;
      actions.overlayerShow(<ConfirmPopup tips={this.formatIntl(key == 'start' ? 'app.status.start'
        : 'app.status.pause') + this.formatIntl(selectItem.plans ? 'app.group' : 'app.strategy') + '?'} 
      iconClass={key == 'start' ? 'icon_popup_start' : 'icon_popup_pause'} cancel={() => {
        actions.overlayerHide();
      }} confirm={() => {
        if (selectItem.plans) {
          selectItem.plans.map(item => {
            key == 'start' ? startPlan(item.id, () => {
              this.requestSearch();
              actions.overlayerHide();
            }) : pausePlan(item.id, () => {
              this.requestSearch();
              actions.overlayerHide();
            });
          });
        } else {
          key == 'start' ? startPlan(selectItem.id, () => {
            this.requestSearch();
            actions.overlayerHide();
          }) : pausePlan(selectItem.id, () => {
            this.requestSearch();
            actions.overlayerHide();
          });            
        }
      }}/>);
    }

    render() {
      const {search, selectedDevicesData, page, strategyData, sidebarInfo, selectItem, taskData} = this.state;
      return <Content className={`control-time-strategy ${sidebarInfo.collapsed ? 'collapse' : ''}`}>
        <div className="heading">
          <SearchText placeholder={search.get('placeholder')} value={search.get('value')}
            onChange={this.searchChange} submit={this.searchSubmit}/>
        </div>
        <div className="table-container">
          <Table className="strategy" keyField="key" collapsed columns={this.columns} data={strategyData}
            activeId={selectItem && selectItem.key}
            rowClick={this.tableClick} collapseClick={this.collapseClick}/>
        </div>
        <div className={`container-fluid sidebar-info ${sidebarInfo.collapsed ? 'sidebar-collapse' : ''}`}>
          <div className="row collapse-container" role="presentation" onClick={() => this.collapseHandler('collapsed')}>
            <span className={sidebarInfo.collapsed ? 'icon_horizontal'  : 'icon_vertical'}></span>
          </div>
          <div className="switch-container">
            <span className="domain-name" title={selectItem.name}>{selectItem.name}</span>
            <button className="btn btn-primary pull-right" disabled={selectItem.status == this.formatIntl(
              'app.status.started')} onClick={() => this.switchStrategy('start')}>{this.formatIntl('button.start')}
            </button>
            <button className="btn btn-danger pull-right" disabled={selectItem.status == this.formatIntl(
              'app.status.paused')} onClick={() => this.switchStrategy('pause')}>{this.formatIntl('button.pause')}
            </button>
          </div>
          {
            !selectItem.id || selectItem.plans ?
              <div className="panel panel-default group-tast-record">
                <div className="panel-heading" role="presentation" 
                  onClick={() => { !sidebarInfo.collapsed && this.collapseHandler('propertyCollapsed'); }}>
                  <span className="icon_select"></span>{this.formatIntl('app.task.record')}
                  <span className="icon icon_collapse pull-right"></span>
                </div>
                <div className={'panel-body ' + (sidebarInfo.propertyCollapsed ? 'collapsed' : '')}>
                  <Table className="task-records" columns={this.taskColumns} data={taskData} />
                  <Page className={ 'page ' + (page.get('total') == 0 ? 'hidden' : '') } 
                    pageSize={ page.get('pageSize') } current={ page.get('current') } 
                    total={ page.get('total') } onChange={ this.pageChange }/>
                </div>
              </div>
              :
              <div className="panel-strategy">
                <div className="panel panel-default">
                  <div className="panel-heading" role="presentation" 
                    onClick={() => { !sidebarInfo.collapsed && this.collapseHandler('propertyCollapsed');}}>
                    <span className="icon_select"></span>{this.formatIntl('app.select.strategy')}
                    <span className="icon icon_collapse pull-right"></span>
                  </div>
                  <div className={'panel-body ' + (sidebarInfo.propertyCollapsed ? 'collapsed' : '')}>
                    <div className="form-group">
                      <label>{this.formatIntl('app.strategy.name')}</label>
                      <div className="input-container">
                        <input type="text" className="form-control" value={selectItem.name} disabled="disabled"/>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>{this.formatIntl('app.strategy.level')}</label>
                      <div className="input-container">
                        <input type="text" className="form-control" value={selectItem.levelTitle} disabled="disabled"/>
                      </div>
                    </div>

                    <div className="form-group date-range">
                      <label>{this.formatIntl('app.date.range')}</label>
                      <div className="input-container">
                        <input type="text" className="form-control" value={selectItem.start} disabled="disabled"/>
                        <span>{this.formatIntl('mediaPublish.to')}</span>
                        <input type="text" className="form-control" value={selectItem.end} disabled="disabled"/>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>{this.formatIntl('app.strategy.retryNumber')}</label>
                      <div className="input-container">
                        <input type="text" className="form-control" value={selectItem.retryNumber} disabled="disabled"/>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>{this.formatIntl('app.strategy.retryInterval')}</label>
                      <div className="input-container">
                        <input type="text" className="form-control" value={selectItem.retryInterval}
                          disabled="disabled"/>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="panel panel-default strategy-info">
                  <div className="panel-heading" role="presentation"
                    onClick={() => { !sidebarInfo.collapsed && this.collapseHandler('parameterCollapsed'); }}>
                    <span className="icon_control"></span>{this.formatIntl('app.strategy.property')}
                    <span className="icon icon_collapse pull-right"></span>
                  </div>
                  <div className={'panel-body ' + (sidebarInfo.parameterCollapsed ? 'collapsed' : '')}>
                    <div className="form-group">
                      <label>{this.formatIntl('app.date')}</label>
                      <div className="input-container">
                        <input type="text" className="form-control"
                          value={selectItem.excuteTime ? selectItem.excuteTime : ''} disabled="disabled"/>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>{this.formatIntl('app.brightness')}</label>
                      <div className="input-container">
                        <input type="text" className="form-control" 
                          value={selectItem.execution ? selectItem.execution.light : ''} disabled="disabled" />
                      </div>
                    </div>
                    <button className="btn btn-primary pull-right" 
                      onClick={this.taskRecordPopup}>{this.formatIntl('app.task.record')}</button>
                  </div>
                </div>
                <div className="panel panel-default device-info">
                  <div className="panel-heading" role="presentation" 
                    onClick={() => { !sidebarInfo.collapsed && this.collapseHandler('devicesCollapsed'); }}>
                    <span className="icon_device_list"></span>{this.formatIntl('app.strategy.devices')}
                    <span className="icon icon_collapse pull-right"></span>                    
                  </div>
                  <div className={'panel-body ' + (sidebarInfo.devicesCollapsed ? 'collapsed' : '')}>
                    <div className="header">
                      <span>{`${this.formatIntl('sysOperation.include')}：${selectItem.devices ? 
                        selectItem.devices.length : 0}${this.formatIntl('sysOperation.devices')}`}</span>
                    </div>
                    <Table className="selectedDevices" collapsed columns={this.deviceColumns} data={selectedDevicesData}
                      collapseClick={this.collapseClick}/>
                  </div>
                </div>
              </div>
          }
                
                
        </div>
      </Content>;
    }
}

function mapStateToProps(state) {
  return {

  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      overlayerShow: overlayerShow,
      overlayerHide: overlayerHide,
    }, dispatch),
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(TimeStrategy));