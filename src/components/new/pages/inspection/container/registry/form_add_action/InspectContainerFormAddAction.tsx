import * as React from 'react';
import { InspectContainer } from 'redux-main/reducers/modules/inspect/container/@types/container';

import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import ExtField from 'components/@next/@ui/renderFields/Field';
import { diffDates, createValidDate } from 'components/@next/@utils/dates/dates';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { getRequiredFieldNoTrim } from 'components/@next/@utils/getErrorString/getErrorString';
import { isString } from 'util';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { actionLoadTimeMoscow } from 'redux-main/reducers/modules/some_uniq/time_moscow/actions';

type InspectContainerFormAddActionProps = {
  addAction: (obj: ValuesOf<InspectContainer['actions']>) => void;
  hideWithoutChanges: () => void;
};

const InspectContainerFormAddAction: React.FC<InspectContainerFormAddActionProps> = (props) => {
  const [name, setName] = React.useState('');
  const [date_start, setDateStart] = React.useState(null);
  const [date_end, setDateEnd] = React.useState(null);
  const [current_date, setCurrentDate] = React.useState(null);
  const dispatch = etsUseDispatch();
  
  React.useEffect(() => {
    (async () => {
      const current_date = await dispatch(
        actionLoadTimeMoscow({}, { page: '' })
      );
      setCurrentDate(createValidDate(current_date.date));
    })();
  }, []);

  const errors = {
    name: (
      !name
        ? 'Поле "Наименование работ" должно быть заполнено'
        : (
          name && isString(name) && name.length !== name.trim().length
            ? getRequiredFieldNoTrim('Наименование работ')
            : ''
        )
    ),
    date_start: (
      !date_start
        ? 'Поле "Дата начала" должно быть заполнено'
        : diffDates(createValidDate(date_start), current_date) > 0
          ? 'Дата начала не может быть больше текущей'
          : ''
    ),
    date_end: (
      !date_end
        ? 'Поле "Дата окончания" должно быть заполнено'
        : (
          diffDates(date_end, date_start) <= 0
            ? '"Дата окончания" должна быть позже "Даты начала"'
            : diffDates(createValidDate(date_end), current_date) > 0
              ? 'Дата окончания не может быть больше текущей'
              : ''
        )
    ),
  };

  const setNameFromEvent = React.useCallback(
    (value) => {
      setName(value);
    },
    [],
  );

  const handleSubmit = React.useCallback(
    () => {
      if (name && date_start && date_end) {
        props.addAction({
          name,
          date_start: createValidDate(date_start),
          date_end: createValidDate(date_end),
        });
      }
    },
    [name, date_start, date_end],
  );

  return (
    <EtsBootstrap.ModalContainer
      id="modal-mission"
      show
      onHide={props.hideWithoutChanges}
    >
      <EtsBootstrap.ModalHeader closeButton>
        <EtsBootstrap.ModalTitle>Добавление записи</EtsBootstrap.ModalTitle>
      </EtsBootstrap.ModalHeader>
      <ModalBodyPreloader>
        <ExtField
          id="name"
          type="string"
          label="Наименование работ"
          value={name}
          onChange={setNameFromEvent}
          error={errors.name}
          modalKey="container_add_action"
        />
        <ExtField
          id="date_start"
          type="date"
          time={false}
          label="Дата начала"
          makeGoodFormat
          value={date_start}
          onChange={setDateStart}
          error={errors.date_start}
          modalKey="container_add_action"
        />
        <ExtField
          id="date_end"
          type="date"
          time={false}
          label="Дата окончания"
          makeGoodFormat
          value={date_end}
          onChange={setDateEnd}
          error={errors.date_end}
          modalKey="container_add_action"
        />
      </ModalBodyPreloader>
      <EtsBootstrap.ModalFooter>
        <EtsBootstrap.Button
          id="container_add_action_submit"
          disabled={Object.values(errors).some((error) => Boolean(error))}
          onClick={handleSubmit}
        >
          Добавить
        </EtsBootstrap.Button>
        <EtsBootstrap.Button onClick={props.hideWithoutChanges}>Отмена</EtsBootstrap.Button>
      </EtsBootstrap.ModalFooter>
    </EtsBootstrap.ModalContainer>
  );
};

export default InspectContainerFormAddAction;
