import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Glyphicon } from 'react-bootstrap';
import {
  difference,
  identity,
  isEmpty,
  isEqual,
  omit,
  pick,
  uniqBy,
} from 'lodash';

import Title from './Title';
import { filterFunction } from 'components/ui/tableNew/utils';
import { IDataTableColSchema, IDataTableSelectedRow, IDataTableColFilter } from 'components/ui/table/@types/schema.h';
import { IReactSelectOption } from 'components/ui/@types/EtsSelect.h';
import { IPropsReportContainer, IStateReportContainer } from './@types/ReportContainer.h';
import { IPropsReportHeaderCommon } from './@types/ReportHeaderWrapper.h';
import { ReportDataPromise, IReportTableMeta } from 'components/reports/redux/modules/@types/report.h';

import Preloader from 'components/ui/Preloader.jsx';
import { getServerErrorNotification, noItemsInfoNotification } from 'utils/notifications';
import * as reportActionCreators from 'components/reports/redux/modules/report';
import DataTable from 'components/ui/table/DataTable.jsx';
import DataTableNew from 'components/ui/tableNew/DataTable';

// Хак. Сделано для того, чтобы ts не ругался на jsx-компоненты.
const Table: any = DataTable;

class ReportContainer extends React.Component<IPropsReportContainer, IStateReportContainer> {
  constructor(props) {
    super(props);
    this.state = {
      filterResetting: false,
      fetchedBySubmitButton: false,
      fetchedByMoveDownButton: false,
      exportFetching: false,
      selectedRow: null,
      filterValues: {},
      uniqName: props.uniqName || '_uniq_field',
    };
  }
  componentDidMount() {
    // Так как стор один на все отчёты, необходимо его чистить в начале.
    this.props.setInitialState();
    if (Object.keys(this.props.location.query).length > 0) {
      this.getReportData(this.props.location.query);
    } else {
      this.getTableMetaInfo();
    }
  }

  async componentWillReceiveProps(nextProps: IPropsReportContainer) {
    const { query } = this.props.location;

    const nextQuery = nextProps.location.query;

    // Если урл поменялся и он не пустой, то делаем запрос данных.
    if (!isEqual(query, nextQuery)) {
      /**
       * Первый запрос с кнопки меняет урл, поэтому происходит повторный запрос.
       * Данная проверка исключает такую ситуацию.
       */
      if (this.state.fetchedBySubmitButton) {
        this.setState({ fetchedBySubmitButton: false });
        return;
      }

      if (Object.keys(nextQuery).length > 0) {
        await this.getReportData(nextQuery);
        this.setState({ filterValues: {} });
      } else {
        this.getTableMetaInfo();
        this.props.setInitialState();
        this.setState({ filterValues: {} });
      }
    }
  }

  getReportData(query): ReportDataPromise {
    const payload: any = { ...query };

    return new Promise(async (resolve, reject) => {
      try {
        const { notUseServerSummerTable } = this.props;

        const data = await this.props.getReportData(this.props.serviceName, payload, '', { ...this.state, notUseServerSummerTable });
        const hasSummaryLevel = 'summary' in data.result.meta.levels;

        if (this.state.fetchedByMoveDownButton && !notUseServerSummerTable) {
          this.props.setSummaryTableData({
            summaryList: [this.state.selectedRow],
            summaryMeta: {...this.props.prevMeta},
            summaryTableMetaInfo: [...this.props.prevTableMetaInfo.fields],
          });
          this.setState({
            fetchedByMoveDownButton: false,
              selectedRow: null,
          });
        } else if (hasSummaryLevel && !notUseServerSummerTable) {
          const summaryQuery = {
            ...payload,
            level: data.result.meta.levels.summary.level,
          };

          await this.props.getReportData(
            this.props.serviceName,
            summaryQuery,
            'summary',
          );
        }

        if (data.result.rows.length === 0) {
          noItemsInfoNotification();
        }

        resolve(data);
      } catch (error) {
        global.NOTIFICATION_SYSTEM.notify(getServerErrorNotification(`${this.props.serviceUrl}: ${error}`));
        reject(error);
      }
    });
  }

