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
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';
import * as Button from 'react-bootstrap/lib/Button';
import EtsModal from 'components/new/ui/modal/Modal';
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
    <EtsModal
      id="modal-edc_request_reject-mission"
      show
      onHide={props.hideWithoutChanges}
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
        <Row>
          <Col md={12}>
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
          </Col>
        </Row>
      </ModalBodyPreloader>
      <Modal.Footer>
        <div>
          <Button
            disabled={!props.canSave}
            onClick={props.defaultSubmit}
          >
            Сохранить
          </Button>
          <Button onClick={props.hideWithoutChanges} >
            Отмена
          </Button>
        </div>
      </Modal.Footer>
    </EtsModal>
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
