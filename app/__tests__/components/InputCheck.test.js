import React from 'react';
import {shallow, mount} from 'enzyme';
import renderer from 'react-test-renderer';
import InputCheck from '../../src/components/InputCheck';
import Immutable from 'immutable'

describe('<InputCheck />',()=>{
    const data = {
        id:'username',
        label:'用户名',
        value:'admin',
        checked:'fail',
        reminder:'用户名已存在'
    }
    it('render normal',()=>{
        const inputCheck = shallow(<InputCheck label={data.label} id={data.id} value= {data.value} checked={data.checked} reminder={data.reminder}/>);

        const container = inputCheck.find('.inputCheck');
        expect(container.length).toBe(1);

        const label = inputCheck.find('label');
        expect(label.length).toBe(1);
        expect(label.text()).toBe(`${data.label}:`);
        
        const content = inputCheck.find('.has-feedback.has-error');
        expect(content.length).toBe(1);

        const input = inputCheck.find('input');
        expect(input.length).toBe(1);
        expect(input.prop('value')).toBe(data.value);

        const sign = inputCheck.find(`span.glyphicon.glyphicon-remove.form-control-feedback`);
        expect(sign.length).toBe(1);

        const reminder = inputCheck.find('.reminder');
        expect(reminder.length).toBe(1);
        expect(reminder.text()).toBe(data.reminder)
    })

    it('onFocus', () => {
        const onFocus = jest.fn();
        const inputCheck = shallow(<InputCheck label={data.label} id={data.id} onFocus={onFocus}/>);
        let input = inputCheck.find('input');
        input.simulate('focus',{target:{id:data.id}});
        expect(onFocus).toHaveBeenCalledTimes(1);
    })

    it('onBlur', () => {
        const onBlur = jest.fn();
        const inputCheck = shallow(<InputCheck label={data.label} id={data.id} onBlur={onBlur}/>);
        let input = inputCheck.find('input');
        input.simulate('blur',{target:{id:data.id}});
        expect(onBlur).toHaveBeenCalledTimes(1);
    })

    it('onChange', () => {
        const onChange = jest.fn();
        const inputCheck = shallow(<InputCheck label={data.label} id={data.id} onChange={onChange}/>);
        let input = inputCheck.find('input');
        input.simulate('change',{target:{value:'a'}});
        expect(onChange).toHaveBeenCalledTimes(1);
    })

    it('snapshot', () => {
        const inputCheck = renderer.create(<InputCheck label={data.label} id={data.id} value= {data.value} checked={data.checked} reminder={data.reminder}/>);
        let tree = inputCheck.toJSON();
        expect(tree).toMatchSnapshot();
    });
})