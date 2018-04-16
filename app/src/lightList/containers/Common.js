import '../../../public/styles/lightManage-list.less';
import React from 'react';
import { injectIntl } from 'react-intl';
import Content from '../../components/Content';
import SearchText from '../../components/SearchText';
import Table from '../../components/Table';
import Page from '../../components/Page';
import Select from '../../components/Select.1';
import MapView from '../../components/MapView';
import { getChildDomainList } from '../../api/domain';
import {
  getSearchAssets,
  getSearchCount,
  getDeviceStatusById
} from '../../api/asset';
import { getDeviceTypeByModel } from '../../util/index';
import Immutable from 'immutable';

export default function common(DeviceOperation) {
  class Common extends React.Component {
    state = {
      sidebarCollapse: false,
      operationCollapse: false,
      mapCollapse: false,
      domainList: {
        titleField: 'name',
        valueField: 'name',
        options: []
      },
      currentDomain: '',
      search: {
        value: '',
        placeholder: this.props.intl.formatMessage({
          id: 'lightManage.list.devicePlaceholder'
        })
      },
      page: {
        total: 0,
        current: 1,
        limit: 15
      },
      deviceList: [],
      currentDevice: '',
      selectDevice: {
        id: this.props.route.path,
        position: [],
        data: []
      }
    };
    componentWillMount() {
      this._isMounted = true;
      //根据路由参数确定模型
      this.model = this.props.route.path;
      const columns = require(`../TableData/${this.model}Table.json`);
      this.columns = columns.map(item => ({
        id: item.id,
        field: item.field,
        title: this.props.intl.formatMessage({ id: item.title })
      }));
      this.initDomain();
    }
    componentWillUnmount() {
      this._isMounted = false;
    }
    initDomain = () => {
      getChildDomainList(data => {
        if (!this._isMounted) {
          return;
        }
        let currentDomain = '';
        if (data.length) {
          currentDomain = data[0];
        }
        this.setState(
          {
            domainList: { ...this.state.domainList, options: data },
            currentDomain
          },
          this.initDevice
        );
      });
    };
    initDevice = () => {
      if (!this._isMounted) {
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
          value.trim(),
          this._isMounted && this.updatePageSize
        );
        getSearchAssets(
          currentDomain.id,
          this.model,
          value.trim(),
          offset,
          limit,
          this._isMounted && this.updateDevice
        );
      }
    };
    updatePageSize = data => {
      this.setState({ page: { ...this.state.page, total: data.count } });
    };
    updateDevice = data => {
      const currentDevice = data.length === 0 ? '' : data[0];
      this.setState({ deviceList: data, currentDevice }, () => {
        this.updateDeviceListStatus(this.state.deviceList);
        this.updateSelectDevice(this.state.currentDevice);
      });
    };
    updateDeviceListStatus = list => {
      if (!list.length) {
        return;
      }
      let count = 0;
      let newList = [];
      list.map((item, index) => {
        getDeviceStatusById(item.id, res => {
          count++;
          for (let i of Object.keys(res.status)) {
            item[i] = res.status[i];
          }
          newList.push(item);
          if (count === newList.length) {
            this.setState({ deviceList: newList });
          }
        });
      });
    };
    //地图显示
    updateSelectDevice = item => {
      const { selectDevice } = this.state;
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
      this.setState({ selectDevice });
    };
    onDomainChange = e => {
      const { id, selectedIndex } = e.target;
      switch (id) {
        case 'domain':
          const currentDomain = this.state.domainList.options[selectedIndex];
          this.setState({ currentDomain }, this.initDevice);
          break;
      }
    };
    onSearchChange = v => {
      this.setState({
        search: { ...this.state.search, value: v }
      });
    };
    onSearchSubmit = () => {
      this.setState(
        {
          search: { ...this.state.search, current: 1 }
        },
        this.initDevice
      );
    };
    componentDidUpdate() {
      // console.log(this.state);
    }
    handleCollapse = id => {
      this.setState({ [id]: !this.state[id] });
    };
    onPageNumChange = page => {
      this.setState(
        { page: { ...this.state.page, current: page } },
        this.initDevice
      );
    };
    onRowClick = currentDevice => {
      this.setState({ currentDevice: currentDevice.toJS() }, () => {
        this.updateSelectDevice(this.state.currentDevice);
      });
    };
    render() {
      const {
        sidebarCollapse,
        operationCollapse,
        mapCollapse,
        domainList,
        currentDomain,
        search: { value, placeholder },
        page: { limit, current, total },
        deviceList,
        currentDevice,
        selectDevice
      } = this.state;
      const { formatMessage } = this.props.intl;
      const offset = operationCollapse ? 131 : 0;
      const top = 247 - offset;
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
                  currentDomain === ''
                    ? ''
                    : currentDomain[domainList.valueField]
                }
                onChange={this.onDomainChange}
              />
              <SearchText
                placeholder={placeholder}
                value={value}
                onChange={this.onSearchChange}
                submit={this.onSearchSubmit}
              />
            </div>
            <div className="table-container">
              <Table
                columns={this.columns}
                data={Immutable.fromJS(deviceList)}
                activeId={currentDevice.id}
                rowClick={this.onRowClick}
              />
              <Page
                className={`page ${total == 0 ? 'hidden' : ''}`}
                showSizeChanger
                pageSize={limit}
                current={current}
                total={total}
                onChange={this.onPageNumChange}
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
              role="presentation"
              onClick={() => this.handleCollapse('sidebarCollapse')}
            >
              <span
                className={
                  sidebarCollapse ? 'icon_horizontal' : 'icon_vertical'
                }
              />
            </div>
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
                <span
                  class={`icon pull-right glyphicon ${
                    operationCollapse
                      ? 'glyphicon-chevron-down'
                      : 'glyphicon-chevron-up'
                  }`}
                />
              </div>
              <div
                class={`panel-body device-operation-panel ${
                  operationCollapse ? 'device-hidden' : ''
                }`}
              >
                <DeviceOperation
                  disabled={disabled}
                  currentDevice={currentDevice}
                />
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
                <span
                  class={`icon pull-right glyphicon ${
                    mapCollapse
                      ? 'glyphicon-chevron-down'
                      : 'glyphicon-chevron-up'
                  }`}
                />
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
  return injectIntl(Common);
}
