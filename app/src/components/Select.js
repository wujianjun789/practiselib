/**
 * Created by a on 2017/7/7.
 */
import React,{Component} from 'react'
import Immutable from 'immutable';

export default class Select extends Component{
    constructor(props){
        super(props)
        this.onChange = this.onChange.bind(this);
    }

    onChange(event){
        this.props.onChange && this.props.onChange(event && event.target.selectedIndex);
    }

    render(){
        const {className='', data=Immutable.fromJS({list:[],placeholder:'',value:''})} = this.props;
        return <select className={"select "+className} placeholder={data.get('placeholder')} value={data.get('value')} onChange={this.onChange}>
            {
                 data.get('list').map((option, index)=>{
                     let value = option.get('value');
                    return <option key={index} value={value}>{value}</option>
                })
            }

        </select>
    }
}