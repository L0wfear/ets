import * as React from 'react';
import { get } from 'lodash';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import useWaybillFormData from 'components/@next/@form/hook_selectors/waybill/useWaybillForm';
import usePrevious from 'components/new/utils/hooks/usePrevious';
type WaybillFieldOdometrStartProps = {
  formDataKey: string;
  md?: number;
};

const WaybillFieldOdometrStart: React.FC<WaybillFieldOdometrStartProps> = React.memo(
  (props) => {
    const { path } = useForm.useFormDataMeta<any>(props.formDataKey);
    const {
      car_id,
      odometr_start,
    } = useForm.useFormDataFormState<Waybill>(props.formDataKey);
    const handleChange = useForm.useFormDataHandleChange<any>(props.formDataKey);
    const isPermitted = useForm.useFormDataIsPermitted<any>(props.formDataKey);
    const IS_CLOSE_OR_IS_ACTIVE = useWaybillFormData.useFormDataIsActiveOrIsClosed(props.formDataKey);
    const isSelectedCarId = Boolean(car_id);

    const handleChangeWrap = React.useCallback(
      (keyName, valueNew) => {
        const valueData = get(valueNew, 'target.value', null);

        handleChange({
          [keyName]: valueData ? Number(valueData) : null,
        });
      },
      [handleChange],
    );

    const previosIsSelectedCarId = usePrevious(isSelectedCarId);

    React.useEffect(
      () => {
        return () => handleChangeWrap('odometr_start', null);
      },
      [],
    );

    React.useEffect(
      () => {
        if (!isSelectedCarId && previosIsSelectedCarId) {
          handleChangeWrap('odometr_start', null);
        }
      },
      [previosIsSelectedCarId, isSelectedCarId, handleChangeWrap],
    );

    return (
      <EtsBootstrap.Col md={props.md || 12}>
          <ExtField
          id={`${path}_odometr_start`}
          type="number"
          label="Выезд из гаража, км"
          value={odometr_start}
          onChange={handleChangeWrap}
          disabled={IS_CLOSE_OR_IS_ACTIVE || !isPermitted}

          boundKeys="odometr_start"
        />
      </EtsBootstrap.Col>
    );
  },
);

export default WaybillFieldOdometrStart;
