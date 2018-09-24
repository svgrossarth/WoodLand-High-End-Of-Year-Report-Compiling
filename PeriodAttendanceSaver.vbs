



dim filesys 
set filesys=CreateObject("Scripting.FileSystemObject") 
numberTime = Hour(Now())
convertedDate = cstr(Date)
convertedDate = Replace(convertedDate,"/","-")

objStartFolder = "Y:\2018-2019\Attendance\Computer Attendance\Current Attendance"
Set objFolder = filesys.GetFolder(objStartFolder)

fileFound = False

Set colFiles = objFolder.Files
For Each objFile in colFiles
   if instr(objFile.Name,"Period and After School Attendance (Official Current Attendance") <> 0 AND instr(objFile.Name,".xlsx") <> 0 Then
        theArray = Split(objFile.Name,")")
  	shortFileName = theArray(0) & ")" & "(" & convertedDate & ")" & "(After Lunch)" & ".xlsx"
        if (numberTime < 14) Then
	   newFileName =  "Y:\2018-2019\Attendance\Computer Attendance\Old Attendance\Auto Backups\" & theArray(0) & ")" & "(" & convertedDate & ")" & "(After Lunch)" & ".xlsx"
           filesys.CopyFile "Y:\2018-2019\Attendance\Computer Attendance\Current Attendance\" & objFile.Name,newFileName  
        Else
	   newFileName =  "Y:\2018-2019\Attendance\Computer Attendance\Old Attendance\Auto Backups\" & theArray(0) & ")" & "(" & convertedDate & ")" & "(After 4pm)" & ".xlsx" 	
           filesys.CopyFile "Y:\2018-2019\Attendance\Computer Attendance\Current Attendance\" & objFile.Name, newFileName
        End If
        fileFound = true
        Exit For
   end if
Next


if fileFound Then
	Wscript.Echo ObjFile.Name & " has been saved as " & shortFileName & ".     The save location is: Y:\2018-2019\Attendance\Computer Attendance\Old Attendance\Auto Backups"
Else
    Wscript.Echo "Period Attendance File could not be saved. Please refer to documentation, if you still can't resolve the issue please email Spencer at svgrossarth@gmail.com"
end if


