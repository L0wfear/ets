import * as React from 'react';
import TableInput from 'components/new/ui/table_input/TableInput';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import useWaybillFormData from 'components/@next/@form/hook_selectors/waybill/useWaybillForm';
import { useWaybillLoadCarRefillFuelCards } from './useWaybillCarRefillFuelCards';
import { useWaybillCarRefillMeta } from './useWaybillCarRefillMeta';
import { useWaybillLoadCarRefillType } from './useWaybillCarRefillType';

type WaybillCarRefillTableInputProps = {
  formDataKey: string;
  selectedRowIndex: number;
  setSelectedRowIndex: React.Dispatch<React.SetStateAction<number>>;
};

const WaybillCarRefillTableInput: React.FC<WaybillCarRefillTableInputProps> = React.memo(
  (props) => {
    const {
      car_refill,
    } = useForm.useFormDataFormState<Waybill>(props.formDataKey);
    const handleChange = useForm.useFormDataHandleChange<Waybill>(props.formDataKey);
    const isPermitted = useForm.useFormDataIsPermitted<any>(props.formDataKey);
    const canEditIfClose = useWaybillFormData.useFormDataCanEditIfClose(props.formDataKey);
    const IS_CLOSED = useWaybillFormData.useFormDataIsClosed(props.formDataKey);

    useWaybillLoadCarRefillType(props.formDataKey);
    useWaybillLoadCarRefillFuelCards(props.formDataKey);
    const tableMeta = useWaybillCarRefillMeta(props.formDataKey);

    const disabled = (
      IS_CLOSED && !canEditIfClose || !isPermitted
    );

    const handleChangeWrap = React.useCallback(
      (car_refill_new) => {
        if (!disabled) {
          handleChange({
            car_refill: car_refill_new,
          });
        }
      },
      [handleChange, disabled],
    );

    return React.useMemo(
      () => (
          <TableInput
            meta={tableMeta}
            array={car_refill}
            onChange={handleChangeWrap}

            header={null}
            selectedRowIndex={props.selectedRowIndex}
            setSelectedRowIndex={props.setSelectedRowIndex}

            disabled={disabled}
          />
      ),
      [
        tableMeta,
        props.selectedRowIndex,
        props.setSelectedRowIndex,
        car_refill,
        disabled,
      ],
    );
  },
);

export default WaybillCarRefillTableInput;
