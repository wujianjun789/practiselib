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
            curLan:{id:"zh",name:"简体中文", path:"#zh"},
            list:[
                {id:"zh", name:"简体中文", path:"#zh"},
                {id:"en", name:"ENGLISH", path:"#en"}
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
                    <svg><use xlinkHref={curLan.path} transform="scale(0.1957,0.195)" x="-8" y="-45" viewBox="0 0 36 20" height="200" width="200"></use></svg>
                </div>
                <ul className="list-group">
                    {
                        list.map(item=>{
                            return <li key={item.id} className="list-group-item" onClick={()=>this.onClick(item)}>
                                <svg><use xlinkHref={item.path} transform="scale(0.13,0.13)" x="-8" y="-45" viewBox="0 0 28 17" width="200" height="200"/></svg>
                                <span>{item.name}</span>
                            </li>
                        })
                    }
                </ul>
            </div>
    }
}