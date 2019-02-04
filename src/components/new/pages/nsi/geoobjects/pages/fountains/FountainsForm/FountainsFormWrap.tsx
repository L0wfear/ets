import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';

import { connect } from 'react-redux';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { ReduxState } from 'redux-main/@types/state';
import { registryResetSelectedRowToShowInForm } from 'components/new/ui/registry/module/actions-registy';
import { PropsFountainsFormWrap } from 'components/new/pages/nsi/geoobjects/pages/fountains/FountainsForm/@types/FountainsForm.h';

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
(FountainsFormWrap);
