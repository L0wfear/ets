import * as React from 'react';
import { compose } from 'recompose';
import { InspectionDataProps, InspectionDataStateProps, InspectionDataDispatchProps, InspectionDataOwnProps, InspectionPayload } from './@types/InspectionData';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import { DivNone } from 'global-styled/global-styled';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import { registryAddInitialData, registryRemoveData, registryLoadDataByKey } from 'components/new/ui/registry/module/actions-registy';
import InspectionActionMenu from './action_menu/InspectionActionMenu';
import InspectionRegistry from '../registry/InspectRegistry';
import EtsBootstrap from 'components/new/ui/@bootstrap';

const INSPECTION_PAYLOAD_OBJ: {
  [key: string]: keyof Omit<InspectionPayload, 'date_start' | 'date_end'>;
} = {
  okrugId: 'okrug_id',
  companyId: 'company_id',
  pgmBaseId: 'base_id',
  carpoolId: 'base_id',
} as const;

type InspectionPayloadKeys = keyof typeof INSPECTION_PAYLOAD_OBJ;

type StateProps = {
  isLoaded: boolean; 
  keyForSearch: keyof Omit<InspectionPayload, 'date_start' | 'date_end'>;
  searchStateKey: InspectionPayloadKeys;
  currentInspectionTriggerKeyValue: number;
};
class InspectionData extends React.Component<InspectionDataProps, StateProps> {
  state = {
    isLoaded: false,
    keyForSearch: null,
    searchStateKey: null,
    currentInspectionTriggerKeyValue: null,
  };

  async componentDidMount () {
    await this.getAndSetSearchStateKey();
    const { searchStateKey, keyForSearch } = this.state;
    const { searchState, triggerKey } = this.props;

    const searchStateKeyValue = getNumberValueFromSerch(searchState[searchStateKey]);

    if (searchStateKeyValue) {
      this.props.registryAddInitialData(
        this.props.getRegistryFunc(
          {
            [keyForSearch]: searchState[searchStateKey],
            date_start: searchState.date_start,
            date_end: searchState.date_end,
          },
          searchState
        ),
      );
      if (triggerKey === searchStateKey) {
        this.setState({
          currentInspectionTriggerKeyValue: searchStateKeyValue
        });
      }
      this.loadRegistryData();
    }
  }

  async componentDidUpdate() {
    await this.getAndSetSearchStateKey();
    const { searchState, setRefresh, triggerKey } = this.props;
    const { keyForSearch, searchStateKey } = this.state;
    if (
      this.props.refresh
    ) {
      const searchStateKeyValue = getNumberValueFromSerch(searchState[searchStateKey]);
      if (searchStateKeyValue) {
        this.props.registryAddInitialData(
          this.props.getRegistryFunc(
            {
              [keyForSearch]: searchState[searchStateKey],
              date_start: searchState.date_start,
              date_end: searchState.date_end,
            },
            searchState
          ),
        );
        this.loadRegistryData();
        if (
          triggerKey === searchStateKey
          && searchStateKeyValue !== this.state.currentInspectionTriggerKeyValue
        ) {
          this.setState({
            currentInspectionTriggerKeyValue: searchStateKeyValue
          });
        } else if (this.state.currentInspectionTriggerKeyValue !== null) {
          this.setState({
            currentInspectionTriggerKeyValue: null
          });
        }
      } else {
        this.setState({
          isLoaded: false,
          currentInspectionTriggerKeyValue: null,
        });
        this.props.registryRemoveData(this.props.loadingPage);
      }
      setRefresh(false);
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

  getAndSetSearchStateKey = () => {
    const { searchState } = this.props;
    const { searchStateKey } = this.state;
    const key = (Object.keys(INSPECTION_PAYLOAD_OBJ) as Array<keyof typeof INSPECTION_PAYLOAD_OBJ>).reduce((acc: InspectionPayloadKeys, current) => {
      let result = acc; // чтобы eslint не ругался
      if (current in searchState) {
        result = current;
      }
      return result;
    });
    if (key !== searchStateKey) {
      this.setState({
        searchStateKey: key,
        keyForSearch: INSPECTION_PAYLOAD_OBJ[key],
      });
    }
  };

  render() {
    const {
      triggerKey,
      searchState,
    } = this.props;
    const {
      searchStateKey,
      currentInspectionTriggerKeyValue,
    } = this.state;
    const searchStateKeyValue = getNumberValueFromSerch(searchState[searchStateKey]);
    const showInspectionActionMenu = triggerKey === searchStateKey && currentInspectionTriggerKeyValue === searchStateKeyValue;
    return (
      this.state.isLoaded
        ? (
          <>
            {showInspectionActionMenu
              ? <EtsBootstrap.Col md={8}>
                <InspectionActionMenu
                  loadingPage={this.props.loadingPage}
                  loadRegistryData={this.loadRegistryData}
                  type={this.props.type}
                  triggerKey={this.props.triggerKey}
                  makePayloadToCreateInspect={this.props.makePayloadToCreateInspect}
                  LineDataCarsLast={this.props.LineDataCarsLast}
                />
              </EtsBootstrap.Col>
              : <DivNone />
            }
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
