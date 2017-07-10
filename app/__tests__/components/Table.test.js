/**
 * Created by a on 2017/7/10.
 */
import React from 'react';
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme';
import Table from '../../src/components/Table';

test('SidebarInfo renders', ()=>{

    const component = renderer.create(
        <Table />
    )

    let table = component.toJSON();
    expect(table).toMatchSnapshot();
})

test('SidebarInfo div click', ()=>{
    const component = shallow(<Table />)

    component.find('tr').simulate('click');
})