

var victoria = false;
var nivel = 0;

juegoState = function () {
    var player;
    var platforms;
    fireButton = null;
    weapon = null;
    this.vidas = 5;
    var stars;
    this.score = 0;
    var scoreText;
    var timeText;
    var timer;
    segundos = 0;
    this.blaster = null;
};

juegoState.prototype = {

    /**
     * Preload is called first. Normally you'd use this to load your game assets 
     * (or those needed for the current State) You shouldn't create any objects in this
     * method that require assets that you're also loading in this method, as they won't yet be available.
     */
    preload: function () {
        game.load.image('sky', '../components/juego/img/sky.png');
        game.load.image('platform', '../components/juego/img/platform4.png');
        game.load.image('ground', '../components/juego/img/platform3.png');

        game.load.image('star', '../components/juego/img/pangball' + nivel + '.png');
        game.load.image('backgroundMS', '../components/juego/img/backgroundMS' + nivel + '.gif');

        game.load.image('bullet', '../components/juego/img/shmup-bullet.png');
        game.load.spritesheet('dude', '../components/juego/img/neko.png', 32, 32);
    },

    /**
     * Lleva la cuenta en segundos
     */
    updateContador: function () {
        segundos++;
        $('#time').text('' + segundos);
    },

    /**
     * Create is called once preload has completed, this includes the loading of any assets from the Loader.
     * If you don't have a preload method then create is the first method called in your State.
     */
    create: function () {
        $('#vidas').text(this.vidas);

        music.destroy();
        music = game.add.audio('ingameMusic');
        music.loop = true;
        music.play();

        blaster = game.add.audio('blaster');

        game.physics.startSystem(Phaser.Physics.ARCADE);  //  We're going to be using physics, so enable the Arcade Physics system
        game.add.sprite(0, 0, 'backgroundMS'); //  A simple background for our game
        platforms = game.add.group(); //  The platforms group contains the ground and the 2 ledges we can jump on
        platforms.enableBody = true; //  We will enable physics for any object that is created in this group

        var ground = platforms.create(0, game.world.height - 64, 'ground'); 

        ground.scale.setTo(2, 2);
        ground.body.immovable = true;

        var ledge;
        for (var i = 0; i < niveles[nivel].platforms.length; i++) {
            ledge = platforms.create(niveles[nivel].platforms[i].x, niveles[nivel].platforms[i].y, 'platform');
            ledge.body.immovable = true;
        }

        player = game.add.sprite(32, game.world.height - 150, 'dude'); 
        game.physics.arcade.enable(player);

        //  Player physics properties. Give the little guy a slight bounce.
        player.body.bounce.y = 0.01;
        player.body.gravity.y = niveles[nivel].gravity;//500;
        player.body.collideWorldBounds = true;

        player.animations.add('right', [14, 15, 14, 15], 10, true);
        player.animations.add('rightjump', [18, 19], 5, true);
        player.animations.add('rightfall', [23], 10, true);
        player.animations.add('left', [12, 13, 12, 13], 10, true);
        player.animations.add('leftjump', [16, 17], 5, true);
        player.animations.add('leftfall', [21], 10, true);

        player.animations.add('jump', [9, 8], 5, true);
        player.animations.add('fall', [11], 10, true);

        stars = game.add.group();
        stars.enableBody = true;

        //  Here we'll create 12 of them evenly spaced apart
        for (var i = 0; i < 12; i++) {
            //  Create a star inside of the 'stars' group
            var star = stars.create(i * 70, 0, 'star');

            //  Let gravity do its thing
            star.body.velocity.y = niveles[nivel].velocity;//500;
            star.body.acceleration.y = niveles[nivel].acceleration; //100;
            star.body.velocity.x = Math.floor(Math.random() * 1001) - 500;

            //  This just gives each star a slightly random bounce value
            star.body.bounce.y = 1;
            star.body.bounce.x = 1;
            star.body.collideWorldBounds = true;
        }

        // Arma
        weapon = game.add.weapon(30, 'bullet');
        weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        weapon.bulletSpeed = 800;
        weapon.fireRate = 100;
        weapon.trackSprite(player, 16, 16, false); // El arma sigue al personaje

        timer = game.time.events.loop(Phaser.Timer.SECOND, this.updateContador, this);

        //http://phaser.io/docs/2.4.4/Phaser.KeyCode.html
        fireButton = game.input.keyboard.addKey(Phaser.KeyCode.LEFT);
        w = game.input.keyboard.addKey(Phaser.KeyCode.W);
        a = game.input.keyboard.addKey(Phaser.KeyCode.A);
        s = game.input.keyboard.addKey(Phaser.KeyCode.S);
        d = game.input.keyboard.addKey(Phaser.KeyCode.D);
        spacebar = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    },

    /**
     * The update method is left empty for your own use. It is called during the core game loop AFTER debug,
     * physics, plugins and the Stage have had their preUpdate methods called. If is called BEFORE Stage,
     * Tweens, Sounds, Input, Physics, Particles and Plugins have had their postUpdate methods called.
     */
    update: function () {
        game.physics.arcade.collide(player, platforms);
        game.physics.arcade.collide(stars, platforms);
        game.physics.arcade.collide(stars, stars);

        game.physics.arcade.overlap(player, stars, this.damageStar, null, this);
        game.physics.arcade.overlap(weapon.bullets, stars, this.collectStar, null, this);
        game.physics.arcade.overlap(weapon.bullets, platforms, this.clearBullet, null, this);

        if (fireButton.downDuration(20)) {
            weapon.fire();
            blaster.play();
        }

        if (a.isDown) {
            if (w.isDown) {
                weapon.fireAngle = Phaser.ANGLE_UP;
            } else {
                weapon.fireAngle = Phaser.ANGLE_LEFT;
            }
            player.body.velocity.x = -150;
            if (!player.body.touching.down && player.body.velocity.y < 0) {
                player.animations.play('leftjump');
            } else if (!player.body.touching.down) {
                player.animations.play('leftfall');
            } else {
                player.animations.play('left');
            }
        }

        else if (d.isDown) {
            if (w.isDown) {
                weapon.fireAngle = Phaser.ANGLE_UP;
            } else {
                weapon.fireAngle = Phaser.ANGLE_RIGHT;
            }
            player.body.velocity.x = 150;
            if (!player.body.touching.down && player.body.velocity.y < 0) {
                player.animations.play('rightjump');
            } else if (!player.body.touching.down) {
                player.animations.play('rightfall');
            } else {
                player.animations.play('right');
            }
        }
        else if (w.isDown) {
            weapon.fireAngle = Phaser.ANGLE_UP;
            player.body.velocity.x = 0;
            player.animations.stop();
            player.frame = 0;
        } else {
            player.body.velocity.x = 0;
            player.animations.stop();
            player.frame = 0;
        }

        if (!player.body.touching.down) {
            if (player.body.velocity.y > 0 && player.body.velocity.x > 0) {
                player.animations.play('rightfall');
            } else if (player.body.velocity.y > 0 && player.body.velocity.x < 0) {
                player.animations.play('leftfall');
            } else {
                player.animations.play('fall');
            }
            if (s.isDown) {
                weapon.fireAngle = Phaser.ANGLE_DOWN;
            }
        } else {
            if (s.isDown) {
                if (player.body.velocity.x < 0) {
                    player.body.velocity.x = -50;
                } else if (player.body.velocity.x > 0) {
                    player.body.velocity.x = 50;
                }
            }
        }

        //  Allow the player to jump if they are touching the ground.
        if (spacebar.isDown && player.body.touching.down) {
            player.body.velocity.y = -350;
            player.animations.play('jump');
        }
        this.checkVictory();
    },

    /**
     * Funcion auxiliar para eliminar el disparo
     * @param weapon el objeto arma
     * @param platform, la plataforma con la que choca
     */
    clearBullet: function (weapon, platform) {
        weapon.kill();
    },

    /**
     * Comprobamos si se han alcanzado las condiciones de victoria e informamos al server
     */
    checkVictory: function () {
        if (stars.checkAll('alive', false)) {
            $.post("/nivelCompletado", {
                segundos: segundos,
                nivel: nivel
            });
            if (nivel == 4) {
                victoria = true;
                nivel = 0;
                game.state.start("endState");
            } else {
                nivel++;
                game.state.start("juegoState");
            }
            $('#nivel').html(nivel);
        }
    },

    /**
     * Acciones al matar una 'estrella'
     * @param weapon el objeto arma
     * @param star, la bola de pang
     */
    collectStar: function (weapon, star) {
        // Removes the star from the screen
        star.kill();
        weapon.kill();

        //  Add and update the score
        this.score += 10;
        $('#score').text(this.score.toString());
    },

    /**
     * Acciones al chocar con una 'estrella'
     * @param player el objeto jugador
     * @param star, la bola de pang
     */
    damageStar: function (player, star) {
        star.kill();
        this.vidas -= 1;
        if (this.vidas == 0) {
            victoria = false;
            game.state.start("endState");
        }
        $('#vidas').text(this.vidas);
    },

    /**
     * Información de depuración
     */
    /*render: function () {
        weapon.debug();
    }*/
}
