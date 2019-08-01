import * as React from 'react';
import LoadingComponent from 'components/old/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';

import { PropsCarFormLazy } from 'components/new/pages/nsi/autobase/pages/car_actual/form/@types/CarForm';
import withFormRegistrySearch from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

const CarFrom = React.lazy(() => (
  import(/* webpackChunkName: "car_form" */ 'components/new/pages/nsi/autobase/pages/car_actual/form/CarForm')
));

class CarFormLazy extends React.Component<PropsCarFormLazy, {}> {
  render() {
    const { element, ...props } = this.props;
    const page = props.registryKey || props.page;
    const path = `${props.path ? `${props.path}-` : ''}car-form`;

    return element ?
      (
        <ErrorBoundaryForm>
          <React.Suspense fallback={<LoadingComponent />}>
            <CarFrom
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

export default withFormRegistrySearch({
  cantCreate: true,
  noCheckDataInRegistryArray: true,
  uniqKeyName: 'asuods_id',
})(CarFormLazy);
