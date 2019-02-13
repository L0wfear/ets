import * as React from 'react';
import _ from 'lodash';
import * as Button from 'react-bootstrap/lib/Button';

import { MAX_ITEMS_PER_PAGE } from 'constants/ui';
import MissionInfoFormWrap from 'components/missions/mission/MissionInfoForm/MissionInfoFormWrap';
import permissions from 'components/missions/mission/config-data/permissions';
import CheckableElementsList from 'components/CheckableElementsList';
import { connectToStores, staticProps } from 'utils/decorators';
import {
  extractTableMeta,
  getServerSortingField,
} from 'components/ui/table/utils';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';
import PrintForm from 'components/missions/common/PrintForm';
import Paginator from 'components/ui/new/paginator/Paginator';

import MissionsTable, {
  getTableMeta,
} from 'components/missions/mission/MissionsTable';
import MissionFormWrap from 'components/missions/mission/MissionFormWrap';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import {
  getCompanyStructureState,
  getSessionState,
} from 'redux-main/reducers/selectors';
import companyStructureActions from 'redux-main/reducers/modules/company_structure/actions';
import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';

const is_archive = true;
const loadingPageName = 'mission-archive';

const ButtonUpdateMission = withRequirePermissionsNew({
  permissions: permissions.update,
})(Button);

@connectToStores(['missions', 'objects', 'employees'])
@staticProps({
  entity: 'mission',
  permissions,
  listName: 'missionsList',
  tableComponent: MissionsTable,
  tableMeta: extractTableMeta(getTableMeta()),
  operations: ['LIST', 'READ', 'UPDATE', 'CHECK'],
})
class MissionsArchiveJournal extends CheckableElementsList {
  constructor(props) {
    super(props);

    this.state = {
      ...this.state,
      showPrintForm: false,
      showMissionRejectForm: false,
      showMissionInfoForm: false,
      page: 0,
      sortBy: ['number:desc'],
      filter: {},
    };
  }

  init = async () => {
    const { flux } = this.context;
    const outerPayload = {
      start_date: new Date(),
      end_date: new Date(),
    };

    this.props.getAndSetInStoreCompanyStructureLinear();

    flux
      .getActions('missions')
      .getMissions(
        null,
        MAX_ITEMS_PER_PAGE,
        0,
        this.state.sortBy,
        this.state.filter,
        is_archive,
      );
    flux.getActions('objects').getCars();
    flux.getActions('technicalOperation').getTechnicalOperations();
    flux.getActions('missions').getMissionSources();
    flux
      .getActions('missions')
      .getCleaningMunicipalFacilityAllList(outerPayload);
    flux.getActions('technicalOperation').getTechnicalOperationsObjects();
  };

  componentDidUpdate(nextProps, prevState) {
    if (
      prevState.page !== this.state.page
      || prevState.sortBy !== this.state.sortBy
      || prevState.filter !== this.state.filter
    ) {
      this.refreshList(this.state);
    }
  }

  refreshList = async (state = this.state) => {
    const missions = await this.context.flux
      .getActions('missions')
      .getMissions(
        null,
        MAX_ITEMS_PER_PAGE,
        state.page * MAX_ITEMS_PER_PAGE,
        state.sortBy,
        state.filter,
        is_archive,
      );

    const { total_count } = missions.result.meta;
    const resultCount = missions.result.rows.length;

    if (resultCount === 0 && total_count > 0) {
      this.setState({ page: Math.ceil(total_count / MAX_ITEMS_PER_PAGE) - 1 });
    }
  };

  checkDisabledArchive = () => {
    const validateMissionsArr = Object.values(this.state.checkedElements);
    const { selectedElement } = this.state;
    if (selectedElement) {
      validateMissionsArr.push(selectedElement);
    }

    return validateMissionsArr.length === 0;
  };

