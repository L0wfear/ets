import * as special_model from 'redux-main/reducers/modules/some_uniq/special_model/actions';
import * as modelsList from 'redux-main/reducers/modules/some_uniq/modelList/actions';
import technicalOperationRegistryActions from 'redux-main/reducers/modules/some_uniq/technical_operation_registry/actions';
import municipalFacilityActions from 'redux-main/reducers/modules/some_uniq/municipal_facility/actions';
import missionSourceActions from 'redux-main/reducers/modules/some_uniq/mission_source/actions';
import cleaningOneNormActions from 'redux-main/reducers/modules/some_uniq/cleaning_one_norm/actions';
import maintenanceWorkListActions from 'redux-main/reducers/modules/some_uniq/maintenance_work/actions';
import cleanCategoriesListActions from 'redux-main/reducers/modules/some_uniq/clean_categories/actions';
import geozoneMunicipalFacilityActions from 'redux-main/reducers/modules/some_uniq/geozone_municipal_facility/actions';

const someUniqActions = {
  ...special_model,
  ...modelsList,
  ...technicalOperationRegistryActions,
  ...municipalFacilityActions,
  ...missionSourceActions,
  ...cleaningOneNormActions,
  ...maintenanceWorkListActions,
  ...cleanCategoriesListActions,
  ...geozoneMunicipalFacilityActions,
};

export default someUniqActions;
