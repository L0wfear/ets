import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';
import withFormRegistrySearch from 'components/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { BatteryRegistry } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

const CarActualAddBatteryForm = React.lazy(() =>
  import(/* webpackChunkName: "car_actual_add_battery_form" */ 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/car_actual/car_actual_add_battery_form/CarActualAddBatteryForm'),
);

type CarActualAddBatteryFormWrapProps = {
  element: Partial<BatteryRegistry>;

  readOnly: boolean;
  onFormHide: any;
  page: string;
  path: string;
};

const CarActualAddBatteryFormWrap: React.FC<CarActualAddBatteryFormWrapProps> = (props) => {
  // const path = `${props.path ? `${props.path}-` : ''}-form`;
  return props.element ? (
    <ErrorBoundaryForm>
      <React.Suspense fallback={<LoadingComponent />}>
        <CarActualAddBatteryForm
          element={props.element}
          handleHide={props.onFormHide}

          page={props.page}
        />
      </React.Suspense>
    </ErrorBoundaryForm>
  ) : (
    <DivNone />
  );
};

export default withFormRegistrySearch({
  uniqKeyName: 'id',
})(CarActualAddBatteryFormWrap);
