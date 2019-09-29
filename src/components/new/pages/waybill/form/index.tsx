import * as React from 'react';
import { get } from 'lodash';

import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { withFormRegistrySearch, WithFormRegistrySearchProps, WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import { actionGetWaybillById } from 'redux-main/reducers/modules/waybill/waybill_actions';

const WaybillFormWrap: any = React.lazy(() => (
  import(/* webpackChunkName: "waybill_form_wrap" */ 'components/old/waybill/WaybillFormWrap')
));

const WaybilFormlLazy: React.FC<WithFormRegistrySearchAddProps<Partial<Waybill>>> = React.memo(
  (props) => {
    const [elementMemo, setElementMemo] = React.useState(null);
    const dispatch = etsUseDispatch();

    React.useEffect(
      () => {
        setElementMemo(null);

        const id = get(props.element, 'id', null);
        if (id) {
          dispatch(actionGetWaybillById(id, props)).then(
            (waybill) => {
              if (waybill) {
                setElementMemo(waybill);
              } else {
                props.handleHide(false);
              }
            },
          );
        }
      },
      [props.element],
    );

    const onCallbackLegacy = React.useCallback(
      () => {
        props.handleHide(true);
      },
      [props.handleHide],
    );

    const is_creating = props.match.params.waybill_id === 'create';

    return Boolean(is_creating || elementMemo) && (
      <WaybillFormWrap
        showForm
        element={is_creating ? null : elementMemo}
        onFormHide={props.handleHide}
        onCallback={onCallbackLegacy}

        page={props.page}
        path={props.path}
      />
    );
  },
);

export default withFormRegistrySearch<WithFormRegistrySearchProps<Partial<Waybill>>, Partial<Waybill>>({
  add_path: 'waybill',
  no_find_in_arr: true,
  replace_uniqKey_on: 'id',
})(WaybilFormlLazy);
