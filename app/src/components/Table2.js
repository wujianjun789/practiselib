import React, {Component} from 'react';

import '../../public/styles/table.less';
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
                                        return <td key={index}>{row[item.field]}</td>
                                    })
                                }
                                {
                                    isEdit &&
                                        <td className = 'button-icon'>
                                            <a className="btn" onClick={()=>keyField && this.rowModuleEdit(row[keyField])}><svg><use xlinkHref={"#logo_module"} className="logo_module" transform="scale(0.075,0.075)" x="0" y="0" viewBox="1 -2 20 20" width="200" height="200"/></svg><span className="module">模块权限</span></a>                                            
                                            <a className="btn" onClick={()=>keyField && this.rowDomainEdit(row[keyField])}><svg><use xlinkHref={"#logo_domain"} className="logo_domain" transform="scale(0.075,0.075)" x="0" y="0" viewBox="1 -2 20 20" width="200" height="200"/></svg><span className="domain">域管理</span></a>
                                            <a className="btn" onClick={()=>keyField && this.rowEdit(row[keyField])}><svg><use xlinkHref={"#logo_update"} className="logo_update" transform="scale(0.075,0.075)" x="0" y="0" viewBox="1 -2 20 20" width="200" height="200"/></svg><span className="update">修改</span></a>
                                            <a className="btn" onClick={()=>keyField && this.rowDelete(row[keyField])}><svg><use xlinkHref={"#logo_del"} className="logo_del" transform="scale(0.08,0.08)" x="0" y="0" viewBox="1 -2 20 20" width="200" height="200"/></svg><span className="del">删除</span></a>
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