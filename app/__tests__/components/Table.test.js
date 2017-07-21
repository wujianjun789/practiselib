/**
 * Created by a on 2017/7/10.
 */
import React from 'react';
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme';
import Table from '../../src/components/Table';

import Immutable from 'immutable'

const column=[{id:1, name:'name', field:'name'}, {id:1, address:'address', field:'address'}]
const data = Immutable.fromJS([{name:'xiaohong', address:'shanghai'}, {name:'xiaogang', address:'beijing'}])
test('table renders', ()=>{

    const component = renderer.create(
        <Table columns={column} data={data}/>
    )

    let table = component.toJSON();
    expect(table).toMatchSnapshot();
})

test('table tr click', ()=>{
    const click = jest.fn();
    const component = shallow(<Table columns={column} data={data} rowClick={click}/>)

    component.find('tr').at(1).simulate('click');
    expect(click).toHaveBeenCalledTimes(1);
})