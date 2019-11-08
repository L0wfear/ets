import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';

import { getToday9am, diffDates, getTomorrow9am, addTime, createValidDateTime } from 'components/@next/@utils/dates/dates';
import DatePickerRange from '../../date_picker/DatePickerRange';
import { EtsButtonsContainer } from 'components/new/ui/registry/components/data/header/buttons/styled/styled';

type Props = {
  initial_date_from?: string;
  initial_date_to?: string;
  onHide: (...arg: Array<any>) => any;
  onExport: (payload: any) => any;
  title: string;
  helpText?: string;

  time?: boolean;
};

const PrintByDates: React.FC<Props> = React.memo(
  (props) => {
    const [datesData, setDatesData] = React.useState({
      date_from: props.initial_date_from || createValidDateTime(getToday9am()),
      date_to: props.initial_date_to || createValidDateTime(getTomorrow9am()),
      error_date_from: '',
      error_date_to: '',
    });

    const handleSubmit = React.useCallback(
      () => {
        const { date_from, date_to } = datesData;

        const diffMonths = diffDates(date_to, date_from, 'months', true);

        if (diffMonths >= 12) {
          global.NOTIFICATION_SYSTEM.notify('Период выгрузки должен быть ограничен 12 месяцами', 'warning');
          return;
        }

        const exportPayload = {
          date_from: createValidDateTime(date_from),
          date_to: createValidDateTime(addTime(date_to, 1, 'days')),
        };

        props.onExport(exportPayload);
      },
      [datesData, props.onExport],
    );

    const handleChange = React.useCallback(
      (field, value) => {
        setDatesData(
          (oldState) => {
            const newState = {
              ...oldState,
              [field]: value,
            };

            newState.error_date_to = (
              (
                diffDates(newState.date_from, newState.date_to) > 0
                  ? '"Дата по" должна быть позже "Даты с"'
                  : ''
              )
              || (
                !newState.date_to
                  ? 'Дата должна быть заполнена'
                  : ''
              )
            );

            newState.error_date_from = (
              !newState.date_from
                ? 'Дата должна быть заполнена'
                : ''
            );

            return newState;
          },
        );
      },
      [datesData],
    );

    return (
      <EtsBootstrap.ModalContainer id="modal-print-from" show onHide={props.onHide} >

        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>{props.title}</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>

        <EtsBootstrap.ModalBody>
          <DatePickerRange
            label="Выберите период:"
            date_start_id="date_from"
            date_start_value={datesData.date_from}
            date_start_error={datesData.error_date_from}
            date_end_id="date_to"
            date_end_value={datesData.date_to}
            date_end_error={datesData.error_date_to}
            date_start_time={Boolean(props.time)}
            date_end_time={Boolean(props.time)}

            onChange={handleChange}
          />
          <span>{props.helpText}</span>
        </EtsBootstrap.ModalBody>
        <EtsBootstrap.ModalFooter>
          <EtsButtonsContainer>
            <EtsBootstrap.Button onClick={handleSubmit} disabled={Boolean(datesData.error_date_from || datesData.error_date_to)}>ОК</EtsBootstrap.Button>
            <EtsBootstrap.Button onClick={props.onHide}>Отмена</EtsBootstrap.Button>
          </EtsButtonsContainer>
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  },
);

export default PrintByDates;
