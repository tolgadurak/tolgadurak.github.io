/*
Example:
	Z = x1 + 2x2 max;
	x1 + 2x2 >= 2;
	3x1 + 4x2 <= 24;
    -x1 + 2x2 <= 4;
	x1 <= 6;
*/

//settings
var custom_domain = 10;


var data = 	[];
var colors = [
]

var z = [{x1:1}, {x2:2}, {type: 'max'}];

var constEq = [{x1:1, x2: 2, type:'gte', val:2},
			   {x1:3, x2:4, type:'lte', val:24},
			   {x1:-1, x2:2, type:'lte', val:4},
			   {x1:1, x2:0 ,type:'lte', val:6}];

var firstRegionLines = [];
var secondRegionLines = [];
var thirdRegionLines = [];
var fourthRegionLines = [];

var allLines = [];

var intersectionLines = [];
var solution_points = [];

constEq.forEach(function(eq, index, arr) {
	var line;
	if(eq.x1 != 0 && eq.x2 != 0)
		line = [{x:0, y:eq.val / eq.x2}, {x: eq.val / eq.x1, y:0}];
 	else if(eq.x1 == 0 && eq.x2 != 0)
		line = [{x:0, y:eq.val / eq.x2}, {x: 0, y:eq.val / eq.x2}];
 	else if(eq.x2 == 0 && eq.x1 != 0)
  	line = [{x:eq.val / eq.x1, y:0}, {x: eq.val / eq.x1, y:0}];

	var first_pointY = line[0].y;
	var second_pointX = line[1].x;
	var slope = Math.abs(line[0].y / line[1].x);
	var l = [];
	$.extend(true, l, line);
	l.push({type: eq.type});

	if(l[0].x == 0 && l[1].x == 0) {
		if(l[0].y > 0) {
			l.push({region: 1});
			firstRegionLines.push(l);
		}
	}
	else if(l[0].y == 0 && l[1].y == 0) {
		if(l[0].x > 0) {
			l.push({region: 1});
			firstRegionLines.push(l);
		}
	}

	if((first_pointY > 0 && second_pointX > 0)) {
		l.push({region: 1});
		firstRegionLines.push(l);
		solution_points.push(l[0]);
		solution_points.push(l[1]);
	}
	else if(first_pointY > 0 && second_pointX < 0) {
		l.push({region: 2});
		secondRegionLines.push(l);
		solution_points.push(l[0]);
	}
	else if (first_pointY < 0 && second_pointX < 0) {
		l.push({region: 3});
		thirdRegionLines.push(l);
	}
	else if(first_pointY < 0 && second_pointX > 0) {
		l.push({region: 4});
		fourthRegionLines.push(l);
		solution_points.push(l[1]);
	}
	l.push({slope: slope});
	l.push({eqIndex: index});
	allLines.push(l);
	colors.push('black');
		data.push(line);

});

function scan_first_region() {
	for(i = 0; i < firstRegionLines.length; i++) {
		for(j = i + 1; j < firstRegionLines.length; j++) {
			if((firstRegionLines[i][1].x < firstRegionLines[j][1].x) && (firstRegionLines[i][4].slope > firstRegionLines[j][4].slope) && firstRegionLines[j][4].slope != 0) {
				intersectionLines.push({firstLine: firstRegionLines[i], secondLine: firstRegionLines[j]});
			}
			else if((firstRegionLines[i][1].x > firstRegionLines[j][1].x) && (firstRegionLines[i][4].slope < firstRegionLines[j][4].slope)&& firstRegionLines[i][4].slope != 0) {
				intersectionLines.push({firstLine: firstRegionLines[i], secondLine: firstRegionLines[j]});
			}
			else if((firstRegionLines[i][4].slope == 0 && firstRegionLines[j][4].slope != 0 && firstRegionLines[i][1].x < firstRegionLines[j][1].x ) || (firstRegionLines[i][4].slope != 0 && firstRegionLines[j][4].slope == 0 && firstRegionLines[i][1].x > firstRegionLines[j][1].x)) {
				intersectionLines.push({firstLine: firstRegionLines[i], secondLine: firstRegionLines[j]});
			}
		}
	}
	return;
}

