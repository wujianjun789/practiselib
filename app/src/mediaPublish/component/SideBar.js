/**
 * Created by a on 2017/10/24.
 */
import React, { Component } from 'react'
import { bindActionCreators } from 'redux';

// import {Treebeard} from 'react-treebeard';

// import treeStyle from './treeStyle';
import TreeView from '../../components/TreeView'

import { FormattedMessage, injectIntl } from 'react-intl';

export default class SideBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEdit: true,
            isRemove: false,
            isMove: true
        };

        this.onClick = this.onClick.bind(this);
        this.onToggle = this.onToggle.bind(this);
        this.onMove = this.onMove.bind(this);
        this.onProject = this.onProject.bind(this);
    }

    componentWillReceiveProps() {
        // console.log("receive receive");
    }

    componentDidUpdate(){
        // if(this.props.isClick){
        //     this.setState({isProject: false});
        // }
    }

    onMove(key, node){

    }

    onRemove = (node)=>{

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
        // this.setState({isProject: false},()=>{
            this.props.onToggle && this.props.onToggle(node);
        // })
    }

    onClick(id){
        if(id == 'edit' || id == 'complete'){
            this.setState({isProject:false, isEdit:!this.state.isEdit, isRemove:id=='edit'?true:false}, ()=>{this.props.onClick && this.props.onClick(id)})
        }else{
            if(id == "general" || id == "cycle" || id == "regular"){
                this.setState({isProject:false});
            }
            this.props.onClick && this.props.onClick(id);
        }
    }

    onProject(){
        // this.setState({isProject: true}, ()=>{
            this.props.onClick && this.props.onClick('project');
        // });
    }

    render() {
        const {data, title, isActive, isClick, isAddClick} = this.props;
        const {isEdit, isRemove, isMove}  = this.state;
console.log('isProject:', isActive);
        return <div className="sidebar">

            <div className="edit-container">
                <div className={"btn-group "+(isEdit?'':'hidden')}>
                    <button className="btn btn-primary" onClick={()=>this.onClick("add")}><FormattedMessage id='button.add'/>{isActive && !isClick && isAddClick && <span>&nbsp;&or;</span>}</button>
                    <button className="btn btn-gray" onClick={()=>this.onClick("edit")}><FormattedMessage id='button.edit'/></button>
                </div>
                <div className={"btn-group "+(isEdit?'hidden':'')}>
                    <button className="btn btn-primary" onClick={()=>this.onClick("remove")}><FormattedMessage id='button.delete'/></button>
                    <button className="btn btn-primary" onClick={()=>this.onClick("complete")}><FormattedMessage id='button.finish'/></button>
                </div>
            </div>
            <div className={"add-poppup "+(isActive && !isClick && isAddClick?'active':'')}>
                <span className="glyphicon glyphicon-triangle-top"></span>
                <span className="icon icon_mediaPublish_general" onClick={()=>this.onClick("general")}></span>
                <span className="icon icon_mediaPublish_cycle" onClick={()=>this.onClick("cycle")}></span>
                <span className="icon icon_mediaPublish_regular" onClick={()=>this.onClick("regular")}></span>
            </div>
            <div className={"title "+(isActive && !isClick ?'active':'')} onClick={()=>this.onProject()}>{title}</div>
            <TreeView className="mediaPublish" IsRemove={isRemove} IsMove={isMove} IsCancelSelect={isActive || isClick}
                      onToggle={ (node) => this.onToggle(node) } onMove={this.onMove} onRemove={this.onRemove}/>
            {/* <Treebeard data={data} style={treeStyle} onToggle={this.onToggle}/>*/}
        </div>
    }
}