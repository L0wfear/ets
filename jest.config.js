module.exports = {
  preset: 'ts-jest',
  moduleDirectories: ['node_modules', 'src'],
  collectCoverage: true,
  coverageDirectory: './coverageDirectory',
  reporters: [ 'default', 'jest-junit' ],
  // collectCoverageFrom: ['src/components/**/*.{ts,js}'],
  globals: {
    window: true,
  },
};
