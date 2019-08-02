import * as React from 'react';

import {
  EdcRequestCancelFormProps,
  EdcRequestCancelFormStateProps,
  EdcRequestCancelFormDispatchProps,
  EdcRequestCancelFormOwnProps,
  EdcRequestCancelFormPropsWithForm,
  EdcRequestCancel,
} from './@types/EdcRequestCancel';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { ReduxState } from 'redux-main/@types/state';
import {
  getDefaultDutyMissionElement,
} from './utils';
import { edcRequestCancelSchema } from './schema';

import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import edcRequestPermissions from '../../_config-data/permissions';
import { makeDate } from 'components/@next/@utils/dates/dates';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import edcRequestActions from 'redux-main/reducers/modules/edc_request/edc_request_actions';
import { defaultSelectListMapper } from 'components/old/ui/input/ReactSelect/utils';
import { get } from 'lodash';

const EdcRequestCancelForm: React.FC<EdcRequestCancelFormProps> = (props) => {
  const [refusalReasonOptions, setRefusalReason] = React.useState([]);
  const {
    formState: state,
    formErrors: errors,
    page,
    path,
  } = props;

  React.useEffect(
    () => {
      if (props.isPermittedToUpdate) {
        props.actionLoadRefusalReason(
          { page, path },
        ).then((refusalReason) => {
          setRefusalReason(refusalReason.map(defaultSelectListMapper));
        });
      }
    },
    [],
  );

  const handleChange = React.useCallback(
    (value, option) => {
      props.handleChange({
        cancel_reason_id: value,
        cancel_reason_name: get(option, 'label', ''),
      });
    },
    [],
  );

  const title = `Отмена заявки №${props.edcReques.request_number} от ${makeDate(props.edcReques.create_date)}`;

  return (
    <EtsBootstrap.ModalContainer
      id="modal-edc_request_cancel-mission"
      show
      onHide={props.hideWithoutChanges}
    >
      <EtsBootstrap.ModalHeader closeButton>
        <EtsBootstrap.ModalTitle>{title}</EtsBootstrap.ModalTitle>
      </EtsBootstrap.ModalHeader>
      <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={12}>
            <ExtField
              id="cancel_reason_id"
              type="select"
              label="Причина"
              value={state.cancel_reason_id}
              onChange={handleChange}
              options={refusalReasonOptions}
              error={errors.cancel_reason_id}
              clearable={false}
              disabled={!props.isPermittedToUpdate}
            />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
      </ModalBodyPreloader>
      <EtsBootstrap.ModalFooter>
        <EtsBootstrap.Button
          disabled={!props.canSave}
          onClick={props.defaultSubmit}
        >
          Сохранить
        </EtsBootstrap.Button>
        <EtsBootstrap.Button onClick={props.hideWithoutChanges} >
          Отмена
        </EtsBootstrap.Button>
      </EtsBootstrap.ModalFooter>
    </EtsBootstrap.ModalContainer>
  );
};

export default compose<EdcRequestCancelFormProps, EdcRequestCancelFormOwnProps>(
  connect<EdcRequestCancelFormStateProps, EdcRequestCancelFormDispatchProps, EdcRequestCancelFormOwnProps, ReduxState>(
    null,
    (dispatch: any) => ({
      actionLoadRefusalReason: (...arg) => (
        dispatch(
          edcRequestActions.actionLoadRefusalReason(...arg),
        )
      ),
    }),
  ),
  withForm<EdcRequestCancelFormPropsWithForm, EdcRequestCancel>({
    uniqField: 'id',
    updateAction: edcRequestActions.actionCancelEdcRequest,
    mergeElement: ({ element }) => {
      return getDefaultDutyMissionElement({
        ...element,
      });
    },
    schema: edcRequestCancelSchema,
    permissions: edcRequestPermissions,
  }),
)(EdcRequestCancelForm);
