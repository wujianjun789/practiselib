import React from 'react';

const Footer = (props) => {
  return (
    <div id="project-preview-footer" className="clearfix">
      <button className="btn btn-primary" onClick={props.onClick}>确认</button>
    </div>
  );
};

export default Footer;