/**
 * Created by a on 2017/4/19.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import '../../../public/styles/domainmanage.less';
import Content from '../../components/Content'
import SideBarInfo from '../../components/SideBarInfo'

import {} from '../../data/domainModel'
import Immutable from 'immutable';

export class DomainEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapse:false,

            selectDevice:{
                position:{
                    "device_id":1,
                    "device_type":'DEVICE',
                    x:121.49971691534425,
                    y:31.239658843127756
                },
                data:{
                    id:1,
                    name:'example'
                }
            }
        }

        this.columns = [{id:1, field:"name", title:"域名称"}, {field:"parentDomain", title:"上级域"}]

        this.onToggle = this.onToggle.bind(this);
        this.initTreeData = this.initTreeData.bind(this);
        this.collpseHandler = this.collpseHandler.bind(this);
    }

    componentWillMount(){
         this.initTreeData();
    }

    componentWillReceiveProps(nextProps){
        const {sidebarNode} = nextProps;
        if(sidebarNode){
            this.onToggle(sidebarNode);
        }
    }

    componentWillUnmount(){
        this.mounted = true;
    }

    initTreeData(){

    }

    onToggle(node){

    }

    collpseHandler(){
        this.setState({collapse: !this.state.collapse})
    }

    render() {
        const { collapse, selectDevice } = this.state
        return (
            <Content className={(collapse?'collapsed':'')}>
                <SideBarInfo mapDevice={selectDevice} collpseHandler={this.collpseHandler}/>
            </Content>
        )
    }
}


function mapStateToProps(state) {
    return {
        sidebarNode: state.domainManage.get('sidebarNode')
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
        }, dispatch)
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DomainEdit);