import * as React from 'react';
import LoadingComponent from 'components/old/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';

import { PropsRepairFormWrap } from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/repair/form/@types/RepairForm';
import withFormRegistrySearch from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { memoizeMergeElement } from '../../../../utils';

const RepareFrom = React.lazy(() =>
  import(/* webpackChunkName: "repare_form" */ 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/repair/form/RepairForm'),
);

const RepareFormLazy: React.FC<PropsRepairFormWrap> = (props) => {
  const page = props.loadingPageName || props.page;
  const path = `${props.path ? `${props.path}-` : ''}repare-form`;

  return props.element ? (
    <ErrorBoundaryForm>
      <React.Suspense fallback={<LoadingComponent />}>
        <RepareFrom
          element={memoizeMergeElement(props.element, props.selectedCarData)}
          handleHide={props.onFormHide}
          selectedCarData={props.selectedCarData}

          page={page}
          path={path}
        />
      </React.Suspense>
    </ErrorBoundaryForm>
  ) : (
    <DivNone />
  );
};

export default withFormRegistrySearch<Pick<PropsRepairFormWrap, 'selectedCarData'>>({})(RepareFormLazy);
