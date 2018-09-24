import React from 'react';
import connectToStores from 'flummox/connect';
import { DropdownButton, MenuItem, Button, Glyphicon, Row, Col } from 'react-bootstrap';
import get from 'lodash/get';
import ElementsList from 'components/ElementsList.jsx';
import Paginator from 'components/ui/Paginator.jsx';
import Div from 'components/ui/Div.jsx';
import { saveData } from 'utils/functions'; 
import { staticProps } from 'utils/decorators';
import { autobind } from 'core-decorators';
import { extractTableMeta, getServerSortingField } from 'components/ui/table/utils';
import FaxogrammsDatepicker from 'components/directories/faxogramm/FaxogrammsDatepicker';
import FaxogrammMissionsFormWrap from './FaxogrammMissionsFormWrap.jsx';
import FaxogrammsTable, { getTableMeta } from './FaxogrammsTable.jsx';
import FaxogrammInfoTable from './FaxogrammInfoTable.jsx';
import FaxogrammOperationInfoTable from './FaxogrammOperationInfoTable.jsx';

const MAX_ITEMS_PER_PAGE = 15;

const TypeDownload = {
  old: '1',
  new: '2',
};
const marginLeft = { marginLeft: 10 };

@staticProps({
  tableMeta: extractTableMeta(getTableMeta()),
})

@autobind
class FaxogrammDirectory extends ElementsList {

  constructor(props) {
    super(props);

    this.mainListName = 'faxogrammsList';

    this.state = {
      page: 0,
      selectedElement: null,
      create_date_from: props.appConfig.shift.shift_start,
      create_date_to: props.appConfig.shift.shift_end,
      showForm: false,
      sortBy: ['order_number:desc'],
      filter: {},
    };
  }

  componentDidMount() {
    super.componentDidMount();

    this.getFaxogramms();
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

  saveFaxogramm(typeSave) {
    const { flux } = this.context;
    const faxogramm = this.state.selectedElement;

    const payload = {};
    if (typeSave === TypeDownload.new) {
      payload.format = 'xls';
    }

    flux.getActions('objects').saveFaxogramm(faxogramm.id, payload)
      .then(({ blob, fileName }) => saveData(blob, fileName));
  }

  changeSort(field, direction) {
    this.setState({ sortBy: getServerSortingField(field, direction, get(this.tableMeta, [field, 'sort', 'serverFieldName'])) });
  }

  changeFilter(filter) {
    this.setState({ filter });
  }

  getAdditionalProps() {
    return { changeSort: this.changeSort, changeFilter: this.changeFilter, filterValues: this.state.filter };
  }

  handleChange(field, value) {
    this.setState({ [field]: value }, () => this.getFaxogramms());
  }

  seclectDownload = (e, [eventName]) => {
    switch (eventName) {
      case TypeDownload.old: return this.saveFaxogramm(TypeDownload.old);
      case TypeDownload.new: return this.saveFaxogramm(TypeDownload.new);
      default: return null;
    }
  }

  render() {
    const { faxogrammsList = [] } = this.props;
    const faxogramm = this.state.selectedElement || {};
    const faxogrammInfoData = [{ id: 0, order_info: faxogramm.order_info }];

    return (
      <div className="ets-page-wrap auto-height" ref={node => (this.node = node)}>
        <FaxogrammsDatepicker handleChange={this.handleChange} {...this.state} />
        <FaxogrammsTable
          data={faxogrammsList}
          onRowSelected={this.selectElement}
          selected={this.state.selectedElement}
          selectField={'id'}
          {...this.props}
          {...this.getAdditionalProps()}
        >
          <Button onClick={this.showForm} disabled={this.state.selectedElement === null || faxogramm.order_status_id !== 2}>Создать задания</Button>
          <div style={marginLeft} >
            <DropdownButton onSelect={this.seclectDownload} pullRight title={<Glyphicon glyph="download-alt" />} id="bg-nested-dropdown">
              <MenuItem eventKey={TypeDownload.old} disabled={this.state.selectedElement === null}>Скан-копия факсограммы</MenuItem>
              <MenuItem eventKey={TypeDownload.new} disabled={this.state.selectedElement === null}>Расшифровка централизованного задания</MenuItem>
            </DropdownButton>
          </div>
        </FaxogrammsTable>
        <FaxogrammMissionsFormWrap
          onFormHide={this.onFormHide}
          showForm={this.state.showForm}
          element={this.state.selectedElement}
          {...this.props}
        />
        <Paginator currentPage={this.state.page} maxPage={Math.ceil(this.props.faxogrammsTotalCount / MAX_ITEMS_PER_PAGE)} setPage={page => this.setState({ page })} firstLastButtons />
        <Div className="data-table data-other" hidden={this.state.selectedElement === null}>
          <Row>
            <Col md={8}>
              <FaxogrammOperationInfoTable
                noHeader
                preventNoDataMessage
                title="Расшифровка факсограммы"
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
      </div>
    );
  }
}

export default connectToStores(FaxogrammDirectory, ['objects']);
