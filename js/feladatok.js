let k = 0;
flag = 0;

window.onload = loadTxt;

function loadTxt() {
    fetch("szótár.txt")
        .then(function (response) {
            return response.text();
        })
        .then(data => splitData(data)
        )
        .catch(function (error) {
            console.log(error);
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
            console.log(f);
            feladat = lines[i].slice(1)
            dictData[f].push(feladat);
            dictData[f].push([]);
            f += 1;
        }
        else {
            dictData[f - 1][1].push(lines[i]);
        }
    }
    createList();
}

function feladatok() {
    var br = document.createElement('br');
    for (var i = 0; i < dictData.length; i++) {
        return dictData[i][0];
    }
}

function createList() {
    for (var i = 0; i < dictData.length; i++) {
        let div = createAnyElement("div", {
            id: k,
            class: "smcontainer"
        });
        let input = createAnyElement("input", {
            type: "radio",
            name: "feladatok",
            id: dictData[i][0],
            value: dictData[i][0]
        });
        var label = createAnyElement("label", {
            for: dictData[i][0],
            name: "valazstas"
        });
        label.innerText = dictData[i][0];
        document.getElementById("feladatokListája").appendChild(div);
        document.getElementById(k).appendChild(input);
        document.getElementById(k).appendChild(label);
        k += 1;
    }
}

function createAnyElement(name, attributes) {
    let element = document.createElement(name);
    for (let k in attributes) {
        element.setAttribute(k, attributes[k]);
    }
    return element;
}

function radioCheck() {
    for (let i = 0; i < dictData.length; i++) {
        var x = document.getElementById(dictData[i][0]).checked;
        if (x) {
            flag = 1;
            feladat = dictData[i][0];
        }
    }
    if (flag) {
        console.log(feladat);
        passValues(feladat);
        window.location.href = "szokikerdezo.html";
    }
    else {
        alert("Nem jelöltél ki semmit!")
    }
}

function passValues(fela) {
    var lesson = fela;
    localStorage.setItem("les", lesson);
    return false;
}

//Enter figyelése
window.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
   event.preventDefault();
   radioCheck();
  }
});