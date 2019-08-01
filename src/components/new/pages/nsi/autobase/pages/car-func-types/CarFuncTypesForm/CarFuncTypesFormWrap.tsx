import * as React from 'react';
import LoadingComponent from 'components/old/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';

import { PropsCarFuncTypesFormWrap } from 'components/new/pages/nsi/autobase/pages/car-func-types/CarFuncTypesForm/@types/CarFuncTypes.h';
import withFormRegistrySearch from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

const CarFuncTypesFrom = React.lazy(() => (
  import(/* webpackChunkName: "car_func_types_form" */ 'components/new/pages/nsi/autobase/pages/car-func-types/CarFuncTypesForm/CarFuncTypesForm')
));

const CarFuncTypesFormWrap: React.FC<PropsCarFuncTypesFormWrap> = (props) => {
  const page = props.registryKey;
  const path = `${props.path ? `${props.path}-` : ''}battery-brand-form`;

  return props.element ?
    (
      <ErrorBoundaryForm>
        <React.Suspense fallback={<LoadingComponent />}>
          <CarFuncTypesFrom
            element={props.element}
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
};

export default withFormRegistrySearch({})(CarFuncTypesFormWrap);
