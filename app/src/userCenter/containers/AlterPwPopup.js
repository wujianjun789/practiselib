import React, {PureComponent} from 'react';
import Panel from '../../components/Panel';
import PanelFooter from '../../components/PanelFooter';

export default class AlterPwPopup extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        let {className=''} = this.props;
        let footer = <PanelFooter funcNames={['onCancel','onConfirm']} btnTitles={['取消','确认']} btnClassName={['btn-default', 'btn-primary']} btnDisabled={[false, true]} />;
        return <div className={className}>
            <Panel className='panel-custom' title='修改密码' footer={footer} closeBtn={true} closeClick={()=>this.closeClick()}>
                <div className="form-group clearfix">
                    <label htmlFor="oldPw" className="col-sm-3 control-label">旧密码：</label>
                    <div className="col-sm-9">
                        <input type="text" className="form-control" id="oldPw" placeholder="输入旧密码" />
                    </div>
                </div>
                <div className="form-group clearfix">
                    <label htmlFor="newPw" className="col-sm-3 control-label">新密码：</label>
                    <div className="col-sm-9">
                        <input type="text" className="form-control" id="newPw" placeholder="输入新密码" />
                    </div>
                </div>
                <div className="form-group clearfix">
                    <label htmlFor="repPw" className="col-sm-3 control-label">重复密码：</label>
                    <div className="col-sm-9">
                        <input type="text" className="form-control" id="repPw" placeholder="再次输入新密码" />
                    </div>
                </div>
            </Panel>
        </div>
    }
}