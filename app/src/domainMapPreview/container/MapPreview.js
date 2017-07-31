/**
 * Created by a on 2017/7/25.
 */
import React,{Component} from 'react'

import '../../../public/styles/domain-mapPreview.less';
import Content from '../../components/Content'
import MapView from '../../components/MapView'

import SearchText from '../../components/SearchText'

export default class MapPreview extends Component{
    constructor(props){
        super(props)
        this.state = {
            selectDomain: {
                id:"mapPreview",
                position: {
                    "id":"mapPreview",
                    "device_id": 1,
                    "device_type": 'DEVICE',
                    lng: 121.49971691534425,
                    lat: 31.239658843127756
                },
                data: {
                    id: 1,
                    name: '上海市'
                }
            },
            search:{placeholder:'  输入域名称搜索', value:'', datalist:[{id:1, value:"domain1"},{id:2, value:"domain2"}]}
        }

        this.onChange = this.onChange.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
    }

    onChange(value){
        const { search } = this.state;

        let newValue = Object.assign({}, search, {value:value});
        this.setState({search:newValue});
    }
    
    searchSubmit(){

    }

    render(){
        const {selectDomain, search} = this.state;
        return <Content className="map-preview">
            <MapView mapData={selectDomain}/>
            <SearchText IsTip={true} datalist={search.datalist} placeholder={search.placeholder} value={search.value}
                        onChange={this.onChange} submit={this.searchSubmit}/>
            </Content>
    }
}