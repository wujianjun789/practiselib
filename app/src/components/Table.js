import React, { Component } from 'react';

import { FormattedMessage, injectIntl } from 'react-intl';
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
 * titleCheck:bolean 表头全选框是否显示
 */
export default class Table extends Component {
    constructor(props) {
        super(props);
        this.allCheckChange = this.allCheckChange.bind(this);
        this.rowCheckChange = this.rowCheckChange.bind(this);
        this.rowRename = this.rowRename.bind(this);
        this.rowPublish = this.rowPublish.bind(this);
        this.rowEdit = this.rowEdit.bind(this);
        this.rowDelete = this.rowDelete.bind(this);
        this.rowClick = this.rowClick.bind(this);
        this.rowUpgrade = this.rowUpgrade.bind(this);
        this.rowReplace = this.rowReplace.bind(this);
    }

    allCheckChange(value) {
        this.props.allCheckChange && this.props.allCheckChange(value);
    }

    rowCheckChange(rowId, value) {
        this.props.rowCheckChange && this.props.rowCheckChange(rowId, value);
    }

    rowRename(rowId){
        this.props.rowRename && this.props.rowRename(rowId);
    }

    rowPublish(rowId){
        this.props.rowPublish && this.props.rowPublish(rowId);
    }

    rowUpgrade(rowId){
        this.props.rowUpgrade && this.props.rowUpgrade(rowId);
    }

    rowReplace(rowId){
        this.props.rowReplace && this.props.rowReplace(rowId);
    }

    rowEdit(rowId) {
        this.props.rowEdit && this.props.rowEdit(rowId);
    }

    rowDelete(rowId) {
        this.props.rowDelete && this.props.rowDelete(rowId);
    }

    rowClick(row) {
        this.props.rowClick && this.props.rowClick(row);
    }

    render() {
        let { columns = [], data = [], allChecked, titleCheck = true, checked = [], keyField = 'id', isProject, isEdit, isDevice, className = '', activeId } = this.props;
        return (
            <div className={`table-responsive ${className}`}>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            {titleCheck ? <th className={allChecked === undefined ? 'hidden' : ''}><input type="checkbox"
                                checked={allChecked}
                                onChange={e => this.allCheckChange(e.target.checked)} />
                            </th> :
                                <th>
                                </th>
                            }
                            {
                                columns.map((item, index) => {
                                    return <th key={index}>{item.title}</th>
                                })
                            }
                            {
                                isProject && <th></th>
                            }
                            {
                                isDevice && <th></th>
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
                                return <tr key={index} className={activeId && curId && activeId == curId ? 'active' : ''} onClick={() => this.rowClick(row)}>
                                    <td className={allChecked === undefined ? 'hidden' : ''}>
                                        {
                                            <input type="checkbox" checked={checked.includes(curId)/* row.get('checked') */}
                                                onChange={(e) => keyField && this.rowCheckChange(row.get(keyField), e.target.checked)} />
                                        }
                                    </td>
                                    {
                                        columns.map(function (item, index) {
                                            return <td key={index}>{row.get(item.field)}</td>
                                        })
                                    }
                                    {
                                        isProject &&
                                        <td className="edit project">
                                            <a className="btn" onClick={() => keyField && this.rowRename(row.get(keyField))}>
                                                <span className="icon_rename"></span>
                                                <span className="rename"><FormattedMessage id='button.rename' /></span>
                                            </a>
                                            <a className="btn" onClick={() => keyField && this.rowPublish(row.get(keyField))}>
                                                <span className="icon_upgrade"></span>
                                                <span className="publish"><FormattedMessage id='button.publish' /></span>
                                            </a>
                                        </td>
                                    }
                                    {
                                        isDevice &&
                                        <td className="edit device">
                                            <a className="btn" onClick={() => keyField && this.rowUpgrade(row.get(keyField))}>
                                                <span className="icon_upgrade2"></span>
                                                <span className="upgrade"><FormattedMessage id='sysOperation.deviceUpgrade' /></span>
                                            </a>
                                            <a className="btn" onClick={() => keyField && this.rowReplace(row.get(keyField))}>
                                                <span className="icon_replace"></span>
                                                <span className="replace"><FormattedMessage id='sysOperation.deviceReplace' /></span>
                                            </a>
                                        </td>
                                    }
                                    {
                                        isEdit &&
                                        <td className="edit">
                                            <a className="btn" onClick={() => keyField && this.rowEdit(row.get(keyField))}>
                                                <span className="icon_edit"></span>
                                                <span className="update"><FormattedMessage id='button.modify' /></span>
                                            </a>
                                            <a className="btn" onClick={() => keyField && this.rowDelete(row.get(keyField))}>
                                                <span className="icon_delete"></span>
                                                <span className="del"><FormattedMessage id='button.delete' /></span>
                                            </a>
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
