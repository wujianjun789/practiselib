import React, { Component } from 'react'
import ReactDom from 'react-dom'
import NotifyPopup from '../../common/containers/NotifyPopup'


export default class Image extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filename: '',
            pathname: ''
        }
    }
    importMaterial = (e) => {
        const {addNotify}=this.props;
        const reader = new FileReader();
        const file = e.target.files[0];
        console.log(file.type)
        // if (!/image\/\w+/.test(file.type)) {
        //     alert('文件必须为图片格式!');
        //     return false;
        // }
        // reader.readAsDataURL(file);
        // reader.onload = function (e) {
        //     self.setState({ url: this.result })
        // }
        if(!/^image\/\w+/.test(file.type)){ 
            addNotify(0,'出错了')
            // alert('出错了')
        }

    }
    changeFileName = (e) => {
        this.setState({ filename: e.target.value })
    }
    render() {
        const { filename, pathname } = this.state;
        return (
            <div className='material'>
                <div>
                    <span>素材名称</span>
                    <input type='text' value={filename} onChange={this.changeFileName} />
                </div>
                <div className='import'>
                    <span>导入素材</span>
                    <div className='file-path'>
                        {pathname ? pathname : '选择列表文件路径'}
                        <label htmlFor='select-file' className='glyphicon glyphicon-link'></label>
                        <input type="file"  onChange={this.importMaterial} />
                    </div>
                </div>
                <div className='show'>
                    <img src={this.state.url} alt='image' />
                </div>
                <NotifyPopup/>
            </div>
        )
    }
}