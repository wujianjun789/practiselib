jest.mock('../../../src/data/systemModel.js');

import React from 'react';
import {mount, shallow} from 'enzyme';
import {Provider} from 'react-redux';
import configureStore from '../../../src/store/configureStore';
import Gateway from '../../../src/systemOperation/container/Gateway';
import Overlayer from '../../../src/common/containers/Overlayer';
import {initialState as state} from '../../../src/systemOperation/reducer/Gateway';
import '../../../public/leaflet/leaflet';
import '../../../public/leaflet/leaflet.draw';
import '../../../public/leaflet/leaflet.label';
import '../../../public/leaflet/leaflet.awesome-markers';
import '../../../public/leaflet/leaflet.markercluster';
import '../../../public/leaflet/leaflet.ChineseTmsProviders';

describe('<Gateway /> HOC', () => {
    const store = configureStore();

    it('simulate click', done => {
        const root = mount(<Provider store={store}>
            <div>
                <Gateway />
                <Overlayer />
            </div>
        </Provider>);

        const cmp = root.childAt(0).childAt(0);
        const btnAdd = cmp.find('#sys-add');
        btnAdd.simulate('click');
        let centralizedPopup = root.find('CentralizedControllerPopup');
        expect(centralizedPopup.length).toBe(1);
        expect(centralizedPopup.props().className).toBe('centralized-popup');
        expect(centralizedPopup.props().popId).toBe('add');
        centralizedPopup.find('.btn.btn-default').simulate('click');
        centralizedPopup = root.find('CentralizedControllerPopup');
        expect(centralizedPopup.length).toBe(0);

        let btnDelete = root.find('#sys-delete');
        expect(btnDelete.props().disabled).toBeTruthy();
        btnDelete.simulate('click');
        let confirmPopup = root.find('ConfirmPopup');
        expect(confirmPopup.length).toBe(0);
        done();
    });
});