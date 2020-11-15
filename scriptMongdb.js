//Insert
db.prueba.insert([{"_id":1, "nombre":"Victor"},{"_id":2, "nombre":"Victor1"},{"_id":3, "nombre":"Victor2"},{"_id":4, "nombre":"Victor3"}]);
db.prueba.find()

//Delete
db.prueba.remove({"_id":1})
db.prueba.remove({"_id":2})
db.prueba.remove({})
db.prueba.drop()
db.personas.find()

//Update
//Caso: Actualizar un documento
//Guardamos en una variable los datos a modificar
var persona=db.personas.findOne({"nombre":"juan"});
persona.relaciones={"amigos":persona.amigo, "enemigos":persona.enemigos};
persona.primerNombre=persona.nombre;

//De la variable persona eliminamos los atributos amigo, enemigos y nombre
delete persona.amigo
delete persona.enemigos
delete persona.nombre

//En la coleccion personas, actualizamos el documento con nombre=juan, con los valores de la variable "persona"
db.personas.update({"nombre":"juan"}, persona)
db.personas.find()


//Caso: Actualizar varios documentos con el mismo valor
//Recuperamos el registro a actualizar
persona=db.personas.findOne({"nombre":"Juan", "edad":33})
persona.edad=40
persona
//Actualizamos en la cleccion persona el documento con el nombre juan y edad 33
db.personas.update({"nombre":"Juan", "edad":33}, persona)
db.personas.find({})


//MODIFICADORES $inc $set $unset
//$inc
//Se utilizan cuando se realizan ciertas actualizaciones
//incrementar las visitas
db.blog.update({"URL":"www.udemy.com"},{"$inc":{"visitas":30}})
//Sino existe el atributo para incrementar lo adiciona al documento.
db.blog.update({"URL":"www.udemy.com"},{"$inc":{"enlaces":5}})

//$set
//Agregar o modifica cualquier otro tipo de campo
//parecido al update SET
db.blog.update({"_id":ObjectId("5e236421551db322afd090e5")},{"$set":{"libroFavorito":"La guerra y la paz"}})
db.blog.update({"_id":ObjectId("5e236421551db322afd090e5")},{"$set":{"libroFavorito":"El quijote"}})
db.blog.update({"_id":ObjectId("5e236421551db322afd090e5")},{"$set":{"libroFavorito":["La guerra y la paz","El quijote"]}})


//$unset
//Elimina cualquier atributo.
//Para el ejemplo elimina el atributo libroFavorito: 1 (1 significa que se borrara un campo)
db.blog.update({"_id":ObjectId("5e236421551db322afd090e5")},{"$unset":{"libroFavorito":1}})


//MODIFICADORES de arrays $push y $each
//$push
//agregar un elemento a un arreglo. Si el arreglo no existe lo crea.
db.blog.update({"_id":ObjectId("5e23688a551db322afd09164")},
                {"$push":
                    {"comentarios":
                        {
                            "nombre":"Juan",
                            "email":"juan@ejemplo.com",
                            "contenido":"Comentario de juan"
                        }
                    }
                }
              )


//$each
//Permite agregar varios valores en un arreglo
db.blog.update({"_id":ObjectId("5e23688a551db322afd09164")},
                {"$push":
                    {"comentarios":
                        {$each:[
                            {
                            "nombre":"maria",
                            "email":"maria@ejemplo.com",
                            "contenido":"Comentario de maria"
                            },
                            {
                            "nombre":"grace",
                            "email":"grace@ejemplo.com",
                            "contenido":"Comentario de grace"
                            }
                        ]}
                    }
                }
              )

db.blog.find()

//MODIFICADORES de arrays $slice y $sort
//$slice
//Permite poner una logitud al Array
//En el ejemplo se inserta los tres ultimos elementos (-3)                
db.peliculas.update({"genero":"accion"},
    {"$push":
        {"top10":
            {"$each":
                [
                    {"nombre":"avatar"},
                    {"nombre":"guerra de las galaxias"},
                    {"nombre":"Roma"},
                    {"nombre":"Muerte en altamar"},
                    {"nombre":"Apocalipsisi"}
                ],"$slice":-3
            }
        }
    }
)
                
                
//$sort
//Ordena al actulizar. -1=descendente; 1=asendente
db.peliculas.remove({"genero":"accion"})

db.peliculas.insertOne({"genero":"accion"})

