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
        
       var parseDate = d3.time.format("%Y-%m-%d").parse;
       var formatTime = d3.time.format("%e %B");

       var x = d3.time.scale()
                 .range([0, width]);

       var y = d3.scale.linear()
                 .range([height, 0]);
        
       //Color exists as a Scale. 
       var color = d3.scale.category10();

       var xAxis = d3.svg.axis()
                     .scale(x)
                     .orient("bottom");

       var yAxis = d3.svg.axis()
                     .scale(y)
                     .orient("left");
       
       var line = d3.svg.line()
                    .interpolate("basis")
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

           x.domain(d3.extent(data, function(d) {
             return d.date;
           }));

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
       }); 
