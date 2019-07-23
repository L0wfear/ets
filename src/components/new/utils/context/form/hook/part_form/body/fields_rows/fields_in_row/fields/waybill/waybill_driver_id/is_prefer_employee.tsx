const isPreferEmployee = (binding_type: 'secondary' | 'primary') => {
  return binding_type === 'primary';
};

export default isPreferEmployee;
