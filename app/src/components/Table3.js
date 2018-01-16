import React, {Component} from 'react';

import { FormattedMessage, injectIntl } from 'react-intl';
import '../../public/styles/table.less';
import Collapse from 'antd/lib/collapse/Collapse';
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
 * collapsedClick:Func(rowId:Num) 收缩展开事件
 */
export default class Table extends Component {
    constructor(props) {
        super(props);
        this.allCheckChange = this.allCheckChange.bind(this);
        this.rowCheckChange = this.rowCheckChange.bind(this);
        this.rowEdit = this.rowEdit.bind(this);
        this.rowDelete = this.rowDelete.bind(this);
        this.rowClick = this.rowClick.bind(this);
    }

    allCheckChange(value) {
        this.props.allCheckChange && this.props.allCheckChange(value);
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

    rowClick(row){
        this.props.rowClick && this.props.rowClick(row);
    }

    collapsedClick(rowId){
        this.props.collapseClick && this.props.collapseClick(rowId,this.props.className,this.props.data);
    }

    render() {
        let {columns=[], data=[], allChecked, checked=[], keyField='id', isEdit, className='', activeId} = this.props;
        return (
            <div className={`table-responsive table-${className}`}>
                <table className="table table-hover">
                    <thead>
                    <tr>
                        <th className={allChecked === undefined?'hidden':''}><input type="checkbox"
                                                                                    checked={allChecked}
                                                                                    onChange={e=>this.allCheckChange(e.target.checked)}/>
                        </th>
                        {
                            columns.map((item, index)=> {
                                return <th key={index}>{item.title}</th>
                            })
                        }
                        {
                            isEdit && <th></th>
                        }
                    </tr>
                    </thead>
                    <tbody>
                    {
                        data.map((row, index) => {
                            let curId = row.get('id');
                            if(!row.get('hidden')){
                                return <tr key={index} className={activeId && curId && activeId==curId ? 'active':''} onClick={()=>this.rowClick(row)}>
                                <td className={allChecked === undefined?'hidden':''}>
                                    {
                                        <input type="checkbox" checked={checked.includes(curId)/* row.get('checked') */} onChange={(e)=>keyField && this.rowCheckChange(row.get(keyField),e.target.checked)}/>
                                    }
                                </td>
                                {
                                    columns.map((item, index)=>{
                                        return <td key={index}>
                                        {item.field==columns[0].field && <span className={row.has("collapsed")?"glyphicon " + (row.get("collapsed") ? "glyphicon-triangle-right" : "glyphicon-triangle-bottom"):"glyphicon"}  onClick={()=>{this.collapsedClick(row.get(keyField))}}></span>}
                                        {row.get(item.field)}
                                        </td>
                                    })
                                }
                                {
                                    isEdit &&
                                        row.get('type')?<td className="edit">
                                                <a className="btn" onClick={()=>keyField && this.rowEdit(row.get(keyField))}><span className="icon_edit"></span><span className="update"><FormattedMessage id='button.modify'/></span></a>
                                                <a className="btn" onClick={()=>keyField && this.rowDelete(row.get(keyField))}><span className="icon_delete"></span><span className="del"><FormattedMessage id='button.delete'/></span></a>
                                            </td>
                                            :
                                            <td></td>
                                }


                            </tr>
                            }
                            
                        })

                    }
                    </tbody>
                </table>
            </div>
        )
    }
}
