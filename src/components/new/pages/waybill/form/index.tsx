import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { ProgramRegistry } from 'redux-main/reducers/modules/repair/program_registry/@types/programRegistry';

import withFormRegistrySearch from 'components/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import waybillActions from 'redux-main/reducers/modules/waybill/waybill_actions';
import { compose } from 'recompose';
import { connect, HandleThunkActionCreator } from 'react-redux';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';

const WaybillFormWrap = React.lazy(() => (
  import(/* webpackChunkName: "waybill_form_wrap" */ 'components/new/pages/waybill/form/context/WaybillForm')
));

type PropsWaybilFormlLazy = {
  element: Partial<ProgramRegistry>;
  registryKey?: string;
  page?: string;
  path?: string;

  onFormHide: any;

  uniqKeyForParams: string;

  actionGetWaybillById: HandleThunkActionCreator<typeof waybillActions.actionGetWaybillById>;
} & WithSearchProps;

const WaybilFormlLazy: React.FC<PropsWaybilFormlLazy> = React.memo(
  (props) => {
    const page = props.registryKey || props.page;
    const path = `${props.path ? `${props.path}-` : ''}employee-form`;

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
  withSearch,
  connect<any, any, any, any>(
    null,
    (dispatch: any) => ({
      actionGetWaybillById: (...arg: [any, any]) => (
        dispatch(
          waybillActions.actionGetWaybillById(...arg),
        )
      ),
    }),
  ),
  withFormRegistrySearch({
  noCheckDataInRegistryArray: true,
  uniqKeyName: 'id',
  }),
)(WaybilFormlLazy);
