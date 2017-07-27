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

            var colorDomain = d3.keys(
            data[0]).filter(
            function(key) {
                return key !== "Date";
            }
           )
            
           color.domain(colorDomain);
            
           data.forEach(function(d) {
                d.date = parseDate(d.Date);
                return d;
           });

           var exchange = color.domain().map(function(name) {
                        return {
                                name: name,
                                values: data.map(function(d) {
                                return {
                                        date: d.date,
                                        price: +d[name],
                                        name : labels[name] 
                                };
                             })
                        };
           });

	   var maximum1 = d3.max(exchange, function(c) { return d3.max(c.values, function(v) {return v.price;})});
 	   //var maximum = data.filter(e=>e[name]===maximum1)[0];
	   
           x.domain(d3.extent(data, function(d) {
             return d.date;
           }));

	   console.log(maximum1,data.filter(function(d) {return d.BITCOIN;}));
	       
           y.domain([
                0,
                d3.max(exchange, function(c) {
                  return d3.max(c.values, function(v) {
                                          return v.price;
                               });
                     })
          ]);
          
           
          svg.append("g")
             .attr("class", "x axis")
             .attr("transform", "translate(0," + height + ")")
             .call(xAxis);
           
          svg.append("g")
             .attr("transform", "translate(0,0)")
             .attr("class", "y axis")
             .call(yAxis)
             .append("text")
             .attr("transform", "rotate(-90)")
             .attr("y", 6)
             .attr("dy", ".75em")
             .style("text-anchor", "end")
             .text("Closing Price (USD)");
           
          var exch = svg.selectAll(".exch")
                          .data(exchange)
                          .enter().append("g")
                          .attr("class", "exch");  
          
          exch.append("path")
              .attr("class", "line")
              .attr("d", function(d) {
                   return line(d.values);
               })
              .style("stroke", function(d) {
                   return color(d.name);
               });
         
     
         exch.selectAll(".dot")
             .data(function(d) {
                  return d.values;
             })
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
                "<div class='name'>"+d.name+"</div>"+
                "<div class='date'>"+displayDate+": </div>"+
                "<div class='price'>"+displayVal+"</div>"
               )
               
                $(".tt").show();
               
                d3.select(this).style("opacity", 1);
            
              })
             
             .on("mousemove", function(d) {

               var xPos = d3.mouse(this)[0] + margin.left + 10;
               var yPos = d3.mouse(this)[1] + margin.top + 10;

               $(".tt").css({
                  "left": xPos + "px",
                  "top": yPos + "px"
               })

             })
             
             .on("mouseout", function(d) {
                d3.select(this).style("opacity", 0);
                $(".tt").hide();
             })
	       
             const thisAnno = [{
		note: {
			label:"test",
			title:"test",
			wrap:150,
			align:"middle",
			},
			connector:{
				end:"arrow"
			},
			x:200,
			y:300,
			dx:30,
			dy:-30

		}];

	        const type = d3.annotationLabel
		
		const makeThis = d3.annotation()
			.type(type)
			.annotations(thisAnno)
			.editMode(true)

		svg.append("g")
			.attr("transform","translate("+margin.left+","+margin.top+")")
			.attr("class","annotation-group")
			.call(makeThis)
             
       }); 
