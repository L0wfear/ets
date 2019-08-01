import * as React from 'react';
import LoadingComponent from 'components/old/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { ProgramRegistry } from 'redux-main/reducers/modules/repair/program_registry/@types/programRegistry';

import withFormRegistrySearch from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { isObject } from 'util';

const ProgramRegistryFrom = React.lazy(() => (
  import(/* webpackChunkName: "programm_registry_switch" */ 'components/old/program_registry/ProgramRegistrySwitch')
));

type PropsProgramRegistryFormLazy = {
  element: Partial<ProgramRegistry>;
  registryKey?: string;
  page?: string;
  path?: string;

  onFormHide: any;
};

const ProgramRegistryFormLazy: React.FC<PropsProgramRegistryFormLazy> = React.memo(
  (props) => {
    const page = props.registryKey || props.page;
    const path = `${props.path ? `${props.path}-` : ''}employee-form`;

    const element = React.useMemo(
      () => {
        if (!props.element) {
          return null;
        }

        if (isObject(props.element) && !Object.keys(props.element).length) {
          return null;
        }

        return props.element;
      },
      [props.element],
    );

    return (
      <ErrorBoundaryForm>
        <React.Suspense fallback={<LoadingComponent />}>
          <ProgramRegistryFrom
            showForm={Boolean(props.element)}
            element={element}
            handleHide={props.onFormHide}

            page={page}
            path={path}
          />
        </React.Suspense>
      </ErrorBoundaryForm>
    );
  },
);

export default withFormRegistrySearch({})(ProgramRegistryFormLazy);
