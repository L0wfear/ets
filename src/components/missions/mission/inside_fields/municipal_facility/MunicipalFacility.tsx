import * as React from 'react';

import { ExtField } from 'components/ui/new/field/ExtField';

type GetMunicipalFacilityFuncProps = {
  start_date: any,
  end_date: any,
  for: 'mission',
  kind_task_ids?: number[],
};

type MunicipalFacilityNormative = {};

type MunicipalFacilityType = {
  municipal_facility_id: number;
  municipal_facility_name: string;
  normatives: MunicipalFacilityNormative[];
  car_func_types: {
    asuods_id: number;
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
  date_start: string | Date | null;
  technical_operation_id: number | void;
  getCleaningMunicipalFacilityList: GetMunicipalFacilityFunc,
  technicalOperationsList: TechnicalOperationsType[];
  kind_task_ids: any[];
  alreadyDefineNormId: boolean;
  norm_id: number | void;

  typeIdWraomWaybill: number | void;

  handleChange: (name: string, value: number | null) => any;
  getDataByNormatives: (normatives: MunicipalFacilityNormative[]) => any;
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
    };
  }

  componentDidUpdate(prevProps) {
    const { props } = this;
    const {
      date_start,
      technical_operation_id,
      technicalOperationsList,
      norm_id,
    } = props;

    const triggerOnUpdate = (
      technicalOperationsList.length
      && technical_operation_id
      && date_start
      && (
        date_start !== prevProps.date_start  // изменилась дата начала на форме
        || technical_operation_id !== prevProps.technical_operation_id  // или изменилась ТО на форме
        || !prevProps.technicalOperationsList.length && technical_operation_id // или в предыдущих пропсах не было данных по ТО
      )
    );

    if (triggerOnUpdate) {
      const toData = technicalOperationsList.find(({ id }) => id === technical_operation_id);

      if (toData) {
        const {
          normatives,
        } = toData;

        const outerPayload = {
          start_date: date_start,
          end_date: date_start,
          kind_task_ids: props.kind_task_ids,
          for: 'mission',
          norm_ids: '',
        };

        if (props.alreadyDefineNormId && norm_id) {
          outerPayload.norm_ids = norm_id.toString();
        } else {
          outerPayload.norm_ids = normatives.map(({ id }) => id).join(',');
        }

        this.loadMunicipalFacility(outerPayload);
      }
    }
  }

  loadMunicipalFacility(outerPayload) {
    this.props.getCleaningMunicipalFacilityList(outerPayload)
      .then(({ municipal_facility_list }) => {
        const {
          value,
          typeIdWraomWaybill,
        } = this.props;

        const MUNICIPAL_FACILITY_OPTIONS = municipal_facility_list.reduce((newArr, mfData) => {
          const carAddToArr = (
            !typeIdWraomWaybill
            || (
              typeIdWraomWaybill
              && mfData.car_func_types.some((mfDataCarFuncType) => mfDataCarFuncType.asuods_id === typeIdWraomWaybill)
            )
          );

          if (carAddToArr) {
            newArr.push({
              value: mfData.municipal_facility_id,
              label: mfData.municipal_facility_name,
              mfData,
            });
          }

          return newArr;
        }, []);

        if (value) {
          const mfOption = MUNICIPAL_FACILITY_OPTIONS.find((mfOptionData) => mfOptionData.value === value);
          if (mfOption) {
            this.props.getDataByNormatives(
              mfOption.mfData.normatives,
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

      if (value) {
        this.props.getDataByNormatives(option.mfData.normatives);
      }
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
    );
  }
}

export default MunicipalFacilityField;
