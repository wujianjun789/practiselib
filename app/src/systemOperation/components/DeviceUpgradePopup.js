/**
 * created by m on 5/2 2018
 * 
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Panel from '../../components/Panel';
import PanelFooter from '../../components/PanelFooter';
import Table from '../../components/Table';
import Page from '../../components/Page';
import { excelImport } from '../../util/excel';
import Immutable from 'immutable';
import NotifyPopup from '../../common/containers/NotifyPopup';
import { addNotify, removeAllNotify } from '../../common/actions/notifyPopup';
import { getModelTypesNameById } from '../../data/systemModel';
import { getObjectByKeyObj } from '../../util/algorithm';
import { FormattedMessage, FormattedDate } from 'react-intl';
import SearchText from '../../components/SearchText';
import { Radio } from 'antd';
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;

export default class DeviceUpgradePopup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayStep1: true,
            checkedValue: 1,  //1为全部升级，2为部分升级
            // page: Immutable.fromJS({
            //     pageSize: 10,
            //     current: 1,
            //     total: 0,
            // }),
            checked: ['123', '124'],//定义多选框中被选中的选项
            search: Immutable.fromJS({
                placeholder: 'sysOperation.input.device',
                value: '',
            }),
            data: [],
            page: {
                pageSize: 10,
                current: 1,
                total: 1
            },
            filename: '',
            packageData: [
                "升级包1",
                "升级包2",
                "升级包3",
                "升级包4",
                "升级包5",
            ]
        };
        this.columns = [   //table中的colums数据
            // { id: '0', field: 'deviceNum', title:this.props.intl.formatMessage({id:'asset.type'}) },
            // { id: '0', field: 'deviceNum', title: () => { return (<FormattedMessage id='sysOperation.deviceNum' />) } },
            { id: '0', field: 'id', title: this.formatIntl('sysOperation.deviceNum') },
            { id: '0', field: 'name', title: this.formatIntl('sysOperation.deviceName') },
            { id: '0', field: 'domainName', title: this.formatIntl('sysOperation.deviceDomain') },
        ]
        this.formatIntl = this.formatIntl.bind(this);
        this.onChange = this.onChange.bind(this);
        this.pageChange = this.pageChange.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.checkedChange = this.checkedChange.bind(this);
        this.onNextStep = this.onNextStep.bind(this);
        this.onLastStep = this.onLastStep.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.rowCheckChange = this.rowCheckChange.bind(this);
        this.onPackageChange = this.onPackageChange.bind(this);
        this.onTimeSelect = this.onTimeSelect.bind(this);
        this.onTimeConfirm = this.onTimeConfirm.bind(this);
    }

    onChange(e) {
        console.log("e:", e.target.value);
    }

    checkedChange(e) {  //改变选中状态，当选中全选时，表格多选框不可选，反之可选，在这里对两种情况在state做设置
        let { checkedValue } = this.state;
        this.setState({
            checkedValue: e.target.value,
        });
    }

    rowCheckChange(curId, value) { //当表格中的某一项被选中，或者被取消选中，相应的改变要更换的设备列表，并存入数组,value=true/false
        let { checked } = this.state;
        console.log("value:", value);
        if (value) {//在checked中push curId

        } else {  //从checked中删除curId
            for (let i = 0; i < checked.length; i++) {
                if (checked[i] === value) {
                    checked.splice(i, 1)
                    return
                }
            }
        }

        this.setState({ checked: checked }); //重新setState更新视图

    }




    /**
     *  导入文件包后触发此事件，用以校验文件是否符合要求，
     *  如果符合要求写入包列表，更新视图，否则提示报错
     */
    onPackageChange(e) {
        let response = true;  //response为后台验证package结果,true or false
        if (response) {
            //提醒升级包合法，停留到当前页面，可以点击确定按钮
            //将当前包与原有包合并，并请求API，setState，更新视图，默认选中刚才加载的包，等待点击确定。
        } else {
            //报错升级包不合法，提示重新选择，停留到当前页面，不可点击确定按钮
        }



    }

    validatePackage() {

    }

    pageChange(current) {
        let page = this.state.page;
        page.current = current;
        this.setState({ page: page });
    }

    //对国际化的处理，如果没有定义国际化就不做处理，返回null
    formatIntl(formatId) {
        const { intl } = this.props;   //由父组件传入
        return intl ? intl.formatMessage({ id: formatId }) : null;
    }



    onCancel() { //取消升级操作
        this.props.overlayerHide();
    }

    onNextStep() {  //下一步
        let { displayStep1 } = this.state;
        this.setState({ displayStep1: !displayStep1 });
    }

    onLastStep() { //上一步
        let { displayStep1 } = this.state;
        this.setState({ displayStep1: !displayStep1 });
    }

    onTimeSelect(value, dateString) { //时间选择框状态发生变化
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
    }

    onTimeConfirm(value) { //确定选中的时间 
        console.log('选中的时间为: ', value);
        //将选中的时间传给api
    }
    selectChange() { }

    onConfirm() { //确定升级
        const { checkedValue, checked } = this.state;
        this.props.overlayerHide();
        //datas为要升级的设备的Id组成的数组
        let datas = []
        if (checkedValue == 1) { //如果是全部升级,将父级传过来的table data数据的设备Id全部存入一个数组allchecked

        } else if (checkedValue == 2) {//如果是部分升级，根据checked值获得被选中的设备列表updateList，并将其传入confirm函数
            datas = checked;
        }

        this.props.onConfirm && this.props.onConfirm(datas);  //将确定的指令以及更新的数据传回父级，父级写入服务器并重新setState,更新视图

    }

    render() {
        const { className, title, tableData } = this.props;
        const { page, filename, displayStep1, search, packageData, checked, checkedValue } = this.state;
        //tableData为父级页面传入的设备数据，result为根据表格尺寸需要显示的部分tableData内容
        let result = Immutable.fromJS(tableData.slice((page.current - 1) * page.pageSize, page.current * page.pageSize));
        let footer1 = <PanelFooter funcNames={['onCancel', 'onNextStep']} btnTitles={['button.cancel', 'button.nextStep']}
            btnClassName={['btn-default', 'btn-primary']} btnDisabled={[false, false]}
            onCancel={this.onCancel} onNextStep={this.onNextStep} />;
        let footer2 = <PanelFooter funcNames={['onLastStep', 'onConfirm']} btnTitles={['button.lastStep', 'button.confirm']}
            btnClassName={['btn-default', 'btn-primary']} btnDisabled={[false, false]}
            onLastStep={this.onLastStep} onConfirm={this.onConfirm} />;
        return <div className={className}>
            {displayStep1 && <Panel title={<FormattedMessage id='sysOperation.deviceUpgrade' />} footer={footer1}
                closeBtn={true} closeClick={this.onCancel}>
                <RadioGroup onChange={this.checkedChange} value={checkedValue}>
                    <Radio value={1}>所有设备</Radio>
                    <Radio value={2}>指定设备</Radio>
                </RadioGroup>
                <SearchText placeholder={this.props.intl.formatMessage({ id: search.get('placeholder') })}
                    value={search.get('value')} onChange={this.searchChange} submit={this.searchSubmit} />
                {
                    tableData.length !== 0 && <div className="table-container">
                        <Table columns={this.columns} data={result} checked={checked} allChecked={true}
                            titleCheck={false} rowCheckChange={this.rowCheckChange} />
                        <Page className={'page ' + (page.total == 0 ? 'hidden' : '')} showSizeChanger
                            pageSize={page.pageSize} current={page.current} total={page.total}
                            onChange={this.pageChange} />
                    </div>
                }
                <NotifyPopup />
            </Panel>}
            {!displayStep1 && <Panel title={<FormattedMessage id='sysOperation.deviceUpgrade' />}
                footer={footer2} closeBtn={true} closeClick={this.onCancel}>
                <div className="table-container updatebox" >
                    <ul>
                        {
                            packageData.map((item, index) => {
                                return <li key={index} className="list">{item}</li>
                            })
                        }
                    </ul>
                    {/* <span>选择升级包</span> */}
                    <div className="import-select">
                        <label htmlFor="select-file" className="glyphicon">选择升级包</label>
                        <input type='file' id="select-file" accept=".xls,.xlsx,.csv" placeholder=''
                            onChange={this.onPackageChange}></input>
                    </div>
                </div>
                <div className="row">
                    <div className='form-group left'>
                        <label>升级时间</label>

                        <select type="select" className="form-control select" placeholder={"选择升级时间"} value={"选择升级时间"}
                            onChange={this.selectChange} >
                            <option value="">选择升级时间</option>
                            <option value="现在升级">现在升级</option>
                            <option value="稍后升级">稍后升级</option>
                        </select>
                    </div>
                    <div className='form-group right'>
                        <label>开始时间</label>
                        {/* <input type="select" className="form-control" placeholder={"请选择开始时间"} value={""}
                            onChange={this.timeChange} /> */}
                        {/* datePicker */}
                        {/* <div>
                            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder="请选择开始时间"
                                onChange={this.onTimeSelect} onTimeConfirm={this.onTimeConfirm} />
                        </div> */}
                    </div>
                </div>
                <NotifyPopup />
            </Panel>}
            {/* </div> */}
        </div>;
    }
}
