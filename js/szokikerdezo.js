felad = localStorage.getItem("les");
emailAddress = localStorage.getItem("user");
let keys = ["id", "name", "email", "password", "eredmény", "hibák"];
hibasSzavakListaja = [];
eltalaltSzavakListaja = [];
a = [];
let good = 0;
let bad = 0;
i = 0;

alert("Figyelmeztetlek, hogy csak 20 mp-ed van a válaszokra!")
window.onload = loadTxt;


//Enter figyelése
var input = document.getElementById("angolul");
input.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        ertekeles();
    }
});

function ertekeles() {
    let tipp = document.querySelector("input#angolul");
    let talalat = null;
    szó = szavak[0];

    if (tipp.value == szó) {
        talalat = "talált";
        good += 1;
        eltalaltSzavakListaja.push(szavak[0] + "#" + szavak[1]);
    }
    else {
        talalat = "nem talált";
        alert("Nem jó!\nAngolul: " + szó);
        bad += 1;
        hibasSzavakListaja.push(szavak[0] + "#" + szavak[1]);
    }
    scoreToScreen(good, bad);
    tipp.value = '';
    i += 1;
    clearTimeout(timeover);
    word();
}

function loadTxt() {
    fetch("szótár.txt")
        .then(function (response) {
            return response.text();
        })
        .then(data => splitData(data)
        )
        .catch(function (error) {
        });
}

function splitData(data) {
    lines = data.split("\n");
    dictData = [];
    f = 0;
    d = 0;
    for (var i = 0; i < lines.length; i++) {
        if (lines[i].includes("*")) {
            dictData.push([]);
            feladat = lines[i].slice(1)
            dictData[f].push(feladat);
            dictData[f].push([]);
            f += 1;
        }
        else {
            dictData[f - 1][1].push(lines[i]);
        }
    }
    word();
}

function word() {
    for (let k = 0; k < dictData.length; k++) {
        if (dictData[k][0] == "Hibák gyakorlása" && dictData[k][0] == felad) {
            timeover = setTimeout(showTime, 20000);
            //document.querySelector("span.time").innerHTML = timeover;
            delMove();
            move();
            getServerData(`http://localhost:3000/users`).then(
                data => getHibakFromServer(data)
            );
        }
        else {
            if (dictData[k][0] == felad) {
                if (i < dictData[k][1].length - 1) {
                    let példa = dictData[k][1][i];
                    szavak = példa.split('#');
                    document.getElementById("magyarul").innerHTML = szavak[1];
                    timeover = setTimeout(showTime, 20000);
                    //document.querySelector("span.time").innerHTML = timeover;
                    delMove();
                    move();
                }
                else {
                    alert("Vége!");
                    scoreGood = localStorage.setItem("good", good);
                    scoreBad = localStorage.setItem("bad", bad);
                    getServerData(`http://localhost:3000/users`).then(
                        data => getListFromDb(data));
                }
            }
        }
    }
}

function scoreToScreen(good, bad) {
    document.querySelector("#good").innerHTML = good;
    document.querySelector("#bad").innerHTML = bad;
}

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

//Hibák beolvasása szerverről
function getHibakFromServer(data) {
    for (let row of data) {
        for (let k of keys) {
            if (emailAddress == row[k]) {
                if (row["hibák"].length == 0) {
                    alert("Nincsenek gyakorolnivaló hibás szavaid!");
                    window.location.href = "feladatok.html";
                }
                else {
                    badWordsSplit(row["hibák"]);
                }
            }
        }
    }
}

//Hibás szavak splittelése
function badWordsSplit(data) {
    if (i < data.length) {
        példa = data[i];
        szavak = példa.split('#');
        document.getElementById("magyarul").innerHTML = szavak[1];
    }
    else {
        alert("Vége!");
        scoreGood = localStorage.setItem("good", good);
        scoreBad = localStorage.setItem("bad", bad);
        getServerData(`http://localhost:3000/users`).then(
            data => getListFromDb(data));
    }
}

//Server adatok listázása adott e-mail alapján
function getListFromDb(data) {
    for (let row of data) {
        for (let k of keys) {
            if (emailAddress == row[k]) {
                updateServerData(row);
                delBadWords(row);
            }
        }
    }
}

//Hibák hozzáadása
function updateServerData(row) {
    let data = row;
    let e = data.hibák.length;
    for (let q of hibasSzavakListaja){
        let flag = 0;
        for (let w of data.hibák) {
            if (w == q) {
                flag = 1;
                break;
            }
        }
    if (!flag) {
        data.hibák[e] = q;
        e += 1;
    }
        }
    let fetchOptions = {
        method: "PUT",
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };

    fetch(`http://localhost:3000/users/${data.id}`, fetchOptions).then(
        resp => resp.json(),
        err => console.error(err)
    );
}

function delBadWords(row) {
    let data = row;
    let hibasSzavakList = data["hibák"];
    for (let q of eltalaltSzavakListaja) {
        for (let w in hibasSzavakList) {
            if (hibasSzavakList[w] == q) {
                hibasSzavakList.splice(w, 1);
            }
        }
    }
    data.hibák = hibasSzavakList;
    let fetchOptions = {
        method: "PUT",
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };

    fetch(`http://localhost:3000/users/${data.id}`, fetchOptions).then(
        resp => resp.json(),
        err => console.error(err)
    );
    window.location.href = "end.html";
}

function closeAlert(cím) {
    timeover = timeover;
    var r = confirm("Biztos ki akarsz lépni? \nMinden pontod elveszik!\nHa nem siess vissza, mert megy az időd és már nem mutatom!");
    timeover = timeover;
    if (r == true) {
        clearTimeout(timeover)
        window.location.href = cím;
    }
    else {
        delMove();
        //clearTimeout(timeover);
        //timeover = setTimeout(showTime, 10000);
    }
  }

function showTime() {
    alert('Lejárt az időd!');
    ertekeles();
}

function move() {
    var elem = document.getElementById("myBar");   
    var width = 0;
    id = setInterval(frame, 200);
    function frame() {
      if (width == 200) {
        clearInterval(id);
      } else {
        width++; 
        elem.style.width = width + '%'; 
      }
    }
  }
  
id = 0;
function delMove() {
    var elem = document.getElementById("myBar");   
    elem.style.width = 0 + '%'; 
    clearInterval(id);
}