/**
 * Created by a on 2017/10/24.
 */
import React, { Component } from 'react'
import { bindActionCreators } from 'redux';

// import {Treebeard} from 'react-treebeard';

// import treeStyle from './treeStyle';
import TreeView from '../../components/TreeView'

export default class SideBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isProject: false,
            isEdit: true,
            isRemove: false,
            isMove: true
        };

        this.onClick = this.onClick.bind(this);
        this.onToggle = this.onToggle.bind(this);
        this.onProject = this.onProject.bind(this);
    }

    componentWillReceiveProps() {
        // console.log("receive receive");
    }

    onToggle(node, toggled) {
        // if(this.state.cursor){
        //     this.state.cursor.active = false;
        // }
        //
        // node.active = true;
        // if(node.children){
        //     node.toggled = toggled;
        // }
        //
        // this.setState({cursor:node});
        this.setState({isProject: false},()=>{
            this.props.onToggle && this.props.onToggle(node);
        })
    }

    onClick(id){
        if(id == 'edit' || id == 'complete'){
            this.setState({isEdit:!this.state.isEdit, isRemove:id=='edit'?true:false}, ()=>{this.props.onClick && this.props.onClick(id)})
        }else{
            this.props.onClick && this.props.onClick(id);
        }
    }

    onProject(){
        this.setState({isProject: true});
    }
    render() {
        const {data} = this.props;
        const {isProject, isEdit, isRemove, isMove}  = this.state;
        return <div className="sidebar">

            <div className="edit-container">
                <div className={"btn-group "+(isEdit?'':'hidden')}>
                    <button className="btn btn-primary" onClick={()=>this.onClick("add")}>添加{isProject && <span>&nbsp;&or;</span>}</button>
                    <button className="btn btn-primary" onClick={()=>this.onClick("edit")}>编辑</button>
                </div>
                <div className={"btn-group "+(isEdit?'hidden':'')}>
                    <button className="btn btn-primary" onClick={()=>this.onClick("remove")}>删除</button>
                    <button className="btn btn-primary" onClick={()=>this.onClick("complete")}>完成</button>
                </div>
            </div>
            <div className={"add-poppup "+(isProject?'active':'')}>
                <span className="glyphicon glyphicon-triangle-top"></span>
                <span className="icon icon_file" onClick={()=>this.onClick("add")}></span>
                <span className="icon icon_file" onClick={()=>this.onClick("add")}></span>
                <span className="icon icon_file" onClick={()=>this.onClick("add")}></span>
            </div>
            <div className={"title "+(isProject?'active':'')} onClick={()=>this.onProject()}>国庆节方案</div>
            <TreeView className="mediaPublish" IsRemove={isRemove} IsMove={isMove} IsCancelSelect={isProject} onToggle={ (node) => this.onToggle(node) } />
            {/* <Treebeard data={data} style={treeStyle} onToggle={this.onToggle}/>*/}
        </div>
    }
}