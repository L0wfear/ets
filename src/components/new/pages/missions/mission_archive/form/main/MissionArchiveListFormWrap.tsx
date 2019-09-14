import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { withFormRegistrySearchNew, WithFormRegistrySearchProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearchNew';
import { MissionFormReactLazy } from 'components/new/pages/missions/mission/form/main/MissionListFormWrap';

export default withFormRegistrySearchNew<WithFormRegistrySearchProps<Mission>, Mission>({
  add_path: 'archive_mission',
  no_find_in_arr: true,
  replace_uniqKey_on: 'id',
  cant_create: true,
})(MissionFormReactLazy);
