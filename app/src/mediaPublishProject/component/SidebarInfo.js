/**
 * Created by a on 2018/3/8.
 */
import React,{Component} from 'react';

export default class SidebarInfo extends Component{
    constructor(props){
        super(props);
    }

    sidebarClick(){
        this.props.sidebarClick && this.props.sidebarClick();
    }

    render(){
        const {collapsed} = this.props;
        return <div ref="sidebarInfo" className={'sidebar-info '}>
            <div className="row collapse-container" onClick={() => this.sidebarClick()}>
                <span className={collapsed ? 'icon_horizontal' : 'icon_vertical'}></span>
            </div>
        </div>
    }
}