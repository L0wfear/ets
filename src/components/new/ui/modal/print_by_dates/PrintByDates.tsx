import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';

import { getToday9am, diffDates, getTomorrow9am, addTime, createValidDateTime } from 'utils/dates';
import DatePickerRange from '../../date_picker/DatePickerRange';

export type IPropsPrintByDates = {
  onHide: (...arg: any[]) => any;
  onExport: (payload: any) => any;
  title: string;
};

const PrintByDates: React.FC<IPropsPrintByDates> = React.memo(
  (props) => {
    const [datesData, setDatesData] = React.useState({
      date_from: createValidDateTime(getToday9am()),
      date_to: createValidDateTime(getTomorrow9am()),
      error: '',
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
        const newState = {
          ...datesData,
          [field]: value,
        };

        newState.error = (
          diffDates(newState.date_from, newState.date_to) > 0
            ? 'Дата окончания дололжна быть позже'
            : ''
        );

        setDatesData(newState);
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
            date_start_error={false}
            date_end_id="date_to"
            date_end_value={datesData.date_to}
            date_end_error={datesData.error}
            date_start_time={false}
            date_end_time={false}

            onChange={handleChange}
          />
        </EtsBootstrap.ModalBody>
        <EtsBootstrap.ModalFooter>
          <EtsBootstrap.ButtonGroup>
            <EtsBootstrap.Button onClick={handleSubmit} disabled={Boolean(datesData.error)}>ОК</EtsBootstrap.Button>
            <EtsBootstrap.Button onClick={props.onHide}>Отмена</EtsBootstrap.Button>
          </EtsBootstrap.ButtonGroup>
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  },
);

export default PrintByDates;
