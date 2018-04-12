/**
 * Created by a on 2018/2/6.
 */
/**
 * Created by a on 2018/2/6.
 */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Panel from './../../components/Panel';

import NotifyPopup from '../../common/containers/NotifyPopup'
import {FormattedMessage,injectIntl} from 'react-intl';

export default class PreViewPopup extends PureComponent {
    constructor(props) {
        super(props);
        this.onCancel = this.onCancel.bind(this);
    }

    componentWillMount(){
        this.mounted = true;
    }

    componentWillUnmout(){
        this.mounted = false;
    }

    onCancel() {
        this.props.onCancel();
    }

    render() {
        const {title, data} = this.props;

        return <Panel className="preview-popup" title = {title} closeBtn = {true} closeClick = {this.onCancel}>
            <img src={data.url}/>
        </Panel>
    }
}

/*
PreViewPopup.propTypes = {
    title: PropTypes.string.isRequired,
    data: PropTypes.shape({
        url: PropTypes.string.isRequired,
    }).isRequired,
    onCancel: PropTypes.func.isRequired
}*/
