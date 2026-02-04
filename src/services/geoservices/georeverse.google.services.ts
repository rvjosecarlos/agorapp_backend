import axios from "axios";
import { GeoreverseResponseMapsSchema, Post, Ubicacion, UbicacionGeoreverse } from "../../types/index.js";

type GeoreverseNominatim = {
    lat: Post["lat"],
    lon: Post["lon"]
};

export const georeverseGoogle = async ({ lat, lon }: GeoreverseNominatim ) => {
    console.log("maps");
    try{
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${process.env.GOOGLE_GEOCODING_API_KEY}}`;
        const res = await axios(url);
        const { data } = GeoreverseResponseMapsSchema.safeParse(res);
        console.log(data);
        if( res.data.error_message && !data ){
            throw new Error("Error en el servicio georeverse maps:" + res.data.error_message);
        }
        else if(data){
            const ubicacion: UbicacionGeoreverse = {
                calle: "",
                colonia: "",
                municipio: "",
                alcaldia: "",
                estado: "",
                direccion: data.results[0].formatted_address,
                georeverse: "google-maps"
            } 

            data.results[0].address_components.forEach( elemento => {
                const { long_name, types } = elemento;
                ubicacion.calle = types.includes("route") ? long_name : "";
                ubicacion.colonia = types.includes("neighborhood") ? long_name : "";
                ubicacion.municipio = types.includes("administrative_area_level_2") ? long_name : "";
                ubicacion.alcaldia = types.includes("administrative_area_level_3") ? long_name : "";
                ubicacion.estado = types.includes("administrative_area_level_1") ? long_name : "";
            });

            return ubicacion;
        }
    }
    catch(error){
        if(error instanceof Error) throw new Error(`Error en la llamada al servicio de georeverse de Goole Maps: ${error.message}`);
    }
};