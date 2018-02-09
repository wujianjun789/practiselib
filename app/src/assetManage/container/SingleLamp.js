/**
 * Created by a on 2017/8/23.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Content from '../../components/Content';

import { getModelData, getModelProps, getModelDefaultsValues, getModelDefaults, deleteModalTypes, addModalTypes }
  from '../../data/assetModels';
import { addModalTypesById } from '../../api/asset';
import Immutable from 'immutable';

import { injectIntl } from 'react-intl';
import { intlFormat } from '../../util/index';
import ConfirmPopup from '../../components/ConfirmPopup';
import TypeEditPopup from '../components/TypeEditPopup';
import { overlayerShow, overlayerHide } from '../../common/actions/overlayer';
import { getModelTypeByModel, updateModelTypeByModel } from '../../api/asset';

export class SingleLamp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // model:'lc',
      model: 'ssslc',
      keyField: 'name',   //主键在数据表的Id属性中，即设备类型的id
      // data:[   //关于设备的全部数据
      //   {id:'111', type:'三思LC', detail:'三思单灯控制器', unit: '0000', 
      //     accuracy: '0000', power: '0000', serviceLife: '0000', manufacturer: '0000'},
      //   {id:'123', type:'华为LC_NBLot', detail:'华为单灯控制器', unit: '0000', 
      //     accuracy: '0000', power: '0000', serviceLife: '0000', manufacturer: '0000'},
      // ],
      assetPropertyList: [   //设备属性列表
        { id: '111', neme: '三思LC', detail: '三思单灯控制器', unit: '0000', accuracy: '0000' },
        { id: '123', neme: '华为LC_NBLot', detail: '华为单灯控制器', unit: '0000', accuracy: '0000' },
      ],
      assetTypeList: [     //设备型号列表
        { name: '三思单灯', description: '三思单灯控制器', power: '0000', life: '0000', manufacture: '0000' },
        { name: '华为单灯', description: '华为单灯控制器', power: '0000', life: '0000', manufacture: '0000' },
        // { id: '', type: '', detail: '', power: '', serviceLife: '', manufacture: '' },
      ],
    };

    // this.columns = [//设备类别
    //   {field:'type', title:intlFormat({en:'type', zh:'型号'})}, 
    //   {field:'detail', title:intlFormat({en:'detail', zh:'描述'})},
    // ];
    this.assetPropertyColumns = [  //设备属性表头定义
      { field: 'neme', title: '名称' },
      { field: 'detail', title: '描述' },
      { field: 'unit', title: '单位' },
      { field: 'accuracy', title: '精度' },
    ];
    this.assetTypeColumns = [  //ssslc设备型号表头定义types, name, description, power, life, manufacture
      // { field: 'types', title: '型号' },
      { field: 'name', title: '名称' },
      { field: 'description', title: '描述' },
      { field: 'power', title: '功率' },
      { field: 'life', title: '使用寿命' },
      { field: 'manufacture', title: '厂商' },
    ];
    this.formatIntl = this.formatIntl.bind(this);
    this.rowDelete = this.rowDelete.bind(this);
    this.rowEdit = this.rowEdit.bind(this);
    this.rowAdd = this.rowAdd.bind(this);
    this.getModelType = this.getModelType.bind(this);
    this.updateModelType = this.updateModelType.bind(this);
  }

  componentWillMount() {
    let { model, assetPropertyList } = this.state;
    this.mounted = true;
    getModelData(() => {
      this.mounted && this.setState({ assetPropertyList: getModelProps(model) });
    });
    this.getModelType();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  formatIntl(formatId) {
    const { intl } = this.props;
    return intl ? intl.formatMessage({ id: formatId }) : null;
    // return formatId;
  }

  getModelType() {
    console.log('here')
    let { assetTypeList, model } = this.state;
    getModelTypeByModel(model, (data) => {
      console.log("data3333:", data[0].types)
      let types = data[0].types;
      this.mounted && this.updateModelType(types);
    });
  }

  updateModelType(data) {
    let dataItem = { name: '', description: '', power: '', life: '', manufacture: '' }
    data.push(dataItem);
    this.setState({ assetTypeList: data })
  }

  deleteModalTypeById(id) {
    const { assetTypeList, model } = this.state;
    let data = assetTypeList;
    let dataleft = _.remove(data, function (n) {
      return n.name === id;
    });
    data.pop();
    updateModelTypeByModel(model, data, (data) => {
      this.mounted && this.getModelType();
    })
  }

  rowDelete(id) { //id为型号名称
    const { data } = this.state;
    const { actions } = this.props;
    let curId = id; //当前要删除的型号的Id
    actions.overlayerShow(<ConfirmPopup iconClass="icon_popup_delete"
      tips={'是否删除选该行？'} cancel={() => { actions.overlayerHide(); }}
      confirm={() => {
        this.deleteModalTypeById(curId);
        actions.overlayerHide();
      }} />);
  }

  rowEdit(id) { //id为选中的设备型号的name，
    console.log('idEdit:', id);
    let curId = id;
    const { assetTypeList, keyField, model } = this.state;
    const { actions } = this.props;
    let data = {};
    for (var key in assetTypeList) {
      if (curId === assetTypeList[key].name) {
        data = assetTypeList[key];
      }
    }

    actions.overlayerShow(<TypeEditPopup id="updateType" title={'修改设备型号'}
      data={data}
      idEdit={false}
      onCancel={() => {
        actions.overlayerHide();
      }}
      onConfirm={(data) => {
        //data={type, power, serviceLife, manufacturer, detail,...others}
        //根据data中的参数更新设备型号，并将结果传入API实现数据的更改
        let name = data.name;
        let power = data.power;
        let description = data.description;
        let life = data.life;
        let manufacture = data.manufacture;
        let typeData = Object.assign({}, {
          name: name, power: power, description: description,
          life: life, manufacture: manufacture
        });
        console.log("typeData:", typeData)
        console.log("assetTypeList:", assetTypeList)
        //对更新后的数据做合并处理，名字是主键不能更改
        let list = assetTypeList;
        list.pop();
        console.log("list:", list)
        let editData = list.map(item => {
          return item.name === typeData.name ? typeData : item
        })
        console.log("editData:", editData)
        actions.overlayerHide();
        updateModelTypeByModel(model, editData, (data) => {
          this.mounted && this.getModelType();
        })
      }}></TypeEditPopup>);
  }

  rowAdd() { //添加设备状态，不传入Id，
    let curId = '';
    let { assetTypeList, model } = this.state;
    const { actions } = this.props;
    let data = {};
    data.name = '';
    data.description = '';
    data.power = '';
    data.life = '';
    data.manufacture = '';
    actions.overlayerShow(<TypeEditPopup id="updateType" title={'添加设备型号'}
      data={data}
      onCancel={() => {
        actions.overlayerHide();
      }}
      onConfirm={(data) => {
        //data={type, power, serviceLife, manufacturer, detail, ...others}
        //根据data中的参数更新设备型号，并将结果传入API实现数据的更改
        let name = data.name;
        let power = data.power;
        let life = data.life;
        let manufacture = data.manufacture;
        let description = data.description;
        let typeData = Object.assign({}, {
          name: name, power: power, life: life,
          manufacture: manufacture, description: description
        });
        assetTypeList.pop()
        let dataAdd = assetTypeList;
        dataAdd.push(typeData);
        actions.overlayerHide();
        updateModelTypeByModel(model, dataAdd, (data) => {
          this.mounted && this.getModelType();
        })
      }}></TypeEditPopup>);
  }



  render() {
    const { data, assetPropertyList, assetTypeList, keyField } = this.state;
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
          <div className="type"><span></span>{this.formatIntl('asset.assetTypes')}</div>
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
                          <span onClick={() => { this.rowEdit(row[keyField]); }} role="presentation"
                            className="icon_edit">修改</span>
                        </a>
                        <a className="btn" role="presentation">
                          <span onClick={() => { this.rowDelete(row[keyField]); }} role="presentation"
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