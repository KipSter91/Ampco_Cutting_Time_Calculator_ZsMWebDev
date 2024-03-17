"use strict";
// Dynamically set the current year in the copyright footer
const currentYear = new Date().getFullYear();
document.getElementById("copyright-year").textContent = currentYear;

const cuttingParams = {
  mmAbove: 10, // mm
  mmBelow: 5, // mm
  warmUp: 1.1, // additional 10%
  sawUpSpeed: 40, // mm/min
  machineClampSpeed: 70, // mm/min
};

// Function to calculate sawing time
const calculateSawingTime = (height, quantity, requestedLength) => {
  const { mmAbove, mmBelow, warmUp, sawUpSpeed, machineClampSpeed } =
    cuttingParams;
  //additional calculating elements/factors
  const sumHeigth = height + mmAbove + mmBelow;
  const sawUpCycle = height / sawUpSpeed;
  const additionalClampTimeUnder500 =
    (quantity - 1) * (2 * (requestedLength / machineClampSpeed));
  const additionalClampTimeAbove500 =
    (quantity - 1) *
    ((requestedLength / 500) * 2 * (requestedLength / machineClampSpeed));

  //different standard cutting formulas related to diameter
  const cuttime1 = (sumHeigth / 70) * 60 + sawUpCycle;
  const cuttime2 = (sumHeigth / 60) * 60 + sawUpCycle;
  const cuttime3 = (sumHeigth / 40) * 60 + sawUpCycle;
  const cuttime4 = (sumHeigth / 30) * 60 + sawUpCycle;

  const regions = [
    { name: "regio1", time: cuttime1 },
    { name: "regio2", time: cuttime2 },
    { name: "regio3", time: cuttime3 },
    { name: "regio4", time: cuttime4 },
  ];

  const {
    regio1: a,
    regio2: b,
    regio3: c,
    regio4: d,
  } = regions.reduce((acc, { name, time }) => {
    acc[name] = time * warmUp + time * (quantity - 1);
    return acc;
  }, {});

  let sawingTime;

  switch (true) {
    case height <= 200:
      sawingTime = a;
      break;
    case height <= 250:
      sawingTime = b;
      break;
    case height <= 300:
      sawingTime = c;
      break;
    default:
      sawingTime = d;
  }
  if (quantity > 2 && requestedLength <= 500) {
    sawingTime += additionalClampTimeUnder500;

    // statement above qty 2 and length above 500mm
  } else if (quantity > 2 && requestedLength > 500) {
    sawingTime += additionalClampTimeAbove500;
  }

  return sawingTime;
};

// Function to display sawing time as minutes and seconds
function displaySawingTime(sawingTime) {
  const minutes = Math.floor(sawingTime / 60);
  const seconds = Math.floor(sawingTime % 60);
  return { minutes, seconds };
}

// Input elements
const inputs = {
  height: document.getElementById("height"),
  quantity: document.getElementById("quantity"),
  requestedLength: document.getElementById("requestedLength"),
};

// Output element
const output = document.getElementById("output");

// Button action
document.getElementById("calculateButton").addEventListener("click", () => {
  const { height, quantity, requestedLength } = inputs;

  // Validate input values
  const values = Object.values(inputs).map((input) => parseFloat(input.value));
  console.log(values);
  if (values.some(isNaN) || values.some((value) => value === 0) || requestedLength.value > 3700) {
    output.textContent =
      "Please enter valid numeric values and ensure the requested length is not greater than 3700mm.";
    return;
  }

  // Calculate and display sawing time
  const sawingTime = calculateSawingTime(...values);
  const { minutes, seconds } = displaySawingTime(sawingTime);
  output.textContent = `Sawing Time: ${minutes} min ${seconds} sec`;
});
