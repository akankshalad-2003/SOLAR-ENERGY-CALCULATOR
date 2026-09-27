 /* =========================================
   ENERGY CALCULATOR - JAVASCRIPT
   ========================================= */


/* ---------- GET HTML ELEMENTS ---------- */

const addDeviceBtn = document.getElementById("addDeviceBtn");
const calculateBtn = document.getElementById("calculateBtn");
const resetBtn = document.getElementById("resetBtn");

const deviceTableBody = document.getElementById("deviceTableBody");

const totalKw = document.getElementById("totalKw");
const totalKwh = document.getElementById("totalKwh");

const solarResult = document.getElementById("solarResult");


/* ---------- ADD DEVICE ---------- */

addDeviceBtn.addEventListener("click", function () {

    const newRow = document.createElement("tr");

    newRow.classList.add("device-row");

    newRow.innerHTML = `
        <td>
            <input
                type="text"
                class="device-name"
                placeholder="Device name"
            >
        </td>

        <td>
            <input
                type="number"
                class="watt"
                placeholder="Watt"
                min="0"
            >
        </td>

        <td>
            <input
                type="number"
                class="hours"
                placeholder="Hours"
                min="0"
                max="24"
            >
        </td>

        <td class="kw-result">
            0.000
        </td>

        <td class="kwh-result">
            0.000
        </td>

        <td>
            <button
                class="delete-btn"
                onclick="deleteRow(this)"
            >
                🗑️
            </button>
        </td>
    `;

    deviceTableBody.appendChild(newRow);

});


/* ---------- DELETE DEVICE ---------- */

function deleteRow(button) {

    const row = button.closest("tr");

    row.remove();

}


/* ---------- CALCULATE ENERGY ---------- */

calculateBtn.addEventListener("click", function () {

    const rows = document.querySelectorAll(".device-row");

    let totalPower = 0;
    let totalEnergy = 0;

    let hasDevice = false;


    rows.forEach(function (row) {

        const wattInput = row.querySelector(".watt");
        const hoursInput = row.querySelector(".hours");

        const kwCell = row.querySelector(".kw-result");
        const kwhCell = row.querySelector(".kwh-result");


        const watt = parseFloat(wattInput.value) || 0;
        const hours = parseFloat(hoursInput.value) || 0;


        /* Watt → kW */

        const powerKW = watt / 1000;


        /* kW × Hours → kWh */

        const energyKWh = powerKW * hours;


        /* Display result in row */

        kwCell.textContent = powerKW.toFixed(3);

        kwhCell.textContent = energyKWh.toFixed(3);


        /* Add to total */

        totalPower += powerKW;

        totalEnergy += energyKWh;


        if (watt > 0 && hours > 0) {
            hasDevice = true;
        }

    });


    /* ---------- DISPLAY TOTAL ---------- */

    totalKw.textContent =
        totalPower.toFixed(3) + " kW";


    totalKwh.textContent =
        totalEnergy.toFixed(3) + " kWh";


    /* ---------- SOLAR / BATTERY ESTIMATE ---------- */

    if (hasDevice) {

        const backupHours =
            parseFloat(
                document.getElementById("batterySize").value
            ) || 0;


        /*
            Simple battery energy estimation

            Battery requirement =
            Total Power × Backup Hours
        */

        const batteryEnergy =
            totalPower * backupHours;


        /*
            Simple solar estimation

            Assuming 5 peak sun hours
        */

        const peakSunHours = 5;

        const solarCapacity =
            totalEnergy / peakSunHours;


        solarResult.innerHTML = `

            <div>
                <strong>Daily Energy Consumption:</strong>
                ${totalEnergy.toFixed(3)} kWh/day
            </div>

            <div>
                <strong>Total Connected Load:</strong>
                ${totalPower.toFixed(3)} kW
            </div>

            <div>
                <strong>Estimated Solar Capacity:</strong>
                ${solarCapacity.toFixed(2)} kW
            </div>

            <div>
                <strong>Estimated Battery Energy:</strong>
                ${batteryEnergy.toFixed(2)} kWh
            </div>

            <small>
                Solar and battery values are estimates based on
                the entered device usage and assumptions used
                by this calculator.
            </small>

        `;

    } else {

        solarResult.innerHTML = `
            <p>
                Please enter wattage and working hours
                for at least one device.
            </p>
        `;

    }

});


/* ---------- RESET ---------- */

resetBtn.addEventListener("click", function () {

    /* Clear user information */

    document.getElementById("name").value = "";

    document.getElementById("location").value = "";

    document.getElementById("batterySize").value = "";


    /* Remove all device rows */

    deviceTableBody.innerHTML = "";


    /* Add one fresh empty row */

    const newRow = document.createElement("tr");

    newRow.classList.add("device-row");

    newRow.innerHTML = `
        <td>
            <input
                type="text"
                class="device-name"
                placeholder="Device name"
            >
        </td>

        <td>
            <input
                type="number"
                class="watt"
                placeholder="Watt"
                min="0"
            >
        </td>

        <td>
            <input
                type="number"
                class="hours"
                placeholder="Hours"
                min="0"
                max="24"
            >
        </td>

        <td class="kw-result">
            0.000
        </td>

        <td class="kwh-result">
            0.000
        </td>

        <td>
            <button
                class="delete-btn"
                onclick="deleteRow(this)"
            >
                🗑️
            </button>
        </td>
    `;

    deviceTableBody.appendChild(newRow);


    /* Reset summary */

    totalKw.textContent = "0.000 kW";

    totalKwh.textContent = "0.000 kWh";


    /* Reset solar section */

    solarResult.innerHTML = `
        <p>
            Enter device details and click
            <strong>Calculate Energy</strong>.
        </p>
    `;

});