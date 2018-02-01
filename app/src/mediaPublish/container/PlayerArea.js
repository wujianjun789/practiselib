/**
 * Created by a on 2017/10/20.
 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {findDOMNode} from 'react-dom';

import '../../../public/styles/mediaPublish-playList.less';

import HeadBar from '../../components/HeadBar';
import SideBar from '../component/SideBar';
import Overlayer from '../../common/containers/Overlayer';

import Content from '../../components/Content';
import Page from '../../components/Page';

import RenderPropertyPanel from '../component/RenderPropertyPanel';
import RenderAssetLibTop from '../component/RenderAssetLibTop';
import RenderAssetLib from '../component/RenderAssetLib';
import RenderPlayerAsset from '../component/RenderPlayerAsset';

import ConfirmPopup from '../../components/ConfirmPopup';

import UploadNotify from '../component/uploadNotify';
import UploadFile from '../component/uploadFile';

import NotifyPopup from '../../common/containers/NotifyPopup';

import { treeViewInit } from '../../common/actions/treeView';
import { overlayerShow, overlayerHide } from '../../common/actions/overlayer';
import { addNotify, removeAllNotify } from '../../common/actions/notifyPopup';

import Immutable from 'immutable';

import { Name2Valid } from '../../util/index';
import { getIndexByKey, getListObjectByKey } from '../../util/algorithm';
import { addTreeNode, updateTree, moveTree, removeTree, getTreeParentNode, clearTreeListState, formatTransformType,
  getAssetData, parsePlanData, tranformAssetType, IsSystemFile, getTitleByType, getPropertyTypeByNodeType, getTipByType, getInitData, getActiveItem } from '../util/index';

import {getProgramList, getSceneList, getZoneList, getItemList, addProgram, addScene, addZone, addItem, updateProjectById,
  updateProgramById, updateSceneById, updateZoneById, updateItemById, updateProgramOrders, updateSceneOrders, updateZoneOrders, updateItemOrders,
  removeProgramsById, removeSceneById, removeZoneById, removeItemById, searchAssetList, getAssetListByTypeWithName, addAsset, getAssetById, removeAssetById} from '../../api/mediaPublish';

import {FormattedMessage, injectIntl} from 'react-intl';

import lodash from 'lodash';

import PreviewImg from '../component/previewImg';

import systemFile from '../data/systemFile.json';
import systemInitFile from '../data/systemInitFile.json';
export class PlayerArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      project: null,
      curNode: null,
      parentNode: null,
      parentParentNode: null,
      curType: 'playerProject',
      playerData: [
        /*{
          'id': 'player1',
          'type': 'plan',
          'name': '播放计划1',
          'toggled': true,
          'active': false,
          'level': 1,
          'children': [
            {
              'id': 'scene1',
              'type': 'scene',
              'name': '场景1',
              'toggled': true,
              'class': '',
              'active': false,
              'children': [
                {
                  'id': 'area1',
                  'type': 'area',
                  'name': '区域1',
                  'active': true,
                }, {
                  'id': 'area2',
                  'type': 'area',
                  'name': '区域2',
                  'active': false,
                },
              ],
            },
            {
              'id': 'scene2',
              'type': 'scene',
              'name': '场景2',
              'toggled': false,
              'class': '',
              'active': false,
              'children': [],
            },
          ],
        },
        {
          'id': 'player2',
          'type': 'plan',
          'name': '播放计划2',
          'toggled': false,
          'level': 1,
          'children': [
            {
              'id': 'scene3',
              'type': 'scene',
              'name': '场景3',
              'toggled': true,
              'class': '',
              'active': false,
              'children': [],
            },
          ],
        },
        {
          'id': 'player3',
          'type': 'plan',
          'name': '播放计划3',
          'toggled': false,
          'level': 1,
          'children': [],
        },*/
      ],
      sidebarInfo: {
        collapsed: false,
        propertyCollapsed: false,
        assetLibCollapsed: false,
      },

      assetType: Immutable.fromJS({ list: [{ id: 1, value: '系统' }, { id: 2, value: '自定义' }], index: 0, value: '系统' }),
      assetSort: Immutable.fromJS({
        list: [{ id: 1, type:1, value: '素材文字' }, { id: 2, type:2, value: '素材图片' }, { id: 3, type:3, value: '素材视频' }],
        index: 0, value: '素材文字',
      }),
      assetSearch: Immutable.fromJS({ placeholder: this.formatIntl('sysOperation.input.asset'), value: '' }),
      assetList: Immutable.fromJS({
        list: [/*{ id: 1, name: '素材1', active: true, assetType: "system", type: "word" }, { id: 2, name: '素材2', assetType: "source", type: "video" },
                 { id: 3, name: '素材3', assetType: "source", type: "picture" }, { id: 4, name: '素材4', assetType: "source", type: "video" }*/], id: 1, name: '素材1', isEdit: true,
      }),
      playerListAsset: Immutable.fromJS({
        list: [/*{ id: 1, name: '素材1', assetType: "system", type: "text" }, { id: 2, name: '素材2', assetType: "source", type: "video" }, { id: 3, name: '素材3', assetType: "source", type: "picture" },
                 { id: 4, name: '素材4', assetType: "source", type: "timing" }, { id: 5, name: '素材5', assetType: "source", type: "video" }, { id: 6, name: '素材6', assetType: "source", type: "picture" }*/],
        id: 1, name: '素材1', isEdit: true,
      }),
      page: Immutable.fromJS({
        pageSize: 10,
        current: 1,
        total: 2,
      }),

      showModal: false,
      showUploadNotify: false,
      showUploadFile: false,
      uploadFileList: [],
      usefulListLength: 0,
      currentXhr: null,
      isUpload: false,
      afterFirstUpload: false,

      assetStyle: { 'height': '309px', 'position':'relative' },
      controlStyle: { 'left': 'auto', 'right': 'auto' },
      libStyle: {},
      pageStyle: {},
      scrollHeight: 0,
      //拖拽
      mouseXY: [0, 0],
      mouseCircleDelta: [0, 0],
      lastPress: null,
      isPressed: false,

      //播放列表单击
      isClick: false,
      //左侧栏添加单击
      isAddClick: false,
    };

    this.systemFile = [];
    this.systemInitFile = systemInitFile;
    this.typeList = [{ id: 'playerPlan', name: '播放计划' }, { id: 'playerScene', name: '场景' }, { id: 'playerArea', name: '区域' }];

    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.showUploadNotify = this.showUploadNotify.bind(this);
    this.hideUploadNotify = this.hideUploadNotify.bind(this);
    this.showUploadFile = this.showUploadFile.bind(this);
    this.hideUploadFile = this.hideUploadFile.bind(this);
    this.addUploadFile = this.addUploadFile.bind(this);
    this.cancelUploadFile = this.cancelUploadFile.bind(this);
  }
  componentWillMount() {
    this.mounted = true;
    this.updatePlayerTree();
    this.mounted && this.setSize();
    window.onresize = event => {
      this.mounted && this.setSize();
    };

    this.systemFile = systemFile.map(file => {
      return Object.assign({}, file, {assetType: 'system'});
    });

    const { router } = this.props;
    if (router && router.location) {
      const routerState = router.location.state;
      const project = routerState ? routerState.item : null;
      this.setState({project:project}, () => {
        this.requestProgrameList();
      });
    }

    this.requestAssetList();
    this.requestSearchAssetList();
  }

  componentDidMount() {
    // window.addEventListener("mousemove", this.handleMouseMove, true);
    // window.addEventListener("mouseup", this.handleMouseUp, true);
    this.updateSidebarInfoStyle();
  }

  componentDidUpdate() {
    this.updateSidebarInfoStyle();
  }

  componentWillUnmount() {
    this.mounted = false;
    this.props.actions.removeAllNotify();
    window.onresize = event => {

    };

    const list = this.state.uploadFileList;
    list.map((item) => {
      if (item !== undefined) {
        item.xhr.upload.removeEventListener('progress', this.uploadProgress);
        item.xhr.removeEventListener('load', this.uploadComplete);
        item.xhr.removeEventListener('error', this.uploadFailed);
        item.xhr.removeEventListener('abort', this.uploadCanceled);
      }
    });
  }

    formatIntl=(formatId) => {
      const {intl} = this.props;
      return intl ? intl.formatMessage({id:formatId}) : null;
      // return formatId;
    }

    updateSidebarInfoStyle = () => {
      const sidebarInfoDom = findDOMNode(this.refs.sidebarInfo);
      const assetPropertyDom = findDOMNode(this.refs.assetProperty);
      if (sidebarInfoDom && sidebarInfoDom.scrollHeight !== this.state.scrollHeight || assetPropertyDom && assetPropertyDom.offsetHeight !== this.state.assetProperHeight) {
        const pageStyle = sidebarInfoDom.scrollHeight > sidebarInfoDom.clientHeight ? {} : {position: 'absolute'};
        const libStyle = sidebarInfoDom.scrollHeight > sidebarInfoDom.clientHeight ? {} : {'position':'absolute', 'top':assetPropertyDom.offsetHeight + 30 + 'px', 'bottom':'0px'};
        const assetStyle = sidebarInfoDom.scrollHeight > sidebarInfoDom.clientHeight ? {'height':'309px'} : {'position':'absolute', 'top':'61px', 'right':'20px', 'bottom':0, 'left':'20px'};

        this.setState({IsScroll: sidebarInfoDom.scrollHeight > sidebarInfoDom.clientHeight, scrollHeight: sidebarInfoDom.scrollHeight, assetProperHeight: assetPropertyDom.offsetHeight,
          libStyle: libStyle, assetStyle: assetStyle, pageStyle: pageStyle});
      }
    }

    handleMouseMove = ({ pageX, pageY }) => {
      const { isPressed, mouseCircleDelta: [dx, dy] } = this.state;
      if (isPressed) {
        const mouseXY = [pageX - dx, pageY - dy];
        this.setState({ mouseXY });
      }
    }

    handleMouseDown = (item, [pressX, pressY], { pageX, pageY }) => {
      this.assetSelect(item);
      this.setState({
        lastPress: item.get('id'),
        isPressed: true,
        mouseCircleDelta: [pageX - pressX, pageY - pressY],
        mouseXY: [pressX, pressY],
      });
    }

    handleMouseUp = () => {
      this.setState({ isPressed: false, mouseCircleDelta: [0, 0] });
    }

    setSize = () => {
      let width = window.innerWidth;
      let height = window.innerHeight;
      let cleft = 'auto';
      let cright = 'auto';
      if (width < 1578) {
        cright = 0;
      } else {
        cleft = '535px';
      }

      this.setState({ controlStyle: { 'left': cleft, 'right': cright }});
    }

    requestAssetList = () => {
      const { assetType, assetSort, assetSearch } = this.state;
      const type = assetType.get('index');
      const aType = assetSort.getIn(['list', assetSort.get('index'), 'type']);
      const name = assetSearch.get('value');
      if (type === 0) {
        this.updatePageTotal(this.systemFile);
      } else {
        getAssetListByTypeWithName(aType, name, data => {this.mounted && this.updatePageTotal(data);});
      }
    }

    requestSearchAssetList = () => {
      const { assetType, assetSort, assetSearch, page} = this.state;
      const type = assetType.get('index');
      const aType = assetSort.getIn(['list', assetSort.get('index'), 'type']);
      const name = assetSearch.get('value');
      if ( type === 0) {
        this.setState({assetList: this.state.assetList.update('list', v => Immutable.fromJS(this.systemFile))});
      } else {

        const current = page.get('current');
        const pageSize = page.get('pageSize');
        const limit = pageSize;
        const offset = (current - 1) * limit;
        searchAssetList(aType, name, offset, limit, data => {this.mounted && this.updateAssetList(data);});
      }
    }

    updatePageTotal = (data) => {
      this.setState({page: this.state.page.update('total', v => data.length)});
    }

    updateAssetList= (data) => {
      const {page} = this.state;
      const curPage = page.get('current');
      const newData = data.map(item => {
        return Object.assign({}, item, {assetType:'source'});
      });
      this.setState({assetList: this.state.assetList.update('list', v => Immutable.fromJS(newData))});
    }

    requestProgrameList=() => {
      const {project} = this.state;
      getProgramList(project.id, data => {this.mounted && this.updateProgramList(data);});
    }

    updateProgramList=(data) => {
      let newData = data.map(program => {
        return Object.assign({}, program, {type:'plan', toggled:false, active: false, children:[]});
      });
      console.log('newData:', newData);
      this.setState({playerData: newData}, () => {
        this.updatePlayerTree();
      });
    }

    requestSceneList = (programId) => {
      const {project} = this.state;
      getSceneList(project.id, programId, data => {this.mounted && this.updateSceneList(programId, data);});
    }

    updateSceneList = (programId, data) => {
      let index = lodash.findIndex(this.state.playerData, program => {return program.id == programId;});
      let newData = data.map(scene => {
        return Object.assign({}, scene, {type:'scene', toggled:false, active:false, children:[]});
      });

      clearTreeListState(this.state.playerData);

      this.state.playerData[index].active = true;
      this.state.playerData[index].toggled = true;
      this.state.playerData[index].children = newData;
      this.setState({playerData: this.state.playerData}, () => {
        this.updatePlayerTree();
      });
    }

    requestZoneList = (programId, sceneId) => {
      const {project} = this.state;
      getZoneList(project.id, programId, sceneId, data => {this.mounted && this.updateZoneList(programId, sceneId, data);});
    }

    updateZoneList = (programId, sceneId, data) => {
      let programItem = lodash.find(this.state.playerData, program => {return program.id == programId;});
      let programIndex = lodash.findIndex(this.state.playerData, program => {return program.id == programId;});

      let sceneIndex = lodash.findIndex(programItem.children, scene => {return scene.id == sceneId;});
      let newData = data.map(area => {
        return Object.assign({}, area, {type:'area', active:false});
      });

      clearTreeListState(this.state.playerData);

      this.state.playerData[programIndex].toggled = true;
      this.state.playerData[programIndex].children[sceneIndex].toggled = true;
      this.state.playerData[programIndex].children[sceneIndex].active = true;
      this.state.playerData[programIndex].children[sceneIndex].children = newData;
      this.setState({playerData: this.state.playerData}, () => {
        this.updatePlayerTree();
      });
    }

    requestItemList = (programId, sceneId, zoneId) => {
      const {project} = this.state;
      getItemList(project.id, programId, sceneId, zoneId, data => {this.mounted && this.updateItemList(programId, sceneId, zoneId, data);});
    }

    updateItemList = (programId, sceneId, zoneId, data) => {
        const newData = data.map(item => {
            return Object.assign({}, item, {assetType:'source'});
        });

        if(newData && newData.length){
            this.playerAssetSelect(Immutable.fromJS(newData[0]));
        }else{

        }

        this.setState({playerListAsset: this.state.playerListAsset.update('list', v => Immutable.fromJS(newData))}, () => {
            this.state.playerListAsset.get('list').map(item => {
            const itemObject  = item.toJS();
            if (IsSystemFile(item.get('type'))) {
                const name = lodash.find(this.systemFile, file => {return file.id === itemObject.materialId;}).name;
                this.updateItemName(itemObject, name);
            } else {
                this.requestAssetNameById(itemObject);
          }
        });
      });
    }

    requestAssetNameById = (item) => {
      getAssetById(item.materialId, response => {
        this.updateItemName(item, response.name);
      });
    }

    updateItemName = (item, name) => {
      const {playerListAsset} = this.state;
      const index = getIndexByKey(this.state.playerListAsset.get('list'), 'id', item.id);
      this.setState({playerListAsset: this.state.playerListAsset.updateIn(['list', index], v => Immutable.fromJS(Object.assign({}, playerListAsset.getIn(['list', index]).toJS(), {name: name})))});
    }

    initItemList = () => {
      this.setState({playerListAsset: this.state.playerListAsset.update('list', v => Immutable.fromJS([]))});
    }

    updatePlayerTree = () => {
      const { playerData } = this.state;
      const { actions } = this.props;
      actions && actions.treeViewInit(playerData);

    }

    updateTreeData = (node, parentNode, parentParentNode) => {
      const treeList = updateTree(this.state.playerData, node, parentNode, parentParentNode);
      this.setState({ playerData: treeList }, () => {
        this.updatePlayerTree();
      });
    }

    assetSelect = (item) => {
      console.log(item.toJS());
      this.state.assetList = this.state.assetList.update('id', v => item.get('id'));
      this.setState({ assetList: this.state.assetList.update('name', v => item.get('name')) });
    }

    playerAssetSelect = (item) => {
      console.log(item.toJS());
      const type = item.get('type');
      const curType = tranformAssetType(type);

      this.state.playerListAsset = this.state.playerListAsset.update('id', v => item.get('id'));
      this.setState({ isClick: true, curType: curType, playerListAsset: this.state.playerListAsset.update('name', v => item.get('name')) });
      // const curIndex = getIndexByKey(this.state.playerListAsset.get('list'), 'id', item.get('id'));
      // this.setState({playerListAsset: this.state.playerListAsset.updateIn(['list', curIndex, 'active'], v=>!item.get('active'))});
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

    pageChange = (current, pageSize) => {
      let page = this.state.page.set('current', current);
      this.setState({ page: page }, () => {
        this.requestSearchAssetList();
      });
    }

    playerListAssetClick = (id) => {
      if (id == 'add') {
        let addList = getActiveItem(this.state.assetList);

        if (addList.length == 0) {
          this.props.actions.addNotify(0, '请选中右边素材库素材');
        }
      } else if (id == 'edit') {
        this.setState({ playerListAsset: this.state.playerListAsset.update('isEdit', v => false) });
      } else if (id == 'remove') {
        const { actions } = this.props;
        actions.overlayerShow(<ConfirmPopup iconClass="icon_popup_delete" tips="是否删除选中素材？"
          cancel={() => { actions.overlayerHide(); }} confirm={() => {

          }} />);
      } else if (id == 'complete') {
        this.setState({ playerListAsset: this.state.playerListAsset.update('isEdit', v => true) });
      }
    }

    assetList = (id) => {
      if (id == 'add') {

      } else if (id == 'edit') {
        this.setState({ assetList: this.state.assetList.update('isEdit', v => false) });
      } else if (id == 'remove') {
        const { actions } = this.props;
        actions.overlayerShow(<ConfirmPopup iconClass="icon_popup_delete" tips="是否删除选中素材？"
          cancel={() => { actions.overlayerHide(); }} confirm={() => {

          }} />);
      } else if (id == 'complete') {
        this.setState({ assetList: this.state.assetList.update('isEdit', v => true) });
      }
    }



    addClick = (item) => {
      const {project, parentParentNode, parentNode, curNode} = this.state;
      if (!curNode || curNode.type !== 'area') {
        this.props.actions.addNotify(0, this.formatIntl('mediaPublish.area.alert'));
        return false;
      }

      const data = item.toJS();
      const index = lodash.findIndex(this.systemInitFile, file => { return file.baseInfo.type == data.type;});
      const itemType = index > -1 ? data.type : formatTransformType(data.filepath);
      const itemData = index > -1 ? this.systemInitFile[index] : getAssetData(data);
      addItem(project.id, parentParentNode.id, parentNode.id, curNode.id, itemType, itemData, data => {
        this.requestItemList(parentParentNode.id, parentNode.id, curNode.id);
      });
    }

    assetLibRemove = (item) => {
      console.log('assetLibRemove:', item.toJS());
      const { actions } = this.props;
      actions.overlayerShow(<ConfirmPopup iconClass="icon_popup_delete" tips={'是否删除选中素材？'}
        cancel={() => { actions.overlayerHide(); }} confirm={() => {
          const itemId = item.get('id');
          const list = this.state.assetList.get('list');
          const curIndex = getIndexByKey(list, 'id', itemId);

          removeAssetById(itemId, data => {
            actions.overlayerHide();
            this.requestSearchAssetList();
          });
        }} />);

    }

    playerAssetRemove = (item) => {
      const {project, parentParentNode, parentNode, curNode} = this.state;
      const itemId = item.get('id');

      removeItemById(project.id, parentParentNode.id, parentNode.id, curNode.id, itemId, item.get('type'), data => {
        this.requestItemList(parentParentNode.id, parentNode.id, curNode.id);
      });
    }

    playerAssetMove = (id, item) => {
      const {project, parentParentNode, parentNode, curNode} = this.state;
      const itemId = item.get('id');
      const list = this.state.playerListAsset.get('list');
      const curIndex = getIndexByKey(list, 'id', itemId);

      this.state.playerListAsset = this.state.playerListAsset.update('list', v => v.splice(curIndex, 1));
      this.setState({ playerListAsset: this.state.playerListAsset.update('list', v => v.splice(id == 'left' ? curIndex - 1 : curIndex + 1, 0, item)) }, () => {
        updateItemOrders(project.id, parentParentNode.id, parentNode.id, curNode.id, getListObjectByKey(this.state.playerListAsset.get('list').toJS(), 'id'), () => {
        });
      });
    }

    addPlayerScene = () => {
      const parentNode = this.state.curNode;
      let node = getInitData('scene', '场景新建');

      this.setState({ curType: 'playerScene', curNode: node, parentNode: parentNode }, () => {this.updateTreeData(node, parentNode);});
    }

    addPlayerArea = () => {
      const parentParentNode = this.state.parentNode;
      const parentNode = this.state.curNode;
      let node = getInitData('area', '区域新建');

      this.setState({ curType: 'playerArea', curNode: node, parentNode: parentNode, parentParentNode:parentParentNode }, this.updateTreeData(node, parentNode, parentParentNode));
    }

    areaClick = (id) => {
      const { actions } = this.props;
      const { project }  = this.state;

      if (id == 'add') {
        if (this.state.curType == 'playerProject') {
          this.setState({ isAddClick: true });
        } else {
          clearTreeListState(this.state.playerData);
          switch (this.state.curType) {
          case 'playerPlan':
          case 'playerPlan2':
          case 'playerPlan3':
            this.addPlayerScene();
            break;
          case 'playerScene':
            this.addPlayerArea();
            break;
          }
        }
      } else if (id == 'edit') {
        this.setState({ isAddClick: false }, () => {
          this.initItemList();
        });
      } else if (id == 'remove') {
        let tips = getTipByType(this.state.curType);

        actions.overlayerShow(<ConfirmPopup iconClass="icon_popup_delete" tips={tips}
          cancel={() => { actions.overlayerHide(); }} confirm={() => {
          }} />);
      } else if (id == 'project') {
        this.setState({ curType: 'playerProject', isClick: false });
      } else if (id == 'complete') {

      } else {
        clearTreeListState(this.state.playerData);
        this.setState({ isAddClick: false }, () => {

          addTreeNode(id);
          this.setState({ curType: proType, curNode: node }, () => this.updateTreeData(node));
        });
      }
    }

    addUpdatePlan = (data) => {
      let planData = parsePlanData(data);
      const {project} = this.state;
      if (data.id) {
        planData = Object.assign({}, planData, {id: data.id});
        updateProgramById(project.id, planData, (response) => {
          this.updatePlayerPlanData(planData);
        });
      } else {
        addProgram(project.id, planData, response => {
          this.updatePlayerPlanData(Object.assign({}, planData, {id:response.playlistId}));
        });
      }
    }

    addUpdateScene = data => {
      let sceneData = data;
      const {project, parentNode} = this.state;
      if (data.id) {
        sceneData = Object.assign({}, sceneData, {id: data.id});
        updateSceneById(project.id, parentNode.id, sceneData, (response) => {
          this.updatePlayerSceneData(sceneData);
        });
      } else {
        addScene(project.id, parentNode.id, sceneData, response => {
          this.updatePlayerSceneData(Object.assign({}, sceneData, {id:response.sceneId}));
        });
      }
    }

    addUpdateArea = data => {
      let areaData = data;
      const {project, parentParentNode, parentNode} = this.state;
      if (data.id) {
        areaData = Object.assign({}, areaData, {id: data.id});
        updateZoneById(project.id, parentParentNode.id, parentNode.id, areaData, (response) => {
          this.updatePlayerAreaData(areaData);
        });
      } else {
        addZone(project.id, parentParentNode.id, parentNode.id, areaData, response => {
          this.updatePlayerAreaData(Object.assign({}, areaData, {id:response.regionId}));
        });
      }
    }

    addUpdateItem = data => {
      const {project, parentParentNode, parentNode, curNode, playerListAsset} = this.state;
      updateItemById(project.id, parentParentNode.id, parentNode.id, curNode.id, data, response => {
        this.requestItemList(parentParentNode.id, parentNode.id, curNode.id);
      });
    }

    updatePlayerPlanData = (response) => {
      let playerData = this.state.playerData.map(plan => {
        if ((typeof plan.id === 'string' && plan.id.indexOf('plan&&') > -1) || plan.id == response.id) {
          return Object.assign({}, plan, response);
        }

        return plan;
      });
      this.setState({playerData: playerData}, () => this.updatePlayerTree());
    }

    updatePlayerSceneData = (response) => {
      const {playerData, parentNode} = this.state;
      let index = lodash.findIndex(playerData, plan => { return plan.id == parentNode.id;});
      this.state.playerData[index].children = playerData[index].children.map(scene => {
        if ((typeof scene.id === 'string' && scene.id.indexOf('scene&&') > -1) || scene.id == response.id) {
          return Object.assign({}, scene, response);
        }

        return scene;
      });
      this.setState({playerData: this.state.playerData}, () => this.updatePlayerTree());
    }

    updatePlayerAreaData = (response) => {
      const {playerData, parentNode, parentParentNode} = this.state;
      let planIndex = lodash.findIndex(playerData, plan => { return plan.id == parentParentNode.id;});
      let sceneIndex = lodash.findIndex(playerData[planIndex].children, scene => { return scene.id == parentNode.id;});
      this.state.playerData[planIndex].children[sceneIndex].children = playerData[planIndex].children[sceneIndex].children.map(area => {
        if ((typeof area.id === 'string' && area.id.indexOf('area&&') > -1) || area.id == response.id) {
          return Object.assign({}, area, response);
        }

        return area;
      });
      this.setState({playerData: this.state.playerData}, () => this.updatePlayerTree());
    }

    applyClick = (id, data) => {
      switch (id) {
      case 'playerProject':
        updateProjectById(data, response => {
          this.setState({project:Object.assign({}, this.state.project, response)});
        });
        break;
      case 'playerPlan':
        this.addUpdatePlan(data);
        break;
      case 'playerScene':
        this.addUpdateScene(data);
        break;
      case 'playerAreaPro':
        this.addUpdateArea(data);
        break;
      default:
        this.addUpdateItem(data);
      }
    }

    playHandler = () => {

    }

    zoomOutHandler = () => {

    }

    zoomInHandler = () => {

    }

    saveHandler = () => {

    }

    savePlanHandler = () => {

    }

    quitHandler = () => {
      const { actions } = this.props;
      actions.overlayerShow(<ConfirmPopup iconClass="icon_popup_delete" tips="未保存内容将会丢失，是否退出？"

        cancel={() => { actions.overlayerHide(); }} confirm={() => {
          actions.overlayerHide();
          this.props.router.push('/mediaPublish/playerList');
        }} />);
    }

    positionHandler = (id) => {
      console.log(id);
    }

    searchSubmit = () => {
      this.requestAssetList();
      this.requestSearchAssetList();
    }

    showModal() {
      this.setState({
        showModal: true,
      });
    }

    hideModal() {
      this.setState({
        showModal: false,
      });
    }

    showUploadNotify() {
      this.setState({
        showUploadNotify: true,
      });
    }
    hideUploadNotify() {
      this.setState({
        showUploadNotify: false,
      });
    }

    showUploadFile() {
      this.setState({
        showUploadFile: true,
      });
    }
    hideUploadFile() {
      this.setState({
        showUploadFile: false,
      });
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
      const list = this.state.uploadFileList, key = e.target.key, xhr = list[key].xhr;
      if (e.target.status === 200) {
        list[key].progress = this.formatIntl('mediaPublish.completed');
      } else {
        list[key].progress = this.formatIntl('mediaPublish.failed');
      }
      this.setState({ uploadFileList: list });

      const nextKey = key + 1;

      for (let i = nextKey; i < list.length; i++) {
        if (list[i] !== undefined && (list[i].progress === '待上传' || list[i].progress === 'Waiting')) {
          const currentXhr = list[i].xhr;
          currentXhr.open('POST', list[i].url, true);
          currentXhr.send(list[i].form);
          this.setState({ currentXhr: currentXhr });
          return;
        }
      }
      this.setState({ isUpload: false, currentXhr: null });
    }
    uploadFailed = (e) => {
      const list = this.state.uploadFileList, key = e.target.key, xhr = list[key].xhr;
      list[key].progress = this.formatIntl('mediaPublish.failed');
      this.setState({ uploadFileList: list });

      const nextKey = key + 1;

      for (let i = nextKey; i < list.length; i++) {
        if (list[i] !== undefined && (list[i].progress === '待上传' || list[i].progress === 'Waiting')) {
          const currentXhr = list[i].xhr;
          currentXhr.open('POST', list[i].url, true);
          currentXhr.send(list[i].form);
          this.setState({ currentXhr: currentXhr });
          return;
        }
      }
      this.setState({ isUpload: false, currentXhr: null });


    }
    uploadCanceled = (e) => {
      console.log('取消上传');
    }

    addUploadFile(file) {

      const self = this;
      const url = 'http://192.168.155.196:3001/api/file/upload';
      const name = file.name, key = file.key, type = file.type;

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

      const newUploadFileList = this.state.uploadFileList;
      newUploadFileList.push({ name: file.name, progress: file.progress, xhr: xhr, url: url, form: form });
      const usefulListLength = this.state.usefulListLength + 1;

      this.setState({
        uploadFileList: newUploadFileList,
        usefulListLength: usefulListLength,
      }, () => {
        this.showUploadNotify();

        if (!this.state.afterFirstUpload) {
          let currentList = this.state.uploadFileList, currentXhr;
          currentXhr = currentList[0].xhr;
          currentXhr.open('POST', currentList[0].url, true);
          currentXhr.send(currentList[0].form);
          this.setState({ currentXhr: currentXhr, afterFirstUpload: true, isUpload: true });
          return;
        }
        if (this.state.isUpload) {
          return;
        }

        let currentList = this.state.uploadFileList, currentXhr;
        currentXhr = currentList[currentList.length - 1].xhr;
        currentXhr.open('POST', currentList[currentList.length - 1].url, true);
        currentXhr.send(currentList[currentList.length - 1].form);
        this.setState({currentXhr:currentXhr, isUpload:true});
      });
    }

    cancelUploadFile(index) {

      console.log('取消上传');
      const newUploadFileList = this.state.uploadFileList, xhr = newUploadFileList[index].xhr;

      if (this.state.currentXhr === xhr) {

        xhr.abort();
        xhr.upload.removeEventListener('progress', this.uploadProgress);
        xhr.removeEventListener('load', this.uploadComplete);
        xhr.removeEventListener('error', this.uploadFailed);
        xhr.removeEventListener('abort', this.uploadCanceled);

        const list = this.state.uploadFileList;
        const nextKey = index + 1;
        for (let i = nextKey; i < list.length; i++) {
          if (list[i] !== undefined && (list[i].progress === '待上传' || list[i].progress === 'Waiting')) {
            const currentXhr = list[i].xhr;
            currentXhr.open('POST', list[i].url, true);
            currentXhr.send(list[i].form);

            newUploadFileList[index] = undefined;
            const usefulListLength = this.state.usefulListLength - 1;
            this.setState({
              uploadFileList: newUploadFileList,
              usefulListLength: usefulListLength,
              currentXhr: currentXhr,
            }, () => {
              if (this.state.usefulListLength === 0) {
                this.hideUploadNotify();
              }
            });
            return;
          }
        }

        newUploadFileList[index] = undefined;
        const usefulListLength = this.state.usefulListLength - 1;
        this.setState({
          uploadFileList: newUploadFileList,
          usefulListLength: usefulListLength,
          currentXhr: null,
          isUpload: false,
        }, () => {
          if (this.state.usefulListLength === 0) {
            this.hideUploadNotify();
          }
        });
      } else if (xhr.readyState === 0) {
        newUploadFileList[index] = undefined;
        const usefulListLength = this.state.usefulListLength - 1;
        this.setState({
          uploadFileList: newUploadFileList,
          usefulListLength: usefulListLength,
        }, () => {
          if (this.state.usefulListLength === 0) {
            this.hideUploadNotify();
          }
        });
      } else {
        xhr.abort();
        xhr.upload.removeEventListener('progress', this.uploadProgress);
        xhr.removeEventListener('load', this.uploadComplete);
        xhr.removeEventListener('error', this.uploadFailed);
        xhr.removeEventListener('abort', this.uploadCanceled);

        newUploadFileList[index] = undefined;
        const usefulListLength = this.state.usefulListLength - 1;
        this.setState({
          uploadFileList: newUploadFileList,
          usefulListLength: usefulListLength,
        }, () => {
          if (this.state.usefulListLength === 0) {
            this.hideUploadNotify();
          }
        });
      }
    }

    onRemove = node => {
      const {project, playerData} = this.state;
      let parentNode = getTreeParentNode(playerData, node);
      let parentParentNode = getTreeParentNode(playerData, parentNode);
      if (node.type === this.state.curNode.type && node.id === this.state.curNode.id
            ||  parentNode.type === this.state.parentNode.type && parentNode.id === this.state.parentNode.id
            ||  parentParentNode.type === this.state.parentParentNode.type  &&  parentParentNode.id === this.state.parentParentNode.id) {
        this.initItemList();
      }

      switch (node.type) {
      case 'scene':
        removeSceneById(project.id, parentNode.id, node.id, () => {
          this.setState({playerData:removeTree(playerData, node)});
        });
        break;
      case 'plan':
        removeProgramsById(project.id, node.id, () => {
          this.setState({playerData:removeTree(playerData, node)});
        });
        break;
      case 'plan2':
        type = 'cyclePlan';
        break;
      case 'plan3':
        type = 'timingPlan';
        break;
      case 'area':
        removeZoneById(project.id, parentParentNode.id, parentNode.id, node.id, () => {
          this.setState({playerData:removeTree(playerData, node)});
        });
        break;
      }
    }

    onMove = (key, node) => {
      switch (node.type) {
      case 'plan':
      case 'plan2':
      case 'plan3':
        this.updatePlanOrders({key:key, node:node});
        break;
      case 'scene':
        this.updateScenesOrders({key:key, node:node});
        break;
      case 'area':
        this.updateAreaOrders({key:key, node:node});
        break;
      }
    }

    updatePlanOrders = (data) => {
      const {project} = this.state;

      this.setState({playerData: moveTree(this.state.playerData, data)}, () => {
        let ids = getListObjectByKey(this.state.playerData, 'id');

        updateProgramOrders(project.id, ids, response => {
          console.log('plan orders:', ids);
        });
      });
    }

    updateScenesOrders = (data) => {
      const {project, playerData} = this.state;
      let parentNode = getTreeParentNode(playerData, data.node);
      let index = lodash.findIndex(playerData, plan => { return plan.type == parentNode.type && plan.id == parentNode.id;});

      // this.state.playerData[index].children = moveTree(parentNode.children, data);
      this.setState({playerData: this.state.playerData}, () => {
        let ids = getListObjectByKey(this.state.playerData[index].children, 'id');
        updateSceneOrders(project.id, parentNode.id, ids, response => {
          console.log('scene orders:', ids);
        });
      });

    }

    updateAreaOrders = (data) => {
      const {project, playerData} = this.state;
      let parentNode = getTreeParentNode(playerData, data.node);
      let parentParentNode = getTreeParentNode(playerData, parentNode);

      let planIndex = lodash.findIndex(playerData, plan => { return plan.type == parentParentNode.type && plan.id == parentParentNode.id;});
      let sceneIndex = lodash.findIndex(parentParentNode.children, scene => { return scene.type == parentNode.type && scene.id == parentNode.id;});

      this.state.playerData[planIndex].children[sceneIndex].children = moveTree(parentNode.children, data);
      this.setState({playerData: this.state.playerData}, () => {
        let ids = getListObjectByKey(this.state.playerData[planIndex].children[sceneIndex].children, 'id');
        updateZoneOrders(project.id, parentParentNode.id, parentNode.id, ids, response => {
          console.log('area orders:', ids);
        });
      });
    }

    onToggle = (node) => {
      const type = getPropertyTypeByNodeType(node);
      const parentNode = getTreeParentNode(this.state.playerData, node);
      const parentParentNode = getTreeParentNode(this.state.playerData, parentNode);

      this.initItemList();

      this.setState({ parentParentNode: parentParentNode, parentNode:parentNode, curNode: node, curType: type, isClick: false }, () => {
        if (typeof node.id == 'string' && (node.id.indexOf('plan&&') > -1 || node.id.indexOf('scene&&') > -1)) {
          return;
        }

        switch (type) {
        case 'playerPlan':
          !node.toggled && this.requestSceneList(node.id);
          break;
        case 'playerScene':
          !node.toggled && this.requestZoneList(parentNode.id, node.id);
          break;
        case 'playerArea':
          this.requestItemList(parentParentNode.id, parentNode.id, node.id);
          break;
        }
      });
    }

    sidebarClick = (id) => {
      const {sidebarInfo} = this.state;
      const state = !sidebarInfo[id];
      if (id == 'propertyCollapsed') {
        this.state.sidebarInfo['propertyCollapsed'] = state;
      }

      this.setState({ sidebarInfo: Object.assign({}, this.state.sidebarInfo, { [id]: state })});
    }

    render() {
      const {
        project, curType, curNode, parentNode, parentParentNode, playerData, sidebarInfo, playerListAsset,
        assetList, assetType, assetSort, assetSearch, page, IsScroll, assetStyle, controlStyle, libStyle, pageStyle,
        lastPress, isPressed, mouseXY, isClick, isAddClick,
      } = this.state;
      const {router} = this.props;
      const add_title = getTitleByType(curType, this.formatIntl);

      console.log('curType:', curType, 'playerListAsset:', playerListAsset.get('list').toJS());
      return <div className={'container ' + 'mediaPublish-playerArea ' + (sidebarInfo.collapsed ? 'sidebar-collapse' : '')}>
        <HeadBar moduleName="app.mediaPublish" router={router} />
        <SideBar data={playerData} title={project && project.name} isActive={curType == 'playerProject'} isClick={isClick} isAddClick={isAddClick}
          onClick={this.areaClick} onToggle={this.onToggle} onMove={this.onMove} onRemove={this.onRemove}/>

        <Content className="player-area">
          <div className="left">
            <div className="form-group control-container-top">
              <div className="form-group play-container" onClick={() => this.playHandler()}>
                <span className="icon icon_play"></span><span className="word"><FormattedMessage id="mediaPublish.play"/></span></div>
              <div className="form-group zoom-out-container" onClick={() => this.zoomOutHandler()}>
                <span className="icon icon_enlarge"></span><span className="word"><FormattedMessage id="mediaPublish.enlarge"/></span></div>
              <div className="form-group zoom-in-container" onClick={() => this.zoomInHandler()}>
                <span className="icon icon_reduce"></span><span className="word"><FormattedMessage id="mediaPublish.narrow"/></span></div>
            </div>
            <div className="img-container">
              <PreviewImg />
            </div>
            <div className="control-container-bottom" style={controlStyle}>
              <div className="form-group pull-right quit-container " onClick={() => this.quitHandler()}>
                <span className="icon icon_send"></span><FormattedMessage id="mediaPublish.quit"/>
              </div>
              <div className="form-group pull-right save-plan-container "
                onClick={() => this.savePlanHandler()}>
                <span className="icon icon_save save-plan"></span><FormattedMessage id="mediaPublish.savePlan"/>
              </div>
            </div>
          </div>
          <div className="mediaPublish-footer">
            {/*<span className="asset-title"><FormattedMessage id='mediaPublish.playList'/></span>*/}
            <RenderPlayerAsset playerListAsset={playerListAsset} playerAssetSelect={this.playerAssetSelect} playerAssetMove={this.playerAssetMove} playerAssetRemove={this.playerAssetRemove}/>
            <div className="pull-right control-container">
              <div className={'list-group ' + (playerListAsset.get('isEdit') ? '' : 'hidden')}>
                <button className="btn btn-primary" onClick={() => this.playerListAssetClick('add')}><FormattedMessage id="button.add"/></button>
                <button className="btn btn-gray" onClick={() => this.playerListAssetClick('edit')}><FormattedMessage id="button.edit"/></button>
              </div>
              <div className={'list-group ' + (playerListAsset.get('isEdit') ? 'hidden' : '')}>
                <button className="btn btn-gray" onClick={() => this.playerListAssetClick('remove')}><FormattedMessage id="button.delete"/>
                </button>
                <button className="btn btn-primary" onClick={() => this.playerListAssetClick('complete')}><FormattedMessage id="button.finish"/>
                </button>
              </div>
            </div>
          </div>
        </Content>
        <div ref="sidebarInfo" className={'right sidebar-info '}>
          <div className="row collapse-container" onClick={() => this.sidebarClick('collapsed')}>
            <span className={sidebarInfo.collapsed ? 'icon_horizontal' : 'icon_vertical'}></span>
          </div>
          <div ref="assetProperty" className="panel panel-default asset-property">
            <div className="panel-heading pro-title" onClick={() => { !sidebarInfo.collapsed && this.sidebarClick('propertyCollapsed'); }}>
              <span className={sidebarInfo.collapsed ? 'icon_info' :
                'glyphicon ' + (sidebarInfo.propertyCollapsed ? 'glyphicon-triangle-right' : 'glyphicon-triangle-bottom')}></span>{`${this.formatIntl('mediaPublish.property')}${add_title}`}
            </div>
            <div className={'panel-body ' + (sidebarInfo.propertyCollapsed ? 'property-collapsed' : '')}>
              <RenderPropertyPanel curType={curType} project={project} parentParentNode={parentParentNode} parentNode={parentNode} curNode={curNode} playerListAsset={playerListAsset}/>
            </div>
          </div>

          <div className="panel panel-default asset-lib" style={libStyle}>
            <div className="panel-heading lib-title" onClick={() => { !sidebarInfo.collapsed && this.sidebarClick('assetLibCollapsed'); }}>
              <span className={sidebarInfo.collapsed ? 'icon_file' : 'glyphicon ' + (sidebarInfo.assetLibCollapsed ? 'glyphicon-triangle-right' : 'glyphicon-triangle-bottom')}></span><FormattedMessage id="mediaPublish.materialLib"/>
            </div>
            <div className={'panel-body ' + (sidebarInfo.assetLibCollapsed ? 'assetLib-collapsed' : '')} style={!IsScroll ? {'position':'absolute', 'top':'49px', 'bottom':0, 'right':0, 'left':0} : {}}>
              <div className="asset-container" style={{height:!IsScroll ? '100%' : 'auto'}}>
                <RenderAssetLibTop assetType={assetType} assetSort={assetSort} assetSearch={assetSearch} assetListPro={assetList} showModalPro={this.state.showModal}
                  onChange={this.onChange} searchSubmit={this.searchSubmit} assetList={this.assetList} showModal={this.showModal} hideModal={this.hideModal} addUploadFile={this.addUploadFile}/>
                <div className="bottom" style={assetStyle}>
                  <RenderAssetLib playerListAsset={playerListAsset} assetList={assetList} lastPress={lastPress} isPressed={isPressed} mouseXY={mouseXY} assetSelect={this.assetSelect} addClick={this.addClick} assetLibRemove={this.assetLibRemove}/>
                  <div className="page-container" style={pageStyle}>
                    <Page className={'page ' + (page.get('total') == 0 ? 'hidden' : '')} showSizeChanger
                      pageSize={page.get('pageSize')}
                      current={page.get('current')} total={page.get('total')}
                      onChange={this.pageChange} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div >
        <NotifyPopup />
        <Overlayer />
        <UploadNotify showUploadNotify={this.state.showUploadNotify} hideUploadNotify={this.hideUploadNotify} showUploadFile={this.showUploadFile} />
        {this.state.showUploadFile ? <UploadFile showUploadFile={this.state.showUploadFile} hideUploadFile={this.hideUploadFile} uploadFileList={this.state.uploadFileList} cancelUploadFile={this.cancelUploadFile} /> : null}
      </div>;
    }
}

const mapStateToProps = state => {
  return {
    sidebarNode: state.mediaPublish.get('sidebarNode'),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      treeViewInit: treeViewInit,
      overlayerShow: overlayerShow,
      overlayerHide: overlayerHide,
      addNotify: addNotify,
      removeAllNotify: removeAllNotify,
    }, dispatch),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(PlayerArea));