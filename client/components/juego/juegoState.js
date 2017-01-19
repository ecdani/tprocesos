

var victoria = false;
var nivel = 0;

juegoState = function () {

    var player;
    var platforms;
    //var cursors;
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

        var ground = platforms.create(0, game.world.height - 64, 'ground'); // Here we create the ground.
        //ground.setRectangle(400,32);
        ground.scale.setTo(2, 2); //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        ground.body.immovable = true; //  This stops it from falling away when you jump on it

        //  Now let's create two ledges
        var ledge;// = platforms.create(400, 400, 'ground');
        //ledge.body.immovable = true;

        //ledge = platforms.create(-150, 250, 'ground');
        // ledge.body.immovable = true;

        for (var i = 0; i < niveles[nivel].platforms.length; i++) {
            ledge = platforms.create(niveles[nivel].platforms[i].x, niveles[nivel].platforms[i].y, 'platform');
            ledge.body.immovable = true;
        }
        /*for (var i = 0; i < Math.random() * 10; i++) {
            ledge = platforms.create(Math.random() * 1000, Math.random() * 1000, 'platform');
            ledge.body.immovable = true;
        }*/



        player = game.add.sprite(32, game.world.height - 150, 'dude'); // The player and its settings
        game.physics.arcade.enable(player); //  We need to enable physics on the player



        //  Player physics properties. Give the little guy a slight bounce.
        player.body.bounce.y = 0.01;
        player.body.gravity.y =  niveles[nivel].gravity;//500;
        player.body.collideWorldBounds = true;
        //player.body.setCircle(20);

        //  Our two animations, walking left and right.

        player.animations.add('right', [14, 15, 14, 15], 10, true);
        player.animations.add('rightjump', [18, 19], 5, true);
        player.animations.add('rightfall', [23], 10, true);
        player.animations.add('left', [12, 13, 12, 13], 10, true);
        player.animations.add('leftjump', [16, 17], 5, true);
        player.animations.add('leftfall', [21], 10, true);

        player.animations.add('jump', [9, 8], 5, true);
        player.animations.add('fall', [11], 10, true);
        //player.animations.add('sleep', [5, 6], 0.6, true);


        stars = game.add.group(); //  Finally some stars to collect
        stars.enableBody = true; //  We will enable physics for any star that is created in this group

        //  Here we'll create 12 of them evenly spaced apart
        for (var i = 0; i < 12; i++) {
            //  Create a star inside of the 'stars' group
            //var star = stars.create(i * 70, [0], 'star');
            var star = stars.create(i * 70, 0, 'star');

            //  Let gravity do its thing
            star.body.velocity.y =  niveles[nivel].velocity;//500;
            star.body.acceleration.y =  niveles[nivel].acceleration; //100;
            //star.body.gravity.y = 500;
            star.body.velocity.x = Math.floor(Math.random() * 1001) - 500;

            //  This just gives each star a slightly random bounce value
            star.body.bounce.y = 1;
            star.body.bounce.x = 1;


            star.body.collideWorldBounds = true;
            //star.body.setCircle(16);

        }

        // Arma
        weapon = game.add.weapon(30, 'bullet'); //  Creates 30 bullets, using the 'bullet' graphic
        weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS; //  The bullet will be automatically killed when it leaves the world bounds
        weapon.bulletSpeed = 800; //  The speed at which the bullet is fired
        weapon.fireRate = 100; //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
        weapon.trackSprite(player, 16, 16, false); // El arma sigue al personaje

        //scoreText = game.add.text(16, 16, 'Vidas: 0', { fontSize: '32px', fill: '#000' }); //  The score

        timer = game.time.events.loop(Phaser.Timer.SECOND, this.updateContador, this);
        //timeText =game.add.text(game.world.width-155,60,'Tiempo:0');

        //cursors = game.input.keyboard.createCursorKeys(); //  Our controls.

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


        //  Reset the players velocity (movement)
        //player.body.velocity.x = 0;

        /*for (var i = 0; i < 12; i++)
        {
            if (stars[i].body.touching) {
                stars[i].animations.play('die');
            }
        }*/
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
            //player.frame = 10;
            //
            if (player.body.velocity.y > 0 && player.body.velocity.x > 0) {
                player.animations.play('rightfall');
            } else if (player.body.velocity.y > 0 && player.body.velocity.x < 0) {
                player.animations.play('leftfall');
            } else {
                player.animations.play('fall');
            }
            if (s.isDown) {
                weapon.fireAngle = Phaser.ANGLE_DOWN;
                //player.body.velocity.x = 0;
                //player.animations.play('sleep');
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
     clearBullet: function (weapon, platform) {
        weapon.kill();
    },

    /**
     * Comprobamos si se han alcanzado las condiciones de victoria e informamos al server
     */
    checkVictory: function () {
        if (stars.checkAll('alive', false)) {
            console.log('registrando Nivel completado')
            $.post("/nivelCompletado", {
                //victoria: victoria,
                segundos: segundos,
                nivel: nivel
            });
            if (nivel == 4) {
                victoria = true;
                nivel = 0;
                console.log('VICTORIA');
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
     */
    damageStar: function (player, star) {
        star.kill();
        this.vidas -= 1;
        if (this.vidas == 0) {
            victoria = false;
            game.state.start("endState");
            console.log('DERROTA');
        }
        $('#vidas').text(this.vidas);
    },

    /**
     * Información de depuración
     */
    render: function () {
        weapon.debug();
    }
}
