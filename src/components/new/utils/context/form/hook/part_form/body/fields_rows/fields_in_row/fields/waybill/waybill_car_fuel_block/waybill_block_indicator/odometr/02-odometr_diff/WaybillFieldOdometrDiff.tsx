import * as React from 'react';
import { isNumber } from 'util';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import useForm from 'components/new/utils/context/form/hook_selectors/useForm';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import useWaybillFormData from 'components/new/utils/context/form/hook_selectors/waybill/useWaybillForm';

type WaybillFieldOdometrDiffProps = {
  formDataKey: string;
  md?: number;
};

const WaybillFieldOdometrDiff: React.FC<WaybillFieldOdometrDiffProps> = React.memo(
  (props) => {
    const path = useForm.useFormDataSchemaPath<any>(props.formDataKey);
    const {
      odometr_start,
      odometr_end,
    } = useForm.useFormDataFormState<Waybill>(props.formDataKey);
    const IS_CLOSE_OR_IS_ACTIVE = useWaybillFormData.useFormDataIsActiveOrIsClosed(props.formDataKey);

    const odometr_diff = React.useMemo(
      () => {
        if (isNumber(odometr_end)) {
          return odometr_end - odometr_start;
        }

        return null;
      },
      [odometr_start, odometr_end],
    );

    return React.useMemo(
      () => (
        <EtsBootstrap.Col md={props.md || 12}>
          {
            IS_CLOSE_OR_IS_ACTIVE && (
              <ExtField
                id={`${path}_odometr_diff`}
                type="number"
                label="Пробег, км"
                value={odometr_diff}
                disabled
              />
            )
          }
        </EtsBootstrap.Col>
      ),
      [
        props,
        path,
        odometr_diff,
      ],
    );
  },
);

export default WaybillFieldOdometrDiff;
