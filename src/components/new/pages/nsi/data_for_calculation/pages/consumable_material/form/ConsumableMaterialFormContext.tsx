import * as React from 'react';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import useForm from 'components/@next/@form/hook/useForm';
import { FormKeys } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';
import ConsumableMaterialForm from 'components/new/pages/nsi/data_for_calculation/pages/consumable_material/form/ConsumableMaterialForm';
import { ConsumableMaterial } from 'redux-main/reducers/modules/consumable_material/@types/consumableMaterial';

const formKey: FormKeys = 'consumable_material';

// new withForm
const ConsumableMaterialFormContext: React.FC<WithFormRegistrySearchAddProps<ConsumableMaterial>> = React.memo(
  (props) => {
    const {
      hasData,
      handleHide,
    } = useForm(formKey, props);

    return hasData && (
      <ConsumableMaterialForm
        formDataKey={formKey}
        handleHide={handleHide}
      />
    );
  },
);

export default ConsumableMaterialFormContext;
