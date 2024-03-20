"use strict";
// Dynamically set the current year in the copyright footer
const currentYear = new Date().getFullYear();
document.getElementById("copyright-year").textContent = currentYear;

const cuttingParams = {
  mmAbove: 10, // mm
  mmBelow: 5, // mm
  warmUp: 1.1, // additional 10%
  sawUpSpeed: 40, // mm/s
  machineClampSpeed: 70, // mm/s
  fooding: [30, 40, 60, 70]
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

  cuttingParams.fooding.sort((a, b) => b - a);

  const [feedA, feedB, feedC, feedD] = cuttingParams.fooding.map((value) => {
    return (quantity * ((sumHeigth / value) * 60 + sawUpCycle)) * warmUp;
  });
  console.log(feedA, feedB, feedC, feedD);

  let sawingTime;

  switch (true) {
    case height <= 200:
      sawingTime = feedA;
      break;
    case height <= 250:
      sawingTime = feedB;
      break;
    case height <= 300:
      sawingTime = feedC;
      break;
    default:
      sawingTime = feedD;
  }
  if (quantity > 2 && requestedLength <= 500) {
    sawingTime += additionalClampTimeUnder500;

    // statement above qty 2 and length above 500mm
  } else if (quantity > 2 && requestedLength > 500) {
    sawingTime += additionalClampTimeAbove500;
  }
  console.log(feedA, feedB, feedC, feedD);
  console.log(additionalClampTimeUnder500, additionalClampTimeAbove500);
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
