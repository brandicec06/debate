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

	twKeys = Object.keys(speakers["TRUMP"].wCount);
	cwKeys = Object.keys(speakers["CLINTON"].wCount);
	var tfCount = [];
	var cfCount = [];
	
	for(var i =0; i < twKeys.length; i++){
		tfCount.push(
			{
				'word': twKeys[i],
				'count': speakers['TRUMP'].wCount[twKeys[i]]
			}
		)
	}
	for(var i =0; i < cwKeys.length; i++){
		cfCount.push(
			{
				'word': cwKeys[i],
				'count': speakers['CLINTON'].wCount[cwKeys[i]]
			}
		)
	}
	var allWcount = tfCount.concat(cfCount);
	allWcount = _.sortBy(allWcount, 'count').reverse();
	var editCount = []
	for(var i =0; i< allWcount.length; i++){
		try{
			var pos = compendium.analyse(allWcount[i].word)[0].root.tags[0];
		}catch(err){
			pos = 'C';
		}
		if(pos == 'NNS' || pos == 'NN' || pos == 'VB' || pos == 'JJ' || pos == 'RB'){
			editCount.push(allWcount[i]);
		}
	}
	console.log(editCount);
	//console.log(compendium.analyse('we')[0].root.tags[0]);



	///////Sentiment graphs
	// console.log(compendium.analyse(lines[1].s)[0].profile.sentiment);
	//console.log(lines)


	 var sWidth = $("#sentiment").width()-10;
	 var sHeight = parseInt(window.innerHeight)*.5;
	 var topPts = [];
	 var botPts = [];

	 var gBound = [50,sWidth-50];

	 function sentimentPoints(name, hBounds){

	 	var pArr = [];

	 	var tLength = name.sentences.length;

		 for( var l=0; l<tLength; l++){
		 	try{

		 		var sen = compendium.analyse(name.sentences[l])[0].profile.sentiment;
		 		var x = remap(l, [0,tLength], gBound);
		 		if(name.name == "TRUMP"){
		 			var y = remap(sen, [-3,3],hBounds);
		 		}else{
		 			var y = remap(sen, [-3,3],hBounds);
		 		}
		 		pArr.push(
		 		{
		 			'x':x,
		 			'y':y
		 		});

		 		/*if(l == tLength-1){
		 			if(name.name =="TRUMP"){
						 pArr.push({
								'x':x,
								'y':sHeight
						 });
					}else{
						 pArr.push({
								'x':x,
								'y':0
						 });
					}
				}
				if(l == 0){
		 			if(name.name =="TRUMP"){
						 pArr.push({
								'x':x,
								'y':sHeight
						 });
					}else{
						 pArr.push({
								'x':x,
								'y':0
						 });
					}
				}*/

		 	}catch(err){
		 		continue;
		 	}
		 } 

		 return pArr;

	 }

	 trumpRange = [sHeight,sHeight*.2];
	 clintonRange = [sHeight,sHeight*.2];
	 sentRange = [1,5];

	 topPts = sentimentPoints(speakers.TRUMP,trumpRange);
	 botPts = sentimentPoints(speakers.CLINTON,clintonRange);


	 //Y Axis Adjustment
	 yAdj = -20;

	 var lfunc = d3.line()
		   .curve(d3.curveLinear)//BasisOpen)
       .x(function(d) { 
       		return (d.x); 
       })
       .y(function(d) { 
       		return (d.y+yAdj); 
       }); 



	svg4 = d3.select('#gtop').append('svg')
	  .attr("width", sWidth)
	  .attr("height", sHeight)
	  .attr('display','block')
	  .style("background-color","none");


	  /////Circle @ veritces
	 svg4.selectAll('circle').data(topPts)
	 	.enter().append('circle')
	 	.attr('r', 2)
	 	.attr('cx',function(d){
	 		return 0;
	 	})
	 	.attr('cy',function(d){
	 		return sHeight
	 	})
	 	.attr('fill','');



	 //Define Y axis
 	 var xScale = d3.scaleLinear()
            .domain([0,1])
            .range([0,sWidth-50]);

     svg4.append('g')
     	.attr("stroke", "#66686C")
     	.attr("transform", "translate(" + 0 + "," + (-yAdj*2.9) +")")
     	.call(d3.axisBottom(xScale)
		.ticks(25)
		.tickSize([sHeight-75])
		.tickFormat(""));

     svg4.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ (25) +","+(sHeight/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
            .attr("fill", "#66686C")
            .text("Value");

	 //Define Y scale
	 var yScale = d3.scaleLinear()
                .domain(sentRange)
                .range(trumpRange);

	//Create Y axis
	svg4.append("g")
	.attr("stroke", "#66686C")
	.attr("transform", "translate(" + 45 + "," + yAdj+")")
	.call(d3.axisLeft(yScale)
		.ticks(5)
		.tickSize(-sWidth)
		.tickFormat(d3.format(".0s")));


  	svg4.selectAll('g').selectAll('path')
	.styles({
		stroke: 'none'
	});

  	svg4.selectAll('g').selectAll('line')
	.styles({
		stroke: '#66686C'
	});

	d3.select('.sentiment')
		.style('overflow','visible')

	 svg4.append("path")
    .attr('stroke','#D33E43')
 	.attr('stroke-width', 2)
 	.attr('fill','none')
    .attr("d", lfunc(topPts));


	svg5 = d3.select('#gbot').append('svg')
	  .attr("width", sWidth)
	  .attr("height", sHeight)
	  .attr('display','block')
	  .style("background-color","none");

  	svg5.append("path")
	    .attr('stroke','#3E78B2')
	 	.attr('stroke-width', 2)
	 	.attr('fill','none')
	    .attr("d", lfunc(botPts, yAdj));


	 var yScale2 = d3.scaleLinear()
	        .domain(sentRange)
	        .range(clintonRange);




	//Create Y axis
	svg5.append("g")
	.attr("class", ".axis ")
	.attr("transform", "translate(" + 30 + ",0)")
	.call(d3.axisLeft(yScale2)
	    .ticks(5));

});





