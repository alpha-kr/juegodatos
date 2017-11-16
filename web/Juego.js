var juego=new Phaser.Game(1280,640,Phaser.AUTO,'bloqueJuego');
var map;
var layer;
var sw=0,sw1=0,sw3=0,sw4=0;
var timer=0; 
var stopTransition = false;
var monedas=0;
var beerCont=0;
 var soundbeer;
var principalV={
	/*

	Universidad del Norte**/

	preload:function preload(){

 	   //cargar los recursos
 	   perdio:'',

 	  juego.load.image('suelo','img/platform.png');
      //juego.load.image('jaula','assets/ja.png');
 	  juego.load.image('platformas','assets/plataforma.png');
      juego.load.tilemap('map',"assets/mapaPrueba.csv"); 
      //juego.load.tilemap('map','assets/mapa2.csv');
      juego.load.image('tileset','assets/fondo1.png'); 
      //juego.load.image('tileset','assets/fondo2.png');
      juego.load.spritesheet('dk','assets/dktileset4.png', 71, 109);
      juego.load.image('barrildk','assets/barril3.png');  
      juego.load.spritesheet('princess','assets/princessMECANICAA.png',48,70);
      //juego.load.spritesheet('personaje','assets/marioporfin.png',36,54);
      juego.load.audio('cerveza','assets/beer.mp3');
      juego.load.spritesheet('personaje','assets/mario andy.png',38,48);
      juego.load.spritesheet('barriles','assets/barril1.png',37,42);
      juego.load.spritesheet('beer','img/Food.png',34,32);
      juego.load.audio('perdio','assets/perdida.mp3');    juego.load.audio('salte','assets/Super mario Bros. (el salto de mario)  Efecto de sonido (1).mp3');

 },

    create: function create(){//aqui se- muestra todo
        sounsalto:'',
          beerCont=0;
      
        map= juego.add.tilemap('map',32,32);
        map.addTilesetImage('tileset');
        //map.addTilesetImage('jaula');
        map.addTilesetImage('platformas');
        layer = map.createLayer(0);
        layer.resizeWorld();
        jugador:'',
        map.setCollisionBetween(0,0);
       soundbeer= juego.add.audio('cerveza');

 	    juego.physics.startSystem(Phaser.Physics.ARCADE);
        juego.world.setBounds(0, 0, 1280, 1200);

        //---Suelo---
		plataformas=juego.add.group();
		plataformas.enableBody=true;
		suelo=plataformas.create(0,juego.world.height-64,'suelo');
		suelo.body.immovable = true;
		suelo.scale.set(2,2);//se crea el suelo

        //----Donkey Kong--
        dk=juego.add.sprite(500,60,'dk');
        dk.animations.add('right',[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,17],9,true);
        dk.animations.add('left',[32,31,30,29,28,27,26,25,24,23,22,43,42,41,40,39,37,36],9,true);

        //---Jugador----
        jugador = juego.add.sprite(0, juego.world.height-150, 'personaje');//mostrare el personaje
 	    juego.physics.arcade.enable(jugador);
 	    jugador.body.bounce.y=0.1;
		jugador.body.gravity.y= 2200;
        jugador.jump=-890;
	    jugador.body.collideWorldBounds = true;
        perdio=juego.add.audio('perdio');
        jugador.animations.add('right', [4,1,0,3,0,1,4], 15, true);
        jugador.animations.add('left',  [7,11,10,8,10,11,7], 15, true);
      
        die=jugador.animations.add('die',[2],1,false);
        


        jugador.animations.add('saltoDer',[5],5,false);
        jugador.animations.add('saltoIzq',[6],5,false);
        
        //----Barriles---
        juego.add.image(576,115,'barrildk');
        juego.add.image(610,115,'barrildk');
        juego.add.image(480,115,'barrildk');
        juego.add.image(446,115,'barrildk');
        barriles=juego.add.group();
        barriles.enableBody=true;

        //---Princesa-

        princess=juego.add.sprite(735.50,0,'princess');
        juego.physics.arcade.enable(princess);
        princess.body.immovable = true;
        princess.animations.add('cry',[6,5,4],2,true);
        happy=princess.animations.add('happy',[3,2,1,0],2,false);
        princess.enableBody=true;

		cursors = juego.input.keyboard.createCursorKeys();
        
        //---Camara---
        juego.camera.setSize(1280,640);
        juego.camera.follow(jugador, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
        sounsalto=juego.add.audio('salte');
        

        //---Monedas---
        beers=juego.add.group();
        beers.enableBody=true;
        beers=polas();
        scoreText =juego.add.text(16,16 , 'score: 0', { fontSize: '32px', fill: 'white' });
        scoreText.fixedToCamera=true;
},
    
    update:function update(){
        //las animaciones
        juego.physics.arcade.overlap(jugador,beers,colibeers,null,this);
        if (beerCont==10) {
            juego.physics.arcade.overlap(jugador,princess,coliprincess,null,this);
        } 

        //----Barriles y DonkeyKong---
        if(juego.time.now > timer){
            
            
            if (sw1==1) {
                dk.animations.play('right');
            }else{
                dk.animations.play('left');
            }
            
            barriles=barrile();
        }

        barriles.forEach(function(barril) {
            juego.physics.arcade.overlap(jugador,barril,colibarriles,null,this);   
            if(barril.position.y>=1090 && barril.position.x==0){
                barril.kill();   
            }

        }, juego);

        //---Monedas---
        if (sw4==0) {
        beers.forEach(function(beer1){
	    beer1.animations.play('girar');},juego);
        sw4=1;
        }
         
        //---Princesa----
        if (sw==1 || sw==0 || sw==3) {
            princess.animations.play('cry');
        }

        //---Colisiones Juego        
        var hitPlatform = juego.physics.arcade.collide(jugador,plataformas);
        jugador.body.velocity.x = 0;
        hitGround=juego.physics.arcade.collide(jugador,layer);
        juego.physics.arcade.collide(barriles, layer);
        juego.physics.arcade.collide(barriles,plataformas);
        juego.physics.arcade.collide(beers,layer);
        juego.physics.arcade.collide(princess,layer);
        juego.physics.arcade.collide(princess,jugador);
        

        //---Controles----
         if (cursors.left.isDown )
        {
            //  Move to the left
            if(sw!=2){
            if (!(jugador.body.touching.down || jugador.body.onFloor() )) {

            jugador.animations.play('saltoIzq');
            jugador.body.velocity.x = -500;
            sw=1;
            }else{
            jugador.body.velocity.x = -500;
            jugador.animations.play('left');
            sw=1;

            }
        }
            
         

        }
        else if (cursors.right.isDown)
        {
            //  Move to the right
           if(sw!=2){
            if (!(jugador.body.touching.down || jugador.body.onFloor() )) {

            jugador.animations.play('saltoDer');
            jugador.body.velocity.x = +500;
            sw=0;
            }else{
            jugador.body.velocity.x = +500;
            jugador.animations.play('right');
            sw=0;

            }
}

        }else{
            if(sw!=2){

                if (sw==0 && (jugador.body.touching.down || jugador.body.onFloor() )) {
                    jugador.animations.stop();
                jugador.frame=4;
                }else{
                    if (sw==1 && (jugador.body.touching.down || jugador.body.onFloor() )) {
 
                   jugador.animations.stop();
                jugador.frame=7;
                     }
                }}


        }
           if( cursors.up.isDown && (jugador.body.touching.down || jugador.body.onFloor() )){
                if(sw!=2){
                 jugador.body.velocity.y = jugador.jump;
                 if (sw==0) { jugador.animations.play('saltoDer');}else{if (sw==1) { jugador.animations.play('saltoIzq');}}
               sounsalto.play('',0,0.5,false); }       
            } 
            
            
           
        


        
       
         
        
 
	} //, 
	    //render: function render() {

	        //juego.debug.cameraInfo(juego.camera, 32, 32);
	        //juego.debug.spriteCoords(jugador, 32, 500);

	    //},
	    

    
};
function colibarriles(jugador,barril,hitPlatform){
     sw=2;
    barril.kill();
    perdio.play();
     playmusica.stop();
     die.play();


    
    animaci = juego.add.tween(die);
    jugador.angle=90;
    animaci.to({ y: jugador.position.y,x:jugador.position.x }, 1000, null,this);
    animaci.start();
    animaci.onComplete.add(function() { 

            if(die.isFinished){
            jugador.body.gravity.y= 1000;
           scene_transition2('perd',500)}      
        }, this);

     
 
}

function coliprincess(jugador,princess){
    //Todo: cuando gana
    //juego.state.start('win');
   sw=2;
    
    happy.play();
    scene_transition2('win',4500);
}

function colibeers(jugador,beer){
    beer.kill();
    beerCont++;
    soundbeer.play('',0,0.5,false); 
    scoreText.text = 'Score: ' + beerCont;
}
    
 
function polas(){
    // se deben crear 10 cervezas por todo el mapa
    i=0;
    var coord=[[350,920],[615,1002],[845,938],[1099,1002],[1119,874],[1002,746],[811,810],[499,810],[165,842],[54,714],[159,618],[310,712],[647,650],[973,619],[1052,522],[1124,394],[612,522],[391,586],[222,458],[292,330],[414,394],[601,329],[904,330],[1062,266],[1178,200],[1015,138],[225,170],[50,266],[1193,682],[797,458]];
    while(i < 10) {
        ran=Math.floor(Math.random() * (29 - 0 + 1) + 0);
        if (coord[ran][0]!=0 && coord[ran][1] !=0) {
            beer1=juego.add.sprite(coord[ran][0],coord[ran][1],'beer');
            coord[ran][0]=0;
            coord[ran][1]=0;
            beer1.animations.add('girar',[0,1,2,3,4],5,true);//TODO:intentar hacer que giren completo
            beers.add(beer1);
            beer1.body.gravity.y=2000;
            i++;
        }
    }


    return beers;
}
 

 
function barrile(){
        //Math.floor(Math.random() * (max - min + 1) + min)
        velocidad=Math.floor(Math.random() * (425 - 200 + 1) + 200) ;
        if (sw1==0) {
            //barril=barriles.create(560,79,'barriles');
            barril=juego.add.sprite(560,79,'barriles');
            barril.animations.add('rodar',[0,1,2,3,4,5,6,7],10,true);
            barriles.add(barril);
            barril.animations.play('rodar');
            barril.body.velocity.x=velocidad;
            sw1=1;
        }else{
            //barril=barriles.create(490,79,'barriles');
            barril=juego.add.sprite(490,79,'barriles');
            barril.animations.add('rodar',[0,1,2,3,4,5,6,7],10,true);
            barriles.add(barril);
            barril.animations.play('rodar');
            barril.body.velocity.x=-velocidad;
            sw1=0;
        }
        juego.physics.enable(barril,Phaser.Physics.ARCADE);
        barril.body.collideWorldBounds= true;
        barril.body.bounce.setTo(1,0);
        barril.body.gravity.y=2000;
        timer= juego.time.now + 1950;
        return barriles;
    }
//incia el juego

//----Pantalla de inicio-----
var startscreen={
    preload:function(){
     
        juego.stage.backgroundColor = "#000000";
        botonsonido:'';
        musica:'';
        playmusica:'';
        this.load.audio('playM','assets/soundplay.mp3');
        this.load.audio('sboton','assets/moneda.mp3');
        juego.load.image('fondo1','img/pantalla inicial.png');
        juego.load.spritesheet('letras','img/letrasinicio.png',400,50);
        this.load.audio('intro','assets/intro.mp3');
    },
    create:function(){
        //---Musica---
        musica=juego.add.audio('intro');
        musica.play('',0,1,true);
        //---Fondo----
        var barkground=juego.add.tileSprite(0, 0, 1480, 920, 'fondo1');
        var botoninicio=this.add.button(juego.world.centerX,420, 'letras',this.start,this,2,0,1);
        botoninicio.anchor.set(0.5);
        playmusica=juego.add.audio('playM');
        this.botonsonido= juego.add.audio('sboton');
    }, 


    start:function(){
    
        musica.stop();
        this.botonsonido.play('',0.3,1,false);
        scene_transition2('inicio',700);playmusica.play('',0,1,true);
        juego.camera.onFadeComplete.add(this.jugar, this);
    

    },

    jugar:function(){
        this.state.start('juego');
        juego.camera.resetFX();
    }

    
};
//precarga
var precarga={
    preload:function(){
        juego.stage.backgroundColor = "#FFF";
        juego.load.image('uninorte','assets/uninorte_logo.png');
    },
    create:function(){
        //-----Logo----
        var un = juego.add.image(juego.width/2, juego.height/2, 'uninorte', this);
        un.anchor.setTo(0.5);
        juego.camera.flash('#000000', 1900);
        juego.camera.onFlashComplete.add(function(){
            if(stopTransition == false){
                setTimeout(function(){
                scene_transition2('inicio', 1900);
                },1900);
                stopTransition = true;
            }
        }, juego);
    }
};

//---Pantalla de perdio---
var gameover={
    saltar:'',
    preload:function(){

        juego.load.image('perdi','assets/maxresdefault.jpg');

    },
    create:function(){
        //----Perdio----
        var b= juego.add.tileSprite(0,0,1280, 640, 'perdi');

        saltar = juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        var text=juego.add.text(juego.width/2,380,"Presione barra espaciadora para volver a empezar",{
        font:"bold 19px sans-serif",fill:"White",align:"center" });
        text.anchor.setTo(0.5);
    },
    update:function(){
        if(saltar.isDown){
            juego.state.start('juego');
            sw=0;
            perdio.stop();
            playmusica.play('',0,1,true);

        };

    }

};

var winSports={
    preload:function(){
        musicaWin:'',
        juego.load.audio('gano','assets/Defeat.mp3');
        juego.load.image('gan','assets/YOUWIN2.png');

    },

    create:function(){
        musicaWin=juego.add.audio('gano');
        juego.add.tileSprite(0,0,1280, 680, 'gan');
        musicaWin.play();

sw=0;
        saltar = juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        var text=juego.add.text(juego.width/2,380,"Presione barra espaciadora para volver a empezar",{
        font:"bold 19px sans-serif",fill:"Black",align:"center" });
        text.anchor.setTo(0.5);
    },
    update:function(){
        if(saltar.isDown){
            juego.state.start('juego');
            sw=0;
            musicaWin.stop();
           playmusica.play('',0,1,true);

        }
},
};



function scene_transition(Stage,time){juego.camera.fade("#000000",time||1000)};
function scene_transition2(Stage,time){juego.camera.fade("#000000",time||500);juego.camera.onFadeComplete.add(function(){juego.state.start(Stage)},juego);};
juego.state.add('perd',gameover);
juego.state.add('prejuego',precarga);
juego.state.add('juego',principalV);
juego.state.add('inicio',startscreen);
juego.state.add('win',winSports);
  juego.state.start('prejuego');