import * as React from 'react';
import { Flex } from 'global-styled/global-styled';
import ExtField from 'components/@next/@ui/renderFields/Field';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { DefaultSelectOption } from 'components/old/ui/input/ReactSelect/utils';
import { MunicipalFacility } from 'redux-main/reducers/modules/some_uniq/municipal_facility/@types';
import { isNullOrUndefined } from 'util';

export type WorkTypesProps = {
  value: number | void;
  onChange: (obj: { [key: string]: any; }) => any;
  disabled: boolean;
  error: string;
  municipal_facility_list: Array<MunicipalFacility>;
  municipal_facility_id: number;
  IS_CREATING: boolean;

  page: LoadingMeta['page'];
  path: LoadingMeta['path'];
};

type WorkTypeRowdataOption = ValuesOf<MunicipalFacility['work_types']>;
type WorkTypeSingleOption = DefaultSelectOption<number, string, WorkTypeRowdataOption>;
type WorkTypesStates = {
  work_types_options: Array<WorkTypeSingleOption>;
};

const WorkTypes: React.FC<WorkTypesProps> = React.memo(
  (props) => {

    const [work_types_options, set_work_types_options] = React.useState<WorkTypesStates['work_types_options']>([]);

    const handleChange = (_, value) => {
      if (!isNullOrUndefined(value)) {
        props.onChange({
          work_type_code: Number(value),
        });
      }
    };

    React.useEffect(() => {

      const work_types_list: MunicipalFacility['work_types']= props.municipal_facility_list.find((elem) => elem.municipal_facility_id === props.municipal_facility_id)?.work_types;

      const workTypesOptList = work_types_list
        ? work_types_list.map<WorkTypeSingleOption>((elem) => (
          {
            label: elem.work_type_name,
            value: elem.work_type_code,
            rowData: elem,
          }
        ))
        : [];
      set_work_types_options(workTypesOptList);
      if(workTypesOptList?.length && !props.value && props.IS_CREATING) {
        props.onChange({
          work_type_code: Number(workTypesOptList[0]?.value),
        });
      }
    }, [props.municipal_facility_list, props.municipal_facility_id]);

    return (
      <Flex grow={1} shrink={1} basis={100}>
        <ExtField
          id="work_type_code"
          type="select"
          label="Способ уборки"
          options={work_types_options}
          value={props.value}
          onChange={handleChange}
          disabled={props.disabled}
          clearable={false}
          error={props.error}
          boundKeys="work_type_code"
        />
      </Flex>
    );
  },
);

export default WorkTypes;
