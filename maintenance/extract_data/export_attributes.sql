COPY (SELECT
    building_id,
    ref_toid,
    ref_osm_id,
    revision_id,
    location_name,
    location_number,
    location_street,
    location_line_two,
    location_town,
    location_postcode,
    location_latitude,
    location_longitude,
    current_landuse_group,
    current_landuse_order,
    building_attachment_form,
    date_change_building_use,
    date_year,
    date_lower,
    date_upper,
    date_source,
    date_source_detail,
    date_link,
    facade_year,
    facade_upper,
    facade_lower,
    facade_source,
    facade_source_detail,
    size_storeys_attic,
    size_storeys_core,
    size_storeys_basement,
    size_height_apex,
    size_floor_area_ground,
    size_floor_area_total,
    size_width_frontage,
    sust_breeam_rating,
    sust_dec,
    sust_retrofit_date,
    construction_core_material,
    construction_secondary_materials,
    construction_roof_covering,
    planning_portal_link,
    planning_in_conservation_area_id,
    planning_in_conservation_area_url,
    planning_in_conservation_area_source_url,
    planning_conservation_area_name,
    planning_in_list,
    planning_list_id,
    planning_list_cat,
    planning_list_grade,
    planning_heritage_at_risk_url,
    planning_world_list_id,
    planning_glher_url,
    planning_in_apa_url,
    planning_local_list_url,
    planning_historic_area_assessment_url,
    is_domestic,
    community_type_worth_keeping_total,
    likes_total
FROM buildings)
TO '/tmp/building_attributes.csv'
WITH CSV HEADER
