import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';

import { PropsRepairFormWrap } from 'components/new/pages/nsi/autobase/pages/repair/form/@types/RepairForm';
import withFormRegistrySearch from 'components/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

const RepareFrom = React.lazy(() =>
  import(/* webpackChunkName: "repare_form" */ 'components/new/pages/nsi/autobase/pages/repair/form/RepairForm'),
);

const RepareFormLazy: React.FC<PropsRepairFormWrap> = (props) => {
  const page = props.loadingPageName || props.page;
  const path = `${props.path ? `${props.path}-` : ''}repare-form`;

  return props.element ? (
    <ErrorBoundaryForm>
      <React.Suspense fallback={<LoadingComponent />}>
        <RepareFrom
          element={props.element}
          handleHide={props.onFormHide}
          car_id={props.car_id}
          page={page}
          path={path}
        />
      </React.Suspense>
    </ErrorBoundaryForm>
  ) : (
    <DivNone />
  );
};

export default withFormRegistrySearch({})(RepareFormLazy);
