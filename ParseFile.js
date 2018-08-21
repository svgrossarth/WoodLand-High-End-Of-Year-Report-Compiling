
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
    console.log("test");
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

        }
        // ParseSheet(sheetAr);
        // CreateNewExcel(sheetAr);
    };
    reader.readAsArrayBuffer(file);


  /*  console.log(e.target.files[0].path);
   // var ar = filePath.value.split("\\");
   // var fileName = ar[ar.length - 1];
    var workBook = XLSX.read(filePath);
    //XLSX.writeFile(workBook, 'testing.xlsx');
   // var workBook = XLSX.readFile(fileName);
    var arSheets = workBook.SheetNames;
    var workSheet = workBook.Sheets[arSheets[0]];
    var sheetAr = XLSX.utils.sheet_to_json(workSheet);
    ParseSheet(sheetAr);
    CreateNewExcel(sheetAr);

    /*var test = workSheet['!ref'];
    var range = XLSX.utils.decode_range(workSheet['!ref']);
    var test2 = range.e.c;o
    var test3 = range.s.r;
    var test4 = workSheet[XLSX.utils.encode_cell({r: 1, c: 0})].v; */
    /*var nextCell = sheet[
        XLSX.utils.encode_cell({r: rowNum, c: colNum})
        ];*/
   // var test4 = workSheet[XLSX.utils.encode_cell(r: test3 + 1, c: test2)];
  //  var theRange = workBook.encode_range(s: {c:0, r:0}, e: {c:0, r:10});


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
    XLSX.writeFile(newWorkBook, 'correctTest.xlsx');
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
