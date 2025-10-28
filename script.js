var dataset = [
    ["Name", "Firepower", "Armor", "W.Range", "Sight", "MP", "Group", "Speed", "Feul", "Reload", "Catagery", "Type"],
    ["Rhino", "24-6000", "200", "6", "9", "10", "7", "2", "5", "6", "Land", "Artillery"],
    ["BM-21", "10", "500", "50", "8", "27", "3", "600", "8", "27", "Land", "Fodders"],
    ["Vab", "10", "500", "100", "8", "19", "2", "600", "8", "27", "Amphibious", "Fodders"],
    ["IBoat", "25", "1000", "800", "8", "27", "3", "600", "8", "27", "Water", "Fodders"],
    ["Stormers", "25", "1201", "600", "8", "27", "3", "600", "8", "27", "Land", "Anti-Air"]
];

let currentSort = {
    column: null,
    ascending: true
};

function renderTable(data) {
    const container = document.getElementById("table");
    container.innerHTML = "";

    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        const rowDiv = document.createElement("div");
        rowDiv.className = "row";

        for (let j = 0; j < row.length; j++) {
            const cell = row[j];
            const div = document.createElement("div");
            div.className = "cell" + (i === 0 ? " header" : "");

            if (i === 0) {
                const label = document.createElement("span");
                label.textContent = cell;

                const button = document.createElement("button");
                button.className = "sort-btn";

                // Show sort direction if this column is currently sorted
                if (currentSort.column === j) {
                    button.textContent = currentSort.ascending ? "^" : "V";
                } else {
                    button.textContent = "|";
                }

                button.onclick = function () {
                    sortByColumn(j);
                };

                div.appendChild(label);
                div.appendChild(button);
            } else {
                div.textContent = cell;
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
    const input = document.getElementById("query").value.toLowerCase();
    const filtered = dataset.filter((row, index) => {
        return index === 0 || row.join(" ").toLowerCase().includes(input);
    });

    renderTable(filtered);
}

window.onload = function () {
    renderTable(dataset);
};

var users = [
    {username: "guest", password: "Thanks", level: "default"},
    {username: "alex", password: "hackeis@12ohio", level: "admin"}, 
    {username: "sana", password: "thx4help@12ohio", level: "contributer"}, 
];

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

function check() {
    const fieldIds = [
        "Name", "Firepower", "Armor", "WRange", "Sight", "MP",
        "Group", "Speed", "Feul", "Reload", "Catagery", "Type"
    ];

    const values = fieldIds.map(id => document.getElementById(id).value.trim());

    if (values.every(v => v !== "")) {
        const newEntry = `[${values.map(v => `"${v}"`).join(", ")}]`;
        const JScodeElement = document.getElementById("JScode");
        const current = JScodeElement.textContent.trim();

        JScodeElement.textContent = current ? current + ', ' + newEntry : newEntry;

        fieldIds.forEach(id => document.getElementById(id).value = "");
    }
}

function copy() {
    const text = document.getElementById("JScode").innerText;
    // Get the text field
    var copyText = document.getElementById("myInput");

    // Select the text field
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices

    // Copy the text inside the text field
    navigator.clipboard.writeText(copyText.value);

    // Alert the copied text
    alert("Copied the text: " + copyText.value);
    document.getElementById("JScode").textContent = "Copied the text: " + copyText.value;
}
