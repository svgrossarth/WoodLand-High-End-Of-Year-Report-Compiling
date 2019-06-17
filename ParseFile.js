//Created By
//Spencer Grossarth 11/27/18

/****To optimize the storage of sheets for searching store them as a binary search tree or a hash table****/

$( document ).ready(function() {

    /*Enables parsing of excel files*/
    var XLSX = require('xlsx');


    /*object to hold various bits of data needed through out the project*/
    var globalObject = {
        /*Names of possible reports the user can select*/
        arrayOfPossibleChoices : ["Total Count", "Convert Aries Query Fall", "Attendance and Log Roster Fall",
            "Convert Aries Query Spring", "Attendance and Log Roster Spring",
            "ASSETs Lunch Report", "ASSETs AS Report", "Migrant Ed Monthly Report",
            "EOS Totals Fall", "EOS AS Totals Fall", "EOS Totals Spring", "EOS AS Totals Spring",
            "Test for Peer Tutors End Of Fall Semester", "Test for UC Davis Tutors End Of Fall Semester",
            "Test for Period Attendance End Of Fall Semester", "EOY Report"],


/*[ 0 "Total Count",                                   1 "Convert Aries Query Fall", 2  "Attendance and Log Roster Fall",
3  "Convert Aries Query Spring",                       4 "Attendance and Log Roster Spring",
5  "ASSETs Lunch Report",                              6 "ASSETs AS Report",         7  "Migrant Ed Monthly Report",
8  "EOS Totals Fall",                                  9 "EOS AS Totals Fall",       10 "EOS Totals Spring", 11 "EOS AS Totals Spring",
12 "Test for Peer Tutors End Of Fall Semester",       13 "Test for UC Davis Tutors End Of Fall Semester",
14 "Test for Period Attendance End Of Fall Semester", 15 "EOY Report"]*/

    /*Saves user data entered after selecting report*/
    userEnteredData : {
        month:"",
        numberOfUCDTutorFiles:"",
        numberOfPeerTutorFiles:"",
    },

    /*Object is populated with jsons after excel sheet has been parsed
    * and a json as been generated*/
    objSheetAr : {
        periodAttendance: new Array(),
        tutorMonthlyLog: new Array(),
        peerTutorMonthlyLog: new Array(),
        EOS: new Array(),
        aeriesQuery: "",
        etsRoster: "",
        ptsRoster: "",
        migRoster: "",
        eldRoster: ""
    },

        numberOfDuplicatesFound : 0,
        numberOfcountsAdded : 0,
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

        /*WORK HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/
        $('#theSelector-button').css('border-radius', '20px 20px 0px 0px');
        $('#theSelector-menu').css('border-radius', '0px 0px 20px 20px');
        $('#theSelector-button').off("click", '#theSelector-button');
        $('#theSelector-menu').off("click", '#theSelector-menu');
        $('#theSelector-button').click(unclickOnSelector);
        $('#theSelector-menu').click(unclickOnSelector);
    }
    function unclickOnSelector() {
        $('#theSelector-button').css('border-radius', '20px');
        $('#theSelector-button').off("click", '#theSelector-button');
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


    /*Updates the DOM after user selects which report they want to make.*/
    function UpdateDOMForFileSelection(e) {
        clearHTMLAfterSelector();
        ClearOldData();
        var textNodeArray = [];
        var textNode = document.createTextNode("Please Select Aeries Query");
        textNodeArray.push(textNode);

        /*Total Count*/
        if(theSelector.value === globalObject.arrayOfPossibleChoices[0]){
            let textNodeAttendance = document.createTextNode("Please Select Attendance File");
            AttachInputTextInital(textNodeAttendance);
            $('#innerInputDiv0').after(TheButGenerator("Submit"));

            /*Convert Aries Query Fall*/
        }else if(theSelector.value === globalObject.arrayOfPossibleChoices[1]){
            AttachInputTextInital(textNode);
            $('#innerInputDiv0').after(TheButGenerator("Submit"));

            /*Attendance and Log Roster Fall*/
        } else if(theSelector.value === globalObject.arrayOfPossibleChoices[2]){
            var textNode1 = document.createTextNode("Please Select Excel Sheet Containing All Program Roster's");
            textNodeArray.push(textNode1);
            AttachInputTextInital(textNode);
            AttachInputTextMultiple(textNodeArray, 1, 2, true);

            /*Convert Aries Query Spring*/
        }else if(theSelector.value === globalObject.arrayOfPossibleChoices[3]){
            AttachInputTextInital(textNode);
            $('#innerInputDiv0').after(TheButGenerator("Submit"));

            /*Attendance and Log Roster Spring*/
        } else if(theSelector.value === globalObject.arrayOfPossibleChoices[4]){
            var textNode1 = document.createTextNode("Please Select Excel Sheet Containing All Program Roster's");
            textNodeArray.push(textNode1);
            AttachInputTextInital(textNode);
            AttachInputTextMultiple(textNodeArray, 1, 2, true);

            /*ASSETs Lunch Report*/
        }else if(theSelector.value === globalObject.arrayOfPossibleChoices[5]){
            var textNodeAttendance = document.createTextNode("Please Select Attendance File");
            textNodeArray.push(textNodeAttendance);
            AttachInputTextInital(textNodeAttendance);
            $('#innerInputDiv0').after(TheButGenerator("Submit"));

            /*ASSETs AS Report*/
        }else if(theSelector.value === globalObject.arrayOfPossibleChoices[6]){
            var textNodeAttendance = document.createTextNode("Please Select Attendance File");
            textNodeArray.push(textNodeAttendance);
            AttachInputTextInital(textNodeAttendance);
            $('#innerInputDiv0').after(TheButGenerator("Submit"));

            /*Migrant Ed Monthly Report*/
        }else if(theSelector.value === globalObject.arrayOfPossibleChoices[7]){
            var textNodeAttendance = document.createTextNode("Please Select Excel Sheet Containing All Program Roster's");
            AttachInputTextInital(textNodeAttendance);
            MonthWanted();
            $('#innerInputDiv1').after(TheButGenerator("Next"));

            /*EOS Totals Fall Or EOS Totals Spring*/
        }else if((theSelector.value === globalObject.arrayOfPossibleChoices[8]) ||
            (theSelector.value === globalObject.arrayOfPossibleChoices[10])){
            NumOfFilesDesired("Number Of UCD Tutor Logs To Be Used In Report");
            $('#innerInputDiv0').after(TheButGenerator("Next"));

            /*EOS AS Totals Fall*/
        }else if(theSelector.value === globalObject.arrayOfPossibleChoices[9]){
            let textNode = 'Select Period Attendance Files From August to December';
            AttachInputTextInital(textNode);
            AttachInputTextMultiple(false, 1, 5, true);

            /*EOS AS Totals Spring*/
        }else if(theSelector.value === globalObject.arrayOfPossibleChoices[11]){
            let textNode = 'Select Period Attendance Files From January to June';
            AttachInputTextInital(textNode);
            AttachInputTextMultiple(false, 1, 6, true);

            /*Test for fall peer tutors*/
        }else if(theSelector.value === globalObject.arrayOfPossibleChoices[12]){
            NumOfFilesDesired("Number Of Peer Tutor Logs To Be Used In Report");
            $('#innerInputDiv0').after(TheButGenerator("Next"));

            /*Test for fall UC Davis tutors*/
        }else if(theSelector.value === globalObject.arrayOfPossibleChoices[13]){
            NumOfFilesDesired("Number Of UCD Tutor Logs To Be Used In Report");
            $('#innerInputDiv0').after(TheButGenerator("Next"));

            /*Test for fall period attendance*/
        }else if(theSelector.value === globalObject.arrayOfPossibleChoices[14]){
            let textNode = 'Select Period Attendance Files From August to December';
            AttachInputTextInital(textNode);
            AttachInputTextMultiple(false, 1, 5, true);

            /*EOY Report*/
        } else if(theSelector.value === globalObject.arrayOfPossibleChoices[15]){
            let textNode = 'Select a Fall and Spring EOS report';
            AttachInputTextInital(textNode);
            AttachInputTextMultiple(false, 1, 2, true);
        }


    }


    /*Resents main page to original state*/
    function clearHTMLAfterSelector() {
        $('#displayResults').empty();
        $('#aligner').empty();
        $('#aligner').append('<div id="innerInputDiv0" class="innerInputDiv">');
        $("*").css("cursor", "default");
    }


    /*Clears out the global object of old data from past report.*/
    function ClearOldData(){
        globalObject.userEnteredData.numberOfPeerTutorFiles = "";
        globalObject.userEnteredData.month = "";
        globalObject.userEnteredData.numberOfUCDTutorFiles = "";

        globalObject.numberOfcountsAdded = 0;
        globalObject.numberOfDuplicatesFound = 0;

        globalObject.objSheetAr.periodAttendance = [];
        globalObject.objSheetAr.tutorMonthlyLog = [];
        globalObject.objSheetAr.peerTutorMonthlyLog = [];
        globalObject.objSheetAr.aeriesQuery = "";
        globalObject.objSheetAr.etsRoster = "";
        globalObject.objSheetAr.ptsRoster = "";
        globalObject.objSheetAr.migRoster = "";
        globalObject.objSheetAr.eldRoster = "";
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


    /* Attaches all upload buttons and names after the initial
     * textNodeArray is either an array of text nodes or in the case below
     * it will simply be a bool that is false.
     * finalRequest is bool that signifies of there will be more info needed before the report
     * can be generated or not, aka will the button at the end be submit or next.*/
    function AttachInputTextMultiple(textNodeArray, i, totalNumFiles, finalRequest) {
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
                * submit button to the end if finalrequest is true, if it is
                * false then attach the next button.*/
                if(i === totalNumFiles - 1){
                    if(finalRequest){
                        $(newInnerInput).after(TheButGenerator("Submit"));
                    }else {
                        $(newInnerInput).after(TheButGenerator("Next"));
                    }
                }
            }

            /*when attaching many upload buttons
            * for different types of files.*/
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
                    if(finalRequest){
                        $(newInnerInput).after(TheButGenerator("Submit"));
                    }else {
                        $(newInnerInput).after(TheButGenerator("Next"));
                    }
                }
            }
        }
    }


    /*After user clicks on an upload button
    * the text on that button changes to the
    * file that was selected */
    function ChangeFileUploadButton(inputName,nameOfButtonPushed) {
        var fileName = $(inputName)[0].files[0]['name'];
        $(nameOfButtonPushed).text('You Selected: '+ fileName);
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




    /*Run after the user hits next*/
    function NextRequest() {
        let text0 = $('#text0');
        /*When working with end of fall semester reports that work with tutor logs
        * the month needs to be set to August so it will look at there logs starting in August*/
        if(theSelector.value === globalObject.arrayOfPossibleChoices[8] ||
            theSelector.value === globalObject.arrayOfPossibleChoices[12] ||
            theSelector.value === globalObject.arrayOfPossibleChoices[13]){
            globalObject.userEnteredData.month = "August";
            /*When working with end of spring semester reports that work with tutor logs
        * the month needs to be set to January so it will look at there logs starting in January*/
        } else if(theSelector.value === globalObject.arrayOfPossibleChoices[10]){
            globalObject.userEnteredData.month = "January";
        }
        /*After entering how many tutor logs to enter and maybe what month you want go here*/
        if(text0.text() === 'Number Of UCD Tutor Logs To Be Used In Report'){
            globalObject.userEnteredData.numberOfUCDTutorFiles = Number($('#fileCount').val());
            if(theSelector.value === globalObject.arrayOfPossibleChoices[5] ||
                theSelector.value === globalObject.arrayOfPossibleChoices[6]){
                globalObject.userEnteredData.month = $('#monthSelector-button').text().trim();
            }

            let textNode = 'Select UCD Tutor Monthly Logs';
            //let textNodeArray = new Array(globalObject.userEnteredData.numberOfUCDTutorFiles);
            clearHTMLAfterSelector();
            AttachInputTextInital(textNode);
            if(globalObject.userEnteredData.numberOfUCDTutorFiles === 1){
                if(globalObject.arrayOfPossibleChoices[8] === theSelector.value ||
                    globalObject.arrayOfPossibleChoices[7] === theSelector.value ||
                    globalObject.arrayOfPossibleChoices[10] === theSelector.value) {
                    $('#innerInputDiv0').after(TheButGenerator("Next"));
                } else if (globalObject.arrayOfPossibleChoices[13] === theSelector.value) {
                    $('#innerInputDiv0').after(TheButGenerator("Submit"));
                }
            }else{
                /*Checks which report is being generated to determine what should be added to DOM*/
                if(globalObject.arrayOfPossibleChoices[8] === theSelector.value ||
                    globalObject.arrayOfPossibleChoices[7] === theSelector.value ||
                    globalObject.arrayOfPossibleChoices[10] === theSelector.value){
                    AttachInputTextMultiple(false, 1, globalObject.userEnteredData.numberOfUCDTutorFiles, false);
                } else if (globalObject.arrayOfPossibleChoices[13] === theSelector.value){
                    AttachInputTextMultiple(false, 1, globalObject.userEnteredData.numberOfUCDTutorFiles, true);
                }
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
            globalObject.userEnteredData.numberOfPeerTutorFiles = Number($('#fileCount').val());
            let textNode = 'Select Peer Tutor Monthly Logs';
            clearHTMLAfterSelector();
            AttachInputTextInital(textNode);
            if(globalObject.userEnteredData.numberOfPeerTutorFiles === 1){
                /*Checks which report is being generated to determine what should be added to DOM*/
                if(globalObject.arrayOfPossibleChoices[8] === theSelector.value ||
                    globalObject.arrayOfPossibleChoices[7] === theSelector.value ||
                    globalObject.arrayOfPossibleChoices[10] === theSelector.value) {
                    $('#innerInputDiv0').after(TheButGenerator("Next"));
                } else if (globalObject.arrayOfPossibleChoices[12] === theSelector.value){
                    $('#innerInputDiv0').after(TheButGenerator("Submit"));
                }
            }else{

                /*Checks which report is being generated to determine what should be added to DOM*/
                if(globalObject.arrayOfPossibleChoices[8] === theSelector.value ||
                    globalObject.arrayOfPossibleChoices[7] === theSelector.value ||
                    globalObject.arrayOfPossibleChoices[10] === theSelector.value){
                    AttachInputTextMultiple(false, 1, globalObject.userEnteredData.numberOfPeerTutorFiles, false);
                } else if (globalObject.arrayOfPossibleChoices[12] === theSelector.value){
                    AttachInputTextMultiple(false, 1, globalObject.userEnteredData.numberOfPeerTutorFiles, true);
                }
            }

            /*After getting all the peer tutor logs go here to get the period attendance file*/
        } else if(text0.text() === 'Select Peer Tutor Monthly Logs' && theSelector.value === globalObject.arrayOfPossibleChoices[7]){
            GetManyOfTheSameFile("tutorMonthlyLog");
            clearHTMLAfterSelector();
            let monthNeeded = "Please Select Period Attendance File for the month of " + globalObject.userEnteredData.month +".";
            let textNodeAttendance = document.createTextNode(monthNeeded);
            AttachInputTextInital(textNodeAttendance);
            $('#innerInputDiv0').after(TheButGenerator("Submit"));

            /*After selecting the peer tutor logs to be used go here to get all the period attendance files
            * for the EOS Fall total report*/
        } else if(text0.text() === 'Select Peer Tutor Monthly Logs' &&
                    theSelector.value === globalObject.arrayOfPossibleChoices[8]){
            GetManyOfTheSameFile("tutorMonthlyLog");
            clearHTMLAfterSelector();
            let textNode = 'Select Period Attendance Files From August to December';
            AttachInputTextInital(textNode);
            AttachInputTextMultiple(false, 1, 5, true);
            /*After selecting the peer tutor logs to be used go here to get all the period attendance files
            * for the EOS Spring total report*/
        } else if(text0.text() === 'Select Peer Tutor Monthly Logs' &&
            theSelector.value === globalObject.arrayOfPossibleChoices[10]){
            GetManyOfTheSameFile("tutorMonthlyLog");
            clearHTMLAfterSelector();
            let textNode = 'Select Period Attendance Files From January to June';
            AttachInputTextInital(textNode);
            AttachInputTextMultiple(false, 1, 6, true);
        } else if(text0.text() === 'Please Select Excel Sheet Containing All Program Roster\'s' &&
                    theSelector.value === globalObject.arrayOfPossibleChoices[7]){
            GetEachProgramRoster();
            globalObject.userEnteredData.month = $('#monthSelector-button').text().trim();
            clearHTMLAfterSelector();
            NumOfFilesDesired("Number Of UCD Tutor Logs To Be Used In Report");
            $('#innerInputDiv0').after(TheButGenerator("Next"));


        }

    }


    /*Run after the user hits submit*/
    function DetermineRequest() {
        /*Total Count*/
        if(theSelector.value === globalObject.arrayOfPossibleChoices[0]){
            GetSingleFile("periodAttendance");

            /*Convert Aries Query Fall*/
        }else if(theSelector.value === globalObject.arrayOfPossibleChoices[1]){
            GetSingleFile("aeriesQuery");

            /*Attendance and Log Roster Fall*/
        }else if(theSelector.value === globalObject.arrayOfPossibleChoices[2]){
            GetEachProgramRoster();

            /*Convert Aries Query Spring*/
        }else if(theSelector.value === globalObject.arrayOfPossibleChoices[3]){
            GetSingleFile("aeriesQuery");

            /*Attendance and Log Roster Spring*/
        }else if(theSelector.value === globalObject.arrayOfPossibleChoices[4]){
            GetEachProgramRoster();

            /*ASSETs Lunch Report*/
        }else if(theSelector.value === globalObject.arrayOfPossibleChoices[5]){
            GetSingleFile("periodAttendance");

            /*ASSETs AS Report*/
        }else if(theSelector.value === globalObject.arrayOfPossibleChoices[6]){
            GetSingleFile("periodAttendance");

            /*Migrant Ed Monthly Report*/
            /*This is really the final step after we have gotten all the UCD tutor logs
            * and after we have gotten all the peer tutor logs*/
        }else if(theSelector.value === globalObject.arrayOfPossibleChoices[7]) {
            GetSingleFile("periodAttendance");


            /*EOS Totals Fall Or EOS Totals Spring
            * This is really the final step after we have gotten all the UCD tutor logs
            * and after we have gotten all the peer tutor logs*/
        }else if((theSelector.value === globalObject.arrayOfPossibleChoices[8]) ||
            (theSelector.value === globalObject.arrayOfPossibleChoices[10])){
            GetManyOfTheSameFile("periodAttendance");

            /*EOS AS Totals Fall Or EOS AS Totals Spring*/
        }else if(theSelector.value === globalObject.arrayOfPossibleChoices[9] ||
            (theSelector.value === globalObject.arrayOfPossibleChoices[11])){
            GetManyOfTheSameFile("periodAttendance");

            /*End Of Fall Semester Peer tutor test*/
        }else if(theSelector.value === globalObject.arrayOfPossibleChoices[12]){
            GetManyOfTheSameFile("tutorMonthlyLog");

            /*End Of Fall Semester UCD tutor test*/
        }else if(theSelector.value === globalObject.arrayOfPossibleChoices[13]){
            GetManyOfTheSameFile("tutorMonthlyLog");

            /*End Of Fall Semester Period Attendance test*/
        }else if(theSelector.value === globalObject.arrayOfPossibleChoices[14]){
            GetManyOfTheSameFile("periodAttendance");

            /*EOY Report*/
        }else if(theSelector.value === globalObject.arrayOfPossibleChoices[15]){
            GetManyOfTheSameFile("EOS");
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
                    if(fileType === "tutorMonthlyLog"){
                        ConvertSheetToJSON(e, 3, fileType);
                    } else if(fileType === "periodAttendance" || fileType === "EOS"){
                        ConvertSheetToJSON(e, 0, fileType);
                    }
                };
                reader.readAsArrayBuffer(file);
            })(file)
        }
    }


    /*Processing excel sheets that contain an
    * aeries query and then a sheet containing all
    * programs. This can now handle 2 scenarios. One for making the database for the
     * excel file. The other is when creating a mig ed report.*/
    function GetEachProgramRoster() {
        var alignerDiv = document.getElementById("aligner");
        if(theSelector.value === globalObject.arrayOfPossibleChoices[7]){
            var numOfFiles = 1;
        } else{
            var numOfFiles = alignerDiv.children.length - 1;
        }
        var arOfInputs = alignerDiv.children;
        /*Must be handled this way so each different file is handled
        * not just the same one repeated several times*/
        for(var i = 0; i < numOfFiles; i++){(function (file, i){
            var reader = new FileReader();
            reader.onload = function (e) {
                if(theSelector.value === globalObject.arrayOfPossibleChoices[7]){
                    ConvertSheetToJSONAllPrograms(e);
                } else{
                    if(i == 0){
                        ConvertSheetToJSON(e, 0, "aeriesQuery");
                    }else if(i == 1){
                        ConvertSheetToJSONAllPrograms(e);
                    }
                }

            };
            reader.readAsArrayBuffer(file);

        })(arOfInputs[i].children[1].files[0], i)}
    }


    /*Converts excel file to JSON and updates global array with converted sheets and the global proxy*/
    function ConvertSheetToJSON(e, correctSheet, sheetName) {
        let data = e.target.result;
        data = new Uint8Array(data);
        let workBook = XLSX.read(data, {type: 'array'});
        let arSheets = workBook.SheetNames;
        //new logs seems to have different ordering of sheet
        /*** This is a bandaid if I have more time later I will change better***/
        if(sheetName === "tutorMonthlyLog"){
            for(let i = 0; i < arSheets.length; i++){
                if(arSheets[i] === "General Subjects IC"){
                    correctSheet = i;
                    break;
                }
            }
        }
        let workSheet = workBook.Sheets[arSheets[correctSheet]];
        if(sheetName === "periodAttendance" || sheetName === "EOS") {
            /*The global object needs to be changed to store
            * the sheet array but the proxy just needs to have its value updated
            * so that it will trigger the handler*/
            let json = XLSX.utils.sheet_to_json(workSheet);
            globalObject.objSheetAr[sheetName].push(json);
            theProxy[sheetName] = 5; // This can be literally anything
        } else if (sheetName === "tutorMonthlyLog"){
            var followingMonth;
            /*Names of Months, needed to find next month so the correct part of the log will be taken in*/
            const arrayOfMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
                "October", "November", "December"];
            if((globalObject.userEnteredData.month === "December") || (globalObject.userEnteredData.month === "June") ||
                (theSelector.value === globalObject.arrayOfPossibleChoices[8])
            || (theSelector.value === globalObject.arrayOfPossibleChoices[10])
            || (theSelector.value === globalObject.arrayOfPossibleChoices[12])
            || (theSelector.value === globalObject.arrayOfPossibleChoices[13])){
                followingMonth = undefined;
            }else{
                for(let j = 0; j < arrayOfMonths.length; j++){
                    if(arrayOfMonths[j] === globalObject.userEnteredData.month){
                        followingMonth = arrayOfMonths[j + 1];
                    }
                }

            }
            /*The global object needs to be changed to store
            * the sheet array but the proxy just needs to have its value updated
            * so that it will trigger the handler*/
            let json = CorrectPositionInSheet(workSheet, globalObject.userEnteredData.month, followingMonth, sheetName);
            globalObject.objSheetAr[sheetName].push(json);
            theProxy[sheetName] = 5; // This can be literally anything
        } else {
            let json = XLSX.utils.sheet_to_json(workSheet);
            globalObject.objSheetAr[sheetName] = json;
            theProxy[sheetName] = json;
        }
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
        for(let sheet in arSheets){
            if(arSheets[sheet].includes("ELD")){
                workSheet = workBook.Sheets[arSheets[sheet]];
                json = CorrectPositionInSheet(workSheet, "Student ID", undefined,"roster");
                globalObject.objSheetAr["eldRoster"] = json;
                theProxy["eldRoster"] = json;
            }else if(arSheets[sheet].includes("ME")){
                workSheet = workBook.Sheets[arSheets[sheet]];
                json = CorrectPositionInSheet(workSheet, "Student ID", undefined,"roster");
                globalObject.objSheetAr["migRoster"] = json;
                theProxy["migRoster"] = json;
            }else if(arSheets[sheet].includes("ETS")){
                workSheet = workBook.Sheets[arSheets[sheet]];
                json = CorrectPositionInSheet(workSheet, "Student ID", undefined,"roster");
                globalObject.objSheetAr["etsRoster"] = json;
                theProxy["etsRoster"] = json;
            }else if(arSheets[sheet].includes("PTS")){
                workSheet = workBook.Sheets[arSheets[sheet]];
                json = CorrectPositionInSheet(workSheet, "Student ID", undefined,"roster");
                globalObject.objSheetAr["ptsRoster"] = json;
                theProxy["ptsRoster"] = json;
            }
        }
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
            correctJSON = XLSX.utils.sheet_to_json(workSheet, {range: startingRow});
        }
        return correctJSON;
    }




    /*when objSheetAr has any of it's values changed the handler triggers.
    * objSheetAr is only changed after the user has selected the files they want parsed
    * and they are converted to jsons. Depending on what report the user has selected
    *the appropriate if statement will be entered and the json will be parsed*/
    const theHandler = {
        set(obj, prop, value) {
            /*Total Count */
            if (prop === "periodAttendance" && theSelector.value === globalObject.arrayOfPossibleChoices[0]) {
                let sheetAr = TotalCount(globalObject.objSheetAr["periodAttendance"][0]);
                CreateNewExcel(sheetAr, "TotalCountReport");

                /*ASSETs Lunch Report*/
            }else if (prop === "periodAttendance" && theSelector.value === globalObject.arrayOfPossibleChoices[5]){
                let sheetAr = MonthlyReport(globalObject.objSheetAr["periodAttendance"][0]);
                CreateNewExcel(sheetAr, "ASSETs Lunch Report", "ASSETs");

                /*ASSETs AS Report*/
            }else if (prop === "periodAttendance" && theSelector.value === globalObject.arrayOfPossibleChoices[6]){
                let sheetAr = MonthlyReport(globalObject.objSheetAr["periodAttendance"][0]);
                CreateNewExcel(sheetAr, "ASSETs AS Report", "ASSETs");

                /*Student Roster with out programs, fall*/
            } else if(theSelector.value === globalObject.arrayOfPossibleChoices[1]){
                let sheetAr = AeriesQuery(globalObject.objSheetAr["aeriesQuery"], true);
                CreateNewExcel(sheetAr, "Parsed Aeries Query No Programs");

                /*Attendance and Log Roster Fall.
                * The if check needs to include all of those things to ensure that
                * all of the components needed to assemble the parsed Aeries query are
                * there. This is because the process of them becoming a json is asynchronous
                * so the ordering for when they finish is unknown.*/
            }else if(theSelector.value === globalObject.arrayOfPossibleChoices[2] && obj["aeriesQuery"] !== ""
                && obj["etsRoster"] !== "" && obj["ptsRoster"] !== ""
                && obj["migRoster"] !== "" && obj["eldRoster"] !== ""){

                let sheetAr = AeriesQuery(globalObject.objSheetAr["aeriesQuery"], true);
                sheetAr = AddPrograms(sheetAr);
                CreateNewExcel(sheetAr, "Attendance and Log Roster Fall");

                /*Student Roster with out programs, Spring*/
            } else if(theSelector.value === globalObject.arrayOfPossibleChoices[3]){
                let sheetAr = AeriesQuery(globalObject.objSheetAr["aeriesQuery"], false);
                CreateNewExcel(sheetAr, "Parsed Aeries Query No Programs");

                /*Attendance and Log Roster Spring.
                * The if check needs to include all of those things to ensure that
                * all of the components needed to assemble the parsed aeries query are
                * there. This is because the process of them becoming a json is asynchronous
                * so the ordering for when they finish is unknown.*/
            }else if(theSelector.value === globalObject.arrayOfPossibleChoices[4] && obj["aeriesQuery"] !== ""
                && obj["etsRoster"] !== "" && obj["ptsRoster"] !== ""
                && obj["migRoster"] !== "" && obj["eldRoster"] !== ""){

                let sheetAr = AeriesQuery(globalObject.objSheetAr["aeriesQuery"], false);
                sheetAr = AddPrograms(sheetAr);
                CreateNewExcel(sheetAr, "Attendance and Log Roster Spring");

                /*Migrant Ed Monthly Report*/
            }else if(prop === "periodAttendance" && theSelector.value === globalObject.arrayOfPossibleChoices[7]){
                if(globalObject.objSheetAr.tutorMonthlyLog.length > 1){
                    let tutorConatenatedSheet = ConcatenateSheets(globalObject.objSheetAr.tutorMonthlyLog);
                    let inClassTotals = SimplifiedTotalMig(tutorConatenatedSheet,
                                                            globalObject.objSheetAr.migRoster);
                    /*periodAttendLunchandAs[0] == lunch and periodAttendLunchandAs[0] == After school*/
                    let periodAttendLunchandAS = MonthlyReport(globalObject.objSheetAr["periodAttendance"][0]);
                    MigEdSimplify(periodAttendLunchandAS);
                    let arrayOfSheets = [periodAttendLunchandAS[0],periodAttendLunchandAS[1], inClassTotals];
                    CreateNewExcel(arrayOfSheets, "Migrant Ed Monthly Report", "MigEd");

                }

                /*EOS Totals Fall Or EOS Totals Spring*/
            }else if(prop === "periodAttendance" &&
                (((theSelector.value === globalObject.arrayOfPossibleChoices[8]) && (globalObject.objSheetAr.periodAttendance.length === 5))
             || ((theSelector.value === globalObject.arrayOfPossibleChoices[10]) && (globalObject.objSheetAr.periodAttendance.length === 6)))){

                ModifyUpLoads(globalObject.objSheetAr);
                var combinedSuperSheet = [globalObject.objSheetAr.tutorMonthlyLog, globalObject.objSheetAr.periodAttendance];
                var concatendatedSuperSheet = ConcatenateSheets(combinedSuperSheet);
                let sheetAr = TotalCount(concatendatedSuperSheet);
                if(theSelector.value === globalObject.arrayOfPossibleChoices[8]){
                    CreateNewExcel(sheetAr, "EOS Totals Fall");
                } else {
                    CreateNewExcel(sheetAr, "EOS Totals Spring");
                }


                /*EOS AS Totals Fall Or EOS AS Totals Spring*/
            }else if(prop === "periodAttendance" &&
                (((theSelector.value === globalObject.arrayOfPossibleChoices[9]) && (globalObject.objSheetAr.periodAttendance.length === 5))
             || ((theSelector.value === globalObject.arrayOfPossibleChoices[11]) && (globalObject.objSheetAr.periodAttendance.length === 6)))){

                ModifyUpLoads(globalObject.objSheetAr);
                var combinedSuperSheet = [globalObject.objSheetAr.tutorMonthlyLog, globalObject.objSheetAr.periodAttendance];
                var concatendatedSuperSheet = ConcatenateSheets(combinedSuperSheet);
                let sheetAr = TotalCount(concatendatedSuperSheet);
                if(theSelector.value === globalObject.arrayOfPossibleChoices[9]){
                    CreateNewExcel(sheetAr, "EOS AS Totals Fall");
                } else {
                    CreateNewExcel(sheetAr, "EOS AS Totals Spring");
                }


                /*End Of Fall Semester Peer tutor test*/
            }else if(prop === "tutorMonthlyLog" && theSelector.value === globalObject.arrayOfPossibleChoices[12]
                && globalObject.objSheetAr.tutorMonthlyLog.length === Number(globalObject.userEnteredData.numberOfPeerTutorFiles)){
                ModifyUpLoads(globalObject.objSheetAr);
                var combinedSuperSheet = [globalObject.objSheetAr.tutorMonthlyLog, globalObject.objSheetAr.periodAttendance];
                var concatendatedSuperSheet = ConcatenateSheets(combinedSuperSheet);
                let sheetAr = TotalCount(concatendatedSuperSheet);
                CreateNewExcel(sheetAr, "End Of Fall Semester Peer Tutor Test");

                /*End Of Fall Semester UC Davis tutor test*/
            }else if(prop === "tutorMonthlyLog" && theSelector.value === globalObject.arrayOfPossibleChoices[13]
                && globalObject.objSheetAr.tutorMonthlyLog.length === Number(globalObject.userEnteredData.numberOfUCDTutorFiles)){
                ModifyUpLoads(globalObject.objSheetAr);
                var combinedSuperSheet = [globalObject.objSheetAr.tutorMonthlyLog, globalObject.objSheetAr.periodAttendance];
                var concatendatedSuperSheet = ConcatenateSheets(combinedSuperSheet);
                let sheetAr = TotalCount(concatendatedSuperSheet);
                CreateNewExcel(sheetAr, "End Of Fall Semester UC Davis Tutor Test");

                /*End Of Fall Semester Period Attendance test*/
            }else if(prop === "periodAttendance" && theSelector.value === globalObject.arrayOfPossibleChoices[14]
                && globalObject.objSheetAr.periodAttendance.length === 5){
                ModifyUpLoads(globalObject.objSheetAr);
                var combinedSuperSheet = [globalObject.objSheetAr.tutorMonthlyLog, globalObject.objSheetAr.periodAttendance];
                var concatendatedSuperSheet = ConcatenateSheets(combinedSuperSheet);
                let sheetAr = TotalCount(concatendatedSuperSheet);
                CreateNewExcel(sheetAr, "End Of Fall Semester Period Attendance test");

                /*EOY Report*/
            }else if(prop === "EOS" && theSelector.value === globalObject.arrayOfPossibleChoices[15]
                && globalObject.objSheetAr.EOS.length === 2){
                var concatendatedSuperSheet = ConcatenateSheets(globalObject.objSheetAr.EOS);
                let sheetAr = TotalCount(concatendatedSuperSheet);
                CreateNewExcel(sheetAr, "EOY Report");
            }
        }
    };


    /*this sets up the a proxy for objSheetAr.
   * When the proxy is changed theHandler is called*/
    var theProxy = new Proxy(globalObject.objSheetAr, theHandler);


    /*Iterates through a sheet and calculates the total number of times
   *  each student was tutored.
   *  ***To optimize this store array in a binary search tree or hash table*** */
    function TotalCount (sheetAr){
        /*Goes through each row in the sheet*/
        for(let i = 0; i < sheetAr.length; i++){
            if(sheetAr[i]["Student ID"] !== undefined) {
                AddAndRemoveKeys(sheetAr[i]);
                //removePeriodFromClass(sheetAr[i]);
                /*Inner loop that is used to compare each each row in the
                * sheet to all other rows in it. In order to total the number
                * of times the student was tutored*/
                for (let j = 0; j < sheetAr.length; j++) {
                    if (sheetAr[j]["Student ID"] !== undefined) {
                        if (sheetAr[i]["Student ID"] === sheetAr[j]["Student ID"]) {
                            /*if it isn't the same row*/
                            if (i !== j) {
                                //removePeriodFromClass(sheetAr[j]);
                                removeSubjectDuplicates(sheetAr[i], sheetAr[j], "Subject");
                                ConcatenateOtherSubject(sheetAr[i], sheetAr[j]);
                                UpdateLocation(sheetAr[i], sheetAr[j]);
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
                        if(sheetAr[j]["Student Sign Out (Tutor Name)"] === undefined && sheetAr[j]["Time In"] === undefined
                            && sheetAr[j]["Time Out"] === undefined){
                            console.log("Found a row with out a student id and so removing it. And it is not" +
                                        " a row from period attendance.");
                            globalObject.numberOfcountsAdded--;
                        }
                        /*removes the inner loop row, other rows don't
                         * have to be compared to it over and over again
                         * when we have already gotten the information for it*/
                        sheetAr.splice(j, 1);
                        j--; //the index needs to be updated since there is one less row
                    }
                }
            }else{
                if(sheetAr[i]["Student Sign Out (Tutor Name)"] === undefined && sheetAr[i]["Time In"] === undefined
                    && sheetAr[i]["Time Out"] === undefined){
                    console.log("Found a row with out a student id and so removing it. And it is not" +
                        " a row from period attendance.");
                    globalObject.numberOfcountsAdded--;
                }
                /*removes the outer loop row, when it doesn't have a student ID
                * so we don't compare other rows to it over and over again.*/
                sheetAr.splice(i, 1);
                i--; //the index needs to be updated since there is one less row
            }
        }
        return sheetAr;
    }


    /*Builds the ASSETs and Mig report row by, one student at a time
   * Used to build either the lunch or after school report*/
    function MonthlyReport(periodAttendance) {
        let monthlyAr = [];
        if(theSelector.value === globalObject.arrayOfPossibleChoices[7]){
            monthlyAr[0] = [];
            monthlyAr[1] = [];
        }
        let count = 1;
        for(let i = 0; i < periodAttendance.length; i++){

            if(!((periodAttendance[i]["First Name"] === "" || periodAttendance[i]["First Name"] === undefined)
                && (periodAttendance[i]["Last Name"] === "" || periodAttendance[i]["Last Name"] === undefined)
                && (periodAttendance[i]["Student ID"] === "" || periodAttendance[i]["Student ID"] === undefined))) {
                let theStudent;
                /*Lunch*/
                if (theSelector.value === globalObject.arrayOfPossibleChoices[5]) {
                    theStudent = InitializeStudentBuilder(periodAttendance[i], "Lunch", count, monthlyAr);
                    if (theStudent.Count !== "") {
                        count++;
                        monthlyAr.push(theStudent);
                    }
                    /*After School*/
                } else if (theSelector.value === globalObject.arrayOfPossibleChoices[6]) {
                    theStudent = InitializeStudentBuilder(periodAttendance[i], "After School", count, monthlyAr);
                    if (theStudent.Count !== "") {
                        count++;
                        monthlyAr.push(theStudent);
                    }
                    /*Mig Ed needs an After School and a Lunch portion*/
                } else if (theSelector.value === globalObject.arrayOfPossibleChoices[7]){
                    let migRoster = globalObject.objSheetAr.migRoster;
                    for(let j = 0; j < migRoster.length; j++){
                        if(migRoster[j]["Student ID"] === periodAttendance[i]["Student ID"]){
                            theStudent = InitializeStudentBuilder(periodAttendance[i], "Lunch", count, monthlyAr[0]);
                            if (theStudent.Count !== "") {
                                count++;
                                /*monthlyAr[0] is for lunch*/
                                monthlyAr[0].push(theStudent);
                            }
                            theStudent = InitializeStudentBuilder(periodAttendance[i], "After School", count, monthlyAr[1]);
                            if (theStudent.Count !== "") {
                                count++;
                                /*monthlyAr[1] is for After School*/
                                monthlyAr[1].push(theStudent);
                            }
                        }
                    }
                }
            }
        }
        return monthlyAr;
    }


    /*Builds up the sheet so that it includes all the students
   * classes (in the same row), and removes the duplicate rows
   * semester is true if it is fall semester and it is false if it is
   * spring semester*/
    function AeriesQuery (sheetAr, semester){
        let keyword = "Class";
        for(let i = 0; i < sheetAr.length; i++){
            AddClassSlots(sheetAr[i], keyword);
            for(let j = 0; j < sheetAr.length; j++){
                if(sheetAr[i]["Student ID"] === sheetAr[j]["Student ID"]){
                    if(i !== j){
                        /*this is for a fall aeries query*/
                        if((sheetAr[j]["Semester"] !== "S") && (semester === true)){
                            let period = sheetAr[j]["Period"];
                            keyword = keyword + period;
                            /*adds the class, with the period, to the appropriate class entry in the object*/
                            sheetAr[i][keyword] = period + " - " + sheetAr[j]["Course title"];
                            AVIDChecker(sheetAr[i], sheetAr[j]["Course title"]);
                            sheetAr.splice(j, 1); //removes row
                            j--; // change index since a row was removed
                            keyword = "Class";

                            /*this is for the spring aeries query*/
                        } else if ((sheetAr[j]["Semester"] !== "F") && (semester === false)){
                            let period = sheetAr[j]["Period"];
                            keyword = keyword + period;
                            /*adds the class, with the period, to the appropriate class entry in the object*/
                            sheetAr[i][keyword] = period + " - " + sheetAr[j]["Course title"];
                            AVIDChecker(sheetAr[i], sheetAr[j]["Course title"]);
                            sheetAr.splice(j, 1); //removes row
                            j--; // change index since a row was removed
                            keyword = "Class";
                        } else {
                            sheetAr.splice(j, 1); //removes row
                            j--; // change index since a row was removed
                        }
                    }
                }
            }
        }
        return sheetAr;
    }

    /*A simplified version of total count that only cares about the total number of sessions for
     * Mig ED students. */
    function SimplifiedTotalMig(inClassConcat, migRoster) {
        let inClassTotal = [];
        for(let i = 0; i < migRoster.length; i++){
            let newStudent = {
                "Student Name": migRoster[i]["Last"] + ", " + migRoster[i]["First"],
                "In Class": 0
            };

            for(let j = 0; j < inClassConcat.length; j++){
                if(inClassConcat[j]["Perm ID #"] !== undefined){
                    if(migRoster[i]["Student ID"] === inClassConcat[j]["Perm ID #"]){
                        newStudent["In Class"] += Number(inClassConcat[j]["Times Seen"]);
                    }
                }
                else {
                    inClassConcat.splice(j,1);
                    j--;
                    continue;
                }

            }

            inClassTotal.push(newStudent);
        }

        return inClassTotal;
    }


    /*Checks if a particular student is in a program.
    * If they are they get an X for that program.
    * Additional Note: performance can be improved with
    * search trees or something like that.*/
    function AddPrograms(sheetAr) {
        let ELDRoster = globalObject.objSheetAr["eldRoster"];
        let ETSRoster = globalObject.objSheetAr["etsRoster"];
        let PTSRoster = globalObject.objSheetAr["ptsRoster"];
        let MIGRoster = globalObject.objSheetAr["migRoster"];
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

    /*This takes the object created from monthly report function and trims it so
    * it just what is needed for the mig ed report.*/
    function MigEdSimplify(periodAttendLunchandAS){
        for(let i = 0; i < periodAttendLunchandAS[0].length; i++){
            delete periodAttendLunchandAS[0][i]["Count"];
            delete periodAttendLunchandAS[0][i]["Lunch"];
            delete periodAttendLunchandAS[0][i]["StudentID"];
            delete periodAttendLunchandAS[0][i]["Grade"];
        }

        for(let i = 0; i < periodAttendLunchandAS[1].length; i++){
            delete periodAttendLunchandAS[1][i]["Count"];
            delete periodAttendLunchandAS[1][i]["Lunch"];
            delete periodAttendLunchandAS[1][i]["StudentID"];
            delete periodAttendLunchandAS[1][i]["Grade"];
        }
    }



    /*Goes through each of the uploaded excel sheets, now jsons, and works to
    * turn them into a uniform format to then parse*/
    function ModifyUpLoads(upLoadedSheets){
        if(upLoadedSheets.periodAttendance.length > 0){
            for(let i =0; i < upLoadedSheets.periodAttendance.length; i++){
                AddLocationRemoveEmpty(upLoadedSheets.periodAttendance[i], "periodAttendance");
            }
        }
        if(upLoadedSheets.tutorMonthlyLog.length > 0){
            for(let i =0; i < upLoadedSheets.tutorMonthlyLog.length; i++){
                AddLocationRemoveEmpty(upLoadedSheets.tutorMonthlyLog[i], "inClass");
            }
        }
        if(upLoadedSheets.peerTutorMonthlyLog.length > 0){
            for(let i =0; i < upLoadedSheets.peerTutorMonthlyLog.length; i++){
                AddLocationRemoveEmpty(upLoadedSheets.peerTutorMonthlyLog[i], "inClass");
            }
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
        if($.isArray(concatenatedSheets[0])){
            concatenatedSheets = ConcatenateSheets(concatenatedSheets);
        }
        return concatenatedSheets;
    }


    /*First checks to see if the student has had the "count" property added
    * to it, if not it is added.
    * Second, when calculating how many times a student was tutored,
    * certain info stored about there individual tutoring sessions
    * are not important and are thus deleted here.*/
    function AddAndRemoveKeys(student) {
        AddCountOuter(student);
        delete student["Test?"];
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


    /*Each class has a period at is front ex. 1 - Int Math II.
    * This should be changed to ex. Int Math II. This function takes
    * care of this.*/
    function removePeriodFromClass(objectContainer) {
        /*Only entered if there IS a subject, else do nothing.*/
        if(objectContainer["Subject"] !== undefined) {
            let justClass = "";
            let longClass = "";
            let seperateClasses = objectContainer["Subject"].split(","); // splits up the subjects at each ',' if there is multiple subjects

            objectContainer["Subject"] = ""; //this needs to be clearned so we can rebuild it

            if(seperateClasses.length > 0){
                for(let i = 0; i < seperateClasses.length; i++ ){
                    justClass = seperateClasses[i].split("-");

                    /*Entered if the class had an additional '-'
                    * ex. 2 - English 1 - 2
                    * rebuilds so it is ex. English 1 - 2*/
                    if (justClass.length > 2) {
                        for (let i = 0; i < justClass.length - 1; i++) {
                            if (i === 0) {
                                longClass += justClass[1].trim();
                            } else {
                                if(justClass[1].trim() === "Pre"){ //This is to keep Pre-Calculus and not Pre - Calculus
                                    longClass += "-" + justClass[i + 1].trim();
                                }else{
                                    longClass += " - " + justClass[i + 1].trim();
                                }

                            }
                        }
                        justClass = longClass;

                    /*If number has no extra '-' checks if has a period attached or not*/
                    } else if (justClass[1]) {
                        /*A class with '-' like English 2-2 checks if after split if the first
                        value is a num, if not no period*/
                        if(isNaN(Number(justClass[0]))){
                            justClass = seperateClasses[i].trim()

                        /*A class that had a number in first spot after split*/
                        } else {
                            /*Checks if it is 3-D/Design, the only class as of 3/14/19
                            * that has number at start of class and a '-' in it.*/
                            if (seperateClasses[i].indexOf("D/Design") !== -1) {
                                justClass = seperateClasses[i].trim()

                                /*A class with out an extra '-'
                                 * ex. 4 - Calculus
                                * Becomes ex. Calculus*/
                            } else {
                                justClass = justClass[1].trim()
                            }
                        }
                    } else { // when subject is empty
                        justClass = justClass[0].trim();
                    }

                    if(i === seperateClasses.length - 1){
                        objectContainer["Subject"] += justClass;
                    }else{
                        objectContainer["Subject"] += justClass + ", ";
                    }

                }

            }
        }
    }


    /*Checks current list of subjects for a given student against a new
    * list of subjects for that students and adds any new, not already in the list,
    * subjects to the current list.*/
    function removeSubjectDuplicates(orginalList, newList, keyword){
        /*Makes sure both lists exist and they both are not empty*/
        if(((orginalList[keyword] !== undefined) || (newList[keyword] !== undefined))
            && ((orginalList[keyword] !== "") || (newList[keyword] !== ""))) {
            let outterLoopSubjects;
            if(orginalList[keyword] === undefined){
                outterLoopSubjects = [""];
                orginalList[keyword] = ""
            }else {
                outterLoopSubjects = orginalList[keyword].split(",");
            }
            /*Map applies something to each element of the arrary.
            * s => s.trim() is akin to function (s) { return s.trim()}
            * just a short notation.
            * https://stackoverflow.com/questions/19293997/javascript-apply-trim-function-to-each-string-in-an-array*/
            outterLoopSubjects = outterLoopSubjects.map(s => s.trim());
            let innerLoopSubjects;
            if(newList[keyword] === undefined){
                innerLoopSubjects = [""];
            }else {
                innerLoopSubjects = newList[keyword].split(",");
            }
            innerLoopSubjects = innerLoopSubjects.map(s => s.trim());
            let newUniqueSubject = true;
            /*Compares current list of subjects to new list of subjects checking
            * for a new unique subject*/
            for (let j2 = 0; j2 < innerLoopSubjects.length; j2++) {
                for (let i2 = 0; i2 < outterLoopSubjects.length; i2++) {
                    if (innerLoopSubjects[j2] === outterLoopSubjects[i2]) {
                        newUniqueSubject = false;
                        break;
                    }
                }
                /*this ensures that it is a unique addition to the subjects and that it is not blank
                * and that the orginal list of subjects is not blank as well*/
                if (newUniqueSubject && innerLoopSubjects[j2]!== "" &&
                    (orginalList[keyword] !== undefined) && (orginalList[keyword] !== "")) {

                    orginalList[keyword] = orginalList[keyword] + ", " + innerLoopSubjects[j2].trim();
                    outterLoopSubjects = orginalList[keyword].split(",");
                    outterLoopSubjects = outterLoopSubjects.map(s => s.trim());

                    /*this is a fall back case, if it is a new subject and not blank and
                     * the orginal list of subjects is either blank or not defined at all */
                } else if (newUniqueSubject && innerLoopSubjects[j2]!== "" &&
                    ((orginalList[keyword] === undefined) || (orginalList[keyword] === ""))) {

                    orginalList[keyword] = newList[keyword];
                    outterLoopSubjects = orginalList[keyword].split(",");
                    outterLoopSubjects = outterLoopSubjects.map(s => s.trim());
                }
                newUniqueSubject = true;
            }
        } else if((orginalList[keyword] !== undefined) && (newList[keyword] !== undefined)
            && (newList[keyword] !== "")){
            orginalList[keyword] = newList[keyword];
        }
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


    /*When combining students it makes sure that the location
    * is updated to where they have been tutored*/
    function UpdateLocation(outerLoopStudent, innerLoopStudent){
        if(innerLoopStudent["LC"] === "X"){
            outerLoopStudent["LC"] = "X";
        }
        if(innerLoopStudent["IC"] === "X"){
            outerLoopStudent["IC"] = "X";
        }
        if(innerLoopStudent["AS"] === "X"){
            outerLoopStudent["AS"] = "X";
        }
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


    /*Calls function to build a student.
   * This determines if the student is being built for
   * the lunch or after school report.*/
    function InitializeStudentBuilder(periodAttendanceRow, period, counter, monthlyAr) {
        let studentOb = new Student();
        let theDate = periodAttendanceRow.Date;
        let splitDate = theDate.split("/");
        let dayOfTheMonth = splitDate[1];
        if(period === "Lunch" && periodAttendanceRow["Period"] === "Lunch") {
            studentOb = BuildStudentOb(monthlyAr, periodAttendanceRow, dayOfTheMonth, "Lunch", counter);
        }else if(period === "After School" && periodAttendanceRow["Period"] === "After School") {
            studentOb = BuildStudentOb(monthlyAr, periodAttendanceRow, dayOfTheMonth, "After School", counter);

        }
        return studentOb;
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
        singleObject.Class10 = "College Bound"
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


    /*Initializes the students programs to blank.*/
    function InsertPrograms(theStudent) {
        theStudent.ELD ="";
        theStudent.PTS ="";
        theStudent.ETS ="";
        theStudent.MIG ="";
    }


    /*removes empty rows to help with search/ parse time
    * and changes tutor logs to have similar properties to
    * period attendance*/
    function AddLocationRemoveEmpty(upLoadedSheet, location) {
        let date ="";
        let period = "";
        let studentsInPeriod = new Set();
        for(let i = 0; i < upLoadedSheet.length; i++){
            if(location === "periodAttendance" && i === 0){
                date = upLoadedSheet[i]["Date"];
                period = upLoadedSheet[i]["Period"];
            }

            /*If the row has no name or student ID*/
            if((upLoadedSheet[i]["First Name"] === "" || upLoadedSheet[i]["First Name"] === undefined)
                && (upLoadedSheet[i]["Last Name"] === "" || upLoadedSheet[i]["Last Name"] === undefined)
                && (upLoadedSheet[i]["Student ID"] === "" || upLoadedSheet[i]["Student ID"] === undefined)
                && (upLoadedSheet[i]["Perm ID #"] === "" || upLoadedSheet[i]["Perm ID #"] === undefined)){
                upLoadedSheet.splice(i, 1);
                i--;
                continue;

                /*if it is a row that doesn't actually contain a student*/
            } else if (upLoadedSheet[i]["Perm ID #"] === "Total # of Sessions:"
                || upLoadedSheet[i]["Perm ID #"] === "Total # of Students:"
                || upLoadedSheet[i]["Perm ID #"] === "Perm ID #"){
                upLoadedSheet.splice(i, 1);
                i--;
                continue;

                /*updates that the student was worked with in class*/
            } else if (location === "inClass"){
                upLoadedSheet[i].LC = "";
                upLoadedSheet[i].IC = "X";
                upLoadedSheet[i].AS = "";
                ChangeProperties(upLoadedSheet[i]);

                /*when a student was tutored in the center it updates if it was during AS or not*/
            } else if (location === "periodAttendance"){
                upLoadedSheet[i].IC = "";
                if(upLoadedSheet[i]["Period"] === "Lunch" || upLoadedSheet[i]["Period"] === "After School"){
                    upLoadedSheet[i].LC = "";
                    upLoadedSheet[i].AS = "X";
                } else{
                    if((globalObject.arrayOfPossibleChoices[9] === theSelector.value) ||
                        (globalObject.arrayOfPossibleChoices[11] === theSelector.value)){
                        upLoadedSheet.splice(i, 1);
                        i--;
                        continue;

                    }else{
                        upLoadedSheet[i].LC = "X";
                        upLoadedSheet[i].AS = "";
                    }
                }

                /*Checks for duplicate entries in period attendance, aka one student was logged in multiple times
                * in the same period.
                * If period and date are the current period and date on this row*/
                if(period === upLoadedSheet[i]["Period"] && date === upLoadedSheet[i]["Date"]){
                    /*if the student has already been counted for that period and date*/
                    if(studentsInPeriod.has(upLoadedSheet[i]["Student ID"])){
                        console.log("Duplicate Found!! for " + upLoadedSheet[i]["First Name"] + " "
                            + upLoadedSheet[i]["Last Name"] + " on " + upLoadedSheet[i]["Date"]
                            + " during period " + upLoadedSheet[i]["Period"] + ".");
                        globalObject.numberOfDuplicatesFound++;
                        upLoadedSheet.splice(i, 1);
                        i--;
                        continue;
                        /*the student has not already been counted*/
                    } else{
                        studentsInPeriod.add(upLoadedSheet[i]["Student ID"]);
                    }
                    /*if the period and date don't match this row, aka it is a new period and or date, then
                    * update then and clear the current students for that period and add this student to
                    * the "new" period*/
                }else{
                    date = upLoadedSheet[i]["Date"];
                    period = upLoadedSheet[i]["Period"];
                    studentsInPeriod.clear();
                    studentsInPeriod.add(upLoadedSheet[i]["Student ID"]);
                }
            }

            /*Removes the period from from period attendance subjects*/
            if(upLoadedSheet[i]["Subject"] !== undefined){
                removePeriodFromClass(upLoadedSheet[i]);

            }
        }
    }


    /*If student doesn't have "Count", it is added
    * to the student with the initialized to 1*/
    function AddCountOuter(student){
        let thereIsCount = CheckForCount(student);
        if(!thereIsCount){
            student.Count ="1";
        }
    }


    /*Builds up each student row for either of the ASSETs reports and the mig report,
    including what days of the month they came*/
    function BuildStudentOb (monthlyAr, periodAttendanceRow, dayOfTheMonth, period, counter){
        let alreadyBeenCounted = false;
        let studentOb = new Student();
        /*checks to to see if student has been counted already*/
        for(var i = 0; i < monthlyAr.length; i++){
            if(monthlyAr[i].StudentID === periodAttendanceRow["Student ID"]){
                alreadyBeenCounted = true;
                break;
            }
        }
        /*If a student has already been counted
        * this will make sure there are not duplicate subjects in
        * their list of subjects and adds the day they were here*/
        if(alreadyBeenCounted){
            removePeriodFromClass(periodAttendanceRow);

            removeSubjectDuplicates(monthlyAr[i], periodAttendanceRow, "Subject");
            if(periodAttendanceRow["Other Subject"]){
                monthlyAr[i]["Subject"] += ", " + periodAttendanceRow["Other Subject"];
            }
            //monthlyAr[i].Subject += ", " + periodAttendanceRow["Subject"];
            if(period === "Lunch"){
                if(monthlyAr[i][dayOfTheMonth] === ""){
                    monthlyAr[i][dayOfTheMonth] = "1";
                    /*Checks for duplicates, i.e. same student,
                    * same day, same period*/
                }else{
                    console.log("Duplicate Found!! for " + monthlyAr[i]["StudentName"] + " on the " + dayOfTheMonth);
                    globalObject.numberOfDuplicatesFound++;
                    monthlyAr[i][dayOfTheMonth] = "1";
                }
            }else if(period === "After School"){

                if(monthlyAr[i][dayOfTheMonth] === ""){
                    if(theSelector.value === globalObject.arrayOfPossibleChoices[7]){
                        monthlyAr[i][dayOfTheMonth] = "1";
                    }else{
                        monthlyAr[i][dayOfTheMonth] = TimeInCenter(periodAttendanceRow["Time Out"], periodAttendanceRow["Time In"]);
                    }
                    /*Checks for duplicates, i.e. same student,
                * same day, same period*/
                }else{
                    console.log("Duplicate Found!! for " + monthlyAr[i]["StudentName"] + " on the " + dayOfTheMonth);
                    globalObject.numberOfDuplicatesFound++;
                    if(theSelector.value === globalObject.arrayOfPossibleChoices[7]){
                        monthlyAr[i][dayOfTheMonth] = "1";
                    }else{
                        monthlyAr[i][dayOfTheMonth] = TimeInCenter(periodAttendanceRow["Time Out"], periodAttendanceRow["Time In"]);
                    }
                }

            }

            /*If the student has not been counted it makes
            * a new student and adds the subject and when they were here*/
        }else {
            studentOb.Count = counter;
            studentOb.Grade = periodAttendanceRow["Grade"];
            studentOb.StudentID = periodAttendanceRow["Student ID"];
            if(theSelector.value === globalObject.arrayOfPossibleChoices[7]){
                studentOb.StudentName = periodAttendanceRow["Last Name"] + ", " + periodAttendanceRow["First Name"];
            }else {
                studentOb.StudentName = periodAttendanceRow["First Name"] + " " + periodAttendanceRow["Last Name"];
            }
            removePeriodFromClass(periodAttendanceRow);
            /*Checks to see if there is anything in subject*/
            if(periodAttendanceRow["Subject"]){
                studentOb.Subject = periodAttendanceRow["Subject"];
            }else{
                studentOb.Subject = "";
            }
            if(periodAttendanceRow["Other Subject"] && studentOb.Subject !== ""){
                studentOb.Subject += ", " + periodAttendanceRow["Other Subject"];
            }else if(periodAttendanceRow["Other Subject"]){
                studentOb.Subject += periodAttendanceRow["Other Subject"];
            }
            if(period === "Lunch"){
                studentOb[dayOfTheMonth] = "1";
                studentOb.Lunch = "Y";
            }else{
                studentOb.Lunch = "N";
                if(theSelector.value === globalObject.arrayOfPossibleChoices[7]){
                    studentOb[dayOfTheMonth] = "1";
                }else{
                    studentOb[dayOfTheMonth] = TimeInCenter(periodAttendanceRow["Time Out"], periodAttendanceRow["Time In"]);
                }

            }
        }
        return studentOb;
    }


    /*Converts a tutor log to have properties in the same format as
  * the period attendance sheets*/
    function ChangeProperties(upLoadedRow) {
        delete upLoadedRow["WA"];

        upLoadedRow["Student ID"] = upLoadedRow["Perm ID #"];
        delete upLoadedRow["Perm ID #"];

        upLoadedRow["Grade"] = upLoadedRow["Grade "];
        delete upLoadedRow["Grade "];

        if(upLoadedRow["Times Seen"] !== undefined){
            upLoadedRow["Count"] = upLoadedRow["Times Seen"];
        } else {
            //console.log("A student didn't have times seen defined so I added 1");
            globalObject.numberOfcountsAdded++;
            upLoadedRow["Count"] = 1;
        }
        delete upLoadedRow["Times Seen"];

        if(upLoadedRow["AV"] === "" || upLoadedRow["AV"] === " "){
            upLoadedRow["AVID"] = "";
        } else {
            upLoadedRow["AVID"] = "X";
        }
        delete upLoadedRow["AV"];

        if(upLoadedRow["EL"] === "" || upLoadedRow["EL"] === " "){
            upLoadedRow["English Learner"] = "";
        } else {
            upLoadedRow["English Learner"] = "X";
        }
        delete upLoadedRow["EL"];
        delete upLoadedRow["ME"];
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


    /*Converts time from hours, minutes, and AM and PM to raw number.*/
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


    /*After the given sheets have been parsed, here the result is
   * turned in a new excel sheet and then workbook.*/
    function CreateNewExcel(sheetAr, newExcelName, MonthlyReport = false){
        var date = new Date()
        var month = date.getMonth() + 1
        var todaysDate =  " (" + month + "-" + date.getDate() + "-" + date.getFullYear() + ")"


        newExcelName =  newExcelName + todaysDate + ".xlsx"
        console.log("The number of duplicates found was " + globalObject.numberOfDuplicatesFound);
        console.log("The number of counts added was " + globalObject.numberOfcountsAdded);
        let actualDif = globalObject.numberOfDuplicatesFound - globalObject.numberOfcountsAdded;
        console.log("Meaning the actual difference from manually found totals should be " + actualDif);
        if(MonthlyReport){
            if(MonthlyReport === "ASSETs"){
                /*ASSETs reports need special headers for the columns*/
                var newSheet = XLSX.utils.json_to_sheet(sheetAr, {header:["Count","StudentName","Grade",
                        "StudentID","Lunch","1","2","3","4","5","6","7","8","9","10","11","12","13",
                        "14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31",
                        "empty_1","empty_2","Subject"]});
            }

            else if(MonthlyReport === "MigEd"){
                /*Mig Ed reports need special headers for the columns*/
                var newSheet1 = XLSX.utils.json_to_sheet(sheetAr[0], {header:["StudentName",
                        "1","2","3","4","5","6","7","8","9","10","11","12","13",
                        "14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31",
                        "empty_1","empty_2","Subject"]});
                var newSheet2 = XLSX.utils.json_to_sheet(sheetAr[1], {header:["StudentName",
                        "1","2","3","4","5","6","7","8","9","10","11","12","13",
                        "14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31",
                        "empty_1","empty_2","Subject"]});
                var newSheet3 = XLSX.utils.json_to_sheet(sheetAr[2]);

            }
        }else {
            var newSheet = XLSX.utils.json_to_sheet(sheetAr);
        }
        let newWorkBook = XLSX.utils.book_new();
        if(theSelector.value === globalObject.arrayOfPossibleChoices[7]){
            let sheetName = "Lunch";
            XLSX.utils.book_append_sheet(newWorkBook, newSheet1, sheetName);
            sheetName = "AfterSchool";
            XLSX.utils.book_append_sheet(newWorkBook, newSheet2, sheetName);
            sheetName = "InClassTotals";
            XLSX.utils.book_append_sheet(newWorkBook, newSheet3, sheetName);
        } else {
            let convertedSheet = "The compiled Sheet";
            XLSX.utils.book_append_sheet(newWorkBook, newSheet, convertedSheet);
        }

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

        let boldNameOfFile = `<b>${newExcelname}</b>`
        let theMessage = "Congratulations, " + boldNameOfFile + " has been created!!!\n";
        let theMessageDiv = `<div>${theMessage}</div>`


        $('.messageInMessage').append(theMessageDiv);

        if((theSelector.value === globalObject.arrayOfPossibleChoices[5])
            || (theSelector.value === globalObject.arrayOfPossibleChoices[6])
            || (theSelector.value === globalObject.arrayOfPossibleChoices[7])
            || (theSelector.value === globalObject.arrayOfPossibleChoices[8])
            || (theSelector.value === globalObject.arrayOfPossibleChoices[9])
            || (theSelector.value === globalObject.arrayOfPossibleChoices[10])
            || (theSelector.value === globalObject.arrayOfPossibleChoices[11])
            || (theSelector.value === globalObject.arrayOfPossibleChoices[15])){

            let actualDif = (globalObject.numberOfDuplicatesFound - globalObject.numberOfcountsAdded) * -1
            let diffCount = "**Note: The file generated will have a difference  of " + actualDif + " in its total number of sessions.**"
            let diffCountDiv = `<div>${diffCount}</div>`
            $('.messageInMessage').append(diffCountDiv);
        }

        $("*").css("cursor", "default");
    }
});


/*[ 0 "Total Count",                                   1 "Convert Aries Query Fall", 2  "Attendance and Log Roster Fall",
3  "Convert Aries Query Spring",                       4 "Attendance and Log Roster Spring",
5  "ASSETs Lunch Report",                              6 "ASSETs AS Report",         7  "Migrant Ed Monthly Report",
8  "EOS Totals Fall",                                  9 "EOS AS Totals Fall",       10 "EOS Totals Spring", 11 "EOS AS Totals Spring",
12 "Test for Peer Tutors End Of Fall Semester",       13 "Test for UC Davis Tutors End Of Fall Semester",
14 "Test for Period Attendance End Of Fall Semester", 15 "EOY Report"]*/
