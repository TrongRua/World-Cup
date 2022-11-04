var hideDropdown = null;
$(document).ready(function () {
    if($('#slide-news').length){
        $('#slide-news').slick({
            slidesToShow: 3,
            dots: false,
            speed: 500
        })
    }
    $('.dropdown-menu').hover(function () {
        clearTimeout(hideDropdown)
        $('.dropdown-menu').show()
    }, function () {
        clearTimeout(hideDropdown)
        hideDropdown = setTimeout(function () {
            $('.dropdown-menu').hide()
        }, 300)
    })
    // $('.dropdown-menu').hover(function () {
    //     clearTimeout(hideDropdown)
    //     $('.dropdown-menu').slideDown()
    // }, function () {
    //     clearTimeout(hideDropdown)
    //     hideDropdown = setTimeout(function () {
    //         $('.dropdown-menu').slideUp()
    //     }, 300)
    // });
    $('.show-dropdown').hover(function () {
        clearTimeout(hideDropdown)
        $('.dropdown-menu').show()
        let id = $(this).data('id');
        $('.dropdown-menu > ul').removeClass('dropdown-active');
        $('.dropdown-' + id).addClass('dropdown-active');
    }, function () {
        clearTimeout(hideDropdown)
        hideDropdown = setTimeout(function () {
            $('.dropdown-menu').hide();
        }, 300)
    });
    if($('.variable-width').length){
        $('.variable-width').slick({
            dots: false,
            infinite: false,
            speed: 500,
            swipe: true,
            centerMode: false,
            variableWidth: true,
            swipeToSlide: true,
            arrows: false,
        });
    }
    if($('.slide-stoires').length){
        $('.slide-stoires').slick({
            dots: true,
            //infinite: false,
            speed: 500,
            swipe: true,
            centerMode: false,
            variableWidth: true,
            swipeToSlide: true,
            arrows: false,
        });
    }

    if($('iframe.auto-wh').length){
        $('iframe.auto-wh').each(function(){
            var width = $(this).width();
            var attrWidth = $(this).attr('width');
            var attrHeight = $(this).attr('height');
            if( !isNaN(attrWidth) && !isNaN(attrHeight)){
                $(this).height((width * (attrHeight/attrWidth)));
            }
        });
    }

    $('#modalThethao .close').click(function(){
        $('#modalThethao').hide();
    });
    $('#open-model-tt').click(function(){
        $('#modalThethao').show();
        $('#modalThethao iframe').attr('src', $(this).data('url'));
    });

    if($('.scroll.auto-height').length){
        $('.scroll.auto-height').each(function(){
            var hParent = $(this).parent().height();
            if($(this).next().length){
                hParent = hParent - $(this).next().height();
            }
            if($(this).prev().length){
                hParent = hParent - $(this).prev().height();
            }
            if( !isNaN(hParent)){
                $(this).height(hParent-20);
            }
        });
    }

    loadCustomSelect();
    if($('.icon-menu-bar').length){
        $('.icon-menu-bar').click(function(){
            $(this).toggleClass('active');
            $(this).next('.cate-bars .menu-cate-bar').toggle();
        });
        }
    
});

document.addEventListener("DOMContentLoaded", function() {
    var lazyloadImages;

    if ("IntersectionObserver" in window) {
        lazyloadImages = document.querySelectorAll(".lazy");
        var imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    var image = entry.target;
                    image.src = image.dataset.src;
                    image.classList.remove("lazy");
                    imageObserver.unobserve(image);
                }
            });
        });

        lazyloadImages.forEach(function(image) {
            imageObserver.observe(image);
        });
    } else {
        var lazyloadThrottleTimeout;
        lazyloadImages = document.querySelectorAll(".lazy");

        function lazyload () {
            if(lazyloadThrottleTimeout) {
                clearTimeout(lazyloadThrottleTimeout);
            }

            lazyloadThrottleTimeout = setTimeout(function() {
                var scrollTop = window.pageYOffset;
                lazyloadImages.forEach(function(img) {
                    if(img.offsetTop < (window.innerHeight + scrollTop)) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                    }
                });
                if(lazyloadImages.length == 0) {
                    document.removeEventListener("scroll", lazyload);
                    window.removeEventListener("resize", lazyload);
                    window.removeEventListener("orientationChange", lazyload);
                }
            }, 20);
        }

        document.addEventListener("scroll", lazyload);
        window.addEventListener("resize", lazyload);
        window.addEventListener("orientationChange", lazyload);
    }

});
var sortLoadEvent = 'desc';
var intervalLoad = null;
function setSortLive(idNews, asc, element){
    if(sortLoadEvent != asc){
        $('.action-view-live a').removeClass('active');
        $(element).addClass('active');
        sortLoadEvent = asc;
        var url = '/news/load-content-live.html?id='+idNews+'&timeLine=&sort='+asc;
        $.get(url, function(res){
            $('#load-live-event').html(res);
        });
    }
}

