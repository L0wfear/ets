import React from 'react';
import { cloneDeep } from 'lodash';
import { Modal, Row, Col, Button } from 'react-bootstrap';
import { FluxContext } from 'utils/decorators';

import ModalBody from 'components/ui/Modal';
import Field from 'components/ui/Field.jsx';

@FluxContext
export class DutyMissionForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      indexCurrMission: props.rejectedDutyMission.length - 1,
      comment: '',
      allQuery: [],
      needUpdate: false,
    };
  }

  handleChangeRComment = ({ target: { value: comment } }) => this.setState({ comment });
  handleClick = () => {
    const { rejectedDutyMission } = this.props;
    const { indexCurrMission, comment, needUpdate } = this.state;
    const allQuery = [...this.state.allQuery];

    const updatedMission = {
      ...cloneDeep(rejectedDutyMission[indexCurrMission]),
      status: 'fail',
      comment,
    };

    const query = this.context.flux.getActions('missions').updateDutyMission(updatedMission);
    allQuery.push(query);

    if (indexCurrMission === 0) {
      this.props.onRejectAll(allQuery, needUpdate);
    } else {
      this.setState({
        allQuery,
        comment: '',
        indexCurrMission: indexCurrMission - 1,
        needUpdate: true,
      });
    }
  }
  handlClickNext = () => {
    const { indexCurrMission, needUpdate } = this.state;

    const allQuery = [...this.state.allQuery];
    allQuery.push(Promise.resolve());

    if (indexCurrMission === 0) {
      this.props.onRejectAll(allQuery, needUpdate);
    } else {
      this.setState({
        allQuery,
        comment: '',
        indexCurrMission: indexCurrMission - 1,
      });
    }
  }

  render() {
    const { comment, indexCurrMission } = this.state;

    return (
      <Modal onHide={this.handlClickNext} show backdrop="static">

        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{`Введите причину для наряд-задания №${this.props.rejectedDutyMission[indexCurrMission].number}`}</Modal.Title>
        </Modal.Header>
        <ModalBody>
          <Row>
            <Col md={12}>
              <Field
                type="string"
                lable="Причина"
                value={comment}
                onChange={this.handleChangeRComment}
              />
            </Col>
          </Row>
        </ModalBody>
        <Modal.Footer>
          <Button disabled={!comment} onClick={this.handleClick} >Отметка о невыполнении</Button>
          <Button onClick={this.handlClickNext} >Отмена</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default DutyMissionForm;
