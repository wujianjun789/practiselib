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
import Page from '../../components/Page'

import PlayerListItem from '../component/PlayerListItem';
import PlayerListPopup from '../component/PlayerListPopup';
import ConfirmPopup from '../../components/ConfirmPopup';

import { overlayerShow, overlayerHide } from '../../common/actions/overlayer'
import Immutable from 'immutable';
import { getObjectByKey } from '../../util/algorithm'

import { FormattedMessage, injectIntl } from 'react-intl';

export class PlayerList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: Immutable.fromJS({
                list: [{ id: 1, value: `${this.props.intl.formatMessage({ id: 'mediaPublish.playType' })} 1` },
                { id: 2, value: `${this.props.intl.formatMessage({ id: 'mediaPublish.playType' })} 2` }],
                index: 0, value: `${this.props.intl.formatMessage({ id: 'mediaPublish.playType' })} 1`
            }),
            search: Immutable.fromJS({ placeholder: this.props.intl.formatMessage({id:'mediaPublish.inputSchemeName'}), value: '' }),
            page: Immutable.fromJS({
                pageSize: 10,
                current: 1,
                total: 2
            }),
            data: Immutable.fromJS([
                { id: 1, icon: "", name: `${this.props.intl.formatMessage({id:'mediaPublish.playPlan'})} 1`, resolution: "1920X1080", width: 1920, height: 1080 },
                { id: 2, icon: "", name: `${this.props.intl.formatMessage({id:'mediaPublish.playPlan'})} 2`, resolution: "1920X1080", width: 1920, height: 1080 }
            ])
        }

        this.columns = [{ id: 1, field: "name", title:this.props.intl.formatMessage({id:'mediaPublish.schemeName'})},
             { id: 2, field: "resolution", title: this.props.intl.formatMessage({id:'mediaPublish.resolution'})}];

        this.typeChange = this.typeChange.bind(this);
        this.searchChange = this.searchChange.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
        this.pageChange = this.pageChange.bind(this);
        this.updatePage = this.updatePage.bind(this);

        this.addHandler = this.addHandler.bind(this);
        this.publishHandler = this.publishHandler.bind(this);
        this.funHandler = this.funHandler.bind(this);
        this.editHandler = this.editHandler.bind(this);
        this.removeHandler = this.removeHandler.bind(this);

        this.requestSearch = this.requestSearch.bind(this);
    }

    requestSearch() {

    }

    typeChange(selectIndex) {
        this.state.type = this.state.type.update("index", v => selectIndex);
        this.setState({ type: this.state.type.update("value", v => this.state.type.getIn(["list", selectIndex, "value"])) }, () => {
            this.requestSearch();
        });
    }

    searchChange(value) {
        this.setState({ search: this.state.search.update("value", v => value) });
    }

    searchSubmit() {
        this.updatePage(1);
    }

    pageChange(current, pageSize) {
        this.updatePage(current);
    }

    updatePage(current) {
        this.setState({ page: this.state.page.update("current", v => current) }, () => {
            this.requestSearch();
        });
    }

    addHandler() {
        const { actions } = this.props;
        const data = {
            playerId: '',
            playerName: '',
            width: 1920,
            height: 1080
        }

        actions.overlayerShow(<PlayerListPopup intl={this.props.intl} title={this.props.intl.formatMessage({id:'mediaPublish.addPlan'})} data={data}

            onCancel={() => { actions.overlayerHide() }} onConfirm={(state) => {
                actions.overlayerHide();
                const id = parseInt(Math.random() * 30);
                let item = { id: id, icon: "", name: state.playerName, resolution: state.width + "X" + state.height, width: state.width, height: state.height }
                this.setState({ data: this.state.data.push(Immutable.fromJS(item)) }, () => { console.log('size:', this.state.data.size) })
                this.props.router.push({
                    pathname: "/mediaPublish/playerArea",
                    state: {
                        item: item
                    }
                });
                // this.props.router.push('/playerArea');
            }} />)

    }

    publishHandler(id) {

    }

    funHandler(id) {

    }

    editHandler(id) {
        console.log("edit:", id);
        const { actions } = this.props;
        const row = getObjectByKey(this.state.data, 'id', id);
        const obj = row ? row.toJS() : {};
        // const data = {
        //     playerId: obj.id,
        //     playerName: obj.name,
        //     width: obj.width,
        //     height: obj.height
        // }
        //
        // actions.overlayerShow(<PlayerListPopup title="添加方案" data={data}
        //                                        onCancel={()=>{actions.overlayerHide()}} onConfirm={()=>{
        //      actions.overlayerHide();
        this.props.router.push({
            pathname: "/mediaPublish/playerArea",
            state: { item: obj }
        });
        // }}/>)
    }

    removeHandler(id) {
        const { actions } = this.props;
        actions.overlayerShow(<ConfirmPopup iconClass="icon_popup_delete" tips={this.props.intl.formatMessage({id:'mediaPublish.isDeleteList'})}

            cancel={() => { actions.overlayerHide() }} confirm={() => {
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
                <button className="btn btn-primary add-playerList" onClick={() => this.addHandler()}><FormattedMessage id='button.add' /></button>
            </div>
            <div className="playerList-container">
                <Table columns={this.columns} data={data} isEdit={true} rowEdit={this.editHandler} rowDelete={this.removeHandler} />
                <Page className={"page " + (page.get('total') == 0 ? "hidden" : "")} showSizeChanger pageSize={page.get('pageSize')}
                    current={page.get('current')} total={page.get('total')} onChange={this.pageChange} />
            </div>

        </Content>
    }
}

const mapStateToProps = state => {
    return {
        sidebarNode: state.mediaPublish.get('sidebarNode')
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({
            overlayerShow: overlayerShow,
            overlayerHide: overlayerHide,
        }, dispatch)
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(injectIntl(PlayerList))
