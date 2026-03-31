/* ─────────────────────────────────────────────────
   California Clemency Dashboard — D3 Choropleth Map
   Renders CA county grant-rate heatmap using US Atlas TopoJSON
   (filters to California FIPS codes 06001–06115)
   ───────────────────────────────────────────────── */

(async function initMap() {
  const svgEl   = document.getElementById('map-svg');
  const tooltip = document.getElementById('map-tooltip');
  if (!svgEl) return;

  // Build a lookup from FIPS → county data
  const dataByFips = {};
  COUNTY_DATA.forEach(d => { dataByFips[d.fips] = d; });

  // County FIPS for all 58 CA counties (06001–06115, odd-numbered skipped by USGS)
  const caFipsSet = new Set([
    '06001','06003','06005','06007','06009','06011','06013','06015','06017','06019',
    '06021','06023','06025','06027','06029','06031','06033','06035','06037','06039',
    '06041','06043','06045','06047','06049','06051','06053','06055','06057','06059',
    '06061','06063','06065','06067','06069','06071','06073','06075','06077','06079',
    '06081','06083','06085','06087','06089','06091','06093','06095','06097','06099',
    '06101','06103','06105','06107','06109','06111','06113','06115',
  ]);

  // ── Fetch US Atlas TopoJSON (public CDN) ──────────
  let topology;
  try {
    topology = await d3.json('https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json');
  } catch (err) {
    svgEl.parentElement.innerHTML = `
      <div style="padding:32px; text-align:center; color:#6B7280;">
        <p style="font-size:14px;">Map requires internet connection to load county boundaries.<br>
        All other charts remain fully functional.</p>
      </div>`;
    return;
  }

  const allCounties = topojson.feature(topology, topology.objects.counties);
  const caFeatures  = allCounties.features.filter(f => {
    const id = String(f.id).padStart(5, '0');
    return caFipsSet.has(id);
  });

  // ── Color scale ────────────────────────────────────
  // Use grantRate where available, fall back to a low baseline for counties with no data
  const rateValues = COUNTY_DATA.map(d => d.grantRate);
  const maxRate    = d3.max(rateValues) || 50;

  const colorScale = d3.scaleSequential()
    .domain([0, maxRate])
    .interpolator(d3.interpolateBlues);

  const unknownColor  = '#E8EDF5';
  const strokeColor   = '#FFFFFF';
  const strokeWidth   = 0.8;

  // ── SVG setup ──────────────────────────────────────
  const bbox    = svgEl.getBoundingClientRect();
  const width   = bbox.width  || 600;
  const height  = parseInt(svgEl.getAttribute('height')) || 480;

  const svg = d3.select(svgEl)
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet');

  const projection = d3.geoAlbers()
    .center([0, 37.3])
    .rotate([120, 0])
    .parallels([34, 40.5])
    .scale(Math.min(width, height) * 3.5)
    .translate([width / 2, height / 2]);

  const path = d3.geoPath().projection(projection);

  // ── Draw counties ──────────────────────────────────
  svg.selectAll('.county')
    .data(caFeatures)
    .enter()
    .append('path')
    .attr('class', 'county')
    .attr('d', path)
    .attr('fill', d => {
      const fips = String(d.id).padStart(5, '0');
      const row  = dataByFips[fips];
      return row ? colorScale(row.grantRate) : unknownColor;
    })
    .attr('stroke', strokeColor)
    .attr('stroke-width', strokeWidth)
    .style('cursor', 'pointer')
    .on('mousemove', function(event, d) {
      const fips = String(d.id).padStart(5, '0');
      const row  = dataByFips[fips];
      tooltip.style.display = 'block';
      tooltip.style.left    = (event.clientX + 14) + 'px';
      tooltip.style.top     = (event.clientY - 10) + 'px';
      if (row) {
        tooltip.innerHTML = `
          <strong>${row.county} County</strong>
          Applications: ${row.applications}<br>
          Grants: ${row.grants}<br>
          Grant Rate: <span style="color:#93C5FD;font-weight:700;">${row.grantRate}%</span>
        `;
      } else {
        // Try to find the county name from the topology properties
        const name = d.properties && d.properties.name ? d.properties.name : fips;
        tooltip.innerHTML = `<strong>${name}</strong>No detailed data available`;
      }
    })
    .on('mouseleave', function() {
      tooltip.style.display = 'none';
    });

  // ── Legend ─────────────────────────────────────────
  const legendWidth  = 160;
  const legendHeight = 12;
  const legendX      = width - legendWidth - 20;
  const legendY      = height - 48;

  const defs = svg.append('defs');
  const grad = defs.append('linearGradient').attr('id', 'legend-grad');
  grad.append('stop').attr('offset', '0%').attr('stop-color',   colorScale(0));
  grad.append('stop').attr('offset', '100%').attr('stop-color', colorScale(maxRate));

  const lg = svg.append('g').attr('transform', `translate(${legendX},${legendY})`);

  lg.append('rect')
    .attr('width',  legendWidth)
    .attr('height', legendHeight)
    .attr('rx', 3)
    .style('fill', 'url(#legend-grad)');

  lg.append('text')
    .attr('y', legendHeight + 14)
    .attr('font-size', 10)
    .attr('fill', '#6B7280')
    .text('0%');

  lg.append('text')
    .attr('x', legendWidth)
    .attr('y', legendHeight + 14)
    .attr('font-size', 10)
    .attr('fill', '#6B7280')
    .attr('text-anchor', 'end')
    .text(`${maxRate}%`);

  lg.append('text')
    .attr('x', legendWidth / 2)
    .attr('y', -6)
    .attr('font-size', 10)
    .attr('fill', '#6B7280')
    .attr('text-anchor', 'middle')
    .text('Grant Rate');

  // ── Highlight top counties with a dot label ────────
  const labelTargets = ['06037', '06075', '06067', '06039', '06031', '06105'];
  caFeatures.forEach(f => {
    const fips = String(f.id).padStart(5, '0');
    if (!labelTargets.includes(fips)) return;
    const row = dataByFips[fips];
    if (!row) return;
    const centroid = path.centroid(f);
    if (!centroid || isNaN(centroid[0])) return;

    svg.append('circle')
      .attr('cx', centroid[0])
      .attr('cy', centroid[1])
      .attr('r', 4)
      .attr('fill', '#FFFFFF')
      .attr('stroke', '#1A2B4A')
      .attr('stroke-width', 1.5)
      .style('pointer-events', 'none');
  });
})();
