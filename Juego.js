		var juego=new Phaser.Game(1280,640,Phaser.AUTO,'bloqueJuego');
var map;
var layer;
var sw=0,sw1=0,sw3=0;
var timer=0; 
var stopTransition = false;
var monedas=0;
var principalV={
	/*
    Todo:cervezas 

	Universidad del Norte**/

render: function render() {

        juego.debug.cameraInfo(juego.camera, 32, 32);
        juego.debug.spriteCoords(jugador, 32, 500);
   },
	preload:function preload(){

 	   //cargar los recursos
 	   perdio:'',
 	  juego.load.image('suelo','img/platform.png');
      juego.load.image('jaula','assets/ja.png');
 	  juego.load.image('platformas','assets/plataforma.png');
      juego.load.tilemap('map',"assets/mapaPrueba.csv"); 
      juego.load.image('tileset','assets/fondo1.png'); 
      juego.load.spritesheet('dk','assets/dktileset4.png', 71, 109);
      juego.load.image('barrildk','assets/barril3.png');  
      juego.load.spritesheet('princess','assets/princessCINCOO.png',48,71);
      juego.load.spritesheet('personaje','assets/marioporfin.png',36,54);
      juego.load.spritesheet('barriles','assets/barril1.png',37,42);
      juego.load.spritesheet('beer','img/Food.png',34,32);
      juego.load.audio('perdio','assets/perdida.mp3');

      //pruebaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
      //juego.load.spritesheet('dkwalk','assets/dktileset1.png',49,50);
 },

    create: function create(){//aqui se- muestra todo
        //----Mapa----
        map= juego.add.tilemap('map',32,32);
        map.addTilesetImage('tileset');
        map.addTilesetImage('jaula');
        map.addTilesetImage('platformas');
        layer = map.createLayer(0);
        layer.resizeWorld();
        jugador:'',
        map.setCollisionBetween(0,0);
        map.setCollisionBetween(6,8);

 	    juego.physics.startSystem(Phaser.Physics.ARCADE);
        juego.world.setBounds(0, 0, 1280, 1200);
		//fondo=juego.add.tileSprite(0,0,1280, 1200,'fondo');//mostrar el fondo

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

        //pruebaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
        //dkwalk=juego.add.sprite(500,115,'dkwalk');
        //dkwalk.animations.add('walk',[1,2,3,4,5,6,7],5,true);

        //---Jugador----
        jugador = juego.add.sprite(0, juego.world.height-150, 'personaje');//mostrare el personaje
 	    juego.physics.arcade.enable(jugador);
 	    jugador.body.bounce.y=0.1;
		jugador.body.gravity.y= 1000;
        jugador.jump=-1000;
	    jugador.body.collideWorldBounds = true;
        perdio=juego.add.audio('perdio');
        jugador.animations.add('right', [1,2], 10, true);
        jugador.animations.add('left', [7,0], 10, true);
        die=jugador.animations.add('die',[3,4,5,6],5,false);
        
        //----Barriles---
        juego.add.image(576,115,'barrildk');
        juego.add.image(610,115,'barrildk');
        juego.add.image(480,115,'barrildk');
        juego.add.image(446,115,'barrildk');
        barriles=juego.add.group();
        barriles.enableBody=true;

        //---Princesa-

        princess=juego.add.sprite(735.50,0,'princess');
        princess.animations.add('cry',[2,1,0],2,true);
		cursors = juego.input.keyboard.createCursorKeys();
        
        //---Camara---
        juego.camera.setSize(1280,640);
        juego.camera.follow(jugador, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

        //---Monedas---
        beers=juego.add.group();
        beers.enableBody=true;
        beers=polas();

},
    
    update:function update(){
        //las animaciones
       
        //----Barriles---
        if(juego.time.now > timer){
            //dkwalk.animations.stop();//prueeeeeeeeeeeeeeeeeeeeeeeeebaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            //dkwalk.frame=0;//pppppp  
            
            if (sw1==1) {
                dk.animations.play('right');
            }else{
                dk.animations.play('left');
            }
            
            barriles=barrile();
        }/*else{

            if (dkwalk.position.x==610) {
                sw3=1;
            }else if(dkwalk.position.x==446){
                sw3=0;    
            }
            //dk.animations.stop();//prueeeeeeeeeeeeeeeeeeeeeeeeebaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            //dk.frame=0;//pppppp
            if (sw3==0) {
                dkwalk.animations.play('walk');//aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                dkwalk.position.x-= -1;
            }else{
                dkwalk.animations.play('walk');
                dkwalk.position.x-=1;
            }
            dk.animations.stop();
        }*/

        barriles.forEach(function(barril) {
            juego.physics.arcade.overlap(jugador,barril,colibarriles,null,this);   
            if(barril.position.y>=1090 && barril.position.x==0){
                barril.kill();   
            }

        }, juego);

        //---Monedas---
      beers.forEach(function(beer1){
	   beer1.animations.play('girar');},juego);
         
        //---Princesa----
        princess.animations.play('cry');

        //---Colisiones Juego        
        var hitPlatform = juego.physics.arcade.collide(jugador,plataformas);
        jugador.body.velocity.x = 0;
        coord=juego.physics.arcade.collide(jugador,layer);
        juego.physics.arcade.collide(barriles, layer);
        juego.physics.arcade.collide(barriles,plataformas);
        juego.physics.arcade.collide(beers,layer);
          if(coord){

        	console.log(jugador.position.x&" "&jugador.position.y);
        }
        //---Controles----
        if (cursors.left.isDown)
        {
            //  Move to the left

            jugador.body.velocity.x = -350;
            jugador.animations.play('left');
            sw=1;

        }
        else if (cursors.right.isDown)
        {
            //  Move to the right
           
            jugador.body.velocity.x = 350;
            jugador.animations.play('right');
            sw=0;

        }
        else
        {
            //  Stand still

           
            if(sw==1){
              jugador.animations.stop();
            jugador.frame=7;
            }
            if(sw==0){
 jugador.animations.stop();
                jugador.frame=1;
            }
           
             }


        if (cursors.up.isDown && (jugador.body.touching.down || jugador.body.onFloor() ) )
        {
            jugador.body.velocity.y = jugador.jump;
        }
       
         
        
 
} //, 
    //render: function render() {

        //juego.debug.cameraInfo(juego.camera, 32, 32);
        //juego.debug.spriteCoords(jugador, 32, 500);

    //},
    

    
};
function colibarriles(jugador,barril,hitPlatform){
sw=3;
barril.kill();
//perdio.play();
//playmusica.stop();
//die.play();


  /*  
  animaci = juego.add.tween(die);
        animaci.to({ y: jugador.position.y,x:jugador.position.x }, 1000, null,this);
        animaci.start();
        animaci.onComplete.add(function() { 

            if(die.isFinished){
                jugador.body.gravity.y= 1000;
          juego.state.start('perd');}

          
        }, this);


//juego.state.start('perd');
 */
}
    
 
function polas(){
// se deben crear 10 cervezas por todo el mapa



beer1=juego.add.sprite(350,920,'beer');
beer1.animations.add('girar',[0,1,2,3,4],5,true);//TODO:intentar hacer que giren completo
beers.add(beer1);
beer1.body.gravity.y=2000;



return beers;
}
 

 
function barrile(){
        //Math.floor(Math.random() * (max - min + 1) + min)
       /* velocidad=Math.floor(Math.random() * (425 - 200 + 1) + 200) ;
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
        timer= juego.time.now + 1950;*/
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


}
,
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
    var text=juego.add.text(juego.width/2,400,"Presione una tecla para volver a empezar",{
     font:"bold 19px sans-serif",fill:"White",align:"center" });
    text.anchor.setTo(0.5);
},
update:function(){
 if(saltar.isDown){
  juego.state.start('juego');
  perdio.stop();
  playmusica.play('',0,1,true);

 
};

}



};
function scene_transition(Stage,time){juego.camera.fade("#000000",time||1000)};
function scene_transition2(Stage,time){juego.camera.fade("#000000",time||500);juego.camera.onFadeComplete.add(function(){juego.state.start(Stage)},juego);};
juego.state.add('perd',gameover);
juego.state.add('prejuego',precarga);
juego.state.add('juego',principalV);
 juego.state.add('inicio',startscreen);
  juego.state.start('juego');