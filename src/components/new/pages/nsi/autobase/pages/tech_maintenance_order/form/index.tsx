import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';

import { PropsTechMaintOrderFormWrap } from 'components/new/pages/nsi/autobase/pages/tech_maintenance_order/form/@types/TechMaintenanceOrderForm';
import withFormRegistrySearch from 'components/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

const TechMaintOrderFrom = React.lazy(() => (
  import(/* webpackChunkName: "tech_maint_order_form" */ 'components/new/pages/nsi/autobase/pages/tech_maintenance_order/form/TechMaintenanceOrderForm')
));

const TechMaintOrderFormWrap: React.FC<PropsTechMaintOrderFormWrap> = React.memo(
  (props) => {
    const page = props.registryKey || props.page;
    const path = `${props.path ? `${props.path}-` : ''}insurance-policy-form`;

    return (
      props.element
        ? (
          <ErrorBoundaryForm>
            <React.Suspense fallback={<LoadingComponent />}>
              <TechMaintOrderFrom
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
        )
    );
  },
);

export default withFormRegistrySearch({})(TechMaintOrderFormWrap);
