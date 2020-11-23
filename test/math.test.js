const {convertToCelcius,convertToFar} = require('../src/math');

test("Converting to Celcius", () => {
  const temp = convertToCelcius(32);
  expect(temp).toBe(0);
});

test("Converting to fernheit", () => {
  const temp = convertToFar(0);
  expect(temp).toBe(32);
});
