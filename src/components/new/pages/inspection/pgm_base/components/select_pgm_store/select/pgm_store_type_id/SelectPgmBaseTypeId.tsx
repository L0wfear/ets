import * as React from 'react';
import { get } from 'lodash';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import { SelectLabel, InstectionBlockSelect } from 'components/new/pages/inspection/autobase/components/select_carpool/styled/InspectionAutobaseSelectCarpoolStyled';
import { SelectField } from '../../styled/InspectionPgmBaseSelectCarpoolStyled';
import ExtField from 'components/@next/@ui/renderFields/Field';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';

import { ReduxState } from 'redux-main/@types/state';
import { getInspectPgmBase } from 'redux-main/reducers/selectors';
import { IStateInspectPgmBase } from 'redux-main/reducers/modules/inspect/pgm_base/@types/inspect_pgm_base';

type SelectPgmBaseTypeIdStateProps = {
  pgmBaseList: IStateInspectPgmBase['pgmBaseList'];
};
type SelectPgmBaseTypeIdDispatchProps = {};
type SelectPgmBaseTypeIdOwnProps = {};

type SelectPgmBaseTypeIdMergeProps = (
  SelectPgmBaseTypeIdStateProps
  & SelectPgmBaseTypeIdDispatchProps
  & SelectPgmBaseTypeIdOwnProps
);
type SelectPgmBaseTypeIdProps = (
  SelectPgmBaseTypeIdMergeProps
  & WithSearchProps
);

const SelectPgmBaseTypeId: React.FC<SelectPgmBaseTypeIdProps> = (props) => {
  const {
    searchState,
  } = props;

  const pgmBaseId = getNumberValueFromSerch(searchState.pgmBaseId);

  const pgm_stores_type_name = React.useMemo(
    () => {
      const current_base = props.pgmBaseList.find(({ id }) => id === pgmBaseId);

      return get(current_base, 'pgm_stores_type_name');
    },
    [pgmBaseId, props.match.params, props.setDataInSearch, props.searchState],
  );

  return (
    <InstectionBlockSelect>
      <SelectLabel md={3} sm={1}>
        <h5>
          Тип базы
        </h5>
      </SelectLabel>
      <SelectField md={9} sm={6}>
        <ExtField
          type="string"
          value={pgm_stores_type_name}
          disabled
          label={false}
        />
      </SelectField>
    </InstectionBlockSelect>
  );
};

export default compose<SelectPgmBaseTypeIdProps, SelectPgmBaseTypeIdOwnProps>(
  withSearch,
  connect<SelectPgmBaseTypeIdStateProps, SelectPgmBaseTypeIdDispatchProps, SelectPgmBaseTypeIdOwnProps, ReduxState>(
    (state) => ({
      pgmBaseList: getInspectPgmBase(state).pgmBaseList,
    }),
  ),
)(SelectPgmBaseTypeId);
