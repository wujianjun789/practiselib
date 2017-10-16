/**
 * Created by a on 2017/10/13.
 */
import React,{Component} from 'react';

import '../../public/styles/tabPanel.less';

export default class TabPanel extends Component{
    constructor(props){
        super(props);
        const {data, activeId} = props;
        this.state = {
            activeId: activeId != undefined?activeId:(data && data.length?data[0].id:"")
        }
        this.tabClick = this.tabClick.bind(this);
    }

    tabClick(id, index){
        const {data} = this.props;
        this.setState({activeId:data[index].id}, ()=>{
            this.props.tabClick && this.props.tabClick(id, index);
        });
    }

    render(){
        const {className, data} = this.props;
        const {activeId} = this.state;

        return <div className={"tab-panel "+(className?className:"")}>
            <ul className="tab-header">
                {
                    data && data.map((item, index)=>{
                        return <li key={item.id} className={item.id==activeId?"active":""} onClick={()=>{this.tabClick(item.id, index)}}>{item.title}</li>
                    })
                }
            </ul>
            <div className="tab-content">
                {
                    this.props.children
                }
            </div>
        </div>
    }
}