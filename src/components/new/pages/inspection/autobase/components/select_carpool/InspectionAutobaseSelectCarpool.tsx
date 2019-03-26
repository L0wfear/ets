import * as React from 'react';
import { Col } from 'react-bootstrap';
import { compose } from 'recompose';
import { InspectionAutobaseSelectCarpoolProps, InspectionAutobaseSelectCarpoolStateProps, InspectionAutobaseSelectCarpoolDispatchProps, InspectionAutobaseSelectCarpoolOwnProps } from './@types/InspectionAutobaseSelectCarpool';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import { getInspectAutobase } from 'redux-main/reducers/selectors';
import { SelectField, SelectLabel, InstectionBlockSelect } from 'components/new/pages/inspection/autobase/components/select_carpool/styled/InspectionAutobaseSelectCarpoolStyled';
import { ExtField } from 'components/ui/new/field/ExtField';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
import { get } from 'lodash';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import inspectionActions from 'redux-main/reducers/modules/inspect/inspect_actions';

const InspectionAutobaseSelectCarpool: React.FC<InspectionAutobaseSelectCarpoolProps> = (props) => {
  const {
    searchState,
    setDataInSearch,
  } = props;

  const companyId = getNumberValueFromSerch(searchState.companyId);
  const carpoolId = getNumberValueFromSerch(searchState.carpoolId);

  React.useEffect(
    () => {
      props.actionGetAndSetInStoreCompany(
        {},
        { page: props.loadingPage },
      );
      props.actionGetAndSetInStoreCarpool(
        {},
        { page: props.loadingPage },
      );

      return () => {
        props.actionResetCompanyAndCarpool();
      };
    },
    [],
  );

  const CARPOOL_OPTIONS = React.useMemo(
    () => (
      props.carpoolList
        .filter(({ contractor_id }) => {
          return companyId === contractor_id;
        })
        .map(defaultSelectListMapper)
    ),
    [props.carpoolList, companyId],
  );
  const COMPANY_OPTIONS = React.useMemo(
    () => (
      props.companyList
        .map((rowData) => ({
          value: rowData.company_id,
          label: rowData.short_name,
          rowData,
        }))
    ),
    [props.companyList],
  );

  const setCompanyId = React.useCallback(
    (companyIdNew) => {
      const newPartialSearch: any = {
        companyId: companyIdNew,
      };
      if (carpoolId && companyIdNew) {
        const contractor_id = get(props.carpoolList.find(({ id }) => id === carpoolId), 'contractor_id', null);
        if (!contractor_id || contractor_id !== companyIdNew) {
          delete newPartialSearch.carpoolId;
        }
      }

      setDataInSearch(newPartialSearch);
    },
    [searchState],
  );

  const setCarpoolId = React.useCallback(
    (carpoolIdNew) => {
      setDataInSearch({
        carpoolId: carpoolIdNew,
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
            carpoolId: null,
          });
        }
      }
    },
    [companyId, props.companyList],
  );

  React.useEffect(
    () => {
      if (carpoolId && props.carpoolList.length) {
        if (!CARPOOL_OPTIONS.find(({ value }) => value === carpoolId)) {
          setDataInSearch({
            carpoolId: null,
          });
        }
      }
    },
    [companyId, carpoolId, props.carpoolList],
  );

  return (
    <Col md={12}>
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
            />
          </SelectField>
      </InstectionBlockSelect>
      <InstectionBlockSelect>
        <SelectLabel md={1} sm={1}>
          <h5>
            Автобаза
          </h5>
        </SelectLabel>
        <SelectField md={4} sm={6}>
          <ExtField
            type="select"
            value={carpoolId}
            disabled={!companyId}
            label={false}
            options={CARPOOL_OPTIONS}
            onChange={setCarpoolId}
            clearable={false}
          />
        </SelectField>
      </InstectionBlockSelect>
    </Col>
  );
};

export default compose<InspectionAutobaseSelectCarpoolProps, InspectionAutobaseSelectCarpoolOwnProps>(
  withSearch,
  connect<InspectionAutobaseSelectCarpoolStateProps, InspectionAutobaseSelectCarpoolDispatchProps, InspectionAutobaseSelectCarpoolOwnProps, ReduxState>(
    (state) => ({
      companyList: getInspectAutobase(state).companyList,
      carpoolList: getInspectAutobase(state).carpoolList,
    }),
    (dispatch: any) => ({
      actionGetAndSetInStoreCompany: (...arg) => (
        dispatch(
          inspectionActions.actionGetAndSetInStoreCompany(...arg),
        )
      ),
      actionGetAndSetInStoreCarpool: (...arg) => (
        dispatch(
          inspectionActions.actionGetAndSetInStoreCarpool(...arg),
        )
      ),
      actionResetCompanyAndCarpool: (...arg) => (
        dispatch(
          inspectionActions.actionResetCompanyAndCarpool(...arg),
        )
      ),
    }),
  ),
)(InspectionAutobaseSelectCarpool);
