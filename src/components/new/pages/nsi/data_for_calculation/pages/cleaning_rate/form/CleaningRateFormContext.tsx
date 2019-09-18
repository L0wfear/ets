import * as React from 'react';

import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import useForm from 'components/@next/@form/hook/useForm';
import { FormKeys } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';
import CleaningRateForm from 'components/new/pages/nsi/data_for_calculation/pages/cleaning_rate/form/CleaningRateForm';
import { CleaningRate } from 'redux-main/reducers/modules/cleaning_rate/@types/cleaningRate';

const formKey: FormKeys = 'cleaning_rate';

// new withForm
const CleaningRateFormContext: React.FC<WithFormRegistrySearchAddProps<CleaningRate>> = React.memo(
  (props) => {
    const {
      hasData,
      handleHide,
    } = useForm(formKey, props);

    return hasData && (
      <CleaningRateForm
        formDataKey={formKey}
        handleHide={handleHide}
      />
    );
  },
);

export default CleaningRateFormContext;
