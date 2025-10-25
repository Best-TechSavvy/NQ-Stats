var dataset = [
    ["Name", "MP", "firepower", "Armor", "W.Range", "Speed", "Catagery"],
    ["Rhino", "10", "550", "200", "6", "2-3", "Land"],
    ["Vab", "10", "Land"]
];

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
};
