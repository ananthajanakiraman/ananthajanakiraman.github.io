    !(function (d3) {

    $("ccontent").empty();
	    
    $(document).ready(function() {
         console.log("Hello world.")
        });
	    
        var val = d3.select('input[name="LITY"]:checked').node().value;
        console.log(val);

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
        
        var svg = d3.select("ccontent").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        var labels = {
            "LITECOIN"  : "Litecoin"
        }
        
       d3.tsv("datalit"+val+".tsv", function(error, data) {
             if (error) throw error; 
            
             data.forEach(function(d) {
                  d.date = parseDate(d.Date);
		  d.price = +d.LITECOIN;
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
             .attr("dx", "8em")
             .style("text-anchor", "end")
             .text("Closing Price ($)");

	  svg.append("path")
	      .data([data])
	      .attr("class", "linelit")
              .attr("d", line);
	
	  svg.append("path")
	      .datum(data)
	      .attr("fill","Khaki")
              .attr("d", area);
	       
	   var focus2 = svg.append("g")
	        .attr("opacity",0)
		.attr("class", "focus2");
	
	   focus2.append("circle")
	        .attr("class","circle")
	        .attr("r", 3);
	
	   focus2.append("line").attr("class", "x--line")
 	        .style("stroke", "#777")
		.style("shape-rendering", "crispEdges")
		.style("stroke-dasharray", "1,1")
		.style("opacity", 0.8)
		.attr("y1",-height)
		.attr("y2",0);

	   focus2.append("text").attr("class", "y1--text")
		.style("stroke", "white")
		.style("stroke-width", "3px")
		.style("opacity", 0.8)
		.attr("dx", 8)
		.attr("dy", "0em");
	       
	   focus2.append("text").attr("class", "y2--text")
		.attr("fill","#000")
		.attr("dx", 8)
		.attr("dy", "0em");
	
	focus2.append("text").attr("class", "y3--text")
		.style("stroke", "white")
		.style("stroke-width", "3px")
		.style("opacity", 0.8)
		.attr("dx", 8)
		.attr("dy", "1em");
		
	focus2.append("text").attr("class", "y4--text")
		.attr("fill","#000")
		.attr("dx", 8)
		.attr("dy", "1em");
	       
	svg.append("rect")
	   .attr("class", "overlay")
	   .attr("width",width)
	   .attr("height",height)
	   .on("mouseover", function() { focus2.style("opacity", 1); })
	   .on("mouseout", function() { focus2.style("display","none"); })
	   .on("mousemove", mousemove); 

	    function mousemove() {
		var x0 = x.invert(d3.mouse(this)[0]),
	            i = bisectDate(data, x0, 1),
		    d0 = data[i - 1],
		    d1 = data[i],
		    d = x0 - d0.date > d1.date - x0 ? d1 : d0;
		focus2.style("display", null);
	         focus2.select("text.y3--text").attr("transform", "translate(" + x(d.date) + "," + (height/2 - 6) + ")")
	              .text(formatTime(d.date));
	         focus2.select("text.y4--text").attr("transform", "translate(" + x(d.date) + "," + (height/2 - 6) + ")")
	              .text(formatTime(d.date));
	         focus2.select("text.y1--text").attr("transform", "translate(" + x(d.date) + "," + (height/2 - 16) + ")")
	              .text("$" + d.price);
	         focus2.select("text.y2--text").attr("transform", "translate(" + x(d.date) + "," + (height/2 - 16) + ")")
	              .text("$" + d.price);
                 focus2.select(".circle").attr("transform", "translate(" + x(d.date) + "," + y(d.price) + ")");
	         focus2.select(".x--line").attr("transform", "translate(" + x(d.date) + "," + height + ")");
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
	        .on("mouseover", function() {focus2.style("display", null);})
	        .on("mousemove", function(d) {
		 focus2.style("display", null);
                 focus2.select("text.y3--text").attr("transform", "translate(" + x(d.date) + "," + (height/2 - 6) + ")")
	              .text(formatTime(d.date));
	         focus2.select("text.y4--text").attr("transform", "translate(" + x(d.date) + "," + (height/2 - 6) + ")")
	              .text(formatTime(d.date));
	         focus2.select("text.y1--text").attr("transform", "translate(" + x(d.date) + "," + (height/2 - 16) + ")")
	              .text("$" + d.price);
	         focus2.select("text.y2--text").attr("transform", "translate(" + x(d.date) + "," + (height/2 - 16) + ")")
	              .text("$" + d.price);
                 focus2.select(".circle").attr("transform", "translate(" + x(d.date) + "," + y(d.price) + ")");
	         focus2.select(".x--line").attr("transform", "translate(" + x(d.date) + "," + height + ")");
	
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

       }); 
    })(d3);
