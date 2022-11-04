$(document).ready(function (){
	$(window).scroll(function (){
		if($('#link-return-top').length > 0){
			if($(this).scrollTop() > 0 && $('#link-return-top').css('visibility') == 'hidden'){
				$('#link-return-top').css({"visibility":"visible"});
			}else if($(this).scrollTop() == 0 && $('#link-return-top').css('visibility') == 'visible'){
				$('#link-return-top').css({"visibility":"hidden"});
			}
		}
	});
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
		var red=0;
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
