import React from 'react';
import {shallow, mount} from 'enzyme';
import renderer from 'react-test-renderer';
import {UserCenter} from '../../../src/common/containers/UserCenter';

describe('<UserCenter />', () => {
    const router = {push: jest.fn()};
    it('render with props.className=undefined', () => {
        const userCenter = shallow(<UserCenter router={router} />);
        const container = userCenter.find('div.user-center');
        expect(container.length).toBe(1);

        const userIcon = container.find('.user-icon.clearfix');
        expect(userIcon.length).toBe(1);

        const icon = userIcon.find('.glyphicon.glyphicon-user');
        expect(icon.length).toBe(1);

        const _ul = container.find('ul.user-list');
        expect(_ul.length).toBe(1);

        const _li = _ul.find('li');
        expect(_li.length).toBe(2);

        expect(_li.at(0).text()).toBe('修改密码');
        expect(_li.at(1).text()).toBe('退出管理系统');
    });

    it('render with props.className="user_center"', () => {
        const userCenter = shallow(<UserCenter className="user_center" router={router} />);
        const container = userCenter.find('div.user-center');
        expect(container.length).toBe(1);
        expect(container.prop('className')).toBe('user-center user_center');
    });

    it('snapshot', () => {
        const userCenter = renderer.create(<UserCenter router={router}/>);
        let tree = userCenter.toJSON();

        expect(tree).toMatchSnapshot();
    });
});