/**
 * Created by a on 2017/9/18.
 */
import React,{Component} from 'react';

export default class Progress extends Component{
    constructor(props){
        super(props);
    }

    render(){
        const {className="", IsLabel=true, IsPercent=false, IsAnimation=false, min=0, max=100, cur=0} = this.props;

        let percent = cur*100/max+"%"
        let value = IsPercent?percent:cur+"/"+max;

        return <div className={"progress "+className}>
            <div className={"progress-bar "+(IsAnimation?"active":"")} role="progressbar" aria-valuenow={cur}
                aria-valuemin={min} aria-valuemax={max} style={{"width":percent}}>
                {IsLabel?value:<span className="sr-only">{value} Complete</span>}
            </div>
        </div>
    }
}
