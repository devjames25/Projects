
function editButton(idVar) {
    var edit = document.getElementById(idVar);
    edit.style.display = edit.style.display === "none" ? "block" : "none";
}


function del(){
	var id = this.id;
	var req = new XMLHttpRequest();
	var url = "http://flip3.engr.oregonstate.edu:8888/delete?id=";
	req.open("GET", url + id, true);
			req.addEventListener("load", function(){
			if(req.status >= 200 && req.status < 400){
				var node = document.getElementById(id);
				if(node.parentNode){
					node.parentNode.removeChild(node);
				}
			}
			else{
				console.log("Error in network request");
			}
		});
		req.send(JSON.stringify(req.responseText));
		event.preventDefault();
}

document.getElementById("delete-button").addEventListener("click", deleteRow);


function deleteRow(tableID,currentRow) {
    try {
        var table = document.getElementById(tableID);
        var rowCount = table.rows.length;
        for (var i = 0; i < rowCount; i++) {
            var row = table.rows[i];
            
            if (row==currentRow.parentNode.parentNode) {
                if (rowCount <= 1) {
                    alert("Cannot delete all the rows.");
                    break;
                }
                table.del(i);
                rowCount--;
                i--;
            }
        }
    } catch (e) {
        alert(e);
    }
}