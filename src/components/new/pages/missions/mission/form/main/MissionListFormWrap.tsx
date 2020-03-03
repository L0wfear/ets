import * as React from 'react';

import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import MissionInfoFormById from 'components/new/ui/mission_info_form/MissionInfoFormById';
import { WithFormRegistrySearchProps, withFormRegistrySearch, WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

export const MissionFormReactLazy = React.lazy(() =>
  import(/* webpackChunkName: "mission_form" */ 'components/new/pages/missions/mission/form/main/MissionFormContext'),
);

const MissionListFormWrap: React.FC<WithFormRegistrySearchAddProps<Partial<Mission>>> = React.memo(
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
  add_path: 'mission',
  no_find_in_arr: true,
  replace_uniqKey_on: 'id',
})(MissionListFormWrap);
