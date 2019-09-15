import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import useWaybillFormData from 'components/@next/@form/hook_selectors/waybill/useWaybillForm';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import useForm from 'components/@next/@form/hook_selectors/useForm';

type FieldCreateMissionProps = {
  formDataKey: any;
};

const FieldCreateMission: React.FC<FieldCreateMissionProps> = React.memo(
  (props) => {
    const IS_CLOSED = useWaybillFormData.useFormDataIsClosed(props.formDataKey);
    const isPermitted = useForm.useFormDataIsPermitted<Waybill>(props.formDataKey);
    const car_id = useForm.useFormDataFormStatePickValue<Waybill, Waybill['car_id']>(props.formDataKey, 'car_id');
    const isSelectedCarId = Boolean(car_id);

    const isDisabled = IS_CLOSED || !isSelectedCarId || !isPermitted;

    return (
      <EtsBootstrap.Col md={12}>
        <EtsBootstrap.Button disabled={isDisabled}>Создать задание</EtsBootstrap.Button>
      </EtsBootstrap.Col>
    );
  },
);

export default FieldCreateMission;
