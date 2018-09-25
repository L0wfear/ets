import * as React from 'react';

import { IStateBrigadeEfficiency } from './@types/report.h';

import { DutyMissionService } from 'api/missions';
import { exportable } from 'utils/decorators';
import { getTableMeta as dutyMissionTableMeta } from 'components/missions/duty_mission/DutyMissionsTable';
import DutyMissionFormSCC from 'components/missions/duty_mission/DutyMissionFormWrap';
import ReportContainer from 'components/reports/common/ReportContainer';
import reportProps, { serviceUrl, renderers } from './reportProps';

const DutyMissionForm: any = DutyMissionFormSCC;

@exportable({
  entity: serviceUrl,
})
class BrigadeEfficiencyReport extends React.Component<{}, IStateBrigadeEfficiency> {
  constructor(props) {
    super(props);
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
    } catch ({ error_text }) {
      console.warn(error_text);
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
