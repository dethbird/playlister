module.exports = {
  testEnvironment: 'jsdom',
  // run setup file after the test environment is installed (jest globals like `expect` exist)
  // keep setupFilesAfterEnv for jest-dom and other matchers; the Response shim is provided
  // early via NODE_OPTIONS preload (`../jest-preload.js`) to support tests that construct
  // Response at module load time.
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest'
  },
  moduleNameMapper: {
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
    '\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/__mocks__/fileMock.js'
  },
  testMatch: ['<rootDir>/src/**/?(*.)+(spec|test).[jt]s?(x)'],
  collectCoverageFrom: ['src/**/*.{js,jsx}'],
};
