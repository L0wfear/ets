import * as React from 'react';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import { YES_NO_SELECT_OPTIONS_BOOL } from 'constants/dictionary';
import useWaybillFormData from 'components/@next/@form/hook_selectors/waybill/useWaybillForm';
import usePrevious from 'components/new/utils/hooks/usePrevious';

type FieldWaybillEquipmentFuelProps = {
  formDataKey: string;
  md?: number;
};

const FieldWaybillEquipmentFuel: React.FC<FieldWaybillEquipmentFuelProps> = React.memo(
  (props) => {
    const path = useForm.useFormDataSchemaPath<any>(props.formDataKey);
    const {
      car_id,
      equipment_fuel,
    } = useForm.useFormDataFormState<Waybill>(props.formDataKey);
    const handleChange = useForm.useFormDataHandleChange<any>(props.formDataKey);
    const isPermitted = useForm.useFormDataIsPermitted<any>(props.formDataKey);
    const IS_CLOSED = useWaybillFormData.useFormDataIsClosed(props.formDataKey);
    const isSelectedCarId = Boolean(car_id);

    const handleChangeWrap = React.useCallback(
      (keyName, valueNew) => {
        handleChange({
          [keyName]: valueNew,
        });
      },
      [handleChange],
    );

    const previosIsSelectedCarId = usePrevious(isSelectedCarId);

    React.useEffect(
      () => {
        if (!isSelectedCarId && previosIsSelectedCarId) {
          handleChangeWrap('equipment_fuel', null);
        }
      },
      [previosIsSelectedCarId, isSelectedCarId, handleChangeWrap],
    );

    return React.useMemo(
      () => {
        return (
          <EtsBootstrap.Col md={props.md || 12}>
            {
              isSelectedCarId && (
                <ExtField
                  id={`${path}_equipment_fuel`}
                  type="select"
                  clearable={false}
                  label="На ТС установлено спецоборудование"
                  value={equipment_fuel}
                  options={YES_NO_SELECT_OPTIONS_BOOL}
                  onChange={handleChangeWrap}
                  disabled={IS_CLOSED || !isPermitted}

                  boundKeys="equipment_fuel"
                />
              )
            }
          </EtsBootstrap.Col>
        );
      },
      [
        isSelectedCarId,
        path,
        props,
        equipment_fuel,
        handleChangeWrap,
        isPermitted,
        IS_CLOSED,
      ],
    );
  },
);

export default FieldWaybillEquipmentFuel;
