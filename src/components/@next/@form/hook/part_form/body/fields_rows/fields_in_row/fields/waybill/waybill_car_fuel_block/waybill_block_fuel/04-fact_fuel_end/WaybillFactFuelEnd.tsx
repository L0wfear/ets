import * as React from 'react';
import { get } from 'lodash';

import { ExtField } from 'components/old/ui/new/field/ExtField';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import useWaybillFormData from 'components/@next/@form/hook_selectors/waybill/useWaybillForm';

type WaybillFactFuelEndProps = {
  formDataKey: string;
  md?: number;
};

const WaybillFactFuelEnd: React.FC<WaybillFactFuelEndProps> = React.memo(
  (props) => {
    const { path } = useForm.useFormDataMeta<any>(props.formDataKey);
    const fact_fuel_end = useForm.useFormDataFormStatePickValue<Waybill, Waybill['fact_fuel_end']>(props.formDataKey, 'fact_fuel_end');

    const handleChange = useForm.useFormDataHandleChange<any>(props.formDataKey);
    const IS_ACTIVE = useWaybillFormData.useFormDataIsActive(props.formDataKey);
    const isPermitted = useForm.useFormDataIsPermitted<any>(props.formDataKey);
    const canEditIfClose = useWaybillFormData.useFormDataCanEditIfClose(props.formDataKey);
    const IS_CLOSED = useWaybillFormData.useFormDataIsClosed(props.formDataKey);

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
      <React.Fragment>
        <EtsBootstrap.Col md={props.md || 12}>
          <ExtField
            id={`${path}_fact_fuel_end`}
            type="number"
            label="Возврат фактический, л"
            value={fact_fuel_end}
            onChange={handleChangeWrap}
            disabled={
              !(IS_ACTIVE || IS_CLOSED && canEditIfClose)
              || !isPermitted
            }
          />
        </EtsBootstrap.Col>
        <EtsBootstrap.Col md={props.md || 12}>
          Значение поля «Возврат фактический, л» обновляется при редактировании таксировки.
        </EtsBootstrap.Col>
      </React.Fragment>
    );
  },
);

export default WaybillFactFuelEnd;
