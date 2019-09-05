import * as React from 'react';
import { ButtonTableInput } from 'components/new/ui/table_input/styled';
import { isNullOrUndefined } from 'util';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import useForm from 'components/@next/@form/hook_selectors/useForm';

type WaybillButtonCarRefillRemoveProps = {
  formDataKey: string;
  selectedRowIndex: number;
  setSelectedRowIndex: React.Dispatch<React.SetStateAction<number>>;
};

const WaybillButtonCarRefillRemove: React.FC<WaybillButtonCarRefillRemoveProps> = React.memo(
  (props) => {
    const handleChange = useForm.useFormDataHandleChange<Waybill>(props.formDataKey);
    const {
      car_refill,
    } = useForm.useFormDataFormState<Waybill>(props.formDataKey);

    const handleRemoveRow = React.useCallback(
      () => {
        handleChange({
          car_refill: car_refill.filter((_, index) => index !== props.selectedRowIndex),
        });
      },
      [props.selectedRowIndex, handleChange, car_refill],
    );

    return React.useMemo(
      () => (
        <ButtonTableInput block width={160} onClick={handleRemoveRow} disabled={isNullOrUndefined(props.selectedRowIndex)}>Удалить заправку</ButtonTableInput>
      ),
      [
        props,
        handleRemoveRow,
      ],
    );
  },
);

export default WaybillButtonCarRefillRemove;
