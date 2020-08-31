// Keys of users.
let keys = ["id", "name", "email", "password"];

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
    let inputsPassword = document.querySelector("#password");
    userPassword = inputsPassword.value;
}

document.querySelector("#btn").addEventListener("click", function () {
    //getServerData(`http://localhost:3000/users`).then(
    getServerData(`https://github.com/bali79/bali79.github.io/blob/master/db/db.json/users`).then(
        data => getEmailAddress(data)
    );
})

//Adatok összehasonlítása
function getEmailAddress(data) {
    flagC = false;
    for (let row of data) {
        flagA = false;
        flagB = false;
        for (let k of keys) {
            if (emailAddress == row[k]) {
                flagA = true;
            }
            if (userPassword == row[k]) {
                flagB = true;
            }
            if (flagA && flagB) {
                flagC = true;
                localStorage.setItem("user", emailAddress);
                
                window.location.href = "feladatok.html";
            }
        }
    }
    if (!flagC) {
        alert("Nincs ilyen felhasználó, vagy nem megfelelő a jelszó!");
    }
}

//Enter figyelése
var entPass = document.getElementById("password");
entPass.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
   event.preventDefault();
   document.getElementById("btn").click();
  }
});

function showPassword() {
    var x = document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }