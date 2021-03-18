import * as React from 'react';
import { compose } from 'recompose';
import { connect, DispatchProp } from 'react-redux';

import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';

import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';

import { RefillReportForm, PropsRefillIntervalPrintWithForm, PropsRefillIntervalPrint, OwnRefillIntervalPrintProps, StatePropsRefillIntervalPrint } from './@types';
import { getDefaultRefillReportFormElement } from './utils';
import refillPermissions from 'components/new/pages/nsi/autobase/pages/refill_registry/_config-data/permissions';
import { refillReportFormSchema } from './schema';
import { getRegistryState } from 'redux-main/reducers/selectors';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { ReduxState } from 'redux-main/@types/state';
import { saveData } from 'utils/functions';
import DatePickerRange from 'components/new/ui/date_picker/DatePickerRange';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { diffDates, createValidDateTime, setDateTime2359, setDateTime0am } from 'components/@next/@utils/dates/dates';
import { actionGetBlobRefill } from 'redux-main/reducers/modules/autobase/actions_by_type/refill_registry/actions';
import { actionLoadTimeMoscow } from 'redux-main/reducers/modules/some_uniq/time_moscow/actions';

const RefillIntervalPrintForm: React.FC<PropsRefillIntervalPrint> = React.memo(
  (props) => {
    const {
      formState: state,
      page, path,
    } = props;

    const [datesData, setDatesData] = React.useState({
      date_from: state.date_from,
      date_to: state.date_to,
      error_date_from: '',
      error_date_to: '',
    });
    const dispatch = etsUseDispatch();
    React.useEffect(() => {
      (async () => {
        const current_date = await dispatch(
          actionLoadTimeMoscow({}, { page, path })
        );
        const date_from = createValidDateTime(setDateTime0am(current_date.date));
        const date_to = createValidDateTime(setDateTime2359(current_date.date));
        setDatesData({
          ...datesData,
          date_from,
          date_to,
        });
      })();
    }, []);

    const title = 'Печать реестра заправок';

    const handleSubmit = React.useCallback(
      async () => {
        const { date_from, date_to } = datesData;

        global.NOTIFICATION_SYSTEM.notifyWithObject({
          title: 'Загрузка печатной формы',
          level: 'info',
          position: 'tr',
          dismissible: false,
          autoDismiss: 0,
          uid: 'refillPrintForm',
          message: 'Формирование печатной формы',
        });

        const payload: Partial<RefillReportForm> = {
          date_from: createValidDateTime(date_from),
          date_to: createValidDateTime(date_to),
          registryKey: props.registryKey,
        };

        const result = await props.submitAction(
          payload,
          props.filter,
          {
            page, path,
          },
        );

        if (result.blob) {
          saveData(result.blob, result.fileName);
          props.handleHide(false);
        }
        global.NOTIFICATION_SYSTEM.removeNotification('refillPrintForm');
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

            newState.error_date_from = (
              (!newState.date_from ? 'Дата должна быть заполнена' : '')
            );

            newState.error_date_to = (
              (diffDates(newState.date_from, newState.date_to) >= 0 ? '"Дата по" должна быть позже "Даты с"' : '')
              || (!newState.date_to ? 'Дата должна быть заполнена' : '')
            );

            return newState;
          },
        );
      },
      [datesData],
    );

    return (
      <EtsBootstrap.ModalContainer id="modal-refill_report" show onHide={props.hideWithoutChanges}>
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>{ title }</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
              <DatePickerRange
                allWidth={false}
                label="Период формирования"
                date_start_id="date_from"
                date_start_value={datesData.date_from}
                date_start_error={datesData.error_date_from}
                date_end_id="date_to"
                date_end_value={datesData.date_to}
                date_end_error={datesData.error_date_to}

                onChange={handleChange}
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
        </ModalBodyPreloader>
        <EtsBootstrap.ModalFooter>
          <EtsBootstrap.Button disabled={!props.isPermitted || Boolean(datesData.error_date_from || datesData.error_date_to)} onClick={handleSubmit}>Выгрузить</EtsBootstrap.Button>
          <EtsBootstrap.Button onClick={props.hideWithoutChanges}>Отменить</EtsBootstrap.Button>
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  },
);

export default compose<PropsRefillIntervalPrint, OwnRefillIntervalPrintProps>(
  connect<StatePropsRefillIntervalPrint, DispatchProp, OwnRefillIntervalPrintProps, ReduxState>(
    (state, { registryKey }) => ({
      filter: getListData(getRegistryState(state), registryKey).processed.filterValues,
    }),
  ),
  withForm<PropsRefillIntervalPrintWithForm, RefillReportForm>({
    uniqField: false,
    createAction: actionGetBlobRefill,
    mergeElement: (props) => {
      return getDefaultRefillReportFormElement(props.element);
    },
    noMessage: true,
    schema: refillReportFormSchema,
    permissions: {
      create: refillPermissions.list,
      update: refillPermissions.list,
    },
  }),
)(RefillIntervalPrintForm);
