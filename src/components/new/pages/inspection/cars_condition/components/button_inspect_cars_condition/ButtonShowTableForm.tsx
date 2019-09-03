import * as React from 'react';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import { compose } from 'recompose';
import { getRegistryState } from 'redux-main/reducers/selectors';
import withRequirePermissionsNew from 'components/old/util/RequirePermissionsNewRedux';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { getLastConductingInspect } from 'components/new/pages/inspection/autobase/@selectors';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { ButtonShowTableFormProps, ButtonShowTableFormStateProps, ButtonShowTableFormDispatchProps, ButtonShowTableFormOwnProps } from 'components/new/pages/inspection/cars_condition/components/button_inspect_cars_condition/@types';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';

const ButtonShowTableForm: React.FC<ButtonShowTableFormProps> = (props) => {

  const handleClickShowTableForm = React.useCallback(
    async () => {
      const inspectId = getNumberValueFromSerch(props.match.params.id);
      if (inspectId) {
        props.setDataInSearch({
          showFormType: 'showTableForm',
          inspectId,
        });
      }
    },
    [props.match.params, props.match.url, props.location.search, props.setParams],
  );

  return props.isPermitted && (
    <EtsBootstrap.Button onClick={handleClickShowTableForm}>
      <EtsBootstrap.Glyphicon glyph="list-alt"/>
      Открыть форму заполнения
    </EtsBootstrap.Button>
  );
};

export default compose<ButtonShowTableFormProps, ButtonShowTableFormOwnProps>(
  connect<ButtonShowTableFormStateProps, ButtonShowTableFormDispatchProps, ButtonShowTableFormOwnProps, ReduxState>(
    (state, { loadingPage }) => ({
      permissions: getListData(getRegistryState(state), loadingPage).permissions.update, //  прокидывается в следующий компонент
      lastConductingInspect: getLastConductingInspect(getListData(getRegistryState(state), loadingPage)),
    }),
  ),
  withRequirePermissionsNew({
    withIsPermittedProps: true,
  }),
  withSearch,
)(ButtonShowTableForm);
