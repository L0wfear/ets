import * as special_model from 'redux-main/reducers/modules/some_uniq/special_model/actions';
import * as modelsList from 'redux-main/reducers/modules/some_uniq/modelList/actions';
import technicalOperationRegistryActions from 'redux-main/reducers/modules/some_uniq/technical_operation_registry/actions';
import municipalFacilityActions from 'redux-main/reducers/modules/some_uniq/municipal_facility/actions';
import missionSourceActions from 'redux-main/reducers/modules/some_uniq/mission_source/actions';

const someUniqActions = {
  ...special_model,
  ...modelsList,
  ...technicalOperationRegistryActions,
  ...municipalFacilityActions,
  ...missionSourceActions,
};

export default someUniqActions;
