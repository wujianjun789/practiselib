/**
 * Created by a on 2017/8/24.
 */
import React,{Component} from 'react';
import Content from '../../components/Content'
export default class Scene extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <Content>
                <div>场景</div>
            </Content>
        )
    }
}