import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';

import { PropsTechInspectionFormLazy } from 'components/new/pages/nsi/autobase/pages/tech_inspection/form/@types/TechInspectionForm';
import withFormRegistrySearch from 'components/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

const TechInspectionFrom = React.lazy(() =>
  import(/* webpackChunkName: "tech_inspection_form" */ 'components/new/pages/nsi/autobase/pages/tech_inspection/form/TechInspectionForm'),
);

const TechInspectionFormLazy: React.FC<PropsTechInspectionFormLazy> = (props) => {
  const page = props.loadingPageName || props.page;
  const path = `${props.path ? `${props.path}-` : ''}insurance-policy-form`;

  return props.element ? (
    <ErrorBoundaryForm>
      <React.Suspense fallback={<LoadingComponent />}>
        <TechInspectionFrom
          element={props.element}
          handleHide={props.onFormHide}

          page={page}
          path={path}
        />
      </React.Suspense>
    </ErrorBoundaryForm>
  ) : (
    <DivNone />
  );
};

export default withFormRegistrySearch({})(TechInspectionFormLazy);
