import React from 'react';
import Panel from '../../../components/Panel';
import PreviewBody from './body';
import Footer from './footer';

// const PreviewContainerBody = (props) => {
//   return (<div id="preview-body">Body</div>);
// };

const PreviewContainer = (props) => {
  return (
    <Panel title="预览"
      className="preview-containers"
      footer={<Footer />}
      closeBtn={true}
      body={<PreviewBody />}
      closeClick={props.closeClick} />
  );
};

export default PreviewContainer;