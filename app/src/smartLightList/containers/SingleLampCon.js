/**
 * Created by Azrael on 2017/9/1.
 */
import '../../../public/styles/smartLightManage-list.less';
import React, {Component} from 'react';
import Content from '../../components/Content';
import SearchText from '../../components/SearchText';
import Select from '../../components/Select.1';
import Table from '../../components/Table2';
import Page from '../../components/Page';
export default class SingleLampCon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: {
                total: 0,
                current: 1,
                limit: 10
            },
            search: {
                value: '',
                placeholder: '请输入设备名称',

            },
            sidebarCollapse: false,
            data: [],
            selectDevice: {

            }
        };

        this.columns = [
            {field: 'name', title: '策略名称'},
            {field: 'sensorType', title: '传感器类型'}
        ];

        this.collpseHandler = this.collpseHandler.bind(this);
        this.pageChange = this.pageChange.bind(this);
        this.searchChange = this.searchChange.bind(this);

        this.initData = this.initData.bind(this);
    }

    componentWillMount() {
        this.mounted = true;
        this.initData();
    }

    componentWillUnmount() {
        this.mounted = false;
    }
    
    initData() {

    }

    pageChange(page) {
        this.setState({page: {...this.state.page, current: page}}, this.initData);
    }

    searchChange(value) {
        this.setState({
            search: {...this.state.search, value: value}
        })
    }

    collpseHandler(){
        this.setState({sidebarCollapse: !this.state.sidebarCollapse});
    }
  
    render() {
        const {page: {total, current, limit}, sidebarCollapse, data, search: {value, placeholder}} = this.state;
        return <Content className={`list-lc ${sidebarCollapse ? 'collapse' : ''}`}>
                    <div className="content-left">
                        <div className="heading">
                            <Select />
                            <Select />
                            <SearchText placeholder={placeholder} value={value} onChange={this.searchChange}/>
                        </div>
                        <div className="body">
                            <Table columns={this.columns} keyField='id' data={data} isEdit rowEdit={this.tableRowEdit} rowDelete={this.tableRowDelete} />
                            <Page className={`page ${total==0?"hidden":''}`} showSizeChanger pageSize={limit}
                                current={current} total={total} onChange={this.pageChange}/>
                        </div>
                    </div>
                    <div className={`container-fluid sidebar-info ${sidebarCollapse ? "sidebar-collapse" : ""}`}>
                        <div className="row collapse-container" onClick={this.collpseHandler}>
                            <span className={sidebarCollapse ? "icon_horizontal"  :"icon_verital"}></span>
                        </div>
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <span className="icon_sys_select"></span>选中设备
                            </div>
                            <div className="panel-body">
                                <span className="domain-name">{'To be or not to be'}</span>
                            </div>
                        </div>
                    </div>
                </Content>
    }
}