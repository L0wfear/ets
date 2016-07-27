import React from 'react';
import Table from 'components/ui/table/DataTable.jsx';
import { floatFixed1 } from 'utils/renderers';

let getTableMeta = (props) => {

	let tableMeta = {
		cols: [
			{
				name: 'company_name',
				caption: 'Учреждение',
				type: 'string',
        cssClassName: 'width200',
        customHeaderComponent:
          <div className="diagonal-header">
            <div className="top-right">Тип ТС</div>
            <div className="bottom-left">Учреждение</div>
          </div>
			},
      {
				name: 'percentage_one',
				caption: 'Тротуаро-уборочная техника',
				type: 'floatFixed1',
			},
      {
				name: 'percentage_two',
				caption: 'Поливомоечная техника',
				type: 'floatFixed1',
			},
      {
				name: 'percentage_three',
				caption: 'Подметательно-уборочная техника',
				type: 'floatFixed1',
			},
      {
				name: 'total_percentage',
				caption: 'Итого',
				type: 'floatFixed1',
			}
		]
	};

	return tableMeta;

};

let OdhCoverageReportTable = (props) => {
		const renderers = {
			percentage_one: floatFixed1,
      percentage_two: floatFixed1,
      percentage_three: floatFixed1,
      total_percentage: floatFixed1,
		};

		return <Table
      title="Фактическое выполнение заданий за смену"
      noFilter={true}
			results={props.data}
			renderers={renderers}
      enumerated={false}
			tableMeta={getTableMeta(props)}
			className="waybills-table"/>
}

export default OdhCoverageReportTable;
