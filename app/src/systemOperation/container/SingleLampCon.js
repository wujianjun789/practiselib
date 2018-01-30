import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import SearchText from '../../components/SearchText';
import Table from '../../components/Table';
import Page from '../../components/Page';
import SideBarInfo from '../../components/SideBarInfo';
import Select from '../../components/Select.1';
import WhiteListPopup from '../components/WhiteListPopup';
import CentralizedControllerPopup from '../components/CentralizedControllerPopup';
import ConfirmPopup from '../../components/ConfirmPopup';
import Immutable from 'immutable';
import {overlayerShow, overlayerHide} from '../../common/actions/overlayer';

import Content from '../../components/Content';

import {TreeData, getModelData, getModelTypesById, getModelTypesNameById} from '../../data/systemModel';

import {getChildDomainList} from '../../api/domain';
import {getSearchAssets, getSearchCount, postAssetsByModel, updateAssetsByModel, delAssetsByModel} 
  from '../../api/asset';

import {getObjectByKey, getDeviceTypeByModel} from '../../util/index';

import {treeViewInit} from '../../common/actions/treeView';
import ExcelPopup from '../components/ExcelPopup';
import {addNotify} from '../../common/actions/notifyPopup';
import {bacthImport} from '../../api/import';
import {injectIntl} from 'react-intl';

