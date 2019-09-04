import * as React from 'react';
import * as ClickOutHandler from 'react-onclickout';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import ColumnsPopup from './column_popup/ColumnsPopup';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { getRegistryState } from 'redux-main/reducers/selectors';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { CommonTypesForButton } from 'components/new/ui/registry/components/data/header/buttons/component-button/@types/common';

type Props = CommonTypesForButton & {};

const ButtonColumnsControl: React.FC<Props> = React.memo(
  (props) => {
    const [showConfigPopup, setShowConfigPopup] = React.useState(false);
    const hasHiddenField = etsUseSelector((state) => getListData(getRegistryState(state), props.registryKey).meta.fields.some(({ hidden }) => hidden));

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

    return React.useMemo(
      () => (
        <ClickOutHandler onClickOut={closePopup}>
          <EtsBootstrap.Button bsSize="small" active={showConfigPopup || hasHiddenField} onClick={toggleShowPopup}>
            <EtsBootstrap.Glyphicon glyph="cog" />
          </EtsBootstrap.Button>
          {
            showConfigPopup
              && (
                <ColumnsPopup registryKey={props.registryKey} />
              )
          }
        </ClickOutHandler>
      ),
      [
        closePopup,
        showConfigPopup,
        hasHiddenField,
        hasHiddenField,
      ],
    );
  },
);

export default ButtonColumnsControl;
