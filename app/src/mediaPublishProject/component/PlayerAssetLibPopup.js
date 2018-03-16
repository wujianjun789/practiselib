/**
 * Created by a on 2018/3/15.
 */
import React,{Component} from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

import Panel from '../../components/Panel';
import PanelFooter from '../../components/PanelFooter';

import RenderAssetLibTop from './RenderAssetLibTop';
import RenderAssetLib from './RenderAssetLib';

import Page from '../../components/Page';
import ConfirmPopup from '../../components/ConfirmPopup';

import {
  uploadMaterialFile, searchAssetList, getAssetListByTypeWithName, removeAssetById, previewPlayItem, projectPublish} from '../../api/mediaPublish';

import Immutable from 'immutable';
import {Name2Valid} from '../../util/index';
import {getObjectByKey} from '../../util/algorithm';

import systemFile from '../data/systemFile.json';
import systemInitFile from '../data/systemInitFile.json';
export class PlayerAssetLibPopup extends Component{
  constructor(props){
    super(props);
    this.state = {
      assetType: 'text',//素材类型(text,image,video)
      assetSort: Immutable.fromJS({
        list: [{ id: 1, type: 'text', value: this.formatIntl('mediaPublish.material.text') },
          { id: 2, type: 'image', value: this.formatIntl('mediaPublish.material.picture') }, { id: 3, type: 'video', value: this.formatIntl('mediaPublish.material.video') }],
        index: 0, value: this.formatIntl('mediaPublish.material.text'),
      }),
      assetSearch: Immutable.fromJS({ placeholder: this.formatIntl('sysOperation.input.asset'), value: '' }),
      assetList: Immutable.fromJS({
        list: [/*{ id: 1, name: '素材1', active: true, assetType: "system", type: "word" }, { id: 2, name: '素材2', assetType: "source", type: "video" },
         { id: 3, name: '素材3', assetType: "source", type: "picture" }, { id: 4, name: '素材4', assetType: "source", type: "video" }*/], id: 1, name: '素材1', isEdit: true,
      }),
      page: Immutable.fromJS({
        pageSize: 9,
        current: 1,
        total: 0,
      }),

      //拖拽
      mouseXY: [0, 0],
      mouseCircleDelta: [0, 0],
      lastPress: null,
      isPressed: false,
    }

    this.systemFile = [];
    this.systemInitFile = systemInitFile;

    this.onConfirm = this.onConfirm.bind(this);
    this.onCancel = this.onCancel.bind(this);

    this.assetSelect = this.assetSelect.bind(this);
    this.assetLibRemove = this.assetLibRemove.bind(this);
    this.assetAdd = this.assetAdd.bind(this);
  }

  componentWillMount(){
    this.mounted = true;
    this.systemFile = systemFile.map(file => {
      return Object.assign({}, file, { assetType: 'system' });
    });

    this.requestAssetList();
    this.requestSearchAssetList();
  }

  componentWillUnmount(){
    this.mounted = false;
  }

  formatIntl = (formatId) => {
    const { intl } = this.props;
    return intl ? intl.formatMessage({ id: formatId }) : "";
    // return formatId;
  }

  requestAssetList = () => {
    const { assetType } = this.props;
    const { assetSort, assetSearch } = this.state;
    const aType = assetType;
    const name = assetSearch.get('value');

      getAssetListByTypeWithName(aType, name, data => { this.mounted && this.updatePageTotal(assetType==="text"?this.systemFile.concat(data):data); });
  }

  requestSearchAssetList = () => {
    const { assetType } = this.props;
    const { assetSort, assetSearch, page } = this.state;
    const aType = assetType;
    const name = assetSearch.get('value');

    const current = page.get('current');
    const pageSize = page.get('pageSize');
    const limit = pageSize;
    const offset = (current - 1) * limit;
    searchAssetList(aType, name, offset, limit, data => { this.mounted && this.updateAssetList(data); });

  }

  updatePageTotal = (data) => {
    this.setState({ page: this.state.page.update('total', v => data.length) });
  }

  updateAssetList = (data) => {
    const { page } = this.state;
    const curPage = page.get('current');
    const newData = data.map(item => {
      return Object.assign({}, item, { assetType: 'source' });
    });
    this.setState({ assetList: this.state.assetList.update('list', v => Immutable.fromJS(this.props.assetType==="text"?this.systemFile.concat(newData):newData)) });
  }

