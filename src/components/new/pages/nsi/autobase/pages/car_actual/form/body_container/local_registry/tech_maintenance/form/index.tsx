import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';

import { PropsTechMaintenanceFormLazy } from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/tech_maintenance/form/@types/TechMintenanceForm';
import withFormRegistrySearch from 'components/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { memoizeMergeElement } from '../../../../utils';

const TechMintenanceForm = React.lazy(() =>
  import(/* webpackChunkName: "tech_maint_form" */ 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/tech_maintenance/form/TechMintenanceForm'),
);

const TechMaintenanceFormLazy: React.FC<PropsTechMaintenanceFormLazy> = React.memo(
  (props) => {
    const page = props.loadingPageName || props.page;
    const path = `${props.path ? `${props.path}-` : ''}insurance-policy-form`;

    return props.element ? (
      <ErrorBoundaryForm>
        <React.Suspense fallback={<LoadingComponent />}>
          <TechMintenanceForm
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
  },
);

export default withFormRegistrySearch({})(TechMaintenanceFormLazy);
