function flappyAwood(startRightAway) {
    var $window = $('.rebl-panel .container.game-FlappyAwood .window'),
            $bird = $('.rebl-panel .container.game-FlappyAwood .bird'),
            fallTime = 1000,
            gapHeight = 200,
            gameState = 2,
            pipeId = 0,
            deleteTimeout,
            int2,
            curPipe,
            int,
            birdPosInterval,
            awoods = [
                'https://s18.postimg.org/58k4u07w9/bird_maga_Sprite.png',
                'https://s15.postimg.org/57vjvg7ln/bird_Sprite.png'
            ];

    function switchBird() {
        var src = awoods[Math.floor(Math.random() * awoods.length)];
        $('.rebl-panel .container.game-FlappyAwood .bird').css('background', 'url(' + src + ')');
    }
    switchBird();

    int = setInterval(function(){
        if(gameState === 1){
            spawnPipe();
            movePipes();
        }
    }, 1300);

    birdPosInterval = setInterval(function(){
        if(gameState === 1){
            birdPos();
        }
    }, 10);

    $window.on('click', doGame);

    $(window).keydown(function(e){
        if(e.keyCode === 32){
            doGame(e)
        }
    });

    //if (startRightAway) {
    //    doGame({
    //        preventDefault: function(){}
    //    });
    //}

    function doGame(e) {
        //birdFlap();
        e.preventDefault();
        if(gameState === 2){
            $('.rebl-panel .container.game-FlappyAwood .info').text('');
            gameState = 1;
            deleteInterval();
        } else if (gameState === 0) {
            restartGame();
        }
    }

    function deleteInterval(){
        deleteTimeout = setTimeout(function(){
            int2 = setInterval(function(){
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
        pipe = '<' + 'div class="pipe" pipe-id="' + pipeId + '"><' + 'div style="height: ' + pipeTopHeight + 'px" class="topHalf"><' + '/div><' + 'div style="height:' + pipeBottomHeight + 'px" class="bottomHalf"><' + '/div><' + '/div>';
        $window.append(pipe);
    }

    function deletePipe(){
        $('.rebl-panel .container.game-FlappyAwood .window .pipe').first().remove();
    }

    function movePipes(){
        $('.rebl-panel .container.game-FlappyAwood .pipe').each(function(){
            $(this).animate({
                right: '+=160px'
            }, 1300, 'linear');
        });
    }

    function birdPos(){
        if(parseInt($bird.css('bottom')) === 0){
            console.log('BIRD AT BOTTOM', $bird.css('bottom'));
            gameEnd();
        }

        curPipe = $('.rebl-panel .container.game-FlappyAwood .pipe:nth-of-type(4)');
        if(curPipe.length > 0){
            pipeTop = $('.rebl-panel .container.game-FlappyAwood .pipe:nth-of-type(4) .topHalf');
            pipeBottom = $('.rebl-panel .container.game-FlappyAwood .pipe:nth-of-type(4) .bottomHalf');
            if(($bird.offset().left + $bird.width()) >= curPipe.offset().left && $bird.offset().left <= (curPipe.offset().left + curPipe.width())){
                if($bird.offset().top < (curPipe.offset().top + pipeTop.height()) || ($bird.offset().top + $bird.height()) > ((curPipe.offset().top + pipeTop.height()) +   gapHeight)){
                    console.log('HIT PIPE');
                    gameEnd();
                }
            } else if($bird.offset().left >= (curPipe.offset().left + curPipe.width())){
                $('.rebl-panel .container.game-FlappyAwood .score').text(curPipe.attr('pipe-id'));
            }
        }
    }

    function gameEnd(){
        clearInterval(birdPosInterval);
        clearInterval(int);
        clearInterval(int2);
        clearTimeout(deleteTimeout);
        $('.rebl-panel .container.game-FlappyAwood .pipe').stop();
        $('.rebl-panel .container.game-FlappyAwood .info').html('Game Over!<' + 'br>');
        if (isMobile) {
            $('.rebl-panel .container.game-FlappyAwood .info').append('Tap To Restart');
        } else {
            $('.rebl-panel .container.game-FlappyAwood .info').append('Click/Space To Restart');
        }
        gravity();
        gameState = 0;
    }

    function restartGame() {
        $('.rebl-panel .container.game-FlappyAwood').empty();
        flappyAwoodContainer($('.rebl-panel .container.game-FlappyAwood'));
        new flappyAwood(true);
    }
}

new flappyAwood();
