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
            displayStep1: true, //初始状态，显示第一步的弹框
            checkedValue: 1,  //1为全部升级，2为部分升级
            // page: Immutable.fromJS({
            //     pageSize: 10,
            //     current: 1,
            //     total: 0,
            // }),
            checked: ['12', '13'],//定义多选框中被选中的选项的Id
            search: Immutable.fromJS({
                placeholder: 'sysOperation.input.device',
                value: '',
            }),
            updateOntime: false,//标志是否定时升级
            stateData: this.props.tableData,
            data: [],
            page: {
                pageSize: 4,
                current: 1,
                total: this.props.tableData.toJS().length,
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
        this.searchChange = this.searchChange.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
        this.selectChange = this.selectChange.bind(this);
        this.liLick = this.liLick.bind(this);
        this.mouseOver = this.mouseOver.bind(this);
        this.onClick = this.onClick.bind(this);
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
            // for (let i = 0; i < )
            let repetition = false;
            checked.map((item, index) => {
                if (item === curId) {
                    repetition = ture;
                }
            }
            )
            !repetition && checked.push(curId);//如果checked中没有重复的id那么就将该值push进入
            this.setState({ checked: checked });
        } else {  //从checked中删除curId
            for (let i = 0; i < checked.length; i++) {
                if (checked[i] === curId) {
                    checked.splice(i, 1)
                    this.setState({ checked: checked });
                }
            }
        }
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

    liLick(item) {
        console.log("item:", item)

    }

    mouseOver() {

    }
    onClick(e) {
        // let item = document.getElementById(e.target.id)
        let item = e.target
        let itemAll = item.parentNode.childNodes
        for (var key in itemAll) {
            console.log(key)
            console.log("333:", itemAll[key].className)
            if (itemAll[key].className) {
                itemAll[key].className = 'list'
            }
        }

        item.className = "bd list"
        console.log("item:", item)
        console.log("item2222:", item.parentNode.childNodes)

        // e.target
        // e.target.

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
    selectChange(e) {
        let { updateOntime } = this.state;
        if (e.target.value == '稍后升级') {
            this.setState({ updateOntime: true })
        } else {
            this.setState({ updateOntime: false })
        }
    }

    searchChange(value) { //搜索内容
        // let { search } = this.state;
        // search.update('value', v => v = value);   //错误的示范 
        // let content = search.update('value', v => v = value);  //可行的办法
        this.setState({ search: this.state.search.update('value', v => v = value) }); //immutable是不改变search本身的值的。只有通过setstate才能实现值的改变。
    }

    searchSubmit() {  // 提交搜索内容
        //查询tableData中的数据，获取匹配的数据，展现在列表中，以供选择。
        const { search, stateData, page } = this.state;
        const { tableData } = this.props;
        let totalData = tableData.toJS(); //被查询数据
        let queriedData = [];//过滤后的数据
        let queryString = search.toJS().value; //查询条件数据

        totalData.map((item, index) => {
            if (item.name.indexOf(queryString) >= 0) {
                //数据匹配
                queriedData.push(item);
            }
        })
        this.setState({ stateData: Immutable.fromJS(queriedData), page: Object.assign({}, page, { total: queriedData.length }) });
    }

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
        const { page, filename, displayStep1, search, packageData, checked, checkedValue, stateData } = this.state;
        //tableData为父级页面传入的设备数据，result为根据表格尺寸需要显示的部分tableData内容
        let result = Immutable.fromJS(stateData.slice((page.current - 1) * page.pageSize, page.current * page.pageSize));
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
                    stateData.length !== 0 && <div className={`table-container ${this.state.checkedValue == 1 ? "disabled" : ''}`}>
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
                    <ul className='package'>
                        {
                            packageData.map((item, index) => {
                                return <li key={index} className="list" id={`${index}`} onClick={this.onClick} onMouseOver={() => this.mouseOver(item)}>{item}</li>
                                // return <div key={index} className="list">{item}</div>
                            })
                        }
                    </ul>
                    {/* <span>选择升级包</span> */}
                    <div className="import-select">
                        <label htmlFor="select-file" className="glyphicon">添加升级包</label>
                        <input type='file' id="select-file" accept=".xls,.xlsx,.csv" placeholder=''
                            onChange={this.onPackageChange}></input>
                    </div>
                </div>
                <div className="row">
                    <div className='form-group left'>
                        <label>升级时间</label>

                        <select type="select" className="form-control select" placeholder={"选择升级时间"}
                            onChange={this.selectChange} >
                            <option hidden value="选择升级时间">选择升级时间</option>
                            <option value="现在升级">现在升级</option>
                            <option value="稍后升级">稍后升级</option>
                        </select>
                    </div>
                    <div className={`form-group right ${this.state.updateOntime ? '' : "disabled"}`}>
                        <label>开始时间</label>
                        <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder="请选择开始时间"
                            onChange={this.onTimeSelect} onTimeConfirm={this.onTimeConfirm} />
                    </div>
                </div>
                <NotifyPopup />
            </Panel>}
            {/* </div> */}
        </div>;
    }
}
