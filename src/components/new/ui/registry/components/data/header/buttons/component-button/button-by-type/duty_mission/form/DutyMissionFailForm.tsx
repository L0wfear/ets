import * as React from 'react';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';
import EtsModal from 'components/new/ui/modal/Modal';
import { Modal, Button } from 'react-bootstrap';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ExtField } from 'components/ui/new/field/ExtField';

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

    const handleChangeComment = React.useCallback(
      (event) => {
        setComment(event.target.value);
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
      [element, comment],
    );

    return (
      <EtsModal
        id="modal-duty-mission-reject"
        onHide={props.handleHide}
        show
        backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{`Введите причину для наряд-задания №${element.number}`}</Modal.Title>
        </Modal.Header>
        <ModalBodyPreloader page={props.page} typePreloader="mainpage">
          <ExtField
            type="string"
            label="Причина"
            value={comment}
            onChange={handleChangeComment}
          />
        </ModalBodyPreloader>
        <Modal.Footer>
          <div>
            <Button disabled={!comment} onClick={handleSubmit}>
              Отметка о невыполнении
            </Button>
            <Button onClick={props.handleHide}>Отмена</Button>
          </div>
        </Modal.Footer>
      </EtsModal>
    );
  },
);

export default DutyMissionFailForm;
