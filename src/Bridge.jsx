/**
 * The Bridge — Control Room Dashboard Orchestrator
 *
 * Top-level component that manages mode selection, tab navigation, item selection,
 * action dispatch, and live clock. Renders Header, StatsBar, CommandCrew, TabBar,
 * MainContent (with active panel + detail drawer), Footer, and ActionLauncher.
 *
 * @module Bridge
 * @version 0.1.0
 * @example
 * import { Bridge } from './Bridge';
 * const config = { title: "#THE_BRIDGE", subtitle: "Control Room", modes: [...], data: {...}, ... };
 * <Bridge config={config} />
 */

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { defaultTheme, createTheme } from "./theme";
import { DetailDrawer, ActionLauncher } from "./components";
import { fetchBridgeTasks, readCachedTasks, submitBridgeTask } from "./dispatcherClient";
import {
  EntityGrid, KanbanBoard, CapabilitiesGrid, PatternsGrid,
  IntegrationsGrid, MetricsPanel, ObjectiveStack, TaskBoard,
  OutcomeGrid, QuadrantBalance, DriftDetection, LiveTaskBoard
} from "./panels";

/**
 * Panel component map — maps panel name strings from config to React components.
 * @type {Object.<string, React.ComponentType>}
 */
const panelMap = {
  EntityGrid, KanbanBoard, CapabilitiesGrid, PatternsGrid,
  IntegrationsGrid, MetricsPanel, ObjectiveStack, TaskBoard,
  OutcomeGrid, QuadrantBalance, DriftDetection, LiveTaskBoard,
};

/**
 * Bridge — Main orchestrator component
 *
 * @component
 * @param {Object} props
 * @param {BridgeConfig} props.config — Dashboard configuration
 * @returns {React.ReactElement} The rendered dashboard
 */
