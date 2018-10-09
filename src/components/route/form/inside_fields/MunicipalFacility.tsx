import * as React from 'react';

import { ExtField } from 'components/ui/new/field/ExtField';

type GetMunicipalFacilityFuncProps = {
  start_date: any,
  end_date: any,
  for: 'mission' | 'duty-mission',
  kind_task_ids?: number[],
};

type MunicipalFacilityNormative = {};

type MunicipalFacilityType = {
  municipal_facility_id: number;
  municipal_facility_name: string;
  normatives: MunicipalFacilityNormative[];
  car_func_types: {
    id: number;
  }[];
};

type TechnicalOperationsType = {
  id: number;
  is_new: boolean;
  normatives: {
    id: number;
  }[];
};

type GetMunicipalFacilityFuncAns = {
  municipal_facility_list: MunicipalFacilityType[];
};

type GetMunicipalFacilityFunc = (props: GetMunicipalFacilityFuncProps) => Promise<GetMunicipalFacilityFuncAns>;


type PropsMunicipalFacilityField = {
  error: string | void;
  disabled?: boolean;
  value: null, number;
  name?: string;
  clearable?: boolean;
  modalKey?: string;
  technical_operation_id: number | void;
  getCleaningMunicipalFacilityList: GetMunicipalFacilityFunc,
  technicalOperationsList: TechnicalOperationsType[];

  handleChange: (name: string, value: number | null) => any;
  getDataBySelectedMunicipalFacility: (mfData: MunicipalFacilityType) => any;
};

type StateMunicipalFacilityField = {
  MUNICIPAL_FACILITY_OPTIONS: {
    value: number;
    label: string;
    mfData: MunicipalFacilityType;
  }[];
  myDisable: boolean;
};

class MunicipalFacilityField extends React.PureComponent<PropsMunicipalFacilityField, StateMunicipalFacilityField> {
  constructor(props) {
    super(props);

    const MUNICIPAL_FACILITY_OPTIONS = [];
    const {
      value,
      name,
    } = props;

    if (value && name) {
      MUNICIPAL_FACILITY_OPTIONS.push({
        value, label: name,
      });
    }

    this.state = {
      MUNICIPAL_FACILITY_OPTIONS,
      myDisable: false,
    }
  }

  componentDidUpdate(prevProps) {
    const { props } = this;
    const {
      technical_operation_id,
      technicalOperationsList,
    } = props;

    const triggerOnUpdate = (
      technicalOperationsList.length
      && technical_operation_id
      && (
        technical_operation_id !== prevProps.technical_operation_id  // или изменилась ТО на форме
        || !prevProps.technicalOperationsList.length && technical_operation_id // или в предыдущих пропсах не было данных по ТО
      )
    );

    if (triggerOnUpdate) {
      const toData = technicalOperationsList.find(({ id }) => id === technical_operation_id);
      if (toData) {
        const {
          is_new,
          normatives,
        } = toData;

        if (is_new) {
          const outerPayload = {
            start_date: new Date(),
            end_date: new Date(),
            norm_ids: normatives.map(({ id }) => id).join(','),
          }

          this.loadMunicipalFacility(outerPayload);
        } else {
          console.log('старая то без элемента');
        }

      } else {
        throw 'Не найдена ТО';
      }
    }
  }

  loadMunicipalFacility(outerPayload) {
    this.props.getCleaningMunicipalFacilityList(outerPayload)
      .then(({ municipal_facility_list }) => {
        const { value } = this.props;

        const MUNICIPAL_FACILITY_OPTIONS = municipal_facility_list.map((mfData) => ({
          value: mfData.municipal_facility_id,
          label: mfData.municipal_facility_name,
          mfData,
        }));

        if (value) {
          const mfOption = MUNICIPAL_FACILITY_OPTIONS.find((mfOption) => mfOption.value === value);
          if (mfOption) {
            this.props.getDataBySelectedMunicipalFacility(
              mfOption.mfData,
            );
          }
        }


        this.setState({ MUNICIPAL_FACILITY_OPTIONS });
      });
  }

  handleChange = (value, option) => {
    if (value !== this.props.value) {
      this.props.handleChange(
        'municipal_facility_id',
        value,
      );

      this.props.getDataBySelectedMunicipalFacility(option.mfData);
    }
  }

  render() {
    const {
      error,
      disabled,
      value,
      clearable,
      modalKey,
    } = this.props;

    return (
      <ExtField
        id="municipal_facility_id"
        modalKey={modalKey}
        type="select"
        label="Элемент"
        error={error}
        disabled={disabled}
        options={this.state.MUNICIPAL_FACILITY_OPTIONS}
        value={value}
        onChange={this.handleChange}
        clearable={clearable}
      />
    )
  }
}

export default MunicipalFacilityField;
