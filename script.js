//important lists are bellow
let vehicle = [];
let flak = [];
let users = [];

async function loadGameData() {
  try {
    console.log("Fetching game data...");
    const response = await fetch('./data.json');

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const gameData = await response.json();
    vehicle = gameData.vehicle || [];
    flak = gameData.flak || [];
    users = gameData.users || [];

    console.log("Game data loaded successfully.");
    return { vehicle, flak, users };
  } catch (error) {
    console.error("Error fetching game data:", error);
    return { vehicle: [], flak: [], users: [] };
  }
}
//important lists are above

//homepage code is bellow
var maxVisibleColumns = 8;
let visibleColumns = [];
const CELL_BREAK_MARKER = ",,,";

function renderCellText(element, value) {
  String(value).split(CELL_BREAK_MARKER).forEach((part, index, parts) => {
    if (index > 0) {
      element.appendChild(document.createElement("br"));
    }
    element.appendChild(document.createTextNode(part));
  });
}

let currentSort = {
  column: null,
  ascending: true
};

function createColumnSelectors(div) {
  const selectorContainer = document.getElementById(div);
  const headers = vehicle[0] || [];
  selectorContainer.innerHTML = ""; // Clear existing
  visibleColumns = [];

  headers.forEach((header, index) => {
    const label = document.createElement("label");
    label.style.marginRight = "10px";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = index;
    checkbox.checked = index < maxVisibleColumns;

    if (checkbox.checked) visibleColumns.push(index);

    checkbox.onchange = function () {
      if (checkbox.checked) {
        if (visibleColumns.length < maxVisibleColumns) {
          visibleColumns.push(index);
        } else {
          checkbox.checked = false;
          alert("You can only select up to "+ maxVisibleColumns +" columns.");
        }
      } else {
        visibleColumns = visibleColumns.filter(i => i !== index);
      }
      filterTable(); // Re-filter and render
    };

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(" " + header));
    selectorContainer.appendChild(label);
  });
}

function renderTable(data) {
    const container = document.getElementById("vehicletable");
    container.innerHTML = "";

    // Create wrapper for rows
    const wrapper = document.createElement("div");
    wrapper.className = "table-wrapper";

    // Set grid columns dynamically based on visible columns
    wrapper.style.display = "grid";
    wrapper.style.gridAutoFlow = "row";
    wrapper.style.gridTemplateColumns = visibleColumns.map(() => "minmax(1px, auto)").join(" ");

    // Render rows
    data.forEach((row, i) => {
        const rowDiv = document.createElement("div");
        rowDiv.style.display = "contents"; // So grid children align properly

        visibleColumns.forEach(j => {
            const div = document.createElement("div");
            div.className = "cell" + (i === 0 ? " header" : "");

            if (i === 0) {
                // Header cell: text left, sort button right
                const headerWrapper = document.createElement("div");
                headerWrapper.style.display = "flex";
                headerWrapper.style.justifyContent = "space-between";
                headerWrapper.style.alignItems = "center";

                const label = document.createElement("span");
                renderCellText(label, row[j]);

                const button = document.createElement("button");
                button.className = "sort-btn";
                button.textContent = currentSort.column === j ? (currentSort.ascending ? "^" : "v") : "=";
                button.onclick = function () {
                    sortByColumn(j);
                };

                headerWrapper.appendChild(label);
                headerWrapper.appendChild(button);
                div.appendChild(headerWrapper);
            } else {
                // Format numbers with commas if numeric
                if (!isNaN(row[j]) && row[j].trim() !== "") {
                    div.textContent = Number(row[j]).toLocaleString();
                } else {
                  renderCellText(div, row[j]);
                }
            }

            rowDiv.appendChild(div);
        });

        wrapper.appendChild(rowDiv);
    });

    container.appendChild(wrapper);
}

