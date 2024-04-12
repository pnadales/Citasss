const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid')
const _ = require('lodash');
const moment = require('moment')
let today = moment()
const chalk = require('chalk')


const app = express();
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});

function DarFormato(pacientes) {
    let listaPersonas = []
    pacientes.forEach((paciente, indice) => {
        let individuo = `${indice + 1}. Nombre: ${paciente.name.first}, Apellido: ${paciente.name.last}, ID: ${(uuidv4()).slice(0, 6)}, timestamp: ${today.format('MMMM Do YYYY, h:mm:ss a')}`
        listaPersonas.push(individuo)
    });
    return listaPersonas;
}

function ImprimrChalk(personas) {
    personas.forEach(persona => {
        console.log(chalk.blue.bgWhite(persona))
    });
}

// Ruta para obtener datos de Mindicador API
app.get('/consulta', async (req, res) => {
    try {
        const response = await axios.get('https://randomuser.me/api/?results=10');
        const datosPaciente = response.data.results;//Esto es un arreglo de objetos
        // console.log("Valor de response.data: ", datosPaciente)
        // let parcial = (uuidv4()).slice(0, 6)
        let listaPersonas = []
        //Formato
        //i. Nombre, apellido, ID, timestamp
        let [mujeres, hombres] = _.partition(datosPaciente, (paciente) => paciente.gender == 'female')

        mujeres = DarFormato(mujeres)
        hombres = DarFormato(hombres)
        console.log(hombres);

        let paraMostrar = `<h3>Mujeres</h3><p>${mujeres.join('</p><p>')}</p><h3><br>Hombres</h3><p>${hombres.join('</p><p>')}</p>`

        console.log(paraMostrar);
        res.send(paraMostrar)
        console.log(chalk.blue.bgWhite.bold('Mujeres:'))
        ImprimrChalk(mujeres)
        console.log(chalk.blue.bgWhite.bold('Hombres:'))
        ImprimrChalk(hombres)

        // datosPaciente.forEach(paciente => {
        //     let individuo = {
        //         Nombre: paciente.name.first,
        //         Apellido: paciente.name.last,
        //         genero: paciente.gender,
        //         ID: (uuidv4()).slice(0, 6),
        //         timestamp: today.format('MMMM Do YYYY, h:mm:ss a')
        //     }
        //     listaPersonas.push(individuo)
        // });





        // procesando el objeto
        // console.log("Codigo: ", indicadores.uf.codigo);
        // console.log("Nombre: ", indicadores.uf.nombre);
        // console.log("Unidad de Medida: ", indicadores.uf.unidad_medida);
        // console.log("Valor: ", indicadores.uf.valor);
        // console.log("Fecha recortada: ", indicadores.uf.fecha.slice(0,10));




        // res.json(indicadores);
    } catch (error) {
        console.error('Error fetching indicators data:', error);
        res.status(500).json({ error: 'Error fetching indicators data' });
    }
});

