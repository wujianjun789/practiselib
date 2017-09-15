/**
 * Created by Azrael on 2017/9/15.
 */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
/**
 * table container with thead
 */
export default class TableWithHeader extends PureComponent {
    static propTypes = {
        className: PropTypes.string,
        columns: PropTypes.arrayOf(PropTypes.shape({
            field: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired
        }) ),
        children: PropTypes.arrayOf(PropTypes.node)
    }

    render() {
        const {className, columns, children} = this.props;
        return (
            <div className={`table-responsive ${className}`}>
            <table className="table table-hover">
                <thead>
                <tr>
                    {
                        columns.map((item, index)=> {
                            return <th key={index}>{item.title}</th>
                        })
                    }
                </tr>
                </thead>
                <tbody>
                    {children}
                </tbody>
            </table>
        </div>
        )
    }
}