require('dotenv').config(); 

const Discord = require("discord.js");
const preguntas = require("./preguntas.json")
const elogios = require("./elogios.json")
const fails = require("./fails.json")

const prefix = "?";

const client = new Discord.Client();

var x = 0;
var y = 0;

var tab_x = 4;
var tab_y = 4;

var matrix = [];

var preguntaOn = false
var quienPregunto = ""
var preguntaActiva = {}

initMatrix()

function initMatrix(){
  /*
  PROPOSITO: iniciar el tablero
  PRECONDICIÓN: Ninguna
  */
  matrix = [];
  for(var i=0; i<tab_y; i++) {
    matrix[i] =[]
    for(var k=0;k<tab_x; k++){
      matrix[i][k] = ':white_large_square:'
    }
  } 
}

function configTable(x,y){
  /*
    PROPOSITO: cambiar el tamaño del tablero
    PRECONDICIÓN: 
        - x no puede ser menor a 1 y mayor a 8
        - y no puede ser menor a 1 y mayor a 8
    PARAMETROS: 
        - x: es numerico, representa el ancho del tablero
        - y: es numerico, representa el alto del tablero
  */
  tab_x = x;
  tab_y = y;
  restart()
}


function poner(color){
  /*
    PROPOSITO: Pone una bolita de color "color"
    PRECONDICIÓN: Ninguna
    PARAMETROS: 
        - color: es tipo Color, es el color a poner
  */
  matrix[x][y] = color
  return(printMatrix())
}

function sacar(color){
  /*
    PROPOSITO: Saca una bolita de color "color"
    PRECONDICIÓN: Debe existir una bolita de color "color
    PARAMETROS: 
        - color: es tipo Color, es el color a sacar
  */
  if(color == printCelda(x,y)){
    matrix[x][y] = ':white_large_square:'
    return(printMatrix())
  }
  return boom('No puedes sacar un color que no existe')
}

function hayBolitas(color){
    /*
    PROPOSITO: Dice si hay bolita en la celda actual
    PRECONDICIÓN: Ninguna
    PARAMETROS: 
        - color: es tipo Color
  */
  return color === printCelda(x,y)
}

function boom(message){
    /*
    PROPOSITO: Explota por los aires y devuelve el mensaje 'mensaje'
    PRECONDICIÓN: Ninguna
    PARAMETROS: 
        - message: es tipo String, es el mensaje a mostrar
  */
  restart();
  return `:boom::boom::bangbang:BOOM:bangbang::boom::boom:(${message})`;
}

function restart(){
  x=0;
  y=0;
  initMatrix()
}

function hacerPregunta(pregunton){
  /*
    PROPOSITO: hace una pregunta al azar
    PRECONDICIÓN: Ninguna
    PARAMETROS: 
        - pregunton: es tipo String, es el nombre del que pregunta
  */
  quienPregunto = pregunton;
  preguntaOn = true;
  return preguntaAlAzar()

}

function hacerPreguntaDe(pregunton,laUnidad){
  /*
    PROPOSITO: hace una pregunta al azar
    PRECONDICIÓN: Ninguna
    PARAMETROS: 
        - pregunton: es tipo String, es el nombre del que pregunta
        - laUnidad: es tipo Int, es el número de la unidad
      */
  quienPregunto = pregunton;
  preguntaOn = true;
  return preguntaDe(laUnidad)

}


function preguntaDe(laUnidad){
  const preguntasDeLaUnidad = preguntas.preguntas.filter(pregunta => pregunta.unidad == laUnidad)
  preguntaActiva =  preguntasDeLaUnidad[getRandomInt(0,preguntas.preguntas.length)]
  respuestasPosibles = '';
  preguntaActiva.posibleRespuesta.forEach(element => {
    respuestasPosibles += `   :ballot_box_with_check: ${element}`
  });
  return `
  :question: ${preguntaActiva.pregunta}
  
  ${respuestasPosibles}
  
  `
}


function preguntaAlAzar(){
  preguntaActiva =  preguntas.preguntas[getRandomInt(0,preguntas.preguntas.length)]
  respuestasPosibles = '';
  preguntaActiva.posibleRespuesta.forEach(element => {
    respuestasPosibles += `   :ballot_box_with_check: ${element}`
  });
  return `
  :question: ${preguntaActiva.pregunta}
  
  ${respuestasPosibles}
  
  `
}

function revisarRespuesta(respuesta){
  return preguntaActiva.respuesta == respuesta.toLowerCase();

}

