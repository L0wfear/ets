module.exports = {
  parser: '@typescript-eslint/parser',
  root: true,
  plugins: [
    'eslint-plugin',
    '@typescript-eslint',
    'import',
    'eslint-comments',
    'react',
  ],
  parserOptions: {
    // 'project': './tsconfig.json',
    'ecmaVersion': 6,
    'sourceType': 'module',
    'ecmaFeatures': {
      'tsx': true
    },
  },
  env: {
    'browser': true,
    'node': true
  },
  "settings": {
    "react": {
      "pragma": "React",  // Pragma to use, default to "React"
      "version": "detect", // React version. "detect" automatically picks the version you have installed.
    },
  },
  rules: {
    'no-extra-semi': 'error',                                             // только одна точка с запятой
    'curly': 'error',                                                     // всегда оборачиваем в фигурные скобки
    'eqeqeq': 'error',                                                    // только строгое сравнение | @todo - error
    'indent': ['error', 2, { 'SwitchCase': 1 }],                          // таб - 2 пробела, в switch case отделяется 1 табом (2 пробела)
    "no-unused-expressions": ["error", { "allowShortCircuit": true, "allowTernary": true, "allowTaggedTemplates": true }],
    // https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin
    '@typescript-eslint/adjacent-overload-signatures': ['error'],         // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/adjacent-overload-signatures.md
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],  // предпочитаемый формат описание definitions - type
    // '@typescript-eslint/await-thenable': ['error'],                       // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/await-thenable.md
    '@typescript-eslint/explicit-function-return-type': 'off',            // обязательное указание возвращаемого типа
    '@typescript-eslint/no-explicit-any': 'off',                          // запрещает использовать any
    '@typescript-eslint/no-non-null-assertion': 'error',                  // запрещает обращаться к свойству, если укзаано, что оно null, через !.
    '@typescript-eslint/no-use-before-define': 'warn',                    // сначала функция должна быть опеределена, потом вызвана
    '@typescript-eslint/no-var-requires': 'off',                          // не использовать requires для импорта
    '@typescript-eslint/member-delimiter-style': [                        // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/member-delimiter-style.md
      'error',
      {
        "multiline": {
          "delimiter": "semi",
          "requireLast": true
        },
        "singleline": {
          "delimiter": "semi",
          "requireLast": true
        },
      },
    ],
    "@typescript-eslint/no-empty-function": "error",                      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-empty-function.md
    // '@typescript-eslint/no-floating-promises': ['error'],                 // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-floating-promises.md
    // '@typescript-eslint/no-for-in-array': ['error'],                      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-for-in-array.md
    // '@typescript-eslint/no-misused-promises': ['error'],                  // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-misused-promises.md
    '@typescript-eslint/no-non-null-assertion': ['error'],                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-non-null-assertion.md
    '@typescript-eslint/no-this-alias': [                                 // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-this-alias.md
      'error',
      {
        allowDestructuring: true,     // Allow `const { props, state } = this`; false by default
        allowedNames: ['self'],       // Allow `const self = this`; `[]` by default
      },
    ],
    // '@typescript-eslint/no-unnecessary-condition': ['error'],             // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unnecessary-condition.md
    '@typescript-eslint/no-useless-constructor': ['error'],
    '@typescript-eslint/prefer-for-of': ['warn'],
    // '@typescript-eslint/prefer-includes': ['error'],
    '@typescript-eslint/array-type': ['error', { default: 'generic' }],   // Использовать Array<obj> вместо obj[] 
    '@typescript-eslint/brace-style': ['error'],                          // тело {} с новой строки
    '@typescript-eslint/camelcase': ['off'],                              // camelCase warn
    '@typescript-eslint/func-call-spacing': ['error'],                    // запрещает пробел между именем функции и вызовом
    '@generic-type-naming/generic-type-naming': ['off'],                  // T перед именем дженерика
    '@generic-type-naming/interface-name-prefix': ['off'],                // I перед именем интерфейса
    '@typescript-eslint/no-empty-function': ['error'],                    // нет пустым функциям
    '@typescript-eslint/no-extra-parens': ['off'],                        // можно оборачивать в ()

    'quotes': ['off'],                                                    // кавычки - ', кроме пропсов jsx - "
    "@typescript-eslint/quotes": ["error", 'single', { 'allowTemplateLiterals': true }],

    // '@typescript-eslint/require-array-sort-compare': ['warn'],
    // "@typescript-eslint/restrict-plus-operands": "error",

    '@typescript-eslint/type-annotation-spacing': ['error', { "before": false, "after": true }],

    "semi": "off",
    "@typescript-eslint/semi": ["error", 'always'],

    /* запрещает оставлять неиспользуемые переменные */
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        'vars': 'all',
        'args': 'none',
        'ignoreRestSiblings': true,
      },
    ],
    
    'react/jsx-uses-react': 'error',   
    'react/jsx-uses-vars': 'error' ,
    /* end */

    '@typescript-eslint/type-annotation-spacing': ['error'],                // пробелы в нужных местах (определение функции, типа и всего такого)

    'no-multiple-empty-lines': [                                            // количество пустых строк (только 1 и 1 в конце файла)
      'error',
      { 'max': 1, 'maxEOF': 1 }
    ],
    'linebreak-style': [                                                    // LF
      'error',
      'unix'
    ],
    'object-property-newline': [                                            // деструктуризация в строки
      1,
      { 'allowAllPropertiesOnSameLine': true }
    ],
    'operator-linebreak': ['error', 'before'],                              // правильный перенос строк в операции
    'arrow-parens': [                                                       // аргументы анонимной всегда в скобки
      'error',
    ],
    'no-console': [                                                         // не забываем удалять лишние логи
      'error',
      { allow: ['warn', 'info', 'error'] },
    ],
    
    'no-tabs': 'error',
    'no-continue': 'error',
    'no-mixed-spaces-and-tabs': 'error',
    
    'quote-props': [                                                        // одинаковый формат имён у свойств объекта
      'error',
      'consistent-as-needed',
    ],
    'max-len': [                                                            // @todo максимальная длина строки - 80 символов
      'warn',
      {
        "code": 500,
        "ignoreComments": true,
        "ignoreUrls": true,
        "ignoreStrings": true,
        "ignoreTemplateLiterals": true,

      }
    ],
    'no-param-reassign': [                                                   // скажем нет мутации
      'error',
      { 'props': false },
    ],
    'no-plusplus': [                                                         // против a++, за a += 1
      'error',
      { 'allowForLoopAfterthoughts': true },
    ],
    "react/jsx-no-bind": ['warn'],                                          // @todo
    'no-debugger': 'error',                                                  // нет дебаггерам

    'no-import-assign': 'error',
  }
};