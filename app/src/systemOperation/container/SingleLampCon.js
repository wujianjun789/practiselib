import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import SearchText from '../../components/SearchText';
import Table from '../../components/Table';
import Page from '../../components/Page';
import SideBarInfo from '../../components/SideBarInfo';
import Select from '../../components/Select.1';
import CentralizedControllerPopup from '../components/CentralizedControllerPopup';
import ConfirmPopup from '../../components/ConfirmPopup';
import Immutable from 'immutable';
import { overlayerShow, overlayerHide } from '../../common/actions/overlayer';

import Content from '../../components/Content';

import { TreeData, getModelData, getModelTypesById, getModelTypesNameById } from '../../data/systemModel';
import { getModelTypeByModel } from '../../api/asset'

import { getChildDomainList } from '../../api/domain';
import { getSearchAssets, getSearchCount, postAssetsByModel, updateAssetsByModel, delAssetsByModel }
  from '../../api/asset';

import { getDeviceTypeByModel } from '../../util/index';

import { treeViewInit } from '../../common/actions/treeView';
import ExcelPopup from '../components/ExcelPopup';
import { addNotify, removeAllNotify } from '../../common/actions/notifyPopup';
import { bacthImport } from '../../api/import';
import { injectIntl } from 'react-intl';

import DeviceReplacePopup from '../components/DeviceReplacePopup';
import DeviceUpgradePopup from '../components/DeviceUpgradePopup';
import { replaceDevice } from '../../api/import';
import {getObjectByKeyObj,getObjectByKey} from '../../util/algorithm';
import {trimString} from '../../util/string';

