import * as React from 'react';
import { compose } from 'recompose';

import {
  EdcRequestCancelFormProps,
  EdcRequestCancelFormPropsWithForm,
  EdcRequestCancel,
} from './@types/EdcRequestCancel';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import {
  getDefaultDutyMissionElement,
} from './utils';
import { edcRequestCancelSchema } from './schema';

import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import edcRequestPermissions from '../../_config-data/permissions';
import { makeDate } from 'components/@next/@utils/dates/dates';
import ExtField from 'components/@next/@ui/renderFields/Field';
import edcRequestActions from 'redux-main/reducers/modules/edc_request/edc_request_actions';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

const EdcRequestCancelForm: React.FC<EdcRequestCancelFormProps> = React.memo(
  (props) => {
    const [cancelReasonOptions, setCancelReason] = React.useState([]);
    const {
      formState: state,
      formErrors: errors,
      page,
      path,
    } = props;

    const dispatch = etsUseDispatch();

    React.useEffect(
      () => {
        if (props.isPermittedToUpdate) {
          const loadData = async () => {
            const cancelReason = await dispatch(
              edcRequestActions.actionLoadCancelReason(
                { page, path },
              ),
            );

            setCancelReason(cancelReason.map((rowData) => ({
              value: rowData.edc_id,
              label: rowData.name,
              rowData,
            })));
          };

          loadData();
        }
      },
      [state.id],
    );

    const handleChange = React.useCallback(
      (value, option) => {
        props.handleChange({
          cancel_reason_id: value,
          cancel_reason_name: option?.label,
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
                options={cancelReasonOptions}
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
  },
);

export default compose<EdcRequestCancelFormProps, EdcRequestCancelFormPropsWithForm>(
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
