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
        console.log('willmount', this.props);
        console.log(this.props.selectDevice);
        let stateSelectDevice = this.props.selectDevice;
        this.getPole(this.props.selectDevice);
        this.setState({
            allEquipmentsData: this.props.allEquipmentsData,
            selectDevice: stateSelectDevice
        }, () => {
            const {selectDevice} = this.state;
            const id = selectDevice.data[0].id;
            getPoleAssetById(id, (id, response) => {
                console.log(id, response);
                this.initEditPopup(id, response);
            });
        });

    }

    getPole(selectDevice) {}

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

    itemClick(item) {
        const {selectDevice} = this.state;
        let poleId = selectDevice.data[0].id;
        let assetId = item.id;
        let requestType = 'PUT';
        requestPoleAssetById(poleId, assetId, requestType);
    }

    deleteClick(item) {
        const {selectDevice} = this.state;
        let poleId = selectDevice.data[0].id;
        let assetId = item.id;
        let requestType = 'DELETE';
        requestPoleAssetById(poleId, assetId, requestType);
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
              </Panel>
            </div>
        )
    }
}