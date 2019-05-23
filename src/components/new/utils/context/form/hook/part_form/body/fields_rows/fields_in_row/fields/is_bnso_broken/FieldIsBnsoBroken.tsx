import * as React from 'react';
import { get } from 'lodash';
import { ExtField } from 'components/ui/new/field/ExtField';
import useForm from 'components/new/utils/context/form/hoc_selectors/useForm';
import { FieldDataIsBnsoBroken } from 'components/new/utils/context/form/@types/fields/string';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import useWsCarPoints from 'components/new/utils/hooks/services/useWs/useWsCarPoints';
import { connect, DispatchProp } from 'react-redux';
import { getSessionState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';
import useWaybillFormData from 'components/new/utils/context/form/hoc_selectors/waybill/useWaybillForm';
import { WaybillFormStoreType } from 'components/new/pages/waybill/form/context/@types';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import useMoscowTime from 'components/new/utils/hooks/services/useData/useMoscowTime';
import { diffDates } from 'utils/dates';

type FieldIsBnsoBrokenStateProps = {
  token: InitialStateSession['token'];
  points_ws: InitialStateSession['appConfig']['points_ws'];
};
type FieldIsBnsoBrokenDispatchProps = DispatchProp;
type FieldIsBnsoBrokenOwnProps = {
  fieldData: FieldDataIsBnsoBroken;
  formDataKey: string;
};

type FieldIsBnsoBrokenProps = (
  FieldIsBnsoBrokenStateProps
  & FieldIsBnsoBrokenDispatchProps
  & FieldIsBnsoBrokenOwnProps
);

const FieldIsBnsoBroken: React.FC<FieldIsBnsoBrokenProps> = React.memo(
  (props) => {
    const {
      fieldData: { key, title },
    } = props;
    const page = useForm.useFormDataSchemaPage<any>(props.formDataKey);
    const path = useForm.useFormDataSchemaPath<any>(props.formDataKey);
    const formState = useForm.useFormDataFormState<any>(props.formDataKey);
    const formErrors = useForm.useFormDataFormErrors<any>(props.formDataKey);
    const handleChange = useForm.useFormDataHandleChange<any>(props.formDataKey);
    const IS_CLOSE_OR_IS_ACTIVE = useWaybillFormData.useFormDataIsActiveOrIsClosed(props.formDataKey);
    const waybillFormStore = useForm.useFormDataStore<Waybill, WaybillFormStoreType>(props.formDataKey);

    const wsStateDataUse = useWsCarPoints();
    const moscowTimeData = useMoscowTime(page, path);

    React.useEffect(
      () => {
        if (!IS_CLOSE_OR_IS_ACTIVE) {
          wsStateDataUse.openConnection(
            props.points_ws,
            props.token,
          );
        }

        return wsStateDataUse.closeConnection();
      },
      [IS_CLOSE_OR_IS_ACTIVE],
    );

    /**
     * @todo
     */
    const gps_code = React.useMemo(
      () => {
        return get(
          waybillFormStore.carList.options.find(( { rowData }) => rowData.asuods_id === formState.asuods_id),
          'gps_code',
          null,
        );
      },
      [waybillFormStore.carList, formState.asuods_id],
    );

    React.useEffect(
      () => {
        if (!IS_CLOSE_OR_IS_ACTIVE && !moscowTimeData.isLoading && gps_code) {
          const point = get(wsStateDataUse.wsStateData.wsState, gps_code, null);

          if (point) {
            const timeFromLastActive = diffDates(
              moscowTimeData.data.date,
              point.timestamp * 1000,
              'hours',
            );

            const is_bnso_broken = timeFromLastActive > 1;
            if (is_bnso_broken !== formState[key]) {
              handleChange({
                [key]: is_bnso_broken,
              });
            }
          }
        }
      },
      [IS_CLOSE_OR_IS_ACTIVE, wsStateDataUse.wsStateData.wsState, formState[key], gps_code, moscowTimeData, key, formState[key]],
    );

    const is_bnso_broken_text = React.useMemo(
      () => {
        if (formState[key] === false) {
          return 'Исправен';
        }
        if (formState[key] === true) {
          return 'Датчик ГЛОНАСС не исправен';
        }
      },
      [formState[key]],
    );

    return React.useMemo(
      () => (
        <EtsBootstrap.Col md={props.fieldData.md || 12}>
          <ExtField
            id={`${path}_${key}`}
            type="string"
            label={title}
            value={is_bnso_broken_text}
            error={
              is_bnso_broken_text && formState[key]
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
        key,
        title,
        is_bnso_broken_text,
        formState[key],
        formErrors[key],
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
