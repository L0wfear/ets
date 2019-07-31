import * as React from 'react';
import { isNumber } from 'util';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import useForm from 'components/new/utils/context/form/hook_selectors/useForm';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import useWaybillFormData from 'components/new/utils/context/form/hook_selectors/waybill/useWaybillForm';

type WaybillFieldMotohoursDiffProps = {
  formDataKey: string;
  md?: number;
};

const WaybillFieldMotohoursDiff: React.FC<WaybillFieldMotohoursDiffProps> = React.memo(
  (props) => {
    const path = useForm.useFormDataSchemaPath<any>(props.formDataKey);
    const {
      motohours_start,
      motohours_end,
    } = useForm.useFormDataFormState<Waybill>(props.formDataKey);
    const IS_CLOSE_OR_IS_ACTIVE = useWaybillFormData.useFormDataIsActiveOrIsClosed(props.formDataKey);

    const motohours_diff = React.useMemo(
      () => {
        if (isNumber(motohours_end)) {
          return motohours_end - motohours_start;
        }

        return null;
      },
      [motohours_start, motohours_end],
    );

    return React.useMemo(
      () => (
        <EtsBootstrap.Col md={props.md || 12}>
          {
            IS_CLOSE_OR_IS_ACTIVE && (
              <ExtField
                id={`${path}_motohours_diff`}
                type="number"
                label="Пробег, м/ч"
                value={motohours_diff}
                disabled
              />
            )
          }
        </EtsBootstrap.Col>
      ),
      [
        props,
        path,
        motohours_diff,
      ],
    );
  },
);

export default WaybillFieldMotohoursDiff;
