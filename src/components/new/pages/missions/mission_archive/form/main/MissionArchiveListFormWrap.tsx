import * as React from 'react';

import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { withFormRegistrySearch, WithFormRegistrySearchProps, WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { MissionFormReactLazy } from 'components/new/pages/missions/mission/form/main/MissionListFormWrap';
import MissionInfoFormById from 'components/new/ui/mission_info_form/MissionInfoFormById';

const MissionArchiveListFormWrap: React.FC<WithFormRegistrySearchAddProps<Partial<Mission>>> = React.memo(
  (props) => {
    if (props.element) {
      if (props.type === 'info') {
        return (
          <MissionInfoFormById {...props} />
        );
      }

      if (props.type) {
        props.handleHide(false);
      }

      return (
        <MissionFormReactLazy {...props} />
      );
    }

    return null;
  },
);

export default withFormRegistrySearch<WithFormRegistrySearchProps<Partial<Mission>>, Partial<Mission>>({
  add_path: 'archive_mission',
  no_find_in_arr: true,
  replace_uniqKey_on: 'id',
  cant_create: true,
})(MissionArchiveListFormWrap);
