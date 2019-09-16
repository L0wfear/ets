import * as React from 'react';

import { DutyMissionTemplate } from 'redux-main/reducers/modules/missions/duty_mission_template/@types/index.h';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

const DutyMissionTemplateCreatingForm = React.lazy(() =>
  import(/* webpackChunkName: "duty_mission_template_form" */ 'components/new/pages/missions/duty_mission_template/form/creating/DutyMissionTemplateCreatingForm'),
);

// Ленивая загрузка шаблона наряд-задания
const DutyMissionTemplateCreatingFormLazy: React.FC<WithFormRegistrySearchAddProps<null> & { dutyMissionTemplates: Record<DutyMissionTemplate['id'], DutyMissionTemplate> }> = React.memo(
  (props) => {
    const path = `${props.path ? `${props.path}-` : ''}duty_mission_template_form`;

    return (
      <DutyMissionTemplateCreatingForm
        {...props}
        path={path}
      />
    );
  },
);

export default DutyMissionTemplateCreatingFormLazy;
