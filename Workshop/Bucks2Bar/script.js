"use strict";

function initializeDashboard() {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const monthlyData = document.getElementById("monthly-data");
  const chartMessage = document.getElementById("chart-message");
  const downloadButton = document.getElementById("download-chart");
  const themeToggle = document.getElementById("theme-toggle");
  const chartColors = {
    dark: { income: "#79c99b", expenses: "#e8c895", text: "#e2ebe3", ticks: "#c4d2c7", grid: "#42554a" },
    light: { income: "#26714a", expenses: "#9b6530", text: "#46524a", ticks: "#46524a", grid: "#d6ded7" }
  };

  months.forEach((month, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><span class="month-number">${String(index + 1).padStart(2, "0")}</span><span class="month-name">${month}</span></td>
      <td><input class="form-control amount-input" type="number" step="any" value="0" aria-label="${month} income" data-kind="income"></td>
      <td><input class="form-control amount-input" type="number" step="any" value="0" aria-label="${month} expenses" data-kind="expense"></td>
    `;
    monthlyData.appendChild(row);
  });

  function valuesFor(kind) {
    return Array.from(monthlyData.querySelectorAll(`input[data-kind="${kind}"]`), input => {
      const value = input.valueAsNumber;
      return Number.isFinite(value) ? value : 0;
    });
  }

  document.getElementById("export-data").addEventListener("click", () => {
    const message = document.getElementById("export-message");
    if (typeof XLSX === "undefined") {
      message.textContent = "The Excel library could not be loaded. Check your internet connection and reload the page.";
      return;
    }

    const income = valuesFor("income");
    const expenses = valuesFor("expense");
    const rows = [
      ["Month", "Income", "Expenses"],
      ...months.map((month, index) => [month, income[index], expenses[index]])
    ];

    try {
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.aoa_to_sheet(rows);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Monthly Data");
      XLSX.writeFile(workbook, "bucks2bar-data.xlsx");
      message.textContent = "";
    } catch (error) {
      message.textContent = "Could not export the data. Please try again.";
      console.error("Excel export failed:", error);
    }
  });

  let financeChart;
  if (typeof Chart === "undefined") {
    chartMessage.textContent = "The chart library could not be loaded. Check your internet connection and reload the page.";
    downloadButton.disabled = true;
  } else {
    financeChart = new Chart(document.getElementById("finance-chart"), {
      type: "bar",
      data: {
        labels: months.map(month => month.slice(0, 3)),
        datasets: [
          { label: "Income", data: valuesFor("income"), backgroundColor: chartColors.dark.income, borderRadius: 4 },
          { label: "Expenses", data: valuesFor("expense"), backgroundColor: chartColors.dark.expenses, borderRadius: 4 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom", labels: { color: chartColors.dark.text, usePointStyle: true, padding: 24 } }
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: chartColors.dark.ticks } },
          y: { beginAtZero: true, grid: { color: chartColors.dark.grid }, ticks: { color: chartColors.dark.ticks } }
        }
      }
    });
  }

  themeToggle.addEventListener("click", () => {
    const light = document.body.classList.toggle("light-theme");
    themeToggle.setAttribute("aria-pressed", String(light));
    document.getElementById("theme-icon").textContent = light ? "🌙" : "☀️";
    themeToggle.title = light ? "Switch to dark mode" : "Switch to light mode";

    if (financeChart) {
      const colors = light ? chartColors.light : chartColors.dark;
      financeChart.data.datasets[0].backgroundColor = colors.income;
      financeChart.data.datasets[1].backgroundColor = colors.expenses;
      financeChart.options.plugins.legend.labels.color = colors.text;
      financeChart.options.scales.x.ticks.color = colors.ticks;
      financeChart.options.scales.y.ticks.color = colors.ticks;
      financeChart.options.scales.y.grid.color = colors.grid;
      financeChart.update("none");
    }
  });

  function updateChart() {
    if (!financeChart) return;
    financeChart.data.datasets[0].data = valuesFor("income");
    financeChart.data.datasets[1].data = valuesFor("expense");
    financeChart.update();
  }

  monthlyData.addEventListener("input", updateChart);

  const importButton = document.getElementById("import-data");
  const importFile = document.getElementById("import-file");
  const importMessage = document.getElementById("import-message");

  function setImportMessage(text, isError) {
    importMessage.className = `small mb-3 ${isError ? "text-danger" : "text-success"}`;
    importMessage.textContent = text;
  }

  importButton.addEventListener("click", () => importFile.click());

  importFile.addEventListener("change", async () => {
    const file = importFile.files[0];
    if (!file) return;

    importButton.disabled = true;
    setImportMessage("", false);
    try {
      if (typeof XLSX === "undefined") {
        setImportMessage("The Excel library could not be loaded. Check your internet connection and reload the page.", true);
        return;
      }
      if (!/\.(xlsx|xls)$/i.test(file.name)) {
        setImportMessage("Choose an Excel file with an .xlsx or .xls extension.", true);
        return;
      }

      let workbook;
      try {
        const bytes = await file.arrayBuffer();
        workbook = XLSX.read(bytes, { type: "array" });
      } catch (error) {
        setImportMessage("Could not read the Excel file. Check the file and try again.", true);
        console.error("Excel import failed:", error);
        return;
      }

      const sheetName = workbook.Sheets["Monthly Data"] ? "Monthly Data" : workbook.SheetNames[0];
      if (!sheetName) {
        setImportMessage("The Excel file does not contain a worksheet.", true);
        return;
      }

      const worksheet = workbook.Sheets[sheetName];
      if (Object.entries(worksheet).some(([address, cell]) => !address.startsWith("!") && cell.t === "e")) {
        setImportMessage("The worksheet contains an Excel error. Correct it and try again.", true);
        return;
      }

      let rows;
      try {
        rows = XLSX.utils.sheet_to_json(worksheet, {
          header: 1, raw: true, defval: "", blankrows: false
        });
      } catch (error) {
        setImportMessage("Could not read the worksheet. Check the file and try again.", true);
        console.error("Excel worksheet import failed:", error);
        return;
      }
      const headers = rows[0] || [];
      if (["Month", "Income", "Expenses"].some((header, index) =>
        typeof headers[index] !== "string" || headers[index].trim().toLowerCase() !== header.toLowerCase()
      )) {
        setImportMessage("The first row must contain Month, Income, and Expenses in that order.", true);
        return;
      }

      const imported = new Map();
      const numberPattern = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/;
      for (const row of rows.slice(1)) {
        const month = typeof row[0] === "string" ? row[0].trim().toLowerCase() : "";
        if (!months.some(name => name.toLowerCase() === month) || imported.has(month)) {
          setImportMessage("Use each full month name from January to December exactly once.", true);
          return;
        }

        const amounts = [row[1], row[2]].map(value => {
          if (value === undefined || value === null || (typeof value === "string" && value.trim() === "")) return 0;
          if (typeof value === "number") return value;
          if (typeof value === "string" && numberPattern.test(value.trim())) return Number(value.trim());
          return NaN;
        });
        if (!amounts.every(Number.isFinite)) {
          setImportMessage("Income and Expenses must contain numbers or be blank.", true);
          return;
        }
        imported.set(month, amounts);
      }
      if (imported.size !== months.length) {
        setImportMessage("The file must contain all 12 months, from January to December.", true);
        return;
      }

      if (!window.confirm("Replace all current monthly income and expense data with the imported values?")) {
        setImportMessage("Import cancelled. Your current data was not changed.", false);
        return;
      }

      const incomes = monthlyData.querySelectorAll('input[data-kind="income"]');
      const expenses = monthlyData.querySelectorAll('input[data-kind="expense"]');
      months.forEach((month, index) => {
        const amounts = imported.get(month.toLowerCase());
        incomes[index].value = String(amounts[0]);
        expenses[index].value = String(amounts[1]);
      });
      updateChart();
      setImportMessage("Imported all 12 months successfully.", false);
    } finally {
      importButton.disabled = false;
      importFile.value = "";
    }
  });

  document.getElementById("chart-tab").addEventListener("shown.bs.tab", () => {
    if (financeChart) financeChart.resize();
  });

  downloadButton.addEventListener("click", () => {
    if (!financeChart) return;

    const source = financeChart.canvas;
    const image = document.createElement("canvas");
    image.width = source.width;
    image.height = source.height;
    const context = image.getContext("2d");
    if (!context) {
      chartMessage.textContent = "Could not create the chart image. Please try again.";
      return;
    }
    context.fillStyle = getComputedStyle(document.querySelector(".surface")).backgroundColor;
    context.fillRect(0, 0, image.width, image.height);
    context.drawImage(source, 0, 0);

    try {
      const link = document.createElement("a");
      link.download = "bucks2bar-chart.png";
      link.href = image.toDataURL("image/png");
      link.click();
      chartMessage.textContent = "";
    } catch (error) {
      chartMessage.textContent = "Could not download the chart. Please try again.";
      console.error("Chart export failed:", error);
    }
  });

  const usernameInput = document.getElementById("username");
  const usernameMessage = document.getElementById("username-message");

  usernameInput.addEventListener("input", () => {
    usernameInput.removeAttribute("aria-invalid");
    usernameInput.classList.remove("is-valid", "is-invalid");
    usernameMessage.textContent = "";
  });

  document.getElementById("username-form").addEventListener("submit", event => {
    event.preventDefault();
    const valid = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9\s]).{5,}$/.test(usernameInput.value);

    usernameInput.setAttribute("aria-invalid", String(!valid));
    usernameInput.classList.toggle("is-valid", valid);
    usernameInput.classList.toggle("is-invalid", !valid);
    usernameMessage.className = `small mt-2 ${valid ? "text-success" : "text-danger"}`;
    usernameMessage.textContent = valid
      ? "Username is valid!"
      : "Username must be at least 5 characters and include an uppercase letter, a number, and a special character.";
  });
}

function initializeRegistration() {
  const form = document.getElementById("register-form");
  const password = document.getElementById("register-password");
  const confirmation = document.getElementById("register-confirm-password");
  const message = document.getElementById("register-message");

  form.addEventListener("input", () => {
    confirmation.removeAttribute("aria-invalid");
    message.textContent = "";
  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    if (password.value !== confirmation.value) {
      confirmation.setAttribute("aria-invalid", "true");
      message.textContent = "Passwords do not match.";
      confirmation.focus();
      return;
    }

    message.textContent = "This is a demo. No account was created and no information was saved.";
  });

  document.getElementById("register-fields").disabled = false;
}

if (document.getElementById("monthly-data")) {
  initializeDashboard();
} else if (document.getElementById("register-form")) {
  initializeRegistration();
}
