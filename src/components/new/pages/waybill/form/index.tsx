import * as React from 'react';
import LoadingComponent from 'components/old/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { ProgramRegistry } from 'redux-main/reducers/modules/repair/program_registry/@types/programRegistry';

import withFormRegistrySearch from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { get } from 'lodash';
import waybillActions from 'redux-main/reducers/modules/waybill/waybill_actions';
import { compose } from 'recompose';
import { connect, HandleThunkActionCreator } from 'react-redux';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';

const WaybillFormWrap: any = React.lazy(() => (
  import(/* webpackChunkName: "waybill_form_wrap" */ 'components/old/waybill/WaybillFormWrap')
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
    const [elementMemo, setElementMemo] = React.useState(null);
    const page = props.registryKey || props.page;
    const path = `${props.path ? `${props.path}-` : ''}employee-form`;

    React.useEffect(
      () => {
        setElementMemo(null);

        const id = get(props.element, 'id', null);
        if (id) {
          props.actionGetWaybillById(
            id,
            { page, path },
          ).then(
            (waybill) => {
              if (waybill) {
                setElementMemo(waybill);
              } else {
                props.onFormHide(false);
              }
            },
          );
        }
      },
      [props.element],
    );

    const onCallbackLegacy = React.useCallback(
      () => {
        props.onFormHide(true);
      },
      [props.onFormHide],
    );

    const is_creating = props.match.params.waybill_id === 'create';

    return (
      <ErrorBoundaryForm>
        <React.Suspense fallback={<LoadingComponent />}>
        {
          (is_creating || elementMemo)
            && (
              <WaybillFormWrap
                showForm
                element={is_creating ? null : elementMemo}
                onFormHide={props.onFormHide}
                onCallback={onCallbackLegacy}

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
