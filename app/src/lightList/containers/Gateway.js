/**
 * Created by Azrael on 2017/9/1.
 */
import '../../../public/styles/lightManage-list.less';
import React, { Component } from 'react';
import Content from '../../components/Content';
import SearchText from '../../components/SearchText';
import Select from '../../components/Select.1';
import TableWithHeader from '../components/TableWithHeader';
import TableTr from '../components/TableTr';
import Page from '../../components/Page';
import MapView from '../../components/MapView';
import { getDomainList, getChildDomainList } from '../../api/domain';
import {
  getSearchAssets,
  getSearchCount,
  getDeviceStatusByModelAndId,
  updateAssetsRpcById
} from '../../api/asset';
import { getMomentDate, momentDateFormat } from '../../util/time';
import { message } from 'antd';
import 'antd/lib/message/style/css';
import { getDeviceTypeByModel } from '../../util/index';
import { injectIntl } from 'react-intl';
class Gateway extends Component {
  constructor(props) {
    super(props);
    const { formatMessage } = this.props.intl;
    this.state = {
      page: {
        total: 0,
        current: 1,
        limit: 10
      },
      search: {
        value: '',
        placeholder: formatMessage({
          id: 'lightManage.list.devicePlaceholder'
        })
      },
      sidebarCollapse: false,
      deviceCollapse: false,
      operationCollapse: false,
      mapCollapse: false,
      currentDevice: null,
      selectDevice: {
        id: 'lightListGateway',
        position: [],
        data: []
      },
      deviceList: [],
      currentDomain: '',
      domainList: {
        titleField: 'name',
        valueField: 'name',
        options: []
      },
      currentControlMode: 'remote',
      controlModeList: {
        titleField: 'title',
        valueField: 'value',
        options: [
          {
            title: formatMessage({ id: 'lightManage.list.remote' }),
            value: 'remote'
          },
          {
            title: formatMessage({ id: 'lightManage.list.auto' }),
            value: 'auto'
          }
        ]
      }
    };

    this.model = 'ssgw';

    this.columns = [
      {
        accessor: 'name',
        title: formatMessage({
          id: 'lightManage.list.name'
        })
      },
      {
        accessor: 'domain',
        title: formatMessage({
          id: 'lightManage.list.domain'
        })
      },
      {
        accessor: 'online',
        title: formatMessage({
          id: 'lightManage.list.communication'
        })
      },
      {
        accessor: 'device',
        title: formatMessage({
          id: 'lightManage.list.gatewayDeviceStatus'
        })
      },
      {
        accessor: 'runningTime',
        title: formatMessage({
          id: 'lightManage.list.runningTime'
        })
      },
      {
        accessor(data) {
          return data.updateTime
            ? momentDateFormat(
                getMomentDate(data.updateTime, 'YYYY-MM-DDTHH:mm:ss Z'),
                'YYYY/MM/DD HH:mm'
              )
            : '';
        },
        title: formatMessage({
          id: 'lightManage.list.lastUpdate'
        })
      }
    ];

    this.collapseHandler = this.collapseHandler.bind(this);
    this.onChange = this.onChange.bind(this);
    this.pageChange = this.pageChange.bind(this);
    this.searchChange = this.searchChange.bind(this);
    this.searchSubmit = this.searchSubmit.bind(this);
    this.tableClick = this.tableClick.bind(this);

    this.initData = this.initData.bind(this);
    this.updateDomainData = this.updateDomainData.bind(this);
    this.initDeviceData = this.initDeviceData.bind(this);
    this.updateDeviceData = this.updateDeviceData.bind(this);
    this.updatePageSize = this.updatePageSize.bind(this);
  }

