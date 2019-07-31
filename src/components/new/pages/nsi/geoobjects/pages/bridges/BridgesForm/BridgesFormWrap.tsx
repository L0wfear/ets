import * as React from 'react';
import LoadingComponent from 'components/old/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';

import { PropsBridgesFormWrap } from 'components/new/pages/nsi/geoobjects/pages/bridges/BridgesForm/@types/BridgesForm.h';
import withFormRegistrySearch from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

const BridgesFrom = React.lazy(() => (
  import(/* webpackChunkName: "bridges_form" */ 'components/new/pages/nsi/geoobjects/pages/bridges/BridgesForm/BridgesForm')
));

class BridgesFormWrap extends React.Component<PropsBridgesFormWrap, {}> {
  render() {
    const { element, ...props } = this.props;
    const page = props.registryKey;
    const path = `${props.path ? `${props.path}-` : ''}bridges-form`;

    return element ?
      (
        <ErrorBoundaryForm>
          <React.Suspense fallback={<LoadingComponent />}>
            <BridgesFrom
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

export default withFormRegistrySearch({})(BridgesFormWrap);
