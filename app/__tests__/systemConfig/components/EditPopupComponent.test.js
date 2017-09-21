/** Created By ChrisWen
 *  17/9/21
 *  This test example is just a simple example.
 *  If there actually has a bug in your computer,it must be your local env's problem.
 */

import React from 'react';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';
import EditPopupComponent from '../../../src/systemConfig/components/EditPopupComponent.js';

describe('<EditPopupComponet /> Component of EditPopup', () => {
    it('Render Normally', () => {
        const editPopupComponent = shallow(<EditPopupComponent />);
        const title = editPopupComponent.find('.equipmentName');
        const select = editPopupComponent.find('.edit_selectdevice-select');
        //Expect the <span>选择设备:</span> whether show its correct name.
        expect(title.text()).toBe("选择设备:");
    })

    it('InitState Normally', () => {
        const editPopupComponent = renderer.create(<EditPopupComponent />);
        
    })
})