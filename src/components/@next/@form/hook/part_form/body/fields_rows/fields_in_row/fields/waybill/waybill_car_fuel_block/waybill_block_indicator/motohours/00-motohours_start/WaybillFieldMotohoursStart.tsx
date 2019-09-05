import * as React from 'react';
import { get } from 'lodash';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import useWaybillFormData from 'components/@next/@form/hook_selectors/waybill/useWaybillForm';
import usePrevious from 'components/new/utils/hooks/usePrevious';
type WaybillFieldMotohoursStartProps = {
  formDataKey: string;
  md?: number;
};

const WaybillFieldMotohoursStart: React.FC<WaybillFieldMotohoursStartProps> = React.memo(
  (props) => {
    const path = useForm.useFormDataSchemaPath<any>(props.formDataKey);
    const {
      car_id,
      motohours_start,
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
        if (!isSelectedCarId && previosIsSelectedCarId) {
          handleChangeWrap('motohours_start', null);
        }
      },
      [previosIsSelectedCarId, isSelectedCarId, handleChangeWrap],
    );

    React.useEffect(
      () => {
        return () => handleChangeWrap('motohours_start', null);
      },
      [],
    );

    return React.useMemo(
      () => (
        <EtsBootstrap.Col md={props.md || 12}>
           <ExtField
            id={`${path}_motohours_start`}
            type="number"
            label="Выезд из гаража, м/ч"
            value={motohours_start}
            onChange={handleChangeWrap}
            disabled={IS_CLOSE_OR_IS_ACTIVE || !isPermitted}

            boundKeys="motohours_start"
          />
        </EtsBootstrap.Col>
      ),
      [
        props,
        path,
        motohours_start,
        handleChangeWrap,
        IS_CLOSE_OR_IS_ACTIVE,
        isPermitted,
      ],
    );
  },
);

export default WaybillFieldMotohoursStart;
