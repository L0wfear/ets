import * as React from 'react';

import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import useForm from 'components/@next/@form/hook/useForm';
import { FormKeys } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';
import MissionFormNew from 'components/new/pages/missions/mission/form/main/MissionFormNew';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';

const formKey: FormKeys = 'mission';

// new withForm
const MissionFormContext: React.FC<WithFormRegistrySearchAddProps<Partial<Mission>> & { notChangeCar?: boolean; }> = React.memo(
  (props) => {
    const {
      hasData,
      handleHide,
    } = useForm(formKey, props);

    return hasData && (
      <MissionFormNew
        formDataKey={formKey}
        handleHide={handleHide}
        notChangeCar={props.notChangeCar}
      />
    );
  },
);

export default MissionFormContext;
