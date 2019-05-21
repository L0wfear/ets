import * as React from 'react';
import { get } from 'lodash';
import { ExtField } from 'components/ui/new/field/ExtField';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import useWaybillFormData from 'components/new/utils/context/form/hoc_selectors/waybill/useWaybillForm';
import {
  FieldDataDowntimeHoursWork,
  FieldDataDowntimeHoursDuty,
  FieldDataDowntimeHoursDinner,
  FieldDataDowntimeHoursRepair,
} from 'components/new/utils/context/form/@types/fields/string';
import useForm from 'components/new/utils/context/form/hoc_selectors/useForm';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';

type FieldOnLineStringProps = {
  formDataKey: string;
  fieldData: (
    FieldDataDowntimeHoursWork
    | FieldDataDowntimeHoursDuty
    | FieldDataDowntimeHoursDinner
    | FieldDataDowntimeHoursRepair
  );
};

const FieldOnLineString: React.FC<FieldOnLineStringProps> = React.memo(
  (props) => {
    const { fieldData: { key, title } } = props;
    const IS_CLOSED = useWaybillFormData.useFormDataIsClosed(props.formDataKey);
    const {
      [key]: value,
    } = useForm.useFormDataFormState<Waybill>(props.formDataKey);
    const {
      [key]: error,
    } = useForm.useFormDataFormErrors<any>(props.formDataKey);

    const isPermitted = useForm.useFormDataIsPermitted<Waybill>(props.formDataKey);
    const handleChange = useForm.useFormDataHandleChange<any>(props.formDataKey);

    const handleChangeWrap = React.useCallback(
      (event) => {
        const valueNew = get(event, 'target.value', event);
        handleChange({ [key]: valueNew || null });
      },
      [key, handleChange],
    );

    return React.useMemo(
      () => {
        return (
          <EtsBootstrap.Col md={6}>
            <ExtField
              id={key}
              type="string"
              label={title}
              disabled={IS_CLOSED || !isPermitted}
              value={value}
              onChange={handleChangeWrap}
              error={error}
            />
          </EtsBootstrap.Col>
        );
      },
      [
        props,
        IS_CLOSED,
        isPermitted,
        value,
        error,
        handleChangeWrap,
      ],
    );
  },
);

export default FieldOnLineString;
