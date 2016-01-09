import React from 'react';

import Paginator from '../Paginator.jsx';
import Griddle from 'griddle-react';
import _ from 'lodash';

class Table extends React.Component {

  constructor(props) {
    super(props);

    this.state = {

    };
  }

  initializeMetadata(cols = [], captions = [], renderers = {}) {
  	const metadata = _.reduce(cols, (cur, col, i) => {
  		const metaObject = {
  			columnName: col,
  			displayName: captions[i]
  		};

  		if (typeof renderers[col] === 'function') {
  			metaObject.customComponent = renderers[col];
  		}

  		cur.push(metaObject);
  		return cur;
  	}, []);

  	return metadata;
  }

  initializeRowMetadata() {

  	const rowMetadata = {
      "bodyCssClassName": function(rowData) {
        if (rowData.isSelected === true) {
          return "selected-row";
        }
        return "standard-row";
      }
  	};

  	return rowMetadata;
  }

  render() {
    const { tableCols, tableCaptions, renderers, onRowSelected, selected, selectField } = this.props;
    const columnMetadata = this.initializeMetadata(tableCols, tableCaptions, renderers);
		const rowMetadata = this.initializeRowMetadata();

    const results = this.props.results.map( (data, i) => {
			if (!selected || typeof onRowSelected === 'undefined') return data;
      if (typeof selectField !== 'undefined') {
        if (data[selectField] === selected[selectField]) {
          data.isSelected = true;
        } else {
          data.isSelected = false;
        }
      } else {
  			if (data.ID === selected.ID) {
  				data.isSelected = true;
  			} else {
  				data.isSelected = false;
  			}
      }
			return data;
		});

    return <Griddle results={results}
  									columnMetadata={columnMetadata}
  									columns={tableCols}
  									resultsPerPage={10}
  									useCustomPagerComponent={true}
  									customPagerComponent={Paginator}
  									onRowClick={onRowSelected}
  									rowMetadata={rowMetadata}
  									noDataMessage={'Нет данных'}/>;
  }
}

export default Table;
