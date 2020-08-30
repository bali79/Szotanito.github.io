document.querySelector("#regButton").addEventListener("click", function (ev) {
    ev.preventDefault();
    if (validateForm()) {
        getServerData(`http://localhost:3000/users`).then(
            data => getEmailAddress(data)
        );
    }
})

// Keys of users.
let keys = ["id", "name", "email", "password"];

//Üres mező figyelmeztetés
function validateForm() {
    var n = document.querySelector("#name").value;
    var e = document.querySelector("#email").value;
    var j = document.querySelector("#password").value;
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (n == "" || n == null || e == "" || e == null || j == "" || j == null) {
        alert("Kérlek töltsd ki a kötelező mezőket!");
        return false;
    }
    if (e.match(mailformat)) {
        return true;
    }
    else {
        alert("Nem jó e-mail formátum!");
        return false;
    }
}

//E-mail ellenőrzése
function ValidateEmail(inputText) {
    var e = document.querySelector("#email").value;
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (e.match(mailformat)) {
        document.form1.text1.focus();
        return true;
    }
    else {
        alert("Nem jó e-mail formátum!");
        document.form1.text1.focus();
        return false;
    }
}

//Űrlap események
function regDataSend() {
    let inputs = document.querySelectorAll("input");
    let data = {};
    for (let i = 0; i < inputs.length; i++) {
        data[inputs[i].name] = inputs[i].value;
    }
    data.eredmény = [];
    data.hibák = [];
    let fetchOptions = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    fetch(`http://localhost:3000/users`, fetchOptions).then(
        resp => resp.json(),
        err => console.error(err)
    );
    sendEmail(data);
    alert("Sikeres regisztráció!");
}

//Figyelmeztetés kötelező mezők eltüntetése
let alertCloseButton = document.querySelectorAll(".close[data-dismiss='alert']");
let alertCloseEventHandlerFunction = function (ev) {
    this.parentElement.style.display = "none";
}
for (let i = 0; i < alertCloseButton.length; i++) {
    alertCloseButton[i].addEventListener("click", alertCloseEventHandlerFunction);
}

//Szerver adatok fogadása
function getServerData(url) {
    let fetchOptions = {
        method: "GET",
        mode: "cors",
        cache: "no-cache"
    };

    return fetch(url, fetchOptions).then(
        response => response.json(),
        err => console.error(err)
    );
}

//Felhasználó adatainak bekérése
function getDataFromPage() {
    let inputsEmail = document.querySelector("#email");
    emailAddress = inputsEmail.value;
}

//Adatok összehasonlítása
function getEmailAddress(data) {
    flagA = false;
    for (let row of data) {
        console.log(row)
        for (let k of keys) {
            if (emailAddress == row[k]) {
                alert("Már van ilyen e-mail cím!");
                flagA = true;
                break;
            }
        }
    }
    if (!flagA) {
        regDataSend();
    }
}

//Átváltás másik weboldalra
document.querySelector("#bejMenu").addEventListener("click", function (ev) {
    ev.preventDefault();
    window.location.href = "Bejelentkezés.html";
})

//Email küldése
function sendEmail(data) {
    szoveg = "Angol szótanító weboldaladon regisztráció történt. " + "<br></br>" + "<br></br>" + "Név: " + data.name + "<br></br>" + "E-mail cím: " + data.email;
    Email.send({
        SecureToken: "c3ccd49a-56df-4b7b-945b-a7c2aa73845e",
        From: "weboldalemail79@gmail.com",
        To: 'litro79@gmail.com',
        Subject: "Regisztráció a szótanító weboldalon.",
        Body: szoveg,
    })
        .then(function (message) {
            window.location.href = "Bejelentkezés.html";
        });
}