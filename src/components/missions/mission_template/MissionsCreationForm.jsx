import * as React from 'react';
import * as PropTypes from 'prop-types';
import { cloneDeep, get } from 'lodash';
import connectToStores from 'flummox/connect';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Button from 'react-bootstrap/lib/Button';
import * as Col from 'react-bootstrap/lib/Col';
import * as Row from 'react-bootstrap/lib/Row';

import ModalBody from 'components/ui/Modal';
import { ExtField } from 'components/ui/new/field/ExtField';
import Div from 'components/ui/Div';
import ReactSelect from 'components/ui/input/ReactSelect/ReactSelect';

import Form from 'components/compositions/Form';
import { addTime, diffDates } from 'utils/dates';

import ColumnAssignmentMissionTemplate from 'components/missions/mission_template/ColumnAssignmentMissionTemplate';
import { DivNone } from 'global-styled/global-styled';
import { getDefaultMissionsCreationTemplate } from 'stores/MissionsStore';
import { makePayloadFromState } from 'components/missions/mission/MissionForm/utils';
import { connect } from 'react-redux';
import { selectorGetMissionSourceOptionsWithoutOrder } from 'redux-main/reducers/modules/some_uniq/mission_source/selectors';

const ASSIGN_OPTIONS = [
  { value: 'assign_to_active', label: 'Добавить в активный ПЛ' },
  { value: 'assign_to_new_draft', label: 'Создать черновик ПЛ' },
  { value: 'assign_to_available_draft', label: 'Добавить в черновик ПЛ' },
];

class MissionsCreationForm extends Form {
  state = {
    showColumnAssignment: false,
  };

  componentDidMount() {
    this.updateNormIdForAllCarInAllMissions(this.props.formState);
  }

  handleChangeDateStart = (date_start) => {
    const newFormState = {
      ...this.props.formState,
      date_start,
    };

    const {
      formState: { date_end },
      countBumpDateEnd,
    } = this.props;
    this.handleChange('date_start', date_start);
    if (
      this.props.needMoveDateEnd
      && date_start
      && date_end
      && diffDates(date_end, date_start, 'hours') > countBumpDateEnd
    ) {
      const date_end_new = addTime(date_start, countBumpDateEnd, 'hours');
      this.handleChange('date_end', date_end_new);
    }

    this.updateNormIdForAllCarInAllMissions(newFormState);
  };

  async updateNormIdForAllCarInAllMissions(formState) {
    if (formState.date_start) {
      Object.entries(this.props.missions).forEach(([id, missionData]) => {
        missionData.car_ids.forEach(async (car_id) => {
          const normData = await this.context.flux
            .getActions('missions')
            .getCleaningOneNorm({
              ...makePayloadFromState(
                missionData,
                get(this.props.carsIndex, [car_id, 'type_id'], null),
              ),
            });

          const norm_id = cloneDeep(this.props.formState.norm_id);
          norm_id[id][car_id] = normData.norm_id;
          this.handleChange('norm_id', norm_id);
        });
      });
    } else {
      this.handleChange(
        'norm_id',
        getDefaultMissionsCreationTemplate(
          this.props.missions,
          formState.for_column,
        ).norm_id,
      );
    }
  }

  handleSubmit = (...props) => {
    if (this.props.formState.for_column) {
      this.setState({ showColumnAssignment: true });
    } else {
      this.props.onSubmit(...props);
    }
  };

  handleSubmitFromAssignmentModal = (...props) => this.props.onSubmit(...props);

  hideColumnAssignmentMissionTemplate = () => {
    this.setState({ showColumnAssignment: false });
  };

  render() {
    const state = this.props.formState;

    if (this.state.showColumnAssignment) {
      return (
        <ColumnAssignmentMissionTemplate
          ASSIGN_OPTIONS={ASSIGN_OPTIONS}
          missions={this.props.missions}
          assign_to_waybill={state.assign_to_waybill}
          hideColumnAssignmentMissionTemplate={
            this.hideColumnAssignmentMissionTemplate
          }
          handleChange={this.handleChange}
          carsList={this.props.carsList}
          handleSubmit={this.handleSubmitFromAssignmentModal}
        />
      );
    }
    const errors = this.props.formErrors;

    console.log('form state is ', state); // eslint-disable-line

    const title = 'Формирование заданий из шаблонов';

    return (
      <Modal
        id="modal-missions-creation"
        show={this.props.show}
        onHide={this.props.onHide}
        bsSize="large"
        backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>

        <ModalBody>
          <Row>
            <Col md={12}>
              <label>Время выполнения</label>
            </Col>
            <Col md={6}>
              <ExtField
                type="date"
                label="c"
                error={errors.date_start}
                value={state.date_start}
                onChange={this.handleChangeDateStart}
              />
            </Col>
            <Col md={6}>
              <ExtField
                type="date"
                label="по"
                error={errors.date_end}
                value={state.date_end}
                onChange={this.handleChange}
                boundKeys="date_end"
              />
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <ExtField
                type="select"
                label="Источник получения задания"
                error={errors.mission_source_id}
                options={this.props.MISSION_SOURCES}
                value={state.mission_source_id}
                onChange={this.handleChange}
                boundKeys="mission_source_id"
                clearable
              />
              <div className="help-block-mission-source">
                Задания на основе централизованных заданий необходимо создавать
                во вкладке {'"'}НСИ{'"'}-{'"'}Реестр централизованных заданий
                {'"'}.
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <ExtField
                type="number"
                label="Количество циклов"
                error={errors.passes_count}
                value={state.passes_count}
                onChange={this.handleChange}
                boundKeys="passes_count"
              />
            </Col>
          </Row>
        </ModalBody>

        <Modal.Footer>
          <Div className="inline-block">
            {!state.for_column ? (
              <Div className="inline-block assignToWaybillCheck">
                <ReactSelect
                  type="select"
                  options={ASSIGN_OPTIONS}
                  value={state.assign_to_waybill}
                  clearable={false}
                  onChange={this.handleChange.bind(this, 'assign_to_waybill')}
                />
              </Div>
            ) : (
              <DivNone />
            )}
            <Div hidden={state.status === 'closed'}>
              <Button
                disabled={!this.props.canSave}
                onClick={this.handleSubmit}>
                Сформировать
              </Button>
            </Div>
          </Div>
        </Modal.Footer>
      </Modal>
    );
  }
}

MissionsCreationForm.contextTypes = {
  flux: PropTypes.object,
};

export default connect((state) => ({
  MISSION_SOURCES: selectorGetMissionSourceOptionsWithoutOrder(state),
}))(connectToStores(MissionsCreationForm, ['objects']));
