const {log, biglog, errorlog, colorize} = require("./out");
const model = require('./model');



/* Ayuda */

exports.helpCmd = rl => {
	log("Comandos:");
  	log("	h|help -Muestra esta ayuda.");
  	log("	list - Listar los quizzes existentes.");
  	log(" 	show<id> - Muestra la pregunta y la respuesta del quiz indicado.");
  	log("	delete <id> - Borra el quiz indicado.");
  	log("	edit <id> - Editar el quiz indicado.");
   	log(" 	test <id> - Probar le quiz indicado.");
   	log("	p|play - Jugar a preguntar aleatoriamente todos los quizzes.");
   	log( "	credits - Créditos");
   	log(" 	q|quiz - Salir del programa.");
   	rl.prompt();
};

/* Lista */

exports.listCmd = rl => {
	model.getAll().forEach((quiz, id) => {
		log(`  [${colorize(id, 'magenta')}]: ${quiz.question}`);

	});



	rl.prompt();
};

/* Muestra el quiz indicado */

exports.showCmd = (rl, id) => {
	
	if (typeof id === "undefined") {
		errorlog('Falta el parámetro id.');
	} else {
		try{
			const quiz = model.getByIndex(id);
			log(`[${colorize(id, 'magenta')}]: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
		} catch (error) {
			errorlog(error.message);
		}
	}
	rl.prompt();
};


exports.addCmd = rl => {
	
	rl.question(colorize(' Introduzca una pregunta: ', 'red'), question => {

		rl.question(colorize(' Introduzca la respuesta', 'red'), answer => {
			model.add(question, answer);
			log(`  ${colorize('Se ha añadido', 'magenta')}: ${question} ${colorize('=>', 'magenta')} ${answer}`);
			rl.prompt();
		})
	})	
};

exports.deleteCmd = (rl, id) => {

	if (typeof id === "undefined") {
		errorlog('Falta el parámetro id.');
	} else {
		try{
			model.deleteByIndex(id);
		} catch (error) {
			errorlog(error.message);
		}
	}
	rl.prompt();
};

exports.editCmd = (rl, id) => {

	if (typeof id === "undefined") {
		errorlog('Falta el parámetro id.');
		rl.prompt();
	} else {
		try{

			const quiz = model.getByIndex(id);
			process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)},0);
			rl.question(colorize(' Introduzca una pregunta: ', 'red'), question => {
				process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)},0);
				rl.question(colorize(' Introduzca la respuesta ', 'red'), answer => {
					model.update(id, question, answer);
					log(` Se ha cambiado el quiz ${colorize(id, 'magenta')} por: ${question} ${colorize('=>', 'magenta')} ${answer}`);
					rl.prompt();
				});
			});
		} catch (error) { 
			errorlog(error.message);
			rl.prompt();
		}
	}
	
	
};

exports.testCmd = (rl, id) => {
	if (typeof id=== "undefined"){
		errorlog(`Falta el parametro id`);
	}else{
		try{
			const quiz =model.getByIndex(id);
			rl.question(colorize(quiz.question.toString() +'=>','red'), respuesta =>{
				if(quiz.answer.toLowerCase().trim() === respuesta.toLowerCase().trim()){
					log('Su respuesta es correcta.');
					biglog('Correcta', 'green');
					rl.prompt();
				}else{
					log('Su respuesta es incorrecta.');
					biglog('Incorrecta', 'red');
					rl.prompt();
				}
			});
		}catch(error)  {
			errorlog(error.message);

		}
	}
	rl.prompt();
};

exports.playCmd = rl => {
	let score = 0;
	let toBeAsked=[];
	let i=0;
	for (i; i< model.count(); i++)
		toBeAsked[i]=i;

	const playOne=()=>{
		if(toBeAsked.length==0){
			log(`No hay nada mas que preguntar`);
			log(`Tu resultado ha sido:`);
			biglog(score ,'magenta');
			rl.prompt();
		}else{
			let id=  Math.floor((Math.random()*toBeAsked.length));
			if(id >=0){
			try{
				let quiz =model.getByIndex(toBeAsked[id]);
				toBeAsked.splice(id,1);
				rl.question(colorize(quiz.question.toString() +'=>','red'), resultado=>{
			if(resultado.toLowerCase().trim() === quiz.answer.toLowerCase().trim()){
				score+=1;
				log(`Correcto - Lleva ${score} aciertos`);
				playOne();
			}else{
				log(`INCORRECTO`);
				log(`Fin del juego. Aciertos: ${score}`);
				biglog(score, 'magenta');
				rl.prompt();
		    }
	    	});    
			}catch(error){
					errorlog(error.message);
					rl.prompt();
			}}}};
	playOne();
};

exports.creditsCmd = rl => {
	log("Autores de la practica:");
  	log('Guillermo del Pino Barragán', 'green');
	log('Eduardo Ventas Maestre', 'green');
  	rl.prompt();
};

exports.quitCmd = rl => {
	rl.close();
}; 