  archiveCheckedElements = () => {
    const { selectedElement } = this.state;
    const { checkedElements = {} } = this.state;

    if (selectedElement) {
      checkedElements[selectedElement[this.selectField]] = selectedElement;
    }

    const moreOne = Object.keys(checkedElements).length > 1;

    confirmDialog({
      title: 'Внимание',
      body: `Вы уверены, что хотите вернуть из архива ${
        moreOne ? 'выбранные задания' : 'выбранное задание'
      }?`,
    })
      .then(() =>
        Promise.all(
          Object.entries(checkedElements).map(([id]) =>
            this.context.flux
              .getActions('missions')
              .changeArchiveMissionStatus(id, false),
          ),
        )
          .then(() => {
            this.refreshList();
            global.NOTIFICATION_SYSTEM.notify(
              `${
                moreOne
                  ? 'Выбранные задания перенесены из'
                  : 'Выбранное задание перенесено из'
              } архива`,
            );
          })
          .catch(() => {
            this.refreshList();
          })
          .then(() => {
            this.setState({
              selectedElement: null,
              checkedElements: {},
            });
          }),
      )
      .catch(() => {});
  };

  mapView = async (id) => {
    const { result, warnings = false } = await this.context.flux
      .getActions('missions')
      .getMissionData(id);
    if (warnings && warnings.length > 0) {
      global.NOTIFICATION_SYSTEM.notify(warnings[0], 'error');
    } else {
      this.setState({ mission: result, showMissionInfoForm: true });
    }
  };

  getForms = () => {
    return [
      <div key={'forms'}>
        <MissionFormWrap
          onFormHide={this.onFormHide}
          showForm={this.state.showForm}
          element={this.state.selectedElement}
          refreshTableList={this.refreshList}
          deepLvl={this.props.deepLvl || 1}
          {...this.props}
        />
        <MissionInfoFormWrap
          onFormHide={() => this.setState({ showMissionInfoForm: false })}
          showForm={this.state.showMissionInfoForm}
          element={this.state.mission}
          flux={this.context.flux}
        />
        <PrintForm
          onExport={this.processExport}
          show={this.state.showPrintForm}
          onHide={() => this.setState({ showPrintForm: false })}
          title={'Печать журнала заданий'}
        />
      </div>,
    ];
  };

  getButtons = () => {
    const buttons = super.getButtons();

    buttons.push(
      <ButtonUpdateMission
        key="butto-archive-mission"
        bsSize="small"
        onClick={this.archiveCheckedElements}
        disabled={this.checkDisabledArchive()}>
        Вернуть из архива
      </ButtonUpdateMission>,
    );

    return buttons;
  };

  changeSort = (field, direction) => {
    this.setState({
      sortBy: getServerSortingField(
        field,
        direction,
        _.get(this.tableMeta, [field, 'sort', 'serverFieldName']),
      ),
    });
  };

  changeFilter = (filter) => {
    this.setState({ filter });
  };

  getAdditionalProps = () => {
    return {
      mapView: this.mapView,
      structures: this.props.companyStructureLinearList,
      changeSort: this.changeSort,
      changeFilter: this.changeFilter,
      filterValues: this.state.filter,
      rowNumberOffset: this.state.page * MAX_ITEMS_PER_PAGE,
      useServerFilter: true,
      useServerSort: true,
      is_archive,
    };
  };

  getAdditionalFormProps() {
    return {
      loadingPageName,
    };
  }

  additionalRender = () => {
    return (
      <Paginator
        currentPage={this.state.page}
        maxPage={Math.ceil(this.props.missionsTotalCount / MAX_ITEMS_PER_PAGE)}
        setPage={(page) => this.setState({ page })}
        firstLastButtons
      />
    );
  };
}

export default compose(
  withPreloader({
    page: loadingPageName,
    typePreloader: 'mainpage',
  }),
  connect(
    (state) => ({
      companyStructureLinearList: getCompanyStructureState(state)
        .companyStructureLinearList,
      userData: getSessionState(state).userData,
    }),
    (dispatch) => ({
      getAndSetInStoreCompanyStructureLinear: () =>
        dispatch(
          companyStructureActions.getAndSetInStoreCompanyStructureLinear(
            {},
            { page: loadingPageName },
          ),
        ),
    }),
  ),
)(MissionsArchiveJournal);
