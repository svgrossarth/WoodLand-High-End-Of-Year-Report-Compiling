
var XLSX = require('xlsx');



function FindFile(){
    var filePath = document.getElementById("inputFile");
    console.log(filePath.value);
    var ar = filePath.value.split("\\");
    var fileName = ar[ar.length - 1];
    var workBook = XLSX.readFile(fileName);
    var arSheets = workBook.SheetNames;
    var workSheet = workBook.Sheets[arSheets[0]];
    var sheetAr = XLSX.utils.sheet_to_json(workSheet);
    ParseSheet(sheetAr);
    CreateNewExcel(sheetAr, workBook);

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


function CreateNewExcel(sheetAr, workBook){
    XLSX.writeFile(workBook, 'test.xlsx');
}
