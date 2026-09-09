---
trigger: always_on
description: Consult the graphify knowledge graph at graphify-out/ for codebase and architecture questions.
---

## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules & Workflow:
- **Graphify-First Workflow for Any Edit / Refactor / Task**:
  `Task` → `Graphify first` → `Understand relevant component/file relationships` → `Only read specific file(s) if actually necessary` → `Make changes` → `Verify` → `graphify update .`
- Do NOT read whole files or multiple files unnecessarily. Always query Graphify (`graphify query`, `graphify path`, `graphify explain`) first to pinpoint the exact nodes, dependencies, and boundaries before opening files.
- For codebase or architecture questions, when `graphify-out/graph.json` exists, first run `graphify query "<question>"` (CLI) or `query_graph` (MCP). Use `graphify path "<A>" "<B>"` / `shortest_path` for relationships and `graphify explain "<concept>"` / `get_node` for focused concepts.
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code files in this session, run `graphify update .` to keep the graph current (AST-only, no API cost).

