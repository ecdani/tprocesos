
/**
 * Ejecutar el juego
 */
function bootStateExec(usuario) {
    $('#control').empty();
    game = new Phaser.Game(660, 600, Phaser.AUTO, 'control', bootState);
    $('#status').load('../components/juego/status.html', function() {
        $('#nivel').html(usuario.nivel)
        $('#inombre').html(usuario.nombre)
        $('#vidas').html(usuario.vidas)
    });
}


bootState = function() { },
    playSound = true,
    playMusic = true,
    music = null;

bootState.prototype = {

    loadBgm: function() {
        // thanks Kevin Macleod at http://incompetech.com/
        game.load.audio('dangerous', '../components/juego/bgm/Dangerous.mp3');
        game.load.audio('exit', '../components/juego/bgm/Exit the Premises.mp3');
    },
    // varios freebies found from google image search
    loadImages: function() {
        game.load.image('menu-bg', '../components/juego/img/menu-bg.jpg');
        game.load.image('options-bg', '../components/juego/img/options-bg.jpg');
        game.load.image('gameover-bg', '../components/juego/img/gameover-bg.jpg');
        game.load.image('loading', '../components/juego/img/loading.png');
        game.load.image('brand', '../components/juego/img/logo.png');
        game.load.image('stars', '../components/juego/img/stars.jpg');

    },

    init: function() {
        this.status = game.make.text(game.world.centerX, 380, 'Loading...', { fill: 'white' });
    },

    preload: function() {
        this.loadImages();
        this.loadBgm();
    },

    addGameStates: function() {

        //game.load.script('juegoState', '../components/juego/juegoState.js');
        //game.load.script('endState', '../components/juego/endState.js');
        game.state.add("juegoState", juegoState);
        game.state.add("endState", endState);
    },

    addGameMusic: function() {
        music = game.add.audio('dangerous');
        music.loop = true;
        music.play();
    },

    create: function() {

        this.loadingBar = game.make.sprite(game.world.centerX - (387 / 2), 400, "loading");
        this.logo = game.make.sprite(game.world.centerX, 200, 'brand');

        centerGameObjects([this.logo, this.status]);
        function centerGameObjects(objects) {
            objects.forEach(function(object) {
                object.anchor.setTo(0.5);
            })
        }

        game.add.sprite(0, 0, 'stars');
        game.add.existing(this.logo).scale.setTo(0.5);
        game.add.existing(this.loadingBar);
        game.add.existing(this.status);
        this.load.setPreloadSprite(this.loadingBar);

        this.status.setText('Ready!');
        this.addGameStates();
        this.addGameMusic();

        setTimeout(function() {
            game.state.start("juegoState");
        }, 5000);
    }
};
