/**
 * Created by a on 2017/8/23.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Content from '../../components/Content';

import Select from '../../components/Select';
import SearchText from '../../components/SearchText';
import Table from '../../components/Table';
import Page from '../../components/Page';
import SideBarInfo from '../../components/SideBarInfo';

import Pie from '../../components/SensorParamsPie';

import { getModelData, getModelList, getModelNameById } from '../../data/assetModels';

import { getSearchCount, getSearchAssets } from '../../api/asset';
import { getDomainList } from '../../api/domain';
import { getChildDomainList } from '../../api/domain';
import { getDeviceTypeByModel } from '../../util/index';
import { getObjectByKey } from '../../util/algorithm';
import {FormattedMessage, injectIntl} from 'react-intl';
import { intlFormat } from '../../util/index';
import { trimString } from '../../util/string';

import Immutable from 'immutable';
export class SingleLamp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      model: 'ssgw',
      data: Immutable.fromJS([
        /*{id:1,domain:"闵行区", deviceName:"灯集中控制器", soft_v:"1.0", sys_v:"1.0", core_v:"1.0", har_v:"1.0",
                    vendor_info:"上海三思", con_type:485, latlng:{lng:121.49971691534425, lat:31.239658843127756}},
                {id:2, domain:"闵行区", deviceName:"灯集中控制器", soft_v:"1.0", sys_v:"1.0", core_v:"1.0", har_v:"1.0",
                    vendor_info:"上海三思", con_type:485, latlng:{lng:121.49971691534425, lat:31.239658843127756}}*/
      ]),
      domain: Immutable.fromJS({ list: [/*{id:1, value:'域'},{id:2, value:'域2'}*/], index: 0, value: '域' }),
      // device:Immutable.fromJS({list:[{id:1, value:'灯集中控制器'},{id:2, value:'集中控制'}], index:0, value:'灯集中控制器'}),
      search: Immutable.fromJS({ placeholder: this.formatIntl('asset.statistics.input'), value: '' }),
      // search: Immutable.fromJS({ placeholder: '输入素材名称', value: '' }),
      collapse: false,
      deviceCollapse: false,
      page: Immutable.fromJS({
        pageSize: 15,
        current: 1,
        total: 0,
      }),
      deviceInfo: {
        total: 0,
        normal: 0,
      },
      selectDevice: {
        id: 'assetStatistics',
        latlng: {/*lng:121.49971691534425, lat:31.239658843127756*/ },
        position: [/*{
                    "device_id":1,
                    "device_type":'DEVICE',
                    lng:121.49971691534425,
                    lat:31.239658843127756
                }*/],
        data: [/*{
                    id:1,
                    name:'example'
                }*/],
      },
    };


    this.columns = [
      { field: 'id', title: this.formatIntl('id') },
      { field: 'name', title: this.formatIntl('name') },
      { field: 'product', title: this.formatIntl('asset.statistics.product') },
      { field: 'software', title: this.formatIntl('asset.statistics.software') },
      { field: 'hardware', title: this.formatIntl('asset.statistics.hardware') },
      { field: 'type',  title: this.formatIntl('asset.statistics.type') },
    ];

    this.collapseHandler = this.collapseHandler.bind(this);
    this.tableClick = this.tableClick.bind(this);
    this.onChange = this.onChange.bind(this);
    this.domainChange = this.domainChange.bind(this);
    this.deviceChange = this.deviceChange.bind(this);
    this.searchChange = this.searchChange.bind(this);
    this.searchSubmit = this.searchSubmit.bind(this);
    this.initTreeData = this.initTreeData.bind(this);
    this.initDomain = this.initDomain.bind(this);
    this.initAssetList = this.initAssetList.bind(this);
    this.deviceTotal = this.deviceTotal.bind(this);
    this.requestSearch = this.requestSearch.bind(this);
    this.initPageTotal = this.initPageTotal.bind(this);
    this.formatIntl = this.formatIntl.bind(this);
  }

  componentWillMount() {
    this.mounted = true;
    this.setState({model: this.props.params.asset}, ()=>{
      this.requestSearch();
    })
    getModelData(() => { this.mounted && this.initTreeData(); });
    getChildDomainList(data => { this.mounted && this.initDomain(data); });
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.params.asset !== this.props.params.asset){
      this.setState({model: nextProps.params.asset}, ()=>{
        this.requestSearch();
      })
    }
  }
  // componentDidUpdate(){
  //   const{sidebarNode} = this.props;
  //   if(this.props.sidebarNode!==null){
  //       if(this.state.model!==sidebarNode.id&&!sidebarNode.children){
  //           this.setState({model:sidebarNode.id}, ()=>{
  //               this.requestSearch()
  //           });
  //       }
  //   }
  // }

  componentWillUnmount() {
    this.mounted = false;
  }

  formatIntl(formatId) {
    const { intl } = this.props;
    return intl ? intl.formatMessage({ id: formatId }) : null;
  }

  requestSearch() {
    const { model, domain, search, page } = this.state;
    let cur = page.get('current');
    let size = page.get('pageSize');
    let offset = (cur - 1) * size;
    let domainId = domain.getIn(['list', domain.get('index'), 'id']);
    let modelId = model;
    let name = search.get('value');
    // name =name.replace(/^\s+|\s+$/g,"");//过滤字符两边空格
    name=trimString(name);
    getSearchCount(domainId, modelId, name, (data) => this.mounted && this.initPageTotal(data));
    getSearchAssets(domainId, modelId, name, offset, size,
       data => this.mounted && this.initAssetList(data));
  }

  initTreeData() {
    let modelList = getModelList();
    let list = modelList.map(model => {
      return Object.assign({}, model, { value: model.name });
    });
    this.requestSearch();
  }

  initDomain(data) {
    if (data) {
      let list = data.map(domain => {
        return Object.assign({}, domain, { value: domain.name });
      });
      this.setState({ domain: Immutable.fromJS({ list: list, index: 0, value: data.length > 0 ? data[0] : '' }) });
    }
    this.requestSearch();
  }

  initPageTotal(data) {
    let page = this.state.page.set('total', data.count);
    this.setState({ page: page, deviceInfo: { total: data.count } });
  }

  initAssetList(data) {
    let list = data.map(item => {
      let curDomain = getObjectByKey(this.state.domain.get('list'), 'id', item.domainId);
      return Object.assign({}, { domain: curDomain ? curDomain.get('name') : '' },
        { typeName: getModelNameById(item.extendType) }, item, item.extend, item.geoPoint);
    });
    this.setState({ data: Immutable.fromJS(list) }, () => {
        let item = this.state.data.get(0);
        this.tableClick(item);
    });
    // if (list.length) {
    //   let item = list[0];
    //   this.tableClick(Immutable.fromJS(item));
    // } else {
    //   this.setState({ selectDevice: Object.assign({}, this.state.selectDevice, { data: [] }) });
    // }

  }

  deviceTotal(data) {
    this.setState({ deviceInfo: { total: data.count, normal: data.count == 0 ? 0 : data.count - 1 } });
  }

  searchSubmit() {
    this.requestSearch();
  }

  domainChange(selectIndex) {
    this.state.domain = this.state.domain.update('index', v => selectIndex);
    this.setState({
      domain: this.state.domain.update('value', v => {
        return this.state.domain.getIn(['list', selectIndex, 'value']);
      })
    }, () => { this.requestSearch(); });
  }

  deviceChange(selectIndex) {
    this.setState({ device: this.state.device.update('index', v => selectIndex) });
    this.setState({
      device: this.state.device.update('value', v => {
        return this.state.device.getIn(['list', selectIndex, 'value']);
      })
    });
  }

  searchChange(value) {
    this.setState({ search: this.state.search.update('value', v => value) });
  }

  onChange(current, pageSize) {
    let page = this.state.page.set('current', current);
    this.setState({ page: page }, () => {
      this.requestSearch();
    });
  }

  tableClick(data) {
    if(!data){//当table列表是空行时候要对device重置
      this.setState({
        selectDevice: Object.assign({}, this.state.selectDevice, {
          latlng: {},
          position: [{
            'device_id': '', 'device_type': '',
            lng: '', lat:''
          }],
          data: [],
        })
      })
    } else {
      const latlng = data.get('geoPoint')?data.get('geoPoint').toJS():'';
      this.setState({
        selectDevice: Object.assign({}, this.state.selectDevice, {
          latlng: latlng,
          position: [{
            'device_id': data.get('id'), 'device_type': getDeviceTypeByModel(data.get('extendType')),
            lng: latlng.lng, lat: latlng.lat
          }],
          data: [{ id: data.get('id'), name: data.get('name') }],
        })
      });
    }
  }

  collapseHandler(id) {
    this.setState({
      [id]: !this.state[id],
    });
  }

  render() {
    const { data, domain, search, collapse, page, deviceInfo, selectDevice, deviceCollapse } = this.state;
    const { total = 0, normal = 0 } = deviceInfo;
    let width = 145;
    let height = 145;
    return (
      <Content className={'offset-right ' + (collapse ? 'collapsed' : '')}>
        <div className="heading">
          <Select className="domain" data={domain}
            onChange={(selectIndex) => this.domainChange(selectIndex)} />
          <SearchText className="search" placeholder={search.get('placeholder')} value={search.get('value')}
            onChange={value => this.searchChange(value)} submit={() => this.searchSubmit()} />
        </div>
        <div className="table-container">
          <Table columns={this.columns} data={data}
            activeId={selectDevice.data.length ? selectDevice.data[0].id : ''}
            rowClick={(row) => this.tableClick(row)} />
          <Page className={'page ' + (page.get('total') == 0 ? 'hidden' : '')}
            showSizeChanger pageSize={page.get('pageSize')}
            current={page.get('current')} total={page.get('total')} onChange={this.onChange} />
        </div>

        <SideBarInfo mapDevice={selectDevice} collapseHandler={this.collapseHandler} className={(deviceCollapse ? 'deviceCollapse ' : '')}>
          <div className="panel panel-default device-statics-info">
            <div className="panel-heading" role="presentation"
              onClick={() => { !collapse && this.collapseHandler('deviceCollapse'); }}>
              <span className="icon_chart"></span>{this.formatIntl('asset.statistics')}
              <span className="icon icon_collapse statistics pull-right"></span>
            </div>
            <div className="panel-body view">
              <div className="circle1">
                <Pie data={{ type: 'NOISE', val: total }} width={width} height={height} color="#E6BC00"
                  className="noise" range={[0, total]}></Pie>
              </div>
              <div className="circle2">
                <Pie data={{ type: 'TEMPS', val: normal, unit: '%' }} width={width} height={height} color="#E6BC00"
                  className="temps" range={[0, total]}></Pie>
              </div>
            </div>
          </div>
        </SideBarInfo>
      </Content>
    );
  }
}


function mapStateToProps(state) {
  return {
    sidebarNode: state.assetManage.get('sidebarNode'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
    }, dispatch),
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(SingleLamp));