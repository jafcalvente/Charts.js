
var datos1 = '{"titleGraph":null,"coordinateList":[{"coordX":"LUN","coordY":"234330"},{"coordX":"MAR","coordY":"266963"},{"coordX":"MIE","coordY":"195179"},{"coordX":"JUE","coordY":"181677"},{"coordX":"VIE","coordY":"41669"},{"coordX":"SAB","coordY":"1043"},{"coordX":"DOM","coordY":"562"}],"associatedGraphics":null}'

var datos2 = '{"titleGraph":null,"coordinateList":[{"coordX":"LUN","coordY":"33230"},{"coordX":"MAR","coordY":"48840"},{"coordX":"MIE","coordY":"29753"},{"coordX":"JUE","coordY":"21541"},{"coordX":"VIE","coordY":"3889"},{"coordX":"SAB","coordY":"46"},{"coordX":"DOM","coordY":"0"}],"associatedGraphics":null}'

/**
 * Return the max value of an array of numbers.
 */
var getMaxOfArray = function (numArray) {
	return Math.max.apply(null, numArray);
}

/**
 * Calculate the factor of multiplicity between number of shots and duration of sessions.
 */
var calcutateFactor = function(shots, durations) {
	var shoot = getMaxOfArray(shots);
	var duration = getMaxOfArray(durations);
	return shoot/duration;
}

/**
 * Adding function 'toHMM' to the prototype of String in order to get times in 'H:MM' format.
 */
String.prototype.toHMM = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (minutes < 10) {minutes = "0"+minutes;}
    var time = hours + ':' + minutes;
    return time;
}

var stepRounded = function(total) {
	var factor = 1;
	while (total > 10) {
		total = Math.ceil(total/10);
		factor *= 10;
	}
	return total * factor;
}

/**
 * Original bar chart.
 */
var originalChart = function(infoDuration, infoShots, chartId) {

	var labels = new Array();
	var dataShots = new Array();
	var dataDuration = new Array();
	if (infoShots.coordinateList != null && infoShots.coordinateList.length > 0) {
		
		for (var i = 0; i < infoShots.coordinateList.length; i++) {
			labels[i] = infoShots.coordinateList[i].coordX;
			if (infoShots.coordinateList[i].coordY != '0') {
				dataShots[i] = infoShots.coordinateList[i].coordY;
			} else {
				dataShots[i] = null;
			}

			if (infoDuration.coordinateList[i].coordY != '0') {
				dataDuration[i] = infoDuration.coordinateList[i].coordY;
			} else {
				dataDuration[i] = null;
			}
		}
	}
	
	// Getting context and setting size
	var ctx = $(chartId).get(0).getContext('2d');
	ctx.canvas.width = 565;
	ctx.canvas.height = 430;
	ctx.canvas.style['padding-left'] = '1%';
	
	var chartInfo = {
			labels: labels,
			datasets: [
				{
					label: 1,
					fillColor: "#1b79b8",
					strokeColor: "#1b79b8",
					pointColor: "#1b79b8",
					pointStrokeColor: "#fff",
					data: dataDuration
				},
				{
					label: 2,
					fillColor: "#5d90c7",
					strokeColor: "#5d90c7",
					pointColor: "#5d90c7",
					pointStrokeColor: "#fff",
					data: dataShots
				}	
			]
		};
	
	// Setting options
	var options = {
		    // String - Colour of the scale line
		    scaleLineColor: "rgb(145, 146, 140)",
		    
		    // Boolean - Whether grid lines are shown across the chart
		    scaleShowGridLines : true,

		    // Number - Pixel width of the scale line
		    scaleLineWidth: 2,
		    
		    // Boolean - Whether to show labels on the scale
		    scaleShowLabels: true,

		    // Boolean - Whether to show vertical lines (except Y axis)
		    scaleShowVerticalLines: false,

			//Boolean - Whether to show Y axis
			showYAxis: true,

		    // String - Colour of the grid lines
		    scaleGridLineColor : "rgba(145, 146, 140, 0.4)",

		    // Number - Width of the grid lines
		    scaleGridLineWidth : 2,

		    // Number - Spacing between data sets within X values
		    barDatasetSpacing : 1,
		};

	// Creating chart
	new Chart(ctx).Bar(chartInfo, options);
	console.log('Created chart ' + chartId);
};

/**
 * Enhaced bar chart.
 */
