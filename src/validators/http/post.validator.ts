import { body, param, query } from "express-validator";

const middlewaresPostValidator = [
    /*body("usuarioId") // ESTE DEBE DE VENIR DEL TOKEN
        .notEmpty().withMessage("Debe especificar un usuarioId")
        .isInt().withMessage("usuarioId no válido")
        .toInt(),*/
    body("titulo")
        .notEmpty().withMessage("El título es obligatorio")
        .isLength({ min: 1, max: 255 }).withMessage("El título debe tener entre 1 y 255 caracteres")
        .optional(),
    body("tipo")
        .notEmpty().withMessage("El tipo de post es obligatorio")
        .isIn(['reporte','publicidad','aviso']).withMessage("Tipo de post no válido"),
    body("categoriaId")
        .optional()
        .notEmpty().withMessage("La categoria debe contener un valor")
        .isInt().withMessage("categoriaId no válido")
        .toInt(),
    body("descripcion")
        .notEmpty().withMessage("La descripcion del post es obligatoria"),
    body("lat")
        .optional()
        .isFloat({ min: -90, max: 90 }).withMessage("Latitud no válida")
        .toFloat(),
    body("lon")
        .optional()
        .isFloat({ min: -180, max: 180 }).withMessage("Longitud no válida")
        .toFloat(),
    /*body("organizacionId")
        .optional()
        .isInt().withMessage("El organizacionId no es válido")
        .toInt(),*/
    body("link")
        .optional()
        .notEmpty().withMessage("Debe especificar un link solo si el post es de tipo publicidad")
        .isURL({
            protocols: ["http", "https"],
            require_protocol: true,
            allow_query_components: true
        })
        .withMessage("Debe proporcionar una URL valida")
];

const middlewareRequestPostValidator = [
    query("lat")
        .isFloat({ min: -90, max: 90 }).withMessage("Latitud no válida")
        .toFloat(),
    query("lon")
        .isFloat({ min: -180, max: 180 }).withMessage("Longitud no válida")
        .toFloat(),
    query("distancia")
        .isInt({ min: 0, max: 10000 })
        .withMessage("Debe especificar una distancia valida")
        .toInt(),
    query("lastId")
        .optional()
        .toInt()
        .isInt({ min: 1 }).withMessage("ID no válido"),
    query("lastPostDate")
        .custom((value, { req }) => {
            if( (!req.query.lastId && value) || ( req.query.lastId && !value ) ){
                throw new Error("lastId y lastPostId deben estar presente juntos o en su defecto no especifique ninguno");
            };
            return true;
        })
];

const middlewareRequestUserPost = [
    query("lastId")
        .optional()
        .toInt()
        .isInt({ min: 1 }).withMessage("ID no válido")
];

const middlewareUniquePostRequestValidator = [
    param("id")
        .isInt({ min: 1 }).withMessage("ID no válido")
        .toInt(),
    query("createdAt")
        .notEmpty().withMessage("Debe especificar una fecha de publicación")
];

const middlewareUpdatePost = [
    param("id")
        .isInt({ min: 1 }).withMessage("ID no válido")
        .toInt(),
    query("createdAt")
        .notEmpty().withMessage("Debe especificar una fecha de publicación"),
    body("tipo")
        .notEmpty().withMessage("El tipo de post es obligatorio")
        .isIn(['reporte','publicidad','aviso']).withMessage("Tipo de post no válido"),
    /*body("usuarioId") // DEBE DE VENIR EN EL TOKEN
        .notEmpty().withMessage("Debe especificar un usuarioId")
        .isInt().withMessage("usuarioId no válido")
        .toInt(),
    body("titulo")
        .notEmpty().withMessage("El título es obligatorio")
        .isLength({ min: 1, max: 255 }).withMessage("El título debe tener entre 1 y 255 caracteres"),*/
    body("descripcion")
        .notEmpty().withMessage("La descripcion del post es obligatoria"),
    body("link")
        .optional()
        .notEmpty().withMessage("Debe especificar un link solo si el post es de tipo publicidad")
        .isURL({
            protocols: ["http", "https"],
            require_protocol: true,
            allow_query_components: true
        })
        .withMessage("Debe proporcionar una URL valida"),
    body("categoriaId")
        .optional()
        .notEmpty().withMessage("La categoria debe contener un valor")
        .isInt({ min: 1 }).withMessage("categoriaId no válido")
        .toInt()
];

const middlewareDeletePost = [
    param("id")
        .isInt({ min: 1 }).withMessage("ID no válido")
        .toInt(),
    query("createdAt")
        .notEmpty().withMessage("Debe especificar una fecha de publicación"),
    /*query("usuarioId") // DEBE DE VENIR EN EL TOKEN
        .notEmpty().withMessage("Debe especificar un usuarioId")
        .isInt({ min: 1 }).withMessage("usuarioId no válido")
        .toInt()*/
];

const middlewareProcessPostLLM = [
    body("description")
        .notEmpty()
        .withMessage("Debe proporcionar una descripcion de usuario")
];

const middlewareRequestMapPost = [
    query("neLat")
        .notEmpty().withMessage("Debe especificar latitud Noreste")
        .isNumeric().withMessage("Debe especificar un valor válido de latitud"),
    query("neLng")
        .notEmpty().withMessage("Debe especificar longitud Noreste")
        .isNumeric().withMessage("Debe especificar un valor válido de longitud"),
    query("swLat")
        .notEmpty().withMessage("Debe especificar latitud Suroeste")
        .isNumeric().withMessage("Debe especificar un valor válido de latitud suroeste"),
    query("swLng")
        .notEmpty().withMessage("Debe especificar longitud Noreste")
        .isNumeric().withMessage("Debe especificar un valor válido de longitud")
];

export { 
    middlewaresPostValidator, 
    middlewareRequestPostValidator,
    middlewareRequestUserPost,
    middlewareUniquePostRequestValidator,
    middlewareUpdatePost,
    middlewareDeletePost,
    middlewareProcessPostLLM,
    middlewareRequestMapPost
};