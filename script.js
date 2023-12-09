// Dynamically set the current year in the copyright footer
const currentYear = new Date().getFullYear();
document.getElementById("copyright-year").textContent = currentYear;

// Function to calculate sawing time
const calculateSawingTime = (height, quantity, requestedLength) => {
  //cutting element/factors
  const mmAbove = 10; // mm
  const mmBelow = 5; // mm
  const warmUp = 1.1; // additional 10%
  const sawUpSpeed = 40; // mm/s
  const machineClampSpeed = 70; // mm/s

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

  const {
    regio1: a,
    regio2: b,
    regio3: c,
    regio4: d,
  } = {
    regio1: cuttime1 * warmUp + cuttime1 * (quantity - 1),
    regio2: cuttime2 * warmUp + cuttime2 * (quantity - 1),
    regio3: cuttime3 * warmUp + cuttime3 * (quantity - 1),
    regio4: cuttime4 * warmUp + cuttime4 * (quantity - 1),
  };

  let sawingTime;

  const checkHeight = () => {
    if (height <= 200) {
      sawingTime = a;
    } else if (height <= 250) {
      sawingTime = b;
    } else if (height <= 300) {
      sawingTime = c;
    } else {
      sawingTime = d;
    }
    return sawingTime;
  };

  // statement under qty 2
  if (quantity <= 2) {
    checkHeight();

    // statement above qty 2 and length till 500mm
  } else if (quantity > 2 && requestedLength <= 500) {
    checkHeight();
    sawingTime += additionalClampTimeUnder500;

    // statement above qty 2 and length above 500mm
  } else if (quantity > 2 && requestedLength > 500) {
    checkHeight();
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

// input from UI
const heightInput = document.getElementById("height");
const quantityInput = document.getElementById("quantity");
const requestedLengthInput = document.getElementById("requestedLength");
const calculateButton = document.getElementById("calculateButton");

// output text to UI
const output = document.getElementById("output");

// button action
calculateButton.addEventListener("click", function () {
  const height = parseFloat(heightInput.value);
  const quantity = parseFloat(quantityInput.value);
  const requestedLength = parseFloat(requestedLengthInput.value);

  if (isNaN(height) || isNaN(quantity) || isNaN(requestedLength)) {
    output.textContent = "Please enter valid numeric values.";
  }
  if (requestedLength > 3700) {
    output.textContent = "The maximum length is 3700mm";
  } else {
    const sawingTime = calculateSawingTime(height, quantity, requestedLength);
    const { minutes, seconds } = displaySawingTime(sawingTime);
    output.textContent = `Sawing Time: ${minutes} min ${seconds} sec`;
  }
});
