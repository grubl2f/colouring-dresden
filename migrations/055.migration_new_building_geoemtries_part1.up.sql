-- Workflow for semi-automated migration from old building dataset to new building dataset
-- Part 1

-- after: importing pre-processed new building geometry data into database
-- before: manually adapted mapping table in QGIS


-- aim: do some analysis and create mapping table as first draft for further edits in QGIS


-- create table for first mapping of building Ids (the final version will be named 'mapping_table' later)
DROP TABLE IF EXISTS public.temp_bld_b_to_a;
CREATE TABLE IF NOT EXISTS public.temp_bld_b_to_a (
    id_a INTEGER NOT NULL,
	id_b INTEGER NOT NULL
);

-- also db tables for transformed geometries into WGS84 / epsg: 4326
-- DROP TABLE IF EXISTS public.temp_geometries_4326;
-- CREATE TABLE IF NOT EXISTS public.temp_geometries_4326
-- AS SELECT geometry_id, source_id, ST_Transform(geometry, 4326) AS "geometry" 
-- FROM public.temp_geometries;

-- DROP TABLE IF EXISTS public.geometries_4326;
-- CREATE TABLE IF NOT EXISTS public.geometries_4326
-- AS SELECT geometry_id, source_id, ST_Transform(geometry_geom, 4326) AS geometry_geom 
-- FROM public.geometries;

-- #TODO:FIX:ADDED:
DROP TABLE IF EXISTS public.temp_geometries;
-- CREATE TABLE IF NOT EXISTS public.temp_geometries
-- AS SELECT geometry_id, source_id, geometry_geom AS geometry
-- FROM public.geometries;
CREATE TABLE IF NOT EXISTS public.temp_geometries (
    -- internal unique id
    geometry_id serial PRIMARY KEY,
    -- cross-reference to data source id
    source_id varchar(30),
    -- geometry as EPSG:3857 avoiding reprojection for tiles
    geometry geometry(GEOMETRY, 3857)
);

-- spatial index 
DROP INDEX IF EXISTS temp_geometries_geom_idx;
CREATE INDEX temp_geometries_geom_idx
  ON public.temp_geometries
  USING GIST (geometry);
  
--DROP INDEX IF EXISTS temp_geometries_4326_geom_idx;
--CREATE INDEX temp_geometries_4326_geom_idx
--  ON public.temp_geometries_4326
--  USING GIST (geometry);
    
--DROP INDEX IF EXISTS geometries_4326_geom_idx;
--CREATE INDEX geometries_4326_geom_idx
--  ON public.geometries_4326
--  USING GIST (geometry_geom);

-- insert building IDs for mapping dataset a to b and also b to a by using spatial join
-- use PointOnSurface instead of Centroid
-- SRS is 3857... could it be better to transform into 4326 ?
INSERT INTO public.temp_bld_b_to_a
SELECT 
    a.geometry_id AS id_a,
    b.geometry_id AS id_b
FROM public.geometries AS a
JOIN public.temp_geometries AS b
ON ST_Contains (a.geometry_geom, ST_PointOnSurface(b.geometry))
ORDER BY b.geometry_id ASC;





-- DROP all not needed INDEX and TABLE !
-- except the new table 'temp_bld_b_to_a', which should be kept
DROP INDEX IF EXISTS temp_geometries_geom_idx;
--DROP INDEX IF EXISTS temp_geometries_4326_geom_idx;
--DROP INDEX IF EXISTS geometries_4326_geom_idx;

--DROP TABLE IF EXISTS public.temp_geometries_4326;
--DROP TABLE IF EXISTS public.geometries_4326;


-- #TODO:FIX:ADDED:
DROP TABLE IF EXISTS public.temp_buildings;
CREATE TABLE IF NOT EXISTS public.temp_buildings (
    -- internal unique id
    building_id serial PRIMARY KEY,
    -- OS MasterMap topo id
    ref_toid varchar,
    -- OSM reference id
    ref_osm_id bigint,
    -- reference to geometry, aiming to decouple from geometry provider
    geometry_id integer REFERENCES geometries
);

-- #TODO:FIX:ADDED:
DROP TABLE IF EXISTS public.temp_building_properties;
CREATE TABLE IF NOT EXISTS public.temp_building_properties (
    -- internal primary key
    building_property_id serial PRIMARY KEY,
    -- UPRN
    uprn bigint,
    -- Parent should reference UPRN, but assume dataset may be (initially) incomplete
    parent_uprn bigint,
    -- Building ID may be null for failed matches
    building_id integer REFERENCES buildings,
    -- TOID match provided by AddressBase
    toid varchar,
    -- Geometry (for verification if loaded, not for public access)
    uprn_geom geometry(POINT, 3857)
);


-- #TODO:FIX:ADDED:
DROP TABLE IF EXISTS public.mapping_table;
CREATE TABLE public.mapping_table AS SELECT * FROM public.temp_bld_b_to_a;
