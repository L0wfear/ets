import * as special_model from 'redux-main/reducers/modules/some_uniq/special_model/actions';
import * as mission_cancel_reasons from 'redux-main/reducers/modules/some_uniq/mission_cancel_reasons/actions';

export default {
  ...special_model,
  ...mission_cancel_reasons,
};
