import WithClassMethod from 'components/compositions/vokinda-hoc/with-class-method/WithClassMethod';

export default (anotherMethod = {}) => WithClassMethod({
  handleChange: props => (field, e) => props.handleFormChange(field, e),
  handleMultipleChange: props => (fields) => props.handleMultipleChange(fields),
  handleSubmit: props => (fields) => props.onSubmit(),
  ...anotherMethod,
})