function sortByColumn(colIndex) {
  const header = vehicle[0];
  const rows = vehicle.slice(1);

  if (currentSort.column === colIndex) {
    currentSort.ascending = !currentSort.ascending;
  } else {
    currentSort.column = colIndex;
    currentSort.ascending = true;
  }

  const isNumeric = !isNaN(rows[0][colIndex]);
  const sortedRows = rows.sort((a, b) => {
    let valA = a[colIndex];
    let valB = b[colIndex];

    if (isNumeric) {
      valA = parseFloat(valA);
      valB = parseFloat(valB);
    }

    if (valA < valB) return currentSort.ascending ? -1 : 1;
    if (valA > valB) return currentSort.ascending ? 1 : -1;
    return 0;
  });

  renderTable([header, ...sortedRows]);
}

function filterTable() {
  const input = document.getElementById("query")?.value.toLowerCase() || "";
  const filtered = vehicle.filter((row, index) => {
    return index === 0 || row.join(" ").toLowerCase().includes(input);
  });
  renderTable(filtered);
}

//homepage code is above

//logon.html code is bellow
function rsaEncrypt(plaintext, e, n, padding = null) {
    e = BigInt(e);
    n = BigInt(n);

    // Apply padding if provided
    if (padding && padding.length > 0) {
        plaintext = padding + plaintext + padding;
    }

    // Determine dynamic block size based on n
    let maxBlockValue = n;
    let blockSize = 1;
    let testValue = 256n;
    while (testValue < maxBlockValue) {
        blockSize++;
        testValue *= 256n;
    }
    blockSize--; // Last valid size

    let cipher = "";
    for (let i = 0; i < plaintext.length; i += blockSize) {
        let block = plaintext.slice(i, i + blockSize);

        // Inline blockToBigInt
        let blockInt = 0n;
        for (let j = 0; j < block.length; j++) {
            blockInt = blockInt * 256n + BigInt(block.charCodeAt(j));
        }

        // Inline modPow
        let base = blockInt % n;
        let exponent = e;
        let result = 1n;
        while (exponent > 0n) {
            if (exponent % 2n === 1n) {
                result = (result * base) % n;
            }
            exponent = exponent / 2n;
            base = (base * base) % n;
        }

        cipher += result.toString(16) + " ";
    }
    return cipher.trim();
}

function submit() {
    var username = document.getElementById("user").value;
    var password = document.getElementById("pass").value;
    var output = document.getElementById("output");
    username = rsaEncrypt(username, 23, 14351, "XYZ");
    password = rsaEncrypt(password, 23, 14351, "XYZ");

    const user = users.find(user => user.username.toLowerCase() == username.toLowerCase());
    if (user) {
        if (user.password === password) {
            document.getElementById("output").textContent = "Login successful!";
            output.style.color = "green";
            var level = user.level;
        } else {
            document.getElementById("output").textContent = "Incorrect password.";
            output.style.color = "red";
        }
    } else {
        document.getElementById("output").textContent = "User not found.";
        output.style.color = "red";
    }

    document.getElementById("user").value = "";
    document.getElementById("pass").value = "";
};
//logon.html code is above

