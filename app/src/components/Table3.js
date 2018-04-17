import React, {Component} from 'react';

import { FormattedMessage, injectIntl } from 'react-intl';
import '../../public/styles/table.less';
/**
 * Table 组件
 * keyField:string 指定key
 * columns:[{title,field},..others] 列属性显示，title：列名称，field：列属性
 * data:[{esn,name,...},..other]
 * allChecked:bool 全选或全取消属性
 * allCheckChange:Func(value:bool) 全选或全取消事件，value:true:全选，false:取消
 * rowCheckChange:Func(rowKey:Num,value:bool) 选中或取消事件
 * rowEdit:Func(rowKey:Num) 编辑事件
 * rowDelete:Func(rowKey:Num) 删除事件
 * collapsedClick:Func(rowKey:Num) 收缩展开事件
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

    rowCheckChange(rowKey, value) {
        this.props.rowCheckChange && this.props.rowCheckChange(rowKey, value);
    }

    rowEdit(rowKey) {
        this.props.rowEdit && this.props.rowEdit(rowKey);
    }

    rowDelete(rowKey) {
        this.props.rowDelete && this.props.rowDelete(rowKey);
    }

    rowClick(row){
        this.props.rowClick && this.props.rowClick(row);
    }

    rowCopy(row) {
        this.props.rowCopy && this.props.rowCopy(row);
    }

    collapsedClick(rowKey){
        this.props.collapseClick && this.props.collapseClick(rowKey,this.props.className,this.props.data);
    }

    render() {
        let {columns=[], data=[], allChecked, checked=[], keyField='id', isEdit, className='', activeId,collapsed=false} = this.props;
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
                            let curId = row.get(keyField);
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
                                        {item.field==columns[0].field && <span className={collapsed?(row.has("collapsed")?"glyphicon " + (row.get("collapsed") ? "glyphicon-triangle-right" : "glyphicon-triangle-bottom"):"glyphicon"):""}  onClick={()=>{this.collapsedClick(row.get(keyField))}}></span>}
                                        {row.get(item.field)}
                                        </td>
                                    })
                                }
                                {
                                    isEdit && (row.get('id')!==0?<td className="edit">
                                                {!row.get('plans') && <a className="btn" onClick={()=>keyField && this.rowCopy(row)}><span className="icon_copy"></span><span className="copy"><FormattedMessage id='button.copy'/></span></a>}                                    
                                                <a className="btn" onClick={()=>keyField && this.rowEdit(row.get(keyField))}><span className="icon_edit"></span><span className="update"><FormattedMessage id='button.edit'/></span></a>
                                                <a className="btn" onClick={()=>keyField && this.rowDelete(row.get(keyField))}><span className="icon_delete"></span><span className="del"><FormattedMessage id='button.delete'/></span></a>
                                            </td>
                                            :
                                            <td></td>)
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