  onConfirm() {
    const item = getObjectByKey(this.state.assetList.get("list"),"id", this.state.assetList.get("id"));
    if(!item){
      return false;
    }
    this.props.onConfirm && this.props.onConfirm(item.toJS());
  }

  onCancel() {
    this.props.onCancel();
  }

  onChange = (id, value) => {
    let prompt = false;
    if (id == 'assetType' || id == 'assetSort') {
      this.state[id] = this.state[id].update('index', v => value);
      this.setState({ [id]: this.state[id].update('value', v => this.state[id].getIn(['list', value, 'value'])) }, () => {
        this.requestAssetList();
        this.requestSearchAssetList();
      });
    } else if (id == 'assetSearch') {
      this.setState({ assetSearch: this.state.assetSearch.update('value', v => value) }, () => {
        this.requestAssetList();
        this.requestSearchAssetList();
      });
    } else {
      const val = value.target.value;
      if (!Name2Valid(val)) {
        prompt = true;
      }

      this.setState({
        property: Object.assign({}, this.state.property, { [id]: Object.assign({}, this.state.property[id], { value: val }) }),
        prompt: Object.assign({}, this.state.prompt, { [id]: prompt }),
      });
    }
  }

  searchSubmit = () => {
    this.requestAssetList();
    this.requestSearchAssetList();
  }

  assetList = (id) => {
    if (id == 'add') {

    } else if (id == 'edit') {
      this.setState({ assetList: this.state.assetList.update('isEdit', v => false) });
    } else if (id == 'remove') {
      const { actions } = this.props;
      actions.overlayerShow(<ConfirmPopup iconClass="icon_popup_delete" tips={this.formatIntl("mediaPublish.delete.material")}
                                          cancel={() => { actions.overlayerHide(); }} confirm={() => {

        }} />);
    } else if (id == 'complete') {
      this.setState({ assetList: this.state.assetList.update('isEdit', v => true) });
    }
  }

  assetSelect(item){
    this.state.assetList = this.state.assetList.update('id', v => item.get('id'));
    this.setState({ assetList: this.state.assetList.update('name', v => item.get('name')) });
  }

  assetLibRemove(item){
    const { actions } = this.props;
    // actions.overlayerShow(<ConfirmPopup iconClass="icon_popup_delete" tips={this.formatIntl('mediaPublish.delete.material')}
    //                                     cancel={() => { actions.overlayerHide(); }} confirm={() => {
        const itemId = item.get('id');
        const list = this.state.assetList.get('list');

        removeAssetById(itemId, data => {
          // actions.overlayerHide();
          this.requestAssetList();
          this.requestSearchAssetList();
        });
      // }} />);
  }

  assetAdd(){
    this.props.assetAdd();
  }

  pageChange = (current, pageSize) => {
    let page = this.state.page.set('current', current);
    this.setState({ page: page }, () => {
      this.requestSearchAssetList();
    });
  }

  render(){
    const {assetSort, assetSearch, assetList, page, lastPress, isPressed, mouseXY, } = this.state;
    const footer = <PanelFooter funcNames={['onCancel','onConfirm']} btnTitles={['button.cancel','button.confirm']}
                              btnClassName={['btn-default', 'btn-primary']}
                              btnDisabled={[false, false]} onCancel={this.onCancel} onConfirm={this.onConfirm}/>;
    return <Panel className="playerAsset-lib" title={this.props.title} closeBtn={true} footer={footer} closeClick={this.onCancel}>
      <RenderAssetLibTop assetSort={assetSort} assetSearch={assetSearch} assetListPro={assetList} showModalPro={this.state.showModal}
                         onChange={this.onChange} searchSubmit={this.searchSubmit} assetList={this.assetList} showModal={this.showModal} hideModal={this.hideModal} addUploadFile={this.addUploadFile} />
      <div className="bottom">
        <RenderAssetLib assetList={assetList} lastPress={lastPress} isPressed={isPressed} mouseXY={mouseXY} assetSelect={this.assetSelect}  assetLibRemove={this.assetLibRemove} assetAdd={this.assetAdd}/>
        <div className="page-container">
          <Page className={'page ' + (page.get('total') == 0 ? 'hidden' : '')} showSizeChanger
                pageSize={page.get('pageSize')}
                current={page.get('current')} total={page.get('total')}
                onChange={this.pageChange} />
        </div>
      </div>
    </Panel>
  }
}

export default injectIntl(PlayerAssetLibPopup);