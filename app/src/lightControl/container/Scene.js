/**
 * Created by a on 2017/8/24.
 */
import React,{Component} from 'react';
import Content from '../../components/Content'

import Select from '../../components/Select'
import SearchText from '../../components/SearchText'
import Page from '../../components/Page';
import SceneItem from '../component/SceneItem'

import {getSearchScene, getSearchSceneCount} from '../../api/scene'
import {getAssetList} from '../../api/asset'
import Immutable from 'immutable';
const lodash = require('lodash');
export default class Scene extends Component{
    constructor(props){
        super(props);
        this.state = {
            sort:Immutable.fromJS({list:[{id:1, value:'场景序号'},{id:2, value:'设备多少'}], index:0, value:'场景序号',placeholder:"排序"}),
            search:Immutable.fromJS({placeholder:'输入场景名称', value:''}),
            sceneList:[
               /* {id:1, name:"场景1", active:false, presets:[{id:1, name:"灯1"},{id:2, name:"屏幕"}]},
                {id:2, name:"场景2", active:false, presets:[{id:3, name:"灯1"},{id:4, name:"屏幕"}]},
                {id:3, name:"场景3", active:false, presets:[{id:5, name:"灯1"},{id:6, name:"屏幕"}]},
                {id:4, name:"场景4", active:false, presets:[{id:7, name:"灯1"},{id:8, name:"屏幕"}]},*/
            ],
            page: Immutable.fromJS({
                pageSize:12,
                current: 1,
                total: 0
            }),
        }

        this.assetList = [];

        this.sortChange = this.sortChange.bind(this);
        this.searchChange = this.searchChange.bind(this);
        this.onChange = this.onChange.bind(this);
        this.updatePage = this.updatePage.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
        this.activeClick = this.activeClick.bind(this);

        this.requestSearch = this.requestSearch.bind(this);
        this.initResult = this.initResult.bind(this);
        this.getAssetName = this.getAssetName.bind(this);
        this.initPageTotal = this.initPageTotal.bind(this);
    }

    componentWillMount(){
        this.mounted = true;
        getAssetList(data=>{
            if(this.mounted){
                this.assetList=data;
                this.setState(this.assetList, ()=>{this.requestSearch();});
            }})
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    requestSearch(){
        const {search, page} = this.state;

        let limit = page.get("pageSize");
        let offset = (page.get("current")-1)*limit;
        let value = search.get("value");

        getSearchScene(value, offset, limit, data=>{ this.mounted && this.initResult(data)})
        getSearchSceneCount(value, data=>{ this.mounted && this.initPageTotal(data)})
    }

    initResult(data){
        this.setState({sceneList:data},()=>{
            data.map(scene=>{
                this.getAssetName(scene);
            })
        });
    }

    getAssetName(scene){
        if(scene.presets)
        {
            let curIndex = lodash.findIndex(this.state.sceneList, sc=>{return sc.id == scene.id})
            this.state.sceneList[curIndex].presets = scene.presets.map(pre=>{
                let newAsset = lodash.find(this.assetList, (asset)=>{
                    return asset.id==pre.asset;
                })

                return Object.assign({}, pre, {name:newAsset?newAsset.name:""});
            })
            this.setState({sceneList:this.state.sceneList})
        }
    }

    initPageTotal(data){
        let page = this.state.page.set('total', data.count);
        this.setState({page: page});
    }

    activeClick(id){
        console.log(id);
    }

    searchSubmit(){
        this.updatePage(1);
    }

    onChange(current, pageSize) {
        this.updatePage(current);
    }

    updatePage(current){
        let page = this.state.page.set('current', current);
        this.setState({page: page}, ()=>{
            this.requestSearch();
        });
    }

    sortChange(selectIndex){
        this.setState({sort:this.state.sort.update('index', v=>selectIndex)})
        this.setState({sort:this.state.sort.update('value', v=>{
            return this.state.sort.getIn(['list', selectIndex, 'value']);
        })})
    }

    searchChange(value){
        this.setState({search:this.state.search.update("value", v=>value)});
    }

    render(){
        const {sort, search, sceneList,page} = this.state;
        console.log(sceneList);
        return (
            <Content className="list-lcc">
                <div className="heading">
                    <Select className="sort" data={sort} onChange={(selectIndex)=>this.sortChange(selectIndex)}/>
                    <SearchText className="search" placeholder={search.get('placeholder')} value={search.get('value')}
                                onChange={value=>this.searchChange(value)} submit={()=>this.searchSubmit()}/>
                </div>
                <div className="screen-container">
                    <div className="scroll-container">
                    {
                        sceneList.map(scene=>{
                            return <div key={scene.id} className="col-sm-4 scene-item-container">
                                <SceneItem className="col-sm-11" id={scene.id} name={scene.name} active={scene.active} asset={scene.presets}
                                    activeClick={this.activeClick}/>
                                </div>
                        })
                    }
                        </div>
                </div>
                <Page className={"page "+(page.get('total')==0?"hidden":'')} showSizeChanger pageSize={page.get('pageSize')}
                      current={page.get('current')} total={page.get('total')} onChange={this.onChange} />
            </Content>
        )
    }
}