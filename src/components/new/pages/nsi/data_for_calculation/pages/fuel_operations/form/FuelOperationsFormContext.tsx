import * as React from 'react';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import useForm from 'components/@next/@form/hook/useForm';
import { FormKeys } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';
import FuelOperationsForm from 'components/new/pages/nsi/data_for_calculation/pages/fuel_operations/form/FuelOperationsForm';
import { FuelOperationActive } from 'redux-main/reducers/modules/fuel_operations/@types/fuelOperations';

const formKey: FormKeys = 'fuel_operations';

// new withForm
const FuelOperationsFormContext: React.FC<WithFormRegistrySearchAddProps<FuelOperationActive>> = React.memo(
  (props) => {
    const {
      hasData,
      handleHide,
    } = useForm(formKey, props);

    return hasData && (
      <FuelOperationsForm
        formDataKey={formKey}
        handleHide={handleHide}
      />
    );
  },
);

export default FuelOperationsFormContext;
