import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';

import { PropsCarFuncTypesFormWrap } from 'components/new/pages/nsi/cars/pages/car-func-types/CarFuncTypesForm/@types/CarFuncTypes.h';
import { connect } from 'react-redux';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { ReduxState } from 'redux-main/@types/state';
import { registryResetSelectedRowToShowInForm } from 'components/new/ui/registry/module/actions-registy';

const CarFuncTypesFrom = React.lazy(() => (
  import(/* webpackChunkName: "car_func_types_form" */ 'components/new/pages/nsi/cars/pages/car-func-types/CarFuncTypesForm/CarFuncTypesForm')
));

class CarFuncTypesFormWrap extends React.Component<PropsCarFuncTypesFormWrap, {}> {
  render() {
    const { element, ...props } = this.props;
    const page = props.registryKey;
    const path = `${props.path ? `${props.path}-` : ''}battery-brand-form`;

    return element ?
      (
        <ErrorBoundaryForm>
          <React.Suspense fallback={<LoadingComponent />}>
            <CarFuncTypesFrom
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
(CarFuncTypesFormWrap);
