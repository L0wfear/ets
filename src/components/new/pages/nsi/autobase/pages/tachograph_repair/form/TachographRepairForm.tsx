import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import ExtField from 'components/@next/@ui/renderFields/Field';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import { DivNone } from 'global-styled/global-styled';
import { compose } from 'recompose';
import {
  OwnTachographRepairProps,
  PropsTachographRepair,
  StatePropsTachographRepair,
  PropsTachographRepairWithForm
} from 'components/new/pages/nsi/autobase/pages/tachograph_repair/form/@types/TachographRepairForm';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { getAutobaseState } from 'redux-main/reducers/selectors';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { TachographRepair } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_repair/@types';
import { getDefaultTachographRepairElement } from './utils';
import { tachographRepairFormSchema } from './schema';
import tachographRepairPermissions from '../_config-data/permissions';
import { autobaseCreateTachographRepair, autobaseUpdateTachographRepair } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_repair/actions';
import {
  actionGetAndSetInStoreTachographRepairReasonList,
  actionResetTachographRepairReasonList
} from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_repair_reason_list/actions';
import { getReasonList } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_repair_reason_list/selectors';
import withTachographOptions from '../../tachograph_periodic_verification/form/hoc/withTachographOptions';

const TachographRepairForm: React.FC<PropsTachographRepair> = React.memo(
  (props) => {
    const {
      formState: state,
      formErrors: errors,
      page,
      path,
      IS_CREATING,
      tachographBrandNameOptions: brandsOptions,
      tachographFactoryNumberOptions: factoryNumbersOptions,
      tachographBrandNameList: tachographListData,
    } = props;

    const isPermitted = props.isPermittedToUpdate;

    React.useEffect(() => {
      (async () => {
        props.dispatch(actionGetAndSetInStoreTachographRepairReasonList({}, { page }));
        return () => {
          props.dispatch(actionResetTachographRepairReasonList());
        };
      })();
    }, []);

    const handleSubmit = React.useCallback(
      async () => {
        const {
          formState: { factory_number, repair_reason_id, repair_date, comment, id },
        } = props;

        const chosenTachograph = tachographListData?.find((tachograph) => tachograph.factory_number === factory_number);

        const data = {
          id,
          tachograph_id: chosenTachograph?.id,
          repair_reason_id,
          repair_date,
          comment,
        };

        const result = await props.submitAction(data);

        if (result) {
          props.handleHide(true, result);
        }
      }, [tachographListData, state]);

    return (
      <EtsBootstrap.ModalContainer id="modal-tachograph-repair" show onHide={props.hideWithoutChanges}>
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>{!IS_CREATING ? 'Изменение записи' : 'Создание записи'}</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={6}>
              <ExtField
                type="select"
                label="Марка тахографа"
                options={brandsOptions}
                value={state.tachograph_brand_id}
                error={errors.tachograph_brand_id}
                onChange={props.handleChange}
                boundKeys="tachograph_brand_id"
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={6}>
              <ExtField
                type="select"
                label="Заводской номер тахографа"
                value={state.factory_number}
                error={errors.factory_number}
                options={factoryNumbersOptions}
                onChange={props.handleChange}
                boundKeys="factory_number"
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={6}>
              <ExtField
                id="repair_date"
                type="date"
                label="Дата проведения ремонта"
                date={state.repair_date}
                error={errors.repair_date}
                onChange={props.handleChange}
                boundKeys="repair_date"
                makeGoodFormat
                makeGoodFormatInitial
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={6}>
              <ExtField
                type="select"
                label="Причина ремонта"
                value={state.repair_reason_id}
                error={errors.repair_reason_id}
                options={props.tachographRepairReasonList}
                clearable={false}
                onChange={props.handleChange}
                boundKeys="repair_reason_id"
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={6}>
              <ExtField
                type="string"
                label="Рег. номер ТС"
                value={state.gov_number}
                error={errors.gov_number}
                disabled
                onChange={props.handleChange}
                boundKeys="gov_number"
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={6}>
              <ExtField
                type="string"
                label="Комментарий"
                value={state.comment}
                onChange={props.handleChange}
                boundKeys="comment"
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
        </ModalBodyPreloader>
        <EtsBootstrap.ModalFooter>
          {
            isPermitted
              ? (
                <EtsBootstrap.Button disabled={!props.canSave} onClick={handleSubmit}>Сохранить</EtsBootstrap.Button>
              )
              : (
                <DivNone />
              )
          }
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  }
);

export default compose<PropsTachographRepair, OwnTachographRepairProps>(
  connect<StatePropsTachographRepair, {}, OwnTachographRepairProps, ReduxState>(
    (state) => ({
      tachographRepairReasonList: getReasonList(state),
      tachographList: getAutobaseState(state).tachographList,
    }),
  ),
  withSearch,
  withForm<PropsTachographRepairWithForm, TachographRepair>({
    uniqField: 'id',
    createAction: autobaseCreateTachographRepair,
    updateAction: autobaseUpdateTachographRepair,
    mergeElement: (props) => {
      return getDefaultTachographRepairElement(props.element);
    },
    schema: tachographRepairFormSchema,
    permissions: tachographRepairPermissions,
  }),
  withTachographOptions,
)(TachographRepairForm);
