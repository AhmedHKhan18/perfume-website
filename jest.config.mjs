import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    // Must come BEFORE the @/ alias so it intercepts all firebaseConfig imports
    // (covers both '@/firebaseConfig' and relative '../firebaseConfig' paths)
    '^.*firebaseConfig.*$': '<rootDir>/src/__mocks__/firebaseConfig.js',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['**/__tests__/**/*.test.{js,jsx}'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.test.{js,jsx}',
    '!src/app/layout.js',
    '!src/app/globals.css',
  ],
}

export default createJestConfig(config)
