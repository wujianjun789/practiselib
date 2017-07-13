import * as actionTypes from '../../../src/common/actions/userCenter';
import userCenter from '../../../src/common/reducer/userCenter';

describe('userCenter reducer', () => {
    it('default', () => {
        expect(userCenter(undefined, {})).toEqual({});
    });
    it('action.USERCENTER_POPUP_CONFIRM_EXIT', () => {
        expect(userCenter(undefined, {type: actionTypes.USERCENTER_POPUP_CONFIRM_EXIT})).toEqual({});
    });
})