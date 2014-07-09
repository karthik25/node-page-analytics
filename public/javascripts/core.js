$(document).ready(function(){
	$('#durations').dataTable();
});

$(function () {
	$.getJSON('/getavgtime/about', function(data){
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
	$.getJSON('/getrequestct/about', function(json){
		$('#req-container').highcharts(
			{
				chart: {
					plotBackgroundColor: null,
					plotBorderWidth: 1,//null,
					plotShadow: false
				},
				title: {
					text: 'Top 5 Pages by Requests (%)'
				},
				tooltip: {
					formatter: function() {
						return 'No.of requests for <b>'+ this.point.name +'</b>: '+ Math.round((this.percentage / json.total) * 100);
					},
					percentageDecimals: 1
				},
				plotOptions: {
					pie: {
						allowPointSelect: true,
						cursor: 'pointer',
						dataLabels: {
							enabled: true,
							format: '<b>{point.name}</b>: {point.percentage:.1f} %',
							style: {
								color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
							}
						}
					}
				},
				series: [{
					type: 'pie',
					name: 'Browser share',
					data: [
						['/',   45.0],
						['/about',       26.8],
						{
							name: '/contact',
							y: 12.8,
							sliced: true,
							selected: true
						},
						['/dashboard',    8.5],
						['/settings',     6.9]
					]
				}]
			}
		);
	});
});
