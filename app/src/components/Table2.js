import React, {Component} from 'react';

import '../../public/styles/table.less';
import {FormattedMessage} from 'react-intl';
import {trimString} from '../util/string';

/**
 * Table 组件
 * keyField:string 指定key
 * columns:[{title,field},..others] 列属性显示，title：列名称，field：列属性
 * data:[{esn,name,...},..other]
 * allChecked:bool 全选或全取消属性
 * allCheckChange:Func(value:bool) 全选或全取消事件，value:true:全选，false:取消
 * rowCheckChange:Func(rowId:Num,value:bool) 选中或取消事件
 * rowEdit:Func(rowId:Num) 编辑事件
 * rowDelete:Func(rowId:Num) 删除事件
 */
export default class Table2 extends Component {
    constructor(props) {
        super(props);
        this.allCheckChange = this.allCheckChange.bind(this);
        this.rowCheckChange = this.rowCheckChange.bind(this);
        this.rowEdit = this.rowEdit.bind(this);
        this.rowDelete = this.rowDelete.bind(this);
        this.rowClick = this.rowClick.bind(this);
    }

    allCheckChange() {
        this.props.allCheckChange && this.props.allCheckChange();
    }

    componentDidMount(){
        
    }

    rowCheckChange(rowId, value) {
        this.props.rowCheckChange && this.props.rowCheckChange(rowId, value);
    }

    rowEdit(rowId) {
        this.props.rowEdit && this.props.rowEdit(rowId);
    }

    rowDelete(rowId) {
        this.props.rowDelete && this.props.rowDelete(rowId);
    }

    rowDomainEdit(rowId) {
        this.props.rowDomainEdit && this.props.rowDomainEdit(rowId);
    }

    rowModuleEdit(rowId) {
        this.props.rowModuleEdit && this.props.rowModuleEdit(rowId);
    }

    rowClick(row){
        this.props.rowClick && this.props.rowClick(row);
    }

    render() {
        let {columns=[], data=[], allChecked, keyField='id', isEdit, className='', activeId} = this.props;
        return (
            <div className={`table-responsive ${className}`}>
                <table className="table table-hover">
                    <thead>
                    <tr>
                        <th className={allChecked === undefined?'hidden':''}><input type="checkbox"
                                                                                    checked={allChecked}
                                                                                    onChange={this.allCheckChange}/>
                        </th>
                        {
                            columns.map((item, index)=> {
                                let title = trimString(item.title)
                                return <th key={index}>{title?<FormattedMessage id={title}/>:''}</th>
                            })
                        }
                        {
                            isEdit && <th></th>
                        }
                    </tr>
                    </thead>
                    <tbody>
                    {
                        data.map((row, index)=> {
                            let curId = row.id;
                            return <tr key={index} className={activeId && curId && activeId==curId ? 'active':''} onClick={()=>this.rowClick(row)}>
                                <td className={allChecked === undefined?'hidden':''}>
                                    {
                                        <input type="checkbox" checked={row.checked} onChange={(e)=>keyField && this.rowCheckChange(row[keyField],e.target.checked)}/>
                                    }
                                </td>
                                {
                                    columns.map(function (item, index) {
                                        if(typeof item.field === 'function' ) {
                                            return <td key={index}>{item.field(row)}</td>
                                        } else {
                                            return <td key={index}>{row[item.field]}</td>
                                        }
                                    })
                                }
                                {
                                    isEdit &&
                                        <td className = 'button-icon'>
                                            {row.role.name!="admin" && <a className="btn" onClick={()=>keyField && this.rowModuleEdit(row[keyField])}><span className="icon_module"></span><span className="module"><FormattedMessage id="permission.module"/></span></a>}                         
                                            {/* <a className="btn" onClick={()=>keyField && this.rowDomainEdit(row[keyField])}><span className="icon_domain"></span><span className="domain"><FormattedMessage id="permission.domain"/></span></a> */}
                                            <a className="btn" onClick={()=>keyField && this.rowEdit(row[keyField])}><span className="icon_edit"></span><span className="update"><FormattedMessage id="button.edit"/></span></a>
                                            <a className="btn" onClick={()=>keyField && this.rowDelete(row[keyField])}><span className="icon_delete"></span><span className="del"><FormattedMessage id="button.delete"/></span></a>
                                        </td>
                                }


                            </tr>
                        })
                    }
                    </tbody>
                </table>
            </div>
        )
    }
}