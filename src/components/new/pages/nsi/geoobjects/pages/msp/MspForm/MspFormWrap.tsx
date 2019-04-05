import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';

import { PropsMspFormWrap } from 'components/new/pages/nsi/geoobjects/pages/msp/MspForm/@types/MspForm.h';
import withFormRegistrySearch from 'components/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

const MspFrom = React.lazy(() => (
  import(/* webpackChunkName: "msp_form" */ 'components/new/pages/nsi/geoobjects/pages/msp/MspForm/MspForm')
));

class MspFormWrap extends React.Component<PropsMspFormWrap, {}> {
  render() {
    const { element, ...props } = this.props;
    const page = props.registryKey;
    const path = `${props.path ? `${props.path}-` : ''}msp-form`;

    return element ?
      (
        <ErrorBoundaryForm>
          <React.Suspense fallback={<LoadingComponent />}>
            <MspFrom
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

export default withFormRegistrySearch({})(MspFormWrap);
