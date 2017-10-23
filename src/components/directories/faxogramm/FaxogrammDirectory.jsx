import React from 'react';
import connectToStores from 'flummox/connect';
import { Button, Glyphicon, Row, Col } from 'react-bootstrap';
import ElementsList from 'components/ElementsList.jsx';
import Paginator from 'components/ui/Paginator.jsx';
import Div from 'components/ui/Div.jsx';
import { saveData } from 'utils/functions';
import { getToday0am, getToday2359 } from 'utils/dates';
import { autobind } from 'core-decorators';
import MissionFormWrap from 'components/missions/mission/MissionFormWrap.jsx';

import FaxogrammsDatepicker from './FaxogrammsDatepicker.jsx';
import FaxogrammMissionsFormWrap from './FaxogrammMissionsFormWrap.jsx';
import FaxogrammsTable from './FaxogrammsTable.jsx';
import FaxogrammInfoTable from './FaxogrammInfoTable.jsx';
import FaxogrammOperationInfoTable from './FaxogrammOperationInfoTable.jsx';

const MAX_ITEMS_PER_PAGE = 15;
const disabledProps = {
  mission_source_id: true,
};

// простите меня за это
@autobind
class FaxogrammDirectory extends ElementsList {

  constructor(props) {
    super(props);

    this.mainListName = 'faxogrammsList';
    this.state = {
      page: 0,
      selectedElement: null,
      create_date_from: getToday0am(),
      create_date_to: getToday2359(),
      showForm: false,
      sortBy: ['order_number:desc'],
      filter: {},
      showFormCreateMission: false,
    };
  }

  componentDidMount() {
    super.componentDidMount();
    this.context.flux.getActions('technicalOperation').getTechnicalOperations();
    const { id } = this.props.routeParams;

    this.getFaxogramms();
    if (id) {
      this.getOneFaxogramm(id).then(({ result }) => {
        this.setState({
          selectedElement: result[0],
          showForm: true,
        });
      });
    }
  }

  async componentWillUpdate(nextProps, nextState) {
    if (
      nextState.page !== this.state.page ||
      nextState.sortBy !== this.state.sortBy ||
      nextState.filter !== this.state.filter
    ) {
      const pageOffset = nextState.page * MAX_ITEMS_PER_PAGE;
      const objects = await this.context.flux.getActions('objects').getFaxogramms(
        MAX_ITEMS_PER_PAGE,
        pageOffset,
        nextState.sortBy,
        nextState.filter,
        this.state.create_date_from,
        this.state.create_date_to,
      );

      const { total_count } = objects;
      const resultCount = objects.result.length;

      if (resultCount === 0 && total_count > 0) {
        const offset = (Math.ceil(total_count / MAX_ITEMS_PER_PAGE) - 1) * MAX_ITEMS_PER_PAGE;
        this.context.flux.getActions('objects').getFaxogramms(
          MAX_ITEMS_PER_PAGE,
          offset,
          nextState.sortBy,
          nextState.filter,
          this.state.create_date_from,
          this.state.create_date_to,
        );
      }
    }
  }

  getFaxogramms() {
    this.context.flux.getActions('objects').getFaxogramms(
      MAX_ITEMS_PER_PAGE,
      this.state.page * MAX_ITEMS_PER_PAGE,
      this.state.sortBy,
      this.state.filter,
      this.state.create_date_from,
      this.state.create_date_to,
    );
  }
  getOneFaxogramm(id) {
    return this.context.flux.getActions('objects').getFaxogrammById(id);
  }

  saveFaxogramm() {
    const { flux } = this.context;
    const faxogramm = this.state.selectedElement;
    flux.getActions('objects').saveFaxogramm(faxogramm.id)
      .then(({ blob, fileName }) => saveData(blob, fileName));
  }

  getAdditionalProps() {
    // const { structures } = this.context.flux.getStore('session').getCurrentUser();
    const changeSort = (field, direction) => this.setState({ sortBy: `${field}:${direction ? 'asc' : 'desc'}` });
    const changeFilter = (filter) => {
      this.context.flux.getActions('objects').getFaxogramms(
        MAX_ITEMS_PER_PAGE,
        this.state.page * MAX_ITEMS_PER_PAGE,
        this.state.sortBy,
        filter,
        this.state.create_date_from,
        this.state.create_date_to,
      );
      this.setState({ filter });
    };
    return { changeSort, changeFilter, filterValues: this.state.filter };
  }

