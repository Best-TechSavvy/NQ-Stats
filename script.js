//important lists are bellow
var vehicle = [
  ["Name", "Firepower", "Armor", "W.Range", "Sight", "MP", "Group", "Speed", "T-Fuel", "Reload", "Category", "Type", "Steel", "Aluminum", "B-Fuel", "Special"],
  ["Rhino", "24-6000", "200", "6", "9", "10", "7", "2", "5", "6", "Land", "Artillery", "45000", "35000", "5750", "3x bases"],
  ["KA-50", "70-17500", "6000", "18", "25", "3650", "1", "5", "250", "0", "Heli", "Artillery", "550000", "2750000", "0", "2x firing"],
  ["Astros", "1800-450000", "750", "24", "25", "4500", "1", "2.5", "25", "20", "Land", "Artillery", "9,750,000", "2,750,000", "0", "3x bases"], 
  ["Smerch", "1000-250000", "500", "21", "21", "2900", "1", "1.5", "150", "4", "Land", "Artillery", "1,650,00", "775,000", "0", "3x bases"], 
  ["C1", "2350", "6000", "12", "11", "70", "7", "2", "55", "5", "Land", "Anti-fodder", "950,000", "250,000", "0", "1.5x firing"],
  ["BM-21", "10", "500", "50", "8", "27", "3", "600", "8", "27", "Land", "Fodders", "50000", "70000", "4000", "1.5x firing"],
  ["Vab", "10", "500", "100", "8", "19", "2", "600", "8", "27", "Amphibious", "Fodders", "50000", "70000", "4000", "Air attackable"],
  ["IBoat", "25", "1000", "800", "8", "27", "3", "600", "8", "27", "Water", "Fodders", "50000", "70000", "4000", "Air attackable"],
  ["Stormers", "25", "1201", "600", "8", "27", "3", "600", "8", "27", "Land", "Anti-Air", "50000", "70000", "4000", "3x Air"]
];

var flak = [
  ["Level", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"], 
  ["Armor", "1", "2", "2", "2", "3", "3", "3", "4", "4", "5", "5", "6"], 
  ["Weapon", "1", "1", "1", "2", "2", "2", "4", "4", "6", "6", "8", "10"], 
  ["Min.Ran", "8", "8", "9", "9", "9", "10", "10", "10", "10", "10", "10", "10"], 
  ["Max.Ran", "10", "10", "11", "11", "11", "12", "12", "13", "14", "14", "14", "14"], 
  ["Build-Cost", "0", "9", "19", "29", "49", "99", "199", "299", "499", "999", "1999", "2999"],
  ["Recov-Cost", "0", "1", "3", "5", "9", "19", "29", "49", "69", "99", "149", "199"]
];

var users = [
    {username: "27ec 1030 1423 136f c4c 22a9 7b6 2934 27ec 1030 1423", password: "27ec 1030 1423 271a 35a6 118a 1498 2646 7b6 27ec 1030 1423", level: "default"},
    {username: "27ec 1030 1423 118a 22ce 22a9 18f8 27ec 1030 1423", password: "27ec 1030 1423 35a6 118a 2acf 2646 22a9 3531 7b6 e04 16f 2b80 2239 35a6 3531 2239 27ec 1030 1423", level: "admin"}, 
    {username: "27ec 1030 1423 7b6 118a 1498 118a 27ec 1030 1423", password: "27ec 1030 1423 2934 35a6 18f8 22fe 35a6 22a9 22ce 69e e04 16f 2b80 2239 35a6 3531 2239 27ec 1030 1423", level: "contributer"}, 
];
//important lists are above

//homepage code is bellow
var maxVisibleColumns = 8;
let visibleColumns = [];

let currentSort = {
  column: null,
  ascending: true
};

function createColumnSelectors(div) {
  const selectorContainer = document.getElementById(div);
  const headers = vehicle[0];
  selectorContainer.innerHTML = ""; // Clear existing
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
                label.textContent = row[j];

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
                    div.textContent = row[j];
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
    const typeOptions = ["Type", "Artillery", "Fodders", "Anti-Air", "Anti-tank", "Anti-fodder", "Stealth", "Detector"];

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
        } else {
          const input = document.createElement("input");
          input.className = "intext";

          // Check if field should be numeric
          const numericFields = ["MP", "Group", "Steel", "Aluminum", "B-Fuel"];
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
            const input = document.getElementById(id);
            if (input) input.value = "";
        });
    }
}

function copy() {
    const text = document.getElementById("JScode").textContent;

    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            alert("Copied the text: " + text);
        }).catch(err => {
            fallbackCopy(text);
        });
    } else {
      const tempInput = document.createElement("textarea");
      tempInput.value = text;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
      alert("Copied the text: " + text);
    }
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

window.onload = function(){load();}
//onload sectoin is above