var enhacedChart = function(infoDuration, infoShots, chartId) {

	var labels = new Array();
	var dataShots = new Array();
	var dataDuration = new Array();
	if (infoShots.coordinateList != null && infoShots.coordinateList.length > 0) {
		
		for (var i = 0; i < infoShots.coordinateList.length; i++) {
			labels[i] = infoShots.coordinateList[i].coordX;
			if (infoShots.coordinateList[i].coordY != '0') {
				dataShots[i] = infoShots.coordinateList[i].coordY;
			} else {
				dataShots[i] = null;
			}

			if (infoDuration.coordinateList[i].coordY != '0') {
				dataDuration[i] = infoDuration.coordinateList[i].coordY;
			} else {
				dataDuration[i] = null;
			}
		}
	}
	
	var factor = calcutateFactor(dataShots, dataDuration);
	dataDuration = dataDuration.map(function(data) { 
		return (data == null || data == 0) ? null : data * factor;
	});
	
	// Getting context and setting size
	var ctx = $(chartId).get(0).getContext('2d');
	ctx.canvas.width = 565;
	ctx.canvas.height = 430;
	ctx.canvas.style['padding-left'] = '1%';
	
	var chartInfo = {
			labels: labels,
			datasets: [
				{
					label: 1,
					fillColor: "#1b79b8",
					strokeColor: "#1b79b8",
					pointColor: "#1b79b8",
					pointStrokeColor: "#fff",
					data: dataDuration
				},
				{
					label: 2,
					fillColor: "#5d90c7",
					strokeColor: "#5d90c7",
					pointColor: "#5d90c7",
					pointStrokeColor: "#fff",
					data: dataShots
				}	
			]
		};

	// Round number up to the next multiple of the step number
	var steps = 5;
	var maxShoot = getMaxOfArray(dataShots);
	var maxDuration = getMaxOfArray(dataDuration);
	var maxPerSteps = Math.ceil(maxShoot/steps);
	
	var sr = stepRounded(maxPerSteps);
	var roundedStep = Math.ceil(maxPerSteps/sr) * sr;
	
	// Setting options
	var options = {
		    // String - Colour of the scale line
		    scaleLineColor: "rgb(145, 146, 140)",
		    
		    // Boolean - Whether grid lines are shown across the chart
		    scaleShowGridLines : true,

		    // Number - Pixel width of the scale line
		    scaleLineWidth: 2,
		    
		    // Boolean - Whether to show labels on the scale
		    scaleShowLabels: true,

		    // Boolean - Whether to show vertical lines (except Y axis)
		    scaleShowVerticalLines: false,

			//Boolean - Whether to show Y axis
			showYAxis: true,

			//Boolean - Whether to show a second Y axis
			showSecondYAxis: true,

		    // String - Colour of the grid lines
		    scaleGridLineColor : "rgba(145, 146, 140, 0.4)",

		    // Number - Width of the grid lines
		    scaleGridLineWidth : 2,

		    // Number - Spacing between data sets within X values
		    barDatasetSpacing : 1,
		    
		    // Show a determined number of steps
		    scaleOverride: true,
		    scaleSteps: steps,
		    scaleStepWidth: roundedStep,
		    scaleStartValue: 0,
			
			// Setting labels
		    showTooltips: false,
		    scaleLabel: function(label, side) {
        		var value;
				if (side == 'left') {
					value = ""+ (label.value * (maxDuration / factor) / maxShoot);
					value = value.toHMM();
				} else {
					value = label.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
				}
				return value;
	    	},
		    onAnimationComplete: function () {
		        var ctx = this.chart.ctx;
		        ctx.font = this.scale.font;
		        //ctx.fillStyle = this.scale.textColor;
		        ctx.fillStyle = '#000000';
		        ctx.textAlign = "center";
		        ctx.textBaseline = "bottom";
		        this.datasets.forEach(function (dataset) {
		            dataset.bars.forEach(function (bar) {
		            	if (bar.value !== null) {
		            		var value;
		    				if (dataset.label == 1) {
		    					value = ""+ (bar.value * (maxDuration / factor) / maxShoot);
		    					value = value.toHMM();
		    				} else {
		    					value = bar.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
		    				}

		    				var size = ctx.measureText(value);
		    			    ctx.save();
		    			    var tx = bar.x + 7;
		    			    var ty = bar.y - 3;
			                ctx.translate(tx,ty);
			                ctx.rotate(-Math.PI / 2);
			                ctx.translate(-tx,-ty);
			                ctx.textAlign = "left";
			                ctx.fillText(value, tx, ty);
			                ctx.restore();
		            	}
		            });
		        })
		    }
		};

	// Creating chart
	new ChartEnhaced(ctx).Bar(chartInfo, options);
	console.log('Created chart ' + chartId);
};

$(function() {
	originalChart(JSON.parse(datos1), JSON.parse(datos2), $('#chart1'));
	enhacedChart(JSON.parse(datos1), JSON.parse(datos2), $('#chart2'));
});