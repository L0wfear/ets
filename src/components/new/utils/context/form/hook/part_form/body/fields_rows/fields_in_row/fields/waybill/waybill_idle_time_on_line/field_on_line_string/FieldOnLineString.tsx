import * as React from 'react';
import { get } from 'lodash';
import { connect, DispatchProp } from 'react-redux';
import { ExtField } from 'components/ui/new/field/ExtField';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import useWaybillFormData from 'components/new/utils/context/form/hook_selectors/waybill/useWaybillForm';
import {
  FieldDataDowntimeHoursWork,
  FieldDataDowntimeHoursDuty,
  FieldDataDowntimeHoursDinner,
  FieldDataDowntimeHoursRepair,
} from 'components/new/utils/context/form/@types/fields/string';
import useForm from 'components/new/utils/context/form/hook_selectors/useForm';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import { ReduxState } from 'redux-main/@types/state';
import { getSessionState } from 'redux-main/reducers/selectors';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';

type FieldOnLineStringStateProps = {
  permissionsSet: InitialStateSession['userData']['permissionsSet'];
};
type FieldOnLineStringDispatchProps = DispatchProp;
type FieldOnLineStringOwnProps = {
  formDataKey: string;
  fieldData: (
    FieldDataDowntimeHoursWork
    | FieldDataDowntimeHoursDuty
    | FieldDataDowntimeHoursDinner
    | FieldDataDowntimeHoursRepair
  );
};

type FieldOnLineStringProps = (
  FieldOnLineStringStateProps
  & FieldOnLineStringDispatchProps
  & FieldOnLineStringOwnProps
);

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

    const canEditIfClose = useWaybillFormData.useFormDataCanEditIfClose(props.formDataKey, props.permissionsSet);
    // canEditIfClose

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
              disabled={IS_CLOSED && !canEditIfClose || !isPermitted}
              value={value}
              onChange={handleChangeWrap}
              error={error}
            />
          </EtsBootstrap.Col>
        );
      },
      [
        props,
        canEditIfClose,
        IS_CLOSED,
        isPermitted,
        value,
        error,
        handleChangeWrap,
      ],
    );
  },
);

export default connect<FieldOnLineStringStateProps, FieldOnLineStringDispatchProps, FieldOnLineStringOwnProps, ReduxState>(
  (state) => ({
    permissionsSet: getSessionState(state).userData.permissionsSet,
  }),
)(FieldOnLineString);
