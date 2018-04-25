import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import Panel from '../../../components/Panel';
import PreviewBody from './body';
import Footer from './footer';
import LoadingComponent from './loading/index';

const PreviewContainer = (props) => {
  const title = <FormattedMessage id="mediaPublish.preview" />;
  const bodyComponent = props.imgArray.length <= 0 ? <LoadingComponent /> : <PreviewBody imgArray={props.imgArray} totalTime={props.totalTime}/>;
  return (
    <Panel title={title}
      className="preview-containers"
      footer={<Footer onClick={props.closeClick}/>}
      closeBtn={true}
      body={bodyComponent}
      closeClick={props.closeClick} />
  );
};

export default injectIntl(PreviewContainer);