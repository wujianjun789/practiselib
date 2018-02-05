/**
 * Created by a on 2018/2/1.
 */
import React, { Component } from 'react';
import Content from '../../components/Content';
import Select from '../../components/Select.1';
import SearchText from '../../components/SearchText';
import '../../../public/styles/media-publish-screen.less'
export default class MediaPublishScreen extends Component {
    state = {
        sidebarCollapse: false,
        domainList: {
            titleField: 'name',
            valueField: 'name',
            options: [],
        },
        currentDomain: null,
    }
    componentWillMount(){
        this._isMounted=true;
        
    }
    handleCollapse = () => {
        this.setState({ sidebarCollapse: !this.state.sidebarCollapse })
    }
    handleSelectDomain = (e) => {
        const { domainList } = this.state;
        this.setState({ currentDomain: domainList.options[e.target.selectedIndex] },)
    }
    render() {
        const { sidebarCollapse, domainList,currentDomain, } = this.state;
        return (
            <Content id='media-publish-screen' class={`${sidebarCollapse ? 'mr60' : ''}`}>
                <div class='content-left'>
                    <div class='heading'>
                        <Select id='domain' titleField={domainList.titleField} valueField={domainList.valueField}
                            options={domainList.options}
                            value={currentDomain == null ? '' : currentDomain[this.state.domainList.valueField]}
                            onChange={this.handleSelectDomain} />
                    </div>
                    <div class='body'>
                    </div>
                </div>

                <div class={`sidebar-info ${sidebarCollapse ? 'sidebar-collapse' : ''}`}>
                    <div class='row collapse-container' onClick={this.handleCollapse}>
                        <span class={sidebarCollapse ? 'icon_horizontal' : 'icon_vertical'}></span>
                    </div>
                </div>
            </Content >
        )
    }
}