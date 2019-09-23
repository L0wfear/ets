import * as React from 'react';

import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import useForm from 'components/@next/@form/hook/useForm';
import { FormKeys } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';
import DutyMissionFormNew from 'components/new/pages/missions/duty_mission/form/main/DutyMissionFormNew';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';

const formKey: FormKeys = 'duty_mission';

// new withForm
const DutyMissionFormContext: React.FC<WithFormRegistrySearchAddProps<Partial<DutyMission>> & { readOnly?: boolean }> = React.memo(
  (props) => {
    const {
      hasData,
      handleHide,
    } = useForm(formKey, props);

    return hasData && (
      <DutyMissionFormNew
        formDataKey={formKey}
        handleHide={handleHide}
        readOnly={props.readOnly}
      />
    );
  },
);

export default DutyMissionFormContext;
