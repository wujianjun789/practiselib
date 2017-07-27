import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Panel from '../../components/Panel';
import PanelFooter from '../../components/PanelFooter';
import {overlayerHide} from '../../common/actions/overlayer';
import '../../../public/styles/permissionManage.less';

class UserPopup extends Component{
    constructor(props){
        super(props);
        this.onCancel = this.onCancel.bind(this);
        this.onConfirm = this.onConfirm.bind(this);

    }

    onCancel(){
        this.props.action.overlayerHide();
    }

    onConfirm(){
        this.props.action.overlayerHide();
    }

    render() {
        let {className = ''} = this.props;
        let footer = <PanelFooter funcNames={['onConfirm','onCancel']} btnTitles={['保存','取消']} btnClassName={['btn-default', 'btn-primary']} btnDisabled={[false, false]} onCancel={this.onCancel} onConfirm={this.onConfirm}/>;
        return (
            <div className = {className}>
                <Panel title = '用户资料' footer = {footer} closeBtn = {true} closeClick = {this.onCancel}>
                    <div className = 'form-group row basic-info'>
                        <label className="col-sm-3 control-label">用户名:</label>
                        <div className="col-sm-9">
                            <input className="form-control"/>
                        </div>
                    </div>
                    <div className = 'form-group row module-per'>
                        <label className="col-sm-3 control-label">模块权限:</label>
                        <div className="col-sm-9">
                            <div className = 'row'>
                                <label className="checkbox-inline">
                                    <input type="checkbox" id="inlineCheckbox1" value="option1"/> 1
                                </label>
                                <label className="checkbox-inline">
                                    <input type="checkbox" id="inlineCheckbox2" value="option2"/> 2
                                </label>
                                <label className="checkbox-inline">
                                    <input type="checkbox" id="inlineCheckbox3" value="option3"/> 3
                                </label>
                            </div>
                            <div className = 'row'>
                                <label className="checkbox-inline">
                                    <input type="checkbox" id="inlineCheckbox1" value="option1"/> 1
                                </label>
                                <label className="checkbox-inline">
                                    <input type="checkbox" id="inlineCheckbox2" value="option2"/> 2
                                </label>
                                <label className="checkbox-inline">
                                    <input type="checkbox" id="inlineCheckbox3" value="option3"/> 3
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className = 'form-group row domain-per'>
                        <label className="col-sm-3 control-label">域权限:</label>
                        <div className="col-sm-9">

                        </div>
                    </div>
                </Panel>
            </div>
        )
    }
}

const mapStateToprops = (state, ownProps) => {
    return{
        permissionManage:state.permissionManage
    }
}

const mapDispatchToProps = (dispatch, ownProps) =>{
    return {
        action: bindActionCreators({
            overlayerHide:overlayerHide,
        }, dispatch)
    }
}

export default connect(mapStateToprops, mapDispatchToProps)(UserPopup) 