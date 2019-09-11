import * as React from 'react';
import { get } from 'lodash';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import ExtField from 'components/@next/@ui/renderFields/Field';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import useWaybillFormData from 'components/@next/@form/hook_selectors/waybill/useWaybillForm';

type WaybillFieldMotohoursEndProps = {
  formDataKey: string;
  md?: number;
};

const WaybillFieldMotohoursEnd: React.FC<WaybillFieldMotohoursEndProps> = React.memo(
  (props) => {
    const { path } = useForm.useFormDataMeta<any>(props.formDataKey);
    const motohours_end = useForm.useFormDataFormStatePickValue<Waybill, Waybill['motohours_end']>(props.formDataKey, 'motohours_end');

    const handleChange = useForm.useFormDataHandleChange<any>(props.formDataKey);
    const isPermitted = useForm.useFormDataIsPermitted<any>(props.formDataKey);
    const IS_CLOSE_OR_IS_ACTIVE = useWaybillFormData.useFormDataIsActiveOrIsClosed(props.formDataKey);
    const canEditIfClose = useWaybillFormData.useFormDataCanEditIfClose(props.formDataKey);
    const isPermittedForDepartureAndArrivalValues = useWaybillFormData.useFormDataIsPermittedForDepartureAndArrivalValues(props.formDataKey);
    const IS_CLOSED = useWaybillFormData.useFormDataIsClosed(props.formDataKey);

    const handleChangeWrap = React.useCallback(
      (keyName, valueNew) => {
        if (IS_CLOSE_OR_IS_ACTIVE) {
          const valueData = get(valueNew, 'target.value', null);

          handleChange({
            [keyName]: valueData ? Number(valueData) : null,
          });
        }
      },
      [handleChange, IS_CLOSE_OR_IS_ACTIVE],
    );

    React.useEffect(
      () => {
        return () => handleChangeWrap('motohours_end', null);
      },
      [handleChangeWrap],
    );

    return (
      <EtsBootstrap.Col md={props.md || 12}>
        {
          IS_CLOSE_OR_IS_ACTIVE && (
            <ExtField
              id={`${path}_motohours_end`}
              type="number"
              label="Возвращение в гараж, м/ч"
              value={motohours_end}
              onChange={handleChangeWrap}
              disabled={IS_CLOSED && !canEditIfClose || (!isPermitted && !isPermittedForDepartureAndArrivalValues)}

              boundKeys="motohours_end"
            />
          )
        }
      </EtsBootstrap.Col>
    );
  },
);

export default WaybillFieldMotohoursEnd;
