

var game = null;

/**
 * Ejecuta el juego, esta función se ejecuta posterior a la carga de este .js
 */
function bootStateExec() {
    var usuario = Singleton.getInstance();
    $('#control').empty();
    game = new Phaser.Game(660, 600, Phaser.AUTO, 'control', bootState);
    $('#status').load('../components/juego/status.html', function () {
        $('#nivel').html("0")
        $('#nombre').html(usuario.nombre)
        $('#vidas').html(usuario.vidas)
    });
}

var playSound = true;
var playMusic = true;
var music = null;
var niveles = null;

/**
 * Estado inicial del juego
 */
bootState = function () { };

bootState.prototype = {

    /**
     * Init is the very first function called when your State starts up. It's called before preload,
     * create or anything else. If you need to route the game away to another State you could do so here,
     * or if you need to prepare a set of variables or objects before the preloading starts.
     */
    init: function () {
        this.status = game.make.text(game.world.centerX, 380, 'Loading...', { fill: 'white' });
        $.getJSON("../components/juego/niveles.json").done(function (data) {
            niveles = data;
        });
    },

    /**
     * Preload is called first. Normally you'd use this to load your game assets 
     * (or those needed for the current State) You shouldn't create any objects in this
     * method that require assets that you're also loading in this method, as they won't yet be available.
     */
    preload: function () {
        game.load.image('menu-bg', '../components/juego/img/menu-bg.jpg');
        game.load.image('options-bg', '../components/juego/img/options-bg.jpg');
        game.load.image('gameover-bg', '../components/juego/img/gameover-bg.jpg');
        game.load.image('loading', '../components/juego/img/loading.png');
        game.load.image('brand', '../components/juego/img/logo.png');
        game.load.image('stars', '../components/juego/img/stars.jpg');
        game.load.image('clouds', '../components/juego/img/metal-slug-3-clouds.png');

        game.load.image('backgroundKU', '../components/juego/img/ku-xlarge.png');

        game.load.audio('bootMusic', '../components/juego/bgm/02 The Military System.mp3');
        game.load.audio('ingameMusic', '../components/juego/bgm/04 Steel Beast.mp3');
        game.load.audio('endMusic', '../components/juego/bgm/03 Main Theme From Metal Slug.mp3');
        game.load.audio('blaster', '../components/juego/bgm/blaster.mp3');
    },

    /**
     * Create is called once preload has completed, this includes the loading of any assets from the Loader.
     * If you don't have a preload method then create is the first method called in your State.
     */
    create: function () {
        this.loadingBar = game.make.sprite(game.world.centerX - (387 / 2), 400, "loading");
        this.logo = game.make.sprite(game.world.centerX, 200, 'brand');

        centerGameObjects([this.logo, this.status]);
        function centerGameObjects(objects) {
            objects.forEach(function (object) {
                object.anchor.setTo(0.5);
            })
        }

        game.add.sprite(0, 0, 'clouds');
        game.add.existing(this.logo).scale.setTo(0.5);
        game.add.existing(this.status);
        this.load.setPreloadSprite(this.loadingBar);

        this.status.setText('Start!');
        this.status.events.onInputUp.add(function () { game.state.start("juegoState"); });
        this.status.inputEnabled = true;

        game.state.add("bootState", bootState);
        game.state.add("juegoState", juegoState);
        game.state.add("endState", endState);

        if (music) {
            music.destroy();
        }
        music = game.add.audio('bootMusic');
        music.loop = true;
        music.play();
    }
};
