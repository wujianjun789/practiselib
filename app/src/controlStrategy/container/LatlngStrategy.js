/**
 * Created by a on 2017/8/14.
 */
import React,{Component} from 'react';
import Content from '../../components/Content'

export default class LatStrategy extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return <Content className="latlng-strategy">
            latlng strategy
        </Content>
    }
}