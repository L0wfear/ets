import * as React from 'react';
import ExtField from 'components/@next/@ui/renderFields/Field';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { compose } from 'recompose';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { actionGetAndSetInStoreTechnicalOperationRegistry, actionResetTechnicalOperationRegistry } from 'redux-main/reducers/modules/some_uniq/technical_operation_registry/actions';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import { defaultSelectListMapper } from 'components/old/ui/input/ReactSelect/utils';
import memoizeOne from 'memoize-one';

type SelectTechnicalOperationStateProps = {
  technicalOperationRegistryList: IStateSomeUniq['technicalOperationRegistryList'];
};
type SelectTechnicalOperationDispatchProps = {
  actionGetAndSetInStoreTechnicalOperationRegistry: HandleThunkActionCreator<typeof actionGetAndSetInStoreTechnicalOperationRegistry>;
  actionResetTechnicalOperationRegistry: HandleThunkActionCreator<typeof actionResetTechnicalOperationRegistry>;
};
type SelectTechnicalOperationOwnProps = {
  registryKey: string;
};

type SelectTechnicalOperationMergeProps = (
  SelectTechnicalOperationStateProps
  & SelectTechnicalOperationDispatchProps
  & SelectTechnicalOperationOwnProps
);
type SelectTechnicalOperationProps = (
  SelectTechnicalOperationMergeProps
  & WithSearchProps
);

type SelectTechnicalOperationState = {
  lastNotNullValue: number;
};

const makeOptions = memoizeOne(
  (technicalOperationRegistryList) => (
    technicalOperationRegistryList.map(defaultSelectListMapper)
  ),
);

class SelectTechnicalOperation extends React.PureComponent<SelectTechnicalOperationProps, SelectTechnicalOperationState> {
  state = {
    lastNotNullValue: getNumberValueFromSerch(this.props.searchState.technical_operation_id),
  };

  static getDerivedStateFromProps(nextProps) {
    const value = getNumberValueFromSerch(nextProps.searchState.technical_operation_id);

    if (value) {
      return {
        lastNotNullValue: value,
      };
    }

    return null;
  }

  componentDidMount() {
    this.props.actionGetAndSetInStoreTechnicalOperationRegistry(
      {},
      { page: this.props.registryKey },
    );
  }
  componentWillUnmount() {
    this.props.actionResetTechnicalOperationRegistry();
  }
  componentDidUpdate() {
    const {
      technicalOperationRegistryList,
    } = this.props;
    const value = getNumberValueFromSerch(this.props.searchState.technical_operation_id);

    if (this.props.technicalOperationRegistryList.length && value) {
      const hasValueInArray = technicalOperationRegistryList.find(
        ({ id }) => id === value,
      );

      if (!hasValueInArray) {
        this.setTechnicalOperationId(null);
      }
    }
  }

  setTechnicalOperationId = (selectedTechnicalOperationId: number) => {
    const newPartialSearch: any = {
      technical_operation_id: selectedTechnicalOperationId,
      municipal_facility_id: null,
      route_types: null,
      func_type_id: null,
    };

    this.props.setDataInSearch(newPartialSearch);
  };

  render() {
    const options = makeOptions(this.props.technicalOperationRegistryList);
    const value = getNumberValueFromSerch(this.props.searchState.technical_operation_id);

    return (
      <ExtField
        type="select"
        label="Технологическая операция"
        value={value}
        options={options}
        onChange={this.setTechnicalOperationId}
        clearable={false}
      />
    );
  }
}

export default compose<SelectTechnicalOperationProps, SelectTechnicalOperationOwnProps>(
  withSearch,
  connect<SelectTechnicalOperationStateProps, SelectTechnicalOperationDispatchProps, SelectTechnicalOperationOwnProps, ReduxState>(
    (state) => ({
      technicalOperationRegistryList: getSomeUniqState(state).technicalOperationRegistryList,
    }),
    (dispatch: any) => ({
      actionGetAndSetInStoreTechnicalOperationRegistry: (...arg) => (
        dispatch(
          actionGetAndSetInStoreTechnicalOperationRegistry(...arg),
        )
      ),
      actionResetTechnicalOperationRegistry: (...arg) => (
        dispatch(
          actionResetTechnicalOperationRegistry(...arg),
        )
      ),
    }),
  ),
)(SelectTechnicalOperation);
