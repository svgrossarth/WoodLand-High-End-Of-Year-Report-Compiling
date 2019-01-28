# Woodland_High_Community_Service_Learning_Center_Attendance
This is an attendance system was created to keep attendance at the Woodland High School Community Service Learning Center. The Community Service Learning Center is a Center where students can get free tutoring on any of their school subjects. The Community Service Learning Center is funded primarily by grants, so keep accurate attendance data for all students tutored is essential to keeping the center running. The attendance system consists of 3 different parts the report generator, auto saving script and period attendance sheet.

### Report Generator
The report generator creates one of 9 different reports, and growing. The basic way the program works is the user puts in select excel sheets for the report to then parse and then return a new excel sheet with the completed report. Node.js allows the use of Electron to create a desktop application that runs on HTML, CSS and JavaScript.  In order to parse the excel sheets SheetJS is used, which allows an excel document to be converted to a JSON. Then by minipulating these JSON's the correct report is created and then converted back to an excel document. 

An example of how the UI works for the program can be seen below.








### Period Attendance Sheet
Is an excel work book that is used to sign in and out students from the Community Service Learning Center. It is easy to use the user simply enters the student's ID, doing so causes all of there basic information to filled in like their first and last name, grade, birthday ect. After entering there student ID the user can select from a list of the students current class what subject they are going to work on. 



### Auto-Saving Script
This script created in VBScript saves a copy of the current Period Attedance sheet. The script is scheduled to run automatically twice a day with the Task Scheduler. When a new copy is created is it created so the title has the date and the time of day the file was saved. Saving copies of the period attendancae sheet using this script allows for several local copies of the data to be kept.

