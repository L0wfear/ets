import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';

import { connect } from 'react-redux';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { ReduxState } from 'redux-main/@types/state';
import { registryResetSelectedRowToShowInForm } from 'components/new/ui/registry/module/actions-registy';
import { PropsSnowStorageFormWrap } from 'components/new/pages/nsi/geoobjects/pages/snow_storage/SnowStorageForm/@types/SnowStorageForm.h';

const SnowStorageFrom = React.lazy(() => (
  import(/* webpackChunkName: "SnowStorage_form" */ 'components/new/pages/nsi/geoobjects/pages/snow_storage/SnowStorageForm/SnowStorageForm')
));

class SnowStorageFormWrap extends React.Component<PropsSnowStorageFormWrap, {}> {
  render() {
    const { element, ...props } = this.props;
    const page = props.registryKey;
    const path = `${props.path ? `${props.path}-` : ''}SnowStorage-form`;

    return element ?
      (
        <ErrorBoundaryForm>
          <React.Suspense fallback={<LoadingComponent />}>
            <SnowStorageFrom
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

export default connect<any, any, any, ReduxState>(
  (state, { registryKey }) => ({
    element: getListData(state.registry, registryKey).data.selectedRowToShow,
  }),
  (dispatch, { registryKey }) => ({
    onFormHide: (...arg) => (
      dispatch(
        registryResetSelectedRowToShowInForm(
          registryKey,
          ...arg,
        ),
      )
    ),
  }),
)
(SnowStorageFormWrap);