function mover(direccion){
  switch(direccion){
    case "Norte": y +=1 ;break;
    case "Sur" : y-=1; break;
    case "Este" : x+=1;break;
    case "Oeste" : x-=1;break;
  }
  if(x<0 || x>tab_x-1 ||y<0 || y>tab_y-1){
    return boom(`Te caiste del tabler en dirección ${direccion}`);
  }
  return(printMatrix())
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


function puedeMover(direccion){
  res = false;
  switch(direccion){
    case "Norte": res = y <tab_y-1 ;break;
    case "Sur" : res = y>0; break;
    case "Este" : res = x<tab_x-1;break;
    case "Oeste" : res = x>0;break;
  }
  return res;
}


function printMatrix(){
  res = "\n|"
  for(var i=tab_y-1; i>-1; i--) {
    for(var w=0; w<tab_x; w++) {
      res = res + printCelda(w,i) + '|'
    }
    res = res +'\n '+ lineFor(tab_x)+ '\n|';
  } 
  return res;
}

function lineFor(chosses){
  res = '--'
  for(var i= 0; i < chosses; i++){
    res += '----';
  }
  return res;
}

const help = 
`
:arrow_right: PROCEDIMIENTOS
  :small_orange_diamond: Poner(color)
  :small_orange_diamond: Sacar(color)
  :small_orange_diamond: Mover(dirección)

:arrow_right: FUNCIONES
  :small_orange_diamond: puedeMover(dirección)
  :small_orange_diamond: hayBolitas(color)


:arrow_right: EJERCITACIÓN
  :small_orange_diamond: pregunta al azar
  :small_orange_diamond: pregunta unidad x

:arrow_right: CONFIGURACIÓN
  :small_orange_diamond: configurarTablero(x,y)
  :small_orange_diamond: inicializar()

:arrow_right: AYUDA
  :small_orange_diamond: help


:construction: https://github.com/wisaku/gobstonesBot

`;

function printCelda(i,w){
  if(x === i && y ===w){
    return matrix[i][w].replace("large_square", "circle").replace("square", "circle");
  }
  return matrix[i][w]
}

function verRespuesta(respuesta){
  if(revisarRespuesta(respuesta)){
    const exp =  elogios[getRandomInt(0,elogios.length)]
    return `:white_check_mark: CORRECTO (${exp})`
  }else{
    const exp =  fails[getRandomInt(0,fails.length)]
    return `:x: ERROR (${exp})`
  }
}


client.on("message", function(message) { 
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift();

  if(preguntaOn){
    message.reply(verRespuesta(commandBody));
    preguntaOn = false;
  }else{
    switch(command){
      case "hola" : message.reply(`Hola ${message.author.username}`);break;  
      case "Mover(Norte)" : message.reply(mover('Norte')); break;
      case "Mover(Sur)" : message.reply(mover('Sur')); break;
      case "Mover(Este)" : message.reply(mover('Este')); break;
      case "Mover(Oeste)" : message.reply(mover('Oeste')); break;
  
      case "Poner(Negro)" : message.reply(poner(':black_large_square:')); break;
      case "Poner(Rojo)" : message.reply(poner(':red_square:'));break;
      case "Poner(Azul)" : message.reply(poner(':blue_square:'));break;
      case "Poner(Verde)" : message.reply(poner(':green_square:'));break;
  
      case "Sacar(Negro)" : message.reply(sacar(':black_circle:')); break;
      case "Sacar(Rojo)" : message.reply(sacar(':red_circle:'));break;
      case "Sacar(Azul)" : message.reply(sacar(':blue_circle:'));break;
      case "Sacar(Verde)" : message.reply(sacar(':green_circle:'));break;
  
      case "hayBolitas(Negro)" : message.reply(hayBolitas(':black_circle:')); break;
      case "hayBolitas(Rojo)" : message.reply(hayBolitas(':red_circle:'));break;
      case "hayBolitas(Azul)" : message.reply(hayBolitas(':blue_circle:'));break;
      case "hayBolitas(Verde)" : message.reply(hayBolitas(':green_circle:'));break;
  
      case "puedeMover(Sur)" : message.reply(puedeMover('Sur')); break;
      case "puedeMover(Este)" : message.reply(puedeMover('Este')); break;
      case "puedeMover(Oeste)" : message.reply(puedeMover('Oeste')); break;
      
      case "inicializar()": message.reply(restart())
  
      case "help" : message.reply(help); break;
      case "preguntaUnidad(1)" : message.reply(hacerPreguntaDe(message.author.username),1); break;
      case "preguntaUnidad(2)" : message.reply(hacerPreguntaDe(message.author.username),2); break;
      case "preguntaUnidad(3)" : message.reply(hacerPreguntaDe(message.author.username),3); break;
      case "preguntaUnidad(4)" : message.reply(hacerPreguntaDe(message.author.username),4); break;
      case "preguntaUnidad(5)" : message.reply(hacerPreguntaDe(message.author.username),5); break;
      case "preguntaUnidad(6)" : message.reply(hacerPreguntaDe(message.author.username),6); break;
      case "preguntaUnidad(7)" : message.reply(hacerPreguntaDe(message.author.username),7); break;
      case "preguntaUnidad(8)" : message.reply(hacerPreguntaDe(message.author.username),8); break;
      case "preguntaUnidad(9)" : message.reply(hacerPreguntaDe(message.author.username),9); break;
      case "preguntaAzarosa" : message.reply(hacerPregunta(message.author.username)); break;
      default: configuracionOError(message, command)
    
    }
  }

});  

function configuracionOError(message, command){
  if(command.startsWith("configurarTablero")){
    const commandBody = message.content.slice("configurarTablero".length+2).replace(')','');
    const args = commandBody.split(',');
    console.log(args)
    if(args[0]> 8 || args[1]>8){
      message.reply(`El tablero no puede exceder 8x8`);  
    }
    if(args[0]< 1 || args[1]<1){
      message.reply(`El tablero no puede tener menos de  1x1`);  
    }
    configTable(parseInt(args[0], 10),parseInt(args[1], 10))
  }else{
    message.reply(`el comando ${command} no es valido!`);
  }
}

client.login(process.env.TOKEN);
