import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Panel from '../../components/Panel';
import PanelFooter from '../../components/PanelFooter';
import Table from '../../components/Table';
import Page from '../../components/Page';
import Immutable from 'immutable';
import NotifyPopup from '../../common/containers/NotifyPopup';
import { addNotify, removeAllNotify } from '../../common/actions/notifyPopup';
import { getModelTypesNameById } from '../../data/systemModel';
import { getObjectByKeyObj } from '../../util/algorithm';
import { FormattedMessage, FormattedDate } from 'react-intl';
import SearchText from '../../components/SearchText';
import { intlFormat } from '../../util/index';
import { MACValid } from '../../util/index';


export default class SingleDeviceReplacePopup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [
            ],
            prompt:false,
            // search: Immutable.fromJS({
            //     placeholder: intlFormat({ en: 'please input the device Id', zh: '输入设备编号' }),
            //     value: '',
            //   }),
            search:{
                placeholder: intlFormat({ en: 'please input the device Id', zh: '输入设备编号' }),
                value: '',
            },
            filename: '',
            buttonConfirmDisabled: true,
        };
        this.data =[
            {id:'000001',name:'更换对象1'},
            {id:'000002',name:'更换对象2'},
            {id:'000003',name:'更换对象3'},
        ]
        this.onConfirm = this.onConfirm.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onChange = this.onChange.bind(this);
        this.requestReplace = this.requestReplace.bind(this);
    }


    onChange(e){
        console.log("v:", e.target.value)
        let {search} = this.state;
        let value = e.target.value;
        let prompt = false;
        prompt = !MACValid(value);
        search = Object.assign({},{...search},{value:value});
        this.setState({search:search, prompt:prompt, buttonConfirmDisabled:prompt},()=>{
        });
    }

    onCancel() {
        this.props.overlayerHide();
    }


    requestReplace(value){
        //更换单一设备的编号
        let data = this.data;

    }
    
    onConfirm() {
        const{search} = this.state
        let value = search.value;
        let requestValue   =   value.replace(/^\s+|\s+$/g,"");//过滤字符两边空格

        this.requestReplace(value);

        //请求成功后的操作
        this.props.overlayerHide();

        let datas = this.state.data.map(item => {
            item.type = item.typeName;
            delete item.typeName;
            if (item.domainName) {
                item.domainId = getObjectByKeyObj(this.props.domainList.options, 'name', item.domainName).id;
                delete item.domainName;
            }
            return item;
        }
        );
        this.props.onConfirm && this.props.onConfirm(datas);
    }

    render() {
        const { className, columns, title } = this.props;
        const { data,search, filename,buttonConfirmDisabled, prompt } = this.state;
        let footer = <PanelFooter funcNames={['onCancel', 'onConfirm']} btnTitles={['button.cancel', 'button.confirm']}
            btnClassName={['btn-default', 'btn-primary']} btnDisabled={[false, buttonConfirmDisabled]}
            onCancel={this.onCancel} onConfirm={this.onConfirm} />;

        return <div className={className}>
            <Panel title={<FormattedMessage id='sysOperation.deviceReplace' />} footer={footer}
                closeBtn={true} closeClick={this.onCancel}>
                    <input type="search" className="form-control numInput" maxLength={ 16 } placeholder={search.placeholder} value={search.value} onChange={this.onChange}/>
                    <span className={ prompt? 'prompt ' : 'prompt hidden' }><FormattedMessage id="deviceNumIllegal"/></span>
                <NotifyPopup />
            </Panel>
        </div>;
    }
}
