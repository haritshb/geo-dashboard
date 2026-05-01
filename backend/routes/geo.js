const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/kabupaten", async (req, res) => {
  const result = await pool.query(`
    SELECT kdpkab AS id, wadmkk AS name
    FROM desa_kalimantan
    WHERE wadmkk IS NOT NULL
    GROUP BY wadmkk, kdpkab
    ORDER BY wadmkk    
  `);

  res.json(result.rows);
});

router.get("/kecamatan", async (req, res) => {
  const { kabupaten } = req.query;

  const result = await pool.query(
    `
    SELECT wadmkc AS name, kdcpum AS id
    FROM desa_kalimantan
    WHERE kdpkab = $1 AND wadmkc IS NOT NULL
    GROUP BY wadmkc, kdcpum
    ORDER BY wadmkc
  `,
    [kabupaten],
  );

  res.json(result.rows);
});

router.get("/desa", async (req, res) => {
  const { kecamatan } = req.query;

  const result = await pool.query(
    `
    SELECT wadmkd AS name, kdepum AS id
    FROM desa_kalimantan
    WHERE kdcpum = $1 AND wadmkd IS NOT NULL
    GROUP BY wadmkd, kdepum
    ORDER BY wadmkd
  `,
    [kecamatan],
  );

  res.json(result.rows);
});

router.get("/boundary", async (req, res) => {
  const { kabupaten, kecamatan, desa } = req.query;

  const clean = (val) => {
    if (!val || val === "null" || val === "undefined") return null;
    return val;
  };

  const kab = clean(kabupaten);
  const kec = clean(kecamatan);
  const des = clean(desa);

  let conditions = [];
  let values = [];

  // ✅ hierarchical filter
  if (des) {
    values.push(des);
    conditions.push(`kdepum = $${values.length}`);
  } else if (kec) {
    values.push(kec);
    conditions.push(`kdcpum = $${values.length}`);
  } else if (kab) {
    values.push(kab);
    conditions.push(`kdpkab = $${values.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const result = await pool.query(
    `
    SELECT jsonb_build_object(
      'type', 'FeatureCollection',
      'features', jsonb_build_array(
        jsonb_build_object(
          'type', 'Feature',
          'geometry', ST_AsGeoJSON(ST_Union(geom), 6)::jsonb
        )
      )
    ) AS geojson
    FROM desa_kalimantan
    ${where}
  `,
    values,
  );

  res.json(result.rows[0].geojson);
});

router.get("/geojson", async (req, res) => {
  try {
    const { kabupaten_id, kecamatan_id, desa_id, legenda } = req.query;

    let values = [];
    let conditions = [];

    // =========================
    // 1. CLEAN HELPER (IMPORTANT)
    // =========================
    const clean = (val) => {
      if (!val || val === "null" || val === "undefined") return null;
      return val;
    };

    const kab = clean(kabupaten_id);
    const kec = clean(kecamatan_id);
    const des = clean(desa_id);

    // =========================
    // 2. LEGEND FILTER
    // =========================
    if (legenda !== undefined) {
      if (!legenda || legenda.length === 0) {
        conditions.push("1 = 0");
      } else {
        const val = Array.isArray(legenda) ? legenda.join(",") : legenda;

        values.push(val);

        conditions.push(`
          rp.legenda = ANY(string_to_array($${values.length}::text, ','))
        `);
      }
    }

    // =========================
    // 3. DYNAMIC BOUNDARY (HIERARCHICAL)
    // =========================
    let spatialJoin = "";
    let spatialWhere = "";

    if (des) {
      values.push(des);
      spatialJoin = `
        CROSS JOIN (
          SELECT geom FROM desa_kalimantan WHERE kdepum = $${values.length}
        ) b
      `;
      spatialWhere = `ST_Intersects(rp.geom, b.geom)`;
    } else if (kec) {
      values.push(kec);
      spatialJoin = `
        CROSS JOIN (
          SELECT geom FROM desa_kalimantan WHERE kdcpum = $${values.length}
        ) b
      `;
      spatialWhere = `ST_Intersects(rp.geom, b.geom)`;
    } else if (kab) {
      values.push(kab);
      spatialJoin = `
        CROSS JOIN (
          SELECT geom FROM desa_kalimantan WHERE kdpkab = $${values.length}
        ) b
      `;
      spatialWhere = `ST_Intersects(rp.geom, b.geom)`;
    }

    // =========================
    // 4. BUILD WHERE CLAUSE SAFELY
    // =========================
    let whereClauses = [];

    if (spatialWhere) {
      whereClauses.push(spatialWhere);
    }

    if (conditions.length) {
      whereClauses.push(...conditions);
    }

    const finalWhere = whereClauses.length
      ? `WHERE ${whereClauses.join(" AND ")}`
      : "";

    // =========================
    // 5. FINAL QUERY
    // =========================
    const query = `
      SELECT json_build_object(
        'type', 'FeatureCollection',
        'features', COALESCE(
          json_agg(
            json_build_object(
              'type', 'Feature',
              'geometry', ST_AsGeoJSON(ST_GeometryN(rp.geom, 1))::json,
              'properties', json_build_object(
                'id', rp.id,
                'name', rp.name,
                'legenda', rp.legenda,
                'legenda_key', LOWER(REPLACE(REPLACE(rp.legenda, ' ', '_'), '/', '_'))
              )
            )
          ),
          '[]'::json
        )
      ) AS geojson
      FROM random_point rp
      ${spatialJoin}
      ${finalWhere}
      LIMIT 5000;
    `;

    // =========================
    // 6. DEBUG (optional)
    // =========================
    // console.log("VALUES:", values);
    // console.log("WHERE:", finalWhere);

    const result = await pool.query(query, values);

    res.json(result.rows[0].geojson);
  } catch (err) {
    console.error("GeoJSON API error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
