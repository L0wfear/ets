import * as React from 'react';
import { get } from 'lodash';

import { ExtField } from 'components/old/ui/new/field/ExtField';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import useWaybillFormData from 'components/@next/@form/hook_selectors/waybill/useWaybillForm';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { getDefaultWaybill } from 'components/new/pages/waybill/form/context/utils';

type WaybillFuelStartProps = {
  formDataKey: string;
  md?: number;
};

const WaybillFuelStart: React.FC<WaybillFuelStartProps> = React.memo(
  (props) => {
    const { path } = useForm.useFormDataMeta<any>(props.formDataKey);
    const {
      fuel_start,
    } = useForm.useFormDataFormState<Waybill>(props.formDataKey);
    const handleChange = useForm.useFormDataHandleChange<any>(props.formDataKey);
    const isPermitted = useForm.useFormDataIsPermitted<any>(props.formDataKey);
    const IS_CLOSE_OR_IS_ACTIVE = useWaybillFormData.useFormDataIsActiveOrIsClosed(props.formDataKey);

    React.useEffect(
      () => {
        return () => handleChangeWrap('fuel_start', getDefaultWaybill(null).fuel_start);
      },
      [],
    );

    const handleChangeWrap = React.useCallback(
      (keyName, valueNew) => {
        const valueData = get(valueNew, 'target.value', null);

        handleChange({
          [keyName]: valueData ? Number(valueData) : null,
        });
      },
      [handleChange],
    );

    return (
      <EtsBootstrap.Col md={props.md || 12}>
        <ExtField
          id={`${path}_fuel_start`}
          type="number"
          label="Выезд, л"
          value={fuel_start}
          onChange={handleChangeWrap}
          disabled={IS_CLOSE_OR_IS_ACTIVE || !isPermitted}

          boundKeys="fuel_start"
        />
      </EtsBootstrap.Col>
    );
  },
);

export default WaybillFuelStart;
