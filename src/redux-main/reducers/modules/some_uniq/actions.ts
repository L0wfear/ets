import * as special_model from 'redux-main/reducers/modules/some_uniq/special_model/actions';
import technicalOperationRegistryActions from 'redux-main/reducers/modules/some_uniq/technical_operation_registry/actions';
import municipalFacilityActions from 'redux-main/reducers/modules/some_uniq/municipal_facility/actions';

const someUniqActions = {
  ...special_model,
  ...technicalOperationRegistryActions,
  ...municipalFacilityActions,
};

export default someUniqActions;
