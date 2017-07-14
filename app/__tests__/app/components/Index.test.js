import React from 'react';
import {shallow, mount} from 'enzyme';
import {Provider} from 'react-redux';
import renderer from 'react-test-renderer';
import {App} from '../../../src/App/container';
import configureStore from '../../../src/store/configureStore';

describe('<App />', () => {
    let store = configureStore();
    let data = {
        items: [
            {key: 'asset', title: '资产管理', link: '/assetManage'},
            {key: 'permission', title: '权限管理', link: '/permission'}
        ],
        title: 'Star',
        name: '智慧照明'
    }

    it('render with props.title=undefined, props.name=undefined', () => {
        const app = mount(<Provider store={store}><App items={data.items} /></Provider>);

        const tit = app.find('.tit');
        expect(tit.length).toBe(1);
        expect(tit.text()).toBe('StarRiver');

        const _name = app.find('.name');
        expect(_name.length).toBe(1);
        expect(_name.text()).toBe('智慧路灯管理系统');

        const userCenter = app.find('UserCenter');
        expect(userCenter.length).toBe(1);

        const cardList = app.find('.cont > .clearfix > li');
        expect(cardList.length).toBe(data.items.length);
        cardList.forEach((node, index) => {
            expect(node.key()).toBe(data.items[index].key);
        });
        
        const card1 = cardList.at(1).find('Card');
        expect(card1.prop('_key')).toBe(data.items[1].key);
        expect(card1.prop('title')).toBe(data.items[1].title);
        expect(card1.prop('link')).toBe(data.items[1].link);

        const overlayer = app.find('Overlayer');
        expect(overlayer.length).toBe(1);
    });

    it('render with props.title="Star", props.name="智慧照明"', () => {
        const app = shallow(<App title={data.title} name={data.name} items={data.items} />);

        const tit = app.find('.tit');
        expect(tit.text()).toBe(data.title);

        const _name = app.find('.name');
        expect(_name.text()).toBe(data.name);
    });

    it('snapshot', () => {
        const cmp = renderer.create(<Provider store={store}><App title={data.title} name={data.name} items={data.items} /></Provider>);
        const tree = cmp.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('snapshot with props.title=undefined, props.name=undefined', () => {
        const cmp = renderer.create(<Provider store={store}><App items={data.items} /></Provider>);
        const tree = cmp.toJSON();
        expect(tree).toMatchSnapshot();
    });
});