import * as React from 'react';

const DutyMissionTemplateForm = React.lazy(() =>
  import(/* webpackChunkName: "duty_mission_template_form" */ 'components/new/pages/missions/duty_mission_template/form/template/DutyMissionTemplateForm'),
);

export default DutyMissionTemplateForm;
