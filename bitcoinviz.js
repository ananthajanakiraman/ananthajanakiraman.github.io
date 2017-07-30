      !(function (d3) {
	      
      $("acontent").empty();
	      
      $(document).ready(function() {
         console.log("Hello world.")
        });

	var val = d3.select('input[name="BTHY"]:checked').node().value;
	      
       var margin = {
         top: 20,
         right: 80,
         bottom: 30,
         left: 50
       },
       width = 1140 - margin.left - margin.right,
       height = 520 - margin.top - margin.bottom;
	      
       var parseDate1 = d3.timeFormat("%Y-%m-%d").parse;
       var parseDate  = d3.timeParse("%Y-%m-%d"),
	   bisectDate = d3.bisector(function(d) { return d.date; }).left;
       var formatTime = d3.timeFormat("%e %B");

       var div = d3.select("body").append("div")
                   .attr("class", "tooltip")
                   .style("opacity", 0);

       var x = d3.scaleTime()
                 .range([0, width]);

       var y = d3.scaleLinear()
                 .range([height, 0]);
        
       //Color exists as a Scale. 
       var color = d3.scaleOrdinal(d3.schemeCategory10);

       var xAxis = d3.axisBottom(x);

       var yAxis = d3.axisLeft(y);
       
       var line = d3.line()
                    .curve(d3.curveCardinal)
                    .x(function(d) {
                       return x(d.date);
                     })
                    .y(function(d) {
                       return y(d.price);
                     });

        var area = d3.area()
	             .curve(d3.curveCardinal)
                    .x(function(d) {
                       return x(d.date);
                     })
                    .y1(function(d) {
                       return y(d.price);
                     });
        
        var svg = d3.select("acontent").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        var labels = {
            "BITCOIN"  : "Bitcoin"
        }
        
       d3.tsv("databit"+val+".tsv", function(error, data) {
             if (error) throw error; 
            
             data.forEach(function(d) {
                  d.date = parseDate(d.Date);
		  d.price = +d.BITCOIN;
           });

         data.sort(function(a, b) {
              return a.date - b.date;
           });

       x.domain(d3.extent(data, function(d) {
             return d.date;
           }));
	       
        y.domain([
                0,
		d3.max(data, function(d) {return d.price;})
          ]);
	area.y0(y(0));
        
        var defs = svg.append("defs");
	
	defs.append("clipPath")
		.attr("id", "clipp")
		.append("rect")
		.attr("y", y(1))
		.attr("width", width)
		.attr("height", height - y(1));
	       
	svg.append("g")
             .attr("class", "x axis")
             .attr("transform", "translate(0," + height + ")")
             .call(xAxis);
           
        svg.append("g")
             .attr("transform", "translate(0,0)")
             .attr("class", "y axis")
             .call(yAxis);
          
	 svg.append("g")
	     .append("text")
             .attr("transform", "rotate(0)")
             .attr("y", 10)
             .attr("dy", ".75em")
             .style("text-anchor", "end")
             .text("Closing Price (USD)");

	  svg.append("path")
	      .data([data])
	      .attr("class", "line")
              .attr("d", line);
	
	  svg.append("path")
	      .datum(data)
	      .attr("fill","lightsteelblue")
	      .attr("clip-path", "url(#clipp)")
              .attr("d", area);
	       
	   var focus = svg.append("g")
	        .attr("opacity",0)
		.attr("class", "focus");
	
	   focus.append("circle")
	        .attr("class","circle")
	        .attr("r", 3);
	
	   focus.append("line").attr("class", "x--line")
 	        .style("stroke", "#777")
		.style("shape-rendering", "crispEdges")
		.style("stroke-dasharray", "1,1")
		.style("opacity", 0.8)
		.attr("y1",-height)
		.attr("y2",0);

	   focus.append("text").attr("class", "y1--text")
		.style("stroke", "white")
		.style("stroke-width", "3px")
		.style("opacity", 0.8)
		.attr("dx", 8)
		.attr("dy", "0em");
	       
	   focus.append("text").attr("class", "y2--text")
		.attr("fill","#000")
		.attr("dx", 8)
		.attr("dy", "0em");
	
	focus.append("text").attr("class", "y3--text")
		.style("stroke", "white")
		.style("stroke-width", "3px")
		.style("opacity", 0.8)
		.attr("dx", 8)
		.attr("dy", "1em");
		
	focus.append("text").attr("class", "y4--text")
		.attr("fill","#000")
		.attr("dx", 8)
		.attr("dy", "1em");
	       
	svg.append("rect")
	   .attr("class", "overlay")
	   .attr("width",width)
	   .attr("height",height)
	   .on("mouseover", function() { focus.style("opacity", 1); })
	   .on("mouseout", function() { focus.style("display","none"); })
	   .on("mousemove", mousemove); 

	    function mousemove() {
		var x0 = x.invert(d3.mouse(this)[0]),
	            i = bisectDate(data, x0, 1),
		    d0 = data[i - 1],
		    d1 = data[i],
		    d = x0 - d0.date > d1.date - x0 ? d1 : d0;
		focus.style("display", null);
	         focus.select("text.y3--text").attr("transform", "translate(" + x(d.date) + "," + (height/2 - 6) + ")")
	              .text(formatTime(d.date));
	         focus.select("text.y4--text").attr("transform", "translate(" + x(d.date) + "," + (height/2 - 6) + ")")
	              .text(formatTime(d.date));
	         focus.select("text.y1--text").attr("transform", "translate(" + x(d.date) + "," + (height/2 - 16) + ")")
	              .text("$" + d.price);
	         focus.select("text.y2--text").attr("transform", "translate(" + x(d.date) + "," + (height/2 - 16) + ")")
	              .text("$" + d.price);
                 focus.select(".circle").attr("transform", "translate(" + x(d.date) + "," + y(d.price) + ")");
	         focus.select(".x--line").attr("transform", "translate(" + x(d.date) + "," + height + ")");
				      }
	       
        svg.selectAll(".dot")
             .data(data)
             .enter().append("circle")
             .attr("class", "dot")
             .attr("cx", function(d) {
                   return x(d.date); 
                 })
             .attr("cy", function(d) {
                   return y(d.price); 
                 })
             .attr("r", 5)
	        .on("mouseover", function() {focus.style("display", null);})
	        .on("mousemove", function(d) {
		 focus.style("display", null);
                 focus.select("text.y3--text").attr("transform", "translate(" + x(d.date) + "," + (height/2 - 6) + ")")
	              .text(formatTime(d.date));
	         focus.select("text.y4--text").attr("transform", "translate(" + x(d.date) + "," + (height/2 - 6) + ")")
	              .text(formatTime(d.date));
	         focus.select("text.y1--text").attr("transform", "translate(" + x(d.date) + "," + (height/2 - 16) + ")")
	              .text("$" + d.price);
	         focus.select("text.y2--text").attr("transform", "translate(" + x(d.date) + "," + (height/2 - 16) + ")")
	              .text("$" + d.price);
                 focus.select(".circle").attr("transform", "translate(" + x(d.date) + "," + y(d.price) + ")");
	         focus.select(".x--line").attr("transform", "translate(" + x(d.date) + "," + height + ")");
	
	      });
	       
               var maximum1 = d3.max(data, function(d) {return d.price;});
 	       var maximumObj = data.filter(function(d) {return d.price == maximum1;})[0];
	       
	       var maxCircle = svg.append("circle")
                                  .attr("class", "maxCircle")
  	                          .attr("cx", x(maximumObj.date))
                                  .attr("cy", y(maximumObj.price))
                                  .attr("r", 10)
                                  .attr("fill", "none")
                                  .attr("stroke", "red")
                                  .attr("stroke-width", "2px");
	       
                repeat();
	       
		function repeat() {
			 maxCircle.transition()
				  .duration(2000)
			          .attr("r", 2)
				  .transition()
				  .duration(1000)
				  .attr("r", 16)
				  .on("end", repeat);
			};
	       
	       	svg.append("text")
		.attr("x",width/2-100)
		.attr("y",y(maximum1))
		.text('Peak: ' + '$' + maximum1)
	        .style("font-size","14px")
	        .style("font-weight", "bold")
	        .style("font-family","Arial")
	       
	       
	       d3.selectAll('input[name="BTHY"]').on("change", change);
	
	       function change() {
			   
                           svg.select("#clipp>rect").transition().duration(600)
			       .attr("y", y(1))
		               .attr("height", height - y(1));
	                    area.y0(y(1));
			   
		           console.log(d3.extent(data1, function(d) { return d.date1;}));
		    
	            }

       }); 
      })(d3);
