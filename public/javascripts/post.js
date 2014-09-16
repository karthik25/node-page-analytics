$(document).ready(function(){
	
});

$(window).on('beforeunload', function(){
	console.log('reporting time spent ' + $('#secresult').val());
	$.ajax({
        type: 'POST',
        url: '/page-analytics/record',
        async: false,
		dataType: 'json',
		data: { 'url': window.location.pathname, 'seconds': $('#secresult').val() },
        success: function (data) {
			
        }
    });
});

var durationWorker = new Worker('/javascripts/timer.js');

durationWorker.onmessage = function (event) {
	$('#secresult').val(event.data);
	$('#result').html(getTimeSpent(event.data));
};

function getTimeSpent(sec) {
    if (sec < 60) {
        return sec + " seconds";
    }

    var mins = Math.floor(sec / 60);
    var secs = sec % 60;
    return mins + " minutes " + secs + " seconds";
}
