import * as actionTypes from '../../../src/userCenter/actionTypes';
import userCenter from '../../../src/userCenter/reducers/index';

describe('userCenter reducer', () => {
    it('default', () => {
        expect(userCenter(undefined, {})).toEqual({});
    });
    it('action.USERCENTER_POPUP_CONFIRM_EXIT', () => {
        expect(userCenter(undefined, {type: actionTypes.USERCENTER_POPUP_CONFIRM_EXIT})).toEqual({});
    });
})