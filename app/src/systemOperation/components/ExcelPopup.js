import React, { Component }from 'react';
import PropTypes from 'prop-types';
import Panel from '../../components/Panel';
import PanelFooter from '../../components/PanelFooter';
import Table from '../../components/Table';
import Page from '../../components/Page';
import {excelImport} from '../../util/excel'
import Immutable from 'immutable';
import NotifyPopup from '../../common/containers/NotifyPopup';
import {addNotify, removeAllNotify} from '../../common/actions/notifyPopup'
import {getModelTypesNameById } from '../../data/systemModel';
import {getObjectByKeyObj} from '../../util/algorithm'

export default class ExcelPopup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:[],
            page:{
                pageSize: 10,
                current: 1,
                total: 0
            },
            filename:''
        }
        this.onChange = this.onChange.bind(this);
        this.pageChange = this.pageChange.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }

    onChange(e){
        const {addNotify,columns,model} = this.props;
        var target = e.target;        
        excelImport(e,model,columns).then(([data, filename]) => {
            if(data.length==0){
                addNotify(0, '导入Excel格式有误');
                target.value = '';
                return
            }
             
            let page = this.state.page;
            page.total = data.length;
            this.setState({data:data,page:page,filename:filename})
        });
    }

    pageChange(current) {
        let page = this.state.page;
        page.current = current;
        this.setState({page: page});
    }

    onConfirm() {
        this.props.overlayerHide();
        let isUpdate = document.getElementsByName('isUpdate')[0].checked;
        let datas = this.state.data.map(item=>{
            item.type=item.typeName;
            delete item.typeName;
            if(item.domainName){
                item.domainId=getObjectByKeyObj(this.props.domainList.options, 'name', item.domainName).id;
                delete item.domainName;            
            }
            return item;}
        )
        this.props.onConfirm && this.props.onConfirm(datas, isUpdate);        
    }

    onCancel() {
        this.props.overlayerHide();
    }

    render() {
        const {className,columns} =this.props;
        const {data,page,filename} =this.state;
        
        let result=Immutable.fromJS(data.slice((page.current-1)*page.pageSize,page.current*page.pageSize))
        let footer = <PanelFooter funcNames={['onCancel','onConfirm']} btnTitles={['取消','确认']} btnClassName={['btn-default', 'btn-primary']} btnDisabled={[false, false]} onCancel={this.onCancel} onConfirm={this.onConfirm}/>;    
        
        return <div className={ className }>
            <Panel title = '导入列表' footer = {footer} closeBtn = {true} closeClick = {this.onCancel}>
                <div className='row'>
                    <div className='import-select'>
                        {filename?filename:'选择列表文件路径'}
                        <label htmlFor='select-file' className='glyphicon glyphicon-link'></label>
                        <input id='select-file' type="file" onChange={this.onChange}/>                        
                    </div>
                    <input type="checkbox" name='isUpdate'/>覆盖已有设备
                </div>
                {
                    data.length !== 0 &&<div className="table-container">
                        <Table columns={ columns } data={ result }/>
                        <Page className={ "page " + (page.total == 0 ? "hidden" : '') } showSizeChanger pageSize={ page.pageSize } current={ page.current } total={ page.total } onChange={ this.pageChange }/>
                    </div>
                }
                <NotifyPopup />
            </Panel>
        </div>
    }
}
