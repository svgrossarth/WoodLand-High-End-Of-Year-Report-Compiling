
var XLSX = require('xlsx');

const arrayOfPossibleChoices = ["Total Count", "Convert Aries Query Fall", "Convert Aries Query Fall With ALL Programs",
    "Update ETS Roster", "Update Migrant Ed Roster", "Update PTS Roster", "Update ELD Roster"];

var theSelector =  document.getElementById("theSelector");
theSelector.addEventListener('change', UpdateDOMForFileSelection);


var objSheetAr = {
    periodAttendance: "",
    ariesQuery: "",
    etsRoster: "",
    ptsRoster: "",
    migRoster: "",
    eldRoster: "",
};


const theHandler = {
    set(obj, prop, value){
        if(prop == "periodAttendance" && value != ""){
            TotalCount(objSheetAr["periodAttendance"]);
        }else if(prop == "ariesQuery" && value !="" && obj["etsRoster"] == "" && obj["ptsRoster"] == "" && obj["migRoster"] == "" && obj["eldRoster"] == ""){
            AriesQuery(objSheetAr["ariesQuery"]);
        }else if(obj["ariesQuery"] != "" && obj["etsRoster"] != "" && obj["ptsRoster"] != "" && obj["migRoster"] != "" && obj["eldRoster"] != ""){

        }
    }
}

var theProxy = new Proxy(objSheetAr, theHandler);


/*
var fileInput = document.getElementById("inputFile");
fileInput.addEventListener('change', FindFileInital);
*/


function TheButGenerator(){
    var theSubBut = document.createElement("button");
    theSubBut.setAttribute("id", "submitButton");
    theSubBut.setAttribute("type", "button");
    var theButText = document.createTextNode("Submit");
    theSubBut.appendChild(theButText);
    theSubBut.addEventListener("click", DetermineRequest);
    return theSubBut;
}


function DetermineRequest() {
    if(theSelector.value == arrayOfPossibleChoices[0]){
        GetSingleFile("periodAttendance");


    }else if(theSelector.value == arrayOfPossibleChoices[1]){
        GetSingleFile("ariesQuery");

    }else if(theSelector.value == arrayOfPossibleChoices[2]){
        GetEachProgramRoster();
    }
}

function GetEachProgramRoster() {



}


function GetSingleFile(sheetName){
    var file = document.getElementById("fileInput0").files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
        ConvertSheetToJSON(e, 0, sheetName);

    };
    reader.readAsArrayBuffer(file);

}

function AttachInputTextInital(textNode){
    var innerInputDiv0 = document.getElementById("innerInputDiv0");
    var input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("id", "fileInput0");
    input.style.borderStyle = "solid";
    innerInputDiv0.appendChild(input);
    var textDiv1 = document.createElement("Div");
    textDiv1.setAttribute("id", "text1");
    textDiv1.appendChild(textNode);
    textDiv1.style.paddingLeft = "5px";
    textDiv1.style.paddingRight = "5px";
    innerInputDiv0.appendChild(textDiv1);
    var fileInput = document.getElementById("fileInput0");
    //fileInput.addEventListener('change', FindFileInital);
}

function AttachInputTextRec(textNodeArray, i, totalNumFiles) {
    var alignerDiv = document.getElementById("aligner");
    var innerInputDiv = document.createElement("div");
    innerInputDiv.setAttribute("id","innerInputDiv" + i);
    innerInputDiv.style.display = "flex";
    innerInputDiv.style.flexDirection = "row";
    alignerDiv.appendChild(innerInputDiv);
    var innerFileInput = document.createElement("input");
    innerFileInput.setAttribute("type", "file");
    innerFileInput.setAttribute("id", "fileInput" + i);
    innerFileInput.style.borderStyle = "solid";
    innerInputDiv.appendChild(innerFileInput);
    var newTextDiv = document.createElement("Div");
    newTextDiv.setAttribute("id", "text" + i + 1);
    newTextDiv.style.paddingLeft = "5px";
    newTextDiv.style.paddingRight = "5px";
    newTextDiv.appendChild(textNodeArray[i]);
    innerInputDiv.appendChild(newTextDiv);
    var fileInput = document.getElementById("fileInput" + i + 1);
   // fileInput.addEventListener('change', FindFileInital);

    if(i == totalNumFiles - 1){
        var theSubBut = TheButGenerator();
        innerInputDiv.appendChild(theSubBut);


    }else{
        i++;
        AttachInputTextRec(textNodeArray, i, totalNumFiles);
    }



}


