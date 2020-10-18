import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
//import ExtField from 'components/@next/@ui/renderFields/Field';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import { DivNone } from 'global-styled/global-styled';
import { compose } from 'recompose';
import {
  OwnTachographProps,
  PropsTachograph,
  PropsTachographWithForm,
  StatePropsTachograph,
} from 'components/new/pages/nsi/autobase/pages/tachograph/form/@types/TachographForm';
import { connect } from 'react-redux';

import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { getDefaultTachographElement } from './utils';
import { tachographFormSchema } from './schema';
import tachographPermissions from '../_config-data/permissions';
//import { FileField } from 'components/old/ui/input/fields';
import { ReduxState } from 'redux-main/@types/state';
//import { getDatePlusSomeYears } from 'components/@next/@utils/dates/dates';
//import { isBoolean, isNull } from 'util';
import TachographFormBodyHeader from './body_header/TachographFormBodyHeader';
import TachographFormBodyContainer from './body_container/TachographFormBodyContainer';
import {
  actionCreateTachograph,
  actionUpdateTachograph,
} from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_registry/actions';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import {
  actionChangeTachographDataReadingList,
  actionGetTachographDataReadingList,
} from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_data_reading/actions';
import { get } from 'lodash';
import {
  TachographListOuterProps,
  TachographListWithOuterProps,
  TachographListDataForValidation,
} from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_registry/@types';
import { defaultTachograph } from './utils';
import {
  actionGetTachographReplacementSkziList,
  actionChangeTachographReplacementSkziList,
} from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_replacement_skzi/actions';
import { actionLoadTimeMoscow } from 'redux-main/reducers/modules/some_uniq/time_moscow/actions';
import { createValidDate } from 'components/@next/@utils/dates/dates';

const TachographForm: React.FC<PropsTachograph> = React.memo((props) => {
  const { formState: state, formErrors: errors, page, path } = props;

  const IS_CREATING = !state.id;
  const tachograph_id = get(state, 'id', null);
  const dispatch = etsUseDispatch();

  const isPermitted = !IS_CREATING
    ? props.isPermittedToUpdate
    : props.isPermittedToCreate;

  const onSubmit = React.useCallback(async () => {
    const data_reading = state.tachograph_data_reading;
    const replacement_skzi = state.tachograph_replacement_skzi;
    const ownState = Object.fromEntries(
      Object.entries(defaultTachograph).map(([key, value]) => [key, state[key]])
    );
    try {
      const changeTachographDataReadingListResult = await dispatch(
        actionChangeTachographDataReadingList(
          { tachograph_id, data_reading },
          { page }
        )
      );
      const changeTachographReplacementSkziListResult = await dispatch(
        actionChangeTachographReplacementSkziList(
          { tachograph_id, replacement_skzi },
          { page }
        )
      );
      if (
        changeTachographDataReadingListResult
        && changeTachographReplacementSkziListResult
      ) {
        props.submitAction(ownState, props.meta);
      }
    } catch (error) {
      //
    }
  }, [state, props.submitAction]);
  React.useEffect(() => {
    (async () => {
      const changeObj: TachographListOuterProps & TachographListDataForValidation = {
        tachograph_data_reading: [],
        tachograph_replacement_skzi: [],
        current_date: '',
      };
      const current_date = createValidDate(
        await (await dispatch(actionLoadTimeMoscow({}, { page: '' }))).date
      );
      changeObj.current_date = current_date;
      if (tachograph_id) {
        const tachograph_data_reading = await (
          await dispatch(
            actionGetTachographDataReadingList({ tachograph_id }, { page })
          )
        ).data.map((el, i) => ({
          ...el,
          customId: i + 1,
        }));
        changeObj.tachograph_data_reading = tachograph_data_reading;
        const tachograph_replacement_skzi = await (
          await dispatch(
            actionGetTachographReplacementSkziList({ tachograph_id }, { page })
          )
        ).data.map((el, i) => ({
          ...el,
          customId: i + 1,
        }));
        changeObj.tachograph_replacement_skzi = tachograph_replacement_skzi;
      }
      (Object.keys(changeObj) as Array<keyof typeof changeObj>).forEach(
        (key) => {
          props.handleChange(key, changeObj[key]);
        }
      );
    })();
  }, [tachograph_id]);

  return (
    <EtsBootstrap.ModalContainer
      id="modal-tachograph"
      show
      onHide={props.hideWithoutChanges}
      bsSize="large"
    >
      <EtsBootstrap.ModalHeader closeButton>
        <EtsBootstrap.ModalTitle>Карточка тахографа</EtsBootstrap.ModalTitle>
      </EtsBootstrap.ModalHeader>
      <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
        <TachographFormBodyHeader isPermitted={isPermitted} />
        <TachographFormBodyContainer
          isPermitted={isPermitted}
          formState={state}
          formErrors={errors}
          onChange={props.handleChange}
          onChangeBoolean={props.handleChangeBoolean}
          page={props.page}
          path={props.path}
        />
      </ModalBodyPreloader>
      <EtsBootstrap.ModalFooter>
        {isPermitted ? ( // либо обновление, либо создание
          <EtsBootstrap.Button
            id="save_tachograph"
            disabled={!props.canSave}
            onClick={onSubmit}
          >
            Сохранить
          </EtsBootstrap.Button>
        ) : (
          <DivNone />
        )}
      </EtsBootstrap.ModalFooter>
    </EtsBootstrap.ModalContainer>
  );
});

export default compose<PropsTachograph, OwnTachographProps>(
  connect<StatePropsTachograph, {}, OwnTachographProps, ReduxState>(null, {
    actionCreateTachograph,
    actionUpdateTachograph,
  }),
  withSearch,
  withForm<PropsTachographWithForm, TachographListWithOuterProps>({
    uniqField: 'id',
    createAction: actionCreateTachograph,
    updateAction: actionUpdateTachograph,
    mergeElement: (props) => {
      return getDefaultTachographElement(props.element);
    },
    schema: tachographFormSchema,
    permissions: tachographPermissions,
  })
)(TachographForm);
