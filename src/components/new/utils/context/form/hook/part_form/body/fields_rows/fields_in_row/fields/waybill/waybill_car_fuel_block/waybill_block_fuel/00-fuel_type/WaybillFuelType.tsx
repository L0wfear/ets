import * as React from 'react';
import { ExtField } from 'components/ui/new/field/ExtField';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import { ReduxState } from 'redux-main/@types/state';
import { getSessionState } from 'redux-main/reducers/selectors';
import { useSelector } from 'react-redux';
import useForm from 'components/new/utils/context/form/hook_selectors/useForm';
import useWaybillFormData from 'components/new/utils/context/form/hook_selectors/waybill/useWaybillForm';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { getDefaultWaybill } from 'components/new/pages/waybill/form/context/utils';

type WaybillFuelTypeProps = {
  formDataKey: string;
  md?: number;
};

const WaybillFuelType: React.FC<WaybillFuelTypeProps> = React.memo(
  (props) => {
    const path = useForm.useFormDataSchemaPath<any>(props.formDataKey);
    const {
      fuel_type,
    } = useForm.useFormDataFormState<Waybill>(props.formDataKey);
    const handleChange = useForm.useFormDataHandleChange<any>(props.formDataKey);
    const isPermitted = useForm.useFormDataIsPermitted<any>(props.formDataKey);
    const IS_CLOSED = useWaybillFormData.useFormDataIsClosed(props.formDataKey);
    const FUEL_TYPE = useSelector(
      (state: ReduxState) => getSessionState(state).appConfig.enums.FUEL_TYPE,
    );

    React.useEffect(
      () => {
        return () => handleChangeWrap('fuel_type', getDefaultWaybill(null).fuel_type);
      },
      [],
    );

    const handleChangeWrap = React.useCallback(
      (keyField, valueNew) => {
        handleChange({
          [keyField]: valueNew,
        });
      },
      [handleChange],
    );

    const options = React.useMemo(
      () => (
        Object.entries(FUEL_TYPE).map(
          ([fuelKey, fuelName]) => ({
            value: fuelKey,
            label: fuelName,
          }),
        )
      ),
      [],
    );

    return React.useMemo(
      () => (
        <EtsBootstrap.Col md={props.md || 12}>
          <ExtField
            id={`${path}_fuel_type`}
            type="select"
            label="Тип топлива"
            options={options}
            value={fuel_type}
            onChange={handleChangeWrap}
            disabled={IS_CLOSED || !isPermitted}

            boundKeys="fuel_type"
          />
        </EtsBootstrap.Col>
      ),
      [
        props,
        path,
        handleChangeWrap,
        fuel_type,
        IS_CLOSED,
        isPermitted,
      ],
    );
  },
);

export default WaybillFuelType;