function UpdateDOMForFileSelection(e) {
    var textNodeArray = [];
    var textNode = document.createTextNode("Please Select Aries Query");
    textNodeArray.push(textNode);
    if(theSelector.value == arrayOfPossibleChoices[0]){
        var textNodeAttendance = document.createTextNode("Please Select Attendence File");
        AttachInputTextInital(textNodeAttendance);
        var theSubBut = TheButGenerator();
        document.getElementById("innerInputDiv0").appendChild(theSubBut);
    }else if(theSelector.value == arrayOfPossibleChoices[1]){
        AttachInputTextInital(textNode);
        var theSubBut = TheButGenerator();
        document.getElementById("innerInputDiv0").appendChild(theSubBut);
    } else if(theSelector.value == arrayOfPossibleChoices[2]){
        var textNode1 = document.createTextNode("Please Select Excel Sheet Containing All Program Roster's");
        textNodeArray.push(textNode1);
        AttachInputTextInital(textNode);
        AttachInputTextRec(textNodeArray, 1, 2);

    }else if(theSelector.value == arrayOfPossibleChoices[3]){
        var textNode1 = document.createTextNode("Please Select ETS Roster");
        textNodeArray.push(textNode1);
        AttachInputTextInital(textNode);
        AttachInputTextRec(textNodeArray, 1, 2);

    }else if(theSelector.value == arrayOfPossibleChoices[4]){
        var textNode1 = document.createTextNode("Please Select Migrant Ed Roster");
        textNodeArray.push(textNode1);
        AttachInputTextInital(textNode);
        AttachInputTextRec(textNodeArray, 1, 2);

    }else if(theSelector.value == arrayOfPossibleChoices[5]){
        var textNode1 = document.createTextNode("Please Select PTS Roster");
        textNodeArray.push(textNode1);
        AttachInputTextInital(textNode);
        AttachInputTextRec(textNodeArray, 1, 2);

    }else if(theSelector.value == arrayOfPossibleChoices[6]){
        var textNode1 = document.createTextNode("Please Select ELD Roster");
        textNodeArray.push(textNode1);
        AttachInputTextInital(textNode);
        AttachInputTextRec(textNodeArray, 1, 2);

    }



}

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
    var keyword = "Class";
    for(let i = 0; i < sheetAr.length; i++){
        AddClassSlots(sheetAr[i], keyword);

        for(let j = 0; j < sheetAr.length; j++){
            if(sheetAr[i]["Student ID"] == sheetAr[j]["Student ID"]){
                if(i != j){
                    if(sheetAr[j]["Semester"] != "S"){
                        var period = sheetAr[j]["Period"];
                        keyword = keyword + period;
                        sheetAr[i][keyword] = period + " - " + sheetAr[j]["Course title"];
                        AVIDChecker(sheetAr[i], sheetAr[j]["Course title"]);
                        sheetAr.splice(j, 1);
                        console.log(sheetAr.length);
                        j--;
                        keyword = "Class";
                    }else {
                        sheetAr.splice(j, 1);
                        j--;
                    }
                }
            }
        }
    }
    CreateNewExcel(sheetAr, "Parsed Aries Query No Programs.xlsx")
}

function AddClassSlots(singleObject, keyword){
    singleObject.Class0 = "";
    singleObject.Class1 = "";
    singleObject.Class2 = "";
    singleObject.Class3 = "";
    singleObject.Class4 = "";
    singleObject.Class5 = "";
    singleObject.Class6 = "";
    singleObject.Class7 = "";
    singleObject.Class8 = "";
    singleObject.Class9 = "";
    singleObject.AVID = "";
    var period = singleObject["Period"];
    keyword = keyword + period;
    singleObject[keyword] = period + " - " + singleObject["Course title"];
    AVIDChecker(singleObject, singleObject["Course title"]);
    delete singleObject["Course title"];
    delete singleObject["Period"];
    delete singleObject["Semester"];

}

