import React from 'react';
import {shallow, mount} from 'enzyme';
import renderer from 'react-test-renderer';
import {Login} from '../../../src/login/container/Login';

describe('<Login />',() => {
    let data = {
        style: { visibility: 'hidden' },
        user: { 
            username: 'admin',
            password: 'xxx',
        }
    }

    let data2 = {
        user: { 
            username: '',
            password: '',
        }
    }

    it('snapshot', () => {
        const cmp = renderer.create(<Login data = {data}/>);
        const tree = cmp.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('snapshot with props.title=undefined', () => {
        const cmp = renderer.create(<Login data = {data2}/>);
        const tree = cmp.toJSON();
        expect(tree).toMatchSnapshot();
    });
})