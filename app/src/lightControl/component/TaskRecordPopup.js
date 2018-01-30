import React, {Component} from 'react';
import Panel from '../../components/Panel';
import Table from '../../components/Table';
import Immutable from 'immutable';
import Page from '../../components/Page';
import moment from 'moment';
import {getMomentDate, momentDateFormat} from '../../util/time';

export default class TaskRecordPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data:Immutable.fromJS([]),
      page: Immutable.fromJS({
        pageSize: 10,
        current: 1,
        total: 1,
      }),
    };
    this.columns =  [
      {id: 0, field:'create', title:this.formatIntl('app.task.create.time')},
      {id: 1, field: 'time', title: this.formatIntl('app.task.execute.time')},
      {id: 2, field: 'result', title: this.formatIntl('app.task.execute.result')},
    ];
  }

  componentWillMount() {
    this.mounted = true;
    this.requestSearch();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

    requestSearch=() => {
    //   const {search, page} = this.state;
    //   let cur = page.get('current');
    //   let size = page.get('pageSize');
    //   let offset = (cur - 1) * size;
      // getTaskRecord(this.props.id,(data)=>{
      //     this.mounted && this.initData(data)
      // });
      let data = [
        {
          id:1,
          create:moment(),
          time:moment(),
          result:'成功',
        },
      ];
      this.initData(data);       
    }

    initData=(data) => {
      let result = data.map(item => {
        item.create = item.create ? momentDateFormat(getMomentDate(item.create, 'YYYY-MM-DDTHH:mm:ss.SSSZ'),
          'YYYY-MM-DD HH:mm:ss') : '';
        item.time = item.time ? momentDateFormat(getMomentDate(item.time, 'YYYY-MM-DDTHH:mm:ss.SSSZ'),
          'YYYY-MM-DD HH:mm:ss') : '';
        return item;
      });
      this.setState({data:Immutable.fromJS(result)});
    }

    initPageSize=(data) => {
      let page = this.state.page.set('total', data.count);
      this.setState({
        page: page,
      });
    }

    pageChange=(current, pageSize) => {
      let page = this.state.page.set('current', current);
      this.setState({
        page: page,
      }, () => {
        // getTaskRecord(this.props.id,()=>{});
      });
    }

    formatIntl=(formatId) => {
      const {intl} = this.props;
      return intl ? intl.formatMessage({id:formatId}) : null;
    }

    onCancel=() => {
      this.props.onCancel && this.props.onCancel();
    }

    render() {
      let {className = '', title = ''} = this.props;
      let {data, page} = this.state;
      return (
        <Panel className={className} title={title} closeBtn={true} closeClick={this.onCancel}>
          <div className="table-container">              
            <Table columns={this.columns} data={data}/>
            <Page className={ 'page ' + (page.get('total') == 0 ? 'hidden' : '') } pageSize={ page.get('pageSize') }
              current={ page.get('current') } total={ page.get('total') } onChange={ this.pageChange }/>
          </div>
        </Panel>
      );
    }
}