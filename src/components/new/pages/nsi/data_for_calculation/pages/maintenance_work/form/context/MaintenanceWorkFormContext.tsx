import withFormContext from 'components/new/utils/context/form/hook/withFormContext';
import { maintenanceWorkFormSchema } from './schema';
import maintenanceWorkPermissions from '../../_config-data/permissions';
import { getDefaultMaintenanceWorkElement } from './utils';

export default withFormContext({
  key: 'maintenance_work_form',
  uniqField: 'id',
  mergeElement: getDefaultMaintenanceWorkElement,
  schema: maintenanceWorkFormSchema,
  permissions: maintenanceWorkPermissions,
});
