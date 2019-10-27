const express = require('express')
const router = express.Router()

const controller = require('../controllers/controller')
const tareas = new controller()

//Consultar todos los cursos registrados
router.get('/cursos/', (request, response) => {
    tareas.consultarCursos().then((filas) => {
        let respuesta = {}
        respuesta.estado = true
        respuesta.informacion = filas
        respuesta.mensaje = "Cursos registrados actualmente"
        response.status(200).send(respuesta)
    }).catch(error => {
        let respuesta = {}
        respuesta.estado = false
        respuesta.informacion = error
        respuesta.mensaje = "Error al consultar los cursos"
        response.status(400).send(respuesta)
    })
})
//Consultar cupos de un curso especificamente
router.get('/cursos/:id',(request, response) =>{
    let id = request.params.id
    tareas.consultarCuposCurso(id).then((filas)=>{
        let respuesta = {}
        respuesta.estado = true
        respuesta.informacion = "los cupos disponibles para este curso son: "+filas
        respuesta.mensaje = "Curso consultado"
        response.status(200).send(respuesta)
    }).catch(error=>{
        let respuesta = {}
        respuesta.estado = false
        respuesta.informacion = error
        respuesta.mensaje = "Error al consultar"
        response.status(400).send(respuesta)
    })
})

//Registrar un curso
router.post('/cursos/', (request, response) => {
    let curso = request.body
    tareas.agregarCurso(curso).then(() => {
        let respuesta = {}
        respuesta.estado = true
        respuesta.informacion = curso
        respuesta.mensaje = "El curso ha sido agregado con éxito"
        response.status(200).send(respuesta)
    }).catch(error => { //clasificar el error según su código
        if (error.code) {
            console.log(error);
            let respuesta = {}
            respuesta.mensaje = "Error al registrar, el código del curso ya existe"
            response.status(400).send(respuesta)
        }
        let respuesta = {}
        respuesta.estado = false
        respuesta.informacion = error
        respuesta.mensaje = "El curso no se ha agregado"
        response.status(400).send(respuesta)
    })
})

//registrar un estudiante en la base de datos
router.post('/estudiantes/', (request, response) => {
    let estudiante = request.body
    tareas.agregarEstudiante(estudiante).then(()=>{
        let respuesta = {}
        respuesta.estado = true
        respuesta.informacion = estudiante
        respuesta.mensaje = "Estudiante registrado con éxito"
        response.status(200).send(respuesta)
    }).catch(error => { //clasificar el error según su código
        if (error.code) {
            console.log(error);
            let respuesta = {}
            respuesta.mensaje = "Error al registrar, la identificacion del estudiante ya existe"
            response.status(400).send(respuesta)
        }
        let respuesta = {}
        respuesta.estado = false
        respuesta.informacion = error
        respuesta.mensaje = "No se ha registrado el estudiante"
        response.status(400).send(respuesta)
    })
})

//Consultar todos los estudiantes que se encuentran registrados
router.get('/estudiantes/', (request, response) => {
    tareas.consutlarEstudiantes().then((filas)=>{
        let respuesta = {}
        respuesta.estado = true
        respuesta.informacion = filas
        respuesta.mensaje = "Estudiantes registrados hasta el momento"
        response.status(200).send(respuesta)
    }).catch(error => {
        let respuesta = {}
        respuesta.estado = false
        respuesta.informacion = error
        respuesta.mensaje = "Error al consultar estudiantes registrados"
        response.status(400).send(respuesta)
    })
})

//matricular un estudiante en un curso recibiendo por la ruta el codigo de ambos
router.post('/matricular/:estudiante/:curso', (request, response) => {
    let estudiante = request.params.estudiante
    let curso = request.params.curso
    tareas.matricularEstudiante(estudiante, curso).then(() => {
        let respuesta = {}
        respuesta.estado = true
        respuesta.mensaje = "Se registró el estudiante "+estudiante+" en el curso "+curso;
        response.status(200).send(respuesta);
    }).catch(error => {
        //clasificar el error dependiendo su codigo
        if (error.code == 23503) {
            console.log("ERROR: "+error.code);
            let respuesta = {}
            respuesta.estado = false
            respuesta.mensaje = "Error al registrar, el estudiante o el curso no existen"
            response.status(400).send(respuesta)
        }
        console.log("ERROR: "+error.code);
        let respuesta = {}
        respuesta.estado = false
        respuesta.mensaje = "Error: El estudiante "+estudiante+" ya se encuentra registrado en el curso "+curso;
        response.status(400).send(respuesta);
    })
})

module.exports = router