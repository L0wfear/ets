import withInspectFormWrapCheck from '../../common_components/form_wrap_check/withFormWrapCheck';
import ViewInspectPgmBase from './view_inspect_pgm_base_form/ViewInspectPgmBase';
import inspectPgmBasePermissions from '../_config_data/permissions';
import inspectionPgmBaseActions from 'redux-main/reducers/modules/inspect/pgm_base/inspect_pgm_base_actions';

const loadingPage = 'InspectionPgmBaseForm';

export default withInspectFormWrapCheck({
  title: 'Мониторинг состояния баз хранения ПГМ',
  loadingPage,
  loadInpectById: inspectionPgmBaseActions.actionGetInspectPgmBaseById,
  inspectPermissions: inspectPgmBasePermissions,
})(ViewInspectPgmBase);
