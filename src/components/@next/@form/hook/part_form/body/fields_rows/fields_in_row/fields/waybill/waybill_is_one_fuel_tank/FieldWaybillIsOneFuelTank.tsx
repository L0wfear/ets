import * as React from 'react';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import { YES_NO_SELECT_OPTIONS_BOOL } from 'constants/dictionary';
import useWaybillFormData from 'components/@next/@form/hook_selectors/waybill/useWaybillForm';
import usePrevious from 'components/new/utils/hooks/usePrevious';

type FieldWaybillIsOneFuelTankProps = {
  formDataKey: string;
  md?: number;
};

const FieldWaybillIsOneFuelTank: React.FC<FieldWaybillIsOneFuelTankProps> = React.memo(
  (props) => {
    const { path } = useForm.useFormDataMeta<any>(props.formDataKey);
    const car_id = useForm.useFormDataFormStatePickValue<Waybill, Waybill['car_id']>(props.formDataKey, 'car_id');
    const equipment_fuel = useForm.useFormDataFormStatePickValue<Waybill, Waybill['equipment_fuel']>(props.formDataKey, 'equipment_fuel');
    const is_one_fuel_tank = useForm.useFormDataFormStatePickValue<Waybill, Waybill['is_one_fuel_tank']>(props.formDataKey, 'is_one_fuel_tank');
    const handleChange = useForm.useFormDataHandleChange<any>(props.formDataKey);
    const isPermitted = useForm.useFormDataIsPermitted<any>(props.formDataKey);
    const IS_CLOSED = useWaybillFormData.useFormDataIsClosed(props.formDataKey);
    const isShowField = Boolean(car_id && equipment_fuel === true);

    const handleChangeWrap = React.useCallback(
      (keyName, valueNew) => {
        handleChange({
          [keyName]: valueNew,
        });
      },
      [handleChange],
    );

    const previosIsShowField = usePrevious(isShowField);

    React.useEffect(
      () => {
        if (!isShowField && previosIsShowField) {
          handleChangeWrap('is_one_fuel_tank', true);
        }
      },
      [previosIsShowField, isShowField, handleChangeWrap],
    );

    return (
      <EtsBootstrap.Col md={props.md || 12}>
        {
          isShowField && (
            <ExtField
              id={`${path}_is_one_fuel_tank`}
              type="select"
              clearable={false}
              label="Таксировка с одного топливного бака"
              value={is_one_fuel_tank}
              options={YES_NO_SELECT_OPTIONS_BOOL}
              onChange={handleChangeWrap}
              disabled={IS_CLOSED || !isPermitted}

              boundKeys="is_one_fuel_tank"
            />
          )
        }
      </EtsBootstrap.Col>
    );
  },
);

export default FieldWaybillIsOneFuelTank;
