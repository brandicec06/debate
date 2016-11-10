var transcript;
var speakers = {};
var person = "";
var wordSeq = [];
var totalSentences = 0;
var lines = [];

var svg;
var width = $(window).width();
var height = $(window).height();
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

	//Word processing for circle graph

	twKeys = Object.keys(speakers["TRUMP"].wCount);
	cwKeys = Object.keys(speakers["CLINTON"].wCount);
	var tfCount = [];
	var cfCount = [];
	
	for(var i =0; i < twKeys.length; i++){
		tfCount.push(
			{
				'word': twKeys[i],
				'count': speakers['TRUMP'].wCount[twKeys[i]],
				'person': 't'
			}
		)
	}
	for(var i =0; i < cwKeys.length; i++){
		cfCount.push(
			{
				'word': cwKeys[i],
				'count': speakers['CLINTON'].wCount[cwKeys[i]],
				'person':'c'
			}
		)
	}

	var allWcount = tfCount.concat(cfCount);
	//allWcount = _.sortBy(allWcount, 'count').reverse();
	var editCount = []

	for(var i =0; i< allWcount.length; i++){
		var pos ='';
		var sent = 0;

		try{
		    pos = compendium.analyse(allWcount[i].word)[0].root.tags[0];
		}catch(err){
			pos = 'C';
		}

		try{
			sent = compendium.analyse(cwKeys[i])[0].profile.sentiment;
		}catch(err){
			sent = 10;
		}

		if(sent != 0){
			allWcount[i]['pos'] = pos; 
			allWcount[i]['sent'] = sent
			editCount.push(allWcount[i]);
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

/////////////////////////// Radial Graph ////////////////////////////////////

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

	

	 cenX = width/2;
	 cenY = height*.7;

	 tfCount = _.sortBy(tfCount, 'count').reverse();
	 cfCount = _.sortBy(cfCount, 'count').reverse();

	 var pts = [];
	 var cpts = [];
	 var tpts = []

	var winBord = 100;
	var rad = height/2-20;
	var wLimit = 500;
	var radStart = 100;
	var rStroke = .1

	var tcenX = width*.8;
	var ccenX = width*.2;

	tfCount =[];
	cfCount = [];

	tfCount = editCount.filter(function(item) {
		if(item.person == 't'){
  			return item;
		}
	});

	cfCount = editCount.filter(function(item) {
		if(item.person == 'c'){
  			return item;
		}
	});



	for(var i =0; i<editCount.length; i++){

	 	var n = remap(editCount[i].count,[0,100],[0,rad*.5])

	 	var x =  cenX + ((n+radStart)*Math.sin(remap(i,[0,editCount.length],[0,Math.PI*2])));
	 	var y =  cenY - ((n+radStart)*Math.cos(remap(i,[0,editCount.length],[0,Math.PI*2])));

	 	var x2 =  cenX + ((n+radStart)*Math.sin(remap(i+1,[0,editCount.length],[0,Math.PI*2])));
	 	var y2 =  cenY - ((n+radStart)*Math.cos(remap(i+1,[0,editCount.length],[0,Math.PI*2])));

	 	pts.push([{'x':cenX,'y':cenY},
	 			{'x':x,'y':y},
	 			{'x':x2, 'y':y2},
	 			{'x':cenX,'y':cenY}]);

	 }

	 for(var i =0; i<tfCount.length; i++){

		 	var n = remap(tfCount[i].count,[0,100],[0,rad*.5])

		 	var x =  tcenX + ((n+radStart)*Math.sin(remap(i,[0,tfCount.length],[0,Math.PI*2])));
		 	var y =  cenY - ((n+radStart)*Math.cos(remap(i,[0,tfCount.length],[0,Math.PI*2])));

		 	var x2 =  tcenX + ((n+radStart)*Math.sin(remap(i+1,[0,tfCount.length],[0,Math.PI*2])));
		 	var y2 =  cenY - ((n+radStart)*Math.cos(remap(i+1,[0,tfCount.length],[0,Math.PI*2])));


		 	tpts.push([{'x':tcenX,'y':cenY},
		 			{'x':x,'y':y},
		 			{'x':x2, 'y':y2},
		 			{'x':tcenX,'y':cenY}]);

	 }

	 for(var i =0; i<wLimit; i++){

		 	var n = remap(editCount[i].count,[0,100],[0,rad*.5])

		 	var x =  ccenX + ((n+radStart)*Math.sin(remap(i,[0,wLimit],[0,Math.PI*2])));
		 	var y =  cenY - ((n+radStart)*Math.cos(remap(i,[0,wLimit],[0,Math.PI*2])));

		 	var x2 =  ccenX + ((n+radStart)*Math.sin(remap(i+1,[0,wLimit],[0,Math.PI*2])));
		 	var y2 =  cenY - ((n+radStart)*Math.cos(remap(i+1,[0,wLimit],[0,Math.PI*2])));


		 	cpts.push([{'x':ccenX,'y':cenY},
		 			{'x':x,'y':y},
		 			{'x':x2, 'y':y2},
		 			{'x':ccenX,'y':cenY}]);

	 }

	
	function ranNum(min, max) {
    	return Math.random() * (max - min) + min;
	}

	 var lf = d3.line()
	 		   .curve(d3.curveLinearClosed)//BasisOpen)
	           .x(function(d) { 
	           		return (d.x); 
	           })
	           .y(function(d) { 
	           		return (d.y); 
	           }); 


	 svg3 = d3.select('#third').append('svg')
	  .attr("width", width)
	  .attr("height", height);
//	  .style("background-color",mcolor);



	svg3.selectAll("line")
	    .data(pts)
	  	.enter().append("path")
	    .attr('stroke','white')
	 	.attr('stroke-width', rStroke)
	 	.attr('fill',function(d,i){
	 		if(editCount[i].person == 't'){
	 			return 'red';
	 		}
	 		if(editCount[i].person == 'c'){
	 			return 'blue';
	 		}
	 	})
	    .attr("d", lf)
	    .on("mouseover", function () {
    		d3.select(this).attr("fill", 'black');
		}).on("mouseout", function () {
    		d3.select(this).attr("fill", 'red');
		});

	svg3.selectAll("line")
	    .data(tpts)
	  	.enter().append("path")
	    .attr('stroke','white')
	 	.attr('stroke-width', rStroke)
	 	.attr('fill','red')
	    .attr("d", lf)
	    .on("mouseover", function () {
    		d3.select(this).attr("fill", 'black');
		}).on("mouseout", function () {
    		d3.select(this).attr("fill", 'red');
		});

	svg3.selectAll("line")
	    .data(cpts)
	  	.enter().append("path")
	    .attr('stroke','white')
	 	.attr('stroke-width', rStroke)
	 	.attr('fill','blue')
	    .attr("d", lf)
	    .on("mouseover", function () {
    		d3.select(this).attr("fill", 'black');
		}).on("mouseout", function () {
    		d3.select(this).attr("fill", 'blue');
		});



	svg3.append('circle')
		.attr('cx', ccenX)
		.attr('cy', cenY)
		.attr('r', radStart-20)
		.attr('fill','white');

	svg3.append('circle')
		.attr('cx', tcenX)
		.attr('cy', cenY)
		.attr('r', radStart-20)
		.attr('fill','white');

	svg3.append('circle')
		.attr('cx', cenX)
		.attr('cy', cenY)
		.attr('r', radStart-40)
		.attr('fill','white');

/////////////////////////////////END Radial Graph /////////////////////////////////////////////////

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

	svg5 = d3.select('#gbot').append('svg')
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

	 svg5.append('g')
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

     svg5.append("text")
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
		.tickSize(-sWidth+85)
		.tickFormat(d3.format(".0s")));

		//Create Y axis
	svg5.append("g")
	.attr("stroke", "#66686C")
	.attr("transform", "translate(" + 45 + "," + yAdj+")")
	.call(d3.axisLeft(yScale)
		.ticks(5)
		.tickSize(-sWidth+85)
		.tickFormat(d3.format(".0s")));


  	svg4.selectAll('g').selectAll('path')
	.styles({
		stroke: 'none'
	});

  	svg4.selectAll('g').selectAll('line')
	.styles({
		stroke: '#66686C'
	});

  	svg5.selectAll('g').selectAll('path')
	.styles({
		stroke: 'none'
	});

  	svg5.selectAll('g').selectAll('line')
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

   	 svg5.append("path")
    .attr('stroke','#3E78B2')
 	.attr('stroke-width', 2)
 	.attr('fill','none')
    .attr("d", lfunc(botPts));



/*
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
	    */

});





