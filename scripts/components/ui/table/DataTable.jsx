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
    const { results, tableCols, tableCaptions, renderers, onRowSelected } = this.props;
    const columnMetadata = this.initializeMetadata(tableCols, tableCaptions, renderers);
		const rowMetadata = this.initializeRowMetadata();

    return <Griddle results={results}
  									columnMetadata={columnMetadata}
  									columns={tableCols}
  									resultsPerPage={10}
  									useCustomPagerComponent={true}
  									customPagerComponent={Paginator}
  									onRowClick={onRowSelected}
  									rowMetadata={rowMetadata}
  									noDataMessage={''}/>;
  }
}

export default Table;
