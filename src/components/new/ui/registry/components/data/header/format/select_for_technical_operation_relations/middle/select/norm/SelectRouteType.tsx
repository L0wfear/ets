import * as React from 'react';
import { uniqBy } from 'lodash';
import memoizeOne from 'memoize-one';

import { ExtField } from 'components/old/ui/new/field/ExtField';
import { getNumberValueFromSerch, getStringArrValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';

import { Norm } from 'redux-main/reducers/modules/norm_registry/@types';
import { routeTypesByKey } from 'constants/route';

type OwnProps = {
  registryKey: string;
  normList: Norm[];
};

type Props = (
  OwnProps
  & WithSearchProps
);

type State = {
  options: any[];
};

const makeOptions = memoizeOne(
  (normList: Norm[], hasSelectedTo) => (
    hasSelectedTo
      ? (
        uniqBy(
          normList.reduce(
            (newArr, rowData) => {
              rowData.route_types.forEach((itemRowData) => {
                newArr.push({
                  value: itemRowData,
                  label: routeTypesByKey[itemRowData].title,
                  rowData,
                  itemRowData,
                });
              });

              return newArr;
            },
            [],
          ),
          'value',
        )
      )
      : []
  ),
);

class SelectRouteType extends React.PureComponent<Props, State> {
  state = {
    options: makeOptions(
      this.props.normList,
      Boolean(getNumberValueFromSerch(this.props.searchState.municipal_facility_id)),
    ),
  };
  static getDerivedStateFromProps(nextProps: Props) {
    const municipal_facility_id = getNumberValueFromSerch(nextProps.searchState.municipal_facility_id);
    const options = makeOptions(nextProps.normList, Boolean(municipal_facility_id));

    return {
      options,
    };
  }

  componentDidMount() {
    const municipal_facility_id = getNumberValueFromSerch(this.props.searchState.municipal_facility_id);
    const value = getStringArrValueFromSerch(this.props.searchState.route_types);

    if (value && !municipal_facility_id) {
      this.setRouteTypes(null);
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const {
      options,
    } = this.state;
    const value = getNumberValueFromSerch(this.props.searchState.municipal_facility_id);

    const triggerOnLoadMunicipalFacility = (
      options !== prevState.options
    );

    if (triggerOnLoadMunicipalFacility) {
      if (value) {
        const hasValueInArray = options.find(
          (optionRowData) => optionRowData.value === value,
        );

        if (hasValueInArray) {
          return;
        }
      }

      if (options.length === 1) {
        this.setRouteTypes(
          options.length === 1
            ? options[0].value
            : null,
        );
      }
    }
  }

  setRouteTypes = (selecteRouteTypes: number) => {
    const newPartialSearch: any = {
      route_types: selecteRouteTypes,
    };

    this.props.setDataInSearch(newPartialSearch);
  }

  render() {
    const municipal_facility_id = getNumberValueFromSerch(this.props.searchState.municipal_facility_id);
    const value = getStringArrValueFromSerch(this.props.searchState.route_types);

    const options = makeOptions(this.props.normList, Boolean(municipal_facility_id));

    return (
      <ExtField
        type="select"
        label="Тип объекта"
        value={value}
        options={options}
        multi
        clearable={false}
        onChange={this.setRouteTypes}
      />
    );
  }
}

export default withSearch<OwnProps>(SelectRouteType);
