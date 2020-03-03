import * as React from 'react';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { MaintenanceWork } from 'redux-main/reducers/modules/some_uniq/maintenance_work/@types';
import useForm from 'components/@next/@form/hook/useForm';
import { FormKeys } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';
import MaintenanceWorkForm from 'components/new/pages/nsi/data_for_calculation/pages/maintenance_work/form/context/MaintenanceWorkForm';

const formKey: FormKeys = 'maintenance_work';

// new withForm
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
