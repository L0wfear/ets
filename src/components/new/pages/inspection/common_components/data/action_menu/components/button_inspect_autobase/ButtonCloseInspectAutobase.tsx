import * as React from 'react';
import { ButtonCloseInspectAutobaseProps, ButtonCloseInspectAutobaseStateProps, ButtonCloseInspectAutobaseDispatchProps, ButtonCloseInspectAutobaseOwnProps } from './@types/ButtonCloseInspectAutobase';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { compose } from 'recompose';
import { getRegistryState } from 'redux-main/reducers/selectors';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';
import { INSPECT_AUTOBASE_TYPE_FORM } from 'components/new/pages/inspection/autobase/global_constants';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { BigPaddingButton } from '../../styled/InspectionAutobaseDataActionMenu';
import { getLastConductingInspect } from 'components/new/pages/inspection/autobase/@selectors';
import {get} from 'lodash';

const ButtonCloseInspectAutobase: React.FC<ButtonCloseInspectAutobaseProps> = (props) => {
  const { lastConductingInspect } = props;
  /**
   * was_resaved
   * была ли отредактирована проверка, приходит с бека
   * true, если проверка была сохранена пользователем, соответственно все поля заполненны корректно
   * ---
   * есть кейс, когда пользователь открывает проверку, но не заполняет поля, а просто закрывает окно, проверка создаётся с незаполненными полями ()
   * в этом случае was_resaved === false
   */
  const was_resaved = get(lastConductingInspect, 'was_resaved', false);
  const handleClickCreateInspectAutobase = React.useCallback(
    async () => {
      if (lastConductingInspect) {
        props.setParams({
          id: lastConductingInspect.id,
          type: INSPECT_AUTOBASE_TYPE_FORM.close,
        });
      }
    },
    [lastConductingInspect],
  );

  return (
    <BigPaddingButton onClick={handleClickCreateInspectAutobase} disabled={!was_resaved}>
      Завершить проверку
    </BigPaddingButton>
  );
};

export default compose<ButtonCloseInspectAutobaseProps, ButtonCloseInspectAutobaseOwnProps>(
  connect<ButtonCloseInspectAutobaseStateProps, ButtonCloseInspectAutobaseDispatchProps, ButtonCloseInspectAutobaseOwnProps, ReduxState>(
    (state, { loadingPage }) => ({
      permissions: getListData(getRegistryState(state), loadingPage).permissions.update, //  прокидывается в следующий компонент
      lastConductingInspect: getLastConductingInspect(getListData(getRegistryState(state), loadingPage)),
    }),
  ),
  withRequirePermissionsNew(),
  withSearch,
)(ButtonCloseInspectAutobase);
