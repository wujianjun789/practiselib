/**
 * Created by a on 2017/7/25.
 */
import React,{Component} from 'react'

import Content from '../../components/Content'
import MapView from '../../components/MapView'
export default class MapPreview extends Component{
    constructor(props){
        super(props)
        this.state = {
            selectDomain: {
                position: {
                    "device_id": 1,
                    "device_type": 'DEVICE',
                    x: 121.49971691534425,
                    y: 31.239658843127756
                },
                data: {
                    id: 1,
                    name: '上海市'
                }
            }
        }
    }

    render(){
        const {selectDomain} = this.state;
        return <Content>
            <MapView mapData={selectDomain}/>
            </Content>
    }
}