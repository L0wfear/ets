import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';

import { PropsSparePartFormLazy } from 'components/new/pages/nsi/autobase/pages/spare_part/form/@types/SparePartForm';
import withFormRegistrySearch from 'components/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

const SparePartFrom = React.lazy(() => (
  import(/* webpackChunkName: "spare_part_form" */ 'components/new/pages/nsi/autobase/pages/spare_part/form/SparePartForm')
));

const SparePartFormLazy: React.FC<PropsSparePartFormLazy> = React.memo(
  (props) => {
    const page = props.registryKey || props.page;
    const path = `${props.path ? `${props.path}-` : ''}spare-part-form`;

    return (
      props.element
        ? (
          <ErrorBoundaryForm>
            <React.Suspense fallback={<LoadingComponent />}>
              <SparePartFrom
                element={props.element}
                handleHide={props.onFormHide}

                page={page}
                path={path}
              />
            </React.Suspense>
          </ErrorBoundaryForm>
        )
        : (
          <DivNone />
        )
    );
  },
);

export default withFormRegistrySearch({})(SparePartFormLazy);
