import * as React from 'react';
import { connect, HandleThunkActionCreator } from 'react-redux';
import * as Button from 'react-bootstrap/lib/Button';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';
import * as ClickOutHandler from 'react-onclickout';
import { ReduxState } from 'redux-main/@types/state';
import ColumnsPopup from './column_popup/ColumnsPopup';
import { actionChangeRegistryMetaFields } from 'components/new/ui/registry/module/actions-registy';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { getRegistryState } from 'redux-main/reducers/selectors';

type ButtonColumnsControlStateProps = {
  hasHiddenField: boolean;
};
type ButtonColumnsControlDispatchProps = {
  actionChangeRegistryMetaFields: HandleThunkActionCreator<typeof actionChangeRegistryMetaFields>;
};
type ButtonColumnsControlOwnProps = {
  registryKey: string;
};
type ButtonColumnsControlMergedProps = (
  ButtonColumnsControlStateProps
  & ButtonColumnsControlDispatchProps
  & ButtonColumnsControlOwnProps
);
type ButtonColumnsControlProps = ButtonColumnsControlMergedProps;

const ButtonColumnsControl: React.FC<ButtonColumnsControlProps> = (props) => {
  const [showConfigPopup, setShowConfigPopup] = React.useState(false);

  const toggleShowPopup = React.useCallback(
    () => {
      setShowConfigPopup(!showConfigPopup);
    },
    [showConfigPopup],
  );
  const closePopup = React.useCallback(
    () => {
      setShowConfigPopup(false);
    },
    [],
  );

  return (
    <ClickOutHandler onClickOut={closePopup}>
      <Button bsSize="small" active={showConfigPopup || props.hasHiddenField} onClick={toggleShowPopup}>
        <Glyphicon glyph="cog" />
      </Button>
      {
        showConfigPopup
          && (
            <ColumnsPopup registryKey={props.registryKey} />
          )
      }
    </ClickOutHandler>
  );
};

export default connect<ButtonColumnsControlStateProps, ButtonColumnsControlDispatchProps, ButtonColumnsControlOwnProps, ReduxState>(
  (state, { registryKey }) => ({
    hasHiddenField: getListData(getRegistryState(state), registryKey).meta.fields.some(({ hidden }) => hidden),
  }),
)(ButtonColumnsControl);
