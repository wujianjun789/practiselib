/**
 * Created by a on 2017/9/11.
 */
import React,{Component} from 'react'

export default class SceneItem extends Component{
    constructor(props){
        super(props);

        this.activeClick = this.activeClick.bind(this);
    }

    activeClick(){
        const {id, activeClick}  = this.props;
        activeClick && activeClick(id);
    }

    render(){
        const {className, name, active, asset} = this.props;

        let assetName = "";
        asset.map((ass,index)=>{
            assetName += ass.name+(index<asset.length-1?"，":"");
        })
       return <div className={"panel panel-default scene-item "+className}>
           <div className="panel-heading">
               {name}
               <button className="btn btn-primary" onClick={this.activeClick}>激活</button>
           </div>
           <div className="panel-body">
               <span>包含设备:&nbsp;&nbsp;</span>{assetName}
           </div>
        </div>
    }
}