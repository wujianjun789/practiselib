import React from 'react';
import {shallow, mount} from 'enzyme';
import renderer from 'react-test-renderer';
import {Overlayer} from '../../../src/common/containers/Overlayer';
import AlterPwPopup from '../../../src/components/AlterPwPopup';

describe('<Overlayer />', () => {
    let data1 = {
        isShowDialog:true,
        page: <AlterPwPopup className='alter-pw-popup'/>
    };
    let data2 = {
        isShowDialog:false,
        page:null
    };
    
    it('render show', () => {
        const overlayer = shallow(<Overlayer overlayer={data1}/>)
        const show = overlayer.find('.overlayer-show');
        expect(show.length).toBe(1);
    })

    it('render hidden', () => {
        const overlayer = shallow(<Overlayer overlayer={data2}/>)
        const show = overlayer.find('.overlayer-show');
        expect(show.length).toBe(0);
    })

    it('snapshot show', () => {
        const cmp = renderer.create(<Overlayer overlayer={data1}/>);
        const tree = cmp.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('snapshot hidden', () => {
        const cmp = renderer.create(<Overlayer overlayer={data2}/>);
        const tree = cmp.toJSON();
        expect(tree).toMatchSnapshot();
    });
})