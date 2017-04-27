import React, { Component, PropTypes } from 'react';
import { Button, Glyphicon } from 'react-bootstrap';

import { getServerErrorNotification } from 'utils/notifications';
import { getYesterday9am, getToday859am, createValidDateTime } from 'utils/dates';
import { FluxContext, connectToStores, exportable, HistoryContext } from 'utils/decorators';
import { autobind } from 'core-decorators';
import DutyMissionForm from 'components/missions/duty_mission/DutyMissionFormWrap.jsx';
import { getTableMeta as dutyMissionTableMeta } from 'components/missions/duty_mission/DutyMissionsTable.jsx';
import { DutyMissionService } from 'api/Services';

import BrigadeEfficiencyReportTable from './BrigadeEfficiencyReportTable.jsx';

@connectToStores(['reports'])
@exportable({ entity: 'brigade_efficiency_report' })
@FluxContext
@HistoryContext
@autobind
class BrigadeEfficiencyReport extends Component {
  constructor(props) {
    super(props);

    const [date_start, date_end] = [getYesterday9am(), getToday859am()];

    this.state = {
      date_start,
      date_end,
      object_type: 'odh',
      company_id: null,
      dutyMissionFormVisibility: false,
      dutyMissionSelectedItem: null,
    };
  }
  componentWillMount() {
    const { flux } = this.context;
    this.setState(this.props.location.query)
    flux.getActions('reports').getBrigadeEfficiencyReport2L(this.props.location.query);
  }
  getCleanState(state) {
    return {
      ...state,
      date_start: createValidDateTime(state.date_start),
      date_end: createValidDateTime(state.date_end),
    };
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
  export() {
    this.props.export(this.getCleanState(this.state));
  }
  pushBack() {
    this.context.history.pushState(null, '/brigade-efficiency-report');
  }
  render() {
    const { brigadeEfficiencyReport2L = [] } = this.props;

    const formSchema = dutyMissionTableMeta({ structures: [] });

    const dutyNumberForm = (
      <DutyMissionForm
        key={'BrigadesEfficiency_DutyMissionForm'}
        onFormHide={this.handleDutyMissionFormVisibility}
        showForm={this.state.dutyMissionFormVisibility}
        element={this.state.dutyMissionSelectedItem}
        meta={formSchema}
        readOnly
      />
    );

    return (
      <div>
        <BrigadeEfficiencyReportTable
          data={brigadeEfficiencyReport2L}
          onDutyNumberLinkClick={this.handleonDutyNumberLinkClick}
        >
          <Button
            disabled={!brigadeEfficiencyReport2L.length}
            bsSize="small"
            onClick={this.export}
          ><Glyphicon glyph="download-alt" /></Button>
          <Button bsSize="small" onClick={this.pushBack}>Назад</Button>
        </BrigadeEfficiencyReportTable>
        {dutyNumberForm}
      </div>
    );
  }
}

BrigadeEfficiencyReport.propTypes = {
  brigadeEfficiencyReport2L: PropTypes.array,
  export: PropTypes.func,
  location: React.PropTypes.shape({
    query: React.PropTypes.shape({}),
  }),
};

export default BrigadeEfficiencyReport;
