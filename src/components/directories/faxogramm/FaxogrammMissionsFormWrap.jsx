import React, { Component } from 'react';
import _ from 'lodash';
import Div from 'components/ui/Div.jsx';
import FaxogrammMissionsForm from './FaxogrammMissionsForm.jsx';
import FormWrap from 'components/compositions/FormWrap.jsx';
import { isEmpty } from 'utils/functions';
import IntervalPicker from 'components/ui/IntervalPicker.jsx';

class FaxogrammMissionsFormWrap extends FormWrap {

  componentWillReceiveProps(props) {
    if (props.showForm && props.showForm !== this.props.showForm) {
      const faxogrammMissions = props.element === null ? {} : _.clone(props.element);
      const formErrors = this.validate(faxogrammMissions, {});

      if (isEmpty(faxogrammMissions.assign_to_waybill)) {
        faxogrammMissions.assign_to_waybill = 'assign_to_new_draft';
      }

      this.setState({
        formState: faxogrammMissions,
        canSave: !_.filter(formErrors).length, // false,
        formErrors,
      });
    }
  }

  async handleFormSubmit() {
    const { flux } = this.context;
    const { formState } = this.state;
    const payload = {
      mission_source_id: '4',
      faxogramm_id: formState.id,
      date_start: formState.order_date,
      date_end: formState.order_date_to,
      assign_to_waybill: formState.assign_to_waybill,
    };

    const createMissions = async (element, payload) => {
      let error = false;
      try {
        await flux.getActions('missions').createMissions(element, payload);
      } catch (e) {
        error = true;
        if (e && e.message.code === 'no_active_waybill') {
          let cancel = false;
          try {
            await confirmDialog({
              title: 'Для ТС не существует активного ПЛ',
              body: 'Создать черновик ПЛ?',
            });
          } catch (error) {
            cancel = true;
          }
          if (!cancel) {
            const newPayload = {
              mission_source_id: '4',
              faxogramm_id: payload.id,
              date_start: payload.order_date,
              date_end: payload.order_date_to,
              assign_to_waybill: 'assign_to_new_draft',
            };
            await createMissions(element, newPayload);
          }
        }
        if (e && e.message.code === 'invalid_period') {
          const waybillNumber = e.message.message.split('№')[1].split(' ')[0];
          const dateStart = e.message.message.split('(')[1].split(' - ')[0];
          const dateEnd = e.message.message.split(' - ')[1].slice(0, -1);

          const body = self => <div>
            <div>{e.message.message}</div><br />
            <center>Введите даты задания:</center>
            <IntervalPicker
              interval={self.state.interval}
              onChange={interval => self.setState({ interval })}
            />
          </div>;

          let cancel = false;
          let state;
          try {
            state = await confirmDialog({
              title: <b>{`Задание будет добавлено в ПЛ №${waybillNumber}`}</b>,
              body,
            });
          } catch (error) {
            cancel = true;
          }
          if (!cancel) {
            const newPayload = {
              mission_source_id: '4',
              faxogramm_id: payload.id,
              date_start: state.interval[0],
              date_end: state.interval[1],
              assign_to_waybill: payload.assign_to_waybill,
            };
            await createMissions(element, newPayload);
          }
        }
      }
      return error;
    };

    const missions = _.keys(formState.missionJournalState.checkedElements)
      .map(key => formState.missionJournalState.checkedElements[key]);

    let closeForm = true;

    for (const m of missions) {
      const e = await createMissions({ [m.id]: m }, payload);
      if (e) closeForm = false;
    }

    closeForm && this.props.onFormHide();
    return;
  }

  render() {
    return (
      <Div hidden={!this.props.showForm}>
        <FaxogrammMissionsForm
          formState={this.state.formState}
          onSubmit={this.handleFormSubmit.bind(this)}
          handleFormChange={this.handleFormStateChange.bind(this)}
          show={this.props.showForm}
          onHide={this.props.onFormHide}
          {...this.state}
        />
      </Div>
    );
  }

}

export default FaxogrammMissionsFormWrap;
