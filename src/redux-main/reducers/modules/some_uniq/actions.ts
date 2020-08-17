import * as special_model from 'redux-main/reducers/modules/some_uniq/special_model/actions';
import * as modelsList from 'redux-main/reducers/modules/some_uniq/modelList/actions';
import technicalOperationRegistryActions from 'redux-main/reducers/modules/some_uniq/technical_operation_registry/actions';
import municipalFacilityActions from 'redux-main/reducers/modules/some_uniq/municipal_facility/actions';
import missionSourceActions from 'redux-main/reducers/modules/some_uniq/mission_source/actions';
import carsTravelTimeListActions from 'redux-main/reducers/modules/some_uniq/cars_travel_time/actions';
import TracksCachingActions from 'redux-main/reducers/modules/some_uniq/tracks_caching/actions';
import * as mission_cancel_reasons from 'redux-main/reducers/modules/some_uniq/mission_cancel_reasons/actions';
import * as workKindActions from 'redux-main/reducers/modules/some_uniq/work_kind/work_kind_actions';
import * as technicalOperationObjectsActions from 'redux-main/reducers/modules/some_uniq/technical_operation_objects/technical_operation_objects_actions';
import * as technicalOperationTypesActions from 'redux-main/reducers/modules/some_uniq/technical_operation_types/technical_operation_types_actions';
import * as sensorTypeActions from 'redux-main/reducers/modules/some_uniq/sensor_type/sensor_type_actions';
import * as MoscowTimeServer from 'redux-main/reducers/modules/some_uniq/time_moscow/actions';
import * as ReasonList from 'redux-main/reducers/modules/some_uniq/reason_list/actions';
import * as engineKindList from 'redux-main/reducers/modules/some_uniq/engine_kind/actions';

const someUniqActions = {
  ...special_model,
  ...modelsList,
  ...technicalOperationRegistryActions,
  ...municipalFacilityActions,
  ...missionSourceActions,
  ...mission_cancel_reasons,
  ...workKindActions,
  ...technicalOperationObjectsActions,
  ...technicalOperationTypesActions,
  ...sensorTypeActions,
  ...carsTravelTimeListActions,
  ...TracksCachingActions,
  ...MoscowTimeServer,
  ...ReasonList,
  ...engineKindList,
};

export default someUniqActions;
