/**
 * Created by a on 2017/10/17.
 */
import React,{Component} from 'react';

import Content from '../../components/Content';
import Select from '../../components/Select';
import SearchText from '../../components/SearchText';

import PlayerListItem from '../component/PlayerListItem';

import Immutable from 'immutable';
export default class PlayerList extends Component{
    constructor(props){
        super(props);
        this.state = {
            type:Immutable.fromJS({list:[{id:1, value:'播放类型1'},{id:2, value:'播放类型2'}], index:0, value:'播放类型1'}),
            search: Immutable.fromJS({placeholder: '输入素材名称', value: ''}),
            data: /*Immutable.fromJS(*/[
                {id:1, icon:"", name:"播放列表1", detail:""},
                {id:2, icon:"", name:"播放列表2", detail:""}
            ]/*)*/
        }

        this.typeChange = this.typeChange.bind(this);
        this.searchChange = this.searchChange.bind(this);

        this.publishHandler = this.publishHandler.bind(this);
        this.funHandler = this.funHandler.bind(this);
        this.editHandler = this.editHandler.bind(this);
        this.removeHandler = this.removeHandler.bind(this);
    }

    typeChange(selectIndex){

    }

    searchChange(){

    }

    publishHandler(id){

    }

    funHandler(id){

    }

    editHandler(id){

    }

    removeHandler(id){

    }

    render(){
        const {type, search, data} = this.state;
        return <Content>
            <div className="heading">
                <Select className="type" data={type}
                        onChange={(selectIndex)=>this.typeChange(selectIndex)}/>
                <SearchText placeholder={search.get('placeholder')} value={search.get('value')}
                            onChange={this.searchChange} submit={this.searchSubmit}/>
                <button className="btn btn-primary add-playerList" onClick={()=>this.domainHandler('add')}>添加</button>
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
        </Content>
    }
}

/*
<div className="table-container">
    <Table columns={this.columns} data={data} activeId={selectDomain.data.length?selectDomain.data[0].id:""}
           rowClick={this.tableClick}/>
    <Page className={"page "+(page.get('total')==0?"hidden":"")} showSizeChanger pageSize={page.get('pageSize')}
          current={page.get('current')} total={page.get('total')} onChange={this.pageChange}/>
</div>*/
