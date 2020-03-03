import { createPath } from 'redux-main/redux-utils';
import { IStateFormDataRecord, FormKeys, OneFormDataByKey } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';

const FORM = createPath('FORM');

export const FORM_SET_DATA = FORM`SET_DATA`;
export const FORM_REMOVE_DATA = FORM`REMOVET_DATA`;
export const FORM_CHANGE_DATA = FORM`CHANGE_DATA`;

export const initialState: IStateFormDataRecord = {};

const formDataRecord = (state = initialState, { type, payload }: { type: string; payload: { formKey: FormKeys; formData?: OneFormDataByKey<any>; };}) => {
  switch (type) {
    case FORM_SET_DATA: {
      console.info('⭕️⭕️⭕️⭕️⭕️⭕️⭕️⭕️⭕️⭕️', payload.formKey, payload.formData); // eslint-disable-line
      return {
        ...state,
        [payload.formKey]: payload.formData,
      };
    }
    case FORM_REMOVE_DATA: {
      console.info('❌❌❌❌❌❌❌❌❌❌', payload.formKey); // eslint-disable-line
      const {
        ...otherState
      } = state;
      delete otherState[payload.formKey];

      return otherState;
    }
    case FORM_CHANGE_DATA: {
      // console.info('✏️️️️️️️✏️✏️✏️✏️✏️✏️✏️✏️✏️', payload.formKey); // eslint-disable-line
      // console.info(payload.formData.formState); // eslint-disable-line
      // console.info(payload.formData.formErrors); // eslint-disable-line

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
