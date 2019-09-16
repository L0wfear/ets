import * as React from 'react';

import { MissionTemplate } from 'redux-main/reducers/modules/missions/mission_template/@types/index.h';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

const MissionTemplateCreatingForm = React.lazy(() =>
  import(/* webpackChunkName: "mission_template_creating_form" */ 'components/new/pages/missions/mission_template/form/creating/MissionTemplateCreatingForm'),
);

const MissionTemplateCreatingFormLazy: React.FC<WithFormRegistrySearchAddProps<null> & { missionTemplates: Record<MissionTemplate['id'], MissionTemplate> }> = React.memo(
  (props) => {
    const path = `${props.path ? `${props.path}-` : ''}mission_template_creating_form`;

    const element = React.useMemo(
      () => {
        return {
          missionTemplates: props.missionTemplates,
        };
      },
      [props.missionTemplates],
    );

    return (
      <MissionTemplateCreatingForm
        {...props}
        path={path}
        element={element}
      />
    );
  },
);

export default MissionTemplateCreatingFormLazy;
