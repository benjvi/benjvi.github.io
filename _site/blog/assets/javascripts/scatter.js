nv.addGraph(function() {
  var chart = nv.models.scatterChart()
                .showDistX(true)    //showDist, when true, will display those little distribution lines on the axis.
                .showDistY(true)
                .transitionDuration(350)
                .color(d3.scale.category10().range())
				.size(1).sizeRange([200,200]);

  //Configure how the tooltip looks.
  chart.tooltipContent(function(key) {
      return '<h3>' + key + '</h3>';
  });

  //Axis settings
  chart.xAxis.tickFormat(d3.format('.0f'));
  chart.yAxis.tickFormat(d3.format('.0f'));

  //We want to show shapes other than circles.
  chart.scatter.onlyCircles(false);

  var myData = carData();
  d3.select('#chart svg')
      .datum(myData)
      .call(chart);

  nv.utils.windowResize(chart.update);

  return chart;
});

/**************************************
 * Simple test data generator
 */

function randomData(groups, points) { //# groups,# points per group
  var data = [],
      shapes = ['circle', 'cross', 'triangle-up', 'triangle-down', 'diamond', 'square'],
      random = d3.random.normal();

  for (i = 0; i < groups; i++) {
    data.push({
      key: 'Group ' + i,
      values: []
    });

    for (j = 0; j < points; j++) {
      data[i].values.push({
        x: random()
      , y: random()
      , size: Math.random()   //Configure the size of each scatter point
      , shape: (Math.random() > 0.95) ? shapes[j % 6] : "circle"  //Configure the shape of each scatter point.
      });
    }
  }

  return data;
}

function carData() {
	var data = []
	shapes = ['circle', 'triangle-up', 'diamond']
	var groups = ['Lead-Acid', 'NiMH', 'Li-Ion']
	var years = [1899,1907,1960,1996,1997,1997,1999,2008,2008,2009,2009,2010,2013,2013,2013]
	var range = [80,129,97,160,160,160,225,393,160,160,160,120,140,160,426]
	var type = ['Lead-Acid','Lead-Acid','Lead-Acid','Lead-Acid', 'NiMH', 'NiMH', 'NiMH', 'Li-Ion', 'Li-Ion', 'Li-Ion', 'Li-Ion', 'Li-Ion', 'Li-Ion', 'Li-Ion', 'Li-Ion']
	var carname = ['Baker Electric','Detroit Electric','Henney Kilowatt','GM EV1 I','Honda EV Plus',
	'RAV4 EV', 'GM EV1 II', 'Tesla Roadster', 'Th!nk', 'Mini E', 'iMiev', 'Nissan Leaf', 'Fiat 500e',
	'BMW i3','Tesla Model S']
	for (i = 0; i < groups.length; i++) {
		data.push({
			key: groups[i]
			, values: []
		});
		
	}
	
	for (i = 0; i < years.length; i++) {
		switch(type[i]) {
		case "Lead-Acid":
			data[0].values.push({
				x: years[i]
				, y: range[i]
				, size: 0.55
				, shape: "circle"
				, description: carname[i]
			});
			break;
		case "NiMH":
			data[1].values.push({
				x: years[i]
				, y: range[i]
				, size: 0.55
				, shape: "circle"
				, description: carname[i]
			});
			break;
		case "Li-Ion":
			data[2].values.push({
				x: years[i]
				, y: range[i]
				, size: 0.59
				, shape: "circle"
				, description: carname[i]
			});
			break;
		}
	}
	
	return data;
}
