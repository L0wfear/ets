import * as React from 'react';
import LoadingComponent from 'components/old/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';
import { PropsDutyMissionTemplateFormLazy } from './@types/index.h';

const DutyMissionTemplateForm = React.lazy(() =>
  import(/* webpackChunkName: "duty_mission_template_form" */ 'components/new/pages/missions/duty_mission_template/form/template/DutyMissionTemplateForm'),
);

// Ленивая загрузка шаблона наряд-задания
class DutyMissionTemplateFormLazy extends React.Component<PropsDutyMissionTemplateFormLazy, {}> {
  render() {
    const { showForm, ...props } = this.props;
    const page = props.loadingPageName || props.page;
    const path = `${props.path ? `${props.path}-` : ''}duty_mission_template_form`;

    return showForm ? (
      <ErrorBoundaryForm>
        <React.Suspense fallback={<LoadingComponent />}>
          <DutyMissionTemplateForm
            element={props.element}
            handleHide={props.onFormHide}

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

export default DutyMissionTemplateFormLazy;
