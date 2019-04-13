import inspectionAutobaseActions from 'redux-main/reducers/modules/inspect/autobase/inspect_autobase_actions';
import withInspectFormWrapCheck from '../../common_components/form_wrap_check/withFormWrapCheck';
import inspectAutobasePermissions from '../_config_data/permissions';
import ViewInspectAutobase from './view_inspect_autobase_form/ViewInspectAutobase';

const loadingPage = 'InspectionAutobaseForm';

export default withInspectFormWrapCheck({
  title: 'Мониторинг обустройства автобаз',
  loadingPage,
  loadInpectById: inspectionAutobaseActions.actionGetInspectAutobaseById,
  inspectPermissions: inspectAutobasePermissions,
})(ViewInspectAutobase);
