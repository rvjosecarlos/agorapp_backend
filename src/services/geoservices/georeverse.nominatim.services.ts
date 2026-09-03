import axios from "axios";
import { GeoreverseResponseNominatimSchema, Post, Ubicacion, UbicacionGeoreverse } from "../../types/index.js";

type GeoreverseNominatim = {
    lat: Post["lat"],
    lon: Post["lon"]
};

export const georeverseNominatim = async ({ lat, lon }: GeoreverseNominatim ) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
    try{
        const res = await axios.get(url, {
            headers: {
                "User-Agent": "agorapp/1.0 (rvjosecarlos@gmail.com)"
            }
        });
        console.log(`Respuesta nominatim ${res.data}`);
        console.log(res.data);
        const { data } = GeoreverseResponseNominatimSchema.safeParse(res.data);
        if( !data ){
            throw new Error("Error al evaluar la respuesta de georeverse nominatin");
        };

        const ubicacion: UbicacionGeoreverse = {
                calle: data.address.road || "",
                colonia: data.address.village || data.address.neighbourhood || "" ,
                municipio: data.address.country,
                alcaldia: "",
                estado: data.address.state,
                direccion: data.display_name,
                georeverse: "nominatim-openstreetmap"
            };
        return ubicacion;
    }
    catch(error){
        if(error instanceof Error) throw new Error(`Error en la llamada al servicio de georeverse nominatim: ${error.message}`);
    };
};