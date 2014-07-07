$(document).ready(function(){
	$('#durations').dataTable();
});

$(function () {
	$.getJSON('/getjson/about', function(data){
		$('#container').highcharts({
			title: {
				text: 'Avg. time spent on /about',
				x: -20 //center
			},
			xAxis: {
				categories: data.xAxis
			},
			yAxis: {
				title: {
					text: 'Avg Time (secs)'
				},
				plotLines: [{
					value: 0,
					width: 1,
					color: '#808080'
				}]
			},
			tooltip: {
				valueSuffix: ' s'
			},
			legend: {
				layout: 'vertical',
				align: 'right',
				verticalAlign: 'middle',
				borderWidth: 0
			},
			series: data.yAxis
		});
	});
});
