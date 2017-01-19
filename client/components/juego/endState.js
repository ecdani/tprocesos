

endState = function () {
    this.playSound = true,
        this.playMusic = true,
        this.music = null;
    this.timeout = false
};

endState.prototype = {

    /**
     * Init is the very first function called when your State starts up. It's called before preload,
     * create or anything else. If you need to route the game away to another State you could do so here,
     * or if you need to prepare a set of variables or objects before the preloading starts.
     */
    init: function () {
        if (victoria) {
            this.status = game.make.text(game.world.centerX, 380, 'Victoria!!', { fill: 'white' });
        } else {
            this.status = game.make.text(game.world.centerX, 380, 'Game Over', { fill: 'white' });
        }
    },

    /**
     * Añade la música durante la creación
     */
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

    /**
     * Create is called once preload has completed, this includes the loading of any assets from the Loader.
     * If you don't have a preload method then create is the first method called in your State.
     */
    create: function () {
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
        game.add.existing(this.status);
        this.addGameMusic();
    },

    /**
     * The update method is left empty for your own use. It is called during the core game loop AFTER debug,
     * physics, plugins and the Stage have had their preUpdate methods called. If is called BEFORE Stage,
     * Tweens, Sounds, Input, Physics, Particles and Plugins have had their postUpdate methods called.
     */
    update: function () {
        if (this.timeout == false) {
            this.timeout = true;
            setTimeout(function (timeout) {
                game.state.start("bootState");
            }, 6000, this.timeout);
        }
    }
};
