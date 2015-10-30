;(function($) {
    $.widget("d3charts.d3histogram", {
        options: {
            width: null, 
            height: null, 
            data: [],
            bins: 10,
            bottompad: 10,
            labelsize: null,
            labelGenerator: function(d, i) { return i+1+""; }
        },

        _create: function() {
            var widget = this;
            var w = this.options.width === null ? this.element.width() : this.options.width;
            var h = this.options.height === null ? this.element.height() : this.options.height;
            var ls = this.options.labelsize === null ? this.options.bottompad - 2 : this.options.labelsize;
            if ($.isFunction(this.options.data)) {
                
            }
            d3.select(this.element[0]).each(function(d, i) {
                var data = widget._optValue(widget.options.data);
                var bins = widget._optValue(widget.options.bins);
                var histogram = d3.layout.histogram().bins(bins)
                    (data);
                
                var x = d3.scale.ordinal()
                    .domain(histogram.map(function(d) { return d.x; }))
                    .rangeRoundBands([0, w]);
                 
                var y = d3.scale.linear()
                    .domain([0, d3.max(histogram, function(d) { return d.y; })])
                    .range([0, h - widget.options.bottompad]);
                
                var vis = d3.select(this).append("svg:svg")
                    .attr("class", "chart")
                    .attr("width", w)
                    .attr("height", h);
                
                vis.selectAll("rect")
                    .data(histogram)
                    .enter().append("svg:rect")
                        .attr("transform", function(d) { return "translate(" + x(d.x) + "," + (h - y(d.y) - widget.options.bottompad) + ")"; })
                        .attr("width", x.rangeBand())
                        .attr("y", function(d) { return y(d.y); })
                        .attr("height", 0)
                    .transition()
                        .duration(750)
                        .attr("y", 0)
                        .attr("height", function(d) { return y(d.y); });

                vis.append("svg:line")
                    .attr("x1", 0)
                    .attr("x2", w)
                    .attr("y1", h - widget.options.bottompad)
                    .attr("y2", h - widget.options.bottompad);

                vis.selectAll("text")
                    .data(histogram)
                    .enter().append("svg:text")
                        .attr("x", function(d, i) { return x(d.x) + x.rangeBand() / 2; })
                        .attr("y", h)
                        .attr("width", x.rangeBand())
                        .attr("text-anchor", function(d) { return "middle"; })
                        .attr("font-size", ls)
                        .text(widget.options.labelGenerator);
            });
        },

        _optValue: function(option) {
            return $.isFunction(option) ? option() : option;
        }
    });
})( jQuery );