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
import { MACValid ,checkDeviceId} from '../../util/index';


export default class SingleDeviceReplacePopup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [
            ],
            prompt:false,
            search:{
                placeholder: intlFormat({ en: 'please input the device Id', zh: '输入设备编号' }),
                value: '',
            },
            buttonConfirmDisabled: true,
        };

        this.onConfirm = this.onConfirm.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onChange = this.onChange.bind(this);
        this.requestReplace = this.requestReplace.bind(this);
    }

    onChange(e){
        let {search} = this.state;
        let value=checkDeviceId(e.target.value,search.value)
        let prompt = false;
        prompt = !MACValid(value);
        search = Object.assign({},{...search},{value:value});
        this.setState({search:search, prompt:prompt, buttonConfirmDisabled:prompt},()=>{
        });
    }

    onCancel() {
        this.props.overlayerHide();
    }
    
    onConfirm(e) { 
        const{selectedItem} = this.props;
        const{search} = this.state;
        let value = search.value;
        let requestValue   =   value.replace(/^\s+|\s+$/g,"");//过滤字符两边空格
        this.requestReplace(selectedItem,requestValue);
    }

    requestReplace(selectedItem, requestValue){
        setTimeout(()=>{
            //更新数据
            console.log("实现更新",selectedItem.id,"为",requestValue);
            this.props.overlayerHide();
        },300)
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
