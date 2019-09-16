import * as React from 'react';
import { withFormRegistrySearch, WithFormRegistrySearchProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';

export const DutyMissionFormLazy = React.lazy(() =>
  import(/* webpackChunkName: "duty_mission_form" */ 'components/new/pages/missions/duty_mission/form/main/DutyMissionForm'),
);

export default withFormRegistrySearch<WithFormRegistrySearchProps<DutyMission> & { readOnly?: boolean }, DutyMission>({
  add_path: 'duty_mission',
  no_find_in_arr: true,
  replace_uniqKey_on: 'id',
})(DutyMissionFormLazy);
