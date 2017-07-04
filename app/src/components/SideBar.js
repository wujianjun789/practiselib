/**
 * Created by a on 2017/7/4.
 */
import React,{Component} from 'react'
import TreeView from './TreeView'

export default class SideBar extends Component{
    constructor(props){
        super(props)
    }

    render(){
        const {TreeData} = this.props;
        return <div className="sidebar">
            <TreeView datalist={TreeData}/>
        </div>
    }
}