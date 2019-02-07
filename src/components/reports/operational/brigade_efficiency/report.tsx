import * as React from 'react';

import { IStateBrigadeEfficiency } from 'components/reports/operational/brigade_efficiency/@types/report.h';

import { exportable } from 'utils/decorators';
import ReportContainer from 'components/reports/common/ReportContainer';
import reportProps, { serviceUrl, renderers } from 'components/reports/operational/brigade_efficiency/reportProps';
import DutyMissionFormLazy from 'components/missions/duty_mission/form/main';
import { compose } from 'recompose';
import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';
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
  handleDutyNumberLinkClick = async (dutyNumber) => {
    try {
      const dutyMission = await this.props.actionGetDutyMissionById(
        dutyNumber,
        { page: 'order' },
      );

      if (!dutyMission) { return; }

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
      <DutyMissionFormLazy
        key={'BrigadesEfficiency_DutyMissionForm'}
        onFormHide={this.handleDutyMissionFormVisibility}
        showForm={this.state.dutyMissionFormVisibility}
        element={this.state.dutyMissionSelectedItem}
        readOnly={true}
        page="duty_mission"
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
