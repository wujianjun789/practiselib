/**
 * Created by Azrael on 2017/9/1.
 */
import '../../../public/styles/smartLightManage-list.less';
import React,{Component} from 'react';
import Content from '../../components/Content';
export default class Screen extends Component {
    constructor(props){
        super(props);
    }

    render(){
        return <Content className="list-screen">
                    <div>Screen</div>
                </Content>
    }
}