var factBtn = document.getElementById('facts');
factBtn.addEventListener('click', getFacts);
var mainDiv = document.getElementById('main');
var searchedFacts = document.getElementById('searchedFact');
var previousFacts = document.getElementById('previousFact');
var deletebtn = document.getElementById('deleteFacts');
deletebtn.addEventListener('click', deleteFactsHandler);

document.addEventListener('DOMContentLoaded', loadPreviousData)

function changeColor(num) {
    if (num % 2 === 0) {
        document.body.style.backgroundColor = "red";
    } else {
        document.body.style.backgroundColor = "blue";
    }
}

function getFacts(e) {
    e.preventDefault();
    var num = document.getElementById('numberInput').value;

    if (num === "" || (!isNaN((num)) === false)) {
        alert("Please Enter A No!!!!")
    }
    else {
        var path = "http://numbersapi.com/" + num;

        fetchData(path).then(function (response) {
            changeColor(num)
            loadPreviousData()
            renderingDOM(searchedFacts, response)
            saveDataToLocalStorage(response)
        }).catch(function (error) {
            loadPreviousData()
            console.log(error);
        });
    }
}


function fetchData(path) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();

        xhr.onload = function () {
            resolve(xhr.responseText);
        }

        xhr.onerror = function () {
            reject("Error!!! Something Went Wrong");
        }

        xhr.open("GET", path);
        fact = xhr.send();
    });
}

function renderingDOM(element, fact) {
    if (element.childNodes[3] != null) {
        element.childNodes[3].remove();
    }

    var p = document.createElement('p');
    p.className = "randomFacts";
    p.innerHTML = fact;
    element.appendChild(p);
}

function saveDataToLocalStorage(facts) {
    newFacts = {};
    newFacts.id = Date.now();
    newFacts.createdTime = moment.utc();
    newFacts.randomFact = facts;

    var factsList = getDataFromLocalStorage();
    factsList.push(newFacts);

    localStorage.setItem("Promised facts", JSON.stringify(factsList));
}

function getDataFromLocalStorage() {
    if (localStorage.getItem('Promised facts') === null) {
        var factsList = [];
        return factsList;
    }

    factsList = JSON.parse(localStorage.getItem('Promised facts'));
    return factsList;
}

function loadPreviousData() {
    var factsList = getDataFromLocalStorage();
    deleteDiv(previousFacts);

    if (factsList.length == 0) {
        renderingDOM(previousFacts, "No Previous Search Made");
        return;
    }

    for (var i = 0; i < factsList.length; i++) {
        var domText = factsList[i].randomFact + " (" + moment(factsList[i].createdTime).fromNow() + ")";
        renderingDOMPreviousData(previousFacts, domText);
    }
}

function deleteDataFromLocalStorage() {
    localStorage.clear();
}

function deleteFactsHandler(e) {
    deleteDataFromLocalStorage();
    loadPreviousData();
}

function renderingDOMPreviousData(element, fact) {

    if (element.childNodes[3] == null) {
        divFacts = document.createElement('div');
        element.appendChild(divFacts);
    }

    var p = document.createElement('p');
    p.innerHTML = fact;
    divFacts.appendChild(p);
}

function deleteDiv(element) {
    if (element.childNodes[3] != null) {
        element.childNodes[3].remove();
    }
}