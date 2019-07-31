import * as React from 'react';
import LoadingComponent from 'components/old/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';

import { PropsFountainsFormWrap } from 'components/new/pages/nsi/geoobjects/pages/fountains/FountainsForm/@types/FountainsForm.h';
import withFormRegistrySearch from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

const FountainsFrom = React.lazy(() => (
  import(/* webpackChunkName: "fountains_form" */ 'components/new/pages/nsi/geoobjects/pages/fountains/FountainsForm/FountainsForm')
));

class FountainsFormWrap extends React.Component<PropsFountainsFormWrap, {}> {
  render() {
    const { element, ...props } = this.props;
    const page = props.registryKey;
    const path = `${props.path ? `${props.path}-` : ''}fountains-form`;

    return element ?
      (
        <ErrorBoundaryForm>
          <React.Suspense fallback={<LoadingComponent />}>
            <FountainsFrom
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

export default withFormRegistrySearch({})(FountainsFormWrap);
