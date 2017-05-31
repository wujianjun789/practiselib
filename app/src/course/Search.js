import React, { Component } from 'react';


export default class Search extends Component {

    render() {
        const { value = "", onSearch } = this.props;
        const className = `btn clear-btn ${value === '' ? 'hidden' : ''}`
        return (
            <div className="search-container">
                <div className="search">
                    <input placeholder="搜索" value={value} onChange={onSearch} />
                    <button className={className} onClick={() => { onSearch({ target: { value: "" } }) }}>
                        <i className="mi mi-Clear"></i>
                    </button>
                </div>
            </div>
        )
    }
}