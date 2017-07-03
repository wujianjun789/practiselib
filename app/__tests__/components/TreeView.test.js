/**
 * Created by a on 2017/7/3.
 */
import React from 'react';
import {shallow} from 'enzyme'
import renderer from 'react-test-renderer'
import TreeView from '../../src/components/TreeView';

const TreeData=[
    {
        "name":"资产管理",
        "toggled": true,
        "active": true,
        "children": [
            {
                "name":"灯集中控制器灯集中控",
                "class":"glyphicon-list-alt",
                "active":false
            },
            {
                "name":"LED灯",
                "class":"glyphicon-lamp",
                "active":false
            }
        ]
    },
    {
        "name":"资产统计",
        "toggled": false,
        "active": true
    }
]
test('TreeView renders', ()=>{

    const component = renderer.create(
        <TreeView datalist={TreeData} />
    )

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
})

test('TreeView div click', ()=>{
    const component = shallow(<TreeView datalist={TreeData}/>)

    expect(component.find('.node').length).toEqual(4);

    component.find('.node').at(1).find('div').simulate('click');
    expect(component.find('.node').at(1).props().className).toEqual('node active');
})
