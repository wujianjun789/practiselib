/**
 * Created by a on 2018/3/8.
 */
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import UserCenter from '../../common/containers/UserCenter';
import LanguageSwitch from '../../common/containers/LanguageSwitch';
import NotifyPopup from '../../common/containers/NotifyPopup';
import {addNotify} from '../../common/actions/notifyPopup';
import {FormattedMessage} from 'react-intl';

export class HeadBar extends Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick(event) {
    const {router, url} = this.props;
    router && router.push(url);
  }

  componentDidMount() {
  }

  render() {
    const {moduleName} = this.props;
    return <div className="head">
      <div className="home" onClick={this.onClick}>
        <span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
      </div>
      <span className="title">{<FormattedMessage id={moduleName}/>}</span>
      <UserCenter />
      <LanguageSwitch />
    </div>;
  }
}

const mapStateToProps = (state) => {
  return {
  };
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    addNotify:addNotify,
  }, dispatch),
});

export default connect(
  mapStateToProps, mapDispatchToProps
)(HeadBar);