export function Bridge({ config = {} }) {
  // === Theme Setup ===
  const theme = useMemo(
    () => (config.theme ? createTheme(config.theme) : defaultTheme),
    [config.theme]
  );

  // === State Management ===
  const [mode, setMode] = useState(config.modes?.[0]?.id || "build");
  const [activeTab, setActiveTab] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [actionTarget, setActionTarget] = useState(null);
  const [time, setTime] = useState(new Date());
  const [taskFilter, setTaskFilter] = useState("all");
  const [expandedTask, setExpandedTask] = useState(null);
  const [liveTasks, setLiveTasks] = useState(() => readCachedTasks(config.dispatcher));
  const [liveTaskStatus, setLiveTaskStatus] = useState({
    state: "cached",
    message: "Showing cached assignments",
    checkedAt: null,
  });

  // === Live Clock ===
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const refreshLiveTasks = useCallback(async () => {
    if (!config.dispatcher) return [];
    setLiveTaskStatus((current) => ({ ...current, state: "loading", message: "Refreshing assignments" }));
    try {
      const tasks = await fetchBridgeTasks(config.dispatcher);
      setLiveTasks(tasks);
      setLiveTaskStatus({
        state: "ok",
        message: `${tasks.length} assignment${tasks.length === 1 ? "" : "s"} loaded`,
        checkedAt: new Date().toISOString(),
      });
      return tasks;
    } catch (error) {
      setLiveTaskStatus({
        state: "error",
        message: error instanceof Error ? error.message : String(error),
        checkedAt: new Date().toISOString(),
      });
      return [];
    }
  }, [config.dispatcher]);

  useEffect(() => {
    setLiveTasks(readCachedTasks(config.dispatcher));
    setLiveTaskStatus({
      state: "cached",
      message: "Showing cached assignments",
      checkedAt: null,
    });
  }, [config.dispatcher]);

  useEffect(() => {
    if (!config.dispatcher) return undefined;
    refreshLiveTasks();
    const interval = setInterval(refreshLiveTasks, config.dispatcher.pollIntervalMs || 15000);
    return () => clearInterval(interval);
  }, [config.dispatcher, refreshLiveTasks]);

  // === Mode Management ===
  const currentModeObj = useMemo(
    () => config.modes?.find((m) => m.id === mode),
    [mode, config.modes]
  );

  // Reset to first tab when mode changes
  useEffect(() => {
    if (currentModeObj?.tabs?.length) {
      setActiveTab(currentModeObj.tabs[0].id);
    }
  }, [mode, currentModeObj]);

  // Default to first tab on mount
  useEffect(() => {
    if (!activeTab && currentModeObj?.tabs?.length) {
      setActiveTab(currentModeObj.tabs[0].id);
    }
  }, []);

  // === Tab Management ===
  const currentTab = useMemo(
    () =>
      currentModeObj?.tabs?.find((t) => t.id === activeTab) ||
      currentModeObj?.tabs?.[0],
    [activeTab, currentModeObj]
  );

  // === Handlers ===
  const handleModeToggle = (newModeId) => {
    setMode(newModeId);
    setSelectedItem(null);
    setActionTarget(null);
  };

  const handleTabSelect = (tabId) => {
    setActiveTab(tabId);
    setSelectedItem(null);
    setActionTarget(null);
  };

  const handleItemSelect = (item) => {
    setSelectedItem(item);
  };

  const handleAction = (item) => {
    setActionTarget(item);
    if (config.onAction) {
      config.onAction(item);
    }
  };

  const handleAssignmentSubmit = async (payload) => {
    const result = await submitBridgeTask(config.dispatcher, payload);
    await refreshLiveTasks();
    return result;
  };

  const handleActionClose = () => {
    setActionTarget(null);
  };

  const handleDetailDrawerClose = () => {
    setSelectedItem(null);
  };

  // === Render Panel ===
  const PanelComponent = currentTab?.panel ? panelMap[currentTab.panel] : null;

  // === Styles ===
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      backgroundColor: theme.bg,
      color: theme.text,
      fontFamily: theme.font,
      overflow: "hidden",
    },
    header: {
      backgroundColor: theme.bg,
      borderBottom: `1px solid ${theme.border}`,
      padding: "12px 16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      zIndex: 100,
    },
    headerLeft: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
      flex: 1,
    },
    headerTitle: {
      fontSize: "18px",
      fontWeight: 600,
      background: `linear-gradient(90deg, ${currentModeObj?.color || theme.tier.T0}, ${theme.tier.T2})`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      textFillColor: "transparent",
    },
    headerSubtitle: {
      fontSize: "12px",
      color: theme.textSec,
      fontWeight: 400,
    },
    modePills: {
      display: "flex",
      gap: "8px",
    },
    modePill: (isActive) => ({
      padding: "6px 12px",
      fontSize: "11px",
      fontWeight: 600,
      border: `1px solid ${isActive ? theme.border : "transparent"}`,
      backgroundColor: isActive ? theme.card : "transparent",
      color: isActive ? theme.text : theme.textSec,
      cursor: "pointer",
      borderRadius: "4px",
      transition: "all 150ms ease",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    }),
    headerRight: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      fontSize: "12px",
      color: theme.textSec,
    },
    assignButton: {
      border: `1px solid ${theme.tier.T2}`,
      background: `${theme.tier.T2}22`,
      color: theme.tier.T2,
      borderRadius: 6,
      padding: "7px 10px",
      fontSize: 11,
      fontWeight: 800,
      cursor: "pointer",
      fontFamily: theme.font,
      whiteSpace: "nowrap",
    },
    clock: {
      fontFamily: "monospace",
      fontSize: "13px",
    },
    statsBar: {
      backgroundColor: theme.statsBar,
      padding: "8px 16px",
      display: "flex",
      gap: "24px",
      borderBottom: `1px solid ${theme.border}`,
      overflow: "auto",
      whiteSpace: "nowrap",
    },
    statPill: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "4px",
      fontSize: "11px",
      minWidth: "60px",
    },
    statValue: (color) => ({
      fontSize: "16px",
      fontWeight: 700,
      color: color || theme.tier.T0,
    }),
    statLabel: {
      color: theme.textTert,
      fontSize: "9px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    crewBar: {
      backgroundColor: theme.card,
      padding: "12px 16px",
      borderBottom: `1px solid ${theme.border}`,
      display: "flex",
      alignItems: "center",
      gap: "16px",
    },
    crewAvatars: {
      display: "flex",
      gap: "8px",
    },
    avatar: (colors) => ({
      width: "32px",
      height: "32px",
      borderRadius: "50%",
      backgroundColor: colors?.[0] || theme.tier.T0,
      color: colors?.[1] || theme.text,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "12px",
      fontWeight: 700,
      border: `1px solid ${theme.border}`,
    }),
    crewInfo: {
      display: "flex",
      flexDirection: "column",
      gap: "2px",
    },
    crewTagline: {
      fontSize: "12px",
      fontWeight: 600,
      color: theme.text,
    },
    crewSubtitle: {
      fontSize: "11px",
      color: theme.textSec,
    },
    tabBar: {
      backgroundColor: theme.bg,
      borderBottom: `1px solid ${theme.border}`,
      display: "flex",
      gap: "0",
      padding: "0 16px",
      overflow: "auto",
      whiteSpace: "nowrap",
    },
    tab: (isActive, color) => ({
      padding: "10px 12px",
      fontSize: "12px",
      fontWeight: isActive ? 600 : 500,
      color: isActive ? theme.text : theme.textSec,
      cursor: "pointer",
      borderBottom: isActive ? `2px solid ${color || theme.tier.T0}` : "none",
      backgroundColor: "transparent",
      border: "none",
      transition: "all 150ms ease",
      whiteSpace: "nowrap",
    }),
    mainContent: {
      flex: 1,
      display: "flex",
      gap: "0",
      overflow: "hidden",
      position: "relative",
    },
    panelContainer: {
      flex: 1,
      overflow: "auto",
      padding: "16px",
      backgroundColor: theme.panel,
      position: "relative",
    },
    footer: {
      backgroundColor: theme.card,
      borderTop: `1px solid ${theme.border}`,
      padding: "8px 16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      fontSize: "11px",
      color: theme.textSec,
      minHeight: "32px",
    },
    footerLeft: {
      flex: 1,
    },
    footerCenter: {
      display: "flex",
      gap: "12px",
    },
    indicator: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    statusDot: (status) => {
      const statusColors = {
        active: theme.status.active,
        staged: theme.status.staged,
        planned: theme.status.planned,
      };
      return {
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        backgroundColor: statusColors[status] || theme.textTert,
      };
    },
    footerRight: {
      flex: 1,
      textAlign: "right",
    },
  };

  // === Keyframes (global styles) ===
  const keyframes = `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    @keyframes scanline {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100%); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>

      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.headerTitle}>{config.title || "#THE_BRIDGE"}</div>
            <div style={styles.headerSubtitle}>
              {config.subtitle || "Control Room"}
            </div>

            <div style={styles.modePills}>
              {config.modes?.map((m) => (
                <button
                  key={m.id}
                  style={styles.modePill(m.id === mode)}
                  onClick={() => handleModeToggle(m.id)}
                  title={m.subtitle}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.headerRight}>
            {config.dispatcher && (
              <button
                style={styles.assignButton}
                onClick={() =>
                  handleAction({
                    id: "new-assignment",
                    name: "New assignment",
                    title: "New assignment",
                    skill: "case",
                    description: "Create a new handoff for the estate-agent team coordinator.",
                  })
                }
              >
                + Assign Work
              </button>
            )}
            <div style={styles.clock}>
              {time.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        {currentModeObj?.stats && currentModeObj.stats.length > 0 && (
          <div style={styles.statsBar}>
            {currentModeObj.stats.map((stat, idx) => (
              <div key={idx} style={styles.statPill}>
                <div style={styles.statValue(stat.color)}>{stat.value}</div>
                <div style={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Command Crew */}
        {currentModeObj?.crew && currentModeObj.crew.length > 0 && (
          <div style={styles.crewBar}>
            <div style={styles.crewAvatars}>
              {currentModeObj.crew.map((member) => (
                <div
                  key={member.letter}
                  style={styles.avatar(member.colors)}
                  title={`${member.name} — ${member.role}`}
                >
                  {member.letter}
                </div>
              ))}
            </div>
            <div style={styles.crewInfo}>
              <div style={styles.crewTagline}>{currentModeObj.tagline}</div>
              <div style={styles.crewSubtitle}>{currentModeObj.subtitle}</div>
            </div>
          </div>
        )}

        {/* Tab Bar */}
        {currentModeObj?.tabs && currentModeObj.tabs.length > 0 && (
          <div style={styles.tabBar}>
            {currentModeObj.tabs.map((tab) => (
              <button
                key={tab.id}
                style={styles.tab(tab.id === activeTab, currentModeObj.color)}
                onClick={() => handleTabSelect(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Main Content */}
        <div style={styles.mainContent}>
          <div style={styles.panelContainer}>
            {PanelComponent ? (
              <PanelComponent
                data={config.data}
                theme={theme}
                onSelect={handleItemSelect}
                selectedItem={selectedItem}
                onAction={handleAction}
                liveTasks={liveTasks}
                liveTaskStatus={liveTaskStatus}
                onRefreshTasks={refreshLiveTasks}
              />
            ) : (
              <div style={{ color: theme.textTert, padding: "20px" }}>
                Panel not found: {currentTab?.panel}
              </div>
            )}

            {/* Detail Drawer */}
            {selectedItem && (
              <DetailDrawer
                item={selectedItem}
                onClose={handleDetailDrawerClose}
                onAction={handleAction}
                theme={theme}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <div style={styles.footerLeft}>
            {config.footer?.left || "The Bridge"}
          </div>

          <div style={styles.footerCenter}>
            {config.footer?.indicators?.map((ind, idx) => (
              <div key={idx} style={styles.indicator}>
                <div style={styles.statusDot(ind.status)} />
                <span>{ind.label}</span>
              </div>
            ))}
          </div>

          <div style={styles.footerRight}>
            {config.footer?.right || "v0.1.0"}
          </div>
        </div>
      </div>

      {/* Action Launcher Overlay */}
      {actionTarget && (
        <ActionLauncher
          item={actionTarget}
          onClose={handleActionClose}
          getStarterPrompt={config.getStarterPrompt}
          actionLabel={config.actionLabel || "Start Session"}
          theme={theme}
          dispatcher={config.dispatcher}
          taskTemplates={config.taskTemplates || []}
          onSubmit={handleAssignmentSubmit}
        />
      )}
    </>
  );
}

export default Bridge;
