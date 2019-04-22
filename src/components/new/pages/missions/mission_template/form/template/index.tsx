import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';
import { PropsMissionTemplateFormLazy } from './@types/index.h';

const MissionTemplateForm = React.lazy(() =>
  import(/* webpackChunkName: "mission_template_form" */ 'components/new/pages/missions/mission_template/form/template/MissionTemplateForm'),
);

class MissionTemplateFormLazy extends React.Component<
  PropsMissionTemplateFormLazy,
  {}
> {
  render() {
    const { showForm, ...props } = this.props;
    const page = props.loadingPageName || props.page;
    const path = `${props.path ? `${props.path}-` : ''}mission_template_form`;

    return showForm ? (
      <ErrorBoundaryForm>
        <React.Suspense fallback={<LoadingComponent />}>
          <MissionTemplateForm
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

export default MissionTemplateFormLazy;
