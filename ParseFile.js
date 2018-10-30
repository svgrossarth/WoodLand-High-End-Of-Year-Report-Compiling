





$( document ).ready(function() {

    var XLSX = require('xlsx');

    const arrayOfPossibleChoices = ["Total Count", "Convert Aries Query Fall", "Convert Aries Query Fall With ALL Programs",
        "Update ETS Roster", "Update Migrant Ed Roster", "Update PTS Roster", "Update ELD Roster",
        "Monthly Lunch ASSETs Report", "Monthly After School ASSETs Report"];


    //Triggered when the user selects what they wish to generate

    var theSelectorJQ = $('#theSelector');
    theSelectorJQ.selectmenu({
        position: {my: 'center top', at: 'center bottom'},
        change: UpdateDOMForFileSelection,
        width: 350

    });

    theSelectorJQ.css('background-color', 'blue');
    //theSelector.css('box-shadow', '5px 5px 5px');

    var theSelector = $('#theSelector').get()[0];

    // var theSelector =  document.getElementById("theSelector");
    //theSelector.addEventListener('change', UpdateDOMForFileSelection);




    var objSheetAr = {
        periodAttendance: "",
        ariesQuery: "",
        etsRoster: "",
        ptsRoster: "",
        migRoster: "",
        eldRoster: "",
    };

//when objSheetAr has any of it's values changed the handler triggers
    const theHandler = {
        set(obj, prop, value) {
            if (prop == "periodAttendance" && theSelector.value === arrayOfPossibleChoices[0]) {
                let sheetAr = TotalCount(objSheetAr["periodAttendance"]);
                CreateNewExcel(sheetAr, "TotalCountReport.xlsx")
            }else if (prop === "periodAttendance" && theSelector.value === arrayOfPossibleChoices[7]){
                let sheetAr = ASSETsReport(objSheetAr["periodAttendance"]);
                CreateNewExcel(sheetAr, "ASSETsLunchReport.xlsx", true);
            }else if (prop === "periodAttendance" && theSelector.value === arrayOfPossibleChoices[8]){
                let sheetAr = ASSETsReport(objSheetAr["periodAttendance"]);
                CreateNewExcel(sheetAr, "ASSETsAfterSchoolReport.xlsx", true);
            } else if(prop == "ariesQuery" && value !="" && obj["etsRoster"] == "" && obj["ptsRoster"] == "" && obj["migRoster"] == "" && obj["eldRoster"] == ""){
                var sheetAr = AriesQuery(objSheetAr["ariesQuery"]);
                CreateNewExcel(sheetAr, "Parsed Aries Query No Programs.xlsx");
            }else if(obj["ariesQuery"] != "" && obj["etsRoster"] != "" && obj["ptsRoster"] != "" && obj["migRoster"] != "" && obj["eldRoster"] != ""){
                var sheetAr = AriesQuery(objSheetAr["ariesQuery"]);
                sheetAr = AddPrograms(sheetAr);
                CreateNewExcel(sheetAr, "Parsed Aries Query With Programs.xlsx");
            }
        }
    };

    var theProxy = new Proxy(objSheetAr, theHandler);

    function Student() {

        this.Count = "";
        this.StudentName = "";
        this.Grade = "";
        this.StudentID = "";
        this.Lunch = "";
        this.Subject = "";
        this.empty_1 = "";
        this.empty_2 = "";

        for(let i = 1; i < 32; i++){
            this[i] = "";
        }
    }

    function Timez(timeString) {
        let amPm = timeString.split(" ")[1];
        let timeNums = timeString.split(" ")[0];
        let hour = timeNums.split(":")[0];
        let minutes = timeNums.split(":")[1];
        let partOfHour = 0;
        this.absoluteTime = 0;
        if(amPm === "AM"){
            partOfHour = minutes / 60;
            this.absoluteTime = Number(hour) + partOfHour;
        }else {
            partOfHour = minutes / 60;
            if(hour == 12){
                this.absoluteTime = Number(hour) + partOfHour;
            }else {
                this.absoluteTime = 12 + Number(hour) + partOfHour;
            }



        }

    }


    function TimeInCenter(timeOut, timeIn) {
        if(timeOut === ""){
            return 1;
        }
        let time_In = new Timez(timeIn);
        let time_out = new Timez(timeOut);
        let exactTime = time_out.absoluteTime - time_In.absoluteTime;
        let wholeTime = parseInt(exactTime, 10);
        let justDecimal = exactTime - wholeTime;
        if(justDecimal >= 0 && .25 > justDecimal){
            justDecimal = 0;
        }else if(justDecimal >= .25 && .5 > justDecimal){
            justDecimal = .25;
        }else if (justDecimal >= .5 && .75 > justDecimal){
            justDecimal = .5;
        }else if (justDecimal >= .75){
            justDecimal = .75;
        }
        if((wholeTime < 0) || (wholeTime < 1)){
            return 1;
        }else {
            return wholeTime + justDecimal;
        }
    }

    function removePeriodFromClass(objectContainer) {
        let justClass = "";
        let longClass = "";
        justClass = objectContainer["Subject"].split("-");
        if(justClass.length > 2){
            for(let i = 0; i < justClass.length - 1; i++){
                if(i === 0) {
                    longClass += justClass[i + 1].trim();
                }else{
                    longClass += " - " + justClass[i + 1];//note English 1 - 2 has spaces while Pre-Calculus doesn't,
                    // here Pre-Calculus will now be Pre - Calculus
                }
            }
            justClass = longClass;

        }else if(justClass[1]){
            justClass = justClass[1].trim() ;
        }else{
            justClass = justClass[0].trim();
        }

        objectContainer["Subject"] = justClass;

    }

    function BuildStudentOb (ASSETsAr, periodAttendanceRow, dayOfTheMonth, period, counter){
        let alreadyBeenCounted = false;
        let studentOb = new Student();
        for(var i = 0; i < ASSETsAr.length; i++){
            if(ASSETsAr[i].StudentID === periodAttendanceRow["Student ID"]){
                alreadyBeenCounted = true;
                break;
            }
        }

        if(alreadyBeenCounted){
            removePeriodFromClass(periodAttendanceRow);
            removeSubjectDuplicates(ASSETsAr[i], periodAttendanceRow, "Subject");
            if(periodAttendanceRow["Other Subject"]){
                ASSETsAr[i]["Subject"] += ", " + periodAttendanceRow["Other Subject"];
            }
            //ASSETsAr[i].Subject += ", " + periodAttendanceRow["Subject"];
            if(period === "Lunch"){
                if(ASSETsAr[i][dayOfTheMonth] === ""){
                    ASSETsAr[i][dayOfTheMonth] = "1";
                }else{
                    console.log("Duplicate Found!! for " + ASSETsAr[i]["StudentName"] + " on the " + dayOfTheMonth);
                    ASSETsAr[i][dayOfTheMonth] = "1";
                }

            }else if(period === "After School"){
                if(ASSETsAr[i][dayOfTheMonth] === ""){
                    ASSETsAr[i][dayOfTheMonth] = TimeInCenter(periodAttendanceRow["Time Out"], periodAttendanceRow["Time In"]);
                }else{
                    console.log("Duplicate Found!! for " + ASSETsAr[i]["StudentName"] + " on the " + dayOfTheMonth);
                    ASSETsAr[i][dayOfTheMonth] += TimeInCenter(periodAttendanceRow["Time Out"], periodAttendanceRow["Time In"]);
                }

            }


        }else {
            studentOb.Count = counter;
            studentOb.Grade = periodAttendanceRow["Grade"];
            studentOb.StudentID = periodAttendanceRow["Student ID"];
            studentOb.StudentName = periodAttendanceRow["First Name"] + " " + periodAttendanceRow["Last Name"];
            removePeriodFromClass(periodAttendanceRow);
            studentOb.Subject = periodAttendanceRow["Subject"];
            if(periodAttendanceRow["Other Subject"]){
                studentOb.Subject += ", " + periodAttendanceRow["Other Subject"];
            }

            if(period === "Lunch"){
                studentOb[dayOfTheMonth] = "1";
                studentOb.Lunch = "Y";
            }else{
                studentOb.Lunch = "N";
                studentOb[dayOfTheMonth] = TimeInCenter(periodAttendanceRow["Time Out"], periodAttendanceRow["Time In"]);

            }

        }

        return studentOb;

    }


    function BuildASSETs(periodAttendanceRow, period, counter, ASSETsAr) {
        let studentOb = new Student();
        let theDate = periodAttendanceRow.Date;
        let splitDate = theDate.split("/");
        let dayOfTheMonth = splitDate[1];



        if(period === "Lunch" && periodAttendanceRow["Period"] === "Lunch") {
            studentOb = BuildStudentOb(ASSETsAr, periodAttendanceRow, dayOfTheMonth, "Lunch", counter);

        }else if(period === "After School" && periodAttendanceRow["Period"] === "After School") {
            studentOb = BuildStudentOb(ASSETsAr, periodAttendanceRow, dayOfTheMonth, "After School", counter);

        }

        return studentOb;

    }


    function ASSETsReport(periodAttendance) {
        let ASSETsAr = [];
        let count = 1;
        for(let i = 0; i < periodAttendance.length; i++){
            if(periodAttendance[i]["Student ID"] !== undefined) {
                let theStudent;
                if (theSelector.value === arrayOfPossibleChoices[7]) {
                    theStudent = BuildASSETs(periodAttendance[i], "Lunch", count, ASSETsAr);
                    if (theStudent.Count !== "") {
                        count++;
                        ASSETsAr.push(theStudent);
                    }
                } else if (theSelector.value === arrayOfPossibleChoices[8]) {
                    theStudent = BuildASSETs(periodAttendance[i], "After School", count, ASSETsAr);
                    if (theStudent.Count !== "") {
                        count++;
                        ASSETsAr.push(theStudent);
                    }
                }
            }
        }
        return ASSETsAr;
    }


    function InsertPrograms(theStudent) {
        theStudent.ELD ="";
        theStudent.PTS ="";
        theStudent.ETS ="";
        theStudent.MIG ="";

    }


    function AddPrograms(sheetAr) {
        let ELDRoster = objSheetAr["eldRoster"];
        let ETSRoster = objSheetAr["etsRoster"];
        let PTSRoster = objSheetAr["ptsRoster"];
        let MIGRoster = objSheetAr["migRoster"];
        for(let i = 0; i < sheetAr.length; i++){
            InsertPrograms(sheetAr[i]);
            for(let ELDIndex = 0; ELDIndex < ELDRoster.length; ELDIndex++){
                if(sheetAr[i]["Student ID"] === ELDRoster[ELDIndex]["Student ID"]){
                    sheetAr[i]["ELD"] = "X";
                    ELDRoster.splice(ELDIndex, 1);
                    break;
                }
            }
            for(let PTSIndex = 0; PTSIndex < PTSRoster.length; PTSIndex++){
                if(sheetAr[i]["Student ID"] === PTSRoster[PTSIndex]["Student ID"]){
                    sheetAr[i]["PTS"] = "X";
                    PTSRoster.splice(PTSIndex, 1);
                    break;
                }
            }
            for(let ETSIndex = 0; ETSIndex < ETSRoster.length; ETSIndex++){
                if(sheetAr[i]["Student ID"] === ETSRoster[ETSIndex]["Student ID"]){
                    sheetAr[i]["ETS"] = "X";
                    ETSRoster.splice(ETSIndex, 1);
                    break;
                }
            }
            for(let MIGIndex = 0; MIGIndex < MIGRoster.length; MIGIndex++){
                if(sheetAr[i]["Student ID"] === MIGRoster[MIGIndex]["Student ID"]){
                    sheetAr[i]["MIG"] = "X";
                    MIGRoster.splice(MIGIndex, 1);
                    break;
                }
            }

        }
        return sheetAr;

    }

//creates the Submit button
    function TheButGenerator(){
        var theSubBut = document.createElement("button");
        theSubBut.setAttribute("id", "submitButton");
        theSubBut.setAttribute("type", "button");
        var theButText = document.createTextNode("Submit");
        theSubBut.appendChild(theButText);
        theSubBut.addEventListener("click", DetermineRequest);
        return theSubBut;
    }

//Run after the user hits submit
    function DetermineRequest() {
        if(theSelector.value == arrayOfPossibleChoices[0]){
            GetSingleFile("periodAttendance");


        }else if(theSelector.value == arrayOfPossibleChoices[1]){
            GetSingleFile("ariesQuery");

        }else if(theSelector.value == arrayOfPossibleChoices[2]){
            GetEachProgramRoster();
        }else if(theSelector.value === arrayOfPossibleChoices[7]){
            GetSingleFile("periodAttendance");
        }else if(theSelector.value === arrayOfPossibleChoices[8]){
            GetSingleFile("periodAttendance");
        }
    }

//Pulls the different files and converts each
    function GetEachProgramRoster() {
        var alignerDiv = document.getElementById("aligner");
        var numOfFiles = alignerDiv.children.length;
        var arOfInputs = alignerDiv.children;
        for(var i = 0; i < numOfFiles; i++){(function (file, i){
            var reader = new FileReader();
            reader.onload = function (e) {
                if(i == 0){
                    ConvertSheetToJSON(e, 0, "ariesQuery");
                }else if(i == 1){
                    ConvertSheetToJSONAllPrograms(e)
                }
            };
            reader.readAsArrayBuffer(file);

        })(arOfInputs[i].children[0].files[0], i)}
    }


    function CorrectHeaders(workSheet) {
        let initalJSON = XLSX.utils.sheet_to_json(workSheet);
        for(var i = 0; i < initalJSON.length; i++) {
            let getOut = false;
            for (cell in initalJSON[i]) {
                if (initalJSON[i][cell] === "Student ID") {
                    getOut = !getOut;
                    break;
                }
            }
            if (getOut) {
                break;
            }
        }
        let correctJSON = XLSX.utils.sheet_to_json(workSheet, {range: i + 1});
        return correctJSON;
    }

    function ConvertSheetToJSONAllPrograms(e){
        var data = e.target.result;
        data = new Uint8Array(data);
        var workBook = XLSX.read(data, {type: 'array'});
        var arSheets = workBook.SheetNames;
        for(sheet in arSheets){
            if(arSheets[sheet].includes("ELD")){
                var workSheet = workBook.Sheets[arSheets[sheet]];
                var json = CorrectHeaders(workSheet);
                objSheetAr["eldRoster"] = json;
                theProxy["eldRoster"] = json;
            }else if(arSheets[sheet].includes("ME")){
                var workSheet = workBook.Sheets[arSheets[sheet]];
                var json = CorrectHeaders(workSheet);
                objSheetAr["migRoster"] = json;
                theProxy["migRoster"] = json;

            }else if(arSheets[sheet].includes("ETS")){
                var workSheet = workBook.Sheets[arSheets[sheet]];
                var json = CorrectHeaders(workSheet);
                objSheetAr["etsRoster"] = json;
                theProxy["etsRoster"] = json;

            }else if(arSheets[sheet].includes("PTS")){
                var workSheet = workBook.Sheets[arSheets[sheet]];
                var json = CorrectHeaders(workSheet);
                objSheetAr["ptsRoster"] = json;
                theProxy["ptsRoster"] = json;

            }
        }

    }

//takes in the single file submitted by the user to then convert to a JSON
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

        if(i == totalNumFiles - 1){
            var theSubBut = TheButGenerator();
            innerInputDiv.appendChild(theSubBut);


        }else{
            i++;
            AttachInputTextRec(textNodeArray, i, totalNumFiles);
        }



    }

//Allows user to select which files they wish to use to generate the report
    function UpdateDOMForFileSelection(e) {
        var textNodeArray = [];
        var textNode = document.createTextNode("Please Select Aries Query");
        textNodeArray.push(textNode);
        if(theSelector.value == arrayOfPossibleChoices[0]){
            var textNodeAttendance = document.createTextNode("Please Select Attendance File");
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

        }else if(theSelector.value === arrayOfPossibleChoices[7]){
            var textNodeAttendance = document.createTextNode("Please Select Attendance File");
            textNodeArray.push(textNodeAttendance);
            AttachInputTextInital(textNodeAttendance);
            //AttachMonthInput();
            var theSubBut = TheButGenerator();
            document.getElementById("innerInputDiv0").appendChild(theSubBut);
        }else if(theSelector.value === arrayOfPossibleChoices[8]){
            var textNodeAttendance = document.createTextNode("Please Select Attendance File");
            textNodeArray.push(textNodeAttendance);
            AttachInputTextInital(textNodeAttendance);
            //AttachMonthInput();
            var theSubBut = TheButGenerator();
            document.getElementById("innerInputDiv0").appendChild(theSubBut);
        }
    }



    function AttachMonthInput() {
        var textMonthInput = document.createTextNode("Please Enter Month As A Number")
        var innerInputDiv0 = document.getElementById("innerInputDiv0");
        var input = document.createElement("input");
        input.setAttribute("type", "number");
        input.setAttribute("min", "0");
        input.setAttribute("id", "fileInput1");
        input.style.borderStyle = "solid";
        innerInputDiv0.appendChild(input);
        var textDiv2 = document.createElement("Div");
        textDiv2.setAttribute("id", "text2");
        textDiv2.appendChild(textMonthInput);
        textDiv2.style.paddingLeft = "5px";
        textDiv2.style.paddingRight = "5px";
        innerInputDiv0.appendChild(textDiv2);


    }

    function AddAndRemoveKeys(student) {
        AddCountOuter(student);
        delete student["Student Sign Out (Tutor Name)"];
        delete student["Time In"];
        delete student["Time Out"];
        delete student["Period"];
        delete student["Date"];
        delete student["ELD"];
        delete student["PTS"];
        delete student["ETS"];
        delete student["MIG"];

    }

    function ConcatenateOtherSubject(oldList, newList){
        if(oldList["Other Subject"] === undefined && !(newList["Other Subject"] === undefined)) {
            oldList["Other Subject"] = newList["Other Subject"];
        }else if(!(oldList["Other Subject"] === undefined) && !(newList["Other Subject"] === undefined)){
            oldList["Other Subject"] =  oldList["Other Subject"] + ", " + newList["Other Subject"];
        }
    }


    function TotalCount (sheetAr){
        for(let i = 0; i < sheetAr.length; i++){
            if(!(sheetAr[i]["Student ID"] === undefined)) {
                AddAndRemoveKeys(sheetAr[i]);
                removePeriodFromClass(sheetAr[i]);
                for (let j = 0; j < sheetAr.length; j++) {
                    if (!(sheetAr[j]["Student ID"] === undefined)) {
                        if (sheetAr[i]["Student ID"] === sheetAr[j]["Student ID"]) {
                            if (i !== j) {
                                removePeriodFromClass(sheetAr[j]);
                                removeSubjectDuplicates(sheetAr[i], sheetAr[j], "Subject");
                                ConcatenateOtherSubject(sheetAr[i], sheetAr[j]);
                                let innerCount = CheckForCount(sheetAr[j]);
                                if (innerCount) {
                                    sheetAr[i]["Count"] = Number(sheetAr[i]["Count"]) + Number(sheetAr[j]["Count"]);
                                }
                                else {
                                    sheetAr[i]["Count"] = Number(sheetAr[i]["Count"]) + 1;
                                }
                                sheetAr[i]["Count"] = sheetAr[i]["Count"].toString();
                                sheetAr.splice(j, 1);
                                console.log(sheetAr.length);
                                j--;
                            }
                        }
                    }else{
                        sheetAr.splice(j, 1);
                        j--;
                    }
                }
            }else{
                sheetAr.splice(i, 1);
                i--;
            }
        }
        return sheetAr;
    }


    function CheckForCount(student) {
        const theKeys = Object.keys(student);
        let thereIsCount = false;
        for(let k = 0; k < theKeys.length; k++){
            if(theKeys[k] === "Count"){
                thereIsCount = true;
            }
        }
        return thereIsCount;

    }

    function AddCountOuter(student){
        let thereIsCount = CheckForCount(student);
        if(!thereIsCount){
            student.Count ="1";
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
        return sheetAr;
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

//Converts excel file to JSON and updates array with converted sheets and the proxy
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




    function CreateNewExcel(sheetAr, newExcelName, specialSheet = false){
        if(specialSheet){
            var newSheet = XLSX.utils.json_to_sheet(sheetAr, {header:["Count","StudentName","Grade",
                    "StudentID","Lunch","1","2","3","4","5","6","7","8","9","10","11","12","13",
                    "14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31",
                    "empty_1","empty_2","Subject"]});
        }else {
            var newSheet = XLSX.utils.json_to_sheet(sheetAr);
        }

        var newWorkBook = XLSX.utils.book_new();
        var convertedSheet = "The compiled Sheet";
        XLSX.utils.book_append_sheet(newWorkBook, newSheet, convertedSheet);
        XLSX.writeFile(newWorkBook, newExcelName);
        UpdateUserAboutFile(newExcelName);
    }

    function  UpdateUserAboutFile(newExcelname) {
        let displayArea = document.getElementById("displayResults");
        let displayText = document.createTextNode(newExcelname + " has been generated!");
        displayArea.appendChild(displayText);

    }

    /*function removeSubjectDuplicates(sheetAr, i, j){
        if(!(sheetAr[i]["Subject"] === undefined) && !(sheetAr[j]["Subject"] === undefined)) {
            var outterLoopSubjects = sheetAr[i]["Subject"].split(",");
            var innerLoopSubjects = sheetAr[j]["Subject"].split(",");
            var newUniqueSubject = true;

            for (let j2 = 0; j2 < innerLoopSubjects.length; j2++) {
                for (let i2 = 0; i2 < outterLoopSubjects.length; i2++) {
                    if (innerLoopSubjects[j2].trim() == outterLoopSubjects[i2].trim()) {
                        newUniqueSubject = false;
                        break;
                    }
                }

                if (newUniqueSubject) {
                    sheetAr[i]["Subject"] = sheetAr[i]["Subject"] + "," + innerLoopSubjects[j2].trim();
                    outterLoopSubjects = sheetAr[i]["Subject"].split(",");
                }

                newUniqueSubject = true;
            }
        }
    }*/

    function removeSubjectDuplicates(orginalList, newList, keyword){
        if(!(orginalList[keyword] === undefined) && !(newList[keyword] === undefined) && !(orginalList[keyword] === "") && !(newList[keyword] === "")) {
            var outterLoopSubjects = orginalList[keyword].split(",");
            var innerLoopSubjects = newList[keyword].split(",");
            var newUniqueSubject = true;

            for (let j2 = 0; j2 < innerLoopSubjects.length; j2++) {
                for (let i2 = 0; i2 < outterLoopSubjects.length; i2++) {
                    if (innerLoopSubjects[j2].trim() === outterLoopSubjects[i2].trim()) {
                        newUniqueSubject = false;
                        break;
                    }
                }

                if (newUniqueSubject) {
                    orginalList[keyword] = orginalList[keyword] + ", " + innerLoopSubjects[j2].trim();
                    outterLoopSubjects = orginalList[keyword].split(",");
                }

                newUniqueSubject = true;
            }
        }
    }




});


   /*// var theSelector =  document.getElementById("theSelector");
    //theSelector.addEventListener('change', UpdateDOMForFileSelection);




var objSheetAr = {
    periodAttendance: "",
    ariesQuery: "",
    etsRoster: "",
    ptsRoster: "",
    migRoster: "",
    eldRoster: "",
};

//when objSheetAr has any of it's values changed the handler triggers
const theHandler = {
    set(obj, prop, value) {
        if (prop == "periodAttendance" && theSelector.value === arrayOfPossibleChoices[0]) {
            let sheetAr = TotalCount(objSheetAr["periodAttendance"]);
            CreateNewExcel(sheetAr, "TotalCountReport.xlsx")
        }else if (prop === "periodAttendance" && theSelector.value === arrayOfPossibleChoices[7]){
            let sheetAr = ASSETsReport(objSheetAr["periodAttendance"]);
            CreateNewExcel(sheetAr, "ASSETsLunchReport.xlsx", true);
        }else if (prop === "periodAttendance" && theSelector.value === arrayOfPossibleChoices[8]){
            let sheetAr = ASSETsReport(objSheetAr["periodAttendance"]);
            CreateNewExcel(sheetAr, "ASSETsAfterSchoolReport.xlsx", true);
        } else if(prop == "ariesQuery" && value !="" && obj["etsRoster"] == "" && obj["ptsRoster"] == "" && obj["migRoster"] == "" && obj["eldRoster"] == ""){
            var sheetAr = AriesQuery(objSheetAr["ariesQuery"]);
            CreateNewExcel(sheetAr, "Parsed Aries Query No Programs.xlsx");
        }else if(obj["ariesQuery"] != "" && obj["etsRoster"] != "" && obj["ptsRoster"] != "" && obj["migRoster"] != "" && obj["eldRoster"] != ""){
            var sheetAr = AriesQuery(objSheetAr["ariesQuery"]);
            sheetAr = AddPrograms(sheetAr);
            CreateNewExcel(sheetAr, "Parsed Aries Query With Programs.xlsx");
        }
    }
};

var theProxy = new Proxy(objSheetAr, theHandler);

function Student() {

        this.Count = "";
        this.StudentName = "";
        this.Grade = "";
        this.StudentID = "";
        this.Lunch = "";
        this.Subject = "";
        this.empty_1 = "";
        this.empty_2 = "";

    for(let i = 1; i < 32; i++){
        this[i] = "";
    }
}

function Timez(timeString) {
    let amPm = timeString.split(" ")[1];
    let timeNums = timeString.split(" ")[0];
    let hour = timeNums.split(":")[0];
    let minutes = timeNums.split(":")[1];
    let partOfHour = 0;
    this.absoluteTime = 0;
    if(amPm === "AM"){
        partOfHour = minutes / 60;
        this.absoluteTime = Number(hour) + partOfHour;
    }else {
        partOfHour = minutes / 60;
        if(hour == 12){
            this.absoluteTime = Number(hour) + partOfHour;
        }else {
            this.absoluteTime = 12 + Number(hour) + partOfHour;
        }



    }

}


function TimeInCenter(timeOut, timeIn) {
    if(timeOut === ""){
        return 1;
    }
    let time_In = new Timez(timeIn);
    let time_out = new Timez(timeOut);
    let exactTime = time_out.absoluteTime - time_In.absoluteTime;
    let wholeTime = parseInt(exactTime, 10);
    let justDecimal = exactTime - wholeTime;
    if(justDecimal >= 0 && .25 > justDecimal){
        justDecimal = 0;
    }else if(justDecimal >= .25 && .5 > justDecimal){
        justDecimal = .25;
    }else if (justDecimal >= .5 && .75 > justDecimal){
        justDecimal = .5;
    }else if (justDecimal >= .75){
        justDecimal = .75;
    }
    if((wholeTime < 0) || (wholeTime < 1)){
        return 1;
    }else {
        return wholeTime + justDecimal;
    }
}

function removePeriodFromClass(objectContainer) {
    let justClass = "";
    let longClass = "";
    justClass = objectContainer["Subject"].split("-");
    if(justClass.length > 2){
        for(let i = 0; i < justClass.length - 1; i++){
            if(i === 0) {
                longClass += justClass[i + 1].trim();
            }else{
                longClass += " - " + justClass[i + 1];//note English 1 - 2 has spaces while Pre-Calculus doesn't,
                                                        // here Pre-Calculus will now be Pre - Calculus
            }
        }
        justClass = longClass;

    }else if(justClass[1]){
        justClass = justClass[1].trim() ;
    }else{
        justClass = justClass[0].trim();
    }

    objectContainer["Subject"] = justClass;

}

function BuildStudentOb (ASSETsAr, periodAttendanceRow, dayOfTheMonth, period, counter){
    let alreadyBeenCounted = false;
    let studentOb = new Student();
    for(var i = 0; i < ASSETsAr.length; i++){
        if(ASSETsAr[i].StudentID === periodAttendanceRow["Student ID"]){
            alreadyBeenCounted = true;
            break;
        }
    }

    if(alreadyBeenCounted){
        removePeriodFromClass(periodAttendanceRow);
        removeSubjectDuplicates(ASSETsAr[i], periodAttendanceRow, "Subject");
        if(periodAttendanceRow["Other Subject"]){
            ASSETsAr[i]["Subject"] += ", " + periodAttendanceRow["Other Subject"];
        }
        //ASSETsAr[i].Subject += ", " + periodAttendanceRow["Subject"];
        if(period === "Lunch"){
            if(ASSETsAr[i][dayOfTheMonth] === ""){
                ASSETsAr[i][dayOfTheMonth] = "1";
            }else{
                console.log("Duplicate Found!! for " + ASSETsAr[i]["StudentName"] + " on the " + dayOfTheMonth);
                ASSETsAr[i][dayOfTheMonth] = "1";
            }

        }else if(period === "After School"){
            if(ASSETsAr[i][dayOfTheMonth] === ""){
                ASSETsAr[i][dayOfTheMonth] = TimeInCenter(periodAttendanceRow["Time Out"], periodAttendanceRow["Time In"]);
            }else{
                console.log("Duplicate Found!! for " + ASSETsAr[i]["StudentName"] + " on the " + dayOfTheMonth);
                ASSETsAr[i][dayOfTheMonth] += TimeInCenter(periodAttendanceRow["Time Out"], periodAttendanceRow["Time In"]);
            }

        }


    }else {
        studentOb.Count = counter;
        studentOb.Grade = periodAttendanceRow["Grade"];
        studentOb.StudentID = periodAttendanceRow["Student ID"];
        studentOb.StudentName = periodAttendanceRow["First Name"] + " " + periodAttendanceRow["Last Name"];
        removePeriodFromClass(periodAttendanceRow);
        studentOb.Subject = periodAttendanceRow["Subject"];
        if(periodAttendanceRow["Other Subject"]){
            studentOb.Subject += ", " + periodAttendanceRow["Other Subject"];
        }

        if(period === "Lunch"){
            studentOb[dayOfTheMonth] = "1";
            studentOb.Lunch = "Y";
        }else{
            studentOb.Lunch = "N";
            studentOb[dayOfTheMonth] = TimeInCenter(periodAttendanceRow["Time Out"], periodAttendanceRow["Time In"]);

        }

    }

    return studentOb;

}


function BuildASSETs(periodAttendanceRow, period, counter, ASSETsAr) {
        let studentOb = new Student();
        let theDate = periodAttendanceRow.Date;
        let splitDate = theDate.split("/");
        let dayOfTheMonth = splitDate[1];



        if(period === "Lunch" && periodAttendanceRow["Period"] === "Lunch") {
            studentOb = BuildStudentOb(ASSETsAr, periodAttendanceRow, dayOfTheMonth, "Lunch", counter);

        }else if(period === "After School" && periodAttendanceRow["Period"] === "After School") {
            studentOb = BuildStudentOb(ASSETsAr, periodAttendanceRow, dayOfTheMonth, "After School", counter);

        }

    return studentOb;

}


function ASSETsReport(periodAttendance) {
    let ASSETsAr = [];
    let count = 1;
    for(let i = 0; i < periodAttendance.length; i++){
        if(periodAttendance[i]["Student ID"] !== undefined) {
            let theStudent;
            if (theSelector.value === arrayOfPossibleChoices[7]) {
                theStudent = BuildASSETs(periodAttendance[i], "Lunch", count, ASSETsAr);
                if (theStudent.Count !== "") {
                    count++;
                    ASSETsAr.push(theStudent);
                }
            } else if (theSelector.value === arrayOfPossibleChoices[8]) {
                theStudent = BuildASSETs(periodAttendance[i], "After School", count, ASSETsAr);
                if (theStudent.Count !== "") {
                    count++;
                    ASSETsAr.push(theStudent);
                }
            }
        }
    }
    return ASSETsAr;
}


function InsertPrograms(theStudent) {
    theStudent.ELD ="";
    theStudent.PTS ="";
    theStudent.ETS ="";
    theStudent.MIG ="";

}


function AddPrograms(sheetAr) {
    let ELDRoster = objSheetAr["eldRoster"];
    let ETSRoster = objSheetAr["etsRoster"];
    let PTSRoster = objSheetAr["ptsRoster"];
    let MIGRoster = objSheetAr["migRoster"];
    for(let i = 0; i < sheetAr.length; i++){
        InsertPrograms(sheetAr[i]);
        for(let ELDIndex = 0; ELDIndex < ELDRoster.length; ELDIndex++){
            if(sheetAr[i]["Student ID"] === ELDRoster[ELDIndex]["Student ID"]){
                sheetAr[i]["ELD"] = "X";
                ELDRoster.splice(ELDIndex, 1);
                break;
            }
        }
        for(let PTSIndex = 0; PTSIndex < PTSRoster.length; PTSIndex++){
            if(sheetAr[i]["Student ID"] === PTSRoster[PTSIndex]["Student ID"]){
                sheetAr[i]["PTS"] = "X";
                PTSRoster.splice(PTSIndex, 1);
                break;
            }
        }
        for(let ETSIndex = 0; ETSIndex < ETSRoster.length; ETSIndex++){
            if(sheetAr[i]["Student ID"] === ETSRoster[ETSIndex]["Student ID"]){
                sheetAr[i]["ETS"] = "X";
                ETSRoster.splice(ETSIndex, 1);
                break;
            }
        }
        for(let MIGIndex = 0; MIGIndex < MIGRoster.length; MIGIndex++){
            if(sheetAr[i]["Student ID"] === MIGRoster[MIGIndex]["Student ID"]){
                sheetAr[i]["MIG"] = "X";
                MIGRoster.splice(MIGIndex, 1);
                break;
            }
        }

    }
    return sheetAr;

}

//creates the Submit button
function TheButGenerator(){
    var theSubBut = document.createElement("button");
    theSubBut.setAttribute("id", "submitButton");
    theSubBut.setAttribute("type", "button");
    var theButText = document.createTextNode("Submit");
    theSubBut.appendChild(theButText);
    theSubBut.addEventListener("click", DetermineRequest);
    return theSubBut;
}

//Run after the user hits submit
function DetermineRequest() {
    if(theSelector.value == arrayOfPossibleChoices[0]){
        GetSingleFile("periodAttendance");


    }else if(theSelector.value == arrayOfPossibleChoices[1]){
        GetSingleFile("ariesQuery");

    }else if(theSelector.value == arrayOfPossibleChoices[2]){
        GetEachProgramRoster();
    }else if(theSelector.value === arrayOfPossibleChoices[7]){
        GetSingleFile("periodAttendance");
    }else if(theSelector.value === arrayOfPossibleChoices[8]){
        GetSingleFile("periodAttendance");
    }
}

//Pulls the different files and converts each
function GetEachProgramRoster() {
    var alignerDiv = document.getElementById("aligner");
    var numOfFiles = alignerDiv.children.length;
    var arOfInputs = alignerDiv.children;
    for(var i = 0; i < numOfFiles; i++){(function (file, i){
        var reader = new FileReader();
        reader.onload = function (e) {
            if(i == 0){
                ConvertSheetToJSON(e, 0, "ariesQuery");
            }else if(i == 1){
                ConvertSheetToJSONAllPrograms(e)
            }
        };
        reader.readAsArrayBuffer(file);

    })(arOfInputs[i].children[0].files[0], i)}
}


function CorrectHeaders(workSheet) {
    let initalJSON = XLSX.utils.sheet_to_json(workSheet);
    for(var i = 0; i < initalJSON.length; i++) {
        let getOut = false;
        for (cell in initalJSON[i]) {
            if (initalJSON[i][cell] === "Student ID") {
                getOut = !getOut;
                break;
            }
        }
        if (getOut) {
            break;
        }
    }
    let correctJSON = XLSX.utils.sheet_to_json(workSheet, {range: i + 1});
    return correctJSON;
}

function ConvertSheetToJSONAllPrograms(e){
    var data = e.target.result;
    data = new Uint8Array(data);
    var workBook = XLSX.read(data, {type: 'array'});
    var arSheets = workBook.SheetNames;
    for(sheet in arSheets){
        if(arSheets[sheet].includes("ELD")){
            var workSheet = workBook.Sheets[arSheets[sheet]];
            var json = CorrectHeaders(workSheet);
            objSheetAr["eldRoster"] = json;
            theProxy["eldRoster"] = json;
        }else if(arSheets[sheet].includes("ME")){
            var workSheet = workBook.Sheets[arSheets[sheet]];
            var json = CorrectHeaders(workSheet);
            objSheetAr["migRoster"] = json;
            theProxy["migRoster"] = json;

        }else if(arSheets[sheet].includes("ETS")){
            var workSheet = workBook.Sheets[arSheets[sheet]];
            var json = CorrectHeaders(workSheet);
            objSheetAr["etsRoster"] = json;
            theProxy["etsRoster"] = json;

        }else if(arSheets[sheet].includes("PTS")){
            var workSheet = workBook.Sheets[arSheets[sheet]];
            var json = CorrectHeaders(workSheet);
            objSheetAr["ptsRoster"] = json;
            theProxy["ptsRoster"] = json;

        }
    }

}

//takes in the single file submitted by the user to then convert to a JSON
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

    if(i == totalNumFiles - 1){
        var theSubBut = TheButGenerator();
        innerInputDiv.appendChild(theSubBut);


    }else{
        i++;
        AttachInputTextRec(textNodeArray, i, totalNumFiles);
    }



}

//Allows user to select which files they wish to use to generate the report
function UpdateDOMForFileSelection(e) {
    var textNodeArray = [];
    var textNode = document.createTextNode("Please Select Aries Query");
    textNodeArray.push(textNode);
    if(theSelector.value == arrayOfPossibleChoices[0]){
        var textNodeAttendance = document.createTextNode("Please Select Attendance File");
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

    }else if(theSelector.value === arrayOfPossibleChoices[7]){
        var textNodeAttendance = document.createTextNode("Please Select Attendance File");
        textNodeArray.push(textNodeAttendance);
        AttachInputTextInital(textNodeAttendance);
        //AttachMonthInput();
        var theSubBut = TheButGenerator();
        document.getElementById("innerInputDiv0").appendChild(theSubBut);
    }else if(theSelector.value === arrayOfPossibleChoices[8]){
        var textNodeAttendance = document.createTextNode("Please Select Attendance File");
        textNodeArray.push(textNodeAttendance);
        AttachInputTextInital(textNodeAttendance);
        //AttachMonthInput();
        var theSubBut = TheButGenerator();
        document.getElementById("innerInputDiv0").appendChild(theSubBut);
    }
}



function AttachMonthInput() {
    var textMonthInput = document.createTextNode("Please Enter Month As A Number")
    var innerInputDiv0 = document.getElementById("innerInputDiv0");
    var input = document.createElement("input");
    input.setAttribute("type", "number");
    input.setAttribute("min", "0");
    input.setAttribute("id", "fileInput1");
    input.style.borderStyle = "solid";
    innerInputDiv0.appendChild(input);
    var textDiv2 = document.createElement("Div");
    textDiv2.setAttribute("id", "text2");
    textDiv2.appendChild(textMonthInput);
    textDiv2.style.paddingLeft = "5px";
    textDiv2.style.paddingRight = "5px";
    innerInputDiv0.appendChild(textDiv2);


}

function AddAndRemoveKeys(student) {
    AddCountOuter(student);
    delete student["Student Sign Out (Tutor Name)"];
    delete student["Time In"];
    delete student["Time Out"];
    delete student["Period"];
    delete student["Date"];
    delete student["ELD"];
    delete student["PTS"];
    delete student["ETS"];
    delete student["MIG"];

}

function ConcatenateOtherSubject(oldList, newList){
    if(oldList["Other Subject"] === undefined && !(newList["Other Subject"] === undefined)) {
        oldList["Other Subject"] = newList["Other Subject"];
    }else if(!(oldList["Other Subject"] === undefined) && !(newList["Other Subject"] === undefined)){
        oldList["Other Subject"] =  oldList["Other Subject"] + ", " + newList["Other Subject"];
    }
}


function TotalCount (sheetAr){
    for(let i = 0; i < sheetAr.length; i++){
        if(!(sheetAr[i]["Student ID"] === undefined)) {
            AddAndRemoveKeys(sheetAr[i]);
            removePeriodFromClass(sheetAr[i]);
            for (let j = 0; j < sheetAr.length; j++) {
                if (!(sheetAr[j]["Student ID"] === undefined)) {
                    if (sheetAr[i]["Student ID"] === sheetAr[j]["Student ID"]) {
                        if (i !== j) {
                            removePeriodFromClass(sheetAr[j]);
                            removeSubjectDuplicates(sheetAr[i], sheetAr[j], "Subject");
                            ConcatenateOtherSubject(sheetAr[i], sheetAr[j]);
                            let innerCount = CheckForCount(sheetAr[j]);
                            if (innerCount) {
                                sheetAr[i]["Count"] = Number(sheetAr[i]["Count"]) + Number(sheetAr[j]["Count"]);
                            }
                            else {
                                sheetAr[i]["Count"] = Number(sheetAr[i]["Count"]) + 1;
                            }
                            sheetAr[i]["Count"] = sheetAr[i]["Count"].toString();
                            sheetAr.splice(j, 1);
                            console.log(sheetAr.length);
                            j--;
                        }
                    }
                }else{
                    sheetAr.splice(j, 1);
                    j--;
                }
            }
        }else{
            sheetAr.splice(i, 1);
            i--;
        }
    }
    return sheetAr;
}


function CheckForCount(student) {
    const theKeys = Object.keys(student);
    let thereIsCount = false;
    for(let k = 0; k < theKeys.length; k++){
        if(theKeys[k] === "Count"){
            thereIsCount = true;
        }
    }
    return thereIsCount;

}

function AddCountOuter(student){
    let thereIsCount = CheckForCount(student);
    if(!thereIsCount){
        student.Count ="1";
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
    return sheetAr;
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

//Converts excel file to JSON and updates array with converted sheets and the proxy
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




function CreateNewExcel(sheetAr, newExcelName, specialSheet = false){
    if(specialSheet){
        var newSheet = XLSX.utils.json_to_sheet(sheetAr, {header:["Count","StudentName","Grade",
                        "StudentID","Lunch","1","2","3","4","5","6","7","8","9","10","11","12","13",
                        "14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31",
                        "empty_1","empty_2","Subject"]});
    }else {
        var newSheet = XLSX.utils.json_to_sheet(sheetAr);
    }

    var newWorkBook = XLSX.utils.book_new();
    var convertedSheet = "The compiled Sheet";
    XLSX.utils.book_append_sheet(newWorkBook, newSheet, convertedSheet);
    XLSX.writeFile(newWorkBook, newExcelName);
    UpdateUserAboutFile(newExcelName);
}

function  UpdateUserAboutFile(newExcelname) {
    let displayArea = document.getElementById("displayResults");
    let displayText = document.createTextNode(newExcelname + " has been generated!");
    displayArea.appendChild(displayText);
    
}

/!*function removeSubjectDuplicates(sheetAr, i, j){
    if(!(sheetAr[i]["Subject"] === undefined) && !(sheetAr[j]["Subject"] === undefined)) {
        var outterLoopSubjects = sheetAr[i]["Subject"].split(",");
        var innerLoopSubjects = sheetAr[j]["Subject"].split(",");
        var newUniqueSubject = true;

        for (let j2 = 0; j2 < innerLoopSubjects.length; j2++) {
            for (let i2 = 0; i2 < outterLoopSubjects.length; i2++) {
                if (innerLoopSubjects[j2].trim() == outterLoopSubjects[i2].trim()) {
                    newUniqueSubject = false;
                    break;
                }
            }

            if (newUniqueSubject) {
                sheetAr[i]["Subject"] = sheetAr[i]["Subject"] + "," + innerLoopSubjects[j2].trim();
                outterLoopSubjects = sheetAr[i]["Subject"].split(",");
            }

            newUniqueSubject = true;
        }
    }
}*!/

function removeSubjectDuplicates(orginalList, newList, keyword){
    if(!(orginalList[keyword] === undefined) && !(newList[keyword] === undefined) && !(orginalList[keyword] === "") && !(newList[keyword] === "")) {
        var outterLoopSubjects = orginalList[keyword].split(",");
        var innerLoopSubjects = newList[keyword].split(",");
        var newUniqueSubject = true;

        for (let j2 = 0; j2 < innerLoopSubjects.length; j2++) {
            for (let i2 = 0; i2 < outterLoopSubjects.length; i2++) {
                if (innerLoopSubjects[j2].trim() === outterLoopSubjects[i2].trim()) {
                    newUniqueSubject = false;
                    break;
                }
            }

            if (newUniqueSubject) {
                orginalList[keyword] = orginalList[keyword] + ", " + innerLoopSubjects[j2].trim();
                outterLoopSubjects = orginalList[keyword].split(",");
            }

            newUniqueSubject = true;
        }
    }
}


*/