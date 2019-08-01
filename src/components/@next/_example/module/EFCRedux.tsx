// snippet function_component
import * as React from 'react';
import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import { etsUseDispatch, etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { ReduxState } from 'redux-main/@types/state';

// Простые названия, если не нужен экспорт
type Props = {};

/* Пример селектора */
const selector_s = (state: ReduxState) => state.s;
/* Пример экшена */
const action = (): EtsAction<number> => (dispatch, getState) => 1;

const FunctionComponent: React.FC<Props> = React.memo(
  (props) => {
    const dispatch = etsUseDispatch();
    const stateFromState = etsUseSelector(
      (state) => selector_s(state),
    );
    const handleClick = React.useCallback(
      () => {
        dispatch(action());
      },
      [],
    );

    // если используется etsUseSelector, то оборачиваем в React.useMemo
    return React.useMemo(
      () => (
        <div onClick={handleClick}>{JSON.stringify(stateFromState)}</div>
      ),
      [
        stateFromState,
        handleClick,
      ],
    );
  },
);

export default FunctionComponent;
