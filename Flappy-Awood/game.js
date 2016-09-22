var isMobile = false;
var user;
var canRestartGame = false;
var leaderSaved = false;

window.onmessage = function(e){
    var data = JSON.parse(e.data);
    isMobile = data.isMobile;
    user = data.user;
    
    if (isMobile) {
    	$('.info').text('Tap To Begin');
    } else {
    	$('.info').text('Click/Space To Begin');
    }
}

function flappyAwood(startRightAway) {
    $(function(){
      $window = $('.window'),
      $bird = $('.bird'),
      fallTime = 1000,
      gapHeight = 200,
      gameState = 2,
      pipeId = 0,
      awoods = [
          'https://s18.postimg.org/58k4u07w9/bird_maga_Sprite.png',
          'https://s15.postimg.org/57vjvg7ln/bird_Sprite.png',
          'https://s11.postimg.org/ho4pvpser/bird_angry_Sprite.png',
          'https://s14.postimg.org/ti02a6gs1/bird_blue_Sprite.png'
      ];
      
      setInterval(function() {
      	if (gameState === 1 && gapHeight >= 130) {
      		gapHeight -= 2;
      		console.log('Gap Height Now: ' + gapHeight);
      	}
      }, 1000);
    
      function switchBird() {
          var src = awoods[Math.floor(Math.random() * awoods.length)];
          $('.bird').css('background', 'url(' + src + ')');
      }
      switchBird();
    
    	var int = setInterval(function(){
        if(gameState === 1){
          spawnPipe();
          movePipes();
        }
      }, 1300);
      
      var birdPosInterval = setInterval(function(){ 
        if(gameState === 1){
          birdPos();
        }
      }, 10);
    
    if (!isMobile) {
    	$window.on('click', function(){
    		birdFlap();
        if(gameState === 2){
          gameState = 1;
          $('.info').text('');
          deleteInterval();
        } else if (gameState === 0) {
            restartGame();
        }
    	});
    	
    	$(window).keydown(function(e){
    		if(e.keyCode === 32){
    			birdFlap();
          e.preventDefault();
          if(gameState === 2){
            gameState = 1;
            $('.info').text('');
            deleteInterval();
          } else if (gameState === 0) {
            restartGame();
          }
    		}
    	});
    } else {
    	$window.on('touchstart', function(){
    		birdFlap();
        if(gameState === 2){
          gameState = 1;
          $('.info').text('');
          deleteInterval();
        } else if (gameState === 0) {
            restartGame();
        }
    	});
    }
    
      function deleteInterval(){
    	  setTimeout(function(){
    		  var int= setInterval(function(){ 
            if(gameState === 1){
              deletePipe();
            }
          }, 1300);
    	  }, 2050);
      }
      
    	function birdFlap(){
        if(gameState === 1 || gameState === 2){
          $bird.css('transform', 'rotate(-20deg)');
    		  $bird.stop().animate({
    			  bottom: '+=60px'
      		}, 200, function(){
            birdPos();
            $bird.css('transform', 'rotate(0deg)');
    		  	$bird.stop().animate({
    			    bottom: '-=60px'
      		  }, 300, 'linear', function(){
              birdPos();
              gravity();
            });
    	  	});
        }
    	}
    
    	function gravity(){
        birdPercent = parseInt($bird.css('bottom')) / $window.height();
        totalFallTime = fallTime * birdPercent;
    		$bird.stop().animate({
    			bottom: '0'
    		}, totalFallTime, 'linear');
    
        $bird.css('transform', 'rotate(90deg)');
    	}
    
    	function spawnPipe(){
        pipeId++;
    		pipeTopHeight = Math.floor(Math.random() * ($window.height() - 250)) + 50;
    		pipeBottomHeight = $window.height() - (pipeTopHeight + gapHeight);
    		pipe = '<div class="pipe" pipe-id="' + pipeId + '"><div style="height: ' + pipeTopHeight + 'px" class="topHalf"></div><div style="height:' + pipeBottomHeight + 'px" class="bottomHalf"></div></div>';
    		$window.append(pipe);
    	}
    
    	function deletePipe(){
    		$('.window .pipe').first().remove();
    	}
    
    	function movePipes(){
    		$('.pipe').each(function(){
    			$(this).animate({
    				right: '+=160px'
    			}, 1300, 'linear');
    		});
    	}
      
      function birdPos(){
        if(parseInt($bird.css('bottom')) === 0){
          gameEnd();
        }
        
        curPipe = $('.pipe:nth-of-type(4)');
        if(curPipe.length > 0){
          pipeTop = $('.pipe:nth-of-type(4) .topHalf');
          pipeBottom = $('.pipe:nth-of-type(4) .bottomHalf');
          if(($bird.offset().left + $bird.width()) >= curPipe.offset().left && $bird.offset().left <= (curPipe.offset().left + curPipe.width())){
            if($bird.offset().top < (curPipe.offset().top + pipeTop.height()) || ($bird.offset().top + $bird.height()) > ((curPipe.offset().top + pipeTop.height()) +   gapHeight)){
              gameEnd();
            }
          } else if($bird.offset().left >= (curPipe.offset().left + curPipe.width())){
            $('.score').text(curPipe.attr('pipe-id'));
          }
        }
      }
      
      function gameEnd(){
      	clearInterval(birdPosInterval);
      	$('.pipe').stop();
        gravity();
      	gameState = 0;
        $('.info').html('Game Over!<' + 'br>');
        if (isMobile) {
            $('.info').append('Tap To Restart');
        } else {
            $('.info').append('Click/Space To Restart');
        }
        $.get('https://flappy-awood.firebaseio.com/leaderboards/' + user._id + '.json', function(data) {
       	    if (data === null || data.score < parseInt($('.score').text())) {
       	    	$.ajax({
		    url: 'https://flappy-awood.firebaseio.com/leaderboards/' + user._id + '.json',
		    type: 'PUT',
		    success: function() {
		    	leaderSaved = true;
		    },
		    data: JSON.stringify({
		    	username: user.username,
		    	score: $('.score').text()
	    	    }),
            	    dataType: 'json',
		    traditional: true,
		    contentType: 'application/json'
	  	})
       	    } else {
       	    	leaderSaved = true;
       	    }
        });
        setTimeout(function() {
	    canRestartGame = true;
        }, 1000);
      }
      
      function restartGame() {
      	if (canRestartGame) {
          window.location.reload();
      	}
      }
    })
}

window.top.postMessage('hello', '*');
$(document).ready(function(){
    new flappyAwood();
});