export class SingleLampCon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      model: 'lc',
      collapse: false,
      deviceCollapse:false,
      page: Immutable.fromJS({
        pageSize: 10,
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
          {id: 1, title: 'domain01', value: 'domain01'},
          {id: 2, title: 'domain02', value: 'domain02'},
          {id: 3, title: 'domain03', value: 'domain03'},
          {id: 4, title: 'domain04', value: 'domain04'},
          {id: 5, title: 'domain05', value: 'domain05'},
          {id: 6, title: 'domain06', value: 'domain06'},
          {id: 7, title: 'domain07', value: 'domain07'},
        ],
      },
      modelList: {
        titleField: 'title',
        valueField: 'value',
        options: [
          {id: 1, title: 'model01', value: 'model01'},
          {id: 2, title: 'model02', value: 'model02'},
          {id: 3, title: 'model03', value: 'model03'},
          {id: 4, title: 'model04', value: 'model04'},
          {id: 5, title: 'model05', value: 'model05'},
          {id: 6, title: 'model06', value: 'model06'},
          {id: 7, title: 'model07', value: 'model07'},
        ],
      },
      data: Immutable.fromJS([/*{
             id: 0,
             name: '设备1',
             model: 'model01',
             domain: 'domain01',
             lng: 121.49971691534425,
             lat: 31.239658843127756
             }*/]),
    };

    this.columns = [
      {
        id: 0,
        field: 'domainName',
        title: this.props.intl.formatMessage({id:'sysOperation.domain'}),
      },
      {
        id: 1,
        field: 'name',
        title: this.props.intl.formatMessage({id:'name'}),
      },
      {
        id: 2,
        field: 'typeName',
        title: this.props.intl.formatMessage({id:'sysOperation.type'}),
      },
      {
        id: 3,
        field: 'id',
        title: this.props.intl.formatMessage({id:'sysOperation.id'}),
      },
      {
        id: 5,
        field: 'lng',
        title: this.props.intl.formatMessage({id:'map.lng'}),
      },
      {
        id: 6,
        field: 'lat',
        title: this.props.intl.formatMessage({id:'map.lat'}),
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
    let {model} = this.state;
    getModelData(model, () => {
      if (this.mounted) {
        this.props.actions.treeViewInit(TreeData);
        this.setState({
          model: model,
          modelList: Object.assign({}, this.state.modelList, {options: getModelTypesById(model).map((type) => {
            return  {id: type.id, title: type.title, value: type.title};
          })}),
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
    const {model, domainList, search, page} = this.state;
    let domain = domainList.options.length ? domainList.options[domainList.index] : null;
    let name = search.get('value');
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
    this.setState({page: page});
  }

  initDomainList(data) {
    let domainList = Object.assign({}, this.state.domainList, {index: 0},
      {value: data.length ? data[0].name : ''}, {options: data});
    this.setState({domainList: domainList});
    this.requestSearch();
  }

  initAssetList(data) {
    let list = data.map((asset, index) => {
      let domainName = '';
      if (this.state.domainList.options.length && asset.domainId) {
        let domain = getObjectByKey(this.state.domainList.options, 'id', asset.domainId);
        domainName = domain ? domain.name : '';
      }
      return Object.assign({}, asset, asset.extend, asset.geoPoint, {domainName: domainName},
        {typeName:getModelTypesNameById(this.state.model, asset.extend.type)});
    });

    this.setState({data: Immutable.fromJS(list)});
    if (list.length) {
      let item = list[0];
      this.updateSelectDevice(item);
    } else {
      this.setState( { selectDevice: Object.assign( {}, this.state.selectDevice, {data: [] } ) } );
    }
  }

  popupCancel() {
    this.props.actions.overlayerHide();
  }

  popupConfirm() {
    const {model, selectDevice} = this.state;
    delAssetsByModel(model, selectDevice.data.length && selectDevice.data[0].id, () => {
      this.requestSearch();
      this.props.actions.overlayerHide();
    });

  }

  domainHandler(e) {
    let id = e.target.id;
    const {model, selectDevice, domainList, modelList} = this.state;
    const {overlayerShow, overlayerHide} = this.props.actions;
    let curType = modelList.options.length ? modelList.options[0] : null;
    switch (id) {
    case 'sys-add': {
      const curDomain = domainList.index < domainList.options.length ? domainList.options[domainList.index] : null;
      const addLatlng = curDomain ? curDomain.geoPoint : null;
      const dataInit = {
        id: '',
        name: '',
        model: curType ? curType.title : '',
        modelId: curType ? curType.id : '',
        domain: domainList.value,
        domainId: curDomain ? curDomain.id : '',
        lng: addLatlng ? addLatlng.lng : '',
        lat: addLatlng ? addLatlng.lat : '',
      };

      overlayerShow(<CentralizedControllerPopup popId="add" className="centralized-popup" 
        title={this.props.intl.formatMessage({id:'sysOperation.addDevice'})} model={this.state.model}
        data={dataInit} domainList={domainList} modelList={modelList}
        overlayerHide={overlayerHide} onConfirm={(data) => {
          postAssetsByModel(model, data, () => {
            this.requestSearch();
          });
        }}/>);
      break;}
    case 'sys-update': {
      let latlng = selectDevice.position.length ? selectDevice.position[0] : {lat:'', lng:''};
      let data = selectDevice.data.length ? selectDevice.data[0] : null;
      const dataInit2 = {
        id: data ? data.id : null,
        name: data ? data.name : null,
        model: data ? getModelTypesNameById(model, data.type) : '',
        modelId: data ? data.type : null,
        domain: selectDevice.domainName,
        domainId: selectDevice.domainId,
        lng: latlng.lng,
        lat: latlng.lat,
      };
      overlayerShow(<CentralizedControllerPopup popId="edit" className="centralized-popup" 
        title={this.props.intl.formatMessage({id:'sysOperation.lamp.control'})}
        data={dataInit2} domainList={domainList} modelList={modelList}
        overlayerHide={overlayerHide} onConfirm={data => {
          updateAssetsByModel(model, data, (data) => {
            this.requestSearch();
            overlayerHide();
          });
        }}/>);
      break;}
    case 'sys-delete':
      overlayerShow(<ConfirmPopup tips={this.props.intl.formatMessage({id:'delete.device'})}
        iconClass="icon_popup_delete" cancel={ this.popupCancel }
        confirm={ this.popupConfirm }/>);
      break;
    default:
      break;
    }
  }

  pageChange(current, pageSize) {
    let page = this.state.page.set('current', current);
    this.setState({page: page}, () => {
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
    selectDevice.data.push({id:item.id, type:item.extend.type, name:item.name});
    selectDevice.domainId = item.domainId;
    selectDevice.domainName = item.domainName;
    selectDevice.position.splice(0);
    selectDevice.position.push(Object.assign({}, {'device_id': item.id, 'device_type': 
    getDeviceTypeByModel(item.extendType)}, item.geoPoint));
    this.setState({selectDevice: selectDevice});
  }

  searchSubmit() {
    let page = this.state.page.set('current', 1);
    this.setState({page:page}, () => {
      this.requestSearch();
    });    
  }

  searchChange(value) {
    this.setState({search: this.state.search.update('value', () => value)});
  }

  collapseHandler(id) {
    this.setState({[id]: !this.state[id]});
  }


  domainSelect(event) {
    // this.props.actions.domainSelectChange(index);
    let index = event.target.selectedIndex;
    let {domainList} = this.state;
    domainList.index = index;
    domainList.value = domainList.options[index].name;
    this.setState({domainList: domainList}, () => {
      this.requestSearch();
    });
  }

  importHandler() {
    const {overlayerShow, overlayerHide, addNotify} = this.props.actions;
        
    overlayerShow(<ExcelPopup className="import-popup" columns={this.columns} model={this.state.model}
      domainList={this.state.domainList} addNotify={addNotify} overlayerHide={overlayerHide} 
      onConfirm={ (datas, isUpdate) => {
        bacthImport(`${this.state.model}s`, datas, isUpdate, () => {
          this.requestSearch();
        });
      } } />);
  }

  render() {
    const {collapse, deviceCollapse, page, search, selectDevice, domainList, data} = this.state;
    return <Content className={'offset-right ' + (collapse ? 'collapsed' : '')}>
      <div className="heading">
        <Select id="domain" titleField={domainList.valueField} valueField={domainList.valueField}
          options={domainList.options} value={domainList.value} onChange={this.domainSelect}/>
        <SearchText placeholder={this.props.intl.formatMessage({id:search.get('placeholder')})}
          value={search.get('value')} onChange={this.searchChange} submit={this.searchSubmit}/>
        <button id="sys-add" className="btn btn-primary add-domain" onClick={this.domainHandler}>
          {this.props.intl.formatMessage({id:'button.add'})}</button>
        <button id="sys-import" className="btn btn-gray" onClick={ this.importHandler }>
          {this.props.intl.formatMessage({id:'button.import'})}</button>
      </div>
      <div className="table-container">
        <Table columns={this.columns} data={data} activeId={selectDevice.data.length && selectDevice.data[0].id}
          rowClick={this.tableClick}/>
        <Page className={'page ' + (page.get('total') == 0 ? 'hidden' : '')} pageSize={page.get('pageSize')}
          current={page.get('current')} total={page.get('total')}  onChange={this.pageChange}/>
      </div>
      <SideBarInfo mapDevice={selectDevice} collapseHandler={this.collapseHandler} 
        className={(deviceCollapse ? 'deviceCollapse ' : '')}>
        <div className="panel panel-default device-statics-info">
          <div className="panel-heading" role="presentation"
            onClick={() => { !collapse && this.collapseHandler('deviceCollapse'); }}>
            <span className="icon_select"></span>{this.props.intl.formatMessage({id:'sysOperation.selected.device'})}
            <span className="icon icon_collapse pull-right"></span>              
          </div>
          <div className={'panel-body domain-property ' + (deviceCollapse ? 'collapsed' : '')}>
            <span className="domain-name" title={selectDevice.data.length ? selectDevice.data[0].name : ''}>
              {selectDevice.data.length ? selectDevice.data[0].name : ''}</span>
            <button id="sys-update" className="btn btn-primary pull-right" onClick={this.domainHandler} 
              disabled={data.size == 0}>{this.props.intl.formatMessage({id:'button.edit'})}
            </button>
            <button id="sys-delete" className="btn btn-danger pull-right" onClick={this.domainHandler} 
              disabled={data.size == 0}>{this.props.intl.formatMessage({id:'button.delete'})}
            </button>
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
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(SingleLampCon));