  getTableMetaInfo() {
    try {
      this.props.getTableMetaInfo(this.props.serviceName);
    } catch (error) {
      console.error(error);
      global.NOTIFICATION_SYSTEM.notify(getServerErrorNotification(`${this.props.serviceUrl}: ${error}`));
    }
  }

  handleReportSubmit = async (headerData: object) => {
    const locationQuery = this.props.location.query;

    try {
      // Если урл пустой, то делаем запрос на основе параметров из хедера.
      if (Object.keys(locationQuery).length === 0) {
        const payload: any = { ...headerData };

        const data = await this.getReportData(payload);

        if (data.result.rows.length === 0) {
          return;
        }

        const query = {
          ...headerData,
          level: data.result.meta.levels.current.level,
        };

        /**
         * Сделано синхронно, чтобы на момент изменения просов с урлом стейт был уже обновлён.
         */
        this.setState(prevState => {
          this.props.history.pushState(null, this.props.reportUrl, query);

          return {
            fetchedBySubmitButton: true,
          };
        });

        return;
      }

      /**
       * Если урл не пустой, то берём из него только мета-информацию.
       */
      const newQuery = {
        ...headerData,
        ...pick(locationQuery, this.props.meta.levels.current.filter),
        level: this.props.meta.levels.current.level,
      };

      /**
       * Не пишем историю при одинаковых запросах.
       * Соотвественно новый запрос на сервер будет игнорирован.
       */
      if (isEqual(locationQuery, newQuery)) {
        return;
      }

      this.props.history.pushState(null, this.props.reportUrl, newQuery);
    } catch (error) {
      console.error(error);
      global.NOTIFICATION_SYSTEM.notify(getServerErrorNotification(`${this.props.serviceUrl}: ${error}`));
    }
  }

  externalFilter = (filterValues: any) => {
    this.setState({ filterValues });

    if (this.props.notUseServerSummerTable) {
      const { data: old_data } = this.props;
      const list = filterFunction(old_data.result.rows, { filterValues });

      const data = {
        ...old_data,
        result: {
          ...old_data.result,
          rows: [...list],
        },
      };

      this.props.setReportDataWithSummerData({
        data,
        props: { ...this.state },
      })
    }
  }

  handleMoveDown = (selectedRow: IDataTableSelectedRow) => {
    const moveDownIsPermitted = 'lower' in this.props.meta.levels;
    if (!moveDownIsPermitted) {
      return;
    }

    const lowerLevel = this.props.meta.levels.lower.level;
    const lowerLevelFilters = this.props.meta.levels.lower.filter;
    const lowerLevelSelectors = this.props.meta.levels.lower.filter
      .map(selector => ({[selector]: selectedRow.props.data[selector] }))
      .reduce((prev, next) => ({ ...prev, ...next }));

    const currentLevelFilters = this.props.meta.levels.current.filter;
    const headerState = this.props.location.query;

    const query = {
      ...headerState,
      level: lowerLevel,
      ...lowerLevelSelectors,
    };

    const filterDifference = difference(currentLevelFilters, lowerLevelFilters);
    const filteredQuery = omit(query, filterDifference);

    this.setState(prevState => {
      this.props.history.pushState(null, this.props.reportUrl, filteredQuery);

      return {
        fetchedByMoveDownButton: true,
        selectedRow: selectedRow.props.data,
      };
    });

  }

  handleMoveUp = () => {
    const higherLevel = this.props.meta.levels.higher.level;
    const currentLevelSelectors = this.props.meta.levels.current.filter;
    const headerState = this.props.location.query;

    const query = {
      ...headerState,
      level: higherLevel,
    };

    const filteredQuery = omit(query, currentLevelSelectors);

    this.props.history.pushState(null, this.props.reportUrl, filteredQuery);
  }

  handleReportPrint = async () => {
    this.setState({ exportFetching: true });
    await this.props.export(this.props.location.query);
    this.setState({ exportFetching: false });
  }

