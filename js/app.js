var autocomplete;
var places,map,marker = new google.maps.Marker();
var restaurants = [];
var showFlag = 0;


function toggleMap()
{
	if(showFlag){
		$('#gmap').hide();
		$('#mapToggle').text('지도 펴기');
		$('.close_arrow').attr('class','open_arrow');
		$('.map_border_on').removeClass('map_border_on');
		showFlag = 0;
	}
	else{
		$('#gmap').show();
	    $('html, body').animate({'scrollTop':$("#info").offset().top},'200');
		$('#mapToggle').text('지도 닫기');
		$('.open_arrow').attr('class','close_arrow');
		$('.map_border').addClass('map_border_on');
		showFlag = 1;
	}
}

function afterSubmit()
{
	var place = autocomplete.getPlace();
	map.panTo(place.geometry.location);
	getRestaurants();
}

$(function() {
    $('#fml').submit(function() {
        afterSubmit();
        return false;
    });
});

$("input#autocomplete").focusin(function () {
    $(document).keypress(function (e) {
        if (e.which == 13) {
            $("input#autocomplete").trigger('focus');
            $("input#autocomplete").simulate('keydown', { keyCode: $.ui.keyCode.DOWN } ).simulate('keydown', { keyCode: $.ui.keyCode.ENTER });
        }
    });
});

function getRestaurants() {
	var search = {
		bounds: map.getBounds()
	};
	search.types=["restaurant"];
	places.search(search, function (results, status) {
		console.log(status);
		if (status == google.maps.places.PlacesServiceStatus.OK) {
			for (var i = 0; i < results.length; i++) {
				restaurants[i] = results[i];
			}
		}
	});
	$('#gmap').css('display','none');
	$('.wrapper').animate({ 'top': '5%'}, 1000, function(){$('#gmap').css('top','auto');$('#info').css('visibility','visible').animate({'opacity':'100'},1000)});
	$('#fml').animate({ 'opacity': '0'}, 1000,function(){$('#fml').remove();showRestaurant()});
}

function showRestaurant()
{
	if(restaurants.length == 0)
	{
		$('.close_arrow, .open_arrow, .map_border, .footer, #mapToggle').remove();
		$('#pname').text('음식점이 이제 더 없어요! X(');
		$('#address').html('<a onclick="location.reload(true);">&lt;&lt; 다시 검색하기</a>');
		return;
	}
	var index = Math.floor(Math.random() * restaurants.length);
	$('#pname').text(restaurants[index].name);
	$('#address').text(restaurants[index].vicinity);
	marker.setMap(null);
	marker = new google.maps.Marker({
		position: restaurants[index].geometry.location,
		map: map
	});
	marker.setMap(map);
	$('html, body').scrollTop($("#info").offset().top);
	restaurants.splice(index,1);
}


$(document).ready(function() {

	var input = document.getElementById('searchbox');

	var myLatlng = new google.maps.LatLng(37.566535, 126.97796919999996);
	var myOptions = {
		zoom: 15,
		center: myLatlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById('gmap'), myOptions);

	places = new google.maps.places.PlacesService(map);
	autocomplete = new google.maps.places.Autocomplete(input);

	google.maps.event.addListener(autocomplete, 'place_changed', function () {
		afterSubmit();
	});
	
	$('.open_arrow, .close_arrow, #toggleMap').click(toggleMap);
	restaurants = [];
});