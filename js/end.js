good = localStorage.getItem("good");
bad = localStorage.getItem("bad");

console.log(good);
console.log(bad);
emailAddress = localStorage.getItem("user");

document.getElementById("good").innerHTML = good;
document.getElementById("bad").innerHTML = bad;

getServerData(`http://localhost:3000/users`).then(
    data => getScoreDataFromDb(data)
);

let keys = ["id", "name", "email", "password", "eredmény", "hibák"];

// Get data from server.
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

//Server adatok listázása adott e-mail alapján
function getScoreDataFromDb(data) {
    for (let row of data) {
        for (let k of keys) {
            if (emailAddress == row[k]) {
                console.log(row);
                if (k = "eredmény"){
                    updateServerData(row);
                    document.getElementById("goodAll").innerHTML = row[k][0];
                    document.getElementById("badAll").innerHTML = row[k][1];
                }
                if (k = "hibák"){
                    splitHibak(row[k]);
                    //document.getElementById("hibak").innerHTML = row[k];
                }
            }
        }
    }
}

//Eredmény elküldése
function updateServerData(row) {
    let data = row;
    data.eredmény[0] = Number(data.eredmény[0]) + Number(good);
    data.eredmény[1] = Number(data.eredmény[1]) + Number(bad);
    data.hibák = data.hibák;
    let fetchOptions = {
        method: "PUT",
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(data)
    };

    fetch(`http://localhost:3000/users/${data.id}`, fetchOptions).then(
        resp => resp.json(),
        err => console.error(err)
    );
}

function splitHibak(hibasSzavak) {
    for (let i = hibasSzavak.length-1; i >= 0; i--) {
        példa = hibasSzavak[i];
        szavak = példa.split('#');
        console.log(szavak[0]);
        console.log(szavak[1]);
        lista = (szavak[0] + " - " + szavak[1]);
        console.log(lista);
        myFunction(lista);
    }
}

function myFunction(szó) {
    var table = document.getElementById("hibák");
    var row = table.insertRow(0);
    var cell1 = row.insertCell(0);
    cell1.innerHTML = szó;
  }