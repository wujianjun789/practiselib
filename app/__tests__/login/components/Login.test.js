import React from 'react';
import {shallow, mount} from 'enzyme';
import renderer from 'react-test-renderer';
import {Login} from '../../../src/login/components/Login';
import {loginHandler} from '../../../src/api/login';
import {login} from '../../../src/util/network'
describe('<Login />',() => {
    const login = shallow(<Login/>);

    it('input change',() =>{
        let username = login.find('#username');
        expect(username.prop('value')).toBe('');
        username.simulate('change',{target:{value:'a'}});
        username = login.find('input').at(0);
        expect(username.prop('value')).toBe('a');

        let password = login.find('#password');
        expect(password.prop('value')).toBe('');
        password.simulate('change',{target:{value:'b'}});
        password = login.find('input').at(1);
        expect(password.prop('value')).toBe('b');

    })

    it('renderer',() =>{
        expect(login.find('.container-login').length).toBe(1);
    })

    it('snapshot', () => {
        const cmp = renderer.create(<Login/>);
        const tree = cmp.toJSON();
        expect(tree).toMatchSnapshot();
    });
    
    it('loginHandler ',()=>{
        const fn = jest.fn();
        const fn1 = jest.fn();
        loginHandler('','',fn,fn1);
        expect(fn1).toHaveBeenCalled();
    })

})