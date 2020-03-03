import * as React from 'react';

import { WithFormRegistrySearchAddProps, WithFormRegistrySearchAddPropsWithoutWithSerach } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import useForm from 'components/@next/@form/hook/useForm';
import { FormKeys } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';
import InspectActFileForm from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/inspect/forms/show_acts/form/InspectActFileForm';
import { InspectOneActScan } from 'redux-main/reducers/modules/inspect/act_scan/@types/inspect_act_scan';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';

const formKey: FormKeys = 'inspect_one_act_scan';

type OwnProps = WithFormRegistrySearchAddPropsWithoutWithSerach<InspectOneActScan>;
// new withForm
const InspectActFileFormContext: React.FC<WithFormRegistrySearchAddProps<InspectOneActScan>> = React.memo(
  (props) => {
    const {
      hasData,
      handleHide,
    } = useForm(formKey, props);

    return hasData && (
      <InspectActFileForm
        formDataKey={formKey}
        handleHide={handleHide}
      />
    );
  },
);

export default withSearch<OwnProps>(InspectActFileFormContext);
