import React from 'react';
import { cloneDeep } from 'lodash';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Button from 'react-bootstrap/lib/Button';
import * as Col from 'react-bootstrap/lib/Col';
import * as Row from 'react-bootstrap/lib/Row';

import { ExtField } from 'components/ui/new/field/ExtField';
import missionsActions from 'redux-main/reducers/modules/missions/actions';
import { compose } from 'recompose';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { connect } from 'react-redux';

const pagePath = 'reject';

class DutyMissionForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      indexCurrMission: props.rejectedDutyMission.length - 1,
      comment: '',
      allQuery: [],
      needUpdate: false,
    };
  }

  handleChangeRComment = ({ target: { value: comment } }) =>
    this.setState({ comment });

  handleClick = () => {
    const { rejectedDutyMission } = this.props;
    const { indexCurrMission, comment } = this.state;
    const allQuery = [...this.state.allQuery];

    const updatedMission = {
      ...cloneDeep(rejectedDutyMission[indexCurrMission]),
      status: 'fail',
      comment,
    };

    const query = this.props.actionUpdateDutyMission(updatedMission, {
      page: this.props.page,
      path: pagePath,
    });
    allQuery.push(query);

    if (indexCurrMission === 0) {
      this.props.onRejectAll(allQuery, true);
    } else {
      this.setState({
        allQuery,
        comment: '',
        indexCurrMission: indexCurrMission - 1,
        needUpdate: true,
      });
    }
  };

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
  };

  render() {
    const { comment, indexCurrMission } = this.state;

    return (
      <Modal
        id="modal-duty-mission-reject"
        onHide={this.handlClickNext}
        show
        backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{`Введите причину для наряд-задания №${
            this.props.rejectedDutyMission[indexCurrMission].number
          }`}</Modal.Title>
        </Modal.Header>
        <ModalBodyPreloader
          page={this.props.page}
          path={pagePath}
          typePreloader="mainpage">
          <Row>
            <Col md={12}>
              <ExtField
                type="string"
                label="Причина"
                value={comment}
                onChange={this.handleChangeRComment}
              />
            </Col>
          </Row>
        </ModalBodyPreloader>
        <Modal.Footer>
          <Button disabled={!comment} onClick={this.handleClick}>
            Отметка о невыполнении
          </Button>
          <Button onClick={this.handlClickNext}>Отмена</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default compose(
  connect(
    null,
    (dispatch) => ({
      actionUpdateDutyMission: (...arg) =>
        dispatch(missionsActions.actionUpdateDutyMission(...arg)),
    }),
  ),
)(DutyMissionForm);
