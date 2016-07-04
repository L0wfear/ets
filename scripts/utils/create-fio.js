export function createFio(data, full = false) {
  const { first_name, last_name, middle_name } = data;
  let result = '';
  if (last_name && last_name.length) {
    result += `${last_name} `;
  }
  if (first_name && first_name.length) {
    result += full || !(middle_name && middle_name.length) ? `${first_name} ` : `${first_name[0]}. `;
  }
  if (middle_name && middle_name.length) {
    result += full ? `${middle_name} ` : `${middle_name[0]}. `;
  }

  return result;
}
