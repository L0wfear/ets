import * as React from 'react';
import { withFormRegistrySearchNew, WithFormRegistrySearchProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearchNew';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';

const WaybillForm = React.lazy(() => (
  import(/* webpackChunkName: "waybill_form_wrap" */ 'components/new/pages/waybill/form/context/WaybillForm')
));

export default withFormRegistrySearchNew<WithFormRegistrySearchProps<Partial<Waybill>>, Waybill>({
  add_path: 'waybill',
  no_find_in_arr: true,
  replace_uniqKey_on: 'id',
})(WaybillForm);
