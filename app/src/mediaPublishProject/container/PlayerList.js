/**
 * Created by a on 2017/10/17.
 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Content from '../../components/Content';
import Select from '../../components/Select';
import SearchText from '../../components/SearchText';
import Table from '../../components/Table';
import Page from '../../components/Page';

import PlayerListPopup from '../component/PlayerListPopup';
import ConfirmPopup from '../../components/ConfirmPopup';
import NotifyPopup from '../../common/containers/NotifyPopup';

import {searchProjectList, getProjectByName, addProject, updateProjectById, removeProjectById, projectPublish} from '../../api/mediaPublish';
import {applyClick} from '../action/index';

import { overlayerShow, overlayerHide } from '../../common/actions/overlayer';
import {addNotify, removeAllNotify} from '../../common/actions/notifyPopup';
import Immutable from 'immutable';
import { getObjectByKey } from '../../util/algorithm';

import { FormattedMessage, injectIntl } from 'react-intl';

export class PlayerList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: Immutable.fromJS({
        list: [{ id: 1, value: `${this.formatIntl('mediaPublish.playType')} 1` },
          { id: 2, value: `${this.formatIntl('mediaPublish.playType' )} 2` }],
        index: 0, value: `${this.formatIntl('mediaPublish.playType')} 1`,
      }),
      search: Immutable.fromJS({ placeholder: this.formatIntl('mediaPublish.inputSchemeName'), value: '' }),
      page: Immutable.fromJS({
        pageSize: 10,
        current: 1,
        total: 0,
      }),
      data: Immutable.fromJS([
        /* { id: 1, icon: "", name: `${this.formatIntl('mediaPublish.playPlan')} 1`, resolution: "800X600", width: 800, height: 600 },
                { id: 2, icon: "", name: `${this.formatIntl('mediaPublish.playPlan')} 2`, resolution: "800X600", width: 800, height: 600 }*/
      ]),
    };

    this.columns = [{ id: 1, field: 'name', title:this.formatIntl('mediaPublish.schemeName')},
      { id: 2, field: 'resolution', title: this.formatIntl('mediaPublish.resolution')}];
    this.publishResponse = false;

    this.formatIntl = this.formatIntl.bind(this);

    this.typeChange = this.typeChange.bind(this);
    this.searchChange = this.searchChange.bind(this);
    this.searchSubmit = this.searchSubmit.bind(this);
    this.pageChange = this.pageChange.bind(this);
    this.updatePage = this.updatePage.bind(this);

    this.addHandler = this.addHandler.bind(this);
    this.funHandler = this.funHandler.bind(this);
    this.renameHandler = this.renameHandler.bind(this);
    this.publishHandler = this.publishHandler.bind(this);
    this.editHandler = this.editHandler.bind(this);
    this.removeHandler = this.removeHandler.bind(this);

    this.requestSearch = this.requestSearch.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
  }

  componentWillMount() {
    this.mounted = true;
    this.requestSearch();
  }

  componentWillUnmount() {
    this.mounted = false;
    this.props.actions.removeAllNotify();
  }

  formatIntl(formatId) {
    const {intl} = this.props;
    return intl ? intl.formatMessage({id:formatId}) : null;
    // return formatId;
  }

  requestSearch() {
    const {page, search} = this.state;
    const limit = page.get('pageSize');
    const offset = (page.get('current') - 1) * limit;
    const searchName = search.get('value');

    getProjectByName(0, searchName, data => {this.mounted && this.updatePageTotal(data);});
    searchProjectList(0, searchName, offset, limit, data => {this.mounted && this.updateSearch(data);});
  }

  updatePageTotal = (data) => {
    this.setState({page:this.state.page.update('total', v => data.length)});
  }

  updateSearch(data) {
    data = data.map(project => {
      return Object.assign({}, project, {'resolution':project.width + 'X' + project.height});
    });

    this.setState({data:Immutable.fromJS(data)});
  }

  typeChange(selectIndex) {
    this.state.type = this.state.type.update('index', v => selectIndex);
    this.setState({ type: this.state.type.update('value', v => this.state.type.getIn(['list', selectIndex, 'value'])) }, () => {
      this.requestSearch();
    });
  }

  searchChange(value) {
    this.setState({ search: this.state.search.update('value', v => value) });
  }

  searchSubmit() {
    this.updatePage(1);
  }

  pageChange(current, pageSize) {
    this.updatePage(current);
  }

  updatePage(current) {
    this.setState({ page: this.state.page.update('current', v => current) }, () => {
      this.requestSearch();
    });
  }

  addHandler() {
    const { actions } = this.props;
    const data = {
      id: '',
      name: '',
      width: 800,
      height: 600,
    };

    actions.overlayerShow(<PlayerListPopup intl={this.props.intl} title={this.formatIntl('mediaPublish.addPlan')} data={data}

      onCancel={() => { actions.overlayerHide(); }} onConfirm={(state) => {

        let data = {
          name: state.name,
          width: state.width,
          height: state.height,
        };

        addProject(data, (response) => {
          actions.overlayerHide();
          this.props.router.push({
            pathname: '/mediaPublish/playProject/' + response.id
          });
        });
      }} />);

  }

  funHandler(id) {

  }

  renameHandler(id){
    const { actions } = this.props;
    const row = getObjectByKey(this.state.data, 'id', id);
    const obj = row ? row.toJS() : {};
    const data = {
      id: obj.id,
      name: obj.name,
      width: obj.width,
      height: obj.height,
    };

    actions.overlayerShow(<PlayerListPopup IsModify={true} intl={this.props.intl} title={this.formatIntl('mediaPublish.modify')} data={data}
                                           onCancel={() => { actions.overlayerHide(); }} onConfirm={(state) => {
                                              // actions.applyClick("playerProject");
                                              const newData = {
                                                id: state.id,
                                                name: state.name,
                                                width: state.width,
                                                height: state.height,
                                              };
                                              updateProjectById(newData, ()=>{
                                                this.requestSearch();
                                              })
                                           }}/>)
  }

  publishHandler(id){
    const {actions} =this.props;
    if(this.publishResponse){
      return actions.addNotify(0, "请等待发布完成。");
    }
    this.publishResponse = true;
    projectPublish(id, ()=>{
      this.publishResponse = false;
      actions.addNotify(1, "发布成功。");
    });
  }

  editHandler(id) {
    const { actions } = this.props;
    const row = getObjectByKey(this.state.data, 'id', id);
    const obj = row ? row.toJS() : {};

    this.props.router.push({
      pathname: '/mediaPublish/playProject/' + obj.id
    });
  }

  removeHandler(id) {
    const { actions } = this.props;
    actions.overlayerShow(<ConfirmPopup iconClass="icon_popup_delete" tips={this.formatIntl('mediaPublish.isDeleteList')}
      cancel={() => { actions.overlayerHide(); }} confirm={() => {
        removeProjectById(id, () => {
          actions.overlayerHide();
          this.requestSearch();
        });
      }} />);
  }

  render() {
    const { type, search, page, data } = this.state;
    return <Content className="player-list">
      <div className="heading">
        <Select className="type" data={type}
          onChange={(selectIndex) => this.typeChange(selectIndex)} />
        <SearchText placeholder={search.get('placeholder')} value={search.get('value')}
          onChange={this.searchChange} submit={this.searchSubmit} />
        <button className="btn btn-primary add-playerList" onClick={() => this.addHandler()}><FormattedMessage id="button.add" /></button>
      </div>
      <div className="playerList-container">
        <Table columns={this.columns} data={data} isProject={true} isEdit={true} rowRename={this.renameHandler} rowPublish={this.publishHandler} rowEdit={this.editHandler} rowDelete={this.removeHandler} />
        <Page className={'page ' + (page.get('total') == 0 ? 'hidden' : '')} showSizeChanger pageSize={page.get('pageSize')}
          current={page.get('current')} total={page.get('total')} onChange={this.pageChange} />
      </div>
      <NotifyPopup/>
    </Content>;
  }
}

const mapStateToProps = state => {
  return {
    sidebarNode: state.mediaPublishProject.sidebarNode
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      overlayerShow: overlayerShow,
      overlayerHide: overlayerHide,
      applyClick: applyClick,
      addNotify: addNotify,
      removeAllNotify : removeAllNotify
    }, dispatch),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(PlayerList));
