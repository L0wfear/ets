import * as React from 'react';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import useForm from 'components/@next/@form/hook/useForm';
import { FormKeys } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';
import CleaningAreaRateForm from 'components/new/pages/nsi/data_for_calculation/pages/cleaning_area_rate/form/CleaningAreaRateForm';
import { CleaningAreaRate } from 'redux-main/reducers/modules/cleaning_area_rate/@types/cleaningAreaRate';

const formKey: FormKeys = 'cleaning_area_rate';

// new withForm
const CleaningAreaRateFormContext: React.FC<WithFormRegistrySearchAddProps<CleaningAreaRate>> = React.memo(
  (props) => {
    const {
      hasData,
      handleHide,
    } = useForm(formKey, props);

    return hasData && (
      <CleaningAreaRateForm
        formDataKey={formKey}
        handleHide={handleHide}
      />
    );
  },
);

export default CleaningAreaRateFormContext;
