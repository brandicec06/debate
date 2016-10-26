var transcript;
var speakers = {};
var person = "";
var wordSeq = [];
var totalSentences = 0;
var lines = [];

var svg;
var width = parseInt(window.innerWidth)-100;
var height = parseInt(window.innerHeight)-100;
var mcolor = "#D4D6D4";

var svg2;
var svg3;
var svg4,svg5;

d3.text("/source/text.txt",function(data){

	transcript= data.toString().split(/\s/);
 	
	var sentence = [];
	for(var i =0; i<transcript.length; i++){
		

		lChar = transcript[i].charAt(transcript[i].length-1);
		if(lChar == ":" && transcript[i].length>4){
			//console.log(transcript[i] + "  " + transcript[i].length)
			person = transcript[i].slice(0,-1);
			if(transcript[i] == "all:"){
				//console.log(lChar + transcript[i].length);
			}
			if(true == _.has(speakers, person)){
				speakers[person].sCount[transcript[i]]++;
			}else{
					speakers[person] ={
					'name': person,
					'wCount' : new Array(),//word count
					'sCount' : new Array(),//# of times spoken
					'sentCount' : new Array(),//Speaker sentence count
					'sentences' : []

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
					sentence = sentence.join(' ');
					speakers[person].sentCount.push(sentence);

					speakers[person].sentences.push(sentence);

					lines.push({
						'p': person,
						's': sentence
					});
					totalSentences++;
					sentence = [];
				}
			}


			if(lChar == ","){
				transcript[i] = transcript[i].slice(0,-1);
			}
			
			wordSeq.push({
				'p': person,
				'w': transcript[i],
			})
			
			if(true == _.has(speakers[person].wCount, transcript[i])){
				speakers[person].wCount[transcript[i]]++;
			}else{
				speakers[person].wCount[transcript[i]] = 1;
			}
		}
	}
	
	function remap(n,bounds, nbounds){
		var scaleX = d3.scaleLinear()
      		.domain(bounds)
      		.range(nbounds);

      	var x = scaleX(n);

      	return x;
	}

	//Visualization

	/*function zoomed() {
	  var transform = d3.event.transform;
	  circles.attr("transform", function(d) {
	  	console.log(transform);
	    return "translate(" + transform.applyX(d[0]) + "," + transform.applyY(d[0]) + ")";
	  });
	}*/


	svg = d3.select('#main').append('svg')
	  .attr("width", width)
	  .attr("height", height)
	  .style("background-color",mcolor);
	  
	 
	 svg.selectAll("rect").data(lines)
	 	.enter().append("rect")
	 	.attr('x', function(d,i){
	 		return remap(i,[0,totalSentences],[0,width]);
	 	})
	 	.attr('y', 0)
	 	.attr('width', .25)
	 	.attr('height', height)
	 	.style('stroke',"none")
	 	.style('fill',function(d){
	 		if(d.p == "TRUMP"){
	 			return "red";
	 		}else if(d.p == "CLINTON"){
	 			return "blue";
	 		}else{
	 			return "grey";
	 		}
	 	});

	 
	 svg2 = d3.select('#second').append('svg')
	  .attr("width", width)
	  .attr("height", height)
	  .style("background-color",mcolor)
	  .style("pointer-events", "all")
	  /*.call(d3.zoom()
        .scaleExtent([1 / 2, 4])
        .on("zoom", zoomed));*/


	 //circs = [1,2,3,4,5,6,7,8,9,10];
	 circs = [
	 			[1,10],
	 			[2,20],
	 			[3,30],
	 			[4,40]
	 		];

	 var circles = svg2.selectAll('g').data(circs)
	 				.enter().append('g');

	 cenX = width/2;
	 cenY = height/2;

	 circles.append('circle')
	 	//.attr("transform", function(d) { return "translate(" + d[0] + "," + d[1] + ")"; })
	 	.attr('r', function(d,i){
	 		if(i == circs.length-1){
	 			return d[0]*20;
	 		}else{
	 			return 0;
	 		}
	 	})
	 	.attr('cx', width/2)
	 	.attr('cy', height/2)
	 	.attr('fill','none')
	 	.attr('stroke','black')
	 	.attr('stroke-width', 3);



	 circles.append('circle')
	 	.attr('r', function(d,i){
	 		return d[0]*10;
	 	})
	 	.attr('cx', function(d,i){

	 		return cenX + (200*Math.sin(remap(i,[0,circs.length],[0,Math.PI*2])));
	 	})
	 	.attr('cy', function(d,i){
	 		return cenY - (200*Math.cos(remap(i,[0,circs.length],[0,Math.PI*2])));
	 	})
	 	.attr('fill','none')
	 	.attr('stroke','black')
	 	.attr('stroke-width', 3);


	 var circs = [];
	 for (var i = 0; i < 100; i+=50) {
	  	circs[i] = i;
	  }

	 var pts = [];

	 for(var i =0; i<circs.length; i++){
	 	var x =  cenX + (200*Math.sin(remap(i,[0,circs.length],[0,Math.PI*2])));
	 	var y =  cenY - (200*Math.cos(remap(i,[0,circs.length],[0,Math.PI*2])));

	 	var x1 =  cenX + (200*Math.sin(remap(i+1,[0,circs.length],[0,Math.PI*2])));
	 	var y2 =  cenY - (200*Math.cos(remap(i+1,[0,circs.length],[0,Math.PI*2])));


	 	pts.push([{'x':x,'y':y},
	 			{'x':cenX,'y':cenY},
	 			{'x':x1,'y':y2}]);

	 }

	function ranNum(min, max) {
    	return Math.random() * (max - min) + min;
	}
	//console.log(pts[1][1]);

	 var lf = d3.line()
	 		   .curve(d3.curveBasis)//BasisOpen)
	           .x(function(d) { 
	           		return (d.x); 
	           })
	           .y(function(d) { 
	           		return (d.y); 
	           }); 


	 svg3 = d3.select('#third').append('svg')
	  .attr("width", width)
	  .attr("height", height)
	  .style("background-color",mcolor);


	svg3.selectAll("line")
	    .data(pts)
	  	.enter().append("path")
	    .attr('stroke','blue')
	 	.attr('stroke-width', 2)
	 	.attr('fill','none')
	    .attr("d", lf);


	    ///////Sentiment graphs


	// console.log(compendium.analyse(lines[1].s)[0].profile.sentiment);
	//console.log(lines)


	 var sWidth = $("#sentiment").width()-10;
	 var sHeight = parseInt(window.innerHeight)/2;
	 var topPts = [];
	 var botPts = [];
	 		
	 var TsLength = speakers.TRUMP.sentences.length;

	 for( var l=0; l<TsLength; l++){
	 	try{
	 		



			var sen = compendium.analyse(speakers.TRUMP.sentences[l])[0].profile.sentiment;
	 		var x = remap(l, [0,TsLength], [0,sWidth]);

	 		var y = remap(sen, [-2,2],[sHeight,sHeight*.3]);
	 		topPts.push(
	 		{
	 			'x':x,
	 			'y':y
	 		});

	 		if(l==TsLength -1){
	 			topPts.push[{
	 				'x': sWidth,
	 				'y': sHeight
	 			}];
	 		}

	 	}catch(err){
	 		continue;
	 	}
	 } 


	 topPts.unshift({
			'x':0,
			'y':sHeight
	 });

	 topPts.push({
			'x':sWidth,
			'y':sHeight
	 });


/*
	 for( var l in speakers.CLINTON.sentences) {
	 	try{
	 		var sen = compendium.analyse(speakers.CLINTON.sentences[l]);
	 		console.log();
	 		var x = remap(l, [0,speakers.CLINTON.sentences[l].length], [0,sWidth]);
	 		var y = remap(sen, [-3,3],[0,300]);

	 		topPts.push(
	 		{
	 			'x':x,
	 			'y':y
	 		});

	 	}catch(err){
	 		continue;
	 	}
	 } */


	 var lfunc = d3.line()
		   .curve(d3.curveLinear)//BasisOpen)
       .x(function(d) { 
       		return (d.x); 
       })
       .y(function(d) { 
       		return (d.y); 
       }); 


	svg4 = d3.select('#gtop').append('svg')
	  .attr("width", sWidth)
	  .attr("height", sHeight)
	  .style("background-color","gray");

	 svg4.selectAll('circle').data(topPts)
	 	.enter().append('circle')
	 	.attr('r', 10)
	 	.attr('cx',function(d){
	 		return 0;
	 	})
	 	.attr('cy',function(d){
	 		return sHeight
	 	});

	 svg4.append("path")
	    .attr('stroke','red')
	 	.attr('stroke-width', 2)
	 	.attr('fill','blue')
	    .attr("d", lfunc(topPts));




 	/*svg4.selectAll('line')
	 	.data(topPts)
	 	.enter().append("path")
	 	.attr('stroke','red')
	 	.attr('stroke-width', 2)
	 	.attr('fill','none')
	    .attr("d", lf);*/


	svg5 = d3.select('#gbot').append('svg')
	  .attr("width", sWidth)
	  .attr("height", sHeight)
	  .style("background-color","none");



/*
	 circs = [
	 			[1,10],
	 			[2,20],
	 			[3,30],
	 			[4,40]
	 		];

var points = circs;


var circ = svg3.selectAll("circle")
    .data(points)
  .enter().append("circle")
    //.attr("transform", function(d) { return "translate(" + d[0].x + "," + d[1].y + ")"; })
    .attr("r", 2.5);

 var l = svg3.append('path')
 		.attr('d',function(d,i){
 			return lf(pts[i]);
 		})
 		 //		.data(pts)
 		.attr('stroke','blue')
 		.attr('stroke-width', 2)
 		.attr('fill','none')
 		//.attr("transform", function(d) { console.log(d); return "translate(" +0 + "," + 0 + ")"; })
;

*/
/*svg3.append("rect")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "none")
    .style("pointer-events", "all")
    .call(d3.zoom()
        .scaleExtent([1 / 2, 4])
        .on("zoom", zoomed));*/
/*
function zoomed() {
  var transform = d3.event.transform;
  circ.attr("transform", function(d) {
    return "translate(" + transform.applyX(d[0]) + "," + transform.applyY(d[1]) + ")";
  });

  l.attr("transform", function(d) {
    return "translate(" + transform.applyX(d[0].x) + "," + transform.applyY(d[1].y) + ")";
  });
}*/




	/* var tx = 0;
	 var ty =0;

	circles.append("text")
	    .attr("dx", function(d,i){
		 		return cenX + (200*Math.sin(remap(i,[0,circs.length],[0,Math.PI*2])));
		 	})
	    .attr("dy", function(d,i){
		 		return cenY - (200*Math.cos(remap(i,[0,circs.length],[0,Math.PI*2])));
		 	})
	    .text(function (d) { return 'here'; })
	    .attr("transform" , function(d,i){
	    	tx = cenX + (200*Math.sin(remap(i,[0,circs.length],[0,Math.PI*2])));
	    	ty = cenY - (200*Math.cos(remap(i,[0,circs.length],[0,Math.PI*2])));


	    	return "rotate(25"+tx+ty+")";
	    });*/


});