function scan_second_region() {
	for(i = 0; i < secondRegionLines.length; i++) {
		for(j = i + 1; j < secondRegionLines.length; j++) {
			if((secondRegionLines[i][1].x > secondRegionLines[j][1].x) && (secondRegionLines[i][4].slope > secondRegionLines[j][4].slope)) {
				intersectionLines.push({firstLine: secondRegionLines[i], secondLine: secondRegionLines[j]});
			}
			else if((secondRegionLines[i][1].x < secondRegionLines[j][1].x) && (secondRegionLines[i][4].slope < secondRegionLines[j][4])) {
				intersectionLines.push({firstLine: secondRegionLines[i], secondLine: secondRegionLines[j]});
			}
		}
	}
	return;
}

function scan_fourth_region() {
	for(i = 0; i < fourthRegionLines.length; i++) {
		for(j = i + 1; j < fourthRegionLines.length; j++) {
			if((fourthRegionLines[i][1].x < fourthRegionLines[j][1].x) && (fourthRegionLines[i][4].slope < fourthRegionLines[j][4].slope)) {
				intersectionLines.push({firstLine: fourthRegionLines[i], secondLine: fourthRegionLines[j]});
			}
			else if((fourthRegionLines[i][1].x > fourthRegionLines[j][1].x) && (fourthRegionLines[i][4].slope > fourthRegionLines[j][4].slope)) {
				intersectionLines.push({firstLine: fourthRegionLines[i], secondLine: fourthRegionLines[j]});
			}
		}
	}
	return;
}

function scan_first_second_region() {
	for(i = 0; i < firstRegionLines.length; i++) {
		for(j = 0; j < secondRegionLines.length; j++) {
			if((firstRegionLines[i][4].slope == 0 && secondRegionLines[j][4].slope != 0) || (firstRegionLines[i][0].y > secondRegionLines[j][0].y)) {
				intersectionLines.push({firstLine: firstRegionLines[i], secondLine: secondRegionLines[j]});
			}
		}
	}
}

function scan_first_fourth_region() {
	for(i = 0; i < firstRegionLines.length; i++) {
		for(j = 0; j < fourthRegionLines.length; j++) {
			if((firstRegionLines[i][4].slope == 0 && fourthRegionLines[j][4].slope != 0) || (firstRegionLines[i][1].x > fourthRegionLines[j][1].x)) {
				intersectionLines.push({firstLine: firstRegionLines[i], secondLine: fourthRegionLines[j]});
			}
		}
	}
}

scan_first_region();
scan_second_region();
scan_fourth_region();

scan_first_second_region();
//scan_first_fourth_region();

//console.log(intersectionLines);

function line_intersect(a, b) {
var x1 = a.firstLine[0].x,
 		x2 = a.firstLine[1].x,
		x3 = a.secondLine[0].x,
		x4 = a.secondLine[1].x,
		y1 = a.firstLine[0].y,
		y2 = a.firstLine[1].y,
		y3 = a.secondLine[0].y,
		y4 = a.secondLine[1].y;

		var ua, ub, denom = Decimal.sub(Decimal.mul(Decimal.sub(y4, y3), Decimal.sub(x2, x1)), Decimal.mul(Decimal.sub(x4, x3),Decimal.sub(y2, y1)));
		if(denom == 0) {
			return null;
		}
		ua = Decimal.div(Decimal.sub(Decimal.mul(Decimal.sub(x4, x3), Decimal.sub(y1, y3)), Decimal.mul(Decimal.sub(y4, y3), Decimal.sub(x1, x3))), denom);
		ub = Decimal.div(Decimal.sub(Decimal.mul(Decimal.sub(x2, x1),Decimal.sub(y1, y3)), Decimal.mul(Decimal.sub(y2, y1),Decimal.sub(x1, x3))), denom);

		return { x: Decimal.add(x1, Decimal.mul(ua, Decimal.sub(x2, x1))).toNumber(), y: Decimal.add(y1, Decimal.mul(ua, Decimal.sub(y2, y1))).toNumber()};
}

