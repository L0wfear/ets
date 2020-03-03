import * as React from 'react';

const MissionTemplateForm = React.lazy(() =>
  import(/* webpackChunkName: "mission_template_form" */ 'components/new/pages/missions/mission_template/form/template/MissionTemplateForm'),
);

export default MissionTemplateForm;
