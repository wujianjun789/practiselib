/**
 * Created by a on 2017/10/10.
 */
jest.mock('../../../src/util/network.js');
jest.mock('../../../src/api/strategy.js');
jest.mock('../../../src/api/asset.js');
import React from 'react';
import {mount} from 'enzyme';
import {Provider} from 'react-redux';
import configureStore from '../../../src/store/configureStore';
import Overlayer from '../../../src/common/containers/Overlayer';
import TimeStrategy from '../../../src/controlStrategy/container/TimeStrategy';
global.d3 = require('../../../public/js/d3.min');

describe('TimeStrategy mount', () => {
    const store = configureStore();

    it('simulate add-sensor btn click', () => {
        const root = mount(
            <Provider store={store}>
                <div>
                    <TimeStrategy />
                    <Overlayer />
                </div>
            </Provider>
        );

        const btn = root.find('.add-strategy');
        let event = {target: {id: 'add-strategy'}};
        btn.simulate('click', event);
        let TimeStrategyPopup = root.find('TimeStrategyPopup');
        expect(TimeStrategyPopup.length).toBe(1);
        expect(TimeStrategyPopup.hasClass('time-strategy-popup')).toBe(true);
        expect(TimeStrategyPopup.prop('title')).toBe('新建策略');
        expect(TimeStrategyPopup.prop('data').id).toEqual(undefined);
    });
});