/**
 * Created by a on 2017/8/24.
 */
import React,{Component} from 'react';
import Content from '../../components/Content'

import Select from '../../components/Select'
import SearchText from '../../components/SearchText'
import SceneItem from '../component/SceneItem'

import Immutable from 'immutable';
export default class Scene extends Component{
    constructor(props){
        super(props);
        this.state = {
            sort:Immutable.fromJS({list:[{id:1, value:'场景序号'},{id:2, value:'设备多少'}], index:0, value:'场景序号',placeholder:"排序"}),
            search:Immutable.fromJS({placeholder:'输入策略名称', value:''}),
            sceneList:[
                {id:1, name:"场景1", active:false, asset:[{id:1, name:"灯1"},{id:2, name:"屏幕"}]},
                {id:2, name:"场景2", active:false, asset:[{id:3, name:"灯1"},{id:4, name:"屏幕"}]},
                {id:3, name:"场景3", active:false, asset:[{id:5, name:"灯1"},{id:6, name:"屏幕"}]},
                {id:4, name:"场景4", active:false, asset:[{id:7, name:"灯1"},{id:8, name:"屏幕"}]},
            ]
        }

        this.sortChange = this.sortChange.bind(this);
        this.searchChange = this.searchChange.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
        this.activeClick = this.activeClick.bind(this);
    }

    activeClick(id){
        console.log(id);
    }

    searchSubmit(){

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
        const {sort, search, sceneList} = this.state;
        return (
            <Content>
                <div className="heading">
                    <Select className="sort" data={sort} onChange={(selectIndex)=>this.sortChange(selectIndex)}/>
                    <SearchText className="search" placeholder={search.get('placeholder')} value={search.get('value')}
                                onChange={value=>this.searchChange(value)} submit={()=>this.searchSubmit()}/>
                </div>
                <div className="screen-container">
                    {
                        sceneList.map(scene=>{
                            return <div key={scene.id} className="col-sm-4 scene-item-container">
                                <SceneItem className="col-sm-11" id={scene.id} name={scene.name} active={scene.active} asset={scene.asset}
                                    activeClick={this.activeClick}/>
                                </div>
                        })
                    }
                </div>
            </Content>
        )
    }
}