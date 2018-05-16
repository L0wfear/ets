const hocAll = (...arg) => Component => arg.reduceRight((oldComponent, hoc) => hoc(oldComponent), Component);

export default hocAll;
