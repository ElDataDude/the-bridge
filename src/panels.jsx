/**
 * The Bridge — Generalised Panel Renderers
 *
 * Tab panel components for the control room dashboard. Each receives:
 * { data, theme, onSelect, selectedItem, onAction }
 *
 * All panels are data-driven and theme-aware. Import primitives from './components'.
 */

import React, { useState } from "react";
import {
  Pill,
  StatusDot,
  HealthDot,
  ProgressBar,
  ActionIcon,
} from "./components";

/**
 * EntityGrid — Generalised agent/entity grid with tier filtering and ring visualisation
 * data: { entities: [...], hideRingViz?: boolean }
 */
export const EntityGrid = ({ data, theme: T, onSelect, selectedItem, onAction }) => {
  const [selectedTier, setSelectedTier] = useState("ALL");

  if (!data || !data.entities) return <div style={{ color: T?.textTert }}>No entities</div>;

  const entities = data.entities;
  const tiers = ["T0", "T1", "T2", "T3", "T4"];
  const filteredEntities = selectedTier === "ALL" 
    ? entities 
    : entities.filter(e => e.tier === selectedTier);

  // Ring visualisation: concentric circles
  const rr = { T0: [160, 160], T1: [240, 160], T2: [320, 160], T3: [400, 160], T4: [480, 160] };
  const ringCounts = {};
  entities.forEach(e => { ringCounts[e.tier] = (ringCounts[e.tier] || 0) + 1; });

  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden", fontFamily: T?.font }}>
      {/* Left panel: tier filter + grid */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", borderRight: `1px solid ${T?.border}` }}>
        {/* Tier filter buttons */}
        <div style={{ padding: 16, borderBottom: `1px solid ${T?.border}` }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              onClick={() => setSelectedTier("ALL")}
              style={{
                padding: "6px 12px",
                background: selectedTier === "ALL" ? T?.tier?.T2 : T?.card,
                border: `1px solid ${selectedTier === "ALL" ? T?.tier?.T2 : T?.border}`,
                borderRadius: 4,
                color: selectedTier === "ALL" ? "#111" : T?.text,
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              ALL ({entities.length})
            </button>
            {tiers.map(tier => (
              <button
                key={tier}
                onClick={() => setSelectedTier(tier)}
                style={{
                  padding: "6px 12px",
                  background: selectedTier === tier ? T?.tier?.[tier] : T?.card,
                  border: `1px solid ${selectedTier === tier ? T?.tier?.[tier] : T?.border}`,
                  borderRadius: 4,
                  color: selectedTier === tier ? "#111" : T?.text,
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {tier} ({ringCounts[tier] || 0})
              </button>
            ))}
          </div>
        </div>

        {/* Entity grid */}
        <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
            {filteredEntities.map(entity => (
              <div
                key={entity.id}
                onClick={() => onSelect(entity)}
                style={{
                  background: selectedItem?.id === entity.id ? T?.card + "80" : T?.card,
                  border: `1px solid ${selectedItem?.id === entity.id ? T?.tier?.T2 : T?.border}`,
                  borderRadius: 8,
                  padding: 12,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 12, color: T?.text }}>{entity.name}</div>
                    <div style={{ fontSize: 9, color: T?.textSec }}>{entity.role}</div>
                  </div>
                  <ActionIcon onClick={() => { event.stopPropagation(); onAction?.(entity); }} theme={T} />
                </div>
                <div style={{ display: "flex", gap: 4, alignItems: "center", marginBottom: 8 }}>
                  <HealthDot state={entity.health || "G"} size={8} label={false} theme={T} />
                  <StatusDot status={entity.status || "concept"} theme={T} />
                  <Pill label={entity.tier} color={T?.tier?.[entity.tier]} small theme={T} />
                </div>
                {entity.status && (
                  <div style={{ fontSize: 9, color: T?.textSec }}>
                    {entity.status.charAt(0).toUpperCase() + entity.status.slice(1)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel: ring visualisation */}
      {!data.hideRingViz && (
        <div style={{ width: 600, background: T?.panel, borderLeft: `1px solid ${T?.border}`, padding: 16, overflowY: "auto" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: T?.textTert, textTransform: "uppercase", marginBottom: 12 }}>Ring Topology</div>
          <svg width="560" height="300" style={{ background: T?.bg }}>
            {/* Concentric circles */}
            {[100, 180, 260, 340, 420].map((r, i) => (
              <circle key={i} cx="280" cy="150" r={r} fill="none" stroke={T?.border} strokeWidth="1" opacity="0.3" />
            ))}
            {/* Entities positioned by tier */}
            {filteredEntities.map((entity, i) => {
              const tier = entity.tier;
              const [cx, cy] = rr[tier] || [280, 150];
              const color = T?.health?.[entity.health || "G"] || "#555";
              return (
                <g key={entity.id}>
                  <circle cx={cx} cy={cy} r="6" fill={color} />
                  <text x={cx} y={cy + 12} fontSize="8" fill={T?.textSec} textAnchor="middle">
                    {entity.name.slice(0, 5)}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      )}
    </div>
  );
};

/**
 * KanbanBoard — Column-based task board (from Build Backlog)
 * data: { columns: [{ id, name }, ...], items: [...] }
 */
export const KanbanBoard = ({ data, theme: T, onSelect, selectedItem, onAction }) => {
  if (!data || !data.columns || !data.items) return <div>No data</div>;

  const { columns, items } = data;

  return (
    <div style={{ display: "flex", gap: 12, padding: 16, overflowX: "auto", flex: 1 }}>
      {columns.map(col => {
        const colItems = items.filter(item => item.stage === col.id || item.column === col.id);
        return (
          <div
            key={col.id}
            style={{
              minWidth: 320,
              background: T?.panel,
              border: `1px solid ${T?.border}`,
              borderRadius: 8,
              padding: 12,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 12, color: T?.text }}>
              {col.name} ({colItems.length})
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
              {colItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => onSelect(item)}
                  style={{
                    background: T?.card,
                    border: `1px solid ${selectedItem?.id === item.id ? T?.tier?.T2 : T?.border}`,
                    borderRadius: 6,
                    padding: 10,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <div style={{ fontWeight: 700, fontSize: 11, color: T?.text }}>
                      {item.title || item.name}
                    </div>
                    <ActionIcon onClick={() => { event.stopPropagation(); onAction?.(item); }} theme={T} />
                  </div>
                  <div style={{ display: "flex", gap: 4, alignItems: "center", marginBottom: 4 }}>
                    {item.health && <HealthDot state={item.health} size={8} label={false} theme={T} />}
                    {item.priority && <Pill label={item.priority} color={T?.tier?.T1} small theme={T} />}
                  </div>
                  <div style={{ fontSize: 9, color: T?.textSec }}>
                    Owner: {item.owner || "Unassigned"} {item.age && ` | ${item.age} days old`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/**
 * CapabilitiesGrid — Grouped capabilities with evidence text
 * data: { capabilities: [{ category, name, evidence }, ...] }
 */
export const CapabilitiesGrid = ({ data, theme: T, onSelect }) => {
  if (!data || !data.capabilities) return <div>No capabilities</div>;

  const grouped = {};
  data.capabilities.forEach(cap => {
    if (!grouped[cap.category]) grouped[cap.category] = [];
    grouped[cap.category].push(cap);
  });

  return (
    <div style={{ padding: 16, overflowY: "auto" }}>
      {Object.entries(grouped).map(([category, caps]) => (
        <div key={category} style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T?.tier?.T2, textTransform: "uppercase", marginBottom: 12 }}>
            {category}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
            {caps.map((cap, i) => (
              <div
                key={i}
                onClick={() => onSelect(cap)}
                style={{
                  background: T?.card,
                  border: `1px solid ${T?.border}`,
                  borderRadius: 8,
                  padding: 12,
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: T?.tier?.T2, width: 24, textAlign: "center" }}>
                    {i + 1}
                  </span>
                  <span style={{ fontWeight: 700, fontSize: 11, color: T?.text }}>
                    {cap.name}
                  </span>
                </div>
                {cap.evidence && (
                  <div style={{ fontSize: 9, color: T?.textSec, lineHeight: 1.4 }}>
                    {cap.evidence}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * PatternsGrid — Pattern cards with live/partial/archived status
 * data: { patterns: [{ name, status, description }, ...] }
 */
export const PatternsGrid = ({ data, theme: T, onSelect, selectedItem }) => {
  if (!data || !data.patterns) return <div>No patterns</div>;

  const statusColors = {
    live: T?.health?.Gr,
    partial: T?.health?.A,
    archived: T?.health?.Bl,
  };

  return (
    <div style={{ padding: 16, overflowY: "auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
        {data.patterns.map(pattern => (
          <div
            key={pattern.name}
            onClick={() => onSelect(pattern)}
            style={{
              background: T?.card,
              border: `1px solid ${selectedItem?.name === pattern.name ? T?.tier?.T2 : T?.border}`,
              borderRadius: 8,
              padding: 12,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 12, color: T?.text }}>
                {pattern.name}
              </div>
              <StatusDot status={pattern.status} theme={T} />
            </div>
            <Pill
              label={pattern.status}
              color={statusColors[pattern.status] || T?.border}
              small
              theme={T}
            />
            {pattern.description && (
              <div style={{ fontSize: 9, color: T?.textSec, marginTop: 8, lineHeight: 1.4 }}>
                {pattern.description}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * IntegrationsGrid — Connected system cards with type and status
 * data: { integrations: [{ name, type, status }, ...] }
 */
export const IntegrationsGrid = ({ data, theme: T, onSelect, selectedItem }) => {
  if (!data || !data.integrations) return <div>No integrations</div>;

  return (
    <div style={{ padding: 16, overflowY: "auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
        {data.integrations.map(int => (
          <div
            key={int.name}
            onClick={() => onSelect(int)}
            style={{
              background: T?.card,
              border: `1px solid ${selectedItem?.name === int.name ? T?.tier?.T2 : T?.border}`,
              borderRadius: 8,
              padding: 12,
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 12, color: T?.text }}>
                {int.name}
              </div>
              <StatusDot status={int.status} pulse={int.status === "active"} theme={T} />
            </div>
            <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
              <Pill label={int.type} color={T?.tier?.T2 + "33"} fg={T?.tier?.T2} small theme={T} />
              <Pill label={int.status} color={T?.status?.[int.status] || T?.border} small theme={T} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * MetricsPanel — Metric cards + activity bars
 * data: { metrics: [{ name, value, unit, trend }, ...], activityBars?: [...] }
 */
export const MetricsPanel = ({ data, theme: T }) => {
  if (!data || !data.metrics) return <div>No metrics</div>;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, padding: 16 }}>
      {data.metrics.map((metric, i) => (
        <div
          key={i}
          style={{
            background: T?.card,
            border: `1px solid ${T?.border}`,
            borderRadius: 8,
            padding: 14,
          }}
        >
          <div style={{ fontSize: 10, color: T?.textSec, marginBottom: 6 }}>
            {metric.name}
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: T?.tier?.T2, marginBottom: 8 }}>
            {metric.value}
            <span style={{ fontSize: 10, color: T?.textTert }}> {metric.unit}</span>
          </div>
          {metric.trend && (
            <ProgressBar pct={metric.trend} color={T?.tier?.T3} width={100} theme={T} />
          )}
        </div>
      ))}
    </div>
  );
};

/**
 * ObjectiveStack — Numbered prioritised list with progress and health
 * data: { objectives: [{ code, name, progress, health, category }, ...] }
 */
export const ObjectiveStack = ({ data, theme: T, onSelect, selectedItem, onAction }) => {
  if (!data || !data.objectives) return <div>No objectives</div>;

  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12, overflowY: "auto" }}>
      {data.objectives.map((obj, i) => (
        <div
          key={obj.code}
          onClick={() => onSelect(obj)}
          style={{
            background: T?.card,
            border: `1px solid ${selectedItem?.code === obj.code ? T?.tier?.T2 : T?.border}`,
            borderRadius: 8,
            padding: 12,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 8 }}>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: T?.tier?.T2,
                color: "#111",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 12,
                flexShrink: 0,
              }}
            >
              {i + 1}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 12, color: T?.text, marginBottom: 4 }}>
                {obj.name}
              </div>
              <div style={{ fontSize: 9, color: T?.textTert, marginBottom: 6 }}>
                {obj.code}
              </div>
              <div style={{ display: "flex", gap: 4, alignItems: "center", marginBottom: 8 }}>
                <HealthDot state={obj.health || "G"} size={8} label={false} theme={T} />
                {obj.category && <Pill label={obj.category} color={T?.tier?.T1} small theme={T} />}
              </div>
              {obj.progress !== undefined && (
                <ProgressBar pct={obj.progress} color={T?.tier?.T3} width={120} theme={T} />
              )}
            </div>
            <ActionIcon onClick={() => { event.stopPropagation(); onAction?.(obj); }} theme={T} />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * TaskBoard — Filterable task cards with expandable detail
 * data: { tasks: [{ id, title, kso, status, gragbb, desc }, ...], filters: { ksos: [...], types: [...] } }
 */
export const TaskBoard = ({ data, theme: T, onSelect, selectedItem, onAction }) => {
  const [filterKso, setFilterKso] = useState("all");
  const [filterType, setFilterType] = useState("all");

  if (!data || !data.tasks) return <div>No tasks</div>;

  const { tasks, filters = { ksos: [], types: [] } } = data;
  const filtered = tasks.filter(
    t => (filterKso === "all" || t.kso === filterKso) && (filterType === "all" || t.type === filterType)
  );
  const urgentCount = filtered.filter(t => t.gragbb === "R" || t.gragbb === "A").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      {/* Filters */}
      <div style={{ padding: 12, borderBottom: `1px solid ${T?.border}`, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <select
          value={filterKso}
          onChange={(e) => setFilterKso(e.target.value)}
          style={{
            background: T?.card,
            border: `1px solid ${T?.border}`,
            color: T?.text,
            borderRadius: 4,
            padding: "6px 8px",
            fontSize: 10,
          }}
        >
          <option value="all">All KSOs</option>
          {filters.ksos?.map(k => <option key={k} value={k}>{k}</option>)}
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{
            background: T?.card,
            border: `1px solid ${T?.border}`,
            color: T?.text,
            borderRadius: 4,
            padding: "6px 8px",
            fontSize: 10,
          }}
        >
          <option value="all">All Types</option>
          {filters.types?.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <div style={{ flex: 1, textAlign: "right", fontSize: 9, color: T?.textSec }}>
          {filtered.length} | {urgentCount} urgent
        </div>
      </div>

      {/* Task list */}
      <div style={{ flex: 1, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map(task => (
          <div
            key={task.id}
            onClick={() => onSelect(task)}
            style={{
              background: T?.card,
              border: `1px solid ${selectedItem?.id === task.id ? T?.tier?.T2 : T?.border}`,
              borderRadius: 6,
              padding: 10,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
              <div style={{ fontWeight: 700, fontSize: 11, color: T?.text }}>
                {task.title}
              </div>
              <ActionIcon onClick={() => { event.stopPropagation(); onAction?.(task); }} theme={T} />
            </div>
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              {task.gragbb && <HealthDot state={task.gragbb} size={8} label={false} theme={T} />}
              {task.kso && <Pill label={task.kso} color={T?.tier?.T1} small theme={T} />}
              {task.status && <Pill label={task.status} color={T?.status?.[task.status] || T?.border} small theme={T} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * OutcomeGrid — Outcome tiles with health and category labels
 * data: { outcomes: [{ code, name, health, category }, ...] }
 */
export const OutcomeGrid = ({ data, theme: T, onSelect, selectedItem }) => {
  if (!data || !data.outcomes) return <div>No outcomes</div>;

  return (
    <div style={{ padding: 16, overflowY: "auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
        {data.outcomes.map(outcome => (
          <div
            key={outcome.code}
            onClick={() => onSelect(outcome)}
            style={{
              background: T?.card,
              border: `1px solid ${selectedItem?.code === outcome.code ? T?.tier?.T2 : T?.border}`,
              borderRadius: 8,
              padding: 12,
              cursor: "pointer",
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 12, color: T?.text, marginBottom: 6 }}>
              {outcome.name}
            </div>
            <div style={{ fontSize: 9, color: T?.textTert, marginBottom: 8 }}>
              {outcome.code}
            </div>
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              <HealthDot state={outcome.health} size={10} label={true} theme={T} />
              {outcome.category && <Pill label={outcome.category} color={T?.tier?.T1} small theme={T} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * QuadrantBalance — Quadrant cards showing worst-case health rollup
 * data: { quadrants: [{ name, klos: [code, ...] }, ...], klos: [{ code, health }, ...] }
 */
export const QuadrantBalance = ({ data, theme: T, onSelect, selectedItem }) => {
  if (!data || !data.quadrants) return <div>No quadrants</div>;

  const { quadrants, klos = [] } = data;
  const kloMap = Object.fromEntries(klos.map(k => [k.code, k.health]));

  return (
    <div style={{ padding: 16, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, overflowY: "auto" }}>
      {quadrants.map(quad => {
        const quadKlos = quad.klos || [];
        const worstCase = quadKlos.some(k => kloMap[k] === "R")
          ? "R"
          : quadKlos.some(k => kloMap[k] === "A")
          ? "A"
          : quadKlos.some(k => kloMap[k] === "Gr")
          ? "Gr"
          : "G";

        return (
          <div
            key={quad.name}
            onClick={() => onSelect(quad)}
            style={{
              background: T?.card,
              border: `1px solid ${selectedItem?.name === quad.name ? T?.tier?.T2 : T?.border}`,
              borderRadius: 8,
              padding: 16,
              cursor: "pointer",
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 13, color: T?.text, marginBottom: 10 }}>
              {quad.name}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <HealthDot state={worstCase} size={12} label={true} theme={T} />
              <span style={{ fontSize: 10, color: T?.textSec }}>Worst Case</span>
            </div>
            <div style={{ fontSize: 9, color: T?.textTert }}>
              {quadKlos.length} outcomes tracked
            </div>
          </div>
        );
      })}
    </div>
  );
};

/**
 * DriftDetection — Filters and shows Red/Amber health items
 * data: { entities: [...], objectives: [...] }
 */
export const DriftDetection = ({ data, theme: T, onSelect, selectedItem, onAction }) => {
  if (!data) return <div>No data</div>;

  const redItems = [];
  const amberItems = [];

  if (data.entities) {
    data.entities.forEach(e => {
      if (e.health === "R") redItems.push({ type: "entity", ...e });
      else if (e.health === "A") amberItems.push({ type: "entity", ...e });
    });
  }

  if (data.objectives) {
    data.objectives.forEach(o => {
      if (o.health === "R") redItems.push({ type: "objective", ...o });
      else if (o.health === "A") amberItems.push({ type: "objective", ...o });
    });
  }

  return (
    <div style={{ padding: 16, overflowY: "auto" }}>
      {/* Red Items */}
      {redItems.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: T?.health?.R,
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Critical ({redItems.length})
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {redItems.map(item => (
              <div
                key={item.id || item.code}
                onClick={() => onSelect(item)}
                style={{
                  background: (T?.health?.R || "#e94560") + "15",
                  border: `1px solid ${(T?.health?.R || "#e94560") + "44"}`,
                  borderRadius: 6,
                  padding: 10,
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 11, color: T?.text }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: 9, color: T?.textSec }}>
                      {item.type} {item.kso && `| ${item.kso}`}
                    </div>
                  </div>
                  <ActionIcon onClick={() => { event.stopPropagation(); onAction?.(item); }} theme={T} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Amber Items */}
      {amberItems.length > 0 && (
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: T?.health?.A,
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            At Risk ({amberItems.length})
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {amberItems.map(item => (
              <div
                key={item.id || item.code}
                onClick={() => onSelect(item)}
                style={{
                  background: (T?.health?.A || "#f5a623") + "15",
                  border: `1px solid ${(T?.health?.A || "#f5a623") + "44"}`,
                  borderRadius: 6,
                  padding: 10,
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 11, color: T?.text }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: 9, color: T?.textSec }}>
                      {item.type} {item.kso && `| ${item.kso}`}
                    </div>
                  </div>
                  <ActionIcon onClick={() => { event.stopPropagation(); onAction?.(item); }} theme={T} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {redItems.length === 0 && amberItems.length === 0 && (
        <div style={{ textAlign: "center", color: T?.textSec, fontSize: 11 }}>
          All systems healthy
        </div>
      )}
    </div>
  );
};
