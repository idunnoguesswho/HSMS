// Generates a Grafana dashboard JSON snapshot of one client's imported
// Salus documents.
//
// No live Grafana or Postgres exists yet (see FOLDER STRUCTURE notes), so
// this can't point panels at a real datasource. Instead it embeds the
// actual imported rows as CSV into Grafana's built-in TestData datasource
// (ships with every default Grafana install, no plugin needed) - the
// dashboard works the moment it's imported, with no wiring required. It's
// a snapshot: re-generate after new imports to refresh the numbers. When
// Postgres lands on the VPS, these panels are the natural things to
// re-point at real SQL queries instead.
//
// Uses the "export for sharing externally" convention (__inputs /
// "datasource": "${DS_TESTDATA}") so Grafana's import screen asks which
// local datasource satisfies it, rather than baking in a UID that
// won't exist on the target instance.

function csvEscape(value) {
  const s = String(value ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function toCsv(rows, columns) {
  const header = columns.join(",");
  const body = rows.map((row) => columns.map((col) => csvEscape(row[col])).join(",")).join("\n");
  return `${header}\n${body}`;
}

function categoryOf(doc) {
  const source = doc.path || doc.salus_id || "";
  const match = String(source).match(/^([A-Za-z]+)/);
  return match ? match[1] : "Uncategorized";
}

const DS_REF = "${DS_TESTDATA}";

function csvPanel({ id, title, gridPos, type, csvContent, extra = {} }) {
  return {
    id,
    title,
    type,
    gridPos,
    datasource: { type: "grafana-testdata-datasource", uid: DS_REF },
    targets: [{ refId: "A", scenarioId: "csv_content", csvContent }],
    ...extra,
  };
}

export function buildDashboard(client, docs) {
  const generatedAt = new Date().toISOString();

  const byCategory = new Map();
  for (const doc of docs) {
    const cat = categoryOf(doc);
    byCategory.set(cat, (byCategory.get(cat) || 0) + 1);
  }
  const categoryRows = [...byCategory.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([category, count]) => ({ category, count }));

  const totalCsv = toCsv([{ count: docs.length }], ["count"]);
  const categoryCsv = categoryRows.length
    ? toCsv(categoryRows, ["category", "count"])
    : toCsv([{ category: "No documents imported yet", count: 0 }], ["category", "count"]);
  const tableCsv = docs.length
    ? toCsv(docs, ["name", "path", "updated_at", "imported_at"])
    : toCsv([{ name: "No documents imported yet", path: "", updated_at: "", imported_at: "" }], ["name", "path", "updated_at", "imported_at"]);

  const panels = [
    csvPanel({
      id: 1,
      title: "Total Documents Imported",
      type: "stat",
      gridPos: { h: 6, w: 6, x: 0, y: 0 },
      csvContent: totalCsv,
      extra: { fieldConfig: { defaults: { unit: "none" }, overrides: [] } },
    }),
    csvPanel({
      id: 2,
      title: "Documents by Category",
      type: "barchart",
      gridPos: { h: 10, w: 18, x: 6, y: 0 },
      csvContent: categoryCsv,
    }),
    csvPanel({
      id: 3,
      title: "Imported Documents",
      type: "table",
      gridPos: { h: 14, w: 24, x: 0, y: 10 },
      csvContent: tableCsv,
    }),
  ];

  return {
    __inputs: [
      {
        name: "DS_TESTDATA",
        label: "TestData",
        description: "On import, point this at any TestData datasource (built into Grafana by default) - the dashboard is self-contained and needs no other connection.",
        type: "datasource",
        pluginId: "grafana-testdata-datasource",
        pluginName: "TestData DB",
      },
    ],
    __requires: [
      { type: "datasource", id: "grafana-testdata-datasource", name: "TestData DB", version: "1.0.0" },
      { type: "panel", id: "stat", name: "Stat", version: "" },
      { type: "panel", id: "barchart", name: "Bar chart", version: "" },
      { type: "panel", id: "table", name: "Table", version: "" },
    ],
    id: null,
    uid: null,
    title: `HSMS — ${client.name} — Salus Import Snapshot`,
    description: `Snapshot of ${docs.length} document(s) imported from Salus for ${client.name}, generated ${generatedAt}. Data is static as of generation time — re-run "Generate Grafana Dashboard" after new imports to refresh.`,
    tags: ["hsms", "salus", client.slug],
    timezone: "browser",
    schemaVersion: 39,
    version: 1,
    editable: true,
    panels,
    time: { from: "now-6M", to: "now" },
  };
}

export function grafanaDashboardHandler(getClientFn, getDocumentsFn) {
  return (req, res) => {
    const client = getClientFn(req.params.id);
    if (!client) return res.status(404).json({ error: "No such client." });

    const docs = getDocumentsFn(client.slug);
    const dashboard = buildDashboard(client, docs);

    res.setHeader("Content-Disposition", `attachment; filename="hsms-${client.slug}-grafana-dashboard.json"`);
    res.json(dashboard);
  };
}
