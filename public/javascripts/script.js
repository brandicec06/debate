var transcript;
var wCount = new Array();//word count
var sCount = new Array();//Speaker
var speakers = {};
var person = "";
var totalSentences = 0;

var svg;
var width = parseInt(window.innerWidth)-100;
var height = parseInt(window.innerHeight)-100;
var mcolor = "#D4D6D4";

d3.text("/source/text.txt",function(data){

	transcript= data.toString().split(/\s/);
 	
	var sentence = [];
	for(var i =0; i<transcript.length; i++){
		

		lChar = transcript[i].charAt(transcript[i].length-1);
		if(lChar == ":" && transcript[i].length>4){
			//console.log(transcript[i] + "  " + transcript[i].length)
			person = transcript[i].slice(0,-1);
			if(transcript[i] == "all:"){
				console.log(lChar + transcript[i].length);
			}
			if(true == _.has(speakers, person)){
				speakers[person].sCount[transcript[i]]++;
			}else{
				speakers[person] ={
					'name': person,
					'wCount' : new Array(),//word count
					'sCount' : new Array(),//# of times spoken
					'sentCount' : new Array()//Speaker sentences
				}
				speakers[person].sCount[transcript[i]] = 1;
			}
		
		}else{

			if(lChar == "." || lChar == "?" || lChar == ","){
				if(transcript[i]!= "J." && transcript[i] != "Mr." ){
					sentence.push(transcript[i].slice(0,-1));
				}
			}else{
				sentence.push(transcript[i]);
			}

			if(lChar == "." || lChar == "?" ){
				//console.log(transcript[i].length + "  " + transcript[i]);
				if(transcript[i]!= "J." && transcript[i] != "Mr." ){
					transcript[i] = transcript[i].slice(0,-1);
					speakers[person].sentCount.push(sentence);
					totalSentences++;
					sentence = [];
				}
			}

			if(lChar == ","){
				transcript[i] = transcript[i].slice(0,-1);
			}
			
			//console.log(transcript[i].length);
			
			if(true == _.has(speakers[person].wCount, transcript[i])){
				speakers[person].wCount[transcript[i]]++;
			}else{
				speakers[person].wCount[transcript[i]] = 1;
			}
		}
	}
	console.log(totalSentences);
	
	//console.log(speakers);

	svg = d3.select('#main').append('svg')
	  .attr("width", width)
	  .attr("height", height)
	  .style("background-color",mcolor);

	 svg.append("rect")
	 	.attr('x', 0)
	 	.attr('y', 0)
	 	.attr('width', 30)
	 	.attr('height', 300);

});


