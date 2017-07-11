import React from 'react';

export default ({cancel, confirm}) => {
    return <div className="usr-exit">
        <div>
            <div><span className="icon icon-popup-exit"></span></div>
            是否退出？
        </div>
        <div className="btn-toolbar">
            <div className='btn-group'><button className="btn btn-default" onClick={cancel}>Cancel</button></div>
            <div className='btn-group'><button className="btn btn-primary" onClick={confirm}>Confirm</button></div>
        </div>
    </div>
}