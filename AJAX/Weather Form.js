 var apiKey = "02b6d7a137a4e2671cd49785ec197bfc";

      document.addEventListener('DOMContentLoaded', cityButton);
	  
	  function cityButton(){
        document.getElementById('citySubmit').addEventListener('click', function(event){
          var req = new XMLHttpRequest();
		  var getCity = {name:null};
		  getCity.name = document.getElementById("City").value;
          req.open("GET", "http://api.openweathermap.org/data/2.5/weather?q=" + getCity.name + "&appid="+ apiKey, true);
		  req.addEventListener('load',function(){
          if(req.status >= 200 && req.status < 400){
           var cs = JSON.parse(req.responseText);
           document.getElementById("city").textContent = cs.name;
           document.getElementById("temp").textContent = cs.main.temp;
		   document.getElementById("humid").textContent = cs.main.humidity;
          } 
		   else {
           console.log("Error in network request: " + req.statusText);
           }
		  });  
		  req.send(null);
          event.preventDefault();
        })
	  }
	  
	  document.addEventListener('DOMContentLoaded', randomBin);
	  
	  function randomBin(){
		  document.getElementById("randomIn").addEventListener("click", function(event){
			var req = new XMLHttpRequest();
			var bin = {"input":null};
		    bin.input = document.getElementById("Bin").value;
			req.open("POST", "http://httpbin.org/post", true);
			req.setRequestHeader('Content-Type', 'application/json');
			req.addEventListener('load',function(){
			if(req.status >= 200 && req.status < 400){
				var response = JSON.parse(req.responseText);
				var objectBack = JSON.parse(response.data);
				document.getElementById("rand").textContent = objectBack.input;
			} 
			else {
				console.log("Error in network request: " + req.statusText);
			}});
			req.send(JSON.stringify(bin));
			event.preventDefault();
		  })
	  }
	  