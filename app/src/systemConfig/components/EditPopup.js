import React, { Component } from 'react';
import Panel from '../../components/Panel.js';
import PanelFooter from '../../components/PanelFooter.js';
import Select from '../../components/Select.1.js';

import EditPopupComponet from './EditPopupComponent.js';

import { getSearchAssets, getAssetsBaseByModel } from '../../api/asset.js';
import { getPoleAssetById, getPoleList, requestPoleAssetById } from '../../api/pole.js';
import { sysDataHandle } from '../model/sysDataHandle.js';
import { sysInitStateModel } from '../model/sysInitStateModel.js';
import { intersection } from '../model/sysAlgorithm.js';
import NotifyPopup from '../../common/containers/NotifyPopup.js';


export default class EditPopup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: {
                placeholder: '输入设备名称',
                value: ''
            },
            selectDevice: {},
            selectValue: sysDataHandle.equipmentSelectList,
            equipmentSelectList: sysInitStateModel(),
            allEquipmentsData: [],
            allPoleEquipmentsData: []
        }
        this.searchTextOnChange = this.searchTextOnChange.bind(this);
        this.searchAssets = this.searchAssets.bind(this);
        this.equipmentSelect = this.equipmentSelect.bind(this);
        this.itemClick = this.itemClick.bind(this);
        this.deleteClick = this.deleteClick.bind(this);
    }

    componentWillMount() {
        let stateSelectDevice = this.props.selectDevice;
        this.setState({
            allEquipmentsData: this.props.allEquipmentsData,
            selectDevice: stateSelectDevice
        }, () => {
            const {selectDevice} = this.state;
            const id = selectDevice.data[0].id;
            getPoleAssetById(id, (id, response) => {
                this.initEditPopup(id, response);
            });
        });

    }

    initEditPopup(id, response) {
        let asset = response;
        let {equipmentSelectList} = this.state;
        /*  Redirect equipmentSelectList's initData.For some reason,there still exeits some logic mistake.
         *  options: options are displayed in <Select /> componets in EditPopup,such as ['灯','显示屏','传感器']
         *  value: value is the model that we need to search all the same assets
         */
        equipmentSelectList.options = sysDataHandle.equipmentSelectList.options;
        equipmentSelectList.value = equipmentSelectList.value.length === 0 ? equipmentSelectList.options[0].value : equipmentSelectList.value;
        this.searchAssetsByModel(equipmentSelectList);
        this.setState({
            allPoleEquipmentsData: asset
        });
    }

    searchTextOnChange(value) {
        this.setState({
            searchText: {
                value: value
            }
        })
    }

    /**
     * For some reasons, the getSearchAssets API must received all arguments.But in these situation,all most arguments are useless.
     * We searchAssets here by AssetsName -- from searchText that user has inputed.
     */
    searchAssets(domian) {
        let {equipmentSelectList} = this.state;
        let {index} = equipmentSelectList;
        let domain = domian ? domian : null;
        let cur = 1;
        let size = 10;
        let offset = 0;
        let model = equipmentSelectList.options[index].title;
        let name = this.state.searchText.value;
        getSearchAssets(domain, model, name, offset, size, data => {
            this.setState({
                allEquipmentsData: data
            })
        })
    }

    equipmentSelect(event) {
        let {mainSelect} = this.props;
        let {equipmentSelectList} = this.state;
        let newDataList = mainSelect(event, equipmentSelectList);
        this.searchAssetsByModel(newDataList);
        this.setState({
            equipmentSelectList: newDataList
        })
    }

    searchAssetsByModel(equipmentSelectList) {
        let {index, options} = equipmentSelectList;
        let assetModel = options[index].title;
        getAssetsBaseByModel(assetModel, data => {
            let newList = intersection(data, this.state.allPoleEquipmentsData);
            this.setState({
                allEquipmentsData: newList
            })
        })
    }

    /**These two functions were binded in list-item.provided adding or deleting operation.
     * There still has one question --- the assertModel still has no property to judge a asset whether hase been added or not.
     * So in state we set a property added to flaging.
     * But when we request again after we search from searchText, this status will be covered by baseData.
     * @param {*Click Item} item 
     */
    itemClick(item) {
        const {selectDevice} = this.state;
        let poleId = selectDevice.data[0].id;
        let assetId = item.id;
        let requestType = 'PUT';
        this.showMessage(1, '添加成功!');
        requestPoleAssetById(poleId, assetId, requestType, () => getPoleAssetById(poleId, (id, response) => {
            this.initEditPopup(id, response);
        }));
    }

    deleteClick(item) {
        const {selectDevice} = this.state;
        let poleId = selectDevice.data[0].id;
        let assetId = item.id;
        let requestType = 'DELETE';
        this.showMessage(1, '删除成功!');
        requestPoleAssetById(poleId, assetId, requestType, () => getPoleAssetById(poleId, (id, response) => {
            this.initEditPopup(id, response);
        }));
    }

    showMessage(statusCode, message) {
        this.props.showMessage(statusCode, message);
    }

    render() {
        const props = this.props;
        const {allPoleEquipmentsData, allEquipmentsData, selectValue} = this.state;
        return (
            <div id='sysConfigSmartLight-popup'>
              <Panel {...props} closeClick={ this.props.closeClick } closeBtn>
                <EditPopupComponet {...props} searchTextOnChange={ this.searchTextOnChange } search={ this.state.searchText } value={ this.state.searchText.value } searchAssets={ this.searchAssets } allEquipmentsData={ allEquipmentsData }
                  allPoleEquipmentsData={ allPoleEquipmentsData } onChange={ this.equipmentSelect } selectValue={ selectValue } equipmentSelectList={ this.state.equipmentSelectList } itemClick={ this.itemClick }
                  deleteClick={ this.deleteClick } />
                <NotifyPopup/>
              </Panel>
            </div>
        )
    }
}