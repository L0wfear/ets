import * as React from 'react';

import { IStateBrigadeEfficiency } from 'components/old/reports/operational/brigade_efficiency/@types/report.h';

import { exportable } from 'utils/decorators';
import ReportContainer from 'components/old/reports/common/ReportContainer';
import reportProps, { serviceUrl, renderers } from 'components/old/reports/operational/brigade_efficiency/reportProps';
import DutyMissionFormWithoutRegistry from 'components/new/pages/missions/duty_mission/form/main/DutyMissionFormWithoutRegistry';
import { compose } from 'recompose';
import withPreloader from 'components/old/ui/new/preloader/hoc/with-preloader/withPreloader';
import { connect, HandleThunkActionCreator } from 'react-redux';
import missionsActions from 'redux-main/reducers/modules/missions/actions';
import { ReduxState } from 'redux-main/@types/state';

const exportableTSX: any = exportable;

type DispatchPropsBrigadeEfficiencyReport = {
  actionGetDutyMissionById: HandleThunkActionCreator<typeof missionsActions.actionGetDutyMissionById>;
};
type PropsBrigadeEfficiencyReport = (
  DispatchPropsBrigadeEfficiencyReport
) & Record<string, any>;

@exportableTSX({
  entity: serviceUrl,
})
class BrigadeEfficiencyReport extends React.Component<PropsBrigadeEfficiencyReport, IStateBrigadeEfficiency> {
  constructor(props) {
    super(props);
    this.state = {
      dutyMissionFormVisibility: false,
      dutyMissionSelectedItem: null,
    };
  }
  handleDutyNumberLinkClick = async ({ rowData: { id } }) => {
    try {
      const dutyMission = await this.props.actionGetDutyMissionById(
        id,
        { page: 'order' },
      );

      if (!dutyMission) {
        global.NOTIFICATION_SYSTEM.notify('Наряд-задание не найдено', 'info');
        return;
      }

      this.setState({
        dutyMissionFormVisibility: true,
        dutyMissionSelectedItem: dutyMission,
      });
    } catch ({ error_text }) {
      // tslint:disable-next-line
      console.warn(error_text);
    }
  }
  handleDutyMissionFormVisibility = () => {
    this.setState({ dutyMissionFormVisibility: false });
  }
  render() {
    const dutyNumberForm = (
      <DutyMissionFormWithoutRegistry
        handleHide={this.handleDutyMissionFormVisibility}
        showForm={this.state.dutyMissionFormVisibility}
        element={this.state.dutyMissionSelectedItem}
        readOnly={true}
        type={null}
        registryKey="duty_mission"
        page="duty_mission"
        path="duty_mission_form"
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

export default compose(
  withPreloader({
    page: 'report',
    typePreloader: 'mainpage',
  }),
  connect<null, DispatchPropsBrigadeEfficiencyReport, any, ReduxState>(
    null,
    (dispatch: any) => ({
      actionGetDutyMissionById: (...arg) => (
        dispatch(
          missionsActions.actionGetDutyMissionById(...arg),
        )
      ),
    }),
  ),
)(BrigadeEfficiencyReport);
