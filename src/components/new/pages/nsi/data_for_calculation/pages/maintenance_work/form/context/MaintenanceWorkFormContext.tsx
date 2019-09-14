import withFormContext from 'components/@next/@form/hook/withFormContext';
import { maintenanceWorkFormSchema } from './schema';
import maintenanceWorkPermissions from '../../_config-data/permissions';
import { getDefaultMaintenanceWorkElement } from './utils';
import { MaintenanceWork } from 'redux-main/reducers/modules/some_uniq/maintenance_work/@types';
import { submitMaintenanceWork } from 'redux-main/reducers/modules/maintenance_work/promise_maintenance_work';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearchNew';

// удалил старую форму вместе с этим коммитом
export default withFormContext<WithFormRegistrySearchAddProps<MaintenanceWork>, MaintenanceWork, {}>(
  (props) => ({
    key: 'maintenance_work_form',
    uniqField: 'id',
    mergeElement: getDefaultMaintenanceWorkElement,
    schema: maintenanceWorkFormSchema,
    permissions: maintenanceWorkPermissions,
    handleSubmitPromise: submitMaintenanceWork,

    handleHide: props.handleHide,
    meta: {
      page: props.page,
      path: props.path,
    },

    store: {},
  }),
);
