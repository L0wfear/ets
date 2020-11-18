import * as React from 'react';
import { compose } from 'recompose';
import { connect, DispatchProp } from 'react-redux';

import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';

import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import ExtField from 'components/@next/@ui/renderFields/Field';
import { WaybillsReportForm, PropsWaybillIntervalPrintWithForm, PropsWaybillIntervalPrint, OwnWaybillIntervalPrintProps, StatePropsWaybillIntervalPrint } from './@types';
import { getDefaultWaybillsReportFormElement } from './utils';
import waybillPermissions from 'components/new/pages/waybill/_config-data/permissions';
import { waybillsReportFormSchema } from './schema';
import { getRegistryState } from 'redux-main/reducers/selectors';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { ReduxState } from 'redux-main/@types/state';
import { saveData } from 'utils/functions';
import DatePickerRange from 'components/new/ui/date_picker/DatePickerRange';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { actionGetBlobWaybillReport } from 'redux-main/reducers/modules/waybill/waybill_actions';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getSessionState } from 'redux-main/reducers/selectors';
import { diffDates, createValidDateTime, getToday9am, getTomorrow9am } from 'components/@next/@utils/dates/dates';

const WaybillIntervalPrintForm: React.FC<PropsWaybillIntervalPrint> = React.memo(
  (props) => {
    const {
      formState: state,
      formErrors: errors,
      page, path,
    } = props;

    const [datesData, setDatesData] = React.useState({
      date_start: state.date_start || createValidDateTime(getToday9am()),
      date_end: state.date_end || createValidDateTime(getTomorrow9am()),
      error_date_start: '',
      error_date_end: '',
    });
    const companies = etsUseSelector((state) => getSessionState(state).userData.companies);

    const title = 'Печать отчета по выработке ТС';

    const handleSubmit = React.useCallback(
      async () => {
        const { date_start, date_end } = datesData;

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
          date_start: createValidDateTime(date_start),
          date_end: createValidDateTime(date_end),
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
      [props.filter, state, datesData],
    );

    const handleChange = React.useCallback(
      (field, value) => {
        setDatesData(
          (oldState) => {
            const newState = {
              ...oldState,
              [field]: value,
            };

            const diffMonths = diffDates(newState.date_end, newState.date_start, 'months', true);

            newState.error_date_start = (
              (!newState.date_start ? 'Дата должна быть заполнена' : '')
              || (((companies.length > 1) && diffMonths >= 3) ? 'Период формирования выгрузки не должен превышать 3 месяца' : '')
              || (diffMonths >= 12 ? 'Период формирования выгрузки не должен превышать 1 год' : '')
            );

            newState.error_date_end = (
              (diffDates(newState.date_start, newState.date_end) >= 0 ? '"Дата по" должна быть позже "Даты с"' : '')
              || (!newState.date_end ? 'Дата должна быть заполнена' : '')
              || (((companies.length > 1) && diffMonths >= 3 || diffMonths >= 12) ? ' ' : '')
            );

            return newState;
          },
        );
      },
      [datesData],
    );

    return (
      <EtsBootstrap.ModalContainer id="modal-waybill_report" show onHide={props.hideWithoutChanges}>
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>{ title }</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
              <DatePickerRange
                allWidth={false}
                label="Период формирования"
                date_start_id="date_start"
                date_start_value={datesData.date_start}
                date_start_error={datesData.error_date_start}
                date_end_id="date_end"
                date_end_value={datesData.date_end}
                date_end_error={datesData.error_date_end}

                onChange={handleChange}
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={12}>
              <ExtField
                type="boolean"
                label="С применением фильтрации"
                value={state.withFilter}
                error={errors.withFilter}
                onChange={props.handleChangeBoolean}
                className="checkbox-input flex-reverse"
                boundKeys="withFilter"
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
        </ModalBodyPreloader>
        <EtsBootstrap.ModalFooter>
          <EtsBootstrap.Button disabled={!props.canSave || Boolean(datesData.error_date_start || datesData.error_date_end)} onClick={handleSubmit}>Ок</EtsBootstrap.Button>
          <EtsBootstrap.Button onClick={props.hideWithoutChanges}>Отменить</EtsBootstrap.Button>
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
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
    createAction: actionGetBlobWaybillReport,
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
