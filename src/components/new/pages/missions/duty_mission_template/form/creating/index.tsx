import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';
import { PropsDutyMissionTemplateCreatingFormLazy } from './@types/index.h';

const DutyMissionTemplateCreatingForm = React.lazy(() =>
  import(/* webpackChunkName: "duty_mission_template_form" */ 'components/new/pages/missions/duty_mission_template/form/creating/DutyMissionTemplateCreatingForm'),
);

// Ленивая загрузка шаблона наряд-задания
class DutyMissionTemplateCreatingFormLazy extends React.Component<PropsDutyMissionTemplateCreatingFormLazy, {}> {
  render() {
    const { showForm, ...props } = this.props;
    const page = props.loadingPageName || props.page;
    const path = `${props.path ? `${props.path}-` : ''}duty_mission_template_form`;

    return showForm ? (
      <ErrorBoundaryForm>
        <React.Suspense fallback={<LoadingComponent />}>
          <DutyMissionTemplateCreatingForm
            element={props.element}
            handleHide={props.onFormHide}
            dutyMissionTemplates={props.dutyMissionTemplates}

            page={page}
            path={path}
          />
        </React.Suspense>
      </ErrorBoundaryForm>
    ) : (
      <DivNone />
    );
  }
}

export default DutyMissionTemplateCreatingFormLazy;
