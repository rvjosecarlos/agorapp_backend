import { Ubicacion, UbicacionGeoreverse } from "../types/index.js";
import { georeverseGoogle } from "./geoservices/georeverse.google.services.js";
import { georeverseNominatim } from "./geoservices/georeverse.nominatim.services.js";

export class GeocodingService {
    static getAddress = async (lat: Ubicacion["lat"], lon: Ubicacion["lon"]) => {
        // Georeverse api google maps o nominatim
        const georeverseFunction = process.env.GOOGLE_GEOCODING_API_KEY ? georeverseGoogle : georeverseNominatim;
        const ubicacionGeoRev = await georeverseFunction({ lat, lon });
        if( ubicacionGeoRev === undefined ) throw new Error("Error al obtener la ubicacion");
        const ubicacion = { ...ubicacionGeoRev, lat, lon };
        return ubicacion;
    };
};