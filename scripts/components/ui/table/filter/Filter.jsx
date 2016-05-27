import React from 'react';
import FilterButton from './FilterButton.jsx';
import FilterModal from './FilterModal.jsx';

let Filter = (props) => {
  return (
    <div className={props.className}>
      <FilterButton disabled={props.disabled} direction={props.direction} show={props.show} active={props.active} onClick={props.onClick}/>
      <FilterModal onSubmit={props.onSubmit}
          show={props.show}
                   onHide={props.onHide}
                   values={props.values}
                   direction={props.direction}
                   options={props.options}
                   tableData={props.tableData} />
    </div>
  );
}

export default Filter;
