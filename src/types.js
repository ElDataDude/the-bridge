/**
 * Type Definitions for The Bridge
 *
 * JSDoc @typedef declarations for the data model shapes.
 * Use these to document props and function signatures.
 * No TypeScript — keep it plain JavaScript.
 */

/**
 * @typedef {Object} Entity
 * @description Generalised from "agent". Represents a system entity (agent, service, etc).
 * @property {string} id — Unique identifier
 * @property {string} name — Display name
 * @property {string} tier — Hierarchy tier (T0–T4, where T0 is highest priority)
 * @property {string} role — Function or responsibility
 * @property {string} status — Lifecycle state: "active" | "staged" | "planned" | "concept" | "gap"
 * @property {string[]} surfaces — List of surface IDs this entity serves
 * @property {string} [description] — Prose description
 * @property {string} [icon] — Icon identifier or emoji
 * @property {string} [healthState] — Health indicator: "G" | "R" | "A" | "Gr" | "B" | "Bl"
 * @property {string} [healthExplain] — Reason for health state
 * @property {string} [actionTarget] — Skill/command name for drill-down
 * @property {Object} [metrics] — Key-value metrics snapshot
 * @property {string[]} [connections] — List of connected entity IDs
 * @property {boolean} [dimmed] — Visual emphasis flag
 */

/**
 * @typedef {Object} Objective
 * @description Generalised from "KSO". High-level outcome.
 * @property {string} id — Unique identifier
 * @property {string} code — Short code (e.g. "CAPITAL", "CAREER")
 * @property {string} name — Display name
 * @property {string} [healthState] — Health: "G" | "R" | "A" | "Gr" | "B" | "Bl"
 * @property {number} [progress] — Progress percentage (0–100)
 * @property {string} [category] — Classification (e.g. "strategic", "operational")
 * @property {string} [actionTarget] — Drill-down command/skill
 * @property {string} [explain] — Status explanation
 * @property {string[]} [risks] — Known risks
 * @property {string[]} [wins] — Completed wins/deliverables
 */

/**
 * @typedef {Object} BacklogItem
 * @description Generalised from build backlog. A captured piece of work.
 * @property {string} id — Unique identifier
 * @property {string} topic — Title or subject
 * @property {string} priority — "critical" | "high" | "normal" | "low"
 * @property {number} [age] — Age in days
 * @property {string} [owner] — Owner ID or name
 * @property {string} [healthState] — Health: "G" | "R" | "A" | "Gr" | "B" | "Bl"
 * @property {string} [stage] — Kanban column (e.g. "inbox", "in-progress", "done")
 * @property {string} [explain] — Description
 */

/**
 * @typedef {Object} Task
 * @description Generalised from GSD (Getting Stuff Done). A concrete action item.
 * @property {string} id — Unique identifier
 * @property {string} title — Task title
 * @property {string} [objectiveCode] — Parent objective code
 * @property {string} [type] — Task type (e.g. "build", "review", "decision")
 * @property {string[]} [people] — Assigned to (array of person IDs)
 * @property {string} [due] — Due date (ISO 8601)
 * @property {string} [actionTarget] — Drill-down command/skill
 * @property {string} [description] — Full description
 * @property {string[]} [options] — Multiple-choice options for decision tasks
 * @property {string} [healthState] — Health: "G" | "R" | "A" | "Gr" | "B" | "Bl"
 * @property {string} [healthExplain] — Health reason
 */

/**
 * @typedef {Object} KanbanColumn
 * @description Column definition for a kanban board.
 * @property {string} id — Column identifier (e.g. "inbox", "in-progress")
 * @property {string} label — Display label
 * @property {string} [icon] — Icon identifier
 * @property {string} [color] — Hex color
 * @property {string} [description] — What belongs here
 */

/**
 * @typedef {Object} Capability
 * @description Generalised from AOM "conditions". A system capability or dimension.
 * @property {string} id — Identifier
 * @property {string} name — Display name
 * @property {string} [category] — Classification
 * @property {string} [evidence] — Supporting detail or reference
 */

/**
 * @typedef {Object} Pattern
 * @description A proven process or architectural pattern.
 * @property {string} id — Identifier
 * @property {string} name — Display name
 * @property {string} status — "live" | "partial" | "planned"
 * @property {string} [description] — Pattern description
 */

