import * as React from 'react';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';

import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import ExtField from 'components/@next/@ui/renderFields/Field';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type DutyMissionFailFormProps = {
  element: DutyMission;
  handleHide: () => any;
  handleSubmit: (dutyMission: DutyMission) => any;

  page: string;
};

const DutyMissionFailForm: React.FC<DutyMissionFailFormProps> = React.memo(
  (props) => {
    const [comment, setComment] = React.useState('');
    const {
      element,
    } = props;

    React.useEffect(
      () => {
        setComment('');
      },
      [props.element],
    );

    const handleChangeComment = React.useCallback(
      (value) => {
        setComment(value);
      },
      [],
    );

    const handleSubmit = React.useCallback(
      () => {
        props.handleSubmit({
          ...element,
          comment,
        });
      },
      [element, comment, props.handleSubmit],
    );

    return (
      <EtsBootstrap.ModalContainer
        id="modal-duty-mission-reject"
        onHide={props.handleHide}
        show
      >
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>{`Введите причину для наряд-задания №${element.number}`}</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBodyPreloader page={props.page} typePreloader="mainpage">
          <ExtField
            id="duty_mission_cancel_comment"
            type="string"
            label="Причина"
            value={comment}
            onChange={handleChangeComment}
          />
        </ModalBodyPreloader>
        <EtsBootstrap.ModalFooter>
          <EtsBootstrap.Button id="duty_mission_cancel_submit" disabled={!comment} onClick={handleSubmit}>
            Отметка о невыполнении
          </EtsBootstrap.Button>
          <EtsBootstrap.Button onClick={props.handleHide}>Отмена</EtsBootstrap.Button>
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  },
);

export default DutyMissionFailForm;
