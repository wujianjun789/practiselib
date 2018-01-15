import React,{Component} from 'react'
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Panel from '../../components/Panel';
import PanelFooter from '../../components/PanelFooter'
import Select from '../../components/Select'
import {getMomentDate, momentDateFormat,getMomentUTC,getCurHM, getDaysByYearMonth} from '../../util/time'
import {STRATEGY_NAME_LENGTH, Name2Valid} from '../../util/index'
import {dateAddZero} from '../../util/string'
import Immutable from 'immutable'

const date_year = "不限";
export default class TimeStrategyPopup extends Component{
    constructor(props){
        super(props);
        const {data={},isEdit=false} = this.props;
        let {name="", level='platform',retryCount='',retryInterval='',group=''} = data;
        this.state = {
            name:name,
            level:level,
            startTime:{
                year:Immutable.fromJS({value:"0",list:[]}),
                month:Immutable.fromJS({value:"1", list:[]}),
                date:Immutable.fromJS({value:"1", list:[]})
            },
            endTime:{
                year:Immutable.fromJS({value:"0",list:[]}),
                month:Immutable.fromJS({value:"1", list:[]}),
                date:Immutable.fromJS({value:"1", list:[]})
            },
            retryCount:retryCount,
            retryInterval:retryInterval,
            group:'',
            groupList:[
                {id:1,name:'组1'},
                {id:2,name:'组2'},
                {id:3,name:'组3'},
                {id:4,name:'组4'},
                {id:5,name:'组5'},
            ],
            search:'',
            prompt:{
                name:true,
                date:false,
            },
        },
        this.levelList={
            titleField: 'title',
            valueField: 'value',
            options: [
                {value: 'platform', title: this.formatIntl('app.strategy.platform')},
                {value: 'gateway', title: this.formatIntl('sysOperation.gateway')}
            ]
        }
    }

    componentWillMount(){
        this.mounted = true;
        const {startTime, endTime} = this.state
        let year = [];
        let month = [];
        let date = [];
        year.push({id:0, value:0, name:date_year})
        for(let i=2015;i<=2035;i++){
            year.push({id:i, value:i, name:i+' '+this.formatIntl('app.year')});
        }

        for(let j=1;j<=12;j++){
            month.push({id:j, value:(dateAddZero(j)), name:j+' '+this.formatIntl('app.month')});
        }

        date = this.getDatesList(getDaysByYearMonth(0, 1));

        let curDate = new Date();
        let nextDate = new Date(curDate);

        let yearValue = "";
        let monthValue = "";
        let dateValue = "";
        let nextYearValue = "";
        let nextMonthValue = "";
        let nextDateValue = "";
        if(this.props.startTime){
            yearValue = this.props.startTime.year
            monthValue = this.props.startTime.month
            dateValue = this.props.startTime.date
        }else{
            yearValue = curDate.getFullYear()
            monthValue = dateAddZero(curDate.getMonth()+1)
            dateValue = dateAddZero(curDate.getDate())
        }

        if(this.props.endTime){
            nextYearValue = this.props.endTime.year
            nextMonthValue = this.props.endTime.month
            nextDateValue = this.props.endTime.date
        }else{
            nextYearValue = nextDate.getFullYear()
            nextMonthValue = dateAddZero(nextDate.getMonth()+2)
            nextDateValue = dateAddZero(nextDate.getDate())
        }

        this.setState({
            startTime:{
                year:Immutable.fromJS({value:yearValue, list:year}),
                month:Immutable.fromJS({value:monthValue, list:month}),
                date:Immutable.fromJS({value:dateValue,list:date})
            },
            endTime:{
                year:Immutable.fromJS({value:nextYearValue,list:year}),
                month:Immutable.fromJS({value:nextMonthValue, list:month}),
                date:Immutable.fromJS({value:nextDateValue, list:date})
            }
        });
    }

    formatIntl=(formatId)=>{
        const {intl} = this.props;
        return intl?intl.formatMessage({id:formatId}):null;
        // return formatId;
    }

    getDatesList=(dates)=>{
        let date = [];
        for(let i=1;i<=dates;i++){
            date.push({id:i, value:(i<10?"0"+i:i), name:i+' '+this.formatIntl('app.day')});
        }

        return date;
    }

