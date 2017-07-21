/**
 * Created by a on 2017/7/21.
 */
/**
 * Created by a on 2017/7/21.
 */
import React from 'react';
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme';
import SearchText from '../../src/components/SearchText';

const value='hello world';
test('SearchText renders', ()=>{

    const component = renderer.create(
        <SearchText value={value}/>
    )

    let select = component.toJSON();
    expect(select).toMatchSnapshot();
})

test('SearchText onChange', ()=>{
    const onChange = jest.fn();
    const click = jest.fn();
    const component = shallow(<SearchText value={value} onChange={onChange} submit={click}/>)

    component.find('input').simulate('change');
    expect(onChange).toHaveBeenCalledTimes(1);

    component.find('span').simulate('click');
    expect(click).toHaveBeenCalledTimes(1);
})