  makeTableSchema(schemaMakers = {}, tableMetaInfo: IReportTableMeta, forWhat) {
    const cols = tableMetaInfo.fields.reduce((tableMeta, field) => {
      const [[fieldName, { name: displayName, is_row }]] = Object.entries(field);

      if (!is_row) {
        let initialSchema: IDataTableColSchema;
        
        initialSchema = {
          name: fieldName,
          displayName,
          filter: {
            type: 'multiselect',
            options: undefined,
          },
        };
        if (forWhat === 'mainList' && this.props.data.result) {
          (initialSchema.filter as IDataTableColFilter).options = uniqBy<IReactSelectOption>(this.props.data.result.rows.map(({ [fieldName]: value }) => ({ value, label: value })), 'value');
        }
        
        const renderer = schemaMakers[fieldName] || identity;
        tableMeta.push(renderer(initialSchema, this.props));
      }

      return tableMeta;
    }, []);

    return { cols };
  }

  render() {
    const {
      enumerated = false,
      enableSort = true,
      initialSort = false,
      schemaMakers,
      tableMetaInfo,
      summaryTableMetaInfo,
    } = this.props;

    const Header: React.ComponentClass<IPropsReportHeaderCommon> = this.props.headerComponent;

    const tableMeta = this.makeTableSchema(schemaMakers, tableMetaInfo, 'mainList');
    const summaryTableMeta = this.makeTableSchema({}, { fields: summaryTableMetaInfo }, 'summaryList');

    const moveUpIsPermitted = 'higher' in this.props.meta.levels;
    const isListEmpty = this.props.list.length === 0;

    const preloader = (
      (
        this.props.reportMetaFetching ||
        this.props.reportDataFetching ||
        this.state.exportFetching
      ) &&
      <Preloader type="mainpage"/>
    );
    const moveUpButton = (
      moveUpIsPermitted &&
      <Button bsSize="small" onClick={this.handleMoveUp}>На уровень выше</Button>
    );

    const isSummaryEnable = (
      'summary' in this.props.meta.levels &&
      this.props.summaryList.length > 0
    );

    const summaryTable = (isSummaryEnable && (
      this.props.notUseServerSummerTable ?
      <DataTableNew
        title={'Итого'}
        tableMeta={summaryTableMeta}
        data={this.props.summaryList}
        enableSort={false}
        enumerated={enumerated}
        uniqName={this.state.uniqName}
        noFilter
      />
      :
      <Table
        title={'Итого'}
        tableMeta={summaryTableMeta}
        results={this.props.summaryList}
        renderers={this.props.summaryRenderes || {}}
        onRowSelected={undefined}
        enumerated={enumerated}
        enableSort={false}
        noFilter
      />
    )
    );

    /**
     * Через специальный для каждого хедера колбэк обрабатываются параметры урла,
     * которые должны быть в специальном для каждого элемента ввода формате.
     */
    const stateMaker = this.props.headerStateMaker || identity;
    const queryState = stateMaker(this.props.location.query);

    const mergedTableMetaInfo = {
      ...tableMetaInfo,
      ...this.props.meta,
    };

    const title = isEmpty(mergedTableMetaInfo.name) ?
      this.props.title
      :
      <Title
        text={mergedTableMetaInfo.name}
        hint={mergedTableMetaInfo.description}
      />;

    return (
      <div className="ets-page-wrap">
        <Header
          tableMeta={mergedTableMetaInfo}
          queryState={queryState}
          onClick={this.handleReportSubmit}
          readOnly={false}
        />
        <Table
          title={title}
          tableMeta={tableMeta}
          results={this.props.list}
          renderers={this.props.renderers || {}}
          onRowSelected={this.handleMoveDown}
          enumerated={enumerated}
          enableSort={enableSort}
          filterResetting={this.state.filterResetting}
          initialSort={initialSort || ''}
          externalFilter={this.externalFilter}
          needMyFilter={!this.props.notUseServerSummerTable}
          filterValues={this.state.filterValues}
          {...this.props.tableProps}
        >
          <Button
            bsSize="small"
            disabled={isListEmpty}
            onClick={this.handleReportPrint}
          ><Glyphicon glyph="download-alt" /></Button>
          {moveUpButton}
        </ Table>
        {summaryTable}
        {preloader}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state.reports,
});
const mapDispatchToProps = dispatch => bindActionCreators<any>(reportActionCreators, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReportContainer);
