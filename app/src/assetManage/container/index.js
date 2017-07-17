/**
 * Created by a on 2017/7/17.
 */
import React,{Component} from 'react';

import HeadBar from '../../components/HeadBar'
import SideBar from '../../components/SideBar'
import Content from '../../components/Content'
export default class AssetManageIndex extends Component{
    constructor(props){
        super(props);
    }

    render(){
        let path = this.props.children.props.route.path;
        return <div className={"container "+"asset-"+path}>
            <HeadBar moduleName="资产管理"/>
            <SideBar onToggle={this.onToggle}/>
            {this.props.children}
        </div>
    }
}