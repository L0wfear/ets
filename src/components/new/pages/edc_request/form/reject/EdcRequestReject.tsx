import * as React from 'react';

import {
  EdcRequestRejectFormProps,
  EdcRequestRejectFormStateProps,
  EdcRequestRejectFormDispatchProps,
  EdcRequestRejectFormOwnProps,
  EdcRequestRejectFormPropsWithForm,
  EdcRequestReject,
} from './@types/EdcRequestReject';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { ReduxState } from 'redux-main/@types/state';
import {
  getDefaultDutyMissionElement,
} from './utils';
import { edcRequestRejectSchema } from './schema';

import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import edcRequestPermissions from '../../_config-data/permissions';
import { makeDate } from 'utils/dates';
import { ExtField } from 'components/ui/new/field/ExtField';
import edcRequestActions from 'redux-main/reducers/modules/edc_request/edc_request_actions';
import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
import { get } from 'lodash';

const EdcRequestRejectForm: React.FC<EdcRequestRejectFormProps> = (props) => {
  const [rejectionReasonOptions, setRejectionReasonOptions] = React.useState([]);
  const {
    formState: state,
    formErrors: errors,
    page,
    path,
  } = props;

  React.useEffect(
    () => {
      if (props.isPermittedToUpdate) {
        props.actionLoadRejectionReason(
          { page, path },
        ).then((refusalReason) => {
          setRejectionReasonOptions(refusalReason.map(defaultSelectListMapper));
        });
      }
    },
    [],
  );

  const handleChange = React.useCallback(
    (value, option) => {
      props.handleChange({
        rejection_reason_id: value,
        rejection_reason_name: get(option, 'label', ''),
      });
    },
    [],
  );

  const title = `Отклонение заявки №${props.edcReques.request_number} от ${makeDate(props.edcReques.create_date)}`;

  return (
    <EtsBootstrap.ModalContainer
      id="modal-edc_request_reject-mission"
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
              id="rejection_reason_id"
              type="select"
              label="Причина"
              value={state.rejection_reason_id}
              onChange={handleChange}
              options={rejectionReasonOptions}
              error={errors.rejection_reason_id}
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

export default compose<EdcRequestRejectFormProps, EdcRequestRejectFormOwnProps>(
  connect<EdcRequestRejectFormStateProps, EdcRequestRejectFormDispatchProps, EdcRequestRejectFormOwnProps, ReduxState>(
    null,
    (dispatch: any) => ({
      actionLoadRejectionReason: (...arg) => (
        dispatch(
          edcRequestActions.actionLoadRejectionReason(...arg),
        )
      ),
    }),
  ),
  withForm<EdcRequestRejectFormPropsWithForm, EdcRequestReject>({
    uniqField: 'id',
    updateAction: edcRequestActions.actionRejectEdcRequest,
    mergeElement: ({ element }) => {
      return getDefaultDutyMissionElement({
        ...element,
      });
    },
    schema: edcRequestRejectSchema,
    permissions: edcRequestPermissions,
  }),
)(EdcRequestRejectForm);
