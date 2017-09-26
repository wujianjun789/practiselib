import React,{PureComponent} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Panel from '../../components/Panel';
import PanelFooter from '../../components/PanelFooter';
import '../../../public/styles/permissionManage.less';
import {IsExitInArray} from '../../util/algorithm';

export default class ModulePopup extends PureComponent{
    constructor(props){
        super(props);
        const {data,isEdit=false} = this.props;
        this.onCancel = this.onCancel.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.getCheckedModule = this.getCheckedModule.bind(this);
    }

    onCancel(){
        this.props.overlayerHide();
    }

    onConfirm(){
        let data = {
            modules:this.getCheckedModule(),
            id:this.props.id
        }
        this.props.onConfirm(data,true);
        this.props.overlayerHide();
    }

    getCheckedModule(){
        let modules = document.getElementsByName('module');
        let checked_val = [];
        for(let i in modules){
            if(modules[i].checked)
                checked_val.push(modules[i].value);
        }
        return checked_val;
    }

    render() {
        let {className = '',title = '',modules,id,data=[]} = this.props;
        let footer = <PanelFooter funcNames={['onCancel','onConfirm']} btnTitles={['取消','确认']} btnClassName={['btn-default', 'btn-primary']} btnDisabled={[false, false]} onCancel={this.onCancel} onConfirm={this.onConfirm}/>;
        return (
            <Panel className={className} title = {title} footer = {footer} closeBtn = {true} closeClick = {this.onCancel}>
                <div className = 'form-group row module-per'>
                    <label className="control-label">模块权限:</label>
                    <div>
                        {
                            modules.map(item=>{
                                return <label className="checkbox-inline" key={item.key}>
                                    <input type="checkbox" name='module' value={item.key} defaultChecked={IsExitInArray(data,item.key)}/> {item.title}
                                </label>
                            })
                        }
                    </div>
                </div>
            </Panel>
        )
    }
}