//form.html code is bellow
function renderform() {
    var select = document.getElementById("fintext");
    select.innerHTML = "";

    const categoryOptions = ["Category", "Land", "Water", "Heli", "Plane", "Amphibious"];
    const typeOptions = ["Type", "Artillery", "Fodders", "Anti-Air", "Anti-tank", "Anti-fodder", "Stealth", "Detector", "Ammo"];
    const specialOptions = ["Special", "Multi-Target", "1.5x firing", "2x firing", "3x bases", "3x Air", "Air attackable", "None"];
	const baseOptions = ["Base", "Home", "Water", "Land", "Air", "Water-Heli", "Land-Heli"];

    vehicle[0].forEach(field => {
        const wrapper = document.createElement("div");
        wrapper.className = "input-wrapper";

        if (field === "Category") {
            const dropdown = document.createElement("select");
            dropdown.className = "dropdown";
            dropdown.id = field;
            dropdown.name = field;
            categoryOptions.forEach(option => {
                const opt = document.createElement("option");
                dropdown.className = "dropdown";
                opt.value = option;
                opt.textContent = option;
                dropdown.appendChild(opt);
            });
            wrapper.appendChild(dropdown);
        } else if (field === "Type") {
            const dropdown = document.createElement("select");
            dropdown.className = "dropdown";
            dropdown.id = field;
            dropdown.name = field;
            typeOptions.forEach(option => {
                const opt = document.createElement("option");
                opt.className = "dropdown";
                opt.value = option;
                opt.textContent = option;
                dropdown.appendChild(opt);
            });
            wrapper.appendChild(dropdown);
        } else if (field === "Special") {
          wrapper.id = field;
          wrapper.className = "input-wrapper checkbox-dropdown";

          const dropdownButton = document.createElement("button");
          dropdownButton.type = "button";
          dropdownButton.className = "dropdown checkbox-dropdown-button";
          dropdownButton.textContent = "Special";

          const optionsMenu = document.createElement("div");
          optionsMenu.className = "checkbox-dropdown-menu";
          optionsMenu.hidden = true;

          dropdownButton.onclick = () => {
            optionsMenu.hidden = !optionsMenu.hidden;
          };

          specialOptions.slice(1).forEach(option => {
            const optionLabel = document.createElement("label");
            optionLabel.className = "checkbox-option";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.name = field;
            checkbox.value = option;
            checkbox.onchange = () => {
              const selected = Array.from(optionsMenu.querySelectorAll("input:checked"))
                .map(input => input.value);
              dropdownButton.textContent = selected.length > 0 ? selected.join(", ") : "Special";
            };

            optionLabel.appendChild(checkbox);
            optionLabel.appendChild(document.createTextNode(option));
            optionsMenu.appendChild(optionLabel);
          });

          wrapper.appendChild(dropdownButton);
          wrapper.appendChild(optionsMenu);
		} else if (field === "Base") {
          wrapper.id = field;
          wrapper.className = "input-wrapper checkbox-dropdown";

          const dropdownButton = document.createElement("button");
          dropdownButton.type = "button";
          dropdownButton.className = "dropdown checkbox-dropdown-button";
          dropdownButton.textContent = "Base";

          const optionsMenu = document.createElement("div");
          optionsMenu.className = "checkbox-dropdown-menu";
          optionsMenu.hidden = true;

          dropdownButton.onclick = () => {
            optionsMenu.hidden = !optionsMenu.hidden;
          };

          baseOptions.slice(1).forEach(option => {
            const optionLabel = document.createElement("label");
            optionLabel.className = "checkbox-option";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.name = field;
            checkbox.value = option;
            checkbox.onchange = () => {
              const selected = Array.from(optionsMenu.querySelectorAll("input:checked"))
                .map(input => input.value);
              dropdownButton.textContent = selected.length > 0 ? selected.join(", ") : "Base";
            };

            optionLabel.appendChild(checkbox);
            optionLabel.appendChild(document.createTextNode(option));
            optionsMenu.appendChild(optionLabel);
          });

          wrapper.appendChild(dropdownButton);
          wrapper.appendChild(optionsMenu);
        } else {
			const input = document.createElement("input");
			input.className = "intext";

			// Check if field should be numeric
			const numericFields = ["MP", "Group", "Steel", "Aluminum", "B-Fuel", "Ammo"];
			input.type = numericFields.includes(field) ? "number" : "text";

			input.id = field;
			input.name = field;
			input.placeholder = field;
			wrapper.appendChild(input);
        }

        select.appendChild(wrapper);
    });
}

function check() {
    const fieldIds = vehicle[0];
    const values = fieldIds.map(id => {
        const checkboxGroup = document.getElementById(id);
        if (checkboxGroup?.classList.contains("checkbox-dropdown")) {
            return Array.from(checkboxGroup.querySelectorAll('input[type="checkbox"]:checked'))
                .map(input => input.value)
                .join(",,,");
        }

        const input = document.getElementById(id);
        return input ? input.value.trim() : "";
    });


    // Only proceed if all fields are filled
    if (values.every(v => v !== "")) {
        const newEntry = `[${values.map(v => `"${v}"`).join(", ")}]`;
        const JScodeElement = document.getElementById("JScode");

        // Always add a comma before the new entry
        JScodeElement.textContent += ', ' + newEntry;

        // Clear all input fields
        fieldIds.forEach(id => {
          const checkboxGroup = document.getElementById(id);
          if (checkboxGroup?.classList.contains("checkbox-dropdown")) {
            checkboxGroup.querySelectorAll('input[type="checkbox"]').forEach(input => {
              input.checked = false;
            });
            checkboxGroup.querySelector(".checkbox-dropdown-button").textContent = id;
            return;
          }

          const input = document.getElementById(id);
          if (input) input.value = "";
        });
    }
}

