/**
 * Created by a on 2017/10/17.
 */
import React,{Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import Content from '../../components/Content';
import Select from '../../components/Select';
import SearchText from '../../components/SearchText';
import Page from '../../components/Page'

import PlayerListItem from '../component/PlayerListItem';
import ConfirmPopup from '../../components/ConfirmPopup';

import {overlayerShow, overlayerHide} from '../../common/actions/overlayer'
import Immutable from 'immutable';
export class PlayerList extends Component{
    constructor(props){
        super(props);
        this.state = {
            type:Immutable.fromJS({list:[{id:1, value:'播放类型1'},{id:2, value:'播放类型2'}], index:0, value:'播放类型1'}),
            search: Immutable.fromJS({placeholder: '输入素材名称', value: ''}),
            page: Immutable.fromJS({
                pageSize: 10,
                current: 1,
                total: 2
            }),
            data: /*Immutable.fromJS(*/[
                {id:1, icon:"", name:"播放列表1", detail:""},
                {id:2, icon:"", name:"播放列表2", detail:""}
            ]/*)*/
        }

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

    requestSearch(){

    }

    typeChange(selectIndex){
        this.state.type = this.state.type.update("index", v=>selectIndex);
        this.setState({type:this.state.type.update("value", v=>this.state.type.getIn(["list", selectIndex, "value"]))},()=>{
            this.requestSearch();
        });
    }

    searchChange(value){
        this.setState({search:this.state.search.update("value", v=>value)});
    }

    searchSubmit(){
        this.updatePage(1);
    }

    pageChange(current, pageSize) {
        this.updatePage(current);
    }

    updatePage(current){
        this.setState({page: this.state.page.update("current", v=>current)}, ()=>{
            this.requestSearch();
        });
    }

    addHandler(){

    }

    publishHandler(id){

    }

    funHandler(id){

    }

    editHandler(id){

    }

    removeHandler(id){
        const {actions} = this.props;
        actions.overlayerShow(<ConfirmPopup iconClass="icon_popup_delete" tips={"是否删除选中播放列表？"}
                                                       cancel={()=>{actions.overlayerHide()}} confirm={()=>{
                                                }}/>);
    }

    render(){
        const {type, search, page, data} = this.state;
        return <Content>
            <div className="heading">
                <Select className="type" data={type}
                        onChange={(selectIndex)=>this.typeChange(selectIndex)}/>
                <SearchText placeholder={search.get('placeholder')} value={search.get('value')}
                            onChange={this.searchChange} submit={this.searchSubmit}/>
                <button className="btn btn-primary add-playerList" onClick={()=>this.addHandler()}>添加</button>
            </div>
            <div className="playerList-container">
                <ul className="list-group">
                    {
                        data.map(item=>{
                            return <li key={item.id} className="list-group-item">
                                <PlayerListItem data={item} publishHandler={this.publishHandler} funHandler={this.funHandler} editHandler={this.editHandler} removeHandler={this.removeHandler}/>
                            </li>
                        })
                    }
                </ul>
            </div>
            <Page className={"page "+(page.get('total')==0?"hidden":"")} showSizeChanger pageSize={page.get('pageSize')}
                  current={page.get('current')} total={page.get('total')} onChange={this.pageChange}/>
        </Content>
    }
}

const mapStateToProps=state=> {
    return {
        sidebarNode: state.mediaPublish.get('sidebarNode')
    }
}

const mapDispatchToProps=(dispatch)=> {
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
)(PlayerList);
