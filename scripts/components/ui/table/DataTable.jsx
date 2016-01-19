import React from 'react';

import Paginator from '../Paginator.jsx';
import Griddle from 'griddle-react';
import moment from 'moment';
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
    const { tableMeta, renderers, onRowSelected, selected, selectField, filter = {} } = this.props;
    const tableCols = tableMeta.cols.map( c => c.name );
    const tableCaptions = tableMeta.cols.map( c => c.caption );
    const columnMetadata = this.initializeMetadata(tableCols, tableCaptions, renderers);
		const rowMetadata = this.initializeRowMetadata();
    const data = _.clone(this.props.results);

    const results = _(data).map( (d, i) => {
			if (!selected || typeof onRowSelected === 'undefined') {
        d.isSelected = false;
        return d;
      }
      if (typeof selectField !== 'undefined') {
        d.isSelected = d[selectField] === selected[selectField];
      }
			return d;
		}).filter((obj) => {
  		let isValid = true;

  		_.mapKeys(filter, (value, key) => {

  			if (typeof value.getMonth === 'function') {
  				if (obj[key] !== moment(value).format('YYYY-MM-DD H:mm')) {
  					isValid = false;
  				}
  			} else {
  				if (obj[key] != value) {
  					isValid = false;
  				}
  			}
		  });

			return isValid;
		}).value();

    return <Griddle results={results}
                    initialSort={'id'}
  									columnMetadata={columnMetadata}
  									columns={tableCols}
  									resultsPerPage={15}
  									useCustomPagerComponent={true}
  									customPagerComponent={Paginator}
  									onRowClick={onRowSelected}
  									rowMetadata={rowMetadata}
  									noDataMessage={'Нет данных'}/>;
  }
}

export default Table;
