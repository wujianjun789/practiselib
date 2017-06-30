/**
 * Created by a on 2017/6/29.
 */
import React, { Component } from 'react';
export default class App extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div>
                welcome to starriver
                <button onClick={()=>location.href="/login"}>单击</button>
            </div>
        )
    }
}