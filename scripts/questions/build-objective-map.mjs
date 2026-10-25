// Writes content/questions/objective-map.json from hand-judged assignments.
// Each original question was read and assigned only when it clearly tests one
// of the 27 objectives in lib/exam-outline.ts. Run: node scripts/questions/build-objective-map.mjs
import fs from "fs";
import path from "path";

const assignments = {
  "acr-images": "adv-007 practice-001 practice-002 cont-101 cont-121 sdk-018",
  "acr-tasks": "adv-001 cont-102 cont-103 cont-113 cont-118 cont-002 cont-007 cont-010 sdk-046 sdk-059",
  "app-service-containers": "adv-002 cont-104 cont-105 cont-119 cont-011 sdk-050",
  "aca-deploy": "adv-005 practice-003 practice-004 practice-005 practice-014 cont-106 cont-108 cont-114 cont-115 cont-006 sdk-004 sdk-029 sdk-045",
  "aca-keda": "adv-003 practice-006 cont-107 cont-122 cont-001 cont-008 sdk-031 sdk-063",
  "aks-manifests": "adv-006 practice-008 practice-009 practice-010 practice-011 practice-016 practice-017 cont-110 cont-111 cont-116 cont-003 cont-005 cont-013",
  "containers-troubleshoot": "adv-004 practice-007 practice-013 practice-015 cont-109 cont-112 cont-117 cont-120 cont-004 cont-012 sdk-025 sdk-039",
  "cosmos-sdk-queries": "practice-020 practice-025 practice-026 practice-027 practice-034 data-102 data-118 sdk-016",
  "cosmos-ru-indexing": "adv-009 adv-011 practice-019 practice-021 practice-022 data-103 data-106 data-120 data-122 data-123 data-006",
  "cosmos-vector-search": "adv-008 practice-023 practice-024 practice-029 practice-030 practice-031 practice-032 data-104 data-124 data-001 data-009 data-012 sdk-049",
  "cosmos-change-feed": "adv-010 data-105 data-119 data-126 data-005 data-014",
  "pg-connect-query": "data-107",
  "pg-schema": "data-108 data-112 data-008",
  "pg-indexing": "adv-012 practice-041 practice-042 data-109 data-121 data-004",
  "pg-compute": "adv-013 data-013",
  "pg-vector-rag": "adv-014 practice-043 data-110 data-117 data-003 data-015",
  "pg-connections": "adv-015 data-111 data-125 data-010",
  "redis-data-ops": "adv-016 data-113 data-114 data-116 data-007",
  "redis-vector": "adv-017 practice-035 practice-036 practice-037 practice-038 practice-039 practice-040 data-115 data-002 data-011",
  "service-bus": "adv-018 adv-019 practice-046 svc-101 svc-102 svc-103 svc-104 svc-113 svc-116 svc-124 svc-003 svc-004 svc-007 svc-010 sdk-008 sdk-012 sdk-024 sdk-054 sdk-060",
  "event-grid": "adv-020 adv-023 practice-051 svc-105 svc-106 svc-107 svc-114 svc-123 svc-002 svc-006 svc-009 sdk-006 sdk-013",
  "functions-triggers-bindings": "practice-045 practice-048 practice-049 practice-052 svc-108 svc-110 svc-111 svc-115 svc-121 svc-001 svc-005 svc-008",
  "functions-deploy": "adv-021 svc-112 svc-117 sdk-040 sdk-041",
  "key-vault": "adv-025 adv-029 practice-053 practice-055 sec-101 sec-102 sec-103 sec-104 sec-111 sec-112 sec-116 sec-118 sec-120 sec-003 sec-006 sec-012 sdk-003 sdk-011 sdk-020 sdk-032 sdk-034",
  "app-configuration": "adv-026 practice-054 svc-109 svc-118 svc-119 cont-009 sec-106 sec-010 sdk-030 sdk-052",
  "opentelemetry": "adv-027 practice-056 practice-057 practice-060 sec-107 sec-110 sec-117 sec-119 sec-001 sec-005 sec-008 sec-009",
  "kql": "adv-028 adv-030 practice-012 practice-058 practice-059 sec-108 sec-115 sec-121 sec-002 sec-007 sec-011 sdk-047",
};

const root = process.cwd();
const map = {};
for (const [objective, ids] of Object.entries(assignments)) {
  for (const id of ids.split(/\s+/)) {
    if (map[id]) throw new Error(`${id} assigned twice (${map[id]}, ${objective})`);
    map[id] = objective;
  }
}
const sorted = Object.fromEntries(
  Object.keys(map)
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true }))
    .map((k) => [k, map[k]])
);
fs.writeFileSync(
  path.join(root, "content/questions/objective-map.json"),
  JSON.stringify(sorted, null, 2) + "\n"
);
console.log(`mapped ${Object.keys(sorted).length} questions`);
