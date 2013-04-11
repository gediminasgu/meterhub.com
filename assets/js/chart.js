var mh = {};
mh.chart = function () {
	this.managementApiUrl = '';
	this.dataWarehouseApiUrl = '';
    this.feedId = 1;

    this.dstypes = null;
    this.data = null;
    this.queryString = null;
    this.def;
    this.chartInitialization = true;
    this.valueMinDate = null;
    this.valueMaxDate = null;
    this.hoverLineGroup;
    this.hoverLine;
    this.hoverLineXOffset;
    this.hoverLineYOffset;
    this.width;
    this.height;
    this.x;
    this.dimension;

    this.dateFormat = function (e) {
        switch (this.dimension) {
            case '':
                return d3.time.format('%Y-%m-%d %H:%M:%S')(e);
            case 'hour':
                return d3.time.format('%Y-%m-%d %H:%M:%S')(e);
            default:
                return d3.time.format('%Y-%m-%d')(e);
        }
    };


    this.remoteInit = function(options)
    {
    	this.managementApiUrl = options.managementApiUrl;
    	this.dataWarehouseApiUrl = options.dataWarehouseApiUrl;
    	
    	var self = this;
    	$.get(
    			this.managementApiUrl + "/chart/" + options.chartId,
    			function (settings)
    			{
    				settings.container = options.container;
    				settings.tooltip = options.tooltip;
    				settings.managementApiUrl = options.managementApiUrl;
    				settings.dataWarehouseApiUrl = options.dataWarehouseApiUrl;

    				settings.metrics.splice(13, 13);
    				self.init(settings);
    			},
                'jsonp');
    }
    
    this.init = function(options){
        this.def = options;  
        
        this.id = ("" + Math.random()).substr(2);
        this.legendId = "legend" + this.id;
        this.containerId = "chart" + this.id;
        this.sliderId = "slider" + this.id;
        this.dimension = this.getValue(this.def.query.dimension, '');
        var html = '<div id="chartContainer' + this.id + '" class="chart-container">';

        if (this.def.title != undefined && this.def.title != null && this.def.title.length > 0)
            html += '<h4>' + this.def.title + '</h4>';

        html += '<div id="' + this.legendId + '">&nbsp;</div>'
            + '<div id="' + this.containerId + '" class="chart"><img src="/assets/img/loader-bar.gif" width="220" height="19" /><svg></svg></div>'
            + '<div class="slider"><div id="' + this.sliderId + '"></div></div></div>';

        $('#' + this.def.container).append(html);

        this.legend = $('#' + this.legendId);
        this.container = $('#' + this.containerId);
        this.slider = $('#' + this.sliderId);

    	this.managementApiUrl = options.managementApiUrl;
    	this.dataWarehouseApiUrl = options.dataWarehouseApiUrl;
    	if (typeof(options.fid) != 'undefined')
    		this.feedId = options.fid;

    	this.slider.dateRangeSlider({
    	    valueLabels: "change",
    	    durationOut: 1000, arrows: false
    	});

    	var self = this;
    	this.slider.bind("valuesChanged", function (e, data) {
    	    var newDates = self.slider.dateRangeSlider('values');
    	    self.changeDates(newDates.min, newDates.max);
    	});

        this.loadData();
    };
    
    this.loadData = function(){
        var self = this;
        var newQueryString = this.formatQueryString();

        if (this.queryString != newQueryString || this.data == null){
            this.queryString = newQueryString;
                $.get(
                this.getDataUrl(), 
                this.queryString,
                    function (data) {
                        if (data['status'] == 'ok') {
                            self.data = data;
                            self.drawChart();
                        }
                    },
                    'jsonp'
                );
        }
        else {
            this.drawChart();
        }
    };

    this.formatQueryString = function () {
        var newQueryString = '';

        var dim = this.getValue(this.def.query.dimension, null);
        if (dim != null) newQueryString += '&dims=' + dim;

        var duration = this.getValue(this.def.query.duration, null);
        if (duration != null) newQueryString += '&duration=' + duration;

        var start = this.getValue(this.def.query.start, null);
        if (start != null) newQueryString += '&start=' + start;

        var end = this.getValue(this.def.query.end, null);
        if (end != null) newQueryString += '&end=' + end;

        var s = '';
        for (var i = 0; i < this.def.series.length; i++) {
            if (s.length > 0) s += ',';
            s += this.def.series[i].code;
        }
        newQueryString += '&metrics=' + s;
        return newQueryString;
    }

    this.changeDates = function (minDate, maxDate) {

        if (this.valueMinDate == null || this.valueMaxDate == null)
            return;

        if (this.valueMinDate.getTime() != minDate.getTime() || this.valueMaxDate.getTime() != maxDate.getTime()) {

            d3.time.format('%Y-%m-%dT%H:%M:%SZ')(minDate);

            this.def.query.start = this.formatDate(minDate);
            this.def.query.end = this.formatDate(maxDate);
            this.def.query.duration = null;
            this.loadData();
        }
    }

    this.formatDate = function (date) {
        return d3.time.format('%Y-%m-%dT%H:%M:%SZ')(date);
    }
    
    this.getDataUrl = function() {
    	return this.dataWarehouseApiUrl + '/feed/' + this.feedId;
    };

    this.getDimTimeInterval = function () {
        switch (this.dimension) {
            case '':
                return 1000;
            case 'hour':
                return 3600000;
            default:
                return 24 * 3600000;
        }
    }
    
    this.drawChart = function () {
        var self = this;
        var data = self.data.table;

        var margin = { top: 20, right: 40, bottom: 30, left: 40 };
        this.width = this.container.width() - margin.left - margin.right,
        this.height = this.container.height() - margin.top - margin.bottom;

        this.hoverLineXOffset = margin.left + this.container.offset().left;
        this.hoverLineYOffset = margin.top + this.container.offset().top;
        this.fillSeries();

        var x = d3.time.scale().range([0, this.width]);
        this.x = x;
        var y = this.getYScale();

        var xAxis = d3.svg.axis()
            .scale(x)
            .tickSize(-this.height).tickSubdivide(true)
            .orient("bottom");

        var yAxis = this.getYAxis(y);

        this.container.mouseleave(function (event) {
            self.handleMouseOutGraph(event);
        })

        this.container.mousemove(function (event) {
            self.handleMouseOverGraph(event);
        })

        this.container.html('<svg></svg>');
        var svg = d3.select("#" + this.containerId + " svg")
            .attr("width", this.width + margin.left + margin.right)
            .attr("height", this.height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var dateExt = d3.extent(data.rows, function (d) { return new Date(d.c[0].v); });
            x.domain([dateExt[0], new Date(dateExt[1].getTime())]);
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + this.height + ")")
                .call(xAxis);

            for (var a = 0; a < this.def.yaxis.length; a++) {
                var ya = this.def.yaxis[a];

                var min = this.getValue(ya.min, null);
                if (min == null) min = this.getMinMax(a, Math.min);

                var max = this.getValue(ya.max, null);
                if (max == null) max = this.getMinMax(a, Math.max);

                y[a].domain([min, max]);
                var visible = this.getValue(ya.visible, true);
                if (visible) this.drawYAxis(svg, yAxis[a], ya);
            }

            var w = this.width / ((dateExt[1].getTime() - dateExt[0].getTime()) / this.getDimTimeInterval()) * 0.9;
            if (w < 1) w = 1;

        for (var a = 0; a < this.def.series.length; a++) {
            var serie = this.def.series[a];
            var yy = y[serie.yaxis];

            if (serie.type == 'bar') this.drawBar(svg, x, yy, w, data.rows, a + 1, serie);
            else if (serie.type == 'area') this.drawArea(svg, x, yy, w, data.rows, a + 1, serie);
            else this.drawLine(svg, x, yy, w, data.rows, a + 1, serie);
        }

        this.prepareLegend();

        // add a 'hover' line that we'll show as a user moves their mouse (or finger)
        // so we can use it to show detailed values of each line
        this.hoverLineGroup = svg.append("g")
							.attr("class", "hover-line");

        // add the line to the group
        this.hoverLine = this.hoverLineGroup
			.append("line")
				.attr("x1", 10).attr("x2", 10) // vertical line so same value on each
				.attr("y1", 0).attr("y2", this.height) // top to bottom	

        // hide it by default
        this.hoverLine.classed("hide", true);

        if (self.chartInitialization) {
            var minDate = dateExt[0].getTime();
            var maxDate = dateExt[1].getTime();
            this.slider.dateRangeSlider('bounds', new Date(minDate - (300 * 24 * 3600000)), new Date(Math.max(maxDate, new Date().getTime())));

            self.valueMinDate = new Date(minDate)
            self.valueMaxDate = new Date(maxDate);
            this.slider.dateRangeSlider('values', self.valueMinDate, self.valueMaxDate);
        }

        self.chartInitialization = false;
    }

    this.drawYAxis = function (svg, yAxis, ya) {
        var isRight = ya.align == 'right';
        var ax = svg.append("g")
            .attr("class", "y axis");

        if (isRight)
            ax.attr("transform", "translate(" + this.width + ",0)");

        ax.call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)" + (isRight ? ", translate(0, -20)" : ""))
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(ya.title);
    }

    this.drawBar = function (svg, x, y, w, rows, col, serie) {
        var self = this;
        var bar = svg.selectAll(".bar")
          .data(rows)
          .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function (d) { d.x = x(d.c[0].v) - w / 2; return d.x < 0 ? 0 : d.x; })
          .attr("width", function (d) { return d.x < 0 || d.x + w > self.width ? w/2 : w; })
          .attr("y", function (d) { return y(d.c[col].v); })
          .attr("height", function (d) { return self.height - y(d.c[col].v); })
          .style("fill", function (d) { return serie.color; });
        this.applyStyleAttributes(bar, serie.style);
    }

    this.drawLine = function (svg, x, y, w, rows, col, serie) {
        var self = this;
        var line = d3.svg.line()
            .x(function (d) { return self.getXCoord(x, d.c[0].v); })
            .y(function (d) { return self.getYCoord(y, d.c[col].v); });

        var l = svg.append("path")
              .datum(rows)
              .attr("class", "line")
              .attr("d", line)
              .style("stroke", function (d) { return serie.color; });
        this.applyStyleAttributes(l, serie.style);
    }

    this.drawArea = function (svg, x, y, w, rows, col, serie) {
        var self = this;
        var area = d3.svg.area()
            .x(function (d) { return self.getXCoord(x, d.c[0].v); })
            .y0(this.height)
            .y1(function (d) { return self.getYCoord(y, d.c[col].v); });

        var l = svg.append("path")
              .datum(rows)
              .attr("class", "area")
              .attr("d", area)
              .style("stroke", function (d) { return serie.color; });
        this.applyStyleAttributes(l, serie.style);
    }

    this.getXCoord = function (x, v) {
        return v != null ? x(v) : null;
    }

    this.getYCoord = function (y, v) {
        return v != null ? y(v) : y(0);
    }

    this.prepareLegend = function () {
        var html = '<span class="legend-date"></span>';
        for (var a = 0; a < this.def.series.length; a++) {
            var serie = this.def.series[a];
            html += ' <span style="font-weight: bold; color:' + serie.color + '">' + serie.title + ': <span class="legend-series-' + a + '"></span></span>;';
        }

        this.legend.html(html);
    }

    /**
	 * Called when a user mouses over the graph.
	 */
    this.lastDate = null;
    this.handleMouseOverGraph = function (event) {
        var mouseX = event.pageX - this.hoverLineXOffset;
        var mouseY = event.pageY - this.hoverLineYOffset;

        //debug("MouseOver graph [" + containerId + "] => x: " + mouseX + " y: " + mouseY + "  height: " + h + " event.clientY: " + event.clientY + " offsetY: " + event.offsetY + " pageY: " + event.pageY + " hoverLineYOffset: " + hoverLineYOffset)
        if (mouseX >= 0 && mouseX <= this.width && mouseY >= 0 && mouseY <= this.height) {
            var row = this.getValueForPositionXFromData(mouseX);
            var date = row[0].v;

            if (date != this.lastDate) {
                // show the hover line
                this.hoverLine.classed("hide", false);

                // set position of hoverLine
                this.hoverLine.attr("x1", mouseX).attr("x2", mouseX);

                if (row != null) {
                    this.legend.find('.legend-date').text(this.dateFormat(new Date(row[0].v)));
                    for (var a = 0; a<this.def.series.length; a++) {
                        var serie = this.def.series[a];
                        this.legend.find('.legend-series-' + a).text(row[a + 1].v);
                    }
                }
                this.lastDate = date;
            }
        } else {
            this.handleMouseOutGraph(event)
        }
    }

    this.getValueForPositionXFromData = function (xPosition) {
        // get the date on x-axis for the current location
        var xValue = this.x.invert(xPosition);

        var val = xValue.getTime();
        for (var a = 0; a < this.data.table.rows.length; a++) {
            var row = this.data.table.rows[a];
            if (row.c[0].v > val)
                return this.data.table.rows[a - 1].c;
        }

        return this.data.table.rows[this.data.table.rows.length-1].c;
    }

    this.handleMouseOutGraph = function (event) {
        this.hoverLine.classed("hide", true);
    }

    this.setColors = function () {
        var color = d3.scale.category10();
        color.domain([0, 1, 2, 3, 4, 5, 6, 7, 8 ,9]);

        for (var a = 0; a < this.def.series.length; a++) {
            var serie = this.def.series[a];
            serie.color = this.getValue(serie.color, color(a));
        }
    }

    this.fillSeries = function() {
        for (var a = 1; a < this.data.table.cols.length; a++) {
            var series = this.def.series[a - 1];
            series.title = this.getValue(series.title, this.data.table.cols[a].label);
            series.yaxis = this.getValue(series.yaxis, 0);
        }
        this.setColors();
    }

    this.getYScale = function () {
        var y = [];
        for (var a = 0; a < this.def.yaxis.length; a++)
            y.push(d3.scale.linear().range([this.height, 0]));
        return y;
    }

    this.getYAxis = function (y) {
        var yAxis = [];

        for (var a = 0; a < this.def.yaxis.length; a++) {
            var ya = this.def.yaxis[a];

            var align = 'left';
            if (ya.align != undefined && ya.align != null)
                align = ya.align;

            var format = "f";
            if (ya.format != undefined && ya.format != null)
                format = ya.format;

            yAxis.push(d3.svg.axis()
                        .scale(y[a])
                        .orient(align)
                        .tickFormat(d3.format(format)));
        }
        return yAxis;
    }

    this.getValue = function (value, defaultValue) {
        if (value != undefined && value != null)
            return value;
        return defaultValue;
    }

    this.getMinMax = function (yAxisNo, compareFunc) {
        var val = null;
        for (var r = 0; r < this.data.table.rows.length; r++) {
            var row = this.data.table.rows[r];
            for (var b = 1; b < row.c.length; b++) {
                var v = row.c[b].v;
                if (v != null) {
                    var serie = this.def.series[b - 1];
                    if (serie.yaxis == yAxisNo) {
                        if (val == null)
                            val = v;
                        else
                            val = compareFunc(val, v);
                    }
                }
            }
        }
        return val;
    }

    this.applyStyleAttributes = function (obj, style) {

        if (style == undefined || style == null)
            return;

        for (var s in style) {
            obj.style(s, style[s]);
        }
    }

}