var fullAbilityList = new Array()

function loadAbilities() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            fullAbilityList = xhttp.responseText.split("$$$")
            for (var i = 0; i < 3; i ++) {
                fullAbilityList[i] = fullAbilityList[i].split(";")
            }
        }
    }
    xhttp.open("GET", "/data/site/other/askUrza/planeswalkerAbilities.txt", true);
    xhttp.send();
}

function randomAbility(index) {
    possibleAbilities = fullAbilityList[index]
    document.getElementById("askUrzaResult").innerHTML = possibleAbilities[Math.floor(Math.random() * (possibleAbilities.length - 1))].replace(/\\"/g, '"')
}

loadAbilities()
