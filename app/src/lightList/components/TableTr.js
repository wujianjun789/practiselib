/**
 * Created by Azrael on 2017/9/15.
 */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
/**
 * 这里是注释
 * 这里是注释
 * 这里是注释
 * 这里是注释
 */
export default class TableTr extends PureComponent {
    static propTypes = {
        activeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        columns: PropTypes.arrayOf(PropTypes.shape({
            accessor: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
            title: PropTypes.string.isRequired
        }) ),
        willMountFuncs: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.func),
            PropTypes.func
        ]),
        rowClick: PropTypes.func
    }

    constructor(props) {
        super(props);
        this.state = {
            data: {...props.data},
        };

        this.onClick = this.onClick.bind(this);
        this.updateData = this.updateData.bind(this);
    }

    componentWillMount() {
        this.mounted = true;
        const {willMountFuncs} = this.props;
        if (Array.isArray(willMountFuncs)) {
            willMountFuncs.forEach(func => {func(this.updateData)});
        } else if (typeof willMountFuncs == 'function') {
            willMountFuncs(this.updateData);
        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    updateData(data) {
        this.mounted && this.setState({data: {...this.state.data, ...data}});
    }

    onClick() {
        this.props.rowClick && this.props.rowClick(this.state.data);
    }

    render() {
        const {data, data:{id}} = this.state;
        const {activeId, columns} = this.props;

        return (
            <tr className={(activeId || (typeof activeId == 'number' && activeId == 0) ) && activeId==id ? 'active':''} onClick={this.onClick}>
            {
                columns.map((item, index) => {
                    if(typeof item.accessor === 'function') {
                        return <td key={index}>{item.accessor(data)}</td>
                    } else if(typeof item.accessor === 'string') {
                        return <td key={index}>{data[item.accessor]}</td>
                    } else {
                        return <td key={index}></td>
                    }
                })
            }
            </tr>
        )
    }
}
