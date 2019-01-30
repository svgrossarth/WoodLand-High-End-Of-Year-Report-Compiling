# Woodland_High_Community_Service_Learning_Center_Attendance
This is an attendance system that was created to keep attendance at the Woodland High School Community Service Learning Center. The Community Service Learning Center is a center where students can get free tutoring on any of their school subjects. The Community Service Learning Center is funded primarily by grants, so keeping accurate attendance data for all students tutored is essential to keeping the center running. The attendance system consists of 3 different parts; the report generator, auto saving script, and the period attendance sheet.

### Report Generator
The report generator currently creates one of nine different reports. The basic way the program works is the user puts in select Excel sheets for the report to then parse and then return a new Excel sheet with the completed report. Node.js allows the use of Electron to create a desktop application that runs on HTML, CSS and JavaScript. In order to parse the Excel sheets SheetJS is used, which allows an Excel document to be converted to a JSON. Then by manipulating these JSON's the correct report is created and then converted back to an Excel document.

An example of how the UI works for the program can be seen below.








### Period Attendance Sheet
This is an Excel work book that is used to sign in and out students from the Community Service Learning Center. It is easy to use, the user simply enters the student's ID, doing so causes all of their basic information to be filled in, like their first and last name, grade, birthday etc. After entering their student ID, the user can select from a list of the students current classes to choose what subject they are going to work on. 



### Auto-Saving Script
This script created in VBScript saves a copy of the current Period Attendance sheet. The script is scheduled to run automatically twice a day with the Task Scheduler. When a new copy is created it is created so the title has the date and the time of day the file was saved. Saving copies of the period attendance sheet using this script allows for several local copies of the data to be kept.

