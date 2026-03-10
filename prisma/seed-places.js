"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var adapter_pg_1 = require("@prisma/adapter-pg");
var pg = require("pg");
var axios_1 = require("axios");
var dotenv = require("dotenv");
var path = require("path");
// Cargar variables de entorno desde .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });
var pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
var adapter = new adapter_pg_1.PrismaPg(pool);
var prisma = new client_1.PrismaClient({ adapter: adapter });
var GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
if (!GOOGLE_PLACES_API_KEY) {
    console.error('ERROR: GOOGLE_PLACES_API_KEY no está definido en el archivo .env');
    process.exit(1);
}
// Categorías base combinadas (originales + requeridas)
var BASE_CATEGORIES = [
    { name: 'Restaurante', icon: 'restaurant', description: 'Restaurantes y gastronomía' },
    { name: 'Museo', icon: 'museum', description: 'Museos y galerías' },
    { name: 'Sitio Arqueológico', icon: 'ruins', description: 'Ruinas y sitios arqueológicos' },
    { name: 'Reserva Natural', icon: 'tree', description: 'Reservas naturales' },
    { name: 'Monumento', icon: 'monument', description: 'Monumentos históricos' },
    { name: 'Iglesia', icon: 'church', description: 'Iglesias y catedrales' },
    { name: 'Parque', icon: 'park', description: 'Parques y centros recreativos' },
    { name: 'Playa', icon: 'beach', description: 'Playas y balnearios' },
    { name: 'Mercado', icon: 'store', description: 'Mercados locales y comercio' },
    { name: 'Alojamiento', icon: 'hotel', description: 'Hoteles y hospedajes' },
    { name: 'Plaza', icon: 'square', description: 'Plazas principales' },
];
function seedCategories() {
    return __awaiter(this, void 0, void 0, function () {
        var categories, _i, BASE_CATEGORIES_1, cat, category;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('--- Creando Categorías Base ---');
                    categories = [];
                    _i = 0, BASE_CATEGORIES_1 = BASE_CATEGORIES;
                    _a.label = 1;
                case 1:
                    if (!(_i < BASE_CATEGORIES_1.length)) return [3 /*break*/, 4];
                    cat = BASE_CATEGORIES_1[_i];
                    return [4 /*yield*/, prisma.category.upsert({
                            where: { name: cat.name },
                            update: {},
                            create: {
                                name: cat.name,
                                icon: cat.icon,
                                description: cat.description,
                            },
                        })];
                case 2:
                    category = _a.sent();
                    categories.push(category);
                    console.log("Categor\u00EDa lista: ".concat(category.name));
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, categories];
            }
        });
    });
}
// Mapea el tipo devuelto por Google a nuestras categorías
function mapGoogleTypeToCategory(types, categories) {
    if (!types || types.length === 0)
        return categories[0].id; // Fallback
    var typesStr = types.join(' ').toLowerCase();
    var matchedCategoryName = 'Plaza'; // Default
    if (typesStr.includes('restaurant') || typesStr.includes('food'))
        matchedCategoryName = 'Restaurante';
    else if (typesStr.includes('museum'))
        matchedCategoryName = 'Museo';
    else if (typesStr.includes('ruin') || typesStr.includes('archaeological'))
        matchedCategoryName = 'Sitio Arqueológico';
    else if (typesStr.includes('church') || typesStr.includes('place_of_worship'))
        matchedCategoryName = 'Iglesia';
    else if (typesStr.includes('monument'))
        matchedCategoryName = 'Monumento';
    else if (typesStr.includes('park') || typesStr.includes('reserve'))
        matchedCategoryName = 'Parque';
    else if (typesStr.includes('beach'))
        matchedCategoryName = 'Playa';
    else if (typesStr.includes('natural_feature'))
        matchedCategoryName = 'Reserva Natural';
    else if (typesStr.includes('market') || typesStr.includes('store'))
        matchedCategoryName = 'Mercado';
    else if (typesStr.includes('lodging') || typesStr.includes('hotel'))
        matchedCategoryName = 'Alojamiento';
    var category = categories.find(function (c) { return c.name === matchedCategoryName; });
    return category ? category.id : categories[0].id;
}
function fetchPlacesFromGoogle(query) {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    url = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=".concat(encodeURIComponent(query), "&key=").concat(GOOGLE_PLACES_API_KEY, "&language=es");
                    return [4 /*yield*/, axios_1.default.get(url)];
                case 1:
                    response = _a.sent();
                    if (response.data.status !== 'OK') {
                        console.warn("Aviso de Google API (".concat(query, "): ").concat(response.data.status, " - ").concat(response.data.error_message || ''));
                        return [2 /*return*/, []];
                    }
                    return [2 /*return*/, response.data.results];
                case 2:
                    error_1 = _a.sent();
                    console.error("Error consultando Google Places API para '".concat(query, "':"), error_1.message);
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function fetchPlaceDetails(placeId) {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    url = "https://maps.googleapis.com/maps/api/place/details/json?place_id=".concat(placeId, "&fields=name,rating,formatted_phone_number,geometry,formatted_address,address_components,types,photos,editorial_summary&key=").concat(GOOGLE_PLACES_API_KEY, "&language=es");
                    return [4 /*yield*/, axios_1.default.get(url)];
                case 1:
                    response = _a.sent();
                    if (response.data.status !== 'OK')
                        return [2 /*return*/, null];
                    return [2 /*return*/, response.data.result];
                case 2:
                    error_2 = _a.sent();
                    console.error("Error obteniendo detalles del lugar ".concat(placeId, ":"), error_2.message);
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function seedPlaces() {
    return __awaiter(this, void 0, void 0, function () {
        var dbCategories, searchQueries, allPlaces, _i, searchQueries_1, query, results, uniquePlacesMap, _a, allPlaces_1, place, uniquePlaces, count, _b, uniquePlaces_1, googlePlace, details, name_1, address, lat, lng, description, district, city, dComp, cComp, metadata, savedPlace, categoryIdToLink, e_1;
        var _c, _d, _e, _f, _g, _h, _j, _k, _l;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0: return [4 /*yield*/, seedCategories()];
                case 1:
                    dbCategories = _m.sent();
                    searchQueries = [
                        'Principales atracciones turisticas en Lambayeque, Peru',
                        'Restaurantes en Lambayeque, Peru',
                        'Museos en Lambayeque, Peru',
                        'Sitios arqueologicos en Lambayeque, Peru',
                        'Iglesias y monumentos en Lambayeque, Peru',
                        'Parques en Lambayeque, Peru',
                        'Playas en Lambayeque, Peru',
                        'Mercados en Lambayeque, Peru',
                        'Alojamientos en Lambayeque, Peru'
                    ];
                    console.log('\n--- Buscando Lugares en Lambayeque (Google Places API) ---');
                    allPlaces = [];
                    _i = 0, searchQueries_1 = searchQueries;
                    _m.label = 2;
                case 2:
                    if (!(_i < searchQueries_1.length)) return [3 /*break*/, 5];
                    query = searchQueries_1[_i];
                    console.log("Buscando: \"".concat(query, "\"..."));
                    return [4 /*yield*/, fetchPlacesFromGoogle(query)];
                case 3:
                    results = _m.sent();
                    allPlaces.push.apply(allPlaces, results);
                    _m.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    uniquePlacesMap = new Map();
                    for (_a = 0, allPlaces_1 = allPlaces; _a < allPlaces_1.length; _a++) {
                        place = allPlaces_1[_a];
                        if (!uniquePlacesMap.has(place.place_id)) {
                            uniquePlacesMap.set(place.place_id, place);
                        }
                    }
                    uniquePlaces = Array.from(uniquePlacesMap.values());
                    console.log("\nEncontrados ".concat(uniquePlaces.length, " lugares \u00FAnicos. Obteniendo detalles y guardando en BD..."));
                    count = 0;
                    _b = 0, uniquePlaces_1 = uniquePlaces;
                    _m.label = 6;
                case 6:
                    if (!(_b < uniquePlaces_1.length)) return [3 /*break*/, 13];
                    googlePlace = uniquePlaces_1[_b];
                    return [4 /*yield*/, fetchPlaceDetails(googlePlace.place_id)];
                case 7:
                    details = _m.sent();
                    if (!details)
                        return [3 /*break*/, 12];
                    name_1 = details.name;
                    address = details.formatted_address || googlePlace.formatted_address || "Lambayeque, Peru";
                    lat = ((_d = (_c = details.geometry) === null || _c === void 0 ? void 0 : _c.location) === null || _d === void 0 ? void 0 : _d.lat) || ((_f = (_e = googlePlace.geometry) === null || _e === void 0 ? void 0 : _e.location) === null || _f === void 0 ? void 0 : _f.lat);
                    lng = ((_h = (_g = details.geometry) === null || _g === void 0 ? void 0 : _g.location) === null || _h === void 0 ? void 0 : _h.lng) || ((_k = (_j = googlePlace.geometry) === null || _j === void 0 ? void 0 : _j.location) === null || _k === void 0 ? void 0 : _k.lng);
                    description = ((_l = details.editorial_summary) === null || _l === void 0 ? void 0 : _l.overview) || googlePlace.name;
                    district = 'Lambayeque';
                    city = 'Lambayeque';
                    if (details.address_components) {
                        dComp = details.address_components.find(function (c) { return c.types.includes('locality') || c.types.includes('sublocality'); });
                        if (dComp)
                            district = dComp.long_name;
                        cComp = details.address_components.find(function (c) { return c.types.includes('administrative_area_level_2'); });
                        if (cComp)
                            city = cComp.long_name;
                    }
                    metadata = {
                        google_place_id: googlePlace.place_id,
                        rating: details.rating || googlePlace.rating,
                        phone: details.formatted_phone_number,
                        photo_references: details.photos ? details.photos.map(function (p) { return p.photo_reference; }).slice(0, 3) : [],
                        types: details.types || googlePlace.types || []
                    };
                    _m.label = 8;
                case 8:
                    _m.trys.push([8, 11, , 12]);
                    return [4 /*yield*/, prisma.place.create({
                            data: {
                                name: name_1,
                                description: description,
                                address: address,
                                district: district,
                                city: city,
                                country: 'PE',
                                latitude: lat,
                                longitude: lng,
                                metadata: metadata,
                            }
                        })];
                case 9:
                    savedPlace = _m.sent();
                    categoryIdToLink = mapGoogleTypeToCategory(metadata.types, dbCategories);
                    return [4 /*yield*/, prisma.placeCategory.create({
                            data: {
                                placeId: savedPlace.id,
                                categoryId: categoryIdToLink
                            }
                        })];
                case 10:
                    _m.sent();
                    count++;
                    console.log("[+] Creado: ".concat(name_1, " (ID: ").concat(savedPlace.id, ")"));
                    return [3 /*break*/, 12];
                case 11:
                    e_1 = _m.sent();
                    if (e_1.code === 'P2002') {
                        console.log("[-] Omitiendo (Ya existe): ".concat(name_1));
                    }
                    else {
                        console.error("[!] Error guardando ".concat(name_1, ":"), e_1.message);
                    }
                    return [3 /*break*/, 12];
                case 12:
                    _b++;
                    return [3 /*break*/, 6];
                case 13:
                    console.log("\n=== SEED COMPLETADO ===");
                    console.log("Lugares nuevos creados: ".concat(count));
                    return [2 /*return*/];
            }
        });
    });
}
seedPlaces()
    .catch(function (e) {
    console.error('Error general en el seed:', e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
