// import withFormContextOld from 'components/@next/@form/hook/withFormContextOld';
// import { maintenanceWorkFormSchema } from './schema';
// import maintenanceWorkPermissions from '../../_config-data/permissions';
// import { getDefaultMaintenanceWorkElement } from './utils';
// import { MaintenanceWork } from 'redux-main/reducers/modules/some_uniq/maintenance_work/@types';
// import { submitMaintenanceWork } from 'redux-main/reducers/modules/maintenance_work/promise_maintenance_work';
// import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

// // удалил старую форму вместе с этим коммитом
// export default withFormContextOld<WithFormRegistrySearchAddProps<MaintenanceWork>, MaintenanceWork, {}>(
//   (props) => ({
//     key: 'maintenance_work_form',
//     uniqField: 'id',
//     mergeElement: getDefaultMaintenanceWorkElement,
//     schema: maintenanceWorkFormSchema,
//     permissions: maintenanceWorkPermissions,
//     handleSubmitPromise: submitMaintenanceWork,

//     handleHide: props.handleHide,
//     meta: {
//       page: props.page,
//       path: props.path,
//     },

//     store: {},
//   }),
// );

import * as React from 'react';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { MaintenanceWork } from 'redux-main/reducers/modules/some_uniq/maintenance_work/@types';
import useForm from 'components/@next/@form/hook/useForm';
import { FormKeys } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';
import MaintenanceWorkForm from 'components/new/pages/nsi/data_for_calculation/pages/maintenance_work/form/context/MaintenanceWorkForm';

const formKey: FormKeys = 'maintenance_work';

const MaintenanceWorkFormContext: React.FC<WithFormRegistrySearchAddProps<MaintenanceWork>> = React.memo(
  (props) => {
    const {
      hasData,
      handleHide,
    } = useForm(formKey, props);

    return hasData && (
      <MaintenanceWorkForm
        formDataKey={formKey}
        handleHide={handleHide}
      />
    );
  },
);

export default MaintenanceWorkFormContext;