  handleChange(field, value) {
    this.setState({ [field]: value }, () => this.getFaxogramms());
  }

  /**
   * @override
   */
  onFormHide() {
    this.props.history.push('/faxogramms');
    this.setState({
      showForm: false,
      selectedElement: null,
    });
  }

  /**
   * @override
   */
  showForm = () => {
    const { id } = this.state.selectedElement;
    this.props.history.push(`/faxogramms/${id}`);
    this.setState({
      showForm: true,
    });
  }

  handleClickOnCM = () => {
    const { id } = this.state.selectedElement;
    const TECH_OPERATIONS = [
      {
        value: this.state.fInfoselectedElement.id,
        label: this.state.fInfoselectedElement.tk_operation_name,
      },
    ];
    const MUNICIPAL_FACILITY_OPTIONS = [
      {
        value: this.state.fInfoselectedElement.municipal_facility_id,
        label: this.state.fInfoselectedElement.element,
      },
    ];

    this.setState({
      ...this.state,
      showFormCreateMission: true,
      externalData: {
        faxogramm_id: id,
        TECH_OPERATIONS,
        MUNICIPAL_FACILITY_OPTIONS,
        to_data: this.state.fInfoselectedElement,
      },
    });
  }
  onHideCM = () => this.setState({ showFormCreateMission: false });
  fInfoRowSelected = ({ props }) => {
    this.setState({ fInfoselectedElement: props.data });
  }
  faxogrammSelectElement = (dataFromGriddle) => {
    const { id: newId } = dataFromGriddle.props.data;
    const { id: oldId } = this.state.selectedElement || {};
    if (oldId !== newId) {
      this.setState({ fInfoselectedElement: null });
    }
    this.selectElement(dataFromGriddle);
  }

  render() {
    const { faxogrammsList = [] } = this.props;
    const faxogramm = this.state.selectedElement || {};
    const faxogrammInfoData = [{ id: 0, order_info: faxogramm.order_info }];
    const {
      showFormCreateMission = false,
      externalData = {},
    } = this.state;
    const { num_exec = 0 } = this.state.fInfoselectedElement || {}
    return (
      <div className="ets-page-wrap" ref={node => (this.node = node)}>
        <FaxogrammsDatepicker handleChange={this.handleChange} {...this.state} />
        <FaxogrammsTable
          data={faxogrammsList}
          onRowSelected={this.faxogrammSelectElement}
          selected={this.state.selectedElement}
          selectField={'id'}
          {...this.props}
          {...this.getAdditionalProps()}
        >
          <Button onClick={this.handleClickOnCM} disabled={!num_exec}>Создать задание</Button>
          <Button onClick={this.saveFaxogramm} disabled={this.state.selectedElement === null}><Glyphicon glyph="download-alt" /></Button>
        </FaxogrammsTable>
        <FaxogrammMissionsFormWrap
          onFormHide={this.onFormHide}
          showForm={this.state.showForm}
          element={this.state.selectedElement}
          {...this.props}
        />
        <Paginator currentPage={this.state.page} maxPage={Math.ceil(this.props.faxogrammsTotalCount / MAX_ITEMS_PER_PAGE)} setPage={page => this.setState({ page })} firstLastButtons />
        <Div hidden={this.state.selectedElement === null}>
          <Row>
            <h4 style={{ marginLeft: 20, fontWeight: 'bold' }}>Расшифровка факсограммы</h4>
            <Col md={8}>
              <FaxogrammOperationInfoTable
                noHeader
                preventNoDataMessage
                selected={this.state.fInfoselectedElement}
                selectField={'order_operation_id'}
                onRowSelected={this.fInfoRowSelected}
                data={faxogramm.technical_operations || []}
              />
            </Col>
            <Col md={4}>
              <FaxogrammInfoTable
                noHeader
                preventNoDataMessage
                data={faxogrammInfoData}
              />
            </Col>
          </Row>
        </Div>
        <MissionFormWrap
          fromFaxogrammMissionForm
          disabledProps={disabledProps}
          showForm={showFormCreateMission}
          onFormHide={this.onHideCM}
          element={null}
          externalData={externalData}
          faxogrammStartDate={this.state.date_start}
          faxogrammEndDate={this.state.date_end}
          timeFaxogramm={this.state.timeFaxogramm}
        />
      </div>
    );
  }
}

export default connectToStores(FaxogrammDirectory, ['objects']);
