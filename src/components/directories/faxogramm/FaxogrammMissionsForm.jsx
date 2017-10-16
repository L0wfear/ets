import React from 'react';

import { Modal, Button } from 'react-bootstrap';
import ModalBody from 'components/ui/Modal';
import EtsSelect from 'components/ui/input/EtsSelect';
import Div from 'components/ui/Div.jsx';
import Form from 'components/compositions/Form.jsx';
import _ from 'lodash';
import connectToStores from 'flummox/connect';
import MissionTemplatesJournal from 'components/missions/mission_template/MissionTemplatesJournal.jsx';
import MissionFormWrap from 'components/missions/mission/MissionFormWrap.jsx';
import './main.scss';

const disabledProps = {
  date_start: true,
  date_end: true,
  passes_count: true,
  mission_source_id: true,
};

class FaxogrammMissionsForm extends Form {

  constructor(props) {
    super(props);

    this.state = {
      showFormCreateMission: false,
    };
  }
  async componentDidMount() {
    await this.context.flux.getActions('technicalOperation').getTechnicalOperations();
    const { technicalOperationsList = [] } = this.props;
    const { formState: { technical_operations, order_date, order_date_to, id } } = this.props;

    const technical_operations_reduce = technical_operations.reduce((newObj, d) => {
      if (!newObj[d.id]) {
        newObj[d.id] = d;
      }
      return newObj;
    }, {});
    const technical_operations_reduce_by_municipal_facility = technical_operations.reduce((newObj, d) => {
      if (!newObj[d.norm_id]) {
        newObj[d.norm_id] = [{ value: d.municipal_facility_id, label: d.elem }];
      } else {
        newObj[d.norm_id].push({ value: d.municipal_facility_id, label: d.elem });
      }
      return newObj;
    }, {});

    const TECH_OPERATIONS = technicalOperationsList.reduce((arr, t) => {
      const tid = t.id;

      if (technical_operations_reduce[tid]) {
        arr.push({
          value: tid,
          label: t.name,
          passes_count: technical_operations_reduce[tid].num_exec,
          norm_id: technical_operations_reduce[tid].norm_id,
        });
      }

      return arr;
    },
    []);

    const externalData = {
      date_start: order_date,
      date_end: order_date_to,
      faxogramm_id: id,
      TECH_OPERATIONS,
      MUNICIPAL_FACILITY_OPTIONS: Object.values(technical_operations_reduce_by_municipal_facility).map(({ elem, municipal_facility_id }) => ({ value: municipal_facility_id, label: elem })),
    };

    this.setState({
      externalData,
      technical_operations_reduce_by_municipal_facility,
    });
  }
  handleClickOnCM = () => this.setState({ showFormCreateMission: true });
  onHideCM = () => this.setState({ showFormCreateMission: false });
  externalHanldeChanges = {
    handleGetPassesCount: id => this.state.externalData.TECH_OPERATIONS.find(d => d.value === id).passes_count,
    handleGetNormId: (id) => {
      const { technical_operations_reduce_by_municipal_facility = {} } = this.state;
      const norm_id = (this.state.externalData.TECH_OPERATIONS.find(d => d.value === id) || {}).norm_id;

      const MUNICIPAL_FACILITY_OPTIONS = technical_operations_reduce_by_municipal_facility[norm_id];

      return {
        norm_id,
        MUNICIPAL_FACILITY_OPTIONS,
      };
    },
  }

  render() {
    const state = this.props.formState;
    const { externalData = {} } = this.state;
    const { showFormCreateMission = false } = this.state;
    const payload = { faxogramm_id: state.id };
    const ASSIGN_OPTIONS = [
      { value: 'assign_to_active', label: 'Добавить в активный ПЛ' },
      { value: 'assign_to_new_draft', label: 'Создать черновик ПЛ' },
      { value: 'assign_to_available_draft', label: 'Добавить в черновик ПЛ' },
    ];

    return (
      <Modal {...this.props} bsSize="large" backdrop="static">

        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">Создание заданий</Modal.Title>
        </Modal.Header>

        <ModalBody>
          <div className="btn-container-faxogramms-create-mission">
            <Button onClick={this.handleClickOnCM}>Создать задание без шаблона</Button>
          </div>
          <MissionTemplatesJournal
            payload={payload}
            renderOnly
            onListStateChange={this.handleChange.bind(this, 'missionJournalState')}
            technicalOperationsList={this.props.technicalOperationsList || []}
          />
        </ModalBody>

        <Modal.Footer>
          <Div className="inline-block assignToWaybillCheck" style={{ width: '300px', textAlign: 'left !important', height: '22px', marginRight: '20px' }}>
            {/* <label>Создать черновик ПЛ / Добавить в существующий</label>*/}
            <EtsSelect
              type="select"
              options={ASSIGN_OPTIONS}
              value={state.assign_to_waybill}
              clearable={false}
              onChange={this.handleChange.bind(this, 'assign_to_waybill')}
            />
            {/* <Input type="checkbox" value={state.assign_to_waybill} onClick={this.handleChange.bind(this, 'assign_to_waybill', !!!state.assign_to_waybill)}/>*/}
          </Div>
          <Button disabled={!state.missionJournalState || !_.keys(state.missionJournalState.checkedElements).length} onClick={this.handleSubmit.bind(this)}>Сохранить</Button>
        </Modal.Footer>
        <MissionFormWrap
          fromFaxogrammMissionForm
          disabledProps={disabledProps}
          showForm={showFormCreateMission}
          onFormHide={this.onHideCM}
          element={null}
          externalData={externalData}
          externalHanldeChanges={this.externalHanldeChanges}
        />

      </Modal>
    );
  }
}

export default connectToStores(FaxogrammMissionsForm, ['objects', 'missions']);
