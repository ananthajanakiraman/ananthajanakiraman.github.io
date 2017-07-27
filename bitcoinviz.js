      $(document).ready(function() {
         console.log("Hello world.")
        });
 
       var margin = {
         top: 20,
         right: 80,
         bottom: 30,
         left: 50
       },
       width = $(".chart").width() - margin.left - margin.right,
       height = $(".chart").height() - margin.top - margin.bottom;
        
       var parseDate1 = d3.timeFormat("%Y-%m-%d").parse;
       var parseDate  = d3.timeParse("%Y-%m-%d");
       var formatTime = d3.timeFormat("%e %B");

       var x = d3.scaleTime()
                 .range([0, width]);

       var y = d3.scaleLinear()
                 .range([height, 0]);
        
       //Color exists as a Scale. 
       var color = d3.scaleOrdinal(d3.schemeCategory10);

       var xAxis = d3.axisBottom(x);

       var yAxis = d3.axisLeft(y);
       
       var line = d3.line()
                    .curve(d3.curveBasis)
                    .x(function(d) {
                       return x(d.date);
                     })
                    .y(function(d) {
                       return y(d.price);
                     });
        
        var svg = d3.select(".chart").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        var labels = {
            "BITCOIN"  : "Bitcoin"
        }
        
       d3.tsv("databit.tsv", function(error, data) {
             if (error) throw error; 
            
             data.forEach(function(d) {
                  d.date = parseDate(d.Date);
		  d.price = +d.BITCOIN;
           });
	       
       x.domain(d3.extent(data, function(d) {
             return d.date;
           }));
	       
        y.domain([
                0,
		d3.max(data, function(d) {return d.price;})
          ]);
        
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
             .attr("transform", "rotate(-90)")
             .attr("y", 10)
             .attr("dy", ".75em")
             .style("text-anchor", "end")
             .text("Closing Price (USD)");
	       
	  svg.append("path")
	      .datum(data)
              .attr("class", "line")
	      .attr("stroke","#777")
	      .attr("stroke-width","1.5px")
              .attr("d", line);
	       
	   svg.selectAll(".dot")
             .datum(data)
             .enter().append("circle")
             .attr("class", "dot")
             .attr("cx", function(d) {
                   return x(d.date); 
                 })
             .attr("cy", function(d) {
                   return y(d.price); 
                 })
             .attr("r", 5)
             .on("mouseover", function(d) {

                var displayDate = formatTime(d.date);
                var displayVal = "$"+d.price;

                $(".tt").html(
                "<div class='name'>"+displayDate+"</div>"+
                "<div class='date'>"+displayDate+": </div>"+
                "<div class='price'>"+displayVal+"</div>"
               )
               
                $(".tt").show();
               
                d3.select(this).style("opacity", 1);
            
              })
	       
       }); 
