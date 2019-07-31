import * as React from 'react';
import LoadingComponent from 'components/old/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';

import { PropsOdhFormWrap } from 'components/new/pages/nsi/geoobjects/pages/odh/OdhForm/@types/OdhForm.h';
import withFormRegistrySearch from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

const OdhFrom = React.lazy(() => (
  import(/* webpackChunkName: "odh_form" */ 'components/new/pages/nsi/geoobjects/pages/odh/OdhForm/OdhForm')
));

class OdhFormWrap extends React.Component<PropsOdhFormWrap, {}> {
  render() {
    const { element, ...props } = this.props;
    const page = props.registryKey;
    const path = `${props.path ? `${props.path}-` : ''}odh-form`;

    return element ?
      (
        <ErrorBoundaryForm>
          <React.Suspense fallback={<LoadingComponent />}>
            <OdhFrom
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

export default withFormRegistrySearch({})(OdhFormWrap);
