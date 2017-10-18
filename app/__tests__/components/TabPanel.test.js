/**
 * Created by a on 2017/10/16.
 */
import React from 'react';
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme';
import TabPanel from '../../src/components/TabPanel';

const data = [
    {id:1, title:'shanghai'},
    {id:2, title:'beijing'},
    {id:3, title:'guangzhou'},
]
test('tabPanel renders', ()=>{

    const component = renderer.create(
        <TabPanel data={data} activeId={1}/>
    )

    let tabPanel = component.toJSON();
    expect(tabPanel).toMatchSnapshot();
})

test('tabPanel render', ()=>{
    const component = shallow(<TabPanel data={data} activeId={1}/>)
    expect(component.find('.tab-panel').length).toEqual(1);
    expect(component.find('.tab-panel').find('.tab-header').length).toEqual(1);
    expect(component.find('.tab-panel').find('.tab-header').find('li').length).toEqual(3);
    expect(component.find('.tab-panel').find('.tab-content').length).toEqual(1);
})

test('tabPanel header click', ()=>{
    const click = jest.fn();
    const component = shallow(<TabPanel data={data} activeId={1}/>)

    expect(component.find('.tab-panel').find('.tab-header').at(0).find('.active').length).toEqual(1);
    component.find('.tab-panel').find('.tab-header').at(1).simulate('click');
    console.log("activeId:",component.state('activeId'));
    // expect(component.find('.tab-panel').find('.tab-header').at(0).find('.active').length).toEqual(1);
})