/**
 * @typedef {Object} Integration
 * @description Connected system or external tool.
 * @property {string} name — Display name
 * @property {string} type — Integration type (e.g. "api", "webhook", "database")
 * @property {string} status — "live" | "partial" | "down"
 * @property {string} [description] — Integration notes
 * @property {Object} [metrics] — Key-value metrics
 */

/**
 * @typedef {Object} BusVitals
 * @description Flexible metric container — key-value store with metadata.
 * @property {string} [label] — Metric name/label
 * @property {*} [value] — Metric value (number, string, object)
 * @property {string} [color] — Semantic color key
 */

/**
 * @typedef {Object} MetricSet
 * @description Collection of metrics. Same as BusVitals but intended for aggregates.
 * @property {string} [label]
 * @property {*} [value]
 * @property {string} [color]
 */

/**
 * @typedef {Object} Outcome
 * @description Generalised from "KLO". A desired end state or result.
 * @property {string} code — Outcome code (e.g. "O1", "O2")
 * @property {string} [category] — Classification
 * @property {string} [healthState] — Health: "G" | "R" | "A" | "Gr" | "B" | "Bl"
 * @property {string} [explain] — Status or explanation
 */

/**
 * @typedef {Object} Quadrant
 * @description 2x2 or matrix cell for portfolio views.
 * @property {string} name — Quadrant label (e.g. "Quick Wins", "Strategic")
 * @property {string[]} [outcomeIds] — List of outcome IDs in this quadrant
 * @property {string} [color] — Hex color
 * @property {string} [description] — What goes here
 */

/**
 * @typedef {Object} CrewMember
 * @description Team member for a mode.
 * @property {string} letter — Single letter identifier (A, B, C, etc)
 * @property {string} name — Full name
 * @property {string} [role] — Role or title
 * @property {Object} [colors] — Color overrides {bg, text, accent, etc}
 */

/**
 * @typedef {Object} ModeTab
 * @description Tab within a mode.
 * @property {string} id — Tab identifier
 * @property {string} label — Display label
 * @property {string} [panel] — Panel component name or ID
 */

/**
 * @typedef {Object} ModeStat
 * @description Stat display within a mode.
 * @property {string} label — Stat label
 * @property {string|number} value — Stat value
 * @property {string} [color] — Color key
 */

/**
 * @typedef {Object} Mode
 * @description Operational mode — a preset configuration with crew, tabs, and stats.
 * @property {string} id — Mode identifier (e.g. "BUILD", "RUN")
 * @property {string} label — Display label
 * @property {string} [subtitle] — Subtitle or tagline
 * @property {string} [color] — Primary color
 * @property {CrewMember[]} [crew] — Team members
 * @property {ModeTab[]} [tabs] — Available tabs
 * @property {ModeStat[]} [stats] — Stat summaries
 */

/**
 * @typedef {Object} BridgeConfig
 * @description Top-level configuration object for the Bridge dashboard.
 * @property {string} [title] — Dashboard title
 * @property {string} [subtitle] — Dashboard subtitle
 * @property {Mode[]} [modes] — Available modes
 * @property {Object} data — All dashboard data
 * @property {Entity[]} [data.entities] — Agents, services, etc
 * @property {Objective[]} [data.objectives] — KSOs or outcomes
 * @property {BacklogItem[]} [data.backlog] — Work items
 * @property {Task[]} [data.tasks] — Actions
 * @property {KanbanColumn[]} [data.kanban] — Column definitions
 * @property {Capability[]} [data.capabilities] — System capabilities
 * @property {Pattern[]} [data.patterns] — Proven patterns
 * @property {Integration[]} [data.integrations] — Connected systems
 * @property {Outcome[]} [data.outcomes] — Strategic outcomes
 * @property {Quadrant[]} [data.quadrants] — Portfolio quadrants
 * @property {Object} [theme] — Theme object (from theme.js)
 * @property {Function} [onAction] — Callback: (actionTarget, context) => void
 * @property {string} [footer] — Footer text or JSX
 */

/**
 * Summary: type definitions are complete and ready for use in component props.
 * Example:
 *
 * export function Entity({ entity }) {
 *   // entity is of type Entity
 * }
 */
