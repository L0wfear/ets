import React, { Component, PropTypes } from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import each from 'lodash/each';

import { getServerErrorNotification } from 'utils/notifications';
import { getYesterday9am, getToday859am, createValidDateTime } from 'utils/dates';
import { FluxContext, connectToStores, exportable, staticProps } from 'utils/decorators';
import { autobind } from 'core-decorators';
import DutyMissionForm from 'components/missions/duty_mission/DutyMissionFormWrap.jsx';
import { getTableMeta as dutyMissionTableMeta } from 'components/missions/duty_mission/DutyMissionsTable.jsx';
import { DutyMissionService } from 'api/Services';

import BrigadeEfficiencyReportHeader from './BrigadeEfficiencyReportHeader.jsx';
import BrigadeEfficiencyReportsTable from './BrigadeEfficiencyReportsTable.jsx';

@connectToStores(['reports'])
@exportable({ entity: 'brigade_efficiency_report' })
@FluxContext
@staticProps({
  entity: 'brigade_efficiency_report',
})
@autobind
export default class BrigadeEfficiencyReports extends Component {

  static get propTypes() {
    return {
      brigadeEfficiencyReportsList: PropTypes.array,
    };
  }

  constructor(props) {
    super(props);

    const [date_start, date_end] = [getYesterday9am(), getToday859am()];

    this.state = {
      dutyMissionFormVisibility: false,
      dutyMissionSelectedItem: null,
      date_start,
      date_end,
      object_type: 'odh',
      // company_id: null,
    };
  }

  componentWillMount() {
    this.createBrigadeEfficiencyReportETS(this.state);
  }

  getCleanState(state) {
    return {
      ...state,
      date_start: createValidDateTime(state.date_start),
      date_end: createValidDateTime(state.date_end),
    };
  }

  handleChange(field, value) {
    this.setState({ [field]: value });
  }

  async handleonDutyNumberLinkClick(data) {
    try {
      const dutyMission = await DutyMissionService.path(`${data}/`).get();

      if (dutyMission.result.length === 0) { return; }

      this.setState({
        dutyMissionFormVisibility: true,
        dutyMissionSelectedItem: dutyMission.result[0],
      });
    } catch (err) {
      console.warn(err);
      global.NOTIFICATION_SYSTEM.notify(getServerErrorNotification('duty_mission (Журнал наряд-заданий)'));
    }
  }

  handleDutyMissionFormVisibility() {
    this.setState({ dutyMissionFormVisibility: false });
  }

  createBrigadeEfficiencyReportETS() {
    const { flux } = this.context;
    flux.getActions('reports').getBrigadeEfficiencyReports(this.state);
  }

  render() {
    const { brigadeEfficiencyReportsList = [] } = this.props;
    let currentCombination;
    each(brigadeEfficiencyReportsList, (el) => {
      if (!currentCombination || currentCombination !== `${el.company_name}${el.func_type}`) {
        currentCombination = `${el.company_name}${el.func_type}`;
      } else {
        el.hidden = true;
      }
    });

    const formSchema = dutyMissionTableMeta({ structures: [] });

    const dutyNumberForm = (
      <DutyMissionForm
        key={'BrigadesEfficiency_DutyMissionForm'}
        onFormHide={this.handleDutyMissionFormVisibility}
        showForm={this.state.dutyMissionFormVisibility}
        element={this.state.dutyMissionSelectedItem}
        meta={formSchema}
      />
    );

    return (
      <div className="ets-page-wrap">
        <BrigadeEfficiencyReportHeader
          handleChange={this.handleChange}
          onClick={this.createBrigadeEfficiencyReportETS}
          {...this.state}
        />
        <BrigadeEfficiencyReportsTable
          data={brigadeEfficiencyReportsList}
          onDutyNumberLinkClick={this.handleonDutyNumberLinkClick}
        >
          <Button disabled={!brigadeEfficiencyReportsList.length} bsSize="small" onClick={() => this.props.export(this.getCleanState(this.state))}><Glyphicon glyph="download-alt" /></Button>
        </BrigadeEfficiencyReportsTable>
        {dutyNumberForm}
      </div>
    );
  }
}
