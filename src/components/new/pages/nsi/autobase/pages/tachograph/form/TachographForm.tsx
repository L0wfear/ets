import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
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
import { ReduxState } from 'redux-main/@types/state';
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
import { actionGetAndSetInStoreTachographReplacementSkziReasonList } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_replacement_skzi_reason/actions';

const TachographForm: React.FC<PropsTachograph> = React.memo((props) => {
  const { formState: state, formErrors: errors, page, path } = props;

  const IS_CREATING = !state.id;
  const tachograph_id = get(state, 'id', null);
  const dispatch = etsUseDispatch();

  const isPermitted = !IS_CREATING
    ? props.isPermittedToUpdate
    : props.isPermittedToCreate;

  const onSubmit = React.useCallback(async () => {
    const dateRegExp = /\d{4}\-\d{2}\-\d{2}T\d{2}:\d{2}:\d{2}/;

    const data_reading = state.tachograph_data_reading.map((el) => ({
      ...el,
      reading_fact_date: createValidDate(el.reading_fact_date),
      reading_plan_date: createValidDate(el.reading_plan_date),
    }));
    const replacement_skzi = state.tachograph_replacement_skzi.map((el) => ({
      ...el,
      replacement_date: createValidDate(el.replacement_date),
      next_replacement_date: createValidDate(el.next_replacement_date),
    }));

    const ownState = Object.fromEntries(
      Object.entries(defaultTachograph).map(([key, value]) => {
        if (key === 'company_structure_id') {
          return [key, Number(state[key])];
        }
        if (key === 'tachograph_on_car') {
          const newArr = state[key].map((el) => {
            Object.keys(el).forEach((elKey) => {
              if (dateRegExp.test(el[elKey])) {
                el[elKey] = createValidDate(el[elKey]);
              }
            });
            return el;
          });
          return [key, newArr];
        }
        if (dateRegExp.test(state[key])) {
          return [key, createValidDate(state[key])];
        } else {
          return [key, state[key]];
        }
      })
    );
    if(tachograph_id) {
      dispatch(
        actionChangeTachographDataReadingList(
          { tachograph_id, data_reading },
          { page }
        )
      );
      dispatch(
        actionChangeTachographReplacementSkziList(
          { tachograph_id, replacement_skzi },
          { page }
        )
      );
    } 
    const response = await props.submitAction(ownState, props.meta);
    if (response) {
      props.handleHide(true, response);
    }
  }, [state, props.submitAction, tachograph_id]);
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

  React.useEffect(() => {
    dispatch(actionGetAndSetInStoreTachographReplacementSkziReasonList({page}));
  }, []);

  return (
    <EtsBootstrap.ModalContainer
      id="modal-tachograph"
      show
      onHide={props.hideWithoutChanges}
      bsSize="large"
    >
      <EtsBootstrap.ModalHeader closeButton>
        <EtsBootstrap.ModalTitle> {`${IS_CREATING ? 'Создание карточки тахографа' : 'Карточка тахографа'}`} </EtsBootstrap.ModalTitle>
      </EtsBootstrap.ModalHeader>
      <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
        <TachographFormBodyHeader isPermitted={isPermitted} isCreating={IS_CREATING} errors={errors}/>
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
