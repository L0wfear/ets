import * as React from 'react';
import { ExtField } from 'components/ui/new/field/ExtField';
import { changeCompanyStructureIdNotyfication } from 'utils/notifications';
import { Odh } from 'redux-main/reducers/modules/geoobject/actions_by_type/odh/@types';
import useCompanyStructureLinearForUserOptions from 'components/new/utils/hooks/services/useOptions/useCompanyStructureLinearForUserOptions';
import { isNumber } from 'util';

type FieldCompanyStructureIdProps = {
  value: Odh['company_structures'];
  error: string;
  handleChange: any;
  isPermitted: boolean;

  page: string;
  path: string;
};

const FieldCompanyStructureId: React.FC<FieldCompanyStructureIdProps> = React.memo(
  (props) => {
    const companyStructureOptionData = useCompanyStructureLinearForUserOptions();

    const handleChangeCompanyStructure = React.useCallback(
      (key, _, options: typeof companyStructureOptionData.options) => {
        global.NOTIFICATION_SYSTEM.notify(changeCompanyStructureIdNotyfication);

        const addItem = options.length > props.value.length;
        let valueNew = [];

        if (addItem) {
          const setIds = options.reduce(
            (set, { rowData }) => {
              set.add(rowData.id);

              if (isNumber(rowData.parent_id)) {
                set.add(rowData.parent_id);
              }

              return set;
            },
            new Set(),
          );

          valueNew = companyStructureOptionData.options.reduce(
            (newArr, { rowData }) => {
              if (setIds.has(rowData.id)) {
                newArr.push({
                  id: rowData.id,
                  name: rowData.name,
                });
              }

              return newArr;
            },
            [],
          );
        } else {
          valueNew = options.map(({ rowData }) => ({
            id: rowData.id,
            name: rowData.name,
          }));
        }

        props.handleChange({
          [key]: valueNew,
        });

      },
      [props.handleChange, companyStructureOptionData, props.value],
    );

    const value = React.useMemo(
      () => {
        return props.value.map(({ id }) => id);
      },
      [props.value],
    );

    const isAllChecked = React.useMemo(
      () => {
        return !companyStructureOptionData.isLoading && companyStructureOptionData.options.length === value.length;
      },
      [value, companyStructureOptionData],
    );

    const handleSelectAll = React.useCallback(
      (key) => {
        if (isAllChecked) {
          handleChangeCompanyStructure(
            key,
            null,
            [],
          );
        } else {
          handleChangeCompanyStructure(
            key,
            null,
            companyStructureOptionData.options,
          );
        }
      },
      [isAllChecked, companyStructureOptionData, handleChangeCompanyStructure],
    );

    return (
      <React.Fragment>
        <ExtField
          id="data-no_status_docs"
          type="boolean"
          label="Выбрать все"
          value={isAllChecked}
          onChange={handleSelectAll}
          className="checkbox-input flex-reverse"
          disabled={!props.isPermitted || companyStructureOptionData.isLoading}
          boundKeys="company_structures"
        />
        <ExtField
          id="odh_company_structures"
          type="select"
          multi
          label="Подразделение"
          value={value}
          error={props.error}
          emptyValue={null}
          onChange={handleChangeCompanyStructure}
          boundKeys="company_structures"
          options={companyStructureOptionData.options}
          etsIsLoading={companyStructureOptionData.isLoading}
          disabled={!props.isPermitted}
        />
      </React.Fragment>
    );
  },
);

export default FieldCompanyStructureId;
