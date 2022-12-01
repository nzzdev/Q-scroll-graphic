const fixtureDataDirectory = "../../resources/fixtures/data";

// provide every fixture data file present in ../../resources/fixtures/data
// has to be in sync with files created in build task - see ../../tasks/build.js
const fixtureData = [
  require(`${fixtureDataDirectory}/two-variants-highlighted-text.json`),
  require(`${fixtureDataDirectory}/single-variant-different-aspect-ratios.json`),
  require(`${fixtureDataDirectory}/mixed-variant-mixed-aspect-ratios.json`),
  require(`${fixtureDataDirectory}/transparent-background-white-text.json`),
];

module.exports = {
  path: "/fixtures/data",
  method: "GET",
  options: {
    tags: ["api"],
  },
  handler: (request, h) => {
    return fixtureData;
  },
};
