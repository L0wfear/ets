import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';
import { withFormRegistrySearchNew, WithFormRegistrySearchProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearchNew';
import { DutyMissionFormLazy } from 'components/new/pages/missions/duty_mission/form/main/DutyMissionListFormWrap';

export default withFormRegistrySearchNew<WithFormRegistrySearchProps<DutyMission> & { readOnly?: boolean }, DutyMission>({
  add_path: 'archive_duty_mission',
  no_find_in_arr: true,
  replace_uniqKey_on: 'id',
  cant_create: true,
})(DutyMissionFormLazy);
