// import React from 'react';
// import {mount, shallow} from 'enzyme';
// import {Provider} from 'react-redux';
// import configureStore from '../../../src/store/configureStore';
// import LampConCenter from '../../../src/systemOperation/container/LampConCenter';
// import Overlayer from '../../../src/common/containers/Overlayer';
// import {initialState as state} from '../../../src/systemOperation/reducer/lampConCenter';
// import '../../../public/leaflet/leaflet';
// import '../../../public/leaflet/leaflet.draw';
// import '../../../public/leaflet/leaflet.label';
// import '../../../public/leaflet/leaflet.awesome-markers';
// import '../../../public/leaflet/leaflet.markercluster';
// import '../../../public/leaflet/leaflet.ChineseTmsProviders';

// describe('<LampConCenter /> HOC', () => {
//     const store = configureStore();
//     it('simulate click', done => {
//         const root = mount(<Provider store={store}>
//             <div>
//                 <LampConCenter />
//                 <Overlayer />
//             </div>
//         </Provider>);

//         const cmp = root.childAt(0).childAt(0);
//         cmp.setState({model: 'lcc'});
//         const btnAdd = cmp.find('#sys-add');
//         btnAdd.simulate('click');
//         const centralizedPopup = root.find('CentralizedControllerPopup');
//         expect(centralizedPopup.length).toBe(1);
//         expect(centralizedPopup.props().className).toBe('centralized-popup');
//         expect(centralizedPopup.props().popId).toBe('add');

//         let btnDelete = root.find('#sys-delete');
//         btnDelete.simulate('click');
//         let confirmPopup = root.find('ConfirmPopup');
//         expect(confirmPopup.prop('tips')).toBe('是否删除选中设备？');
//         expect(confirmPopup.props().iconClass).toBe('icon_popup_delete');
//         confirmPopup.find('.btn.btn-default').simulate('click');
//         expect(root.find('ConfirmPopup').length).toBe(0);


//     });
// });