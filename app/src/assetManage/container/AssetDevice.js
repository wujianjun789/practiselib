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
import { addNotify } from '../../common/actions/notifyPopup';
import NotifyPopup from '../../common/containers/NotifyPopup';
import gateway from '../../systemOperation/container/gateway';

import _ from 'lodash';
export class AssetDevice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      model: 'ssslc',
      keyField: 'name',   //主键在数据表的Id属性中，即设备类型的id
      assetTypeList: [     //设备型号列表
        { name: '', description: '', power: '', life: '', manufacture: '' },
        // { name: '华为单灯', description: '华为单灯控制器', power: '0000', life: '0000', manufacture: '0000' },
        // {name: '', detail: '', power: '', serviceLife: '', manufacture: '' },
      ],
    };

    this.assetTypeColumns = [  //ssslc设备型号表头定义types, name, description, power, life, manufacture
      { field: 'name', title: this.formatIntl('name')},
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

  componentWillMount() {
    const mode = this.props.params.asset;
    // switch(this.props.route.path){
    //     case "lc":
    //         mode='ssslc';
    //         break;
    //     case "gateway":
    //         mode='ssgw';
    //         break;
    //     default:
    //         mode = model;
    // }
    this.mounted = true;
    this.setState({model:mode},()=>{
        this.getModelType();
    })
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.params.asset !== this.props.params.asset){
      this.setState({model:nextProps.params.asset}, ()=>{
        this.getModelType();
      });
    }
  }

  componentDidUpdate(){
    // console.log('didUpdate:');
    // const{sidebarNode} = this.props;
    // if(this.props.sidebarNode!==null){
    //     if(this.state.model!==sidebarNode.id&&!sidebarNode.children){
    //         this.setState({model:sidebarNode.id}, ()=>{
    //             this.getModelType();
    //         });
    //     }
    // }
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
      tips={this.formatIntl('asset.isDeleteDevice')} cancel={() => { actions.overlayerHide(); }}
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

    actions.overlayerShow(<TypeEditPopup id="updateType" title={this.formatIntl('asset.modifyDevice')}
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
    actions.overlayerShow(<TypeEditPopup id="updateType" title={this.formatIntl('asset.addDevice')}
      addNotify={actions.addNotify}
      data={data}
      hasPower={true}
      hasLife={true}
      hasManufacture={true}
      onCancel={() => {
        actions.overlayerHide();
      }}
      onConfirm={(data) => {
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
                {<th></th>}
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
                            className="icon_edit">
                            <span className="text">{this.formatIntl('button.edit')}</span>
                          </span>
                        </a>
                        <a className="btn" role="presentation">
                          <span onClick={() => { this.rowDelete(row[keyField]); }} role="presentation"
                            className="icon_delete">
                            <span className="text">{this.formatIntl('button.delete')}</span>
                          </span>
                            </a>
                      </td>
                      :
                      <td><span role="presentation" className="btn"
                        onClick={this.rowAdd}><span className="icon_add">+</span>{this.formatIntl('button.add')}</span> </td>}
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
)(injectIntl(AssetDevice));