/**
 * Created by a on 2018/3/8.
 */
import React,{Component} from 'react';

export default class HeadBar extends Component{
    constructor(props){
        super(props);
    }

    onClick(key){
        this.props.onClick && this.props.onClick(key);
    }

    render(){
        const {isEdit} = this.props;
        return <div className="sidebar">
                <div className="edit-container">
                    <div className="glyphicon glyphicon-plus"></div>
                    <div className={"glyphicon glyphicon-edit "+(isEdit?"":"hidden")} onClick={()=>this.onClick('edit')}></div>
                    <div className="glyphicon glyphicon-arrow-up"></div>
                    <div className="glyphicon glyphicon-arrow-down"></div>
                    <div className="glyphicon glyphicon-remove"></div>
                </div>
            {this.props.children}
            </div>
    }
}
