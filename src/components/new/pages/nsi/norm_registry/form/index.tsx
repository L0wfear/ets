import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';

import { PropsNormFormLazy } from 'components/new/pages/nsi/norm_registry/form/@types';
import withFormRegistrySearch from 'components/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

const NormFrom = React.lazy(() => (
  import(/* webpackChunkName: "norm_form" */ 'components/new/pages/nsi/norm_registry/form/NormForm')
));

class NormFormLazy extends React.Component<PropsNormFormLazy, {}> {
  render() {
    const { element, ...props } = this.props;
    const page = props.loadingPageName || props.page;
    const path = `${props.path ? `${props.path}-` : ''}norm-form`;

    return element ?
      (
        <ErrorBoundaryForm>
          <React.Suspense fallback={<LoadingComponent />}>
            <NormFrom
              element={element}
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

export default withFormRegistrySearch(NormFormLazy);
