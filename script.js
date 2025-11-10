//important lists are bellow
var dataset = [
  ["Name", "Firepower", "Armor", "W.Range", "Sight", "MP", "Group", "Speed", "Feul", "Reload", "Category", "Type", "Steel", "Aluminum", "Fuel", "Special"],
  ["Rhino", "24-6000", "200", "6", "9", "10", "7", "2", "5", "6", "Land", "Artillery", "45000", "35000", "5750", "3x bases"],
  ["KA-50", "70-17500", "6000", "18", "25", "3650", "1", "5", "250", "0", "N/A", "N/A", "550000", "2750000", "0", "N/A"],
  ["BM-21", "10", "500", "50", "8", "27", "3", "600", "8", "27", "Land", "Fodders", "50000", "70000", "4000", "1.5x firing"],
  ["Vab", "10", "500", "100", "8", "19", "2", "600", "8", "27", "Amphibious", "Fodders", "50000", "70000", "4000", "Air attackable"],
  ["IBoat", "25", "1000", "800", "8", "27", "3", "600", "8", "27", "Water", "Fodders", "50000", "70000", "4000", "Air attackable"],
  ["Stormers", "25", "1201", "600", "8", "27", "3", "600", "8", "27", "Land", "Anti-Air", "50000", "70000", "4000", "3x Air"]
];

var users = [
    {username: "guest", password: "Thanks", level: "default"},
    {username: "alex", password: "hackeis@12ohio", level: "admin"}, 
    {username: "sana", password: "thx4help@12ohio", level: "contributer"}, 
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
  const headers = dataset[0];
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
  const container = document.getElementById("table");
  container.innerHTML = "";

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const rowDiv = document.createElement("div");
    rowDiv.className = "row";

    for (let j = 0; j < dataset[0].length; j++) {
      if (!visibleColumns.includes(j)) continue;

      const cell = row[j];
      const div = document.createElement("div");
      div.className = "cell" + (i === 0 ? " header" : "");

      if (i === 0) {
        const label = document.createElement("span");
        label.textContent = cell;

        const button = document.createElement("button");
        button.className = "sort-btn";
        button.textContent = currentSort.column === j ? (currentSort.ascending ? "^" : "V") : "";
        button.onclick = function () {
          sortByColumn(j);
        };

        div.appendChild(label);
        div.appendChild(button);
      } else {
        // Format numbers with commas if numeric
        if (!isNaN(cell) && cell.trim() !== "") {
          div.textContent = Number(cell).toLocaleString();
        } else {
          div.textContent = cell;
        }
      }

      rowDiv.appendChild(div);
    }

    container.appendChild(rowDiv);
  }
}

function sortByColumn(colIndex) {
  const header = dataset[0];
  const rows = dataset.slice(1);

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
  const filtered = dataset.filter((row, index) => {
    return index === 0 || row.join(" ").toLowerCase().includes(input);
  });
  renderTable(filtered);
}

//homepage code is above

//logon.html code is bellow
function submit() {
    var username = document.getElementById("user").value;
    var password = document.getElementById("pass").value;
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
    dataset[0].forEach(field => {
        const wrapper = document.createElement("div");
        wrapper.className = "input-wrapper";

        const input = document.createElement("input");
        input.className = "intext";
        input.type = "text";
        input.id = field;
        input.name = field;
        input.placeholder = field;

        wrapper.appendChild(input);
        select.appendChild(wrapper);
    });
}
function check() {
    const fieldIds = dataset[0];
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
  var computer = ["formbtn", "logbtn", "compselect"]

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





