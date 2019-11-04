import * as React from 'react';

import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';

import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import ExtField from 'components/@next/@ui/renderFields/Field';

import { WaybillPrintJournalForm, PropsWaybillByDatePrintWithForm, PropsWaybillByDatePrint } from './@types';
import { getDefaultWaybillPrintJournalFormElement, defaultWaybillPrintJournalFormFunc, YEARS_FORM_2016, FORMATION_PERIOD_OPTIONS, sortingMonthFunction } from './utils';
import waybillPermissions from 'components/new/pages/waybill/_config-data/permissions';
import { waybillPrintJournalFormSchema } from './schema';
import { monthOptions } from 'components/@next/@utils/dates/dates';
import { getRegistryState } from 'redux-main/reducers/selectors';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { saveData } from 'utils/functions';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { actionGetBlobWaybillJournalReport } from 'redux-main/reducers/modules/waybill/waybill_actions';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';

const WaybillByDatePrintForm: React.FC<PropsWaybillByDatePrint> = React.memo(
  (props) => {
    const {
      formState: state,
      formErrors: errors,
      page, path,
    } = props;

    const filterValues = etsUseSelector((stateRedux) => getListData(getRegistryState(stateRedux), props.registryKey).processed.filterValues);

    const title = 'Печать Журнала путевых листов (ТМФ №8)';

    const handleChangeFormationPeriod = React.useCallback(
      (formationPeriod: WaybillPrintJournalForm['formationPeriod']) => {
        const defaultWaybillPrintJournalForm = defaultWaybillPrintJournalFormFunc();
        const changeObj: Partial<WaybillPrintJournalForm> = {
          formationPeriod,
        };

        if (formationPeriod === 'day') {
          changeObj.month = null;
          changeObj.year = null;
          changeObj.date = defaultWaybillPrintJournalForm.date;
        }
        if (formationPeriod === 'month') {
          changeObj.month = defaultWaybillPrintJournalForm.month;
          changeObj.year = defaultWaybillPrintJournalForm.year;
          changeObj.date = null;
        }
        props.handleChange(
          changeObj,
        );
      },
      [props.handleChange],
    );

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

        const payload: Partial<WaybillPrintJournalForm> = {};

        if (state.formationPeriod === 'day') {
          payload.date = state.date;
        }
        if (state.formationPeriod === 'month') {
          payload.month = state.month;
          payload.year = state.year;
        }

        const result = await props.submitAction(
          payload,
          filterValues,
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
      [filterValues, state],
    );

    return (
      <EtsBootstrap.ModalContainer id="modal-waybill_journal_report" show onHide={props.hideWithoutChanges}>
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>{ title }</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
              <ExtField
                type="select"
                label="Период формирования"
                options={FORMATION_PERIOD_OPTIONS}
                value={state.formationPeriod}
                error={errors.formationPeriod}
                clearable={false}
                onChange={handleChangeFormationPeriod}
              />
              {
                state.formationPeriod === 'month'
                  && (
                    <React.Fragment>
                      <ExtField
                        type="select"
                        label="Месяц"
                        options={monthOptions}
                        value={state.month}
                        sortingFunction={sortingMonthFunction}
                        error={errors.month}
                        clearable={false}
                        onChange={props.handleChange}
                        boundKeys="month"
                      />
                      <ExtField
                        type="select"
                        label="Год"
                        options={YEARS_FORM_2016}
                        value={state.year}
                        error={errors.year}
                        clearable={false}
                        onChange={props.handleChange}
                        boundKeys="year"
                      />
                    </React.Fragment>
                  )
              }
              {
                state.formationPeriod === 'day'
                && (
                  <ExtField
                    type="date"
                    time={false}
                    label="Дата"
                    value={state.date}
                    error={errors.date}
                    onChange={props.handleChange}
                    boundKeys="date"
                  />
                )
              }
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
        </ModalBodyPreloader>
        <EtsBootstrap.ModalFooter>
          <EtsBootstrap.Button disabled={!props.canSave} onClick={handleSubmit}>Ок</EtsBootstrap.Button>
          <EtsBootstrap.Button onClick={props.hideWithoutChanges}>Отменить</EtsBootstrap.Button>
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  },
);

export default withForm<PropsWaybillByDatePrintWithForm, WaybillPrintJournalForm>({
  uniqField: false,
  createAction: actionGetBlobWaybillJournalReport,
  mergeElement: (props) => {
    return getDefaultWaybillPrintJournalFormElement(props.element);
  },
  noMessage: true,
  schema: waybillPrintJournalFormSchema,
  permissions: {
    create: waybillPermissions.list,
    update: waybillPermissions.list,
  },
})(WaybillByDatePrintForm);
