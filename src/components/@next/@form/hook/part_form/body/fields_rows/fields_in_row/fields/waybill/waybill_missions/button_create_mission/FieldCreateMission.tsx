import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import useWaybillFormData from 'components/@next/@form/hook_selectors/waybill/useWaybillForm';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import useForm from 'components/@next/@form/hook_selectors/useForm';

type FieldCreateMissionProps = {
  formDataKey: string;
};

const FieldCreateMission: React.FC<FieldCreateMissionProps> = React.memo(
  (props) => {
    const IS_CLOSED = useWaybillFormData.useFormDataIsClosed(props.formDataKey);
    const isPermitted = useForm.useFormDataIsPermitted<Waybill>(props.formDataKey);
    const { car_id } = useForm.useFormDataFormState<Waybill>(props.formDataKey);
    const isSelectedCarId = Boolean(car_id);

    return React.useMemo(
      () => {
        return (
          <EtsBootstrap.Col md={12}>
            <EtsBootstrap.Button disabled={IS_CLOSED || !isSelectedCarId || !isPermitted}>Создать задание</EtsBootstrap.Button>
          </EtsBootstrap.Col>
        );
      },
      [
        IS_CLOSED,
        isPermitted,
        isSelectedCarId,
      ],
    );
  },
);

export default FieldCreateMission;
