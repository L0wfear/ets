import * as React from 'react';
import { get } from 'lodash';
import { ExtField } from 'components/ui/new/field/ExtField';
import useForm from 'components/new/utils/context/form/hook_selectors/useForm';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import useWsCarPoints from 'components/new/utils/hooks/services/useWs/useWsCarPoints';
import { connect, DispatchProp } from 'react-redux';
import { getSessionState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';
import useWaybillFormData from 'components/new/utils/context/form/hook_selectors/waybill/useWaybillForm';
import useMoscowTime from 'components/new/utils/hooks/services/useData/useMoscowTime';
import { diffDates } from 'utils/dates';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';

type FieldIsBnsoBrokenStateProps = {
  token: InitialStateSession['token'];
  points_ws: InitialStateSession['appConfig']['points_ws'];
};
type FieldIsBnsoBrokenDispatchProps = DispatchProp;
type FieldIsBnsoBrokenOwnProps = {
  formDataKey: string;
  md?: number;
};

type FieldIsBnsoBrokenProps = (
  FieldIsBnsoBrokenStateProps
  & FieldIsBnsoBrokenDispatchProps
  & FieldIsBnsoBrokenOwnProps
);

const FieldIsBnsoBroken: React.FC<FieldIsBnsoBrokenProps> = React.memo(
  (props) => {
    const page = useForm.useFormDataSchemaPage<Waybill>(props.formDataKey);
    const path = useForm.useFormDataSchemaPath<Waybill>(props.formDataKey);
    const formState = useForm.useFormDataFormState<Waybill>(props.formDataKey);
    const formErrors = useForm.useFormDataFormErrors<Waybill>(props.formDataKey);
    const handleChange = useForm.useFormDataHandleChange<Waybill>(props.formDataKey);
    const IS_DRAFT = useWaybillFormData.useFormDataIsDraft(props.formDataKey);
    const selectedCar = useWaybillFormData.useFormDataFetSelectedCar(props.formDataKey);

    const wsStateDataUse = useWsCarPoints();
    const moscowTimeData = useMoscowTime(page, path);

    React.useEffect(
      () => {
        if (IS_DRAFT) {
          wsStateDataUse.openConnection(
            props.points_ws,
            props.token,
          );
        }

        return wsStateDataUse.closeConnection();
      },
      [IS_DRAFT],
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
        if (!formState.car_id) {
          handleChange({
            is_bnso_broken: null,
          });
        }
      },
      [formState.car_id],
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

            const is_bnso_broken = timeFromLastActive > 1;

            if (is_bnso_broken !== formState.is_bnso_broken) {
              handleChange({
                is_bnso_broken,
              });
            }
          } else if (gps_code) {
            const is_bnso_broken = true;

            if (is_bnso_broken !== formState.is_bnso_broken) {
              handleChange({
                is_bnso_broken,
              });
            }
          }
        }
      },
      [IS_DRAFT, wsStateDataUse.wsStateData.wsState, formState.is_bnso_broken, gps_code, moscowTimeData],
    );

    const is_bnso_broken_text = React.useMemo(
      () => {
        if (formState.is_bnso_broken === false) {
          return 'Исправен';
        }
        if (formState.is_bnso_broken === true) {
          return 'Датчик ГЛОНАСС не исправен';
        }
      },
      [formState.is_bnso_broken],
    );

    return React.useMemo(
      () => (
        <EtsBootstrap.Col md={props.md || 12}>
          <ExtField
            id={`${path}_is_bnso_broken`}
            type="string"
            label="Исправность датчика ГЛОНАСС"
            value={is_bnso_broken_text}
            error={
              is_bnso_broken_text && formState.is_bnso_broken
                ? 'Выполненные работы не будут учтены в системе'
                : ''
            }
            disabled
          />
        </EtsBootstrap.Col>
      ),
      [
        props,
        path,
        is_bnso_broken_text,
        formState.is_bnso_broken,
        formErrors.is_bnso_broken,
      ],
    );
  },
);

export default connect<FieldIsBnsoBrokenStateProps, FieldIsBnsoBrokenDispatchProps, FieldIsBnsoBrokenOwnProps, ReduxState>(
  (state) => ({
    token: getSessionState(state).token,
    points_ws: getSessionState(state).appConfig.points_ws,
  }),
)(FieldIsBnsoBroken);
