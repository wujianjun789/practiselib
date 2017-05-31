import React, { Component } from 'react';
import Item from './Item';
export default class Results extends Component {

    render() {
        const { results = [], active, onActive } = this.props;
        return (
            <div className="entities">
                {results.map((v, i) => {
                    return <Item avatar={v.avatar} name={v.name} key={i} actived={active === i ? true : false}
                        onClick={() => { onActive(i) }}
                    />
                })}
            </div>
        )
    }
}