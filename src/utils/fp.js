function* switchGenerator(condValue, ...cases) {
  for (let i = 0; i < cases.length; ++i) {
    if (cases[i].condition) {
      yield cases[i].action(condValue);
    }
  }
}

export const caseObject = (condition, action) => ({ condition, action });
export const defaultCase = action => ({ condition: true, action });
export const switcher = condValue => (...cases) => [...switchGenerator(condValue, ...cases)][0];
