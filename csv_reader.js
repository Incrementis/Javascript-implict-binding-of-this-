/*
	===============================================================================================
	
	NOTE:
	
	The code below serves only demonstration purposes and is kept simple .
	
	It could be improved (e.g. stronger error catching).
	
	Due to much lines of code, the code is commented a lot to guarantee understanding. 
	Depending on the developers javascript experience and improving naming(functions, variables),
	the amount of comments could be reduced.
	I recommend reading the code in baby steps and using google chrome`s debugging tools if needed.
	===============================================================================================
*/

"use strict";


//=======
// INTERN
//=======
// Purpose: Contains all html tags which are used/needed within this code
var Website = 
{
	table: 		document.getElementById('content'),
	fileInput: 	document.getElementById('csv-file'),
	radioComma:	document.getElementById('comma'),
	radioSemicolon:	document.getElementById('semicolon'),
	radioWhitespace:document.getElementById('whitespace'),
	radioTabulator:	document.getElementById('tabulator'),
	
}


// Purpose: Stores useful information about the CSV file
var CSV_Content = 
{
	numOfHeaders: 0,	// Will be set with the number of headers found in CSV
	numOfContent: 0,	// Will be set with the number of lines found in CSV
	separator:"NONE",	// Will be filled with the user chosen separator
	raw: "EMPTY!",		// Will be filled with the complete CSV-text
	refined: [],		// Will be filled with parsed the raw content
	// Purpose: Parses through the CSV file and stores result into a two dimensional array
	parse: function(separator)
	{
		// CSV content must exist
		if(this.raw !== "EMPTY" && this.separator !== "NONE")
		{
			// Text is filtered into lines
			this.lines = this.raw.split('\n');
			
			// MONITOR
			console.table(this.lines);
			
			/*
				ATTENTION:
				Implicit binding of "this"
			*/
			return this.raw.split('\n').map(function(line){
				return line.split(this.separator);
			}, this)
		}
		else
		{
			alert("Couldn`t parse 'EMPTY' CSV content!\nPlease, also check if a separator was chosen.")
		}
		
	}
	
}


//=========
// COMMANDS
//=========
// Purpose: Fills the table with CSV content
function fillTableContent()
{	
	// The headers in the CSV file are expected to be always as first element 
	var ListOfHeaders  	= CSV_Content.refined[0];
	var ListOfContents 	= CSV_Content.refined;
	
	// Creating first row for headers
	var tableRow = document.createElement('TR');
	Website.table.appendChild(tableRow);
	
	
	// Generating table headers
	for(var header = 0; header < CSV_Content.numOfHeaders; header++)
	{
			
		// Creating headers within first row
		var headers = document.createElement('TH');
		headers.innerHTML = ListOfHeaders[header];
		tableRow.appendChild(headers);
		
	}
	
	
	// Generating table content beneath headers 
	while((ListOfContents.length-1) > 0)
	{
		// Removing the first item of an array and putting previous element as first
		ListOfContents.shift();
		
		// Creating next row
		tableRow = document.createElement('TR');
		Website.table.appendChild(tableRow);
		
		for(var column = 0; column < CSV_Content.numOfHeaders; column++)
		{
			
			// Creating colums and inserting CSV content
			var content = document.createElement('TD');
			
			// Due to .shift() index is always 0
			content.innerHTML = ListOfContents[0][column]; 
			tableRow.appendChild(content);
		}
		
	}

}


// Purpose: Reads file(CSV) content
function Read()
{
	// MONITOR
	console.table(Website.fileInput.files);
	
	// Creating a reader which is needed to get the information from the CSV file.
	// We don`t have to define the class "FileReader", 
	// because it does already exist internal in the web browser(web application).
	var myReader = new FileReader();
	
	// MONITOR
	console.table(myReader);
	
	// Selecting the first loaded file
	myReader.readAsText(Website.fileInput.files[0])
	
	// Handler for load event.It will be fired when reading process is done successfully 
	myReader.onload = function()
	{
		// Storing CSV content
		CSV_Content.raw = myReader.result;
		
		// MONITOR
		console.log("<---CSV file content as one string:--->\n" + myReader.result);
		
	}
	
	
}


// Purpose: Sets CSV separator onchange
function setSeparator()
{
	if(Website.radioComma.checked)
	{
		// ","
		CSV_Content.separator = Website.radioComma.value;
	}
	else if(Website.radioSemicolon.checked)
	{
		// ";"
		CSV_Content.separator = Website.radioSemicolon.value;
	}
	else if(Website.radioWhitespace.checked)
	{
		// " "
		CSV_Content.separator = Website.radioWhitespace.value;
	}
	else if(Website.radioTabulator.checked)
	{
		// "	"
		CSV_Content.separator = Website.radioTabulator.value;
	}
	
}


// Purpose: Builds the table with CSV content in web browser
function BuildTable()
{

	// Reseting table
	Website.table.innerHTML = "";
	
	// Parsing CSV file
	CSV_Content.refined = CSV_Content.parse(CSV_Content.separator);
		
	// MONITOR
	console.table(CSV_Content.refined);

	// Setting the number of headers found in the refined array
	CSV_Content.numOfHeaders = CSV_Content.refined[0].length;

	// Setting the number of lines found in the refined array which also includes header line
	CSV_Content.numOfContent = CSV_Content.refined.length;
	
	fillTableContent();
	
}