    onChange=(event)=>{
        let id = event.target.id;
        let value = event.target.value;
        let newValue;
        let prompt=false;
        if(id == "name"){
            prompt = !Name2Valid(value);
            this.setState({[id]:value, prompt:Object.assign({}, this.state.prompt, {[id]:prompt})});
            return;
        }
        this.setState({[id]:value});
    }

    timeValid=()=>{
        const {startTime, endTime} = this.state;
        let startYear = parseInt(startTime.year.get("value"));
        let startMonth = parseInt(startTime.month.get("value"));
        let startDate = parseInt(startTime.date.get("value"));
        let endYear = parseInt(endTime.year.get("value"));
        let endMonth = parseInt(endTime.month.get("value"));
        let endDate = parseInt(endTime.date.get("value"));

        let prompt = false;
        if(startYear>endYear){
            prompt = true;
        }else if(startYear==endYear){
            if(startMonth>endMonth){
                prompt = true;
            }else if(startMonth==endMonth){
                if(startDate>=endDate){
                    prompt = true;
                }
            }
        }else if(startYear == 0 &&　endYear != 0){
            prompt = true
        }else if(startYear != 0 && endYear == 0){
            prompt = true
        }

        this.setState({prompt:Object.assign({}, this.state.prompt, {date:prompt})});
    }

    dateOnChange=(id, childId, selectIndex)=>{
        let curNode = this.state[id][childId];
        let curValue = curNode.getIn(["list", selectIndex, "value"]);
        if(childId=="month"){
            let year = this.state[id].year.get("value");
            let days = getDaysByYearMonth(year, curValue);
            let date = this.getDatesList(days);
            this.setState({[id]:Object.assign({}, this.state[id], {[childId]:curNode.update("value", v=>curValue)}, {date:Immutable.fromJS({value:1, list:date})})}, this.timeValid)
            return;
        }

        this.setState({[id]:Object.assign({}, this.state[id], {[childId]:curNode.update("value", v=>curValue)})}, this.timeValid);
    }

    onConfirm=()=> {
        this.props.onConfirm && this.props.onConfirm(this.state);
    }

    onCancel=()=> {
        this.props.onCancel && this.props.onCancel();
    }

    searchSubmit=(value)=>{
        this.setState({search:value,group:value});
    }
    
    addGroup=()=>{
        const {search} = this.state;
    }

