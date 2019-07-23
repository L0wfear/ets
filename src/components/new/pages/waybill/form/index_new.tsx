import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import withFormRegistrySearch from 'components/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { compose } from 'recompose';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';

const WaybillFormWrap = React.lazy(() => (
  import(/* webpackChunkName: "waybill_form_wrap" */ 'components/new/pages/waybill/form/context/WaybillForm')
));

type PropsWaybilFormlLazy = {
  element: Partial<Waybill>;
  registryKey?: string;
  page?: string;
  path?: string;

  onFormHide: any;

};

const WaybilFormlLazy: React.FC<PropsWaybilFormlLazy> = React.memo(
  (props) => {
    const page = props.registryKey || props.page;
    const path = `${props.path ? `${props.path}-` : ''}waybill-form`;

    return (
      <ErrorBoundaryForm>
        <React.Suspense fallback={<LoadingComponent />}>
        {
          props.element
            && (
              <WaybillFormWrap
                element={props.element}
                handleHide={props.onFormHide}

                page={page}
                path={path}
              />
            )
        }
        </React.Suspense>
      </ErrorBoundaryForm>
    );
  },
);

export default compose<any, any>(
  withFormRegistrySearch({
  noCheckDataInRegistryArray: true,
  uniqKeyName: 'id',
  }),
)(WaybilFormlLazy);
