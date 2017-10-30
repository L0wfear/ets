import React from 'react';

import { Modal, Button } from 'react-bootstrap';
import ModalBody from 'components/ui/Modal';
import EtsSelect from 'components/ui/input/EtsSelect';
import Div from 'components/ui/Div.jsx';
import Form from 'components/compositions/Form.jsx';
import _ from 'lodash';
import connectToStores from 'flummox/connect';
import MissionTemplatesJournal from 'components/missions/mission_template/MissionTemplatesJournal.jsx';
import './main.scss';

class FaxogrammMissionsForm extends Form {
  render() {
    const state = this.props.formState;
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
          <MissionTemplatesJournal
            payload={payload}
            renderOnly
            onListStateChange={this.handleChange.bind(this, 'missionJournalState')}
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
      </Modal>
    );
  }
}

export default connectToStores(FaxogrammMissionsForm, ['objects', 'missions']);
