import * as React from 'react';
import { get } from 'lodash';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import useWsCarPoints from 'components/new/utils/hooks/services/useWs/useWsCarPoints';
import { getSessionState } from 'redux-main/reducers/selectors';
import useWaybillFormData from 'components/@next/@form/hook_selectors/waybill/useWaybillForm';
import useMoscowTime from 'components/new/utils/hooks/services/useData/useMoscowTime';
import { diffDates } from 'components/@next/@utils/dates/dates';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';

type FieldIsBnsoBrokenProps = {
  formDataKey: string;
  md?: number;
};

const FieldIsBnsoBroken: React.FC<FieldIsBnsoBrokenProps> = React.memo(
  (props) => {
    const {
      page,
      path,
    } = useForm.useFormDataMeta<Waybill>(props.formDataKey);

    const car_id = useForm.useFormDataFormStatePickValue<Waybill, Waybill['car_id']>(props.formDataKey, 'car_id');
    const is_bnso_broken = useForm.useFormDataFormStatePickValue<Waybill, Waybill['is_bnso_broken']>(props.formDataKey, 'is_bnso_broken');

    const handleChange = useForm.useFormDataHandleChange<Waybill>(props.formDataKey);
    const IS_DRAFT = useWaybillFormData.useFormDataIsDraft(props.formDataKey);
    const selectedCar = useWaybillFormData.useFormDataGetSelectedCar(props.formDataKey);

    const wsStateDataUse = useWsCarPoints();
    const moscowTimeData = useMoscowTime(page, path);

    const token = etsUseSelector((state) => getSessionState(state).token);
    const points_ws = etsUseSelector((state) => getSessionState(state).appConfig.points_ws);

    React.useEffect(
      () => {
        if (IS_DRAFT) {
          wsStateDataUse.openConnection(
            points_ws,
            token,
          );
        }

        return wsStateDataUse.closeConnection();
      },
      [IS_DRAFT, token, points_ws],
    );

    /**
     * @todo
     */
    const gps_code = React.useMemo(
      () => {
        return get(
          selectedCar,
          'gps_code',
          null,
        );
      },
      [selectedCar],
    );

    React.useEffect(
      () => {
        if (!car_id) {
          handleChange({
            is_bnso_broken: null,
          });
        }
      },
      [car_id],
    );

    React.useEffect(
      () => {
        if (IS_DRAFT && !moscowTimeData.isLoading && gps_code) {
          const point = get(wsStateDataUse.wsStateData.wsState, gps_code, null);

          if (point) {
            const timeFromLastActive = diffDates(
              moscowTimeData.data.date,
              point.timestamp * 1000,
              'hours',
            );

            const is_bnso_broken_new = timeFromLastActive > 1;

            if (is_bnso_broken_new !== is_bnso_broken) {
              handleChange({
                is_bnso_broken: is_bnso_broken_new,
              });
            }
          } else if (gps_code) {
            const is_bnso_broken_new = true;

            if (is_bnso_broken_new !== is_bnso_broken) {
              handleChange({
                is_bnso_broken: is_bnso_broken_new,
              });
            }
          }
        }
      },
      [IS_DRAFT, wsStateDataUse.wsStateData.wsState, is_bnso_broken, gps_code, moscowTimeData],
    );

    const is_bnso_broken_text = React.useMemo(
      () => {
        if (is_bnso_broken === false) {
          return 'Исправен';
        }
        if (is_bnso_broken === true) {
          return 'Датчик ГЛОНАСС не исправен';
        }
      },
      [is_bnso_broken],
    );

    return (
      <EtsBootstrap.Col md={props.md || 12}>
        <ExtField
          id={`${path}_is_bnso_broken`}
          type="string"
          label="Исправность датчика ГЛОНАСС"
          value={is_bnso_broken_text}
          error={
            is_bnso_broken_text && is_bnso_broken
              ? 'Выполненные работы не будут учтены в системе'
              : ''
          }
          disabled
        />
      </EtsBootstrap.Col>
    );
  },
);

export default FieldIsBnsoBroken;
