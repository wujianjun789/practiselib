/**
 * Created by a on 2017/9/5.
 */
import React,{Component} from 'react';
import {getDefaultIntl} from '../../intl/index'
import {getObjectByKey} from '../../util/index'
export default class LanguageSwitch extends Component{
    constructor(props){
        super(props);
        this.state = {
            curLan:{id:"zh",name:"简体中文", path:"icon_chinese"},
            list:[
                {id:"zh", name:"简体中文", path:"icon_chinese"},
                {id:"en", name:"ENGLISH", path:"icon_english"}
            ]
        }

        this.onClick = this.onClick.bind(this);
    }

    componentWillMount(){
        getDefaultIntl((intl)=>{
            this.setState({curLan:getObjectByKey(this.state.list, 'id', intl.locale)});
        })
    }

    onClick(data){
        this.setState({curLan:data},()=>{
            window.setLanguage(data.id);
        });
    }

    render(){
        const {className=''} = this.props;
        const {curLan, list} = this.state;
        return <div className={"language-switch "+className}>
                <div className="lanauage-icon">
                    <span className={curLan.path}></span>
                </div>
                <ul className="list-group">
                    {
                        list.map(item=>{
                            return <li key={item.id} className="list-group-item" onClick={()=>this.onClick(item)}>
                                <span className={item.path}></span>
                                <span>{item.name}</span>
                            </li>
                        })
                    }
                </ul>
            </div>
    }
}