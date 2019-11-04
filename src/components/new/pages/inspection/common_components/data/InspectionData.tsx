import * as React from 'react';
import { compose } from 'recompose';
import { InspectionDataProps, InspectionDataStateProps, InspectionDataDispatchProps, InspectionDataOwnProps } from './@types/InspectionData';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import { DivNone } from 'global-styled/global-styled';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import { registryAddInitialData, registryRemoveData, registryLoadDataByKey } from 'components/new/ui/registry/module/actions-registy';
import InspectionActionMenu from './action_menu/InspectionActionMenu';
import InspectionRegistry from '../registry/InspectRegistry';
import EtsBootstrap from 'components/new/ui/@bootstrap';

class InspectionData extends React.Component<InspectionDataProps, { isLoaded: boolean; }> {
  state = {
    isLoaded: false,
  };

  static getDerivedStateFromProps(nextProps: InspectionDataProps, prevState) {
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
          this.props.searchState,
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
            this.props.searchState,
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
  };

  render() {
    return (
      this.state.isLoaded
        ? (
          <>
            <EtsBootstrap.Col md={8}>
              <InspectionActionMenu
                loadingPage={this.props.loadingPage}
                loadRegistryData={this.loadRegistryData}
                type={this.props.type}
                triggerKey={this.props.triggerKey}
                makePayloadToCreateInspect={this.props.makePayloadToCreateInspect}
                LineDataCarsLast={this.props.LineDataCarsLast}
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={12}>
              <InspectionRegistry registryKey={this.props.loadingPage}/>
            </EtsBootstrap.Col>
          </>
        )
        : (
          <DivNone />
        )
    );
  }
}

export default compose<InspectionDataProps, InspectionDataOwnProps>(
  withSearch,
  connect<InspectionDataStateProps, InspectionDataDispatchProps, InspectionDataOwnProps, ReduxState>(
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
  ),
)(InspectionData);
