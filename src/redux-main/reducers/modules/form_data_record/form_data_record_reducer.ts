import { createPath } from 'redux-main/redux-utils';
import { IStateFormDataRecord } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';

const FORM = createPath('FORM');

export const FORM_SET_DATA = FORM`SET_DATA`;
export const FORM_REMOVE_DATA = FORM`REMOVET_DATA`;
export const FORM_CHANGE_DATA = FORM`CHANGE_DATA`;

export const initialState: IStateFormDataRecord = {};

const formDataRecord = (state = initialState, { type, payload }) => {
  switch (type) {
    case FORM_SET_DATA: {
      console.log('⭕️⭕️⭕️⭕️⭕️⭕️⭕️⭕️⭕️⭕️', payload.formKey); // tslint:disable-line:no-console
      return {
        ...state,
        [payload.formKey]: payload.formData,
      };
    }
    case FORM_REMOVE_DATA: {
      console.log('❌❌❌❌❌❌❌❌❌❌', payload.formKey); // tslint:disable-line:no-console
      const {
        ...otherState
      } = state;
      delete otherState[payload.formKey];

      return otherState;
    }
    case FORM_CHANGE_DATA: {
      return {
        ...state,
        [payload.formKey]: payload.formData,
      };
    }
    default: {
      return state;
    }
  }
};

export default formDataRecord;