export class SingleLampCon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      model: 'ssslc',
      collapse: false,
      deviceCollapse: false,
      page: Immutable.fromJS({
        pageSize: 5,
        current: 1,
        total: 0,
      }),
      search: Immutable.fromJS({
        placeholder: 'sysOperation.input.device',
        value: '',
      }),
      selectDevice: {
        id: 'systemOperation',
        // latlng:{lng: 121.49971691534425,
        //     lat: 31.239658843127756}
        position: [],
        data: [],
      },
      domainList: {
        titleField: 'name',
        valueField: 'name',
        index: 0,
        value: '',
        options: [
          { id: 1, title: 'domain01', value: 'domain01' },
          { id: 2, title: 'domain02', value: 'domain02' },
          { id: 3, title: 'domain03', value: 'domain03' },
          { id: 4, title: 'domain04', value: 'domain04' },
          { id: 5, title: 'domain05', value: 'domain05' },
          { id: 6, title: 'domain06', value: 'domain06' },
          { id: 7, title: 'domain07', value: 'domain07' },
        ],
      },
      modelList: {
        titleField: 'title',
        valueField: 'value',
        options: [
          { id: 1, title: 'model01', value: 'model01' },
          { id: 2, title: 'model02', value: 'model02' },
          { id: 3, title: 'model03', value: 'model03' },
          { id: 4, title: 'model04', value: 'model04' },
          { id: 5, title: 'model05', value: 'model05' },
          { id: 6, title: 'model06', value: 'model06' },
          { id: 7, title: 'model07', value: 'model07' },
        ],
      },
      data: Immutable.fromJS([/*{     //table中设备数据
             id: 0,
             name: '设备1',
             model: 'model01',
             domain: 'domain01',
             lng: 121.49971691534425,
             lat: 31.239658843127756
             }*/]),
    };

    this.columns = [
      // {
      //   id: 0,
      //   field: 'domainName',
      //   title: this.props.intl.formatMessage({ id: 'sysOperation.domain' }),
      // },
      {
        id: 1,
        field: 'name',
        title: this.props.intl.formatMessage({ id: 'name' }),
      },
      {
        id: 2,
        field: 'typeName',
        title: this.props.intl.formatMessage({ id: 'sysOperation.type' }),
      },
      {
        id: 3,
        field: 'id',
        title: this.props.intl.formatMessage({ id: 'sysOperation.id' }),
      },
      // {
      //   id: 5,
      //   field: 'lng',
      //   title: this.props.intl.formatMessage({ id: 'map.lng' }),
      // },
      // {
      //   id: 6,
      //   field: 'lat',
      //   title: this.props.intl.formatMessage({ id: 'map.lat' }),
      // },
    ];

    this.collapseHandler = this.collapseHandler.bind(this);
    this.searchChange = this.searchChange.bind(this);
    this.tableClick = this.tableClick.bind(this);
    this.updateSelectDevice = this.updateSelectDevice.bind(this);
    this.searchSubmit = this.searchSubmit.bind(this);
    this.pageChange = this.pageChange.bind(this);
    this.domainHandler = this.domainHandler.bind(this);
    this.domainSelect = this.domainSelect.bind(this);
    this.deviceHandler = this.deviceHandler.bind(this); //设备升级，更换设备

    this.popupCancel = this.popupCancel.bind(this);
    this.popupConfirm = this.popupConfirm.bind(this);

    this.requestSearch = this.requestSearch.bind(this);
    this.initPageSize = this.initPageSize.bind(this);
    this.initDomainList = this.initDomainList.bind(this);
    this.initAssetList = this.initAssetList.bind(this);
    this.importHandler = this.importHandler.bind(this);
  }

  componentWillMount() {
    this.mounted = true;
    let { model } = this.state;
    getModelData(model, () => {
      if (this.mounted) {
        this.props.actions.treeViewInit(TreeData);
        // this.setState({
        //   modelList: Object.assign({}, this.state.modelList, {options: getModelTypesById(model).map((type) => {
        //     return  {id: type.id, title: type.title, value: type.title};
        //   })}),
        // });
        getModelTypeByModel(model, res => {
          let types = res.length == 0 ? [] : res[0].types;
          let list = types.length == 0 ? [] : types.map((type) => {
            return {
              title: type.name,
              value: type.name,
            };
          })
          this.setState({
            modelList: Object.assign({}, this.state.modelList, {
              options: list
            })
          });
        });
        getChildDomainList(data => {
          this.mounted && this.initDomainList(data);
        });
      }
    });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidMount() {
  }

  requestSearch() {
    const { model, domainList, search, page } = this.state;
    let domain = domainList.options.length ? domainList.options[domainList.index] : null;
    let name = trimString(search.get('value'));;
    let cur = page.get('current');
    let size = page.get('pageSize');
    let offset = (cur - 1) * size;
    getSearchCount(domain ? domain.id : null, model, name, data => {
      this.mounted && this.initPageSize(data);
    });

    getSearchAssets(domain ? domain.id : null, model, name, offset, size, data => {
      this.mounted && this.initAssetList(data);
    });
  }

  initPageSize(data) {
    let page = this.state.page.set('total', data.count);
    this.setState({ page: page });
  }

  initDomainList(data) {
    let domainList = Object.assign({}, this.state.domainList, { index: 0 },
      { value: data.length ? data[0].name : '' }, { options: data });
    this.setState({ domainList: domainList });
    this.requestSearch();
  }

  initAssetList(data) {
    let list = data.map((asset, index) => {
      let domainName = '';
      if (this.state.domainList.options.length && asset.domainId) {
        let domain = getObjectByKeyObj(this.state.domainList.options, 'id', asset.domainId);
        domainName = domain ? domain.name : '';
      }
      return Object.assign({}, asset, asset.extend, asset.geoPoint, { domainName: domainName },
        { typeName: asset.extend.type });
    });

    this.setState({ data: Immutable.fromJS(list) });
    if (list.length) {
      let item = list[0];
      this.updateSelectDevice(item);
    } else {
      this.setState({ selectDevice: Object.assign({}, this.state.selectDevice, { data: [] }) });
    }
  }

  popupCancel() {
    this.props.actions.overlayerHide();
  }

  popupConfirm(id) {
    const { model } = this.state;
    delAssetsByModel(model, id, () => {
      this.requestSearch();
      this.props.actions.overlayerHide();
    });

  }

  domainHandler(key,id) {
    // let id = e.target.id;
    const { model, selectDevice, domainList, modelList } = this.state;
    const { overlayerShow, overlayerHide } = this.props.actions;
    let curType = modelList.options.length ? modelList.options[0] : null;
    switch (key) {
      case 'sys-add': {
        const curDomain = domainList.index < domainList.options.length ? domainList.options[domainList.index] : null;
        const addLatlng = curDomain ? curDomain.geoPoint : null;
        const dataInit = {
          id: '',
          name: '',
          model: curType ? curType.title : '',
          domain: domainList.value,
          domainId: curDomain ? curDomain.id : '',
          lng: addLatlng ? addLatlng.lng : '',
          lat: addLatlng ? addLatlng.lat : '',
        };

        overlayerShow(<CentralizedControllerPopup popId="add" className="centralized-popup"
          title={this.props.intl.formatMessage({ id: 'sysOperation.addDevice' })} model={this.state.model}
          data={dataInit} domainList={domainList} modelList={modelList}
          overlayerHide={overlayerHide} onConfirm={(data) => {
            postAssetsByModel(model, data, () => {
              this.requestSearch();
            });
          }} />);
        break;
      }
      case 'sys-update': {
        // let latlng = selectDevice.position.length ? selectDevice.position[0] : { lat: '', lng: '' };
        // let data = selectDevice.data.length ? selectDevice.data[0] : null;
        let curDevice = getObjectByKey(this.state.data,'id',id);
        console.log(curDevice.toJS())
        const dataInit2 = {
          id: curDevice ? curDevice.get('id') : null,
          name: curDevice ? curDevice.get('name') : null,
          model: curDevice && getObjectByKeyObj(modelList.options,'title',curDevice.get('type'))? curDevice.get('type') : (curType ? curType.title : ''),          
          domain: curDevice.get('domainName'),
          domainId: curDevice.get('domainId'),
          lng: curDevice.get('lng'),
          lat: curDevice.get('lat'),
        };
        overlayerShow(<CentralizedControllerPopup popId="edit" className="centralized-popup"
          title={this.props.intl.formatMessage({ id: 'sysOperation.lamp.control' })}
          data={dataInit2} domainList={domainList} modelList={modelList}
          overlayerHide={overlayerHide} onConfirm={data => {
            updateAssetsByModel(model, data, (data) => {
              this.requestSearch();
              overlayerHide();
            });
          }} />);
        break;
      }
      case 'sys-delete':
        overlayerShow(<ConfirmPopup tips={this.props.intl.formatMessage({ id: 'delete.device' })}
          iconClass="icon_popup_delete" cancel={this.popupCancel}
          confirm={()=>this.popupConfirm(id)} />);
        break;
      default:
        break;
    }
  }

  deviceHandler(key,id) {
    // let id = e.target.id;
    if (key === 'sys-upgrade') {
      //设备升级
      console.log('this.state.data：', this.state.data);
      //需要传入的数据：
      const { overlayerHide, overlayerShow, addNotify } = this.props.actions;

      overlayerShow(<DeviceUpgradePopup className='deviceUpgrade-popup' overlayerHide={overlayerHide} requestSearch={this.requestSearch}
        intl={this.props.intl} tableData={this.state.data} onConfirm={(data) => {//升级设备，data为待升级的设备的Id
          //升级

        }} />);

    }
    if (id === 'sys-replace') {
      //设备更换,一个弹出面板
      const { overlayerShow, overlayerHide, addNotify } = this.props.actions;
      overlayerShow(<DeviceReplacePopup className="deviceReplace-popup" columns={this.columns}
        model={this.state.model} domainList={this.state.domainList} addNotify={addNotify}
        overlayerHide={overlayerHide}
        onConfirm={(datas) => {
          replaceDevice(`${this.state.model}s`, datas, () => {
            this.requestSearch();
          });
        }} />);
    }

  }

  pageChange(current, pageSize) {
    let page = this.state.page.set('current', current);
    this.setState({ page: page }, () => {
      this.requestSearch();
    });
  }

  tableClick(row) {
    this.updateSelectDevice(row.toJS());
  }

  updateSelectDevice(item) {
    let selectDevice = this.state.selectDevice;
    selectDevice.latlng = item.geoPoint;
    selectDevice.data.splice(0);
    selectDevice.data.push({ id: item.id, type: item.extend.type, name: item.name });
    selectDevice.domainId = item.domainId;
    selectDevice.domainName = item.domainName;
    selectDevice.position.splice(0);
    selectDevice.position.push(Object.assign({}, {
      'device_id': item.id, 'device_type':
        getDeviceTypeByModel(item.extendType)
    }, item.geoPoint));
    this.setState({ selectDevice: selectDevice });
  }

  searchSubmit() {
    let page = this.state.page.set('current', 1);
    this.setState({ page: page }, () => {
      this.requestSearch();
    });
  }

  searchChange(value) {
    this.setState({ search: this.state.search.update('value', () => value) });
  }

  collapseHandler(id) {
    this.setState({ [id]: !this.state[id] });
  }


  domainSelect(event) {
    // this.props.actions.domainSelectChange(index);
    let index = event.target.selectedIndex;
    let { domainList } = this.state;
    domainList.index = index;
    domainList.value = domainList.options[index].name;
    this.setState({ domainList: domainList }, () => {
      this.requestSearch();
    });
  }

  importHandler() {
    const { overlayerShow, overlayerHide, addNotify, removeAllNotify } = this.props.actions;

    overlayerShow(<ExcelPopup className="import-popup" columns={this.columns} model={this.state.model}
      domainList={this.state.domainList} addNotify={addNotify} removeAllNotify={removeAllNotify} overlayerHide={overlayerHide}
      onConfirm={(datas, isUpdate) => {
        bacthImport(`${this.state.model}s`, datas, isUpdate, () => {
          this.requestSearch();
        });
      }} />);
  }

  render() {
    const { collapse, deviceCollapse, page, search, selectDevice, domainList, data } = this.state;
    return <Content className={'offset-right ' + (collapse ? 'collapsed' : '')}>
      <div className="heading">
        <div className="flex-left">
          <Select id="domain" titleField={domainList.valueField} valueField={domainList.valueField}
            options={domainList.options} value={domainList.value} onChange={this.domainSelect} />
          <SearchText placeholder={this.props.intl.formatMessage({ id: search.get('placeholder') })}
            value={search.get('value')} onChange={this.searchChange} submit={this.searchSubmit} />
        </div>
        <div className="flex-right">
          <button id="sys-add" className="btn btn-primary add-domain" onClick={()=> this.domainHandler('sys-add') }>
            {this.props.intl.formatMessage({ id: 'button.add' })}</button>
          <div className="btn-group">
            <button id="sys-maintenance" disabled={data.size == 0?true:false} className="btn btn-gray dropdown-toggle"
              data-toggle="dropdown">操作<span className="caret"></span>
            </button>
            <div className="dropdown-menu" role="menu">
              <span className="glyphicon glyphicon-triangle-top" id="iconbox"></span>
              <div className="listBox">
                <span className="icon_upgrade" title={this.props.intl.formatMessage({ id: 'button.import' })} onClick={this.importHandler}></span>
                <span className="icon_upgrade" title={this.props.intl.formatMessage({ id: 'sysOperation.deviceUpgrade' })} onClick={()=>this.deviceHandler('sys-upgrade')}></span>
                <span className="icon_upgrade" title={this.props.intl.formatMessage({ id: 'sysOperation.deviceReplace' })} onClick={()=>this.deviceHandler('sys-replace')}></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="table-container">
        <Table columns={ this.columns } data={ data } activeId={ selectDevice.data.length && selectDevice.data[0].id }
          rowClick={ this.tableClick } isEdit rowEdit={(id)=>this.domainHandler('sys-update',id)} rowDelete={(id)=>this.domainHandler('sys-delete',id)} isDevice rowUpgrade={(id)=>this.deviceHandler('sys-upgrade',id)} rowReplace={(id)=>this.deviceHandler('sys-replace',id)}/>
        <Page className={'page ' + (page.get('total') == 0 ? 'hidden' : '')} pageSize={page.get('pageSize')}
          current={page.get('current')} total={page.get('total')} onChange={this.pageChange} />
      </div>
      <SideBarInfo mapDevice={selectDevice} collapseHandler={this.collapseHandler}
        className={(deviceCollapse ? 'deviceCollapse ' : '')}>
        <div className="panel panel-default device-statics-info">
          <div className="panel-heading" role="presentation"
            onClick={() => { !collapse && this.collapseHandler('deviceCollapse'); }}>
            <span className="icon_select"></span>{this.props.intl.formatMessage({ id: 'sysOperation.device.version' })}
            <span className="icon icon_collapse pull-right"></span>
          </div>
          <div className={'panel-body domain-property ' + (deviceCollapse ? 'collapsed' : '')}>
              <div className="version"><span>{this.props.intl.formatMessage({ id: 'sysOperation.product.version' })}：V1.2</span></div>
              <div className="version"><span>{this.props.intl.formatMessage({ id: 'sysOperation.hardware.version' })}：V1.2</span></div>
              <div className="version"><span>{this.props.intl.formatMessage({ id: 'sysOperation.software.version' })}：V1.2</span></div>
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
    addNotify,
    removeAllNotify
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(SingleLampCon));