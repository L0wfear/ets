import * as React from 'react';
import { isNumber } from 'util';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import ExtField from 'components/@next/@ui/renderFields/Field';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import useWaybillFormData from 'components/@next/@form/hook_selectors/waybill/useWaybillForm';

type WaybillFieldMotohoursDiffProps = {
  formDataKey: any;
  md?: number;
};

const WaybillFieldMotohoursDiff: React.FC<WaybillFieldMotohoursDiffProps> = React.memo(
  (props) => {
    const { path } = useForm.useFormDataMeta<any>(props.formDataKey);

    const motohours_start = useForm.useFormDataFormStatePickValue<Waybill, Waybill['motohours_start']>(props.formDataKey, 'motohours_start');
    const motohours_end = useForm.useFormDataFormStatePickValue<Waybill, Waybill['motohours_end']>(props.formDataKey, 'motohours_end');

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

    return (
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
    );
  },
);

export default WaybillFieldMotohoursDiff;
