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

import systemFile from '../data/systemFile.json';
import systemInitFile from '../data/systemInitFile.json';
export class PlayerAssetLibPopup extends Component{
  constructor(props){
    super(props);
    this.state = {
      assetType:0,
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
        pageSize: 10,
        current: 1,
        total: 2,
      }),

      //拖拽
      mouseXY: [0, 0],
      mouseCircleDelta: [0, 0],
      lastPress: null,
      isPressed: false,

      //上传文件模块字段
      showModal: false,
      showUploadNotify: false,
      showUploadFile: false,
      uploadFileList: [],
      usefulListLength: 0,
      currentXhr: null,
      isUpload: false,
      afterFirstUpload: false,
    }

    this.systemFile = [];
    this.systemInitFile = systemInitFile;

    this.onConfirm = this.onConfirm.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  componentWillMount(){
    this.systemFile = systemFile.map(file => {
      return Object.assign({}, file, { assetType: 'system' });
    });

    this.requestAssetList();
    this.requestSearchAssetList();
  }

  formatIntl = (formatId) => {
    const { intl } = this.props;
    return intl ? intl.formatMessage({ id: formatId }) : "";
    // return formatId;
  }

  requestAssetList = () => {
    const { assetType, assetSort, assetSearch } = this.state;
    const type = assetType;
    const aType = assetSort.getIn(['list', assetSort.get('index'), 'type']);
    const name = assetSearch.get('value');
    if (type === 0) {
      this.updatePageTotal(this.systemFile);
    } else {
      getAssetListByTypeWithName(aType, name, data => { this.mounted && this.updatePageTotal(data); });
    }
  }

  requestSearchAssetList = () => {
    const { assetType, assetSort, assetSearch, page } = this.state;
    const type = assetType;
    const aType = assetSort.getIn(['list', assetSort.get('index'), 'type']);
    const name = assetSearch.get('value');
    if (type === 0) {
      this.setState({ assetList: this.state.assetList.update('list', v => Immutable.fromJS(this.systemFile)) });
    } else {

      const current = page.get('current');
      const pageSize = page.get('pageSize');
      const limit = pageSize;
      const offset = (current - 1) * limit;
      searchAssetList(aType, name, offset, limit, data => { this.mounted && this.updateAssetList(data); });
    }
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
    this.setState({ assetList: this.state.assetList.update('list', v => Immutable.fromJS(newData)) });
  }

  onConfirm() {
    this.props.onConfirm && this.props.onConfirm(this.state);
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

  showModal = () => {
    this.setState({ showModal: true });
  }
  hideModal = () => {
    this.setState({ showModal: false });
  }
  showUploadNotify = () => {
    this.setState({ showUploadNotify: true });
  }
  hideUploadNotify = () => {
    this.setState({ showUploadNotify: false });
  }
  showUploadFile = () => {
    this.setState({ showUploadFile: true });
  }
  hideUploadFile = () => {
    this.setState({ showUploadFile: false });
  }
  uploadProgress = (e) => {
    if (e.lengthComputable) {
      const progress = Math.round((e.loaded / e.total) * 100);
      const list = this.state.uploadFileList, key = e.target.key;
      list[key].progress = progress + '%';
      this.setState({ uploadFileList: list });
    }
  }
  uploadComplete = (e) => {
    const { key, status } = e.target;
    const list = this.state.uploadFileList;
    if (status === 200) {
      list[key].progress = this.formatIntl('mediaPublish.completed');
      this.requestAssetList();
      this.requestSearchAssetList();
    } else {
      list[key].progress = this.formatIntl('mediaPublish.failed');
    }
    this.setState({ uploadFileList: list });
    const nextKey = key + 1;
    for (let i = nextKey; i < list.length; i++) {
      if (list[i] !== undefined && (list[i].progress === '待上传' || list[i].progress === 'Waiting')) {
        const currentXhr = list[i].xhr;
        uploadMaterialFile(list, i);
        this.setState({ currentXhr });
        return;
      }
    }
    this.setState({ isUpload: false, currentXhr: null });//无待上传文件时
  }
  uploadFailed = (e) => {
    const { key } = e.target;
    const list = this.state.uploadFileList;
    list[key].progress = this.formatIntl('mediaPublish.failed');
    this.setState({ uploadFileList: list });
    const nextKey = key + 1;
    for (let i = nextKey; i < list.length; i++) {
      if (list[i] !== undefined && (list[i].progress === '待上传' || list[i].progress === 'Waiting')) {
        const currentXhr = list[i].xhr;
        uploadMaterialFile(list, i);
        this.setState({ currentXhr });
        return;
      }
    }
    this.setState({ isUpload: false, currentXhr: null });//无待上传文件时
  }
  uploadCanceled = (e) => {
    console.log('取消上传');
  }
  createUploadXHR = (file, cb) => {
    const { name, key, type } = file;
    const form = new FormData();
    form.append('file', file.data);
    form.append('name', name);
    form.append('type', type);
    const xhr = new XMLHttpRequest();
    xhr.key = key, xhr.upload.key = key;
    xhr.upload.addEventListener('progress', this.uploadProgress);
    xhr.addEventListener('load', this.uploadComplete);
    xhr.addEventListener('error', this.uploadFailed);
    xhr.addEventListener('abort', this.uploadCanceled);
    const { uploadFileList, usefulListLength } = this.state;
    uploadFileList.push({ name: file.name, progress: file.progress, xhr: xhr, form: form });
    this.setState({ uploadFileList, usefulListLength: usefulListLength + 1 }, cb);
  }
  addUploadFile = (file) => {
    this.createUploadXHR(file, () => {
      this.showUploadNotify();
      const { uploadFileList, afterFirstUpload, isUpload } = this.state;
      //第一次上传文件
      if (!afterFirstUpload) {
        const currentXhr = uploadFileList[0].xhr;
        uploadMaterialFile(uploadFileList, 0);
        this.setState({ currentXhr, afterFirstUpload: true, isUpload: true });
        return;
      }
      if (isUpload) {
        return;
      }
      //已上传过文件，所有已完成，下次继续上传触发最新的文件
      const currentXhr = uploadFileList[uploadFileList.length - 1].xhr;
      uploadMaterialFile(uploadFileList, uploadFileList.length - 1);
      this.setState({ currentXhr, isUpload: true });
    });
  }
  cancelXhr = (xhr) => {
    xhr.abort();
    xhr.upload.removeEventListener('progress', this.uploadProgress);
    xhr.removeEventListener('load', this.uploadComplete);
    xhr.removeEventListener('error', this.uploadFailed);
    xhr.removeEventListener('abort', this.uploadCanceled);
  }
  cancelCurrentXhr = (list, index, usefulListLength) => {
    const nextKey = index + 1;
    //后面还有待上传文件时
    for (let i = nextKey; i < list.length; i++) {
      if (list[i] !== undefined && (list[i].progress === '待上传' || list[i].progress === 'Waiting')) {
        const currentXhr = list[i].xhr;
        uploadMaterialFile(list, i);
        this.setState({
          uploadFileList: list,
          usefulListLength,
          currentXhr,
        }, () => {
          if (this.state.usefulListLength === 0) {
            this.hideUploadNotify();
          }
        });
        return;
      }
    }
    //没有待上传文件时
    this.setState({
      uploadFileList: list,
      usefulListLength,
      currentXhr: null,
      isUpload: false,
    }, () => {
      if (this.state.usefulListLength === 0) {
        this.hideUploadNotify();
      }
    });
  }
  cancelUploadFile = (index) => {
    const list = this.state.uploadFileList, xhr = list[index].xhr;
    this.cancelXhr(xhr);
    list[index] = undefined;
    const usefulListLength = this.state.usefulListLength - 1;
    if (xhr === this.state.currentXhr) {
      //取消当前正在上传的文件
      this.cancelCurrentXhr(list, index, usefulListLength);
      return;
    }
    //取消已上传或未上传的文件
    this.setState({
      uploadFileList: list,
      usefulListLength,
    }, () => {
      if (this.state.usefulListLength === 0) {
        this.hideUploadNotify();
      }
    });
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

  assetSelect(){

  }

  assetLibRemove(){

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
        <RenderAssetLib assetList={assetList} lastPress={lastPress} isPressed={isPressed} mouseXY={mouseXY} assetSelect={this.assetSelect}  assetLibRemove={this.assetLibRemove} />
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