var dataset = [
    ["Name", "Firepower", "Armor", "W.Range", "Sight", "MP", "Group", "Speed", "Feul", "Reload", "Catagery", "Type"],
    ["Rhino", "24-6000", "200", "6", "9", "10", "7", "2","5", "6", "Land", "Artillery"],
    ["BM-21", "10", "500", "50", "8", "27", "3", "600", "8", "27", "Land", "Fodders"],
    ["Vab", "10", "500", "100", "8", "19", "2", "600", "8", "27", "Amphibious", "Fodders"],
    ["IBoat", "25", "1000", "800", "8", "27", "3", "600", "8", "27", "Water", "Fodders"],
    ["Stormers", "25", "1201", "600", "8", "27", "3", "600", "8", "27", "Land", "Anti-Air"]
];

function filterTable() {
    var input = document.getElementById("query").value.toLowerCase();
    var container = document.getElementById("table");
    container.innerHTML = ""; // Clear previous content

    for (var i = 0; i < dataset.length; i++) {
        var row = dataset[i];

        // Show all rows if input is empty, or show matching rows
        if (input === "" || i === 0 || row.join(" ").toLowerCase().includes(input)) {
            var rowDiv = document.createElement("div");
            rowDiv.className = "row";

            for (var j = 0; j < row.length; j++) {
                var cell = row[j];
                var div = document.createElement("div");
                div.className = "cell" + (i === 0 ? " header" : "");
                div.textContent = cell;
                rowDiv.appendChild(div);
            }

            container.appendChild(rowDiv);
        }
    }
}

window.onload = function table() {
    var container = document.getElementById("table");
    container.innerHTML = ""; 

    for (var i = 0; i < dataset.length; i++) {
        var row = dataset[i];
        var rowDiv = document.createElement("div");
        rowDiv.className = "row";

        for (var j = 0; j < row.length; j++) {
            var cell = row[j];
            var div = document.createElement("div");
            div.className = "cell" + (i === 0 ? " header" : "");
            div.textContent = cell;
            rowDiv.appendChild(div);
        }
        container.appendChild(rowDiv);
    }
}

/*
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
            var level = user.level;
        } else {
            document.getElementById("output").textContent = "Incorrect password.";
        }
    } else {
        document.getElementById("output").textContent = "User not found.";
    }

    document.getElementById("user").value = "";
    document.getElementById("pass").value = "";
};*/
