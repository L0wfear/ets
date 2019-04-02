import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';

import { PropsCarpoolFormWrap } from 'components/new/pages/nsi/geoobjects/pages/carpool/form/@types/CarpoolForm.h';
import withFormRegistrySearch from 'components/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

const CarpoolFrom = React.lazy(() => (
  import(/* webpackChunkName: "carpool_form" */ 'components/new/pages/nsi/geoobjects/pages/carpool/form/CarpoolForm')
));

class CarpoolFormWrap extends React.Component<PropsCarpoolFormWrap, {}> {
  render() {
    const { element, ...props } = this.props;
    const page = props.registryKey;
    const path = `${props.path ? `${props.path}-` : ''}carpool-form`;

    return element ?
      (
        <ErrorBoundaryForm>
          <React.Suspense fallback={<LoadingComponent />}>
            <CarpoolFrom
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

export default withFormRegistrySearch({})(CarpoolFormWrap);