async function copy() {
  const output = document.getElementById("JScode");
  const text = output ? output.textContent : "";

  if (!text) {
    alert("There is nothing to copy.");
    return;
  }

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      throw new Error("Clipboard API unavailable");
    }
  } catch (error) {
    const tempInput = document.createElement("textarea");
    tempInput.value = text;
    tempInput.setAttribute("readonly", "");
    tempInput.style.position = "fixed";
    tempInput.style.opacity = "0";
    document.body.appendChild(tempInput);
    tempInput.focus();
    tempInput.select();

    const copied = document.execCommand("copy");
    document.body.removeChild(tempInput);

    if (!copied) {
      alert("Copy failed. Please select and copy the text manually.");
      return;
    }
  }

  alert("Copied successfully.");
}
//form.html code is above

//flak.html code is bellow 
function renderflakTab(data) {
  const container = document.getElementById("flaktable");
  container.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.className = "table-wrapper";
  wrapper.style.display = "grid";
  wrapper.style.gridAutoFlow = "row";

  // Use all columns in flak data
  const columnCount = data[0].length;
  wrapper.style.gridTemplateColumns = `repeat(${columnCount}, minmax(1px, auto))`;

  data.forEach((row, i) => {
    const rowDiv = document.createElement("div");
    rowDiv.style.display = "contents";

    row.forEach((cell) => {
      const div = document.createElement("div");
      div.className = "cell" + (i === 0 ? " header" : "");
      div.textContent = cell;
      rowDiv.appendChild(div);
    });

    wrapper.appendChild(rowDiv);
  });

  container.appendChild(wrapper);
}
//flak.html code is above 

//phone object bellow
function more(){
  var sepnav = document.getElementById("sepnav");
  var basic = document.getElementById("basic");
  sepnav.style.display = "block";
  basic.style.display = "none";
}

function exit(){
  var sepnav = document.getElementById("sepnav");
  var basic = document.getElementById("basic");
  sepnav.style.display = "none";
  basic.style.display = "block";
}
//phone object above

// onload sectoin is bellow
function load() {
  var screen = "computer";
  var width = window.innerWidth;
  var phone = ["sepnav", "sepbtn"]
  var computer = ["formbtn", "logbtn", "compselect", "flakbtn"]

  if (width < 768) {
    screen = "phone";
    maxVisibleColumns = 4;
  } else if(width < 1200) {
    screen = "computer";
    maxVisibleColumns = 6;
  } else {
    screen = "computer";
    maxVisibleColumns = 8; 
  }

  // Run page-specific functions
  if (window.location.pathname.includes("form.html")) {
    renderform();
  } else if (window.location.pathname.includes("flak.html")) {
    renderflakTab(flak);
  } else if (window.location.pathname.includes("logon.html")) {
    // Add logon-specific logic here if needed
  } else {
    if (screen === "computer"){
      for (let i = 0; i < phone.length; i++) {
        document.getElementById(phone[i]).style.display = "none";
      }
      for (let i = 0; i < computer.length; i++) {
        document.getElementById(computer[i]).style.display = "block";
      }
      createColumnSelectors("column-selectors");
      filterTable();
    }
    if (screen === "phone"){
      for (let i = 0; i < phone.length; i++) {
        document.getElementById(phone[i]).style.display = "block";
      }
      for (let i = 0; i < computer.length; i++) {
        document.getElementById(computer[i]).style.display = "none";
      }
      maxVisibleColumns = 4;
      createColumnSelectors("phone-select");
      filterTable();
      exit();
    }
  }
};

async function initApp() {
  await loadGameData();
  load();
}

window.onload = initApp;
//onload sectoin is above
