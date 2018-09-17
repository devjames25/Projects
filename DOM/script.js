function buildTable(){
	var body = document.getElementsByTagName("body")[0];
	
	var table = document.createElement("table");
	var tabHead = document.createElement("thead");
	var tabBody = document.createElement("tbody");
	
	//Variables for Table cells
	var x = 0;
	var y = 0;
	
	//Create a button that changes the given cell's color
	var selected = document.createElement("input");
	selected.type = "button";
	selected.value = "Mark Cell";
	selected.onclick = (function(){
		table.rows[x].cells[y].style.backgroundColor = "yellow";
		});
		
	//Creates a 4x4 table
	for(var i = 0; i < 4; i++){
		var head = document.createElement("th");
		var row = document.createElement("tr");
		var headText = document.createTextNode("Header " + (i + 1));
		
		for(var j = 0; j < 4; j++){
			var cell = document.createElement("td");
			var words = document.createTextNode((j + 1) + "," + (i + 1));
			head.appendChild(headText);
			cell.appendChild(words);
			row.appendChild(cell);
		}
		tabHead.appendChild(head); 
		tabBody.appendChild(row);
	}
	
	//Appends thread and then tbody as the last children of table
	table.appendChild(tabHead);
	table.appendChild(tabBody);
	
	//Appends table as the last child of body
	body.appendChild(table);
	
	//Table attributes 
	table.setAttribute("border", "2");
	
	//Starting cursor 
	table.rows[x].cells[y].style.border = "2px solid red";
	
	//This function changes the border of the table cells depending on the x and y values
	function cursor(){
		for(var i = 0; i < 4; i++){
			for(var j = 0; j < 4; j++){
				if(i == x && j== y){
					table.rows[i].cells[j].style.border = "2px solid red";
			    }
		    }
	    }
	}
	
	//Up direction button
	var up = document.createElement("input");
	up.type = "button";
	up.value = "UP";
	up.setAttribute("border", "2");
	up.onclick = (function(){
		table.rows[x--].cells[y];
		cursor();
	});
	
	//Down direction button
	var down = document.createElement("input");
	down.type = "button";
	down.value = "DOWN";
	down.setAttribute("border", "2");
	down.onclick = (function(){
		table.rows[x++].cells[y];
		cursor();
	});
	
	//Left direction button
	var left = document.createElement("input");
	left.type = "button";
	left.value = "LEFT";
	left.setAttribute("border", "2");
	left.onclick = (function(){
		table.rows[x].cells[y--];
		cursor();
	});
	
	//Right direction button
	var right = document.createElement("input");
	right.type = "button";
	right.value = "RIGHT";
	right.setAttribute("border", "2");
	right.onclick = (function(){
		table.rows[x].cells[y++];
		cursor();
	});
	
	//Appends the follow buttons as to the last child of body 
	body.appendChild(up);
	body.appendChild(down);
	body.appendChild(left);
	body.appendChild(right);
	body.appendChild(selected);
	
}

//Call function
 buildTable();