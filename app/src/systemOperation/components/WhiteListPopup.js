import React,{Component} from 'react';
import Panel from '../../components/Panel';
import PanelFooter from '../../components/PanelFooter';
import SearchText from '../../components/SearchText';
import Table from '../../components/Table2';
import Immutable from 'immutable';

export default class WhiteListPopup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: Immutable.fromJS({
                placeholder: '输入素材名称',
                value: ''
            }),
        }

        this.columns = [
            {field: "name", title: "名称"},
            {field: "number", title: "编号"},
        ];

        this.onCancel = this.onCancel.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.searchChange = this.searchChange.bind(this);
        this.itemDelete = this.itemDelete.bind(this);
    }

    onCancel() {
        this.props.overlayerHide();
    }

    onConfirm() {
        this.props.overlayerHide();
        this.props.onConfirm && this.props.onConfirm();
    }

    onChange(e) {
        let id = e.target.id;
        this.setState({[id]: e.target.value});
    }

    onAdd() {
        this.props.onAdd && this.props.onAdd();
    }

    searchChange(value){
        this.setState({search:this.state.search.update('value', () => value)});
    }

    searchSubmit(){
        this.props.searchSubmit && this.props.searchSubmit(this.state.search.get('value'));
        this.setState({search: this.state.search.update('value', () => '')});
    }

    itemDelete(e) {
        this.props.itemDelete && this.props.itemDelete(e.target);
    }

    render() {
        let {className='', data} = this.props;
        let {search} = this.state;
        let footer = <PanelFooter funcNames={['onCancel','onConfirm']} btnTitles={['取消','确认']} btnClassName={['btn-default', 'btn-primary']} btnDisabled={[false, false]} onCancel={this.onCancel} onConfirm={this.onConfirm}/>;
        return <div className={className}>
            <Panel title='白名单' footer={footer} closeBtn={true} closeClick={this.onCancel}>
                <div className="row search-group">
                    <SearchText placeholder={search.get('placeholder')} value={search.get('value')} onChange={this.searchChange} submit={this.searchSubmit}/>
                    <button className="btn btn-primary" onClick={this.onAdd}>添加</button>
                </div>
                <div className="table-list">
                    <ul className="table-header">
                    {
                        this.columns.map((item, index) =>(<li key={index} className="tables-cell">{item.title}</li>))
                    }
                        <li className="tables-cell"></li>
                    </ul>
                    <div className="table-body">
                        <ul>
                        {
                            data.map((item, index) => (
                                <li key={item.id} className="body-row clearfix">
                                {
                                    this.columns.map((subItem, subIndex) => (
                                        <div key={subIndex} className="tables-cell">{item[subItem.field]}</div>
                                    ))
                                }
                                    <div className="tables-cell">
                                        <span id={item.id} className="glyphicon glyphicon-trash" onClick={this.itemDelete}></span>
                                    </div>
                                </li>
                            ))
                        }
                        </ul>
                    </div>
                </div>
            </Panel>
        </div>
    }
}