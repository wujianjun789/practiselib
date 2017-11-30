import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Panel from '../../components/Panel';
import PanelFooter from '../../components/PanelFooter';
import '../../../public/styles/permissionManage.less';
import {IsExitInArray,getObjectByKeyObj,spliceInArray} from '../../util/algorithm';
import {FormattedMessage} from 'react-intl';

export default class ModulePopup extends Component{
    constructor(props){
        super(props);
        const {data=[]} = this.props;
        this.state = {
            moduleList:data
        }
        this.onCancel = this.onCancel.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.moduleAdd = this.moduleAdd.bind(this);
        this.moduleDelete =this.moduleDelete.bind(this);
    }

    onCancel(){
        this.props.overlayerHide();
    }

    onConfirm(){
        let data = {
            modules:this.state.moduleList,
            id:this.props.id
        }
        this.props.onConfirm(data,true);
        this.props.overlayerHide();
    }

    moduleDelete(item){
        let {moduleList} = this.state;
        spliceInArray(moduleList,item);
        this.setState({moduleList:moduleList});
    }

    moduleAdd(item){
        let {moduleList} = this.state;
        moduleList.push(item);
        this.setState({moduleList:moduleList});        
    }

    render() {
        let {className = '',title = '',modules,id,data=[]} = this.props;
        let {moduleList} = this.state;
        let footer = <PanelFooter funcNames={['onCancel','onConfirm']} btnTitles={['button.cancel','button.confirm']} btnClassName={['btn-default', 'btn-primary']} btnDisabled={[false, false]} onCancel={this.onCancel} onConfirm={this.onConfirm}/>;
        return (
            <Panel className={className} title = {title} footer = {footer} closeBtn = {true} closeClick = {this.onCancel}>
                <div className = 'form-group row module-per'>
                    <label className="control-label"><FormattedMessage id='permission.module'/>:</label>
                    <div className="module-content">
                        <div className='all-module-list'>
                            <ul>
                            {
                                modules.map((item,index)=>{
                                    return <li key = {index}>
                                        {    
                                            IsExitInArray(moduleList,item.key)?<span className='list-node-add'><FormattedMessage id='permission.added'/></span>:<span className='glyphicon glyphicon-plus' onClick={()=>this.moduleAdd(item.key)}></span>
                                        }
                                        {<FormattedMessage id={item.title}/>}                                    
                                    </li>
                                })
                            }
                            </ul>
                        </div>
                        <div className='module-list'>
                            <ul>
                                {
                                    moduleList.map((item,index)=>{
                                        return <li key = {index}>
                                            <span className="icon-table-delete" onClick={()=>this.moduleDelete(item)}></span>
                                            {<FormattedMessage id={getObjectByKeyObj(modules,'key',item)['title']}/>}
                                        </li>
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </Panel>
        )
    }
}