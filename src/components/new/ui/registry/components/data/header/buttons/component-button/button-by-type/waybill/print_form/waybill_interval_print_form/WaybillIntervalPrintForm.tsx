import * as React from 'react';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { Modal, Row, Col, Button } from 'react-bootstrap';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ExtField } from 'components/ui/new/field/ExtField';
import waybillActions from 'redux-main/reducers/modules/waybill/waybill_actions';
import { WaybillsReportForm, PropsWaybillIntervalPrintWithForm, PropsWaybillIntervalPrint, OwnWaybillIntervalPrintProps, StatePropsWaybillIntervalPrint } from './@types';
import { getDefaultWaybillsReportFormElement } from './utils';
import waybillPermissions from 'components/new/pages/waybill/_config-data/permissions';
import { waybillsReportFormSchema } from './schema';
import { compose } from 'recompose';
import { getRegistryState } from 'redux-main/reducers/selectors';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { connect, DispatchProp } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { saveData } from 'utils/functions';
import DatePickerRange from 'components/new/ui/date_picker/DatePickerRange';

const WaybillIntervalPrintForm: React.FC<PropsWaybillIntervalPrint> = React.memo(
  (props) => {
    const {
      formState: state,
      formErrors: errors,
      page, path,
    } = props;

    const title = 'Печать отчета по выработке ТС';

    const handleSubmit = React.useCallback(
      async () => {
        global.NOTIFICATION_SYSTEM.notifyWithObject({
          title: 'Загрузка печатной формы',
          level: 'info',
          position: 'tr',
          dismissible: false,
          autoDismiss: 0,
          uid: 'waybilPrintForm',
          message: 'Формирование печатной формы',
        });

        const payload: Partial<WaybillsReportForm> = {
          date_start: state.date_start,
          date_end: state.date_end,
        };

        const result = await props.submitAction(
          payload,
          state.withFilter ? props.filter : null,
          {
            page, path,
          },
        );

        if (result.blob) {
          saveData(result.blob, result.fileName);
          props.handleHide(false);
        }
        global.NOTIFICATION_SYSTEM.removeNotification('waybilPrintForm');
      },
      [props.filter, state],
    );

    return (
      <Modal id="modal-waybill_report" show onHide={props.hideWithoutChanges} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{ title }</Modal.Title>
        </Modal.Header>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <Row>
            <Col md={12}>
              <DatePickerRange
                allWidth={false}
                label="Период формирования"
                date_start_id="date_start"
                date_start_value={state.date_start}
                date_start_error={errors.date_start}
                date_end_id="date_end"
                date_end_value={state.date_end}
                date_end_error={errors.date_end}

                onChange={props.handleChange}
              />
            </Col>
            <Col md={12}>
              <ExtField
                type="boolean"
                label="С применением фильтрации"
                value={state.withFilter}
                error={errors.withFilter}
                onChange={props.handleChangeBoolean}
                className="checkbox-input flex-reverse"
                boundKeys="withFilter"
              />
            </Col>
          </Row>
        </ModalBodyPreloader>
        <Modal.Footer>
          <div>
            <Button disabled={!props.canSave} onClick={handleSubmit}>Ок</Button>
            <Button onClick={props.hideWithoutChanges}>Отменить</Button>
          </div>
        </Modal.Footer>
      </Modal>
    );
  },
);

export default compose<PropsWaybillIntervalPrint, OwnWaybillIntervalPrintProps>(
  connect<StatePropsWaybillIntervalPrint, DispatchProp, OwnWaybillIntervalPrintProps, ReduxState>(
    (state, { registryKey }) => ({
      filter: getListData(getRegistryState(state), registryKey).processed.filterValues,
    }),
  ),
  withForm<PropsWaybillIntervalPrintWithForm, WaybillsReportForm>({
    uniqField: false,
    createAction: waybillActions.actionGetBlobWaybillReport,
    mergeElement: (props) => {
      return getDefaultWaybillsReportFormElement(props.element);
    },
    noMessage: true,
    schema: waybillsReportFormSchema,
    permissions: {
      create: waybillPermissions.list,
      update: waybillPermissions.list,
    },
  }),
)(WaybillIntervalPrintForm);
