import React, { Component } from 'react';

import '../../public/styles/rc-pagination.css';
import Pagination from 'rc-pagination';
//分页器
export default class Page extends Component {
    constructor(props) {
        super(props)
        this.paginationOnChange = this.paginationOnChange.bind(this);
    }

    paginationOnChange(page) {
        this.props.onChange && this.props.onChange(page);
    }

    render() {
        let props = this.props;
        return (
            <Pagination {...props} onChange={ this.paginationOnChange } />
        )
    }
}