// the actual catalog is stored in catalog.json

// translate programming to text types
var gentypeToText = {"type": "Type","topics": "Emner","subjects":"Fag"}
var typeToText = {
        "type": {"exp": "Forsøg", "know": "Vidensmateriale", "video": "Video", "link": "Yderligere links"},
        "topics": { 
            "bigbang": "Big Bang", 
            "grund": "Grundstoffer",
            "galakser": "Galakser, stjerner og planeter",
            "sol": "Solsystemet",
            "atmo": "Atmosfære og vand",
            "jorden": "Jordens struktur",
            "firstlife": "Det første liv",
            "foto": "Fotosyntese",
            "cell": "Celler",
            "dna": "DNA",
            "evo": "Evolution",
            "arter" : "Arter",
            "forfader": "Vores forfædre",
            "modern": "Moderne menneskers succes",
            "exo": "Exoplaneter",
            "andet": "Andet"
        },
        "subjects": { 
        "fk": "Fysik/Kemi", 
        "g": "Geografi",
        "b": "Biologi"}
    };

var fasToFeat = {
    "type": {
        "exp": "fas fa-flask",
        "know": "fas fa-book",
        "video": "fas fa-video",
        "link": "fas fa-link",
    },
     "topics": { 
        "bigbang": "fas fa-bomb", 
        "grund": "fas fa-atom",
        "galakser": "fas fa-star",
        "sol": "fas fa-sun",
        "atmo": "fas fa-tint",
        "jorden": "fas fa-globe-europe",
        "firstlife": "fas fa-heart",
        "foto": "fas fa-leaf",
        "cell": "fas fa-biohazard",
        "dna": "fas fa-dna",
        "evo": "fas fa-fish",
        "arter" : "fas fa-paw",
        "forfader": "fas fa-hand-paper",
        "modern": "fas fa-cogs",
        "exo":  "fas fa-rocket",
        "arter": "?",
    },
    "subjects": { 
        "fk": "fas fa-circle", 
        "g": "fas fa-circle",
        "b": "fas fa-circle"}   
}

var symbolToFeat = {
    "type": {
        "exp": "\uf0c3",
        "know": "\uf02d",
        "video": "\uf03d",
        "link": "\uf0c1",
    },
     "topics": { 
        "bigbang": "\uf1e2", 
        "grund": "\uf5d2",
        "galakser": "\uf005",
        "sol": "\uf185",
        "atmo": "\uf043",
        "jorden": "\uf7a2",
        "firstlife": "\uf004",
        "foto": "\uf06c",
        "cell": "\uf780",
        "dna": "\uf471",
        "evo": "\uf578",
        "arter" : "\uf1b0",
        "forfader": "\uf256",
        "modern": "\uf085",
        "exo":  "\uf135",
        "andet": "?",
    },
    "subjects": { 
        "fk": "\uf111", 
        "g": "\uf111",
        "b": "\uf111"}   
}

// function to check which catagories that are in the database

// the order of choices defines the order for the checkboxes
var choices = { "type": {}, "topics": {}, "subjects": {}, }

var items = catalog["items"];

// add possible choices to be selected between
for(var i = 0; i < items.length; i++) {
    for (feature in choices) {
        if (typeof items[i][feature] === 'string') {
                if (!Object.keys(choices[feature]).includes(items[i][feature])) {
                    choices[feature][items[i][feature]] = false;
                }
        }
        else {
            for (var j = 0; j < items[i][feature].length; j++){
                if (!Object.keys(choices[feature]).includes(items[i][feature])) {
                    choices[feature][items[i][feature][j]] = false;
                }
            }
        }
    }
}

//set one option on for illustrative example
choices["type"]["exp"] = true;

//produce the corresponding html
var choiceList = "";

for (feature in choices) {
    choiceList += `<ul class="checkboxtags">`

    if (Object.keys(choices[feature]).length > 0) {
        for(item in choices[feature]) {
            // add checked mark for the features that are one from the beginning
            var checked =  (choices[feature][item]) ? " checked": "";

            choiceList += `<li><input type="checkbox" id="` + item + `"` + checked + `><label for="` + item + `" data-icon="` + symbolToFeat[feature][item] + `">` + typeToText[feature][item] + `</label></li>`;
        }
    }
    choiceList += `</ul>`;
}

