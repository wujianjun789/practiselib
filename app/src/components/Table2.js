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
        console.log(this.props);
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
                            console.log(row)
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
                                            <a className="btn" onClick={()=>keyField && this.rowDomainEdit(row[keyField])}><span className="domain">域管理</span><svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                                     width="20px" height="20px" viewBox="1 -2 20 20">
                                    <g className="logo_domain" transform="scale(0.08,0.08)"
                                    fill="#8a8a8a">
                                    <path d="M8.882,25.317c0,7.617,0,139.543,0,149.846c0,10.303,7.023,16.079,16.36,16.079s136.972,0,149.706,0
    c15.883,0,16.791-16.604,16.791-16.604s0-134.492,0-149.974S175.434,8.385,175.434,8.385s-140.855,0-149.869,0
    S8.882,17.7,8.882,25.317z M40.112,22.693c9.348,0,24.515,0,24.515,0s0,12.686,0,26.774s-16.25,16.149-16.25,16.149H23.476
    c0,0,0-15.607,0-26.005S30.764,22.693,40.112,22.693z M160.698,177.377c-16.514,0-71.119,0-71.119,0s0-56.015,0-71.04
    s16.4-16.397,16.4-16.397h71.036v70.823C177.016,160.764,177.212,177.377,160.698,177.377z M177.016,77.064h-70.607
    c-22.159,0-30.335,17.684-30.335,29.417c0,6.296,0,70.897,0,70.897s-19.841,0-35.963,0S23.476,161.14,23.476,161.14V78.494h23.122
    c26.042,0,31.534-19.232,31.534-28.104s0-27.697,0-27.697h82.491c0,0,16.392-0.29,16.392,16.422S177.016,77.064,177.016,77.064z"/>
                                    </g>
                                    <filter id="logoFilter" >
                                        <feGaussianBlur stdDeviation="15" />
                                    </filter> 
                                    </svg></a>
                                            <a className="btn" onClick={()=>keyField && this.rowEdit(row[keyField])}><span className="update">修改</span><svg version="1.0" xmlns="http://www.w3.org/2000/svg"
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
                                            <a className="btn" onClick={()=>keyField && this.rowDelete(row[keyField])}><span className="del">删除</span><svg version="1.0" xmlns="http://www.w3.org/2000/svg"
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