import inspectionCarsConditionActions from 'redux-main/reducers/modules/inspect/cars_condition/inspect_cars_condition_actions';

import ViewInspectCarsCondition from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/ViewInspectCarsCondition';
import inspectCarsConditionPermissions from '../_config_data/permissions';
import withInspectFormWrapCheck from '../../common_components/form_wrap_check/withFormWrapCheck';

const loadingPage = 'InspectionCarsConditionForm';

export default withInspectFormWrapCheck({
  title: 'Мониторинг транспортных средств',
  loadingPage,
  loadInpectById: inspectionCarsConditionActions.actionGetInspectCarsConditionById,
  inspectPermissions: inspectCarsConditionPermissions,
})(ViewInspectCarsCondition);
