import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Content from '../../components/Content';
import SearchText from '../../components/SearchText';
import Table from '../../components/Table3';
import {injectIntl} from 'react-intl';
import {overlayerShow, overlayerHide} from '../../common/actions/overlayer';
import StrategyPopup from '../component/StrategyPopup';
import ConfirmPopup from '../../components/ConfirmPopup';
import TimeGroupPopup from '../component/TimeGroupPopup';
import AddGatewayPopup from '../component/AddGatewayPopup';

import Immutable from 'immutable';
import {getObjectByKeyObj, getIndexByKey, getProByKey, getIndexsByKey, spliceInArray, 
  getObjectByKey, getListKeyByKey, IsExitInArray3, getListByKey2} from '../../util/algorithm';
import {getGroupListPlan, getNoGroupStrategy, delStrategy, delGroup, 
  addStrategy, updateStrategy, updateGroup} from '../../api/plan';
import {getAssetsBaseById} from '../../api/asset';
import {getWhiteListById} from '../../api/domain';
import { Promise } from 'es6-promise';

class LatlngStrategy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      model:'time',
      search: Immutable.fromJS({
        placeholder: this.formatIntl('app.input.strategy.name'),
        value: '',
      }),
      selectStrategy:{},
      deviceList:{titleKey:'name', valueKey:'name', options:[/*{id:1, name:"test灯"},{id:2, name:"test显示屏"}*/]},
      strategyData:Immutable.fromJS([]),
      sidebarInfo: {
        collapsed: false,
        propertyCollapsed: false,
        parameterCollapsed: false,
        devicesCollapsed: false,
        devicesExpanded:false,
      },
      selectItem: {},
      selectedDevicesData:[],
      allDevicesData:[],
      lightList:[{id:1, name:'0'}, {id:2, name:'10'}, {id:3, name:'20'}, {id:4, name:'30'}, {id:5, name:'40'}, {id:6, name:'50'}, {id:7, name:'60'}, {id:8, name:'70'}, {id:9, name:'80'}, {id:10, name:'90'}, {id:11, name:'100'}],
      sunList:[{id:1, name:this.formatIntl('app.sunrise')}, {id:1, name:this.formatIntl('app.sunset')}],
      allDevices:{
        allChecked:false,
        checked:[],
      },
    };
    this.columns =  [
      {id: 0, field:'name', title:this.formatIntl('app.strategy.name')},
      {id: 1, field: 'timeRange', title: this.formatIntl('app.time.range')},
    ];

    this.deviceColumns = [
      {id: 0, field:'name', title:this.formatIntl('app.device.name')},
      {id: 1, field: 'extendType', title: this.formatIntl('app.type')},
    ];
  }

  componentWillMount() {
    this.mounted = true;
    this.requestSearch();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

    setHeight = () => {
      document.getElementsByClassName('select-devices')[0].style.height = 
      document.getElementsByClassName('content')[0].scrollHeight + 'px';         
    }

    formatIntl=(formatId) => {
      const {intl} = this.props;
      return intl ? intl.formatMessage({id:formatId}) : null;
    }

    requestSearch=() => {
      getGroupListPlan(1, data => {
        data.map(item => {
          item.plans = getListByKey2(item.plans, 'type', 1);
        });
        getNoGroupStrategy(1, res => {
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
              item.timeRange = item.start.split('T')[0] +' '+ this.formatIntl('mediaPublish.to') +' '+ item.end.split('T')[0];
              result.push(item);
            });
          }
        } else {
          parent.plans.map(item => {
            if (item.name.indexOf(search.get('value')) > -1) {
              parent.collapsed = false;
              result.push(parent);

              item.hidden = parent.collapsed;
              item.timeRange = item.start.split('T')[0] +' '+ this.formatIntl('mediaPublish.to') +' '+ item.end.split('T')[0];
              result.push(item);
            }
          });
        }
      });
      result.length > 0 && result.map(item => {
        item.key = (item.plans ? 'group' : 'plan') + item.id;
      });

      this.setState({[key]:Immutable.fromJS(result)});

      result.length > 0 && this.setState({selectItem:result[0]}, () => {
        !this.state.selectItem.plans && this.getDeviceData(this.state.selectItem.devices);
      });
    }

    getDeviceData=(devices) => {
      let gatewayIds = [];
      let gateways = [];
      let allDevicesData = [];
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
              !gatewayIds.includes(res.ssgwId) && gatewayIds.push(res.ssgwId);
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
            let len = 0;                    
            gateways.forEach(item => {
              //网关白名单中的选中设备
              selectedDevicesData.push(Object.assign({}, item, {
                whiteList:getListByKey2(selectedDevices, 'ssgwId', item.id)}));
              getWhiteListById(item.id, (res) => {
                len++;
                allDevicesData.push(Object.assign({}, item, {whiteList:res}));
                if (len == gateways.length) {
                  resolve({selectedDevicesData, allDevicesData});
                }
              });
            });
          });
                
        }).then(({selectedDevicesData, allDevicesData}) => {
          this.initChecked(devices, selectedDevicesData, allDevicesData);
          this.initDeviceData('selectedDevicesData', selectedDevicesData);
          this.initDeviceData('allDevicesData', allDevicesData);
        });
      } else {
        this.setState({selectedDevicesData:Immutable.fromJS([]), allDevicesData:Immutable.fromJS([])});
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

    initChecked=(devices, data1, data2) => {
      let gateways = [];
      data1.map(item => {
        if (item.whiteList.length == getObjectByKeyObj(data2, 'id', item.id).whiteList.length) {
          gateways.push(item.id);
        }
      });

      this.setState({
        allDevices:{
          allChecked:gateways.length == data1.length,
          checked:devices.concat(gateways),
        },
      });
    }

    addHandler=() => {
      const {actions} = this.props;
      actions.overlayerShow(<StrategyPopup intl={this.props.intl} title={this.formatIntl('app.add.strategy')} type="1"
        onConfirm={(data) => {
          data.type = 1;
          addStrategy(data, () => {
            this.requestSearch();
            actions.overlayerHide();
          });
        }} onCancel={() => {
          actions.overlayerHide();
        }}/>);
    }

    tableEdit=(rowKey) => {
      const {actions} = this.props;

      let row = getObjectByKey(this.state.strategyData, 'key', rowKey);
      if (row.get('plans')) {
        actions.overlayerShow(<TimeGroupPopup className="time-group-popup" 
          intl={this.props.intl} title={this.formatIntl('app.edit.group')} name={row.get('name')}
          onConfirm={(data) => {
            updateGroup({id:row.get('id'), name:data}, () => {
              this.requestSearch();
              actions.overlayerHide();                        
            });
          }} onCancel={() => {
            actions.overlayerHide();
          }}/>);
        return;
      }
        
      actions.overlayerShow(<StrategyPopup isEdit intl={this.props.intl} title={this.formatIntl('app.edit.strategy')} data={row.toJS()} type="1"
        onConfirm={(data) => {
          data.id = row.get('id');
          data.type = 1;
          updateStrategy(data, () => {
            this.requestSearch();
            actions.overlayerHide();
          });
        }} onCancel={() => {
          actions.overlayerHide();
        }}/>);
    }

    tableDelete=(rowKey) => {
      const {actions} = this.props;
      const item = getObjectByKey(this.state.strategyData, 'key', rowKey);
      actions.overlayerShow(<ConfirmPopup tips={this.formatIntl(item.get('plans') ? 'delete.group'
        : 'delete.strategy')} iconClass="icon_popup_delete" cancel={() => {
        actions.overlayerHide();
      }} confirm={() => {
        item.get('plans') ?
          delGroup(item.get('id'), () => {
            this.requestSearch();
            actions.overlayerHide();
          }) :
          delStrategy(item.get('id'), () => {
            this.requestSearch();
            actions.overlayerHide();
          });
      }}/>);
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
          selectItem.levelTitle = this.formatIntl('app.strategy.platform');
          break;
        case 2:
          selectItem.levelTitle = this.formatIntl('app.strategy.platform');
          break;
        default:
          selectItem.levelTitle = this.formatIntl('app.strategy.platform');
        }
        switch (selectItem.excuteTime) {
        case 0:
          selectItem.excuteTime = this.formatIntl('app.sunrise');
          break;
        case 1:
          selectItem.excuteTime = this.formatIntl('app.sunset');
          break;
        default:
          selectItem.excuteTime = this.formatIntl('app.sunrise');
        }
      }
       
      this.setState({
        selectItem: selectItem,
      }, () => {
        !item.plans && this.getDeviceData(this.state.selectItem.devices);
      });
    }

    searchSubmit=() => {
      this.requestSearch();
    }

    searchChange=(value) => {
      this.setState({search:this.state.search.update('value', v => value)});
    }

    collapseHandler=(id) => {
      this.setState({ sidebarInfo: Object.assign({}, this.state.sidebarInfo,
        { [id]: !this.state.sidebarInfo[id] }) }, () => {
        if (id == 'devicesExpanded' && this.state.sidebarInfo[id]) {
          this.setHeight();
        }
      });
    }

    onChange=(id, value) => {
      if (id == 'light') {
        let {execution = {}} = this.state.selectItem;
        execution[id] = value;
        this.setState({selectItem:Object.assign({}, this.state.selectItem, {execution:execution})});
      } else {
        this.setState({selectItem:Object.assign({}, this.state.selectItem, {[id]:value})});            
      }
    }

    editStrategy=() => {
      let {selectItem} = this.state;
      if (!selectItem.hasOwnProperty('execution')) {
        selectItem.execution = {
          light:0,
        };
      }
      switch (selectItem.excuteTime) {
      case this.formatIntl('app.sunrise'):
        selectItem.excuteTime = 0;
        break;
      case this.formatIntl('app.sunset'):
        selectItem.excuteTime = 1;
        break;
      default:
        selectItem.excuteTime = 0;
      }
      updateStrategy({id:selectItem.id, execution:selectItem.execution, excuteTime:selectItem.excuteTime,
        excuteOffset:selectItem.excuteOffset}, this.requestSearch);
    }

    collapseClick=(id, key, data) => {
      let childs;
      if (key == 'strategy') {
        let parentId = getProByKey(data, 'key', id, 'id');
        childs = getIndexsByKey(data, 'groupId', parentId);
      } else {
        childs = getIndexsByKey(data, 'ssgwId', id);
      }
      childs.length !== 0 && childs.map(item => {
        data = data.setIn([item, 'hidden'], !data.getIn([item, 'hidden']));
      });
      this.setState({[`${key}Data`]:data.setIn([getIndexByKey(data, key == 'strategy' ? 'key' 
        : 'id', id), 'collapsed'], !getProByKey(data, key == 'strategy' ? 'key' : 'id', id, 'collapsed'))});
    }
    
    allCheckChange = (value) => {
      const {allDevicesData} = this.state;
      let checked = [];
      value && allDevicesData.map(item => {
        checked.push(item.get('id'));
      });
      this.setState({allDevices:{
        allChecked:value,
        checked:checked,
      }});
    }

    rowCheckChange = (id, value) => {
      let {allDevices, allDevicesData} = this.state;
      value ? allDevices.checked.push(id) : spliceInArray(allDevices.checked, id);
      let obj = getObjectByKey(allDevicesData, 'id', id);
      let childs = [];
      if (obj.get('whiteList')) {
        childs = getListKeyByKey(allDevicesData, 'ssgwId', id, 'id');
        childs.map(item => {
          value ? !allDevices.checked.includes(item) && allDevices.checked.push(item) :
            spliceInArray(allDevices.checked, item);
        });
      } else {
        childs = getListKeyByKey(allDevicesData, 'ssgwId', obj.get('ssgwId'), 'id');
        if (value) {
          IsExitInArray3(allDevices.checked, childs) && allDevices.checked.push(obj.get('ssgwId'));
        } else {
          spliceInArray(allDevices.checked, obj.get('ssgwId'));
        }
      }
      allDevices.allChecked = allDevicesData.size == allDevices.checked.length;
      this.setState({allDevices:allDevices});
    }

    addGateway=() => {
      const {actions} = this.props;
      actions.overlayerShow(<AddGatewayPopup className="add-gateway-popup" intl={this.props.intl}
        title={this.formatIntl("button.add.gateway")} allDevices={this.state.allDevicesData}
        onConfirm={(data) => {
          this.addGatewayToAll(data);
          actions.overlayerHide();
        }} onCancel={() => {
          actions.overlayerHide();
        }}/>);
    }

    addGatewayToAll=(data) => {
      let {allDevicesData} = this.state;
      let len = 0;
      const promise = new Promise((resolve, reject) => {
        data.map(item => {
          getWhiteListById(item.id, (res) => {
            len++;
            item.whiteList = res;
            if (!getObjectByKey(allDevicesData, 'id', item.id)) {
              allDevicesData = allDevicesData.push(item);
            }
            if (len == data.length) {
              resolve(allDevicesData);
            }
          });
                
        });
      });
      promise.then(data => {
        this.initDeviceData('allDevicesData', data);
      });
    }
    addDevice=() => {
      const {allDevices, allDevicesData, selectItem} = this.state;
      let res = [];
      allDevices.checked.map(id => {
        if (getProByKey(allDevicesData, 'id', id, 'extendType') !== 'ssgw') {
          res.push(id);
        }
      });
      updateStrategy({
        id:selectItem.id,
        devices:res,
      }, this.requestSearch);
      this.collapseHandler('devicesExpanded');

    }

    render() {
      const {search, selectedDevicesData, allDevicesData, strategyData, sidebarInfo,
        selectItem, lightList, allDevices, sunList} = this.state;
      const valid = selectItem.excuteOffset;
      return <Content className={`time-strategy ${sidebarInfo.collapsed ? 'collapse'
        : sidebarInfo.devicesExpanded ? 'select-devices-collapse' : ''}`}>
        <div className="heading">
          <SearchText placeholder={search.get('placeholder')} value={search.get('value')}
            onChange={this.searchChange} submit={this.searchSubmit}/>
          <button  className="btn btn-primary add-strategy" onClick={this.addHandler}>
            {this.formatIntl('button.add')}</button>
        </div>
        <div className="table-container">
          <Table className="strategy" keyField="key" collapsed isEdit={true} columns={this.columns}
            data={strategyData} activeId={selectItem && selectItem.key} rowClick={this.tableClick} 
            rowEdit={this.tableEdit} rowDelete={this.tableDelete} collapseClick={this.collapseClick}/>
        </div>
        <div className={`container-fluid sidebar-info ${sidebarInfo.collapsed ? 'sidebar-collapse' : ''}`}>
          <div className="row collapse-container" role="presentation" onClick={() => this.collapseHandler('collapsed')}>
            <span className={sidebarInfo.collapsed ? 'icon_horizontal'  : 'icon_vertical'}></span>
          </div>
          {
            !selectItem.id || selectItem.plans ?
              <div className="panel panel-default group-info">
                <div className="panel-heading" role="presentation" 
                  onClick={() => { !sidebarInfo.collapsed && this.collapseHandler('propertyCollapsed'); }}>
                  <span className="icon_select"></span>{this.formatIntl('app.select.group')}
                  <span className="icon icon_collapse pull-right"></span>
                </div>
                <div className={'panel-body ' + (sidebarInfo.propertyCollapsed ? 'collapsed' : '')}>
                  <div className="form-group">
                    <label title={this.formatIntl('app.strategy.group.name')}>{this.formatIntl('app.strategy.group.name')}</label>
                    <div className="input-container">
                      <input type="text" className="form-control" value={selectItem.name ? selectItem.name
                        : ''} disabled="disabled"/>
                    </div>
                  </div>
                </div>
              </div>
              :
              <div className="panel-strategy">
                <div className="panel panel-default">
                  <div className="panel-heading" role="presentation"
                    onClick={() => { !sidebarInfo.collapsed && this.collapseHandler('propertyCollapsed'); }}>
                    <span className="icon_select"></span>
                    <p className="name" title={selectItem.name}>{selectItem.name}</p>
                    <span className="icon icon_collapse pull-right"></span>
                  </div>
                  <div className={'panel-body ' + (sidebarInfo.propertyCollapsed ? 'collapsed' : '')}>
                    <div className="form-group">
                      <label title={this.formatIntl('app.strategy.level')}>{this.formatIntl('app.strategy.level')}</label>
                      <div className="input-container">
                        <input type="text" className="form-control" value={selectItem.levelTitle} disabled="disabled"/>
                      </div>
                    </div>

                    <div className="form-group date-range">
                      <label title={this.formatIntl('app.date.range')}>{this.formatIntl('app.date.range')}</label>
                      <div className="input-container">
                        <input type="text" className="form-control" value={selectItem.start} disabled="disabled"/>
                        <span>{this.formatIntl('mediaPublish.to')}</span>
                        <input type="text" className="form-control" value={selectItem.end} disabled="disabled"/>
                      </div>
                    </div>

                    <div className="form-group retry">
                      <label title={this.formatIntl('app.strategy.retryNumber')}>{this.formatIntl('app.strategy.retryNumber')}</label>
                      <div className="input-container">
                        <input type="text" className="form-control" value={selectItem.retryNumber} disabled="disabled"/>
                      </div>
                    </div>
                    <div className="form-group retry">
                      <label title={this.formatIntl('app.strategy.retryInterval')}>{this.formatIntl('app.strategy.retryInterval')}</label>
                      <div className="input-container">
                        <input type="text" className="form-control" 
                          value={selectItem.retryInterval} disabled="disabled"/>
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
                      <label title={this.formatIntl('app.strategy.identifying')}>{this.formatIntl('app.strategy.identifying')}</label>
                      <div className="input-container">
                        <select className="form-control" value={selectItem.excuteTime}
                          onChange={e => this.onChange('excuteTime', e.target.value)}>
                          {
                            sunList.map((item, index) => {
                              return <option key={index} value={item.name}>{item.name}</option>;
                            })
                          }
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label title={this.formatIntl('app.brightness')}>{this.formatIntl('app.brightness')}</label>
                      <div className="input-container">
                        <select className="form-control" value={selectItem.execution ? selectItem.execution.light 
                          : ''} onChange={e => this.onChange('light', e.target.value)}>
                          {
                            lightList.map((item, index) => {
                              return <option key={index} value={item.name}>{item.name}</option>;
                            })
                          }
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label title={this.formatIntl('app.time.difference')}>{this.formatIntl('app.time.difference')}</label>
                      <div className="input-container">
                        <input type="text" className="form-control" value={selectItem.excuteOffset ? 
                          selectItem.excuteOffset : ''} onChange={e => this.onChange('excuteOffset', e.target.value)}/>
                      </div>
                    </div>
                    <button className="btn btn-primary pull-right" onClick={this.editStrategy}
                      disabled={!valid}>{this.formatIntl('button.apply')}</button>                            
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
                      <span>{`${this.formatIntl('sysOperation.include')}：${selectItem.devices 
                        ? selectItem.devices.length : 0}${this.formatIntl('sysOperation.devices')}`}</span>
                      <button className="btn btn-primary pull-right" onClick={() => { 
                        !sidebarInfo.collapsed && this.collapseHandler('devicesExpanded'); 
                      }}>{this.formatIntl('button.edit')}</button>                                   
                    </div>
                    <Table className="selectedDevices" collapsed columns={this.deviceColumns}
                      data={selectedDevicesData} collapseClick={this.collapseClick}/>
                  </div>
                </div>
              </div>
          }
                
                
        </div>
        {sidebarInfo.devicesExpanded && <div className="container-fluid sidebar-info sidebar-devices">
          <div className="panel panel-default">
            <div className="panel-heading">
              <span className="icon_select"></span>{this.formatIntl('app.strategy.select.devices')}</div>
            <div className="panel-body">
              <div>
                <button className="btn btn-gray" onClick={this.addGateway}>
                  {this.formatIntl('button.add.gateway')}</button>                                   
                <button className="btn btn-primary pull-right" onClick={this.addDevice}>
                  {this.formatIntl('button.edit')}</button>                   
              </div>
              <Table className="allDevices" collapsed columns={this.deviceColumns} data={allDevicesData}
                allChecked={allDevices.allChecked} checked={allDevices.checked} collapseClick={this.collapseClick}
                allCheckChange={this.allCheckChange} rowCheckChange={this.rowCheckChange}/>
            </div>
          </div>
        </div>}
        {sidebarInfo.devicesExpanded && <div className="select-devices"></div>}
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
)(injectIntl(LatlngStrategy));