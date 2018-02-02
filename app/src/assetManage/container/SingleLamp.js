/**
 * Created by a on 2017/8/23.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import Content from '../../components/Content';

import {getModelData, getModelProps, getModelTypes, getModelDefaultsValues, getModelDefaults, deleteModalTypes, addModalTypes} 
  from '../../data/assetModels';
import {deleteModalTypesById, addModalTypesById} from '../../api/asset';
import Immutable from 'immutable';

import { injectIntl} from 'react-intl';
import { intlFormat } from '../../util/index';
import ConfirmPopup from '../../components/ConfirmPopup';
import TypeEditPopup from '../components/TypeEditPopup';
import { overlayerShow, overlayerHide } from '../../common/actions/overlayer';

export class SingleLamp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      model:'lc',
      keyField: 'id',   //主键在数据表的Id属性中，即设备类型的id
      // data:[   //关于设备的全部数据
      //   {id:'111', type:'三思LC', detail:'三思单灯控制器', unit: '0000', 
      //     accuracy: '0000', power: '0000', serviceLife: '0000', manufacturer: '0000'},
      //   {id:'123', type:'华为LC_NBLot', detail:'华为单灯控制器', unit: '0000', 
      //     accuracy: '0000', power: '0000', serviceLife: '0000', manufacturer: '0000'},
      // ],
      assetPropertyList:[   //设备属性列表
        {id:'111', type:'三思LC', detail:'三思单灯控制器',  unit: '0000', accuracy: '0000'},
        {id:'123', type:'华为LC_NBLot', detail:'华为单灯控制器',  unit: '0000', accuracy: '0000'},
      ], 
      assetTypeList: [     //设备型号列表
        {id:'111', type:'三思LC', detail:'三思单灯控制器',  power: '0000', serviceLife: '0000', manufacturer: '0000'},
        {id:'123', type:'华为LC_NBLot', detail:'华为单灯控制器',  power: '0000', serviceLife: '0000', manufacturer: '0000'},
        {id:'', type: '', detail: '', power: '', serviceLife: '', manufacturer: ''},
      ], 
    };

    // this.columns = [//设备类别
    //   {field:'type', title:intlFormat({en:'type', zh:'型号'})}, 
    //   {field:'detail', title:intlFormat({en:'detail', zh:'描述'})},
    // ];
    this.assetPropertyColumns = [  //设备属性表头定义
      {field:'type', title:'型号'}, 
      {field:'detail', title:'描述'}, 
      {field:'unit', title:'单位'}, 
      {field:'accuracy', title:'精度'}, 
    ];
    this.assetTypeColumns = [  //设备型号表头定义
      {field:'type', title:'型号'}, 
      {field:'detail', title:'描述'}, 
      {field:'power', title:'功率'}, 
      {field:'serviceLife', title:'使用寿命'}, 
      {field:'manufacturer', title:'厂商'}, 
    ];
    this.initTreeData = this.initTreeData.bind(this);
    this.formatIntl = this.formatIntl.bind(this);
    this.rowDelete = this.rowDelete.bind(this);
    this.rowEdit = this.rowEdit.bind(this);
    this.rowAdd = this.rowAdd.bind(this);
    this.updateAssetById = this.updateAssetById.bind(this);
    this.addAsset = this.addAsset.bind(this);
    this.deleteAssetById = this.deleteAssetById.bind(this);
  }

  componentWillMount() {
    this.mounted = true;
    getModelData(() => {this.mounted && this.initTreeData();});
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  formatIntl(formatId) {
    const {intl} = this.props;
    return intl ? intl.formatMessage({id:formatId}) : null;
    // return formatId;
  }

  initTreeData() {
    const {model} = this.state;
    this.setState({
      //获取某类设备的属性信息, 并更新到state
      //获取某类设备的型号信息, 并更新到state
    });
  }

  addAsset() {
    //将添加后的数据传给服务器，更新数据，并将操作成功后的数据重新setState，更新视图
  }

  updateAssetById() {
    //将编辑后的数据传给服务器，更新数据，并将操作成功后的数据重新setState，更新视图

  }
  deleteAssetById() {
    //将待删除的数据传给服务器，更新数据，并将操作成功后的数据重新setState，更新视图
  }
  

  rowDelete(id) {
    console.log('idDelete:', id);
    const { data } = this.state;
    const {actions} = this.props;
    let curId = id; //当前要删除的型号的Id
    actions.overlayerShow(<ConfirmPopup iconClass="icon_popup_delete"
      tips={'是否删除选该行？'} cancel={() => {actions.overlayerHide();}}
      confirm={() => {
        deleteModalTypesById(curId, () => {
          //执行是否删除的操作
          actions.overlayerHide();
        });
      } }/>);
  }

  rowEdit(id) { //id为选中的设备型号的Id，
    let curId = id;
    const {assetTypeList, keyField } = this.state;
    const {actions} = this.props;
    let data = {};
    for (var key in assetTypeList) {
      if (curId === assetTypeList[key].id) {
        data = assetTypeList[key];
      }
    }

    actions.overlayerShow(<TypeEditPopup id="updateType" title={'修改设备型号'}
      data={data}
      onCancel={() => {
        actions.overlayerHide();
      }}
      onConfirm={(data) => {
        //data={type, power, serviceLife, manufacturer, detail,...others}
        //根据data中的参数更新设备型号，并将结果传入API实现数据的更改
        let type = data.type;
        let power = data.power;
        let serviceLife = data.serviceLife;
        let manufacturer = data.manufacturer;
        let detail = data.detail;
        let typeData = Object.assign({}, {type:type, power:power, serviceLife:serviceLife,
          manufacturer:manufacturer, detail:detail });
        this.updateAssetById(curId, typeData);
        console.log('编辑设备型号，表单提交得到的数据::', typeData);
        actions.overlayerHide();
      }}></TypeEditPopup>);
  }

  rowAdd() { //添加设备状态，不传入Id，
    let curId = '';
    const {assetTypeList} = this.state;
    const {actions} = this.props;
    let data = {};
    data.type = '';
    data.power = '';
    data.serviceLife = '';
    data.manufacturer = '';
    data.detail = '';
    actions.overlayerShow(<TypeEditPopup id="updateType" title={'添加设备型号'}
      data={data}
      onCancel={() => {
        actions.overlayerHide();
      }}
      onConfirm={(data) => {
        //data={type, power, serviceLife, manufacturer, detail, ...others}
        //根据data中的参数更新设备型号，并将结果传入API实现数据的更改
        let type = data.type;
        let power = data.power;
        let serviceLife = data.serviceLife;
        let manufacturer = data.manufacturer;
        let detail = data.detail;
        let typeData = Object.assign({}, {type:type, power:power, serviceLife:serviceLife,
          manufacturer:manufacturer, detail:detail });
        this.addAsset(typeData);
        console.log('添加设备型号，表单提交得到的数据:', typeData);
        actions.overlayerHide();
      }}></TypeEditPopup>);
  }



  render() {
    const { data, assetPropertyList, assetTypeList, keyField } = this.state;
    // let length = assetTypeList.toJS().length;
    let length = assetTypeList.length;
    return (
      <Content>
        <div className="row heading">
          <div className="propertyTable"><span></span>{this.formatIntl('asset.property')}</div>
          <table className="equipment">
            <thead>
              <tr>
                {
                  this.assetPropertyColumns.map((column, index) => {
                    return <th key={index}>{column.title}</th>;
                  })
                }
              </tr>
            </thead>
            <tbody>
              {
                assetPropertyList.map((row, index) => {
                  return <tr key={index}>
                    {
                      this.assetPropertyColumns.map((column, index) => {
                        // return <td key={index}>{row.get(column.field)}</td>;
                        return <td key={index}>{row[column.field]}</td>;
                      })
                    }
                  </tr>;
                })
              }
            </tbody>
          </table>
        </div>
        <div className="row heading">
          <div className="type"><span></span>{this.formatIntl('asset.equipmentModal')}</div>
          <table className="equipment">
            <thead>
              <tr>
                {
                  this.assetTypeColumns.map((column, index) => {
                    return <th key={index}>{column.title}</th>;
                  })
                }
                {<th>编辑</th>}
              </tr>
            </thead>
            <tbody>
              {
                assetTypeList.map((row, index) => {
                  return <tr key={index}>
                    {
                      this.assetTypeColumns.map((column, index) => {
                        return <td key={index}>{row[column.field]}</td>;
                      })
                    }
                    {index !== length - 1 ? 
                      <td className="edit">
                        <a className="btn" role="presentation">
                          <span onClick={() => {this.rowEdit(row[keyField]);}} role="presentation" 
                            className="icon_edit">修改</span>
                        </a>
                        <a className="btn" role="presentation">
                          <span onClick={() => {this.rowDelete(row[keyField]);}} role="presentation" 
                            className="icon_delete">删除</span></a>
                      </td>
                      : 
                      <td><span role="presentation" className="btn" 
                        onClick={this.rowAdd}>+添加</span> </td>}
                  </tr>;
                })
              }
            </tbody>
          </table>
        </div>
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
      overlayerShow: overlayerShow,
      overlayerHide: overlayerHide,
    }, dispatch),
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(SingleLamp));