/**
 * server.js
 *
 * A simple Express server to handle unit conversion forms
 * for length, weight, and temperature.
 */

const express = require("express");
const path = require("path");
const app = express();

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Redirect root to home.html
app.get("/", (req, res) => {
  res.redirect("/home.html");
});

// Serve static files (HTML, CSS, JS) from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// ---------- UTILITY FUNCTIONS FOR CONVERSIONS ---------- //

function convertLength(value, fromUnit, toUnit) {
  let valueInMeters;
  switch (fromUnit) {
    case "millimeter":
      valueInMeters = value / 1000;
      break;
    case "centimeter":
      valueInMeters = value / 100;
      break;
    case "meter":
      valueInMeters = value;
      break;
    case "kilometer":
      valueInMeters = value * 1000;
      break;
    case "inch":
      valueInMeters = value * 0.0254;
      break;
    case "foot":
      valueInMeters = value * 0.3048;
      break;
    case "yard":
      valueInMeters = value * 0.9144;
      break;
    case "mile":
      valueInMeters = value * 1609.34;
      break;
    default:
      valueInMeters = value;
  }

  let result;
  switch (toUnit) {
    case "millimeter":
      result = valueInMeters * 1000;
      break;
    case "centimeter":
      result = valueInMeters * 100;
      break;
    case "meter":
      result = valueInMeters;
      break;
    case "kilometer":
      result = valueInMeters / 1000;
      break;
    case "inch":
      result = valueInMeters / 0.0254;
      break;
    case "foot":
      result = valueInMeters / 0.3048;
      break;
    case "yard":
      result = valueInMeters / 0.9144;
      break;
    case "mile":
      result = valueInMeters / 1609.34;
      break;
    default:
      result = valueInMeters;
  }
  return result;
}

function convertWeight(value, fromUnit, toUnit) {
  let valueInGrams;
  switch (fromUnit) {
    case "milligram":
      valueInGrams = value / 1000;
      break;
    case "gram":
      valueInGrams = value;
      break;
    case "kilogram":
      valueInGrams = value * 1000;
      break;
    case "ounce":
      valueInGrams = value * 28.3495;
      break;
    case "pound":
      valueInGrams = value * 453.592;
      break;
    default:
      valueInGrams = value;
  }

  let result;
  switch (toUnit) {
    case "milligram":
      result = valueInGrams * 1000;
      break;
    case "gram":
      result = valueInGrams;
      break;
    case "kilogram":
      result = valueInGrams / 1000;
      break;
    case "ounce":
      result = valueInGrams / 28.3495;
      break;
    case "pound":
      result = valueInGrams / 453.592;
      break;
    default:
      result = valueInGrams;
  }
  return result;
}

function convertTemperature(value, fromUnit, toUnit) {
  let tempInCelsius;
  switch (fromUnit) {
    case "Celsius":
      tempInCelsius = value;
      break;
    case "Fahrenheit":
      tempInCelsius = (value - 32) * (5 / 9);
      break;
    case "Kelvin":
      tempInCelsius = value - 273.15;
      break;
    default:
      tempInCelsius = value;
  }

  let result;
  switch (toUnit) {
    case "Celsius":
      result = tempInCelsius;
      break;
    case "Fahrenheit":
      result = tempInCelsius * (9 / 5) + 32;
      break;
    case "Kelvin":
      result = tempInCelsius + 273.15;
      break;
    default:
      result = tempInCelsius;
  }
  return result;
}

// ---------- ROUTES FOR HANDLING FORM POSTS ---------- //

app.post("/length", (req, res) => {
  const { value, fromUnit, toUnit } = req.body;
  const numericValue = parseFloat(value);

  if (isNaN(numericValue)) {
    const message = "Invalid number entered. Please enter a valid value.";
    if (req.xhr || req.headers.accept.indexOf("json") > -1) {
      return res.json({ error: message });
    }
    return res.send(`<p>${message}</p><a href="/length.html">Back</a>`);
  }

  const convertedValue = convertLength(numericValue, fromUnit, toUnit).toFixed(
    4
  );

  // Respond as JSON if AJAX request
  if (req.xhr || req.headers.accept.indexOf("json") > -1) {
    return res.json({
      result: `${numericValue} ${fromUnit} = ${convertedValue} ${toUnit}`,
    });
  }

  // Fallback to full HTML response
  res.send(`
    <html>
      <head>
        <title>Length Conversion Result</title>
        <link rel="stylesheet" href="style.css" />
      </head>
      <body>
        <div class="container">
          <h1>Unit Converter - Length</h1>
          <p>Result of your calculation:</p>
          <h2>${numericValue} ${fromUnit} = ${convertedValue} ${toUnit}</h2>
          <div class="buttons">
            <button onclick="window.location.href='/length.html'">Reset</button>
            <button onclick="window.location.href='/home.html'">Back to Home</button>
          </div>
        </div>
      </body>
    </html>
  `);
});

app.post("/weight", (req, res) => {
  const { value, fromUnit, toUnit } = req.body;
  const numericValue = parseFloat(value);

  if (isNaN(numericValue)) {
    const message = "Invalid number entered. Please enter a valid value.";
    if (req.xhr || req.headers.accept.indexOf("json") > -1) {
      return res.json({ error: message });
    }
    return res.send(`<p>${message}</p><a href="/weight.html">Back</a>`);
  }

  const convertedValue = convertWeight(numericValue, fromUnit, toUnit).toFixed(
    4
  );

  if (req.xhr || req.headers.accept.indexOf("json") > -1) {
    return res.json({
      result: `${numericValue} ${fromUnit} = ${convertedValue} ${toUnit}`,
    });
  }

  res.send(`
    <html>
      <head>
        <title>Weight Conversion Result</title>
        <link rel="stylesheet" href="style.css" />
      </head>
      <body>
        <div class="container">
          <h1>Unit Converter - Weight</h1>
          <p>Result of your calculation:</p>
          <h2>${numericValue} ${fromUnit} = ${convertedValue} ${toUnit}</h2>
          <div class="buttons">
            <button onclick="window.location.href='/weight.html'">Reset</button>
            <button onclick="window.location.href='/home.html'">Back to Home</button>
          </div>
        </div>
      </body>
    </html>
  `);
});

app.post("/temperature", (req, res) => {
  const { value, fromUnit, toUnit } = req.body;
  const numericValue = parseFloat(value);

  if (isNaN(numericValue)) {
    const message = "Invalid number entered. Please enter a valid value.";
    if (req.xhr || req.headers.accept.indexOf("json") > -1) {
      return res.json({ error: message });
    }
    return res.send(`<p>${message}</p><a href="/temperature.html">Back</a>`);
  }

  const convertedValue = convertTemperature(
    numericValue,
    fromUnit,
    toUnit
  ).toFixed(4);

  if (req.xhr || req.headers.accept.indexOf("json") > -1) {
    return res.json({
      result: `${numericValue} ${fromUnit} = ${convertedValue} ${toUnit}`,
    });
  }

  res.send(`
    <html>
      <head>
        <title>Temperature Conversion Result</title>
        <link rel="stylesheet" href="style.css" />
      </head>
      <body>
        <div class="container">
          <h1>Unit Converter - Temperature</h1>
          <p>Result of your calculation:</p>
          <h2>${numericValue} ${fromUnit} = ${convertedValue} ${toUnit}</h2>
          <div class="buttons">
            <button onclick="window.location.href='/temperature.html'">Reset</button>
            <button onclick="window.location.href='/home.html'">Back to Home</button>
          </div>
        </div>
      </body>
    </html>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