db.peliculas.update({"genero":"accion"},
    {"$push":
        {"top10":
            {"$each":
                [
                    {"nombre":"avatar", "valoracion":4},
                    {"nombre":"guerra de las galaxias", "valoracion":3},
                    {"nombre":"Roma", "valoracion":5},
                    {"nombre":"Muerte en altamar", "valoracion":2},
                    {"nombre":"Apocalipsisi", "valoracion":1}
                ],"$slice":5, "$sort":{"valoracion":-1}
            }
        }
    }
)

db.peliculas.find()
    
    
//Upsert
//El tercer parametro del update.
//Permite crear un documento si no encuentra.

//Caso 1: Con algoritmo
var blog= db.blog.findOne({"URL":"www.victor.com"})
if(blog)
{
    blog.visitas++;
    db.blog.save(blog);
}
else
{
    db.blog.save({"URL":"www.victor.cruz", "visitas":1});
}
                
//Caso 2: Adiciona el documento en caso de no existir 
db.blog.update({"URL":"www.grace.com"},{"$inc":{"visitas":1}},true)

db.blog.find()


//ACTUALIZACION DE MULTIPLES DOCUMENTOS
//El 4to parametro de update igual a true permite actualizar todas las coincidencias.
db.personas.update({"nombre":"Juan"}, {"$set":{"cumpleanos":"15/12/1990"}},false, true)
db.personas.find()



//CONSULTAS
//FIND
//Permite retornar un subconjunto de una coleccion
//Es como hacer un where
db.getCollection('personas').find()
db.personas.find({})
db.personas.find({"edad":32})
db.personas.find({"edad":32})
db.personas.find({"edad":32, "nombre":"Juan"})
db.personas.find({"edad":32},{"nombre":1, "edad":1})
db.personas.find({"edad":32},{"edad":0})


//FINDONE
//Variacion del metodo find, selecciona un solo documento
db.personas.findOne({"nombre":"Juan"})


//OPERADORES CONDICIONALES
//db.personas.drop()
db.personas.find()

//Que personas tienen la edad en 18 y 30 anos
db.personas.find({"edad":{"$gte":18, "$lte":30}})

//Obtener los registros menores a un fecha
fecha=new Date("01/01/2017")
db.personas.find({"registro":{"$lt":fecha}})

//Obtener los nombres distintos de Juan
db.personas.find({"nombre":{"$ne":"Juan"}})


//OPERADOREs $not, $and, $or
db.personas.find({"nombre":{"$not":{"$ne":"Juan"}}})

//Devolver todas las personas que empiecen con J y la edad 34 
db.personas.find({"$and":[{"nombre":/^J/},{"edad":34}]})

//Obtener los nombre Juan y mayors a 30
db.personas.find({"$and":
    [
        {"nombre":/^J/},
        {"edad":{"$gte":30}}
    ]
                })


db.personas.find({"$or":[{"nombre":/^J/},{"edad":34}]})


//EXPRESIONES REGULARES
//Se utilizan para recuperar cadenas
//MongoDB utilizar Regular Expresion
//El primer caracter "/" y "i" le indican a mongodb que es una expresion regular
//Obtener todos los nombre que contenga la letra "ua" seguidos
db.personas.find({"nombre":/ua/i})
//Obtener todos los nombre que contengan las letra "ua"
db.personas.find({"nombre":/ua?/i})


//CONSULTAS SOBRES ARRAYS
db.comida.insert({"frutas":["manzana","platano","melocoton"]})
db.comida.insert({"frutas":["pera","coco","platano"]})

db.comida.find({"frutas":"platano"})
db.comida.find()

//Las consultas de rangos sobre arrays no tiene mucha efectividad
db.prueba.find({"x":{"$gt":10, "$lt":20}})


//CONSULTAS SOBRE DOCUMENTOS ENBEBIDOS (video cortado)
//Forma:1.Obtener el documento 2
db.alumnos.find({"datos-personales":{"nombre":"Pedro", "apellido":"Ramirez","edad":22}})
//Forma:2.Obtener el documento 2
db.alumnos.find({"datos-personales.nombre":"Pedro", "datos-personales.apellido":"Ramirez"})


//CONSULTAS WHERE
//Hay consultas que no se pueden realizara facilmente, entonces utilziar "where"
//Las consultas con where son mas lentas por que utiliza notacion javascritp
db.comida.insert({"manzana":1,"platano":4,"melocoton":3})
db.comida.insert({"manzana":8,"platano":4,"melon":4})

db.comida.find
(
    {"$where":
        function()
        {
            for(var a in this)
            {
                for(var b in this)
                {
                    if(a!=b && this[a]==this[b])
                        return true;
                }
            }
            return false;
        }
            
     }
)

db.comida.find()


db.comida.find()


