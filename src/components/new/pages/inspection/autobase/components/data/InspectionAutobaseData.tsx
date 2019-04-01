import * as React from 'react';
import { compose } from 'recompose';
import { InspectionAutobaseDataProps, InspectionAutobaseDataStateProps, InspectionAutobaseDataDispatchProps, InspectionAutobaseDataOwnProps } from './@types/InspectionAutobaseData';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import { DivNone } from 'global-styled/global-styled';
import InspectionAutobaseDataActionMenu from './components/action_menu/InspectionAutobaseDataActionMenu';
import InspectionAutobaseDataRegistry from './components/registry/InspectionAutobaseDataRegistry';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import { getInspectionAutobaseDataRegistryConfig } from './components/registry/config';
import { registryAddInitialData, registryRemoveData, registryLoadDataByKey } from 'components/new/ui/registry/module/actions-registy';

class InspectionAutobaseData extends React.Component<InspectionAutobaseDataProps, { isLoaded: boolean }> {
  state = {
    isLoaded: false,
  };

  static getDerivedStateFromProps(nextProps: InspectionAutobaseDataProps, prevState) {
    const carpoolId = getNumberValueFromSerch(nextProps.searchState.carpoolId);
    if (!carpoolId) {
      return {
        isLoaded: false,
      };
    }

    return null;
  }

  componentDidMount() {
    const carpoolId = getNumberValueFromSerch(this.props.searchState.carpoolId);

    if (carpoolId) {
      this.props.registryAddInitialData(
        getInspectionAutobaseDataRegistryConfig(carpoolId),
      );
      this.loadRegistryData();
    }
  }

  componentDidUpdate(prevProps) {
    const carpoolId = getNumberValueFromSerch(this.props.searchState.carpoolId);
    const carpoolIdOld = getNumberValueFromSerch(prevProps.searchState.carpoolId);
    if (carpoolId !== carpoolIdOld) {
      if (carpoolId) {
        this.props.registryAddInitialData(
          getInspectionAutobaseDataRegistryConfig(carpoolId),
        );
        this.loadRegistryData();
      } else {
        this.setState({
          isLoaded: false,
        });
        this.props.registryRemoveData(this.props.loadingPage);
      }
    }
  }
  loadRegistryData = async () => {
    if (this.state.isLoaded) {
      this.setState({ isLoaded: false });
    }

    try {
      await this.props.registryLoadDataByKey(this.props.loadingPage);
    } catch (error) {
      //
    }
    this.setState({ isLoaded: true });
  }

  render() {
    return (
      this.state.isLoaded
        ? (
          <>
            <InspectionAutobaseDataActionMenu loadingPage={this.props.loadingPage} loadRegistryData={this.loadRegistryData} />
            <InspectionAutobaseDataRegistry registryKey={this.props.loadingPage}/>
          </>
        )
        : (
          <DivNone />
        )
    );
  }
}

export default compose<InspectionAutobaseDataProps, InspectionAutobaseDataOwnProps>(
  connect<InspectionAutobaseDataStateProps, InspectionAutobaseDataDispatchProps, InspectionAutobaseDataOwnProps, any, ReduxState>(
    null,
    (dispatch: any) => ({
      registryAddInitialData: (config) => (
        dispatch(
          registryAddInitialData(config),
        )
      ),
      registryRemoveData: (registryKeyTemp: string) => (
        dispatch(
          registryRemoveData(registryKeyTemp),
        )
      ),
      registryLoadDataByKey: (registryKeyTemp: string) => (
        dispatch(
          registryLoadDataByKey(registryKeyTemp),
        )
      ),
    }),
    null,
    {
      pure: false,
    },
  ),
  withSearch,
)(InspectionAutobaseData);
