/**
 * Created by a on 2017/10/19.
 */
import React,{Component} from 'react';

import '../../../public/styles/mediaPublish-map.less';

import Content from '../../components/Content';
import MapView from '../../components/MapView';
import SearchText from '../../components/SearchText';
export default class MediaPublishMap extends Component{
    constructor(props){
        super(props);
        this.state = {
            map:{
                id: "mediaPublishMap",
                latlng: []
            },
            search:{placeholder:'输入域名称搜索', value:'', curIndex:-1},
            placeholderList: [],
        };
    }

    onChange = (value)=>{
        const { search } = this.state;

        let newValue = Object.assign({}, search, {value:value});
        this.setState({search:newValue}, ()=>{
            this.updatePlaceholder();
        });
    }

    updatePlaceholder = ()=>{

    }

    render(){
        const {map, search, placeholderList} = this.state;
        return <Content>
            <MapView mapData={map}></MapView>
            <SearchText IsTip={true} datalist={placeholderList} placeholder={search.placeholder} value={search.value}
                        onChange={this.onChange} itemClick={this.itemClick} submit={this.searchSubmit}/>
        </Content>
    }
}