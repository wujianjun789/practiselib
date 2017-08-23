import React, {Component} from 'react';

import '../../public/styles/table.less'
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
export default class Table extends Component {
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
                            let curId = row.get('id');
                            return <tr key={index} className={activeId && curId && activeId==curId ? 'active':''} onClick={()=>this.rowClick(row)}>
                                <td className={allChecked === undefined?'hidden':''}>
                                    {
                                        <input type="checkbox" checked={row.get('checked')} onChange={(e)=>keyField && this.rowCheckChange(row.get(keyField),e.target.checked)}/>
                                    }
                                </td>
                                {
                                    columns.map(function (item, index) {
                                        return <td key={index}>{row.get(item.field)}</td>
                                    })
                                }
                                {
                                    isEdit &&
                                        <td className="edit">
                                        <a className="btn" onClick={()=>keyField && this.rowEdit(row.get(keyField))}><span className="update">修改</span><svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                                     width="20px" height="20px" viewBox="1 -2 20 20">
                                    <g className="logo_update" transform="scale(0.08,0.08)"
                                    fill="#8a8a8a">
                                    <path d="M69.294,129.412L110,117.859L80.941,88.976l-11.635,40.435H69.294z M178,50.282l-29.059-28.894
    L84.988,84.953l29.059,28.882L178,50.282L178,50.282z M169.529,157.271c0,10.035-8.141,18.176-18.176,18.176H42.235
    c-10.04,0-18.182-8.136-18.188-18.176V48.165C24.054,38.126,32.197,29.993,42.235,30c0.004,0,0.008,0,0.012,0h72.741l18.176-18.176
    H36.188c-16.728,0-30.293,13.554-30.306,30.282v121.212c0,16.737,13.568,30.306,30.306,30.306l0,0h121.224
    c16.733-0.006,30.294-13.573,30.294-30.306V66.353l-18.176,18.176V157.271L169.529,157.271z M191.506,26L173.341,7.953
    c-3.012-2.988-8.059-2.824-11.271,0.353l-8.706,8.682l29.059,28.882l8.718-8.659c3.212-3.2,3.376-8.212,0.365-11.2V26z"/>
                                    </g>
                                    <filter id="logoFilter" >
                                        <feGaussianBlur stdDeviation="15" />
                                    </filter> 
                                    </svg></a>
                                        <a className="btn" onClick={()=>keyField && this.rowDelete(row.get(keyField))}><span className="del">删除</span><svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                                     width="20px" height="20px" viewBox="1 -2 20 20">
                                    <g className="logo_del" transform="scale(0.08,0.08)"
                                    fill="#fa6262">
                                    <path d="M168.75,50H31.25C27.797,50,25,47.203,25,43.75s2.797-6.25,6.25-6.25h137.5
                                        c3.453,0,6.25,2.797,6.25,6.25S172.203,50,168.75,50z M118.75,25h-37.5C77.797,25,75,22.203,75,18.75s2.797-6.25,6.25-6.25h37.5
                                        c3.453,0,6.25,2.797,6.25,6.25S122.203,25,118.75,25z M43.75,62.5c3.453,0,6.25,2.797,6.25,6.25v93.75c0,6.903,5.597,12.5,12.5,12.5
                                        H75V68.75c0-3.453,2.797-6.25,6.25-6.25s6.25,2.797,6.25,6.25V175h25V68.75c0-3.453,2.797-6.25,6.25-6.25s6.25,2.797,6.25,6.25V175
                                        h12.5c6.903,0,12.5-5.597,12.5-12.5V68.75c0-3.453,2.797-6.25,6.25-6.25s6.25,2.797,6.25,6.25v93.75c0,13.806-11.194,25-25,25h-75
                                        c-13.806,0-25-11.194-25-25V68.75C37.5,65.297,40.297,62.5,43.75,62.5z"/>
                                    </g>
                                    <filter id="logoFilter" >
                                        <feGaussianBlur stdDeviation="15" />
                                    </filter> 
                                    </svg></a>
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