/**
 * Created by a on 2017/10/19.
 */
import React,{Component} from 'react';

import Content from '../../components/Content';
import MapView from '../../components/MapView';
export default class MediaPublishMap extends Component{
    constructor(props){
        super(props);
        this.state = {
            map:{
                id: "mediaPublishMap",
                latlng: []
            }
        };
    }

    render(){
        const {map} = this.state;
        return <Content>
            <MapView mapData={map}></MapView>
        </Content>
    }
}