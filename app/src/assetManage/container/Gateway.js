/**
 * Created by m on 2018/2/9.
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
import { addNotify } from '../../common/actions/notifyPopup';
import NotifyPopup from '../../common/containers/NotifyPopup';

export class Gateway extends Component {
  constructor(props) {
    super(props);
    this.state = {
      model: 'ssgw',
      keyField: 'name',   //主键在数据表的Id属性中，即设备类型的id

      assetPropertyList: [   //设备属性列表
        // { id: '111', name: '三思LC', description: '三思单灯控制器', unit: '0000', accuracy: '0000' },
        // { id: '123', name: '华为LC_NBLot', description: '华为单灯控制器', unit: '0000', accuracy: '0000' },
      ],
      assetTypeList: [     //设备型号列表
        { name: '', description: '' }
        // { name: '华为单灯', description: '华为单灯控制器', power: '0000', life: '0000', manufacture: '0000' },
        // {name: '', detail: '', power: '', serviceLife: '', manufacture: '' },
      ],
    };


    this.assetTypeColumns = [  //ssslc设备型号表头定义types, name, description, power, life, manufacture
      { field: 'name', title: this.formatIntl('equipment.name')},
      { field: 'description', title: this.formatIntl('equipment.description') },
      { field: 'power', title: this.formatIntl('equipment.power') },
      { field: 'life', title: this.formatIntl('equipment.life') },
      { field: 'manufacture', title: this.formatIntl('equipment.manufacturer') },
    ];
    this.formatIntl = this.formatIntl.bind(this);
    this.rowDelete = this.rowDelete.bind(this);
    this.rowEdit = this.rowEdit.bind(this);
    this.rowAdd = this.rowAdd.bind(this);
    this.getModelType = this.getModelType.bind(this);
    this.updateModelType = this.updateModelType.bind(this);
  }

  componentDidMount() {
    let { model, assetPropertyList } = this.state;
    this.mounted = true;
    getModelData(() => {
      this.mounted && this.setState({ assetPropertyList: getModelProps(model) }, () => {
      });
    });
    this.getModelType();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  formatIntl(formatId) {
    const { intl } = this.props;
    return intl ? intl.formatMessage({ id: formatId }) : null;
  }

  getModelType() {
    let { assetTypeList, model } = this.state;
    getModelTypeByModel(model, (data) => {
      let types = data[0].types;
      this.mounted && this.updateModelType(types);
    });
  }

  updateModelType(data) {
    let dataItem = { name: '', description: '' }
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
      tips={this.formatIntl('equipment.isDeleteDevice')} cancel={() => { actions.overlayerHide(); }}
      confirm={() => {
        this.deleteModalTypeById(curId);
        actions.overlayerHide();
      }} />);
  }

  rowEdit(id) { //id为选中的设备型号的name，
    let curId = id;
    const { assetTypeList, keyField, model } = this.state;
    const { actions } = this.props;
    let data = {};
    for (var key in assetTypeList) {
      if (curId === assetTypeList[key].name) {
        data = assetTypeList[key];
      }
    }

    actions.overlayerShow(<TypeEditPopup id="updateType"  title={this.formatIntl('equipment.addDevice')}
      data={data}
      idEdit={false}
      hasPower={true}
      hasLife={true}
      hasManufacture={true}
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
        //对更新后的数据做合并处理，名字是主键不能更改
        let list = assetTypeList;
        list.pop();
        let editData = list.map(item => {
          return item.name === typeData.name ? typeData : item
        })
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
    actions.overlayerShow(<TypeEditPopup id="updateType" title={this.formatIntl('equipment.addDevice')}
      addNotify={actions.addNotify}
      data={data}
      hasPower={true}
      hasLife={true}
      hasManufacture={true}
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
          name: name, description: description
        });
        assetTypeList.pop()
        let dataAdd = assetTypeList;
        dataAdd.push(typeData);
        let resPram = ''
        updateModelTypeByModel(model, dataAdd, (data) => {
          this.mounted && this.getModelType();
          actions.overlayerHide();
        }, resPram, (msg) => {
          actions.addNotify(0, msg.message)
        })
      }}></TypeEditPopup>);
  }



  render() {
    const { data, assetPropertyList, assetTypeList, keyField } = this.state;
    let length = assetTypeList.length;
    return (
      <Content>
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
                {<th>{this.formatIntl('equipment.edit')}</th>}
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
                            className="icon_edit">{this.formatIntl('equipment.modify')}</span>
                        </a>
                        <a className="btn" role="presentation">
                          <span onClick={() => { this.rowDelete(row[keyField]); }} role="presentation"
                            className="icon_delete">{this.formatIntl('equipment.delete')}</span></a>
                      </td>
                      :
                      <td><span role="presentation" className="btn"
                        onClick={this.rowAdd}>+{this.formatIntl('equipment.add')}</span> </td>}
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
      addNotify: addNotify,
      overlayerShow: overlayerShow,
      overlayerHide: overlayerHide,
    }, dispatch),
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(Gateway));