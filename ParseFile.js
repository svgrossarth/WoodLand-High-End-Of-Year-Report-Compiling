
var XLSX = require('xlsx');

var fileInput = document.getElementById("inputFile");
fileInput.addEventListener('change', FindFile);

// var selector = document.getElementById("theSelector");
// selector.addEventListener('change', CorrectReport);

/*function CorrectReport(e) {
    var fileInput = document.getElementById("inputFile");


    if(e.target.value == "Total Count"){
        fileInput.addEventListener('change', TotalCount);
    }
    else if(e.target.value == "Convert Aries Query"){
        fileInput.addEventListener('change', AriesQuery);

    }

}*/

function TotalCount (sheetAr){
    for(let i = 0; i < sheetAr.length; i++){
        for(let j = 0; j < sheetAr.length; j++){
            if(sheetAr[i]["ID's"] == sheetAr[j]["ID's"]){
                if(i != j){
                    removeSubjectDuplicates(sheetAr, i, j);
                    sheetAr[i]["Count"] = Number(sheetAr[i]["Count"]) + Number(sheetAr[j]["Count"]);
                    sheetAr[i]["Count"] = sheetAr[i]["Count"].toString();
                    sheetAr.splice(j, 1);
                    console.log(sheetAr.length);
                    j--;
                }
            }
        }

    }
}

function AriesQuery (sheetAr){
    var classCount = 2;
    var keyword = "Class";
    for(let i = 0; i < sheetAr.length; i++){
        AddClassSlots(sheetAr[i]);
        classCount = 2;
        for(let j = 0; j < sheetAr.length; j++){
            if(sheetAr[i]["Student ID"] == sheetAr[j]["Student ID"]){
                if(i != j){
                    keyword = keyword + classCount;
                    sheetAr[i][keyword] = sheetAr[j]["Course title"];
                    sheetAr.splice(j, 1);
                    console.log(sheetAr.length);
                    j--;
                    classCount++;
                    keyword = "Class";
                }
            }
        }

    }
}

function AddClassSlots(singleObject){
    singleObject.Class1 = "";
    singleObject.Class2 = "";
    singleObject.Class3 = "";
    singleObject.Class4 = "";
    singleObject.Class5 = "";
    singleObject.Class6 = "";
    singleObject.Class7 = "";
    singleObject.Class8 = "";
    singleObject.Class9 = "";
    singleObject.Class10 = "";
    singleObject.Class11 = "";
    singleObject.Class12 = "";
    singleObject.Class13 = "";
    singleObject.Class14 = "";
    singleObject["Class1"] = singleObject["Course title"];
    delete singleObject["Course title"];

}


function FindFile(e){
    var file = e.target.files[0];

    //this bit here is the magic that takes the file and makes it so it is read able by sheetjs
    var reader = new FileReader();
    reader.onload = function(e) {
        var data = e.target.result;
        data = new Uint8Array(data);
        var workBook = XLSX.read(data, {type: 'array'});
        var arSheets = workBook.SheetNames;
        var workSheet = workBook.Sheets[arSheets[0]];
        var sheetAr = XLSX.utils.sheet_to_json(workSheet);
        var selector = document.getElementById("theSelector");
        if(selector.value == "Total Count"){
            TotalCount(sheetAr);
        }
        else if(selector.value == "Convert Aries Query"){
            AriesQuery(sheetAr);
            CreateNewExcel(sheetAr);

        }
        // ParseSheet(sheetAr);
        // CreateNewExcel(sheetAr);
    };
    reader.readAsArrayBuffer(file);

}


function ParseSheet(sheetAr){

    for(let i = 0; i < sheetAr.length; i++){
        for(let j = 0; j < sheetAr.length; j++){
            if(sheetAr[i]["ID's"] == sheetAr[j]["ID's"]){
                if(i != j){
                    removeSubjectDuplicates(sheetAr, i, j);
                    sheetAr[i]["Count"] = Number(sheetAr[i]["Count"]) + Number(sheetAr[j]["Count"]);
                    sheetAr[i]["Count"] = sheetAr[i]["Count"].toString();
                    sheetAr.splice(j, 1);
                    console.log(sheetAr.length);
                    j--;
                }
            }
        }

    }
}


function CreateNewExcel(sheetAr){
    var newSheet = XLSX.utils.json_to_sheet(sheetAr);
    var newWorkBook = XLSX.utils.book_new();
    var convertedSheet = "The compiled Sheet";
    XLSX.utils.book_append_sheet(newWorkBook, newSheet, convertedSheet);
    XLSX.writeFile(newWorkBook, 'arriestthing.xlsx');
}

function removeSubjectDuplicates(sheetAr, i, j){
    var outterLoopSubjects = sheetAr[i]["Subject"].split(",");
    var innerLoopSubjects = sheetAr[j]["Subject"].split(",");
    var newUniqueSubject = true;

    for(let j2 = 0; j2 < innerLoopSubjects.length; j2++){
        for(let i2 = 0; i2 < outterLoopSubjects.length; i2++){
            if(innerLoopSubjects[j2].trim() == outterLoopSubjects[i2].trim()){
                newUniqueSubject = false;
                break;
            }
        }

        if(newUniqueSubject){
            sheetAr[i]["Subject"] = sheetAr[i]["Subject"] + "," + innerLoopSubjects[j2].trim();
            outterLoopSubjects = sheetAr[i]["Subject"].split(",");
        }

        newUniqueSubject = true;
    }
}
