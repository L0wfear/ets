import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';

import { PropsTireModelFormWrap } from 'components/directories/autobase/tire_model/TireModelForm/@types/TireModelForm.h';

const TireModelFrom = React.lazy(() => (
  import(/* webpackChunkName: "tire_model_form" */ 'components/directories/autobase/tire_model/TireModelForm/TireModelForm')
));

class TireModelFormWrap extends React.Component<PropsTireModelFormWrap, {}> {
  render() {
    const { showForm, ...props } = this.props;
    const page = props.loadingPageName || props.page;
    const path = `${props.path ? `${props.path}-` : ''}tire-model-form`;

    return showForm ?
      (
        <ErrorBoundaryForm>
          <React.Suspense fallback={<LoadingComponent />}>
            <TireModelFrom
              element={props.element}
              handleHide={props.onFormHide}

              page={page}
              path={path}
            />
          </React.Suspense>
        </ErrorBoundaryForm>
      )
      :
      (
        <DivNone />
      );
  }
}

export default TireModelFormWrap;
