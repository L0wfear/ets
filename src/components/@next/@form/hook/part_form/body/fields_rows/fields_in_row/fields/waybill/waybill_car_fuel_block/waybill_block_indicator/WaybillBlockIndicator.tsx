import * as React from 'react';

import useForm from 'components/@next/@form/hook_selectors/useForm';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import { hasMotohours } from 'utils/functions';
import WaybillBlockMotohours from './motohours/WaybillBlockMotohours';
import WaybillBlockOdometr from './odometr/WaybillBlockOdometr';

type WaybillBlockIndicatorProps = {
  formDataKey: string;
  md?: number;
};

const WaybillBlockIndicator: React.FC<WaybillBlockIndicatorProps> = React.memo(
  (props) => {
    const gov_number = useForm.useFormDataFormStatePickValue<Waybill, Waybill['gov_number']>(props.formDataKey, 'gov_number');

    const carHasMotohours = hasMotohours(gov_number);

    return carHasMotohours
      ? (
        <WaybillBlockMotohours formDataKey={props.formDataKey} md={props.md} />
      )
      : (
        <WaybillBlockOdometr formDataKey={props.formDataKey} md={props.md} />
      );
  },
);

export default WaybillBlockIndicator;