function AVIDChecker(outLoopStudent, innerLoopSubject) {
    if(innerLoopSubject.includes("AVID")){
        outLoopStudent["AVID"] = "X";
    }


}


function TestFunc1(sheetAr) {
    console.log("Single file test")

}

function HandleSheets(arraySheetAr) {
    console.log("Test");

}

function ConvertSheetToJSON(e, correctSheet, sheetname) {

        var data = e.target.result;
        data = new Uint8Array(data);
        var workBook = XLSX.read(data, {type: 'array'});
        var arSheets = workBook.SheetNames;
        var workSheet = workBook.Sheets[arSheets[correctSheet]];
        var json = XLSX.utils.sheet_to_json(workSheet);
        objSheetAr[sheetname] = json;
        theProxy[sheetname] = json;

}

function FindFileInital(e){
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.onload = function (e){
            ConvertFileToJSON(e);

        };
        reader.readAsArrayBuffer(file);


}

function FindFile(){
   /* for (; i < allFiles.length; i++){
        (function (file,allFiles, i, arraySheetAr) {
            var reader = new FileReader();
            reader.onload = function (e) {
                ConvertFileToJSON(e, allFiles, i, arraySheetAr);

            }
            reader.readAsArrayBuffer(file);
        })(allFiles[i],allFiles, i, arraySheetAr);
    }*/
    var alignerDiv = document.getElementById("aligner");
    var numOfFiles = alignerDiv.children.length;
    var arOfInputs = alignerDiv.children;
    for(var i = 0; i < numOfFiles; i++){(function (file){
        var reader = new FileReader();
        reader.onload = function (e) {
            ConvertFileToJSON(e);

        }
        reader.readAsArrayBuffer(file);

    })(arOfInputs[i].children[0].files[0])}
}


/*
function FindFile(e){

    if(e.target.files.length == 1){
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.onload = function(e) {
            var data = e.target.result;
            data = new Uint8Array(data);
            var workBook = XLSX.read(data, {type: 'array'});
            var arSheets = workBook.SheetNames;
            var workSheet = workBook.Sheets[arSheets[0]];
            var sheetAr = XLSX.utils.sheet_to_json(workSheet);
            TestFunc1(sheetAr);
        };
        reader.readAsArrayBuffer(file);

    }
    else if(e.target.files.length == 2){
        var files = e.target.files;
        var reader = new FileReader();
        reader.onload = function(e) {
            var data = e.target.result;
            data = new Uint8Array(data);
            var workBook = XLSX.read(data, {type: 'array'});
            var arSheets = workBook.SheetNames;
            var workSheet = workBook.Sheets[arSheets[0]];
            var sheetAr = XLSX.utils.sheet_to_json(workSheet);
            TestFunc1(sheetAr);
        };
        reader.readAsArrayBuffer(files);

    }*/

/*
    //this bit here is the magic that takes the file and makes it so it is read able by sheetjs
    var reader = new FileReader();
    reader.onload = function(e) {
        var data = e.target.result;
        data = new Uint8Array(data);
        var workBook = XLSX.read(data, {type: 'array'});
        var arSheets = workBook.SheetNames;
        var workSheet = workBook.Sheets[arSheets[0]];
        var sheetAr = XLSX.utils.sheet_to_json(workSheet);
        return sheetAr;
    }
    reader.readAsArrayBuffer(file);


        if(selector.value == "Total Count"){
            TotalCount(sheetAr);
        }
        else if(selector.value == "Convert Aries Query Fall"){
            AriesQuery(sheetAr);
            CreateNewExcel(sheetAr);

        }
        // ParseSheet(sheetAr);
        // CreateNewExcel(sheetAr);




}*/


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


function CreateNewExcel(sheetAr, newExcelName){
    var newSheet = XLSX.utils.json_to_sheet(sheetAr);
    var newWorkBook = XLSX.utils.book_new();
    var convertedSheet = "The compiled Sheet";
    XLSX.utils.book_append_sheet(newWorkBook, newSheet, convertedSheet);
    XLSX.writeFile(newWorkBook, newExcelName);
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
