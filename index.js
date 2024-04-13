//Boque de importación
const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid')
const _ = require('lodash');
const moment = require('moment')
const chalk = require('chalk')

let today = moment()
const app = express();
const PORT = 3000;

//Levantamiento del servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});

//funcion que recibe un arreglo con el objeto con los datos de los pacientes, 
//y devuelve un arreglo de strings con los datos de los pacientes en el fomato nuevo
function DarFormato(pacientes) {
    let listaPersonas = []
    pacientes.forEach((paciente, indice) => {
        let individuo = `${indice + 1}. Nombre: ${paciente.name.first}, Apellido: ${paciente.name.last}, ID: ${(uuidv4()).slice(0, 6)}, timestamp: ${today.format('MMMM Do YYYY, h:mm:ss a')}`
        listaPersonas.push(individuo)
    });
    return listaPersonas;
}

//Funcion que imprime por consola cada paciente usando chalk
function ImprimrChalk(personas) {
    personas.forEach(persona => {
        console.log(chalk.blue.bgWhite(persona))
    });
}

// Ruta para obtener los pacientes en listas separadas por género
app.get('/consulta', async (req, res) => {
    try {
        const response = await axios.get('https://randomuser.me/api/?results=11');
        //Arrego de objetos con los datos de la api
        const datosPaciente = response.data.results;
        //partition para separar según el género y generar guardar los nuevos arreglos en las variables mujeres y hombres
        let [mujeres, hombres] = _.partition(datosPaciente, (paciente) => paciente.gender == 'female')
        //Se aplica la funcion DarFormato a cada arreglo y se guarda en la misma variable
        mujeres = DarFormato(mujeres)
        hombres = DarFormato(hombres)

        //Variable con los datos para mostrar de ambos arreglos
        let paraMostrar = `<h2>Mujeres</h2><p>${mujeres.join('</p><p>')}</p><h2><br>Hombres</h2><p>${hombres.join('</p><p>')}</p>`
        //responde a la ruta con los datos para mostrar
        res.send(paraMostrar)

        // Se imprimen los datos por consola usando chalk
        console.log(chalk.blue.bgWhite.bold('Mujeres:'))
        ImprimrChalk(mujeres)
        console.log(chalk.blue.bgWhite.bold('Hombres:'))
        ImprimrChalk(hombres)

    } catch (error) {
        res.send('Hubo un Error')
    }
});

//Ruta genérica para rutas inválidas
app.get('*', (req, res) => {
    res.send('Ruta inválida :c\n <a href="/consulta"><button>Ir a consultar</button></a>')
})