import * as React from 'react';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import useForm from 'components/@next/@form/hook/useForm';
import { FormKeys } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';
import NormForm from 'components/new/pages/nsi/norm_registry/form/NormForm';
import { Norm } from 'redux-main/reducers/modules/some_uniq/norm_registry/@types';

const formKey: FormKeys = 'norm';

// new withForm
const NormFormContext: React.FC<WithFormRegistrySearchAddProps<Norm>> = React.memo(
  (props) => {
    const {
      hasData,
      handleHide,
    } = useForm(formKey, props);

    return hasData && (
      <NormForm
        formDataKey={formKey}
        handleHide={handleHide}
      />
    );
  },
);

export default NormFormContext;
