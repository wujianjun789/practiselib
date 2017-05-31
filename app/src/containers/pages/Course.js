import React, { Component } from 'react';
import { connect } from 'react-redux';

import Results from '../../course/Results';
import Search from '../../course/Search';

import { active, search } from '../../actions';

class Left extends Component {

    render() {
        const { search = '', active = 0, onSearch, onActive, results = [] } = this.props;
        return (<div className="box  left">
            <div className="title">
                <span>联系人</span>
                <button className="btn normal-background-btn">
                    <i className="mi mi-Add"></i>
                </button>
            </div>
            <Search value={search} onSearch={onSearch} />
            <Results active={active} results={results} onActive={onActive} />
        </div>
        )
    }
}

class Mid extends Component {
    render() {
        const { result } = this.props;
        return (
            <div className="box  mid">
                {result ?
                    [<div key="tools" className="tools">
                        <button className="btn primary-background-btn last">
                            <i className="mi mi-More"></i>
                        </button>
                        <button className="btn primary-background-btn">
                            <i className="mi mi-Link"></i>
                        </button>
                        <button className="btn primary-background-btn">
                            <i className="mi mi-Edit"></i>
                        </button>
                        <button className="btn primary-background-btn ">
                            <i className="mi mi-Pin"></i>
                        </button>
                    </div>,

                    <div key="details" className="details">
                        {result.name}
                    </div>
                    ]
                    : null}

            </div>
        )

    }
}
class Right extends Component {
    render() {
        return (
            <div className="box  right">right</div>
        )
    }
}
export class Course extends Component {
    results_filter() {
        const { search = '', results = [] } = this.props;
        if (search) {
            return results.filter((v) => {
                return v.name.startsWith(search)
            })
        }

        return results;
    }
    render() {
        const { search = '', active = 0, onSearch, onActive } = this.props;
        const results = this.results_filter();
        const result = results[active];
        return (
            <div className="container">
                <Left search={search} active={active} onSearch={(evt) => onSearch(evt.target.value)} onActive={onActive} results={results} />
                <Mid result={result} />
                <Right />
            </div>
        )
    }
}

function mapStateToProps(state) {
    const { results, active, search } = state.course;
    return {
        results, active, search
    }
}
function mapDispatchToProps(dispatch) {
    return {
        onSearch: (value) => { dispatch(search(value)) },
        onActive: (index) => { dispatch(active(index)) }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Course);