function solve_equations(eq1, eq2) {
	var x11 = eq1.x1,
	  	x21 = eq1.x2,
			x12 = eq2.x1,
			x22 = eq2.x2,
			val1 = eq1.val,
			val2 = eq2.val;

			var b = Decimal.div(Decimal.sub(Decimal.mul(x11, val2), Decimal.mul(x12, val1)), Decimal.sub(Decimal.mul(x11, x22), Decimal.mul(x12,x21)));
			// Workaround.
			var a = Decimal.div(Decimal.sub(val1, Decimal.mul(x21, b)), x11);

			return { x: a.toNumber(), y: b.toNumber()};
}
intersectionLines.forEach(function(intersection) {
	var intersection_point = solve_equations(constEq[intersection.firstLine[5].eqIndex], constEq[intersection.secondLine[5].eqIndex]);
	//Alternative
	//var intersection_point = line_intersect(intersection);
	solution_points.push(intersection_point);

});
//console.log(solution_points);
function determine_boundaries() {
//  Number.MAX_VALUE init value for min bound, Number.MAX_VALUE init value for max bound
	var x_min_bound = Number.MAX_VALUE, y_min_bound = Number.MAX_VALUE, x_max_bound = Number.MAX_VALUE, y_max_bound = Number.MAX_VALUE;
	var lte_feature, gte_feature;
	allLines.forEach(function(line, index, arr) {
		if(line[2].type === 'lte') {
			if(line[3].region == 1) {
				if(line[0].y < y_min_bound && line[0].y != 0) {
					y_min_bound = line[0].y;
					lte_feature = -1;
				}
				if(line[1].x < x_min_bound && line[1].x != 0) {
					x_min_bound = line[1].x;
					lte_feature = -1;
				}
			}
			else if(line[3].region == 2) {
				if(line[0].y < y_min_bound && line[0].y != 0) {
					y_min_bound = line[0].y;
					lte_feature = 1;
				}
			}
			else if(line[3].region == 4) {
				if(line[1].x < x_min_bound && line[1].x != 0) {
					x_min_bound = line[1].x;
					lte_feature = 1;
				}
			}
		}
		else {
			if(line[3].region == 1) {
				if(line[0].y < y_max_bound && line[0].y != 0) {
					y_max_bound = line[0].y;
					gte_feature = 1;
				}
				if(line[1].x < x_max_bound && line[1].x != 0) {
					x_max_bound = line[1].x;
					gte_feature = 1;
				}
			}
			else if(line[3].region == 2) {
				if(line[0].y < y_max_bound && line[0].y != 0) {
					y_max_bound = line[0].y;
					gte_feature = -1;
				}
			}
			else if(line[3].region == 4) {
				if(line[1].x < x_max_bound && line[1].x != 0) {
					x_max_bound = line[1].x;
					gte_feature = -1;
				}
			}
		}
			});

return {x_min_bound: x_min_bound, y_min_bound: y_min_bound, x_max_bound:x_max_bound, y_max_bound: y_max_bound, lte_feature: lte_feature, gte_feature: gte_feature};
}

function determine_solution_data() {
	var boundaries = determine_boundaries();
	//var solution_data = [];
	solution_points.forEach(function(point, index, err) {
		//if((point.x > boundaries.x_min_bound && point.x < boundaries.x_max_bound) && (point.y )  )
		if(lte_feature == 1) {

		}
		else {

		}

	});
}

var solution_data = [];
var temp_data_x = [];
var temp_data_y = [];
solution_points.forEach(function(point, index, arr) {
	solution_data.push(point);
});
data.push(solution_data);
console.log(solution_data);


function pointAtX(a, b, pointX_x) {
	if(b.y == a.y) {
		return {x: a.x, y: pointX_x};
	}
	else if(b.x == a.x) {
		return {x: pointX_x, y: a.y};
	}
  var slope = (b.y - a.y) / (b.x - a.x);
  var pointX_y = a.y + (pointX_x - a.x) * slope;
  return {x: pointX_x, y: pointX_y};
}

