/**
 * created by Azrael on 2017/7/5
 */
import React from 'react';
import {shallow, mount} from 'enzyme';
import renderer from 'react-test-renderer';
import Card from '../../../src/App/container/Card';

describe('<Card />', () => {
    let data = {
        key: 'asset',
        title: '资产管理',
        link: '/asssetMessage'
    }
    it('render normal', () => {
        const card = shallow(<Card _key={data.key} title={data.title} link={data.link}/>);
        let link = card.find('Link');
        expect(link.length).toBe(1);
        expect(link.prop('to')).toBe(data.link);
        
        let cmp = card.find('.card.card-asset');
        expect(cmp.length).toBe(1);

        let icon = cmp.find('.icon.icon-asset');
        expect(icon.length).toBe(1);

        let tit = cmp.find('.title');
        expect(tit.length).toBe(1);
        expect(tit.text()).toBe(data.title);
    });

    it('snapshot', () => {
        const card = renderer.create(<Card _key={data.key} title={data.title} link={data.link} />);
        let tree = card.toJSON();
        expect(tree).toMatchSnapshot();
    });
});