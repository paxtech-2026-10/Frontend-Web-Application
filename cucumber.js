process.env.TS_NODE_PROJECT = 'tsconfig.bdd.json';

module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: [
      'e2e-bdd/support/**/*.ts',
      'e2e-bdd/steps/**/*.ts'
    ],
    format: [
      'progress',
      'html:test-results/cucumber-report.html'
    ],
    publishQuiet: true
  }
};
