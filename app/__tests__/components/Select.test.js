/**
 * Created by a on 2017/7/21.
 */
import React from 'react';
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme';
import Select from '../../src/components/Select';

import Immutable from 'immutable';

const data = Immutable.fromJS({list:[{id:1, value:'域'},{id:2, value:'域2'}], index:0, value:'域'})
test('SidebarInfo renders', ()=>{

    const component = renderer.create(
        <Select data={data}/>
    )

    let select = component.toJSON();
    expect(select).toMatchSnapshot();
})

test('Select onChange', ()=>{
    const onChange = jest.fn();
    const component = shallow(<Select data={data} onChange={onChange}/>)

    component.simulate('change');
    expect(onChange).toHaveBeenCalledTimes(1);
})