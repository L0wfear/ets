import * as React from 'react';
import LoadingComponent from 'components/old/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';

import { PropsPgmStoreFormWrap } from 'components/new/pages/nsi/geoobjects/pages/pgm_store/PgmStoreForm/@types/PgmStoreForm.h';
import withFormRegistrySearch from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

const PgmStoreFrom = React.lazy(() => (
  import(/* webpackChunkName: "PgmStore_form" */ 'components/new/pages/nsi/geoobjects/pages/pgm_store/PgmStoreForm/PgmStoreForm')
));

class PgmStoreFormWrap extends React.Component<PropsPgmStoreFormWrap, {}> {
  render() {
    const { element, ...props } = this.props;
    const page = props.registryKey;
    const path = `${props.path ? `${props.path}-` : ''}PgmStore-form`;

    return element ?
      (
        <ErrorBoundaryForm>
          <React.Suspense fallback={<LoadingComponent />}>
            <PgmStoreFrom
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

export default withFormRegistrySearch({})(PgmStoreFormWrap);
