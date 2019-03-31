import * as React from 'react';
import { Col } from 'react-bootstrap';
import { compose } from 'recompose';
import { InspectionPgmBaseSelectCarpoolProps, InspectionPgmBaseSelectCarpoolStateProps, InspectionPgmBaseSelectCarpoolDispatchProps, InspectionPgmBaseSelectCarpoolOwnProps } from './@types/InspectionPgmBaseSelectCarpool';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import { getInspectPgmBase } from 'redux-main/reducers/selectors';
import { SelectField, SelectLabel, InstectionBlockSelect } from 'components/new/pages/inspection/pgm_base/components/select_carpool/styled/InspectionPgmBaseSelectCarpoolStyled';
import { ExtField } from 'components/ui/new/field/ExtField';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import inspectionActions from 'redux-main/reducers/modules/inspect/inspect_actions';

const InspectionPgmBaseSelectCarpool: React.FC<InspectionPgmBaseSelectCarpoolProps> = (props) => {
  const {
    searchState,
    setDataInSearch,
  } = props;

  const companyId = getNumberValueFromSerch(searchState.companyId);
  const pgmBaseId = getNumberValueFromSerch(searchState.pgmBaseId);
  const okrugId = getNumberValueFromSerch(searchState.okrugId);

  React.useEffect(
    () => {
      props.actionGetAndSetInStoreCompany(
        {},
        { page: props.loadingPage },
      );
      props.actionGetAndSetInStorePgmBase(
        {},
        { page: props.loadingPage },
      );

      return () => {
        props.actionResetCompanyAndCarpool();
      };
    },
    [],
  );

  const PGM_OPTIONS = React.useMemo(
    () => (
      props.pgmBaseList
        .filter(({ company_id }) => {
          return companyId === company_id;
        })
        .map((rowData) => ({
          value: rowData.id,
          label: `${rowData.address} (${rowData.pgm_stores_type_name})`,
          rowData,
        }))
    ),
    [props.pgmBaseList, companyId],
  );
  const COMPANY_OPTIONS = React.useMemo(
    () => (
      props.companyList
        .filter(({ okrug_id }) => {
          return okrug_id === okrugId;
        })
        .map((rowData) => ({
          value: rowData.company_id,
          label: rowData.short_name,
          rowData,
        }))
    ),
    [props.companyList, okrugId],
  );
  const OKRUG_OPTIONS = React.useMemo(
    () => {
      const okrugList = props.companyList.reduce( (newArray, rowData) => {
        const okrugElem = {
          okrug_name: rowData.okrug_name,
          okrug_id: rowData.okrug_id,
        };
        const isNotUnique = newArray.find((elem) => elem.okrug_id === rowData.okrug_id );
        if (!isNotUnique) {
          newArray.push(okrugElem);
        }
        return newArray;
      }, []);

      return (okrugList
        .map((rowData) => ({
          value: rowData.okrug_id,
          label: rowData.okrug_name,
          rowData,
        })));
    },
    [props.companyList],
  );

  const setCompanyId = React.useCallback(
    (companyIdNew) => {
      const newPartialSearch: any = {
        companyId: companyIdNew,
      };
      delete newPartialSearch.pgmBaseId;
      // if (pgmBaseId && companyIdNew) {
      //   const contractor_id = get(props.pgmBaseList.find(({ id }) => id === pgmBaseId), 'contractor_id', null);
      //   if (!contractor_id || contractor_id !== companyIdNew) {
      //     delete newPartialSearch.pgmBaseId;
      //   }
      // }

      setDataInSearch(newPartialSearch);
    },
    [searchState],
  );

  const setOkrugId = React.useCallback( // <<< Доработать логику очистки полей при смене селекта
    (okrugIdNew) => {
      const newPartialSearch: any = {
        okrugId: okrugIdNew,
      };
      delete newPartialSearch.pgmBaseId;
      delete newPartialSearch.companyId;
      // if ((pgmBaseId || companyId) && okrugIdNew) {
      //   const contractor_id = get(props.pgmBaseList.find(({ id }) => id === pgmBaseId), 'contractor_id', null);
      //   if (!contractor_id || contractor_id !== okrugIdNew) {
      //     delete newPartialSearch.pgmBaseId;
      //   }
      // }

      setDataInSearch(newPartialSearch);
    },
    [searchState],
  );

  const setPgmBaseId = React.useCallback(
    (pgmBaseIdNew) => {
      setDataInSearch({
        pgmBaseId: pgmBaseIdNew,
      });
    },
    [searchState],
  );

  React.useEffect(
    () => {
      if (companyId && props.companyList.length) {
        if (!COMPANY_OPTIONS.find(({ value }) => value === companyId)) {
          setDataInSearch({
            companyId: null,
            pgmBaseId: null,
          });
        }
      }
    },
    [companyId, props.companyList],
  );

  React.useEffect(
    () => {
      if (pgmBaseId && props.pgmBaseList.length) {
        if (!PGM_OPTIONS.find(({ value }) => value === pgmBaseId)) {
          setDataInSearch({
            pgmBaseId: null,
          });
        }
      }
    },
    [companyId, okrugId, pgmBaseId, props.pgmBaseList],
  );

  return (
    <Col md={12}>
      <InstectionBlockSelect>
        <SelectLabel md={1} sm={1}>
            <h5>
              Округ
            </h5>
          </SelectLabel>
          <SelectField md={4} sm={6}>
            <ExtField
              type="select"
              label={false}
              value={okrugId}
              options={OKRUG_OPTIONS}
              onChange={setOkrugId}
              clearable={false}
            />
          </SelectField>
      </InstectionBlockSelect>
      <InstectionBlockSelect>
        <SelectLabel md={1} sm={1}>
            <h5>
              Организация
            </h5>
          </SelectLabel>
          <SelectField md={4} sm={6}>
            <ExtField
              type="select"
              label={false}
              value={companyId}
              options={COMPANY_OPTIONS}
              onChange={setCompanyId}
              clearable={false}
              disabled={!okrugId}
            />
          </SelectField>
      </InstectionBlockSelect>
      <InstectionBlockSelect>
        <SelectLabel md={1} sm={1}>
          <h5>
            Адрес и тип базы
          </h5>
        </SelectLabel>
        <SelectField md={4} sm={6}>
          <ExtField
            type="select"
            value={pgmBaseId}
            disabled={!okrugId}
            label={false}
            options={PGM_OPTIONS}
            onChange={setPgmBaseId}
            clearable={false}
          />
        </SelectField>
      </InstectionBlockSelect>
    </Col>
  );
};

export default compose<InspectionPgmBaseSelectCarpoolProps, InspectionPgmBaseSelectCarpoolOwnProps>(
  withSearch,
  connect<InspectionPgmBaseSelectCarpoolStateProps, InspectionPgmBaseSelectCarpoolDispatchProps, InspectionPgmBaseSelectCarpoolOwnProps, ReduxState>(
    (state) => ({
      companyList: getInspectPgmBase(state).companyList,
      carpoolList: getInspectPgmBase(state).carpoolList,
      pgmBaseList: getInspectPgmBase(state).pgmBaseList,
    }),
    (dispatch: any) => ({
      actionGetAndSetInStoreCompany: (...arg) => (
        dispatch(
          inspectionActions.actionGetAndSetInStoreCompany(...arg),
        )
      ),
      actionGetAndSetInStorePgmBase: (...arg) => (
        dispatch(
          inspectionActions.actionGetAndSetInStorePgmBase(...arg),
        )
      ),
      actionResetCompanyAndCarpool: (...arg) => (
        dispatch(
          inspectionActions.actionResetCompanyAndCarpool(...arg),
        )
      ),
    }),
  ),
)(InspectionPgmBaseSelectCarpool);
