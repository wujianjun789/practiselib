/**
 * Created by a on 2017/10/18.
 */
import React,{Component} from 'react';

export default class PlayerListItem extends Component{
    constructor(props){
        super(props);
        const {data} = props;
        this.state = {
            id: data?data.id:undefined,
            icon: data?data.icon:undefined,
            name: data?data.name:undefined
        }

        this.publishHandler = this.publishHandler.bind(this);
        this.funHandler = this.funHandler.bind(this);
        this.editHandler = this.editHandler.bind(this);
        this.removeHandler = this.removeHandler.bind(this);
    }

    publishHandler(id){
        this.props.publishHandler && this.props.publishHandler(id);
    }

    funHandler(id){
        this.props.funHandler && this.props.funHandler(id);
    }

    editHandler(id){
        this.props.editHandler && this.props.editHandler(id);
    }

    removeHandler(id){
        this.props.removeHandler && this.props.removeHandler(id);
    }
    
    render(){
        const {id, icon, name} = this.state;
        return <div className="playerList-item">
            <div className="static-group">
                <span className="icon"></span>
                <span className="name">{name}</span>
            </div>
            <div className="edit-group">
                <button className="btn btn-primary publish" onClick={()=>this.publishHandler(id)}>发布</button>
                <button className="btn btn-primary fun" onClick={()=>this.funHandler(id)}>功能</button>
                <button className="btn btn-primary edit" onClick={()=>this.editHandler(id)}>编辑</button>
                <button className="btn btn-primary remove" onClick={()=>this.removeHandler(id)}>删除</button>
            </div>
        </div>
    }
}