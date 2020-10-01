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
import {connect} from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { getAutobaseState } from 'redux-main/reducers/selectors';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { TachographRepair } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_repair/@types';
import { getDefaultTachographRepairElement } from './utils';
import { tachographRepairFormSchema } from './schema';
import tachographRepairPermissions from '../_config-data/permissions';
import { autobaseCreateTachographRepair, autobaseUpdateTachographRepair } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_repair/actions';
import { actionGetAndSetInStoreTachographRepairReasonList } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_repair_reason_list/actions';
import { actionGetAndSetInStoreTachographList } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_registry/actions';
import { getReasonList } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_repair_reason_list/selectors';

class TachographRepairForm extends React.PureComponent<PropsTachographRepair, {}> {
  async componentDidMount() {
    this.props.dispatch(actionGetAndSetInStoreTachographRepairReasonList({}, this.props));
    await this.props.dispatch(actionGetAndSetInStoreTachographList({}, this.props));
  }

  handleChange = (key, value) => {
    const { tachographList } = this.props;

    const changeObject: any = {
      [key]: value,
    };

    if (key === 'factory_number') {
      if (!changeObject[key]) {
        changeObject.gov_number = null;
      } else {
        const chosenTachograph = tachographList.find(({ factory_number }) => factory_number === value);
        changeObject.gov_number = chosenTachograph.gov_number;
      }
    }

    this.props.handleChange(changeObject);
  };

  handleSubmit = async () => {
    const {
      formState: { factory_number, repair_reason_id, repair_date, comment},
      tachographList,
    } = this.props;

    const chosenTachograph = tachographList.find((tachograph) => tachograph.factory_number === factory_number);

    const data = {
      tachograph_id: chosenTachograph.id,
      repair_reason_id,
      repair_date,
      comment,
    };

    const result = await this.props.submitAction(data);

    if (result) {
      this.props.handleChange(result);
    }
  };

  render() {
    const {
      formState: state,
      formErrors: errors,
      page,
      path,
      tachographList,
    } = this.props;

    const isPermitted = this.props.isPermittedToUpdate;
    const IS_CREATING = !state.id;
    const BRANDS = state.factory_number
      ? tachographList.filter(({ factory_number }) => factory_number === state.factory_number).map(({ tachograph_brand_name }) => {
        return ({
          value: tachograph_brand_name,
          label: tachograph_brand_name,
        });
      })
      : tachographList.map(({ tachograph_brand_name }) => {
        return ({
          value: tachograph_brand_name,
          label: tachograph_brand_name,
        });
      }) ;
    const FACTORY_NUMBERS = state.tachograph_brand_name
      ? tachographList.filter(({ tachograph_brand_name }) => tachograph_brand_name === state.tachograph_brand_name).map(({ factory_number }) => {
        return ({
          value: factory_number,
          label: factory_number,
        });
      })
      : tachographList.map(({ factory_number }) => {
        return ({
          value: factory_number,
          label: factory_number,
        });
      });

    return (
      <EtsBootstrap.ModalContainer id="modal-tachograph-repair" show onHide={this.props.hideWithoutChanges}>
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>{!IS_CREATING ? 'Изменение записи' : 'Создание записи'}</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={6}>
              <ExtField
                type="select"
                label="Марка тахографа"
                value={state.tachograph_brand_name}
                error={errors.tachograph_brand_name}
                options={BRANDS}
                onChange={this.handleChange}
                boundKeys="tachograph_brand_name"
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={6}>
              <ExtField
                type="select"
                label="Заводской номер тахографа"
                value={state.factory_number}
                error={errors.factory_number}
                options={FACTORY_NUMBERS}
                onChange={this.handleChange}
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
                onChange={this.props.handleChange}
                boundKeys="repair_date"
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={6}>
              <ExtField
                type="select"
                label="Причина ремонта"
                value={state.repair_reason_id}
                error={errors.repair_reason_id}
                options={this.props.tachographRepairReasonList}
                clearable={false}
                onChange={this.props.handleChange}
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
                disabled
                onChange={this.props.handleChange}
                boundKeys="gov_number"
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={6}>
              <ExtField
                type="string"
                label="Комментарий"
                value={state.comment}
                onChange={this.props.handleChange}
                boundKeys="comment"
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
        </ModalBodyPreloader>
        <EtsBootstrap.ModalFooter>
          {
            isPermitted
              ? (
                <EtsBootstrap.Button disabled={!this.props.canSave} onClick={this.handleSubmit}>Сохранить</EtsBootstrap.Button>
              )
              : (
                <DivNone />
              )
          }
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  }
}

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
)(TachographRepairForm);
