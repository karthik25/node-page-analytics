var options = {
			title: {
				text: '',
				x: -20 //center
			},
			xAxis: {
				categories: null
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
			series: null
		};

var req_options = {
	chart: {
            type: 'column',
            margin: 75,
            options3d: {
                enabled: true,
                alpha: 15,
                beta: 15,
                depth: 50,
                viewDistance: 25
            }
        },
		xAxis: {
				categories: null
			},
        title: {
            text: 'Chart rotation demo'
        },
        plotOptions: {
            column: {
                depth: 25
            }
        },
        series: [{
            name: '',
			data: null
        }]
   };

function loadChart(url, divs){
	$.ajax({
	  type: "POST",
	  url: '/page-analytics/getavgtime',
	  data: { 'url': url },
	  success: function(data){
		var home_chart_options = options;
		home_chart_options.title.text = 'Avg. time spent on ' + url;
		home_chart_options.xAxis.categories = data.xAxis;
		home_chart_options.series = data.yAxis;
		$.each(divs, function(index, value){
			$(value).highcharts(home_chart_options);
		});
	  },
	  dataType: 'json'
	});
}

function loadRequestChart(url){	
	$.ajax({
	  type: "POST",
	  url: '/page-analytics/getrequests',
	  data: { 'url': url },
	  success: function(data){
		var req_chart_options = req_options;
		req_chart_options.title.text = 'No. of Requests for ' + url;
		req_chart_options.xAxis.categories = data.xAxis;
		req_chart_options.series[0].name = url;
		req_chart_options.series[0].data = data.yAxis;
		$('#req_container').highcharts(req_chart_options);		  
	  },
	  dataType: 'json'
	});
}

$(document).ready(function(){
	$('#reqs').dataTable();
	$('#durations').dataTable();

	$('#durations tbody').on( 'click', 'tr', function () {
		var anchor = $(this).find('td:eq(0) > a');
		var url = $(anchor).attr('href');
        if ($('#pg_selector').val() === url)
        {
			return;
        }

		loadChart(url, ['#avg_container']);
		$('#pg_selector').val(url);
    } );

	$('#reqs tbody').on( 'click', 'tr', function () {
		var anchor = $(this).find('td:eq(0) > a');
		var url = $(anchor).attr('href');		

		loadRequestChart(url);
    } );

	$('#pg_selector').on('change', function(){
		var val = $(this).val();
		loadChart(val, ['#avg_container']);
	});
});

$(function () {
	$.ajax({
	  type: "POST",
	  url: '/page-analytics/getavgtime',
	  data: { 'url': '/' },
	  success: function(data){
		var home_chart_options = options;
		home_chart_options.title.text = 'Avg. time spent on /';
		home_chart_options.xAxis.categories = data.xAxis;
		home_chart_options.series = data.yAxis;
		$('#container').highcharts(home_chart_options);
		$('#avg_container').highcharts(home_chart_options);		  
	  },
	  dataType: 'json'
	});

	loadRequestChart('/');

	$.getJSON('/page-analytics/getrequestct', function(json){
		$('#req-container').highcharts(
			{
				chart: {
					plotBackgroundColor: null,
					plotBorderWidth: null,
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
					data: json.piedata
				}]
			}
		);
	});
});