// push possible choices to pages
document.getElementById('material_choices').innerHTML = choiceList;


// function to select the wanted and displaying
function produceMaterialsList(){

    // check which options have been checked
    var someChecked = 0
    for (feature in choices) {
        if (Object.keys(choices[feature]).length > 0) {
            someChecked = 0
            for(item in choices[feature]) {   
                choices[feature][item] = document.getElementById(item).checked;
                if (document.getElementById(item).checked) {someChecked += 1;}
            }
            // if nothing has been checked in a feature, then select all
            if (someChecked == 0) { 
                for(item in choices[feature]) {choices[feature][item] = true;}
            }
        }
    }

    var materialsIndex_sel = [];
    var flagSelected = false;
    
    // go through catalog to see what fits the selection
    for(var i = 0; i < items.length; i++) {
        for (feature in choices) {
            flagSelected = false;
            if (typeof items[i][feature] === 'string') {
                if (choices[feature][items[i][feature]]) {flagSelected = true;} 
            }
            else {
                for (var j = 0; j < items[i][feature].length; j++){
                    if (choices[feature][items[i][feature][j]]) {flagSelected = true;} 
                }
            }
            if (!flagSelected) {break;}
        }

        //if item matches produce entry to list
        if (flagSelected) {
            materialsIndex_sel.push(i);
        }
    }   

    return materialsIndex_sel;
}

// function to display the selected material
function displayMaterial() {

    var materialsIndex_sel = produceMaterialsList();

    // HERE SHOULD BE AN OPTION TO SORT THE LIST ACCORDING TO DESIRE

    var materialsList = "";
    var topicsList = "";

    // if there are no results that matches
    if (!materialsIndex_sel.length > 0) {
        materialsList = `<p class="material_sorry">Undskyld! Vi har ikke noget i kataloget, som matcher dine valg</p>`;
    }

    else {
        materialsList += `<ul class="catalog">`
        //produce a 'card' for each matching item in the catalog
        for (i of materialsIndex_sel) {

            // produce list of topics for icons on card
            topicsList = "";
            for (var j = 0; j < items[i]["topics"].length; j++) {
                topicsList += `<li>` + symbolToFeat["topics"][items[i]["topics"][j]] + `</li>`;
            } 

            // choose the right logo for linktype
            if (items[i]["link"] == "") {
                symbolToLinktype = `<i class="far fa-lightbulb"></i>`;
            } 
            else if (items[i]["link"].slice(-3) == "pdf") {
                symbolToLinktype = `<i class="far fa-file-pdf"></i>`;
            }
            else if (items[i]["link"].slice(8,16) == "youtu.be") {
                symbolToLinktype = `<i class="fab fa-youtube"></i>`;
            }
            else {
                symbolToLinktype = `<i class="fas fa-external-link-alt"></i>`;
            }

            if (items[i]["link"] == "") {
                materialsList += `<li><span class="cardlink">
                            <span class="testfill"></span>
                            <h5>` + items[i]["title"] + `</h5>
                            <p class="desc">` + items[i]["desc"] + `</p>
                            <div class="linktype">` + symbolToLinktype + `</div>
                            <div class="type">` + symbolToFeat["type"][items[i]["type"]] + `</div>
                            <ul class="topics">` + topicsList + `</ul>
                            </span></li>`;
            }
            else {
                materialsList += `<li><a class="cardlink" target="_blank" href="` + items[i]["link"] + `">
                            <span class="testfill"></span>
                            <h5>` + items[i]["title"] + `</h5>
                            <p class="desc">` + items[i]["desc"] + `</p>
                            <div class="linktype">` + symbolToLinktype + `</div>
                            <div class="type">` + symbolToFeat["type"][items[i]["type"]] + `</div>
                            <ul class="topics">` + topicsList + `</ul>
                            </a></li>`;
            }
        }
        materialsList += `</ul>`
    }


    document.getElementById('material_results').innerHTML = materialsList;

}

