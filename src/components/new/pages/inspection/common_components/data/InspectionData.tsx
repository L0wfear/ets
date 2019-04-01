import * as React from 'react';
import { compose } from 'recompose';
import { InspectionAutobaseDataProps, InspectionAutobaseDataStateProps, InspectionAutobaseDataDispatchProps, InspectionAutobaseDataOwnProps } from './@types/InspectionAutobaseData';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import { DivNone } from 'global-styled/global-styled';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import { registryAddInitialData, registryRemoveData, registryLoadDataByKey } from 'components/new/ui/registry/module/actions-registy';
import InspectionActionMenu from '../action_menu/InspectionActionMenu';
import InspectionRegistry from '../registry/InspectRegistry';

class InspectionAutobaseData extends React.Component<InspectionAutobaseDataProps, { isLoaded: boolean }> {
  state = {
    isLoaded: false,
  };

  static getDerivedStateFromProps(nextProps: InspectionAutobaseDataProps, prevState) {
    const { triggerKey } = nextProps;
    const triggerKeyValue = getNumberValueFromSerch(nextProps.searchState[triggerKey]);
    if (!triggerKeyValue) {
      return {
        isLoaded: false,
      };
    }

    return null;
  }

  componentDidMount() {
    const { triggerKey } = this.props;

    const triggerKeyValue = getNumberValueFromSerch(this.props.searchState[triggerKey]);

    if (triggerKeyValue) {
      this.props.registryAddInitialData(
        this.props.getRegistryFunc(
          triggerKeyValue,
        ),
      );
      this.loadRegistryData();
    }
  }

  componentDidUpdate(prevProps) {
    const { triggerKey } = this.props;

    const triggerKeyValue = getNumberValueFromSerch(this.props.searchState[triggerKey]);
    const triggerKeyValueOld = getNumberValueFromSerch(prevProps.searchState[triggerKey]);
    if (triggerKeyValue !== triggerKeyValueOld) {
      if (triggerKeyValue) {
        this.props.registryAddInitialData(
          this.props.getRegistryFunc(
            triggerKeyValue,
          ),
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
            <InspectionActionMenu loadingPage={this.props.loadingPage} loadRegistryData={this.loadRegistryData} />
            <InspectionRegistry registryKey={this.props.loadingPage}/>
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
