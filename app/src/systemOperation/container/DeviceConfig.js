import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import SearchText from '../../components/SearchText';
import Table from '../../components/Table';
import Page from '../../components/Page';
import SideBarInfo from '../../components/SideBarInfo';
import Select from '../../components/Select.1';
import WhiteListPopup from '../components/WhiteListPopup';
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
import {sideBarToggled} from '../action';
import {treeViewNavigator} from '../../common/util/index'
import { bacthImport } from '../../api/import';
import { injectIntl } from 'react-intl';

import DeviceReplacePopup from '../components/DeviceReplacePopup';
import DeviceUpgradePopup from '../components/DeviceUpgradePopup';
import SingleDeviceReplacePopup from '../components/SingleDeviceReplacePopup';
import { replaceDevice } from '../../api/import';
import {getObjectByKeyObj,getObjectByKey} from '../../util/algorithm';
import {trimString} from '../../util/string';
import { requestWhiteListCountById } from '../../api/domain';

export class SingleLampCon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      model: 'ssgw',
      collapse: false,
      deviceCollapse: false,
      whiteListCollapse:false,      
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
        position: [],
        data: [],
        whiteCount:0
      },
      domainList: {
        titleField: 'name',
        valueField: 'name',
        index: 0,
        value: '',
        options: [],
      },
      modelList: {
        titleField: 'title',
        valueField: 'value',
        options: [],
      },
      //table中设备数据
      data: Immutable.fromJS([]),
    };

    this.columns = [
      {
        id: 0,
        field: 'name',
        title: this.props.intl.formatMessage({ id: 'name' }),
      },
      {
        id: 1,
        field: 'id',
        title: this.props.intl.formatMessage({ id: 'sysOperation.id' }),
      },
      {
        id: 2,
        field: 'typeName',
        title: this.props.intl.formatMessage({ id: 'sysOperation.type' }),
      },
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
    this.initData = this.initData.bind(this);
    this.requestWhiteListCount = this.requestWhiteListCount.bind(this);
  }

  componentWillMount() {
    console.log("sideBarNode:", this.props.route.sideBarNode);
    
    this.mounted = true;
    this.initData();
  }

  componentDidMount(){
    const {model} = this.state;
    // this.requestToggle() //
  }
  
  initData(){
    let { model } = this.state;
    getModelData(model, () => {
      if (this.mounted) {
        this.props.actions.treeViewInit(TreeData);
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

  componentDidUpdate() {
    const {sidebarNode} = this.props;
    if(sidebarNode && !sidebarNode.children && sidebarNode.id != this.state.model){
      this.setState({model:sidebarNode.id},this.initData)
    }
  }

  formatIntl(formatId) {
    const {intl} = this.props;
    return intl ? intl.formatMessage({id:formatId}) : null;
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
      model=='ssgw' && this.requestWhiteListCount();
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

  requestWhiteListCount() {
    const {selectDevice} = this.state;
    let gatewayId = selectDevice.data[0].id;
    requestWhiteListCountById(gatewayId, (lcCount) => {
      this.setState({
        selectDevice: Object.assign({}, selectDevice, {
          whiteCount: lcCount.count,
        }),
      });
    });
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
    const { model, selectDevice, domainList, modelList,whitelistData } = this.state;
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
      case 'sys-whitelist': {
        let data2 = selectDevice.data.length ? selectDevice.data[0] : null;
        overlayerShow(<WhiteListPopup className="whitelist-popup" intl={this.props.intl} id={ data2.id }
          domainId={ selectDevice.domainId } data={ whitelistData } overlayerHide={ overlayerHide } callFun={ () => {
            this.requestWhiteListCount();
          } } />);
        break;
      }
      default:
        break;
    }
  }

  deviceHandler(key,id) {
    let {selectDevice} = this.state;
    let selectedItem = selectDevice.data[0];
     if (key === 'sys-upgrade') {
        if (id){  //单设备升级
          console.log('this.state.data：', this.state.data);
          //需要传入的数据：
          const { overlayerHide, overlayerShow, addNotify } = this.props.actions;
    
          overlayerShow(<DeviceUpgradePopup id={id} className='deviceUpgrade-popup' overlayerHide={overlayerHide} requestSearch={this.requestSearch}
            intl={this.props.intl} tableData={this.state.data}
             onConfirm={(data) => {
              // console.log("shengjishuju:",data);
            }} />);
        }else {
          //多设备升级
        const { overlayerHide, overlayerShow, addNotify } = this.props.actions;
        overlayerShow(<DeviceUpgradePopup className='deviceUpgrade-popup' overlayerHide={overlayerHide} requestSearch={this.requestSearch}
          intl={this.props.intl} tableData={this.state.data} onConfirm={(data) => {//升级设备，data为待升级的设备的Id
        
          }} />);
        }
    } else if (key === 'sys-replace') {
        if (id){  //单设备更换
          const { overlayerShow, overlayerHide, addNotify } = this.props.actions;
          overlayerShow(<SingleDeviceReplacePopup className="singleDeviceReplace-popup" columns={this.columns}
            model={this.state.model} domainList={this.state.domainList} addNotify={addNotify}
            overlayerHide={overlayerHide} selectedItem = {selectedItem}
            />);
        } else {
          //多设备更换,替换当前域下的全部该类设备,从组件返回文件
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
    let {selectDevice} = this.state;
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
    this.state.model == 'ssgw' && this.requestWhiteListCount();
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
    let model = this.state.model == 'sses' || this.state.model == 'ssads'? this.state.model : `${this.state.model}s`
    overlayerShow(<ExcelPopup className="import-popup" columns={this.columns} model={this.state.model}
      domainList={this.state.domainList} addNotify={addNotify} removeAllNotify={removeAllNotify} overlayerHide={overlayerHide}
      onConfirm={(datas, isUpdate) => {
        bacthImport(model, datas, isUpdate, () => {
          this.requestSearch();
        });
      }} />);
  }

  render() {
    const { collapse, deviceCollapse,whiteListCollapse, page, search, selectDevice, domainList, data } = this.state;
    return <Content className={'offset-right ' + (collapse ? 'collapsed ' : '')+this.state.model}>
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
            <button id="sys-maintenance" className="btn btn-gray dropdown-toggle"
              data-toggle="dropdown">操作<span className="caret"></span>
            </button>
            <div className="dropdown-menu" role="menu">
              <span className="glyphicon glyphicon-triangle-top" id="iconbox"></span>
              <div className="listBox">
                <span className="icon_import" title={this.props.intl.formatMessage({ id: 'button.import' })} onClick={this.importHandler}></span>
                <span className="icon_upgrade2" title={this.props.intl.formatMessage({ id: 'sysOperation.deviceUpgrade' })} onClick={()=>this.deviceHandler('sys-upgrade')}></span>
                <span className="icon_replace" title={this.props.intl.formatMessage({ id: 'sysOperation.deviceReplace' })} onClick={()=>this.deviceHandler('sys-replace')}></span>
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
        className={(deviceCollapse ? 'deviceCollapse ' : '')+(whiteListCollapse ? 'whiteListCollapse' : '')}>
        <div className="panel panel-default device-statics-info">
          <div className="panel-heading" role="presentation"
            onClick={() => { !collapse && this.collapseHandler('deviceCollapse'); }}>
            <span className="icon_version"></span>{this.props.intl.formatMessage({ id: 'sysOperation.device.version' })}
            <span className="icon icon_collapse pull-right"></span>
          </div>
          <div className={'panel-body domain-property ' + (deviceCollapse ? 'collapsed' : '')}>
              <div className="version"><span>{this.props.intl.formatMessage({ id: 'sysOperation.product.version' })}：V1.2</span></div>
              <div className="version"><span>{this.props.intl.formatMessage({ id: 'sysOperation.hardware.version' })}：V1.2</span></div>
              <div className="version"><span>{this.props.intl.formatMessage({ id: 'sysOperation.software.version' })}：V1.2</span></div>
          </div>
        </div>
        {this.state.model == 'ssgw' && <div className="panel panel-default device-statics-info whitelist">
          <div className="panel-heading" role="presentation"
            onClick={() => { !collapse && this.collapseHandler('whiteListCollapse'); }}>
            <span className="icon_device_list"></span>{this.formatIntl('sysOperation.whiteList')}
            <span className="icon icon_collapse pull-right"></span>              
          </div>
          <div className={'panel-body domain-property ' + (whiteListCollapse ? 'collapsed' : '')}>
            <span className="domain-name">{selectDevice.whiteCount}{this.formatIntl('sysOperation.devices')}</span>
            <button id="sys-whitelist" className="btn btn-primary pull-right" onClick={()=> this.domainHandler('sys-whitelist') }
              disabled={ data.size == 0 }>{this.formatIntl('button.edit')}
            </button>
          </div>
        </div>}
      </SideBarInfo>
    </Content>;
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    sidebarNode: state.systemOperation.get("sidebarNode")
  };
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    treeViewInit,
    overlayerShow,
    overlayerHide,
    addNotify,
    removeAllNotify,
    sideBarToggled
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(SingleLampCon));