import React, { Component } from 'react';
import Panel from '../../components/Panel';
import PanelFooter from '../../components/PanelFooter';
import Table from '../../components/Table';
import Page from '../../components/Page';
import {excelImport} from '../../util/excel';
import Immutable from 'immutable';
import NotifyPopup from '../../common/containers/NotifyPopup';
import {getObjectByKeyObj} from '../../util/algorithm';
import { FormattedMessage } from 'react-intl';

export default class ExcelPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data:[],
      page:{
        pageSize: 10,
        current: 1,
        total: 0,
      },
      filename:'',
    };
    this.onChange = this.onChange.bind(this);
    this.pageChange = this.pageChange.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  componentWillUnmount(){
    const {removeAllNotify} = this.props;
    removeAllNotify();
  }

  onChange(e) {
    const {addNotify, columns, model} = this.props;
    var target = e.target;        
    excelImport(e, model, columns).then(([data, filename]) => {
      let domainId = true;
      if (data.length == 0) {
        addNotify(0, 'import.format.error');
        target.value = '';
        return;
      }
      data.map(item => {
        let domain = getObjectByKeyObj(this.props.domainList.options, 'name', item.domainName);
        if (!domain) {domainId = false;}
      });
      if (!domainId) {
        addNotify(0, 'add.Domain');
        target.value = '';            
        return;
      }
      let page = this.state.page;
      page.total = data.length;
      this.setState({data:data, page:page, filename:filename});
    });
  }

  pageChange(current) {
    let page = this.state.page;
    page.current = current;
    this.setState({page: page});
  }

  onConfirm() {
    this.props.overlayerHide();
    let isUpdate = document.getElementsByName('isUpdate')[0].checked;
    let datas = this.state.data.map(item => {
      item.type = item.typeName;
      delete item.typeName;
      item.domainId = getObjectByKeyObj(this.props.domainList.options, 'name', item.domainName).id;
      delete item.domainName;            
      return item;
    }
    );
    this.props.onConfirm && this.props.onConfirm(datas, isUpdate);        
  }

  onCancel() {
    this.props.overlayerHide();
  }

  render() {
    const {className, columns} = this.props;
    const {data, page, filename} = this.state;
        
    let result = Immutable.fromJS(data.slice((page.current - 1) * page.pageSize, page.current * page.pageSize));
    let footer = <PanelFooter funcNames={['onCancel', 'onConfirm']} btnTitles={['button.cancel', 'button.confirm']}
      btnClassName={['btn-default', 'btn-primary']} btnDisabled={[false, false]} onCancel={this.onCancel}
      onConfirm={this.onConfirm}/>;    
        
    return <div className={ className }>
      <Panel title={<FormattedMessage id="sysOperation.importList"/>}  footer={footer} closeBtn={true} 
        closeClick={this.onCancel}>
        <div className="row">
          <div className="import-select">
            {filename ? filename : <FormattedMessage id="sysOperation.select"/>}
            <label htmlFor="select-file" className="glyphicon glyphicon-link"></label>
            <input id="select-file" type="file" accept=".xls,.xlsx" onChange={this.onChange}/>                        
          </div>
          <input type="checkbox" name="isUpdate"/>{<FormattedMessage id="sysOperation.cover"/>}
        </div>
        {
          data.length !== 0 && <div className="table-container">
            <Table columns={ columns } data={ result }/>
            <Page className={ 'page ' + (page.total == 0 ? 'hidden' : '') } pageSize={ page.pageSize }
              current={ page.current } total={ page.total } onChange={ this.pageChange }/>
          </div>
        }
        <NotifyPopup />
      </Panel>
    </div>;
  }
}