    render(){
        const {name, level, startTime, endTime,retryCount,retryInterval, prompt,groupList,group,search} = this.state;
        let {titleField, valueField, options} = this.levelList;
        let valid = prompt.name || !options.length || prompt.date;

        let footer = <PanelFooter funcNames={['onCancel','onConfirm']} btnTitles={['button.cancel','button.save']}
                                  btnClassName={['btn-default', 'btn-primary']}
                                  btnDisabled={[false, valid]} onCancel={this.onCancel} onConfirm={this.onConfirm}/>
        return <div className="time-strategy-popup">
            <Panel title={this.props.title} closeBtn={true} closeClick={this.onCancel} footer={footer}>
                <div className="form-group">
                    <label className="control-label" htmlFor="name" title={this.formatIntl('app.strategy.name')}>{this.formatIntl('app.strategy.name')}:</label>
                    <div className="input-container">
                        <input type="text" className="form-control" id="name" placeholder={this.formatIntl('app.input.strategy.name')}
                                maxLength={STRATEGY_NAME_LENGTH} value={name} onChange={this.onChange}/>
                        <span className={prompt.name?"prompt ":"prompt hidden"}>{this.formatIntl('mediaPublish.prompt')}</span>
                    </div>
                </div>
                <div className="form-group">
                    <label className="control-label" htmlFor="level" title={this.formatIntl('app.strategy.level')}>{this.formatIntl('app.strategy.level')}:</label>
                    <div className="input-container">
                        <select className="form-control" id="level" value={level?level[valueField]:""} onChange={this.onChange}>
                            {
                                options.map(item => <option key={item.title} value={item[valueField]}>{item[titleField]}</option>)
                            }
                        </select>
                        <span className={prompt.level?"prompt ":"prompt hidden"}>{this.formatIntl('sysOperation.select.device')}</span>                            
                    </div>

                </div>
                <div className="date-range">
                        <div className="form-group">
                            <label className="control-label" htmlFor="startTime">{this.formatIntl('app.date.range')}:</label>
                            <div className="input-container">
                                <div className="select-container">
                                    <Select className="form-control" id="startYear" valueKey="value" titleKey="name" data={startTime.year} onChange={selectIndex=>this.dateOnChange("startTime","year", selectIndex)}/>
                                </div>
                                <div className="select-container">
                                    <Select className="form-control" id="startMonth" valueKey="value" titleKey="name" data={startTime.month} onChange={selectIndex=>this.dateOnChange("startTime", "month", selectIndex)}/>
                                </div>
                                <div className="select-container last">
                                    <Select className="form-control" id="startDate" valueKey="value" titleKey="name" data={startTime.date} onChange={selectIndex=>this.dateOnChange("startTime", "date", selectIndex)}/>
                                </div>
                                <span className={prompt.date?"prompt":"prompt hidden"}>{this.formatIntl('app.date.error')}</span>                               
                            </div>
                            <span className="to">{this.formatIntl('mediaPublish.to')}</span>
                            <div className="input-container">
                                <div className="select-container">
                                    <Select className="form-control" id="endYear" valueKey="value" titleKey="name" data={endTime.year} onChange={selectIndex=>this.dateOnChange("endTime", "year", selectIndex)}/>
                                </div>
                                <div className="select-container">
                                    <Select className="form-control" id="endMonth" valueKey="value" titleKey="name" data={endTime.month} onChange={selectIndex=>this.dateOnChange("endTime", "month", selectIndex)}/>
                                </div>
                                <div className="select-container last">
                                    <Select className="form-control" id="endDate" valueKey="value" titleKey="name" data={endTime.date} onChange={selectIndex=>this.dateOnChange("endTime", "date", selectIndex)}/>
                                </div>
                            </div>
                        </div>
                </div>
                <div className="form-group">
                    <label className="control-label" htmlFor="retryCount" title={this.formatIntl('app.strategy.retryCount')}>{this.formatIntl('app.strategy.retryCount')}:</label>
                    <div className="input-container">
                        <input type="text" className="form-control" id="retryCount" value={retryCount} onChange={this.onChange}/>
                    </div>
                </div>
                <div className="form-group">
                    <label className="control-label" htmlFor="retryInterval" title={this.formatIntl('app.strategy.retryInterval')}>{this.formatIntl('app.strategy.retryInterval')}:</label>
                    <div className="input-container">
                        <input type="text" className="form-control" id="retryInterval" value={retryInterval} onChange={this.onChange}/>
                    </div>
                </div>
                <div className="form-group">
                    <label className="control-label" htmlFor="search" title={this.formatIntl('app.strategy.select.group')}>{this.formatIntl('app.strategy.select.group')}:</label>
                    <div className="search-list">
                        <input type="text" id="search" className="form-control" placeholder="请搜索或创建组" value={search} onChange={this.onChange}/>
                        <ul className="group-list">
                            {
                                groupList.map((item, index)=>{
                                    return item.name.indexOf(search)>-1?<li className={item.name===search?"active":""} key={index} value={item.name} onClick={()=>this.searchSubmit(item.name)}>{item.name}</li>:""
                                })
                            }
                            <li><span className="glyphicon glyphicon-plus" onClick={this.addGroup}></span>{`创建组“${search}”`}</li>                             
                        </ul>
                    </div>
                </div>
            </Panel>
        </div>
    }
}

TimeStrategyPopup.propTypes = {
    title: PropTypes.string.isRequired,
    // data: PropTypes.shape({
    //     name: PropTypes.string.isRequired,
    //     level: PropTypes.object.isRequired
    // }).isRequired,
    // levelList: PropTypes.shape({
    //     titleKey: PropTypes.string.isRequired,
    //     valueKey: PropTypes.string.isRequired,
    //     options: PropTypes.array.isRequired
    // }).isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
}