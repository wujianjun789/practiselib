/**
 * Created by a on 2017/8/1.
 */
import React,{Component} from 'react'

import {getDomainListByParentId} from '../../api/domain'

import {getLanguage} from '../../util/index'
export default class Topology extends Component{
    constructor(props){
        super(props)
        this.state = {
            language: getLanguage(),
            domainList:getLanguage()=="zh"?[
                {id:1, name:"中国中国中国", active:true, children:[
                    {id:11, name:"上海", active:true, children:[
                        {id:112, name:"徐汇"},
                        {id:113, name:"浦东新区新区浦东"},
                        {id:111, name:"闵行区", active:true, children:[
                            {id:1113, name:"颛桥镇"},
                            {id:1111, name:"莘庄镇", active:true, children:[
                                {id:11111, name:"疏影路"},
                                {id:11112, name:"西环路"}
                            ]},
                            {id:1112, name:"七宝镇"},
                            {id:1114, name:"华漕镇"}
                        ]}]
                    },
                    {id:12, name:"北京"}]
                },
                {id:2, name:"日本"}
            ]:[
                {id:1, name:"ChinaChina", active:true, children:[
                    {id:11, name:"Shanghai", active:true, children:[
                        {id:112, name:"xuhui"},
                        {id:113, name:"pudongxinqu"},
                        {id:111, name:"minhangqu", active:true, children:[
                            {id:1113, name:"zhuanqiaozheng"},
                            {id:1111, name:"xinzhuanzhen", active:true, children:[
                                {id:11111, name:"shuyinglu"},
                                {id:11112, name:"xihuanlu"}
                            ]},
                            {id:1112, name:"qibaozhen"},
                            {id:1114, name:"huacaozhen"}
                        ]}]
                    },
                    {id:12, name:"beijing"}]
                },
                {id:2, name:"Japan"}
            ]
        }

        this.getDatalist = this.getDatalist.bind(this);
        this.renderChild = this.renderChild.bind(this);
        this.itemClick = this.itemClick.bind(this);
        this.requestDomain = this.requestDomain.bind(this);
        this.initDomain = this.initDomain.bind(this);
        this.updateDomain = this.updateDomain.bind(this);
    }

    componentWillMount(){
        this.mounted = true;
        this.requestDomain(null);
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    requestDomain(parentId){
        getDomainListByParentId(parentId, (parentId,data)=>{this.mounted && this.initDomain(parentId, data)})
    }

    initDomain(parentId, data){
        if(parentId == null){
            this.setState({domainList:data})
            return;
        }

        let newlist = this.updateDomain(parentId, data, this.state.domainList);
        this.setState({domainList:newlist});
    }

    updateDomain(parentId, data, list){
        return list.map(domain=>{
            if(this.IsCurGroup(parentId, list)){
                if(domain.id == parentId){
                    // if(data.length){
                        domain.active = true;
                    // }

                    domain.children = data;
                    return domain;
                }else{
                    // if(!data.length){
                        domain.active = false;
                    // }
                }
            }

            if(domain.children && domain.children.length){
                this.updateDomain(parentId, data, domain.children)
            }
            return domain;
        })
    }

    IsCurGroup(parentId, list){
        for(let key in list){
            if(list[key].id == parentId){
                return true;
            }
        }

        return false;
    }

    itemClick(item){
        this.requestDomain(item.id);
        this.props.itemClick && this.props.itemClick(item);
    }

    getDatalist(list, renderList){
        list.map(domain=>{
            domain.active && renderList.push(domain) && domain.children && this.getDatalist(domain.children, renderList);

        })
    }

    renderChild(list, depth){
        return <ul key={depth} className={"topology-"+depth+" "+(list && list.length?'children':'')}>
            {
                list.map(item=>{
                    let value = item.name.slice(0, this.state.language=='zh'?6:10);
                    return <li key={item.id} className={(item.active?'active ':' ')+(item.children && item.children.length?'children':'')} title={item.name}
                    onClick={()=>this.itemClick(item)}><div>{value}</div></li>
                })
            }
        </ul>
    }

    render(){
        const {language, domainList} = this.state;

        let curDomain = domainList
        let renderList = [];
        this.getDatalist(curDomain, renderList);

        return <div className={"topology-mode "+language}>
            {
                this.renderChild(curDomain, 0)
            }
            {
                renderList.map((domain, index)=>{
                    return this.renderChild(domain.children, index+1)
                })
            }
        </div>
    }
}