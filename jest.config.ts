module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },

  //setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
  transform: {
    "^.+\\.[tj]sx?$": ["ts-jest", { tsconfig: "./tsconfig.app.json" }],
  },
  collectCoverage: true, // Enable coverage collection
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}", // Specify the files for which coverage information should be collected
    "!src/**/*.d.ts", // Exclude type declaration files
  ],
  coverageDirectory: "coverage", // Specify the directory where coverage information should be output
  coverageReporters: ["html", "text"], // Specify the coverage reporters
}
