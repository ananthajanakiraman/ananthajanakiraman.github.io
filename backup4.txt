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

            //var colorDomain = d3.keys(
            //data[0]).filter(
            //function(key) {
            //    return key !== "Date";
            //}
           //)
            
           //color.domain(colorDomain);
            
           data.forEach(function(d) {
                d.date = parseDate(d.Date);
		d.price = +d.BITCOIN;
                return d;
           });

           //var exchange = color.domain().map(function(name) {
           //             return {
           //                     name: name,
           //                     values: data.map(function(d) {
           //                     return {
           //                             date: d.date,
           //                             price: +d[name],
           //                             name : labels[name] 
           //                     };
           //                  })
           //             };
           //});

	   var maximum1 = d3.max(data, function(d) {return d.price;});
 	   var maximumObj = data.filter(function(d) {return d.price == maximum1;})[0];
	   
           x.domain(d3.extent(data, function(d) {
             return d.date;
           }));

	   console.log(maximum1,x(parseDate(maximumObj.Date)),y(maximumObj.BITCOIN));
	       
           y.domain([
                0,
           //     d3.max(exchange, function(c) {
           //       return d3.max(c.values, function(v) {
           //                               return v.price;
           //                    });
           //          })
		   d3.max(data, function(d) {return d.price;})
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
                          .data(data)
                          .enter().append("g")
                          .attr("class", "exch");  
          
          exch.append("path")
              .attr("class", "line")
              .attr("d", line)
              .style("stroke", "lightsteelblue");
         
     
         exch.selectAll(".dot")
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
             
       }); 
