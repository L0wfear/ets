import * as React from 'react';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { compose } from 'recompose';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { getSomeUniqState } from 'redux-main/reducers/selectors';

import SelectRouteType from './SelectRouteType';
import { Norm } from 'redux-main/reducers/modules/some_uniq/norm_registry/@types';
import SelectFuncType from './SelectFuncType';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { actionGetNormsByParams } from 'redux-main/reducers/modules/some_uniq/norm_registry/actions';

type SelectRouteTypeAndFuncTypeStateProps = {
  municipalFacilityList: IStateSomeUniq['municipalFacilityList'];
};
type SelectRouteTypeAndFuncTypeDispatchProps = {
  actionGetNormsByParams: HandleThunkActionCreator<typeof actionGetNormsByParams>;
};
type SelectRouteTypeAndFuncTypeOwnProps = {
  registryKey: string;
};

type SelectRouteTypeAndFuncTypeMergeProps = (
  SelectRouteTypeAndFuncTypeStateProps
  & SelectRouteTypeAndFuncTypeDispatchProps
  & SelectRouteTypeAndFuncTypeOwnProps
);
type SelectRouteTypeAndFuncTypeProps = (
  SelectRouteTypeAndFuncTypeMergeProps
  & WithSearchProps
);

type SelectRouteTypeAndFuncTypeState = {
  normList: Array<Norm>;
};

class SelectRouteTypeAndFuncType extends React.PureComponent<SelectRouteTypeAndFuncTypeProps, SelectRouteTypeAndFuncTypeState> {
  state = {
    normList: [],
  };

  componentDidMount() {
    //
  }

  componentDidUpdate(prevProps: SelectRouteTypeAndFuncTypeProps) {
    const {
      municipalFacilityList,
    } = this.props;
    const municipal_facility_id = getNumberValueFromSerch(this.props.searchState.municipal_facility_id);
    const municipal_facility_id_prev = getNumberValueFromSerch(prevProps.searchState.municipal_facility_id);

    const triggerOnLoadMunicipalFacility = (
      (
        municipal_facility_id !== municipal_facility_id_prev
        && municipalFacilityList.length
      )
      || (
        municipal_facility_id
        && (
          municipalFacilityList.length
          && !prevProps.municipalFacilityList.length
        )
      )
    );

    if (triggerOnLoadMunicipalFacility) {
      const toData = municipalFacilityList.find((rowData) => rowData.municipal_facility_id === municipal_facility_id);
      if (toData) {
        this.props.actionGetNormsByParams(
          {
            start_date: new Date(),
            end_date: new Date(),
            norm_ids: toData.normatives.map(({ id }) => id).toString(),
          },
          {
            page: this.props.registryKey,
          },
        ).then(
          (normList) => {
            this.setState({
              normList,
            });
          },
        );
      }
    }
  }

  render() {
    return (
      <EtsBootstrap.Row>
        <EtsBootstrap.Col md={6}>
          <SelectRouteType
            registryKey={this.props.registryKey}
            normList={this.state.normList}
          />
        </EtsBootstrap.Col>
        <EtsBootstrap.Col md={6}>
          <SelectFuncType
            registryKey={this.props.registryKey}
            normList={this.state.normList}
          />
        </EtsBootstrap.Col>
      </EtsBootstrap.Row>
    );
  }
}

export default compose<SelectRouteTypeAndFuncTypeProps, SelectRouteTypeAndFuncTypeOwnProps>(
  withSearch,
  connect<SelectRouteTypeAndFuncTypeStateProps, SelectRouteTypeAndFuncTypeDispatchProps, SelectRouteTypeAndFuncTypeOwnProps, ReduxState>(
    (state) => ({
      municipalFacilityList: getSomeUniqState(state).municipalFacilityList,
    }),
    (dispatch: any) => ({
      actionGetNormsByParams: (...arg) => (
        dispatch(
          actionGetNormsByParams(...arg),
        )
      ),
    }),
  ),
)(SelectRouteTypeAndFuncType);