  componentWillMount() {
    this.mounted = true;
    this.initData();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  initData() {
    getChildDomainList(data => {
      this.mounted && this.updateDomainData(data, this.initDeviceData);
    });
  }

  updateDomainData(data, cb) {
    let currentDomain,
      options = data;
    if (data.length == 0) {
      currentDomain = null;
    } else {
      currentDomain = data[0];
    }
    this.setState(
      { domainList: { ...this.state.domainList, options }, currentDomain },
      () => {
        cb && cb();
      }
    );
  }

  initDeviceData() {
    if (!this.mounted) {
      return;
    }

    if (this.state.currentDomain) {
      const {
        currentDomain,
        search: { value },
        page: { current, limit }
      } = this.state;
      const offset = limit * (current - 1);
      getSearchCount(
        currentDomain.id,
        this.model,
        value,
        this.mounted && this.updatePageSize
      );
      getSearchAssets(
        currentDomain.id,
        this.model,
        value,
        offset,
        limit,
        this.mounted && this.updateDeviceData
      );
    }
  }

  updateDeviceData(data) {
    let currentDevice = data.length == 0 ? null : data[0];
    this.setState({ deviceList: data, currentDevice }, () => {
      this.updateSelectDevice(this.state.currentDevice);
    });
  }
  updateSelectDevice = item => {
    let selectDevice = this.state.selectDevice;
    selectDevice.latlng = item.geoPoint;
    selectDevice.data.splice(0);
    selectDevice.data.push({
      id: item.id,
      type: item.extend.type,
      name: item.name
    });
    selectDevice.domainId = item.domainId;
    selectDevice.position.splice(0);
    selectDevice.position.push(
      Object.assign(
        {},
        {
          device_id: item.id,
          device_type: getDeviceTypeByModel(item.extendType)
        },
        item.geoPoint
      )
    );
    this.setState({ selectDevice: selectDevice });
  };
  updatePageSize(data) {
    this.setState({ page: { ...this.state.page, total: data.count } });
  }

  onChange(e) {
    const { id, value } = e.target;
    switch (id) {
      case 'domain':
        let currentDomain = this.state.domainList.options[
          e.target.selectedIndex
        ];
        this.setState({ currentDomain }, this.initDeviceData);
        break;
      case 'controlMode':
        this.setState({ currentControlMode: value });
        break;
    }
  }

  pageChange(page) {
    this.setState(
      { page: { ...this.state.page, current: page } },
      this.initDeviceData
    );
  }

  searchChange(value) {
    this.setState({
      search: { ...this.state.search, value: value }
    });
  }

  searchSubmit() {
    this.setState(
      { page: { ...this.state.page, current: 1 } },
      this.initDeviceData
    );
  }

  collapseHandler() {
    this.setState({ sidebarCollapse: !this.state.sidebarCollapse });
  }

  tableClick(currentDevice) {
    this.setState({ currentDevice }, () => {
      this.updateSelectDevice(this.state.currentDevice);
    });
  }
  apply = () => {
    const { id } = this.state.currentDevice;
    const { currentControlMode } = this.state;
    console.log('here');
    updateAssetsRpcById(id, { mode: currentControlMode }, res => {
      if (res.success) {
        message.success('操作成功');
      } else {
        message.error('操作失败');
      }
    });
  };
  checkTime = () => {
    const { id } = this.state.currentDevice;
    console.log('here');
    updateAssetsRpcById(id, { updateTime: true }, res => {
      if (res.success) {
        message.success('操作成功');
      } else {
        message.error('操作失败');
      }
    });
  };
  handleCollapse = id => {
    this.setState({ [id]: !this.state[id] });
  };
  render() {
    const {
      page: { total, current, limit },
      sidebarCollapse,
      deviceCollapse,
      operationCollapse,
      mapCollapse,
      currentDevice,
      selectDevice,
      deviceList,
      search: { value, placeholder },
      currentDomain,
      domainList,
      currentControlMode,
      controlModeList
    } = this.state;
    const { formatMessage } = this.props.intl;
    // const offset1 = deviceCollapse ? 60 : 0;
    const offset2 = operationCollapse ? 135 : 0;
    // const top = 349 - offset1 - offset2;
    const top = 247 - offset2;
    const disabled = deviceList.length == 0 ? true : false;
    return (
      <Content className={`list-lcc ${sidebarCollapse ? 'collapse' : ''}`}>
        <div className="content-left">
          <div className="heading">
            <Select
              id="domain"
              titleField={domainList.titleField}
              valueField={domainList.valueField}
              options={domainList.options}
              value={
                currentDomain == null
                  ? ''
                  : currentDomain[this.state.domainList.valueField]
              }
              onChange={this.onChange}
            />
            <SearchText
              placeholder={placeholder}
              value={value}
              onChange={this.searchChange}
              submit={this.searchSubmit}
            />
          </div>
          <div className="table-container">
            <TableWithHeader columns={this.columns}>
              {deviceList.map(item => (
                <TableTr
                  key={item.id}
                  data={item}
                  columns={this.columns}
                  activeId={currentDevice.id}
                  rowClick={this.tableClick}
                  willMountFuncs={[
                    getDeviceStatusByModelAndId(this.model, item.id)
                  ]}
                />
              ))}
            </TableWithHeader>
            <Page
              className={`page ${total == 0 ? 'hidden' : ''}`}
              showSizeChanger
              pageSize={limit}
              current={current}
              total={total}
              onChange={this.pageChange}
            />
          </div>
        </div>
        <div
          className={`container-fluid sidebar-info ${
            sidebarCollapse ? 'sidebar-collapse' : ''
          }`}
        >
          <div
            className="row collapse-container"
            onClick={this.collapseHandler}
          >
            <span
              className={sidebarCollapse ? 'icon_horizontal' : 'icon_vertical'}
            />
          </div>
          {/* <div className="panel panel-default">
            <div
              className="panel-heading"
              role="presentation"
              onClick={() => this.handleCollapse('deviceCollapse')}
            >
              <span className="icon_select" />选中设备
              <span class="icon icon_collapse pull-right" />
            </div>=
            <div class={`panel-body ${deviceCollapse ? 'device-hidden' : ''}`}>
              <span
                title={currentDevice === null ? '无设备' : currentDevice.name}
              >
                {currentDevice === null ? '无设备' : currentDevice.name}
              </span>
            </div>
          </div> */}
          <div className="panel panel-default panel-custom">
            <div
              className="panel-heading"
              role="presentation"
              onClick={() => this.handleCollapse('operationCollapse')}
            >
              <span className="icon_touch" />
              {formatMessage({
                id: 'lightManage.list.operation'
              })}
              <span class="icon icon_collapse pull-right" />
            </div>
            <div
              class={`panel-body ${operationCollapse ? 'device-hidden' : ''}`}
            >
              <div>
                <span className="tit">
                  {formatMessage({
                    id: 'lightManage.list.controlMode'
                  })}：
                </span>
                <Select
                  id="controlMode"
                  titleField={controlModeList.titleField}
                  valueField={controlModeList.valueField}
                  options={controlModeList.options}
                  value={currentControlMode}
                  onChange={this.onChange}
                  disabled={disabled}
                />
                <button
                  className="btn btn-primary"
                  disabled={disabled}
                  onClick={this.apply}
                >
                  {formatMessage({
                    id: 'lightManage.list.apply'
                  })}
                </button>
              </div>
              <div>
                <span className="tit">
                  {formatMessage({
                    id: 'lightManage.list.timing'
                  })}：
                </span>
                <span className="note">
                  {formatMessage({ id: 'lightManage.list.checkTime' })}
                </span>
                <button
                  className="btn btn-primary"
                  disabled={disabled}
                  onClick={this.checkTime}
                >
                  {formatMessage({
                    id: 'lightManage.list.apply'
                  })}
                </button>
              </div>
            </div>
          </div>
          <div class="panel panel-default">
            <div
              class="panel-heading"
              role="presentation"
              onClick={() => this.handleCollapse('mapCollapse')}
            >
              <span class="icon_map" />
              <span>
                {formatMessage({
                  id: 'lightManage.list.mapPosition'
                })}
              </span>
              <span class="icon icon_collapse pull-right" />
            </div>
            <div
              class={`panel-body map-container ${
                mapCollapse ? 'device-hidden' : ''
              }`}
              style={{ top: top }}
            >
              <MapView option={{ mapZoom: false }} mapData={selectDevice} />
            </div>
          </div>
        </div>
      </Content>
    );
  }
}

export default injectIntl(Gateway);
/**
 *  <Table columns={this.columns} keyField='id' data={deviceList} rowClick={this.tableClick}
                                activeId={currentDevice == null ? '' : currentDevice.id}/>
 */