//FRAMEWORK DE AGREGACION EN MONGODB
//Las agregaciones tienen como objetivo tratar grandes cantidades de datos.     

//Agregacion mediante tuberias
//Se utiliza cuando se tiene varios datos.     
//Cada operacion se envia en un arreglo.
//     
db.ordenes.aggregate(
     [
        {$match:{"estado":"A"}},
        { $group:{_id:"$cliente_id", total:{$sum:"$cantidad"}}}
     ]
)

db.ordenes.find()        
        
//Map Reduce
//El framework de agregacion creado para realizar operaciones en grandes colecciones de datos google.
        
//Las operaciones se hacen en tres pasos.
//Etapa map: 
//Se procesa por cada y se emite uno o varios documentos por cada objetos procesado
//El resultado de map devuleve tuplas de clave valor.

//Etapa reduce: 
//Se combinan las salidas de la etapa anterior.
//Se realizan operaciones: agrupar, sumar, totales.
        
//Etapa finalice
//Permite realizar modificaciones adicionales a las salidas de la etapa reduce.
        

db.getCollection('ordenes').find({})

db.ordenes.mapReduce(
    function(){emit(this.cliente_id, this.cantidad);}, //Map, que valores se va a trabajar del documento inicial
    function(key, values){return Array.sum(values)},//Reduce, toma el resultado anterior. Trabaja sobre la tupla clave valor. Realiza la sumatorioa.
    {
        query:{estado:"A"},
        out:"Totales_Pedidos" //La salida va a ser un documento
    }
)
     
//flujo
//1. Filtra todos los documentos con estado "A".Genera documentos intermedios.
//2. Map. Ejecuta la funcion map. Se hace un emit. genera un arreglo de las cantidades.Agrupa por cliente_id y los valores cantidad lo agrupa en un array.
//3. Reduce. Se trabaja con el resultado de map para realizar la sumatorioa.


//Operaciones de proposito unico.
//Son un conjunto de comandos que forman parte del framework de agregacion
//count
db.ventas.count({"item":"abc"})
db.ventas.count({"item":"xyz"})
db.ventas.count({"item":"jkl"})

//distinct
db.ventas.distinct("item",{"precio":10})

//group
db.ventas.aggregate(
    [{
        $group:{
            _id:{
                mes:{$month:"$fecha"},
                dia:{$dayOfMonth:"$fecha"},
                anio:{$year:"$fecha"}
                },
            precioTotal:{$sum:{$multiply:["$precio","$cantidad"]}},
            cantidadMedia:{$avg:"$cantidad"},
            cantidad:{$sum:1}
        }
    }]
)


//INDICES
//Crear indices
//En las colecciones donde hacemos mas consultas tratar de evitar muchas insercinoes.
//Algunas empresas haces el REINDEXADO de la tablas.    
//Solo se puede definir 40 inidices por coleccion.
//MOngoDB crea un indice por defecto para el atributo _iid
db.post.getIndexes()
db.post.createIndex({"etiquetas":1}) //1=ordenado de forma ascendente


//Crear un indice de documento embebido
db.post.createIndex({"autor.email":1})
db.post.getIndexes()


db.post.find({
    "etiquetas":{
        "$all":["java"]
        }
})

db.post.find({"autor.email":"grover@mail.com"})


//Crear indices unicos
//Un indice es unico cuando los datos que va almacenar son unicos
//El nombre del usuario, correo tienen que ser indices unicos

db.personas.createIndex({"email":1},{unique:true})
db.personas.getIndexes()


//Indices compuestos
//Se usa todo el subdocumento como indice
//Al seleccionar hay que hacer con todos los campos de autor.
db.post.createIndex({"autor":1})
db.post.find({"autor":{"nombre":"Grover", "email":"grover@mail.com"}})
db.post.getIndexes()


//Opciones sobre los indices
//Existen dos opciones: reindexacion en segundo plano e indices unicos.

//1.Reindexado en background
//MongoDB, trabajara en el reindexado. La indexacion en segundo plano no bloquea la coleccion.
//coleccion.createIndex({campo:1},{opcion1:true, opcion2:true,...})
db.post.createIndex({"autor.nombre":1},{"background":true})
db.post.getIndexes()

//2.Indice unico
//coleccion.createIndex({campo:1},{"unique":true, "dropdups":true})
//con la opcion dropdups elimina los documentos repetidos.


//ELIMINACION DE INDICES
//En mongodb no existe la opcion de modificar indices. Para modificar hay eliminar y crearlo.
db.post.getIndexes()
db.post.dropIndex({"etiquetas":1})
db.post.dropIndexes()




























