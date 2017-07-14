import React, {PureComponent} from 'react';
import Panel from './Panel';
import PanelFooter from './PanelFooter';

export default class AlterPwPopup extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            oldPw: '',
            newPw: '',
            repPw: ''
        }
        this.onCancel = this.onCancel.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onCancel() {
        this.props.overlayerHide();
    }

    onConfirm() {
        this.props.overlayerHide();
        console.log(this.state);
    }

    onChange(e) {
        let id = e.target.id;
        this.setState({[id]: e.target.value});
    }

    render() {
        let {className=''} = this.props;
        let footer = <PanelFooter funcNames={['onCancel','onConfirm']} btnTitles={['取消','确认']} btnClassName={['btn-default', 'btn-primary']} btnDisabled={[false, false]} onCancel={this.onCancel} onConfirm={this.onConfirm}/>;
        return <div className={className}>
            <Panel className='panel-custom'  title='修改密码'  footer={footer} closeBtn={true} closeClick={this.onCancel}>
                <div className="form-group clearfix">
                    <label htmlFor="oldPw" className="col-sm-3 control-label">旧密码：</label>
                    <div className="col-sm-9">
                        <input type="password" className="form-control" id="oldPw" placeholder="输入旧密码" value={this.state.oldPw} onChange={this.onChange}/>
                    </div>
                </div>
                <div className="form-group clearfix">
                    <label htmlFor="newPw" className="col-sm-3 control-label">新密码：</label>
                    <div className="col-sm-9">
                        <input type="password" className="form-control" id="newPw" placeholder="输入新密码" value={this.state.newPw} onChange={this.onChange}/>
                    </div>
                </div>
                <div className="form-group clearfix">
                    <label htmlFor="repPw" className="col-sm-3 control-label">重复密码：</label>
                    <div className="col-sm-9">
                        <input type="password" className="form-control" id="repPw" placeholder="再次输入新密码" value={this.state.repPw} onChange={this.onChange}/>
                    </div>
                </div>
            </Panel>
        </div>
    }
}