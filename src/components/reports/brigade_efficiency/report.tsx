import * as React from 'react';

import { IStateBrigadeEfficiency } from './@types/report.h';

import { getServerErrorNotification } from 'utils/notifications';
import { DutyMissionService } from 'api/missions';
import { exportable } from 'utils/decorators';
import { getTableMeta as dutyMissionTableMeta } from 'components/missions/duty_mission/DutyMissionsTable.jsx';
import DutyMissionForm from 'components/missions/duty_mission/DutyMissionFormWrap.jsx';
import ReportContainer from 'components/reports/common/ReportContainer';
import reportProps, { serviceUrl, renderers } from './reportProps';

@exportable({
  entity: serviceUrl,
})
class BrigadeEfficiencyReport extends React.Component<{}, IStateBrigadeEfficiency> {
  constructor() {
    super();
    this.state = {
      dutyMissionFormVisibility: false,
      dutyMissionSelectedItem: null,
    };
  }
  handleDutyNumberLinkClick = async dutyNumber => {
    try {
      const dutyMission = await DutyMissionService.path(`${dutyNumber}/`).get();

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
  handleDutyMissionFormVisibility = () => {
    this.setState({ dutyMissionFormVisibility: false });
  }
  render() {
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
        <ReportContainer
          {...reportProps}
          renderers={renderers(this.handleDutyNumberLinkClick)}
          {...this.props}
        />
        {dutyNumberForm}
      </div>
    );
  }
}

export default BrigadeEfficiencyReport;
