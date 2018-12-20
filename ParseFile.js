//Created By
//Spencer Grossarth 11/27/18

/****To optimize the storage of sheets for searching store them as a binary search tree or a hash table****/

$( document ).ready(function() {

    /*Enables parsing of excel files*/
    var XLSX = require('xlsx');



    /*Names of possible reports the user can select*/
    const arrayOfPossibleChoices = ["Total Count", "Convert Aries Query Fall", "Convert Aries Query Fall With ALL Programs",
        "Monthly Lunch ASSETs Report", "Monthly After School ASSETs Report", "Monthly Migrant Ed Report"];

    /*Saves user data entered after selecting report*/
    var userEnteredData ={
        month:"",
        numberOfUCDTutorFiles:"",
        numberOfPeerTutorFiles:""
    };

    /*Initialized the JQuery select
    * when the user selects the report they want
    * UpdateDomForFilesSelection is called*/
    var theSelectorJQ = $('#theSelector');
    theSelectorJQ.selectmenu({
        position: {my: 'center top', at: 'center bottom'},
        change: UpdateDOMForFileSelection,
        width: 350

    });
    theSelectorJQ.css('background-color', 'blue');


    /*Accessing theSelector with none JQuery Functions*/
    var theSelector = $('#theSelector').get()[0];

    /*Object is populated with jsons after excel sheet has been parsed
    * and a json as been generated*/
    var objSheetAr = {
        periodAttendance: new Array(),
        tutorMonthlyLog: new Array(),
        peerTutorMonthlyLog: new Array(),
        ariesQuery: "",
        etsRoster: "",
        ptsRoster: "",
        migRoster: "",
        eldRoster: "",
    };


    /*when objSheetAr has any of it's values changed the handler triggers.
    * objSheetAr is only changed after the user has selected the files they want parsed
    * and they are converted to jsons. Depending on what report the user has selected
    *the appropriate if statement will be entered and the json will be parsed*/
    const theHandler = {
        set(obj, prop, value) {
            /*Total Count */
            if (prop === "periodAttendance" && theSelector.value === arrayOfPossibleChoices[0]) {
                let sheetAr = TotalCount(objSheetAr["periodAttendance"][0]);
                CreateNewExcel(sheetAr, "TotalCountReport.xlsx");

                /*ASSETs Lunch Report*/
            }else if (prop === "periodAttendance" && theSelector.value === arrayOfPossibleChoices[3]){
                let sheetAr = ASSETsReport(objSheetAr["periodAttendance"][0]);
                CreateNewExcel(sheetAr, "ASSETsLunchReport.xlsx", true);

                /*ASSETs After School Report*/
            }else if (prop === "periodAttendance" && theSelector.value === arrayOfPossibleChoices[4]){
                let sheetAr = ASSETsReport(objSheetAr["periodAttendance"][0]);
                CreateNewExcel(sheetAr, "ASSETsAfterSchoolReport.xlsx", true);

                /*Student Roster with out programs*/
            } else if(prop === "ariesQuery" && value !=="" && obj["etsRoster"] === "" &&
                obj["ptsRoster"] === "" && obj["migRoster"] === "" && obj["eldRoster"] === ""){
                let sheetAr = AriesQuery(objSheetAr["ariesQuery"]);
                CreateNewExcel(sheetAr, "Parsed Aries Query No Programs.xlsx");

                /*Student Roster WITH programs*/
            }else if(obj["ariesQuery"] !== "" && obj["etsRoster"] !== "" &&
                     obj["ptsRoster"] !== "" && obj["migRoster"] !== "" && obj["eldRoster"] !== ""){
                let sheetAr = AriesQuery(objSheetAr["ariesQuery"]);
                sheetAr = AddPrograms(sheetAr);
                CreateNewExcel(sheetAr, "Parsed Aries Query With Programs.xlsx");
                /*Monthly Mig Report*/
            }else if(prop === "periodAttendance" && theSelector.value === arrayOfPossibleChoices[5]){
                if(objSheetAr.tutorMonthlyLog.length > 1){
                    var conatenatedSheet = ConcatenateSheets(objSheetAr.tutorMonthlyLog);
                }
            }
        }
    };

    /*this sets up the a proxy for objSheetAr.
    * When the proxy is changed theHandler is called*/
    var theProxy = new Proxy(objSheetAr, theHandler);


    /*This makes the edges look nice on theSelector and the monthSelector*/
    $('#theSelector-button').click(clickOnSelector);
    function clickOnMonthSelector() {
        $('#monthSelector-button').css('border-radius', '20px 20px 0px 0px');
        $('#monthSelector-menu').css('border-radius', '0px 0px 20px 20px');
        $('#monthSelector-button').click(unclickOnMonthSelector);
        $('#monthSelector-menu').click(unclickOnMonthSelector);
    }
    function unclickOnMonthSelector() {
        $('#monthSelector-button').css('border-radius', '20px');
        $('#monthSelector-button').click(clickOnMonthSelector);
    }
    function clickOnSelector() {
        $('#theSelector-button').css('border-radius', '20px 20px 0px 0px');
        $('#theSelector-menu').css('border-radius', '0px 0px 20px 20px');
        $('#theSelector-button').click(unclickOnSelector);
        $('#theSelector-menu').click(unclickOnSelector);
    }
    function unclickOnSelector() {
        $('#theSelector-button').css('border-radius', '20px');
        $('#theSelector-button').click(clickOnSelector);
    }


    /*this is the Student object that is used when making
    * some of the reports.*/
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


    /*Converts time from hours, minuntes, and AM and PM to raw number.*/
    function Timez(timeString) {
        let amPm = timeString.split(" ")[1]; // if AM or PM
        let timeNums = timeString.split(" ")[0];// Just the numbers
        let hour = timeNums.split(":")[0];
        let minutes = timeNums.split(":")[1];
        let partOfHour = 0;
        this.absoluteTime = 0;
        /*Converts time for AM*/
        if(amPm === "AM"){
            partOfHour = minutes / 60;
            this.absoluteTime = Number(hour) + partOfHour;
        }else { // Converts time for PM
            partOfHour = minutes / 60;
            if(hour === 12){
                this.absoluteTime = Number(hour) + partOfHour;
            }else {
                this.absoluteTime = 12 + Number(hour) + partOfHour;
            }
        }
    }

    /*Calculates the amount of time a student spends after school
    * rounded to the 15 minute intervals that are smaller or equal to
    * the exact time spent in the center.*/
    function TimeInCenter(timeOut, timeIn) {
        /*If no time out was entered say they stated for only 1 hour*/
        if(timeOut === ""){
            return 1;
        }
        let time_In = new Timez(timeIn);
        let time_out = new Timez(timeOut);
        let exactTime = time_out.absoluteTime - time_In.absoluteTime;
        let wholeTime = parseInt(exactTime, 10); // removes minutes, just number of hours
        let justDecimal = exactTime - wholeTime; // only the minutes

        /*rounds the exact number of minutes to rounded 15 min intervals*/
        if(justDecimal >= 0 && .25 > justDecimal){
            justDecimal = 0;
        }else if(justDecimal >= .25 && .5 > justDecimal){
            justDecimal = .25;
        }else if (justDecimal >= .5 && .75 > justDecimal){
            justDecimal = .5;
        }else if (justDecimal >= .75){
            justDecimal = .75;
        }
        /*If wholeTime < 0 means the student left before they got here, so an error.
         * It is treated as 1 hour. If wholeTime < 1 the student stayed less then 1 hour,
          * we round up to an hour in that case.*/
        if((wholeTime < 0) || (wholeTime < 1)){
            return 1;
        }else {
            return wholeTime + justDecimal; // Takes the number of hours and rounded minutes
        }
    }




    /*Takes each of the sheets of the same kind and combines them into on big one*/
    function ConcatenateSheets(sheetsToCombine) {
        let concatenatedSheets = sheetsToCombine[0];
        //https://stackoverflow.com/questions/1374126/how-to-extend-an-existing-javascript-array-with-another-array-without-creating
        /*Apply basically takes a function from some object, in this case a array
        * and applies it to something else. Here I am applying it to arrays but in the normal way.
        * I am pushing and entire array on to an existing array, I am not just pushing a single element
        * and I guess this can't be done in a different way, easily.*/
        for(let i = 1; i < sheetsToCombine.length; i++){
            Array.prototype.push.apply(concatenatedSheets, sheetsToCombine[i]);
        }

        return concatenatedSheets;
    }

    /*Each class has a period at is front ex. 1 - Int Math II.
    * This should be changed to ex. Int Math II. This function takes
    * care of this.*/
    function removePeriodFromClass(objectContainer) {
        /*Only entered if there IS a subject, else do nothing.*/
        if(objectContainer["Subject"] !== undefined) {
            let justClass = ""; //
            let longClass = "";
            justClass = objectContainer["Subject"].split("-"); // splits subject at each '-'
            /*Entered if the class had an additional '-'
            * ex. 2 - English 1 - 2
            * rebuilds so it is ex. English 1- 2*/
            if (justClass.length > 2) {
                for (let i = 0; i < justClass.length - 1; i++) {
                    if (i === 0) {
                        longClass += justClass[i + 1].trim();
                    } else {
                        longClass += " - " + justClass[i + 1];//note English 1 - 2 has spaces while Pre-Calculus doesn't,
                        // here Pre-Calculus will now be Pre - Calculus
                    }
                }
                justClass = longClass;
            /*A class with out an extra '-'
            * ex. 4 - Calculus
            * Becomes ex. Calculus*/
            } else if (justClass[1]) {
                justClass = justClass[1].trim();
            } else { // when subject is empty
                justClass = justClass[0].trim();
            }
            objectContainer["Subject"] = justClass;
        }
    }

    /*Builds up each student row for either of the ASSETs reports,
     including what days of the month they came*/
    function BuildStudentOb (ASSETsAr, periodAttendanceRow, dayOfTheMonth, period, counter){
        let alreadyBeenCounted = false;
        let studentOb = new Student();
        /*checks to to see if student has been counted already*/
        for(var i = 0; i < ASSETsAr.length; i++){
            if(ASSETsAr[i].StudentID === periodAttendanceRow["Student ID"]){
                alreadyBeenCounted = true;
                break;
            }
        }
        /*If a student has already been counted
        * this make sure there are not duplicate subjects in
        * their list of subjects and adds the day they were here*/
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
                /*Checks for duplicates, i.e. same student,
                * same day, same period*/
                }else{
                    console.log("Duplicate Found!! for " + ASSETsAr[i]["StudentName"] + " on the " + dayOfTheMonth);
                    ASSETsAr[i][dayOfTheMonth] = "1";
                }
            }else if(period === "After School"){

                if(ASSETsAr[i][dayOfTheMonth] === ""){
                    ASSETsAr[i][dayOfTheMonth] = TimeInCenter(periodAttendanceRow["Time Out"], periodAttendanceRow["Time In"]);
                    /*Checks for duplicates, i.e. same student,
                * same day, same period*/
                }else{
                    console.log("Duplicate Found!! for " + ASSETsAr[i]["StudentName"] + " on the " + dayOfTheMonth);
                    ASSETsAr[i][dayOfTheMonth] += TimeInCenter(periodAttendanceRow["Time Out"], periodAttendanceRow["Time In"]);
                }

            }

        /*If the student has not been counted it makes
        * a new student and adds the subject and when they were here*/
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

    /*Calls function to build a student.
    * This determins if the student is is being built for
    * the lunch or after school report.*/
    function InitializeStudentBuilder(periodAttendanceRow, period, counter, ASSETsAr) {
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

    /*Builds the ASSETs report row by, one student at a time
    * Used to build either the lunch or after school report*/
    function ASSETsReport(periodAttendance) {
        let ASSETsAr = [];
        let count = 1;
        for(let i = 0; i < periodAttendance.length; i++){
            if(periodAttendance[i]["Student ID"] !== undefined) {
                let theStudent;
                /*Lunch*/
                if (theSelector.value === arrayOfPossibleChoices[3]) {
                    theStudent = InitializeStudentBuilder(periodAttendance[i], "Lunch", count, ASSETsAr);
                    if (theStudent.Count !== "") {
                        count++;
                        ASSETsAr.push(theStudent);
                    }
                    /*After School*/
                } else if (theSelector.value === arrayOfPossibleChoices[4]) {
                    theStudent = InitializeStudentBuilder(periodAttendance[i], "After School", count, ASSETsAr);
                    if (theStudent.Count !== "") {
                        count++;
                        ASSETsAr.push(theStudent);
                    }
                }
            }
        }
        return ASSETsAr;
    }

    /*Initializes the students programs to blank.*/
    function InsertPrograms(theStudent) {
        theStudent.ELD ="";
        theStudent.PTS ="";
        theStudent.ETS ="";
        theStudent.MIG ="";
    }

    /*Checks if a particular student is in a program.
    * If they are they get an X for that program.
    * Additional Note: performance can be improved with
    * search trees or something like that.*/
    function AddPrograms(sheetAr) {
        let ELDRoster = objSheetAr["eldRoster"];
        let ETSRoster = objSheetAr["etsRoster"];
        let PTSRoster = objSheetAr["ptsRoster"];
        let MIGRoster = objSheetAr["migRoster"];
        for(let i = 0; i < sheetAr.length; i++){
            InsertPrograms(sheetAr[i]);
            /*Checks if student is in ELD program,
            * if they are it is noted*/
            for(let ELDIndex = 0; ELDIndex < ELDRoster.length; ELDIndex++){
                if(sheetAr[i]["Student ID"] === ELDRoster[ELDIndex]["Student ID"]){
                    sheetAr[i]["ELD"] = "X";
                    ELDRoster.splice(ELDIndex, 1);
                    break;
                }
            }
            /*Checks if student is in PTS program,
            * if they are it is noted*/
            for(let PTSIndex = 0; PTSIndex < PTSRoster.length; PTSIndex++){
                if(sheetAr[i]["Student ID"] === PTSRoster[PTSIndex]["Student ID"]){
                    sheetAr[i]["PTS"] = "X";
                    PTSRoster.splice(PTSIndex, 1);
                    break;
                }
            }
            /*Checks if student is in ETS program,
            * if they are it is noted*/
            for(let ETSIndex = 0; ETSIndex < ETSRoster.length; ETSIndex++){
                if(sheetAr[i]["Student ID"] === ETSRoster[ETSIndex]["Student ID"]){
                    sheetAr[i]["ETS"] = "X";
                    ETSRoster.splice(ETSIndex, 1);
                    break;
                }
            }
            /*Checks if student is in MIG program,
            * if they are it is noted*/
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

    /*creates the Submit button*/
    function TheButGenerator(text){
        if(text === "Submit"){
            return $('<button type="button" id="submitButton">' + text +'</button>').click(function (){
                $('*').css('cursor', 'wait');
                /*Causes a small delay
                this delay is important because with out it
                the 'wait' mouse never appears
                DetermineRequest is the callback function
                for when the user clicks the submit button*/
                setTimeout(DetermineRequest, 25);
            });
        } else if(text === "Next"){
            return $('<button type="button" id="submitButton">' + text +'</button>').click(function (){
                $('*').css('cursor', 'wait');
                /*Causes a small delay
                this delay is important because with out it
                the 'wait' mouse never appears
                DetermineRequest is the callback function
                for when the user clicks the submit button*/
                setTimeout(NextRequest, 25);
            });

        }

    }

    /*Run after the user hits next*/
    function NextRequest() {
        let text0 = $('#text0');
        /*After entering how many tutor logs to enter and maybe what month you want go here*/
        if(text0.text() === 'Number Of UCD Tutor Logs To Be Used In Report'){
            userEnteredData.numberOfUCDTutorFiles = Number($('#fileCount').val());
            userEnteredData.month= $('#monthSelector-button').text().trim();
            let textNode = 'Select UCD Tutor Monthly Logs';
            //let textNodeArray = new Array(userEnteredData.numberOfUCDTutorFiles);
            clearHTMLAfterSelector();
            AttachInputTextInital(textNode);
            if(userEnteredData.numberOfUCDTutorFiles === 1){
                $('#innerInputDiv0').after(TheButGenerator("Next"));
            }else{
                AttachInputTextMultiple(false, 1, userEnteredData.numberOfUCDTutorFiles);
            }

            /*After getting all the tutor logs uploaded, now time to know how many
            * peer tutor logs wanted and maybe what month go here*/
        } else if (text0.text() === 'Select UCD Tutor Monthly Logs') {
            GetManyOfTheSameFile("tutorMonthlyLog");
            clearHTMLAfterSelector();
            NumOfFilesDesired("Number Of Peer Tutor Logs To Be Used In Report");
            $('#innerInputDiv0').after(TheButGenerator("Next"));

            /*After knowing how many peer tutor logs to be uploaded go here*/
        } else if (text0.text() === 'Number Of Peer Tutor Logs To Be Used In Report'){
            userEnteredData.numberOfPeerTutorFiles = Number($('#fileCount').val());
            let textNode = 'Select Peer Tutor Monthly Logs';
            //let textNodeArray = new Array(userEnteredData.numberOfPeerTutorFiles);
            clearHTMLAfterSelector();
            AttachInputTextInital(textNode);
            if(userEnteredData.numberOfPeerTutorFiles === 1){
                $('#innerInputDiv0').after(TheButGenerator("Next"));
            }else{
                AttachInputTextMultiple(false, 1, userEnteredData.numberOfPeerTutorFiles);
            }

            /*After getting all the peer tutor logs go here*/
        } else if(text0.text() === 'Select Peer Tutor Monthly Logs'){
            GetManyOfTheSameFile("tutorMonthlyLog");
            clearHTMLAfterSelector();
            let textNodeAttendance = document.createTextNode("Please Select Attendance File");
            AttachInputTextInital(textNodeAttendance);
            $('#innerInputDiv0').after(TheButGenerator("Submit"));
        }

    }

    /*Run after the user hits submit*/
    function DetermineRequest() {
        /*Total Count*/
        if(theSelector.value === arrayOfPossibleChoices[0]){
            GetSingleFile("periodAttendance");

        /*Convert Aries Query Fall*/
        }else if(theSelector.value === arrayOfPossibleChoices[1]){
            GetSingleFile("ariesQuery");

        /*Convert Aries Query Fall With ALL Programs*/
        }else if(theSelector.value === arrayOfPossibleChoices[2]){
            GetEachProgramRoster();

        /*Monthly Lunch ASSETs Report*/
        }else if(theSelector.value === arrayOfPossibleChoices[3]){
            GetSingleFile("periodAttendance");

        /*Monthly After School ASSETs Report*/
        }else if(theSelector.value === arrayOfPossibleChoices[4]){
            GetSingleFile("periodAttendance");

        /*Monthly Migrant Ed Report*/
        /*This is really the final step after we have gotten all the UCD tutor logs
        * and after we have gotten all the peer tutor logs*/
        }else if(theSelector.value === arrayOfPossibleChoices[5]){
            GetSingleFile("periodAttendance");
        }
    }

    /*Processing many excel sheets that the same
    * i.e. 15 period attendance sheets*/
    function GetManyOfTheSameFile(fileType) {
        var alignerDiv = document.getElementById("aligner");
        var numOfFiles = alignerDiv.children.length - 1;
        var arOfInputs = alignerDiv.children;
        /*Must be handled this way so each different file is handled
        * not just the same one repeated several times*/
        for(var i = 0; i < numOfFiles; i++){
            let file;
            if(i === 0){
                file = arOfInputs[i].children[1].files[0];
            }else{
                file = arOfInputs[i].children[0].files[0];
            }
            (function (file){
            var reader = new FileReader();
            reader.onload = function (e) {
                    ConvertSheetToJSON(e, 3, fileType);
            };
            reader.readAsArrayBuffer(file);

            })(file)
        }
    }





    /*Processing excel sheets that contain an
    * aries query and then a sheet containing all
    * programs*/
    function GetEachProgramRoster() {
        var alignerDiv = document.getElementById("aligner");
        var numOfFiles = alignerDiv.children.length - 1;
        var arOfInputs = alignerDiv.children;
        /*Must be handled this way so each different file is handled
        * not just the same one repeated several times*/
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

        })(arOfInputs[i].children[1].files[0], i)}
    }

    /*Finds where the students start in excel sheet
    * that position is noted so that the worksheet can be
    * parsed from that point on, disregarding
    * rows above that*/
    function CorrectPositionInSheet(workSheet, startingPointIdentifier, endPointIdentifier ,fileType) {
        let initalJSON = XLSX.utils.sheet_to_json(workSheet);
        let startingRow = 0;
        let endingRow = 0;
        for(var i = 0; i < initalJSON.length; i++) {
            let startingFound = false;
            let endFound =  false;
            for (let cell in initalJSON[i]) {
                /*if cell containing "Student ID" is found, break
                * out of this loop and the outer loop, we have found
                * what we are looking for*/
                if (initalJSON[i][cell] === startingPointIdentifier) {
                    startingFound = true;
                    startingRow =  initalJSON[i]["__rowNum__"];
                    if(endPointIdentifier === undefined){
                        endFound = true;
                        break;
                    }
                }else if (initalJSON[i][cell] === endPointIdentifier){
                    endFound = true;
                    endingRow = initalJSON[i]["__rowNum__"];
                    break;
                }
            }
            if (startingFound && endFound) {
                break;
            }
        }
        let correctJSON;
        /* This produces a json starting at the point we know is the beginning of the students*/
        if(fileType === "tutorMonthlyLog"){
            if(endPointIdentifier === undefined){
                endingRow = initalJSON.length;
            }
            //let range = { s: { c: 0, r: (startingRow + 4) }, e: { c: 16, r: (endingRow + 4) } };
            correctJSON = XLSX.utils.sheet_to_json(workSheet,
                {range: { s: { c: 0, r: (startingRow + 1)}, e: { c: 16, r: (endingRow - 4) } }});
        } else if( fileType === "roster"){
            correctJSON = XLSX.utils.sheet_to_json(workSheet, {range: startingRow + 1});
        }
        return correctJSON;
    }

    /*Resents main page to original state*/
    function clearHTMLAfterSelector() {
        $('#aligner').empty();
        $('#aligner').append('<div id="innerInputDiv0" class="innerInputDiv">');
        $("*").css("cursor", "default");
    }

    /*Takes in one excel worksheet that contains one
    * of the program rosters.*/
    function ConvertSheetToJSONAllPrograms(e){
        let data = e.target.result;
        data = new Uint8Array(data);
        let workBook = XLSX.read(data, {type: 'array'});
        let arSheets = workBook.SheetNames;
        let workSheet;
        let json;
        /*Checks if the sheet names contains a certain programs acronym
        * if it does get the json by finding the start of the students
        * and assign the resulting json to global object and assign it to
        * the proxy*/
        for(sheet in arSheets){
            if(arSheets[sheet].includes("ELD")){
                workSheet = workBook.Sheets[arSheets[sheet]];
                json = CorrectPositionInSheet(workSheet, "Student ID", undefined,"roster");
                objSheetAr["eldRoster"] = json;
                theProxy["eldRoster"] = json;
            }else if(arSheets[sheet].includes("ME")){
                workSheet = workBook.Sheets[arSheets[sheet]];
                json = CorrectPositionInSheet(workSheet, "Student ID", undefined,"roster");
                objSheetAr["migRoster"] = json;
                theProxy["migRoster"] = json;
            }else if(arSheets[sheet].includes("ETS")){
                workSheet = workBook.Sheets[arSheets[sheet]];
                json = CorrectPositionInSheet(workSheet, "Student ID", undefined,"roster");
                objSheetAr["etsRoster"] = json;
                theProxy["etsRoster"] = json;
            }else if(arSheets[sheet].includes("PTS")){
                workSheet = workBook.Sheets[arSheets[sheet]];
                json = CorrectPositionInSheet(workSheet, "Student ID", undefined,"roster");
                objSheetAr["ptsRoster"] = json;
                theProxy["ptsRoster"] = json;
            }
        }
    }

    /*takes in the single file submitted by the user then reads it then
     then calls a function to convert it to a JSON*/
    function GetSingleFile(sheetName){
        var file = document.getElementById("fileInput0").files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            ConvertSheetToJSON(e, 0, sheetName);

        };
        reader.readAsArrayBuffer(file);

    }

    /*After user clicks on an upload button
    * the text on that button changes to the
    * file that was selected */
    function ChangeFileUploadButton(inputName,nameOfButtonPushed) {
        var fileName = $(inputName)[0].files[0]['name'];
        $(nameOfButtonPushed).text('You Selected: '+ fileName);
    }

    /*After user has selected the report they want generated
    * this makes the first file upload button and title*/
    function AttachInputTextInital(textNode){
        $('#innerInputDiv0').append('<div id="text0" class="textDiv"></div>'); // Type of file to upload
        $('#text0').append(textNode);
        $('#text0').after('<input type="file" id="fileInput0" class="fileInputDiv">'); // Actual file uplad button
        /* Label that allows styling of file upload button */
        $('#fileInput0').after('<label for="fileInput0" class="labels" id="fileInput0Label"> Choose a file</label>');
        let labelName = '#fileInput0Label';
        let inputName = '#fileInput0';
        $('#fileInput0Label').prepend('<i class="fas fa-upload"></i>'); // upload icon
        /* changes text on upload button to name of file uploading*/
        $('#fileInput0').change(function () {
            ChangeFileUploadButton(inputName,labelName);
        });
    }

    /*Attaches all upload buttons and names after the initial*/
    function AttachInputTextMultiple(textNodeArray, i, totalNumFiles) {
        /*textNodeArray is either an array of text nodes or in the case below
        * it will simply be a bool that is false*/

        /*this is for attaching one title and multiple upload buttons.
        * This is used when uploading multiple files of the same type,
        * i.e. 15 tutor logs*/
        if(textNodeArray === false){
            for(i; i < totalNumFiles; i++){
                let newInnerInput = '#innerInputDiv' + i;
                /*Div containing an upload button and its title*/
                $('#aligner').append($('<div class="innerInputDiv"></div>').attr('id', 'innerInputDiv' + i));
                /*upload button*/
                $('#innerInputDiv' + i).append($('<input type="file" class="fileInputDiv">').attr('id', 'fileInput' + i));
                let newFileInput = '#fileInput' + i;
                /*label for upload button, so it can be styled*/
                $(newFileInput).after($('<label  class="labels" > Choose a file' +
                    '</label>').attr({'for': 'fileInput' + i, 'id': 'fileInput' + i + 'Label'}));
                let inputName = '#fileInput' + i;
                let newLabel = '#fileInput' + i + 'Label';
                $(newLabel).prepend('<i class="fas fa-upload"></i>'); // upload icon
                /*call back function that changes name of upload button to file being uploaded*/
                $(inputName).change(function () {
                    ChangeFileUploadButton(inputName, newLabel);
                });
                /*when the appropriate number of upload file
                * buttons have been generated, attach the
                * submit button to the end.
                * ***This might need to be changed later, when we need to***
                * ***upload many of 2 types of files*** */
                if(i === totalNumFiles - 1){
                    $(newInnerInput).after(TheButGenerator("Next"));
                }
            }
            /*when attaching many upload buttons
            * for different types of files. */
        }else{
            for(i; i < totalNumFiles; i++){
                let newInnerInput = '#innerInputDiv' + i;
                /*Div containing an upload button and its title*/
                $('#aligner').append($('<div class="innerInputDiv"></div>').attr('id', 'innerInputDiv' + i));
                $(newInnerInput).append($('<div class="textDiv"></div>').attr('id', 'text' + i));
                /*type of file to upload*/
                let newText = '#text' + i;
                $(newText).append(textNodeArray[i]);
                /*upload button*/
                $(newText).after($('<input type="file" class="fileInputDiv">').attr('id', 'fileInput' + i));
                let newFileInput = '#fileInput' + i;
                /*label for upload button, so it can be styled*/
                $(newFileInput).after($('<label  class="labels" > Choose a file' +
                    '</label>').attr({'for': 'fileInput' + i, 'id': 'fileInput' + i + 'Label'}));
                let inputName = '#fileInput' + i;
                let newLabel = '#fileInput' + i + 'Label';
                $(newLabel).prepend('<i class="fas fa-upload"></i>'); // upload icon
                /*call back function that changes name of upload button to file being uploaded*/
                $(inputName).change(function () {
                    ChangeFileUploadButton(inputName, newLabel);
                });
                /*when the appropriate number of upload file
                * buttons have been generated, attach the
                * submit button to the end.*/
                if(i === totalNumFiles - 1){
                    $(newInnerInput).after(TheButGenerator("Submit"));
                }
            }
        }
    }


    /*Updates the DOM after user selects which report they want to make.*/
    function UpdateDOMForFileSelection(e) {
        var textNodeArray = [];
        var textNode = document.createTextNode("Please Select Aries Query");
        textNodeArray.push(textNode);
        /*Total Count*/
        if(theSelector.value === arrayOfPossibleChoices[0]){
            let textNodeAttendance = document.createTextNode("Please Select Attendance File");
            AttachInputTextInital(textNodeAttendance);
            $('#innerInputDiv0').after(TheButGenerator("Submit"));
            /*Convert Aries Query Fall*/
        }else if(theSelector.value === arrayOfPossibleChoices[1]){
            AttachInputTextInital(textNode);
            $('#innerInputDiv0').after(TheButGenerator("Submit"));
            /*Convert Aries Query Fall With ALL Programs*/
        } else if(theSelector.value === arrayOfPossibleChoices[2]){
            var textNode1 = document.createTextNode("Please Select Excel Sheet Containing All Program Roster's");
            textNodeArray.push(textNode1);
            AttachInputTextInital(textNode);
            AttachInputTextMultiple(textNodeArray, 1, 2);
            /*Monthly Lunch ASSETs Report*/
        }else if(theSelector.value === arrayOfPossibleChoices[3]){
            var textNodeAttendance = document.createTextNode("Please Select Attendance File");
            textNodeArray.push(textNodeAttendance);
            AttachInputTextInital(textNodeAttendance);
            $('#innerInputDiv0').after(TheButGenerator("Submit"));
            /*Monthly After School ASSETs Report*/
        }else if(theSelector.value === arrayOfPossibleChoices[4]){
            var textNodeAttendance = document.createTextNode("Please Select Attendance File");
            textNodeArray.push(textNodeAttendance);
            AttachInputTextInital(textNodeAttendance);
            $('#innerInputDiv0').after(TheButGenerator("Submit"));
            /*Monthly Migrant Ed Report*/
        }else if(theSelector.value === arrayOfPossibleChoices[5]){
            NumOfFilesDesired("Number Of UCD Tutor Logs To Be Used In Report");
            MonthWanted();
            $('#innerInputDiv1').after(TheButGenerator("Next"));
        }
    }
    
    
    /*Updates DOM so user can enter the number of files they are going to
    * upload for the report*/
    function NumOfFilesDesired(text) {
        let textNode = "<p>" + text + "</p>";
        $('#innerInputDiv0').append('<div id="text0" class="textDiv"></div>');
        $('#text0').append(text);
        $('#text0').after('<input type="number" id="fileCount" min="1">');
    }

    /*Updates DOM so user can select which month they are interested in*/
    function MonthWanted() {
        let newInnerInput = '#innerInputDiv1';
        $('#aligner').append($('<div class="innerInputDiv"></div>').attr('id', 'innerInputDiv1'));
        $(newInnerInput).append($('<div class="textDiv"></div>').attr('id', 'text1'));
        let newText = '#text1';
        $(newText).append('Month');
        $(newText).after($('<select id="monthSelector">' +
            '<option></option>' +
            '<option> January </option>' +
            '<option> February </option>' +
            '<option> March </option>' +
            '<option> April </option>' +
            '<option> May </option>' +
            '<option> June </option>' +
            '<option> July </option>' +
            '<option> August </option>' +
            '<option> September </option>' +
            '<option> October </option>' +
            '<option> November </option>' +
            '<option> December </option>' +
                '</select>'));
        $('#monthSelector').selectmenu({
                position: {my: 'center top', at: 'center bottom'},
                width: 150
            })
        $('#monthSelector-button').click(clickOnMonthSelector);
    }

    /*First checks to see if the student has had the "count" property added
    * to it, if not it is added.
    * Second, when calculating how many times a student was tutored,
    * certain info stored about there individual tutoring sessions
    * are not important and are thus deleted here.*/
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

    /*Concatenates the "Other Subject" values for a given student*/
    function ConcatenateOtherSubject(oldList, newList){
        /*If the previous entry of the student doesn't have an "Other Subject" and the new one does*/
        if(oldList["Other Subject"] === undefined && (newList["Other Subject"] !== undefined)) {
            oldList["Other Subject"] = newList["Other Subject"];
        /*If previous entry has "Other Subject" and the new entry does as well*/
        }else if(!(oldList["Other Subject"] === undefined) && (newList["Other Subject"] !== undefined)){
            oldList["Other Subject"] =  oldList["Other Subject"] + ", " + newList["Other Subject"];
        }
    }


    /*Iterates through a sheet and calculates the total number of times
    * each student was tutored.
    * ***To optimize this store array in a binary search tree or hash table*** */
    function TotalCount (sheetAr){
        /*Goes through each row in the sheet*/
        for(let i = 0; i < sheetAr.length; i++){
            if(sheetAr[i]["Student ID"] !== undefined) {
                AddAndRemoveKeys(sheetAr[i]);
                removePeriodFromClass(sheetAr[i]);
                /*Inner loop that is used to compare each each row in the
                * sheet to all other rows in it. In order to total the number
                * of times the student was tutored*/
                for (let j = 0; j < sheetAr.length; j++) {
                    if (sheetAr[j]["Student ID"] !== undefined) {
                        if (sheetAr[i]["Student ID"] === sheetAr[j]["Student ID"]) {
                            /*if it isn't the same row*/
                            if (i !== j) {
                                removePeriodFromClass(sheetAr[j]);
                                removeSubjectDuplicates(sheetAr[i], sheetAr[j], "Subject");
                                ConcatenateOtherSubject(sheetAr[i], sheetAr[j]);
                                /*Checks if "Count" exists in the given student
                                * if it doesn't it is added and initialized to 1.
                                * If it does it is incremented.*/
                                let innerCount = CheckForCount(sheetAr[j]);
                                if (innerCount) {
                                    sheetAr[i]["Count"] = Number(sheetAr[i]["Count"]) + Number(sheetAr[j]["Count"]);
                                }
                                else {
                                    sheetAr[i]["Count"] = Number(sheetAr[i]["Count"]) + 1;
                                }
                                sheetAr[i]["Count"] = sheetAr[i]["Count"].toString();
                                /*removes the inner loop row, other rows don't
                                * have to be compared to it over and over again
                                * when we have already gotten the information for it*/
                                sheetAr.splice(j, 1);
                                j--; //the index needs to be updated since there is one less row
                            }
                        }
                    }else{
                        /*removes the inner loop row, other rows don't
                         * have to be compared to it over and over again
                         * when we have already gotten the information for it*/
                        sheetAr.splice(j, 1);
                        j--; //the index needs to be updated since there is one less row
                    }
                }
            }else{
                /*removes the outer loop row, when it doesn't have a student ID
                * so we don't compare other rows to it over and over again.*/
                sheetAr.splice(i, 1);
                i--; //the index needs to be updated since there is one less row
            }
        }
        return sheetAr;
    }

    /*Checks if the student has "Count".*/
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

    /*If student doesn't have "Count", it is added
    * to the student with the initialized to 1*/
    function AddCountOuter(student){
        let thereIsCount = CheckForCount(student);
        if(!thereIsCount){
            student.Count ="1";
        }
    }

    /*Builds up the sheet so that it includes all the students
    * classes (in the same row), and removes the duplicate rows*/
    function AriesQuery (sheetAr){
        let keyword = "Class";
        for(let i = 0; i < sheetAr.length; i++){
            AddClassSlots(sheetAr[i], keyword);
            for(let j = 0; j < sheetAr.length; j++){
                if(sheetAr[i]["Student ID"] === sheetAr[j]["Student ID"]){
                    if(i !== j){
                        if(sheetAr[j]["Semester"] !== "S"){
                            let period = sheetAr[j]["Period"];
                            keyword = keyword + period;
                            /*adds the class, with the period, to the appropriate class entry in the object*/
                            sheetAr[i][keyword] = period + " - " + sheetAr[j]["Course title"];
                            AVIDChecker(sheetAr[i], sheetAr[j]["Course title"]);
                            sheetAr.splice(j, 1); //removes row
                            j--; // change index since a row was removed
                            keyword = "Class";
                        }else {
                            sheetAr.splice(j, 1); //removes row
                            j--; // change index since a row was removed
                        }
                    }
                }
            }
        }
        return sheetAr;
    }

    /*Updates the object to to include all classes and adds the initial course*/
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
        let period = singleObject["Period"];
        keyword = keyword + period;
        /*Adds the initial course to the object*/
        singleObject[keyword] = period + " - " + singleObject["Course title"];
        AVIDChecker(singleObject, singleObject["Course title"]);
        delete singleObject["Course title"];
        delete singleObject["Period"];
        delete singleObject["Semester"];

    }

    /*checks the student has an AVID class, if it does it is noted*/
    function AVIDChecker(outLoopStudent, innerLoopSubject) {
        if(innerLoopSubject.includes("AVID")){
            outLoopStudent["AVID"] = "X";
        }
    }

    /*Converts excel file to JSON and updates global array with converted sheets and the global proxy*/
    function ConvertSheetToJSON(e, correctSheet, sheetName) {
        let data = e.target.result;
        data = new Uint8Array(data);
        let workBook = XLSX.read(data, {type: 'array'});
        let arSheets = workBook.SheetNames;
        let workSheet = workBook.Sheets[arSheets[correctSheet]];
        if(sheetName === "periodAttendance") {
            /*The global object needs to be changed to store
            * the sheet array but the proxy just needs to have its value updated
            * so that it will trigger the handler*/
            let json = XLSX.utils.sheet_to_json(workSheet);
            objSheetAr[sheetName].push(json);
            theProxy[sheetName] = 5; // This can be literally anything
        } else if (sheetName === "tutorMonthlyLog"){
            var followingMonth;
            /*Names of Months, needed to find next month so the correct part of the log will be taken in*/
            const arrayOfMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
                "October", "November", "December"];
            if((userEnteredData.month === "December") || (userEnteredData.month === "June")){
                followingMonth = undefined;
            }else{
                for(let j = 0; j < arrayOfMonths.length; j++){
                    if(arrayOfMonths[j] === userEnteredData.month){
                        followingMonth = arrayOfMonths[j + 1];
                    }
                }

            }


            /*The global object needs to be changed to store
            * the sheet array but the proxy just needs to have its value updated
            * so that it will trigger the handler*/
            let json = CorrectPositionInSheet(workSheet, userEnteredData.month, followingMonth, sheetName);
            objSheetAr[sheetName].push(json);
            theProxy[sheetName] = 5; // This can be literally anything
        } else {
            let json = XLSX.utils.sheet_to_json(workSheet);
            objSheetAr[sheetName] = json;
            theProxy[sheetName] = json;
        }
    }



    /*After the given sheets have been parsed, here the result is
    * turned in a new excel sheet and then workbook.*/
    function CreateNewExcel(sheetAr, newExcelName, ASSETsReport = false){
        if(ASSETsReport){
            /*ASSETs reports need special headers for the columns*/
            var newSheet = XLSX.utils.json_to_sheet(sheetAr, {header:["Count","StudentName","Grade",
                    "StudentID","Lunch","1","2","3","4","5","6","7","8","9","10","11","12","13",
                    "14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31",
                    "empty_1","empty_2","Subject"]});
        }else {
            var newSheet = XLSX.utils.json_to_sheet(sheetAr);
        }
        let newWorkBook = XLSX.utils.book_new();
        let convertedSheet = "The compiled Sheet";
        XLSX.utils.book_append_sheet(newWorkBook, newSheet, convertedSheet);
        XLSX.writeFile(newWorkBook, newExcelName);
        UpdateUserAboutFile(newExcelName);
    }

    /*Updates the DOM to tell the user the final status of the
    * file they are trying to create. Currently this only tells about success
    * I still need to implement what happens there is an error.*/
    function  UpdateUserAboutFile(newExcelname) {
        let displayResults = $('#displayResults');
        displayResults.attr('class', 'messageOuter successMessageOuter');
        displayResults.append('<div id="messageAwesomeFont"></div>');
        $('#messageAwesomeFont').append('<i class="far fa-check-circle messageSymbol"></i>');
        displayResults.append('<div id="successMessageInner" class="messageInner"></div>');
        let successMesInner = $('#successMessageInner');
        successMesInner.append('<div id="successMessageTitle" class="messageTitle"> Success </div>');
        successMesInner.append('<div class="messageInMessage"></div>');
        let theMessage = "Congratulations, " + newExcelname + " has been created!!!";
        $('.messageInMessage').append(theMessage);
        $("*").css("cursor", "default");
    }

    /*Checks current list of subjects for a given student against a new
    * list of subjects for that students and adds any new, not already in the list,
    * subjects to the current list.*/
    function removeSubjectDuplicates(orginalList, newList, keyword){
        /*Makes sure both lists exist and they both are not empty*/
        if((orginalList[keyword] !== undefined) && (newList[keyword] !== undefined)
            && (orginalList[keyword] !== "") && (newList[keyword] !== "")) {
            let outterLoopSubjects = orginalList[keyword].split(",");
            let innerLoopSubjects = newList[keyword].split(",");
            let newUniqueSubject = true;
            /*Compares current list of subjects to new list of subjects checking
            * for a new unique subject*/
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

