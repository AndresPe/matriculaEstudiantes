const { Client } = require('pg')

// clase donde se tendran todos los requerimientos que se le haran a la web
class Tareas {
    constructor(){
        this.miDb = new Client({//conexion a la base de datos
            user: 'postgres',
            host: 'localhost',
            database: 'matricula',
            password: 'admin',
            port: 5432,
        })
        this.conexion().then(()=>{
            console.log("Conectado");
        }).catch((error)=>{
            console.log("ERROR al conectar con la base de datos");
        })
    }
    async conexion() {
        await this.miDb.connect()
    }

    async consultarCursos(){// método que permite consultar en la base de datos los cursos registrados
        let query = "SELECT * FROM cursos"
        let cursos = await this.miDb.query(query)
        return cursos.rows
    }
    
    async consultarCuposCurso(id){ //permite consultar los cupos disponibles de un curso
        let query = " SELECT cupos FROM cursos WHERE codigo = "+id;
        let cuposTotales = await this.miDb.query(query)
        let query2 = "SELECT count(*) FROM matricula_cursos WHERE codigo_curso = "+id;
        let cuposOcupados = await this.miDb.query(query2)
        let cuposDisponibles = cuposTotales.rows[0].cupos - cuposOcupados.rows[0].count;

        console.log("los cupos disponibles para ese curso son: "+cuposDisponibles);
        
        return cuposDisponibles
    }
    
    async agregarCurso(curso){//permite agregar un curso a la base de datos
        let query = `INSERT INTO public.cursos(
                 codigo, nombre, descripcion, cupos)
            VALUES (${curso.codigo}, '${curso.nombre}','${curso.descripcion}',
                ${curso.cupos});`
        let respuesta = await this.miDb.query(query)

        return respuesta;
    }

    async agregarEstudiante(estudiante){//permite agregar un estudiante a la base de datos
        let query = `INSERT INTO public.estudiantes(identificacion, nombres, apellidos)
            VALUES ('${estudiante.identificacion}', '${estudiante.nombres}', '${estudiante.apellidos}')`
        let respuesta = await this.miDb.query(query)
        return respuesta;
    }

    async consutlarEstudiantes(){//permite consultar los estudiantes registrados en la base de datos
        let query = "SELECT * FROM estudiantes"
        let respuesta = await this.miDb.query(query)
        return respuesta.rows;
    }

    async matricularEstudiante(idEstudiante, codigoCurso){//permite insertar un registro en la tabla matricula_curso
        let query = `INSERT INTO public.matricula_cursos(id_estudiante, codigo_curso)
        VALUES(${idEstudiante}, ${codigoCurso})`
        respuesta = await this.miDb.query(query)
        return respuesta;
    }
}



module.exports = Tareas