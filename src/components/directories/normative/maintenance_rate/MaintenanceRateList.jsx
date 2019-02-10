import React, { Component } from 'react';
import * as Button from 'react-bootstrap/lib/Button';
import * as ButtonGroup from 'react-bootstrap/lib/ButtonGroup';

import ElementsList from 'components/ElementsList';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import MaintenanceRateFormWrap from 'components/directories/normative/maintenance_rate/MaintenanceRateForm/MaintenanceRateFormWrap';

import MaintenanceRateTable from 'components/directories/normative/maintenance_rate/MaintenanceRateTable';
import permissions from 'components/directories/normative/maintenance_rate/config-data/permissions';

import { connect } from 'react-redux';
import {
  maintenanceRateGetAndSetInStore,
  maintenanceRateDelete,
} from 'redux-main/reducers/modules/maintenance_rate/actions-maintenanceRate';

import { compose } from 'recompose';
import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';

import {
  getSessionState,
  getMaintenanceRateState,
} from 'redux-main/reducers/selectors';

const loadingPageName = 'maintenance-rate';

@connectToStores(['objects'])
@exportable({ entity: 'maintenance_rate' })
@staticProps({
  entity: 'maintenance_rate',
  permissions,
  listName: 'maintenanceRateList',
  tableComponent: MaintenanceRateTable,
  formComponent: MaintenanceRateFormWrap,
  operations: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
})
class MaintenanceRateDirectory extends ElementsList {
  constructor(props) {
    super(props);

    this.setExportType(props.type);
  }

  removeElementAction = async (id) => {
    try {
      await this.props.maintenanceRateDelete(id);
      this.init();
    } catch (e) {
      //
    }
  };

  init() {
    const { flux } = this.context;

    this.props.maintenanceRateGetAndSetInStore(this.props.type);
    flux.getActions('objects').getMaintenanceWork();
    flux.getActions('objects').getCleanCategories();
    flux.getActions('technicalOperation').getTechnicalOperations();
  }

  componentDidUpdate(prevProps) {
    const { type } = this.props;

    if (prevProps.type !== type) {
      this.setExportType(type);
      this.props.maintenanceRateGetAndSetInStore(type);
    }
  }

  setExportType(type) {
    this.exportPayload = { type };
  }

  onFormHide = (isSubmitted) => {
    const changeState = {
      showForm: false,
    };

    if (isSubmitted) {
      this.init();
      changeState.selectedElement = null;
    }

    this.setState(changeState);
  };
}

class MaintenanceRate extends Component {
  state = {
    type: 'odh',
  };

  render() {
    const { type } = this.state;
    return (
      <div>
        <div className="cleaning-rate-header">
          <ButtonGroup>
            <Button
              active={this.state.type === 'odh'}
              onClick={() => this.setState({ type: 'odh' })}>
              ОДХ
            </Button>
            <Button
              disabled
              active={this.state.type === 'dt'}
              onClick={() => this.setState({ type: 'dt' })}>
              ДТ
            </Button>
          </ButtonGroup>
        </div>
        <MaintenanceRateDirectory type={type} {...this.props} />
      </div>
    );
  }
}

export default compose(
  withPreloader({
    page: loadingPageName,
    typePreloader: 'mainpage',
  }),
  connect(
    (state) => ({
      maintenanceRateList: getMaintenanceRateState(state).maintenanceRateList,
      userData: getSessionState(state).userData,
    }),
    (dispatch) => ({
      maintenanceRateGetAndSetInStore: (type) =>
        dispatch(
          maintenanceRateGetAndSetInStore(
            { type },
            {
              page: loadingPageName,
            },
          ),
        ),
      maintenanceRateDelete: (id) => dispatch(maintenanceRateDelete(id)),
    }),
  ),
)(MaintenanceRate);
