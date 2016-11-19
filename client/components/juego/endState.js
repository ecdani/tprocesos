

endState = function () {
    this.playSound = true,
    this.playMusic = true,
    this.music = null;
    this.timeout = false
};

endState.prototype = {

    init: function () {
        if (victoria) {
            this.status = game.make.text(game.world.centerX, 380, 'Victoria!!', { fill: 'white' });        
        } else {
            this.status = game.make.text(game.world.centerX, 380, 'Game Over', { fill: 'white' });
        }
    },

    addGameMusic: function () {
        music.destroy();
        if (victoria) {
             music = game.add.audio('bootMusic');
        } else {
            music = game.add.audio('endMusic');
        }
        music.loop = true;
        music.play();
    },

    create: function () {

        //this.loadingBar = game.make.sprite(game.world.centerX - (387 / 2), 400, "loading");
        this.logo = game.make.sprite(game.world.centerX, 200, 'brand');

        centerGameObjects([this.logo, this.status]);
        function centerGameObjects(objects) {
            objects.forEach(function (object) {
                object.anchor.setTo(0.5);
            })
        }
        
        if (victoria) {
            game.add.sprite(0, 0, 'backgroundKU');
        } else {
            game.add.sprite(0, 0, 'gameover-bg');
        }
        
        game.add.existing(this.logo).scale.setTo(0.5);
        //game.add.existing(this.loadingBar);
        game.add.existing(this.status);
        //this.load.setPreloadSprite(this.loadingBar);

        //this.status.setText('Ready!');
        //this.addGameStates();
        this.addGameMusic();


    },

    update: function () {
        if (this.timeout == false) {
            this.timeout = true;
            setTimeout(function (timeout) {
                game.state.start("bootState");
            }, 6000, this.timeout);
        }
    }
};