//************************************************************
// Create Margins and Axis and hook our zoom function
//************************************************************
var margin = {top: 20, right: 30, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .domain([-custom_domain, custom_domain])
    .range([0, width]);

var y = d3.scale.linear()
    .domain([-custom_domain, custom_domain])
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
	.tickSize(-height)
	.tickPadding(10)
	.tickSubdivide(true)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
	.tickPadding(10)
	.tickSize(-width)
	.tickSubdivide(true)
    .orient("left");

var zoom = d3.behavior.zoom()
    .x(x)
    .y(y)
    .scaleExtent([1, 10])
    .on("zoom", zoomed);





//************************************************************
// Generate our SVG object
//************************************************************
var svg = d3.select("body").append("svg")
	.call(zoom)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
	.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

svg.append("g")
	.attr("class", "y axis")
	.append("text")
	.attr("class", "axis-label")
	.attr("transform", "rotate(-90)")
	.attr("y", (-margin.left) + 10)
	.attr("x", -height/2)
	.text('Axis Label');

svg.append("clipPath")
	.attr("id", "clip")
	.append("rect")
	.attr("width", width)
	.attr("height", height);

d3.selectAll('g.tick')
	.filter(function(d){ return d==0;} )
	.select('line')
	.attr('class', 'origin-style');
d3.selectAll('g.tick')
	.filter(function(d){ return d==0;} )
	.select('text').attr('class', 'origin-style-text');



//************************************************************
// Create D3 line object and draw data on our SVG object
//************************************************************
var line = d3.svg.line()
    .interpolate("linear")
    .x(function(d) { return x(d.x); })
    .y(function(d) { return y(d.y); });

var processedData = [];

data.forEach(function(entry) {
	var point_a = entry[0];
	var point_b = entry[1];

	var extended_a = pointAtX(point_a, point_b, -custom_domain);
	var extended_b = pointAtX(point_a, point_b, custom_domain);
	var new_line = [extended_a, extended_b];
	processedData.push(new_line);
});

svg.selectAll('.line')
	.data(processedData)
	.enter()
	.append("path")
    .attr("class", "line")
	.attr("clip-path", "url(#clip)")
	.attr('stroke', function(d,i){
		return colors[i%colors.length];
	})
    .attr("d", line);




//************************************************************
// Draw points on SVG object based on the data given
//************************************************************
var points = svg.selectAll('.dots')
	.data(data)
	.enter()
	.append("g")
    .attr("class", "dots")
	.attr("clip-path", "url(#clip)");

points.selectAll('.dot')
	.data(function(d, index){
		var a = [];
		d.forEach(function(point,i){
			if(point.x >= 0 && point.y >= 0)
			a.push({'index': index, 'point': point});
		});
		return a;
	})
	.enter()
	.append('circle')
	.attr('class','dot')
	.attr("r", 2.5)
	.attr('fill', function(d,i){
		return 'red';
	})
	.attr("transform", function(d) {
		return "translate(" + x(d.point.x) + "," + y(d.point.y) + ")"; }
	);


//************************************************************
// Zoom specific updates
//************************************************************
function zoomed() {
	svg.select(".x.axis").call(xAxis);
	svg.select(".y.axis").call(yAxis);
	svg.selectAll('path.line').attr('d', line);

	points.selectAll('circle').attr("transform", function(d) {
		return "translate(" + x(d.point.x) + "," + y(d.point.y) + ")"; }
	);

	d3.selectAll('g.tick')
	.filter(function(d){ return d==0;} )
	.select('line')
	.attr('class', 'origin-style');

	d3.selectAll('g.tick')
	.filter(function(d){ return d==0;} )
	.select('text').attr('class', 'origin-style-text');
	svg.select(".x.axis").call(xAxis);
	svg.select(".y.axis").call(yAxis);
	svg.selectAll('path.line').attr('d', line);
}