$(window).resize(function(){
    if($('iframe.auto-wh').length){
        $('iframe.auto-wh').each(function(){
            var width = $(this).width();
            var attrWidth = $(this).attr('width');
            var attrHeight = $(this).attr('height');
            if( !isNaN(attrWidth) && !isNaN(attrHeight)){
                $(this).height((width * (attrHeight/attrWidth)));
            }
        });
    }
    if($('#wrap-countdown-seagame').length){
        $('#wrap-countdown-seagame').height(($(window).width()*666)/1440);
    }
});
/*Live score*/
var Liverscore = {
	setLivescore:function(){
		this.setLivescoreByTime();
		this.runLivescore();
	},
	setLivescoreByTime:function(){
		var that = this;
		setInterval(function(){
			that.runLivescore();
		},30000);
	},
	runLivescore:function(){
		var that = this;
		$.get('/files/tiktok.txt',function(response){
			if(response){
				//var matches = response.split(";");
				var totalEle = response.length;
				//console.log(response);
				for(var i=0;i<totalEle;i++){
					that.applyChangeScore(response[i]);
				}
				setTimeout(function() {
					$('span.match-score-change').removeClass('match-score-change');
				}, 1000);
			}
		}, 'json');
	},
	applyChangeScore:function(oneChange){
		var elements = oneChange.split(",");
		var divID = 'match-id-'+elements[0];
		if($('span#'+divID).length){
			this.changeOneScoreCell('span#'+divID,elements[1]);
			if(elements[6] > 0){
				if($('#wr-home-card-'+elements[0]).length && $('#wr-home-card-'+elements[0]+' .red-card-show').length != elements[6]){
					$('#wr-home-card-'+elements[0]).html('');
					for(red=0; red<elements[6]; red++){
						$('#wr-home-card-'+elements[0]).append('<i class="red-card-show"></i>')
					}
				}
			}
			if(elements[7] > 0){
				if($('#wr-away-card-'+elements[0]).length && $('#wr-away-card-'+elements[0]+' .red-card-show').length != elements[7]){
					$('#wr-away-card-'+elements[0]).html('');
					for(red=0; red<elements[7]; red++){
						$('#wr-away-card-'+elements[0]).append('<i class="red-card-show"></i>')
					}
				}
			}
			this.changeOneScoreCell('span#'+divID+'-home-goal',elements[2]);
			this.changeOneScoreCell('span#'+divID+'-away-goal',elements[3]);
			var firstTimeHomeGoal = (!elements[4] || 0 === elements[4].length)?elements[2]:elements[4];
			var firstTimeAwayGoal = (!elements[5] || 0 === elements[5].length)?elements[3]:elements[5];
			this.changeOneScoreCell('span#'+divID+'-ht-home-goal',firstTimeHomeGoal);
			this.changeOneScoreCell('span#'+divID+'-ht-away-goal',firstTimeAwayGoal);
		}
	},
	changeOneScoreCell:function(selector,newVal){
		var currentVal = $(selector).html();
		$(selector).html(newVal);
		if(currentVal != newVal){
			$(selector).addClass("match-score-change");
		}
	}
};

function loadFootballData(newsId){
    var url = '/files/load-data-football.html?id='+newsId;
    $('#content-data-football').html('<p style="min-height: 100vh; padding-top: 50px;" class="mt-20 mb-20 text-center"><img src="/img/loading.svg" wight="60" height="60" /></p>');
    $.get(url, function(res){
        $('#content-data-football').html(res);
        loadCustomSelect();
    });
}
function loadFootballDataSeason(newsId, season){
    var url = '/files/load-data-football.html?id='+newsId+'&season='+season;
    $('#content-data-football').html('<p style="min-height: 100vh; padding-top: 50px;" class="mt-20 mb-20 text-center"><img src="/img/loading.svg" wight="60" height="60" /></p>');
    $.get(url, function(res){
        $('#content-data-football').html(res);
        loadCustomSelect();
    });
}
function loadFootballDataDate(newsId, date){
    var url = '/files/load-data-football.html?id='+newsId+'&date='+date;
    $('#content-data-football').html('<p style="min-height: 100vh; padding-top: 50px;" class="mt-20 mb-20 text-center"><img src="/img/loading.svg" wight="60" height="60" /></p>');
    $.get(url, function(res){
        $('#content-data-football').html(res);
        loadCustomSelect();
    });
}
function loadFootballDataRound(newsId, round){
    var url = '/files/load-data-football.html?id='+newsId+'&round='+round;
    $('#content-data-football').html('<p style="min-height: 100vh; padding-top: 50px;" class="mt-20 mb-20 text-center"><img src="/img/loading.svg" wight="60" height="60" /></p>');
    $.get(url, function(res){
        $('#content-data-football').html(res);
        loadCustomSelect();
    });
}
function loadCustomSelect(){
    if($('.select-league').length){
    $('.select-league').click(function(){
        $(this).toggleClass('active');
        $(this).next('.cate-bars .menu-cate-bar').toggle();
    });
    }
}
function countdownTime(countDownDate) {
    let x = setInterval(function () {
        let now = new Date().getTime();
        let distance = countDownDate - now;
        let days = Math.floor(distance / (1000 * 60 * 60 * 24));
        let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);

        $('.countdown-day').text(days);
        $('.countdown-hours').text(hours.toString().padStart(2, '0'));
        $('.countdown-minute').text(minutes.toString().padStart(2, '0'));
        $('.countdown-second').text(seconds.toString().padStart(2, '0'));
        if (distance < 0) {
            clearInterval(x)
        }
    }, 1000);
}
