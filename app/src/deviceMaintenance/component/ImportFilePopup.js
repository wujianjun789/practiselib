/**
 * Created by m on 2017/10/23.
 */
import React, { Component } from 'react';
import Panel from '../../components/Panel';
import PanelFooter from '../../components/PanelFooter';
import PropTypes from 'prop-types';
import NotifyPopup from '../../common/containers/NotifyPopup';

export default class ImportFilePopup extends Component {
    constructor(props) {
        super(props);
        const { title='', placeholder='',success='', fail='' } = props.data;
        this.state = {
            title: title,
            placeholder: placeholder,
            success: success,
            fail: fail,
            replaceSuccess: false
        };

        this.onChange = this.onChange.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
    }

    onChange(e) {
        // console.log("显示被导入的文件名");
        if (e.target.value) {
            this.setState({ placeholder:e.target.value, replaceSuccess: true });
            // alert("导入成功")
        } else {
            // alert("导入失败")
        }
    }

    onClick() {
        console.log('导入文件');
    }

    onCancel() {
        this.props.overlayerHide();
    }

    onConfirm() {
        const {addNotify} = this.props;
        const notifyText = {
            success: this.state.success,
            fail: this.state.fail
        };
        const{ replaceSuccess } = this.state;
        if(replaceSuccess) {
            addNotify(1, notifyText.success);
            return;
        } else {
            addNotify(0, notifyText.fail);
            return;
        }
        this.props.overlayerHide();
        this.props.onConfirm && this.props.onConfirm(this.state);
    }

    render() {
        const { title, placeholder } = this.state;
        const { className } = this.props;
        const footer = <PanelFooter funcNames={ ['onCancel', 'onConfirm'] } 
            btnTitles={['取消', '确认']} btnClassName={['btn-default' ,'btn-primary']}
            btnDisabled={ [false, false] } onCancel={this.onCancel}
            onConfirm={this.onConfirm}/>;
        return (
            <div className={`${ className } inport-file-popup`}>
                <Panel title={title} closeBtn={ true } closeClick={ this.onCancel } footer={footer}>
                    <div className="form-group clearfix">
                        {/* <input type="file" className={ "form-control" } id="" placeholder={placeholder} onChange={ this.onChange }/> */}
                        <div className="a-upload" onClick={this.onClick}>
                            
                            {/* <input type="file" className={ "form-control" } id="" placeholder={placeholder} onChange={ this.onChange }/> */}
                            <input type="file" name="" id="link" value="" onChange={this.onChange} />{placeholder}
                            <span className="glyphicon glyphicon-link" id="icon-link" ></span>
                        </div>
                    </div>
                    <NotifyPopup/>
                </Panel>
            </div>
        );
    }
}
