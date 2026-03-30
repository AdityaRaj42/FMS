import React, { useCallback, useMemo, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  Handle,
  Position,
  BackgroundVariant,
  Panel,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ChevronDown, ChevronRight, ChevronUp, Key, Link as LinkIcon } from 'lucide-react';

const DOMAIN_COLORS: Record<string, string> = {
  'Workforce': '#3b82f6', // blue
  'Client & Site': '#10b981', // green
  'Scheduling': '#8b5cf6', // purple
  'Work Orders': '#f97316', // orange
  'IoT': '#06b6d4', // cyan
  'Inventory & Assets': '#eab308', // yellow
  'Forecasting': '#ec4899', // pink
  'Compliance': '#ef4444', // red
  'Customer Experience': '#14b8a6', // teal
  'AI Agent': '#6366f1', // indigo
};

interface ColumnDef {
  name: string;
  type: string;
  isPk?: boolean;
  isFk?: boolean;
}

interface TableData {
  label: string;
  domain: string;
  isAnchor?: boolean;
  columns: ColumnDef[];
}

const TableNode = ({ data, id }: { data: TableData; id: string }) => {
  const [expanded, setExpanded] = useState(data.isAnchor || false);
  const color = DOMAIN_COLORS[data.domain] || '#64748b';

  return (
    <div
      style={{
        background: 'rgba(15, 23, 42, 0.95)',
        border: `1px solid ${data.isAnchor ? color : 'rgba(255,255,255,0.1)'}`,
        boxShadow: data.isAnchor ? `0 0 20px ${color}40` : '0 8px 32px rgba(0, 0, 0, 0.4)',
        borderRadius: '8px',
        width: 260,
        fontFamily: "'Inter', sans-serif",
        backdropFilter: 'blur(12px)',
        overflow: 'hidden',
        color: '#fff',
      }}
    >
      {/* Top Handle for incoming edges */}
      <Handle type="target" position={Position.Top} id="top" style={{ background: color, border: 'none', width: 6, height: 6 }} />
      
      {/* Header */}
      <div 
        onClick={() => setExpanded(!expanded)}
        style={{
          background: `linear-gradient(90deg, ${color}30 0%, ${color}10 100%)`,
          borderBottom: `1px solid ${color}40`,
          padding: '10px 12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.02em', color: '#fff' }}>
              {data.label}
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
              {data.domain}
            </div>
          </div>
        </div>
        {expanded ? <ChevronDown size={14} color="rgba(255,255,255,0.5)" /> : <ChevronRight size={14} color="rgba(255,255,255,0.5)" />}
      </div>

      {/* Columns */}
      {expanded && (
        <div style={{ padding: '6px 0', background: 'rgba(0,0,0,0.2)' }}>
          {data.columns.map((col, idx) => (
            <div key={idx} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '6px 12px',
              fontSize: 11,
              borderBottom: idx === data.columns.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)',
              background: col.isPk ? 'rgba(255,255,255,0.03)' : 'transparent'
            }}>
              <div style={{ width: 14, display: 'flex', justifyContent: 'center', marginRight: 8 }}>
                {col.isPk && <Key size={12} color="#eab308" />}
                {col.isFk && <LinkIcon size={12} color="#94a3b8" />}
              </div>
              <div style={{ flex: 1, fontWeight: col.isPk ? 600 : 400, color: col.isPk ? '#fff' : 'rgba(255,255,255,0.8)' }}>
                {col.name}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>
                {col.type}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Handle for outgoing edges */}
      <Handle type="source" position={Position.Bottom} id="bottom" style={{ background: color, border: 'none', width: 6, height: 6 }} />
      <Handle type="source" position={Position.Right} id="right" style={{ background: color, border: 'none', width: 6, height: 6, right: -3 }} />
      <Handle type="target" position={Position.Left} id="left" style={{ background: color, border: 'none', width: 6, height: 6, left: -3 }} />
    </div>
  );
};

// Data Definition
const DOMAIN_01 = 'Workforce';
const DOMAIN_02 = 'Client & Site';
const DOMAIN_03 = 'Scheduling';
const DOMAIN_04 = 'Work Orders';
const DOMAIN_05 = 'IoT';
const DOMAIN_06 = 'Inventory & Assets';
const DOMAIN_07 = 'Forecasting';
const DOMAIN_08 = 'Compliance';
const DOMAIN_09 = 'Customer Experience';
const DOMAIN_10 = 'AI Agent';

const baseNodes: Node[] = [
  // ---------------- Domain 01: Workforce ----------------
  { id: 'workers', position: { x: 800, y: 700 }, data: { label: 'workers', domain: DOMAIN_01, isAnchor: true, columns: [
    { name: 'id', type: 'uuid', isPk: true },
    { name: 'name', type: 'varchar' },
    { name: 'role', type: 'varchar' },
    { name: 'status', type: 'enum' },
  ] } },
  { id: 'certifications', position: { x: 500, y: 650 }, data: { label: 'worker_certifications', domain: DOMAIN_01, columns: [
    { name: 'id', type: 'uuid', isPk: true },
    { name: 'worker_id', type: 'uuid', isFk: true },
    { name: 'cert_type', type: 'varchar' },
  ] } },
  { id: 'assessments', position: { x: 500, y: 750 }, data: { label: 'worker_skill_assessments', domain: DOMAIN_01, columns: [
    { name: 'id', type: 'uuid', isPk: true },
    { name: 'worker_id', type: 'uuid', isFk: true },
    { name: 'score', type: 'int' },
  ] } },
  { id: 'availability', position: { x: 500, y: 850 }, data: { label: 'worker_availability_calendar', domain: DOMAIN_01, columns: [
    { name: 'id', type: 'uuid', isPk: true },
    { name: 'worker_id', type: 'uuid', isFk: true },
    { name: 'date', type: 'date' },
  ] } },
  { id: 'employment_history', position: { x: 500, y: 950 }, data: { label: 'worker_employment_history', domain: DOMAIN_01, columns: [
    { name: 'id', type: 'uuid', isPk: true },
    { name: 'worker_id', type: 'uuid', isFk: true },
    { name: 'start_date', type: 'date' },
  ] } },

  // ---------------- Domain 02: Client & Site ----------------
  { id: 'clients', position: { x: 2000, y: 100 }, data: { label: 'clients', domain: DOMAIN_02, columns: [
    { name: 'id', type: 'uuid', isPk: true },
    { name: 'name', type: 'varchar' },
  ] } },
  { id: 'sites', position: { x: 1600, y: 250 }, data: { label: 'sites', domain: DOMAIN_02, isAnchor: true, columns: [
    { name: 'id', type: 'uuid', isPk: true },
    { name: 'client_id', type: 'uuid', isFk: true },
    { name: 'location', type: 'varchar' },
  ] } },
  { id: 'site_zones', position: { x: 1300, y: 400 }, data: { label: 'site_zones', domain: DOMAIN_02, columns: [
    { name: 'id', type: 'uuid', isPk: true },
    { name: 'site_id', type: 'uuid', isFk: true },
    { name: 'zone_name', type: 'varchar' },
  ] } },
  { id: 'contracts', position: { x: 2000, y: 300 }, data: { label: 'contracts', domain: DOMAIN_02, isAnchor: true, columns: [
    { name: 'id', type: 'uuid', isPk: true },
    { name: 'client_id', type: 'uuid', isFk: true },
    { name: 'value', type: 'decimal' },
  ] } },
  { id: 'sla_definitions', position: { x: 2350, y: 350 }, data: { label: 'contract_sla_definitions', domain: DOMAIN_02, columns: [
    { name: 'id', type: 'uuid', isPk: true },
    { name: 'contract_id', type: 'uuid', isFk: true },
    { name: 'metric', type: 'varchar' },
  ] } },

  // ---------------- Domain 03: Scheduling ----------------
  { id: 'shifts', position: { x: 1200, y: 650 }, data: { label: 'shifts', domain: DOMAIN_03, columns: [
    { name: 'id', type: 'uuid', isPk: true },
    { name: 'site_id', type: 'uuid', isFk: true },
    { name: 'start_time', type: 'timestamp' },
    { name: 'end_time', type: 'timestamp' },
  ] } },
  { id: 'assignments', position: { x: 1000, y: 500 }, data: { label: 'shift_assignments', domain: DOMAIN_03, columns: [
    { name: 'id', type: 'uuid', isPk: true },
    { name: 'shift_id', type: 'uuid', isFk: true },
    { name: 'worker_id', type: 'uuid', isFk: true },
  ] } },
  { id: 'attendance', position: { x: 1000, y: 800 }, data: { label: 'attendance_events', domain: DOMAIN_03, columns: [
    { name: 'id', type: 'uuid', isPk: true },
    { name: 'shift_id', type: 'uuid', isFk: true },
    { name: 'worker_id', type: 'uuid', isFk: true },
    { name: 'clock_in', type: 'timestamp' },
  ] } },
  { id: 'overtime', position: { x: 1200, y: 850 }, data: { label: 'overtime_records', domain: DOMAIN_03, columns: [
    { name: 'id', type: 'uuid', isPk: true },
    { name: 'shift_id', type: 'uuid', isFk: true },
    { name: 'worker_id', type: 'uuid', isFk: true },
    { name: 'hours', type: 'decimal' },
  ] } },

  // ---------------- Domain 04: Work Orders ----------------
  { id: 'work_orders', position: { x: 1800, y: 550 }, data: { label: 'work_orders', domain: DOMAIN_04, columns: [
    { name: 'id', type: 'uuid', isPk: true },
    { name: 'site_id', type: 'uuid', isFk: true },
    { name: 'contract_id', type: 'uuid', isFk: true },
    { name: 'status', type: 'varchar' },
  ] } },
  { id: 'tasks', position: { x: 1500, y: 650 }, data: { label: 'work_order_tasks', domain: DOMAIN_04, columns: [
    { name: 'id', type: 'uuid', isPk: true },
    { name: 'work_order_id', type: 'uuid', isFk: true },
    { name: 'zone_id', type: 'uuid', isFk: true },
    { name: 'worker_id', type: 'uuid', isFk: true },
  ] } },

  // ---------------- Domain 05: IoT ----------------
  { id: 'sensors', position: { x: 1600, y: 900 }, data: { label: 'iot_sensors', domain: DOMAIN_05, columns: [
    { name: 'id', type: 'uuid', isPk: true },
    { name: 'site_id', type: 'uuid', isFk: true },
    { name: 'zone_id', type: 'uuid', isFk: true },
    { name: 'type', type: 'varchar' },
  ] } },
  { id: 'readings', position: { x: 1800, y: 1050 }, data: { label: 'iot_sensor_readings', domain: DOMAIN_05, columns: [
    { name: 'id', type: 'uuid', isPk: true },
    { name: 'sensor_id', type: 'uuid', isFk: true },
    { name: 'value', type: 'jsonb' },
  ] } },
  { id: 'occupancy', position: { x: 1400, y: 1050 }, data: { label: 'zone_occupancy_aggregates', domain: DOMAIN_05, columns: [
    { name: 'id', type: 'uuid', isPk: true },
    { name: 'zone_id', type: 'uuid', isFk: true },
    { name: 'count', type: 'int' },
  ] } },

  // ---------------- Domain 06: Inventory & Assets ----------------
  { id: 'assets', position: { x: 2200, y: 700 }, data: { label: 'equipment_assets', domain: DOMAIN_06, columns: [
    { name: 'id', type: 'uuid', isPk: true },
    { name: 'site_id', type: 'uuid', isFk: true },
    { name: 'worker_id', type: 'uuid', isFk: true }, // assigned to
    { name: 'name', type: 'varchar' },
  ] } },
  { id: 'maintenance', position: { x: 2200, y: 850 }, data: { label: 'equipment_maintenance_log', domain: DOMAIN_06, columns: [
    { name: 'id', type: 'uuid', isPk: true },
    { name: 'asset_id', type: 'uuid', isFk: true },
    { name: 'date', type: 'date' },
  ] } },
  { id: 'inventory', position: { x: 2500, y: 600 }, data: { label: 'inventory_items', domain: DOMAIN_06, columns: [
    { name: 'id', type: 'uuid', isPk: true },
    { name: 'site_id', type: 'uuid', isFk: true },
    { name: 'name', type: 'varchar' },
  ] } },
  { id: 'transactions', position: { x: 2200, y: 550 }, data: { label: 'inventory_transactions', domain: DOMAIN_06, columns: [
    { name: 'id', type: 'uuid', isPk: true },
    { name: 'item_id', type: 'uuid', isFk: true },
    { name: 'work_order_id', type: 'uuid', isFk: true },
    { name: 'worker_id', type: 'uuid', isFk: true },
  ] } },

  // ---------------- Domain 07: Forecasting ----------------
  { id: 'forecast_inputs', position: { x: 1300, y: 50 }, data: { label: 'demand_forecast_inputs', domain: DOMAIN_07, columns: [
    { name: 'id', type: 'uuid', isPk: true },
    { name: 'site_id', type: 'uuid', isFk: true },
    { name: 'data', type: 'jsonb' },
  ] } },
  { id: 'forecasts', position: { x: 1000, y: 50 }, data: { label: 'workforce_demand_forecasts', domain: DOMAIN_07, columns: [
    { name: 'id', type: 'uuid', isPk: true },
    { name: 'input_id', type: 'uuid', isFk: true },
    { name: 'prediction', type: 'jsonb' },
  ] } },

  // ---------------- Domain 08: Compliance ----------------
  { id: 'violations', position: { x: 800, y: 250 }, data: { label: 'compliance_violations', domain: DOMAIN_08, columns: [
    { name: 'id', type: 'uuid', isPk: true },
    { name: 'worker_id', type: 'uuid', isFk: true },
    { name: 'site_id', type: 'uuid', isFk: true },
    { name: 'description', type: 'text' },
  ] } },
  { id: 'regulations', position: { x: 500, y: 250 }, data: { label: 'labor_regulations', domain: DOMAIN_08, columns: [
    { name: 'id', type: 'uuid', isPk: true },
    { name: 'rule', type: 'varchar' },
  ] } }, // No direct FK specified in prompt but belongs to domain

  // ---------------- Domain 09: Customer Experience ----------------
  { id: 'tickets', position: { x: 2500, y: 200 }, data: { label: 'service_tickets', domain: DOMAIN_09, columns: [
    { name: 'id', type: 'uuid', isPk: true },
    { name: 'contract_id', type: 'uuid', isFk: true },
    { name: 'issue', type: 'text' },
  ] } },
  { id: 'feedback', position: { x: 2500, y: 350 }, data: { label: 'periodic_client_feedback', domain: DOMAIN_09, columns: [
    { name: 'id', type: 'uuid', isPk: true },
    { name: 'contract_id', type: 'uuid', isFk: true },
    { name: 'rating', type: 'int' },
  ] } },

  // ---------------- Domain 10: AI Agent ----------------
  { id: 'decisions', position: { x: 800, y: 450 }, data: { label: 'agent_decisions', domain: DOMAIN_10, columns: [
    { name: 'id', type: 'uuid', isPk: true },
    { name: 'action', type: 'varchar' },
    { name: 'confidence', type: 'decimal' },
  ] } },
].map(node => ({ ...node, type: 'tableNode' }));

// Helper to create edges with standard DB styling
const createEdge = (source: string, target: string, sourceHandle?: string, targetHandle?: string): Edge => ({
  id: `e-${source}-${target}`,
  source,
  target,
  sourceHandle,
  targetHandle,
  type: 'smoothstep',
  animated: true,
  style: { stroke: 'rgba(255,255,255,0.4)', strokeWidth: 1.5 },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: 'rgba(255,255,255,0.6)',
  },
});

const baseEdges: Edge[] = [
  // Workforce -> Relationships
  createEdge('workers', 'certifications', 'left', 'right'),
  createEdge('workers', 'assessments', 'left', 'right'),
  createEdge('workers', 'availability', 'left', 'right'),
  createEdge('workers', 'employment_history', 'left', 'right'),
  createEdge('workers', 'assignments', 'top', 'bottom'),
  createEdge('workers', 'attendance', 'right', 'left'),
  createEdge('workers', 'overtime', 'right', 'left'),
  createEdge('workers', 'tasks', 'top', 'left'),
  createEdge('workers', 'violations', 'top', 'bottom'),
  createEdge('workers', 'assets', 'bottom', 'bottom'),
  createEdge('workers', 'transactions', 'bottom', 'bottom'),

  // Client & Site -> Relationships
  createEdge('clients', 'sites', 'bottom', 'top'),
  createEdge('clients', 'contracts', 'bottom', 'top'),
  createEdge('sites', 'site_zones', 'left', 'top'),
  createEdge('sites', 'shifts', 'left', 'top'),
  createEdge('sites', 'work_orders', 'right', 'top'),
  createEdge('sites', 'sensors', 'bottom', 'top'),
  createEdge('sites', 'inventory', 'right', 'top'),
  createEdge('sites', 'assets', 'right', 'top'),
  createEdge('contracts', 'sla_definitions', 'right', 'left'),
  createEdge('contracts', 'work_orders', 'bottom', 'top'),

  // Scheduling -> Relationships
  createEdge('shifts', 'assignments', 'top', 'right'),
  createEdge('shifts', 'attendance', 'bottom', 'right'),
  createEdge('shifts', 'overtime', 'bottom', 'top'),
  createEdge('assignments', 'workers', 'bottom', 'top'),
  createEdge('attendance', 'workers', 'left', 'right'),

  // Work Orders -> Relationships
  createEdge('work_orders', 'tasks', 'left', 'right'),
  createEdge('tasks', 'site_zones', 'top', 'bottom'),
  createEdge('tasks', 'workers', 'bottom', 'top'),
  createEdge('work_orders', 'transactions', 'bottom', 'top'),

  // IoT -> Relationships
  createEdge('site_zones', 'sensors', 'right', 'left'),
  createEdge('sensors', 'readings', 'bottom', 'top'),
  createEdge('site_zones', 'occupancy', 'bottom', 'top'),

  // Inventory & Assets -> Relationships
  createEdge('assets', 'maintenance', 'bottom', 'top'),
  createEdge('inventory', 'transactions', 'bottom', 'right'),
  
  // Forecasting -> Relationships
  createEdge('sites', 'forecast_inputs', 'top', 'right'),
  createEdge('forecast_inputs', 'forecasts', 'left', 'right'),

  // Compliance -> Relationships
  createEdge('sites', 'violations', 'left', 'right'),

  // Customer Experience -> Relationships
  createEdge('contracts', 'tickets', 'right', 'left'),
  createEdge('contracts', 'feedback', 'right', 'left'),

  // AI Agent -> Relationships
  createEdge('decisions', 'shifts', 'right', 'left'),
  createEdge('decisions', 'assignments', 'right', 'left'),
];

export function GraphInsightsPage() {
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [nodes, setNodes, onNodesChange] = useNodesState(baseNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(baseEdges);

  const nodeTypes = useMemo(() => ({ tableNode: TableNode }), []);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: 'rgba(255,255,255,0.4)', strokeWidth: 1.5 } }, eds)),
    [setEdges],
  );

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#020617' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={4}
        defaultEdgeOptions={{ type: 'smoothstep' }}
        proOptions={{ hideAttribution: true }}
      >
        <Controls 
          style={{ 
            background: 'rgba(15,23,42,0.9)', 
            fill: '#fff', 
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            overflow: 'hidden'
          }} 
        />
        <MiniMap 
          nodeStrokeWidth={3} 
          zoomable 
          pannable 
          style={{ 
            background: 'rgba(15,23,42,0.9)', 
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            margin: 16
          }}
          nodeColor={(node: any) => DOMAIN_COLORS[node.data?.domain] || '#64748b'}
          maskColor="rgba(0,0,0,0.6)"
        />
        <Background variant={BackgroundVariant.Dots} gap={24} size={2} color="rgba(255,255,255,0.05)" />
        
        <Panel position="top-left" style={{ margin: 24, pointerEvents: 'none' }}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: isPanelOpen ? '24px' : '16px 24px',
            borderRadius: 16,
            boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
            pointerEvents: 'auto',
            width: 320,
            transition: 'all 0.3s ease'
          }}>
            <div 
              onClick={() => setIsPanelOpen(!isPanelOpen)}
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                cursor: 'pointer' 
              }}
            >
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>
                Platform Data Model
              </h1>
              {isPanelOpen ? <ChevronUp size={20} color="rgba(255,255,255,0.6)" /> : <ChevronDown size={20} color="rgba(255,255,255,0.6)" />}
            </div>

            {isPanelOpen && (
              <>
                <p style={{ margin: '8px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                  Interactive Knowledge Graph visualizing 27 tables across 10 domains with 38 cross-domain operational dependencies.
                </p>
                
                <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {Object.entries(DOMAIN_COLORS).map(([domain, color]) => (
                    <div key={domain} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
                      <div style={{ width: 12, height: 12, borderRadius: 3, background: color, boxShadow: `0 0 10px ${color}40`, border: `1px solid ${color}` }} />
                      {domain}
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
                    Anchor Nodes
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    <span style={{ fontSize: 11, background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', padding: '4px 10px', borderRadius: 20, border: '1px solid rgba(59, 130, 246, 0.3)' }}>Workers</span>
                    <span style={{ fontSize: 11, background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '4px 10px', borderRadius: 20, border: '1px solid rgba(16, 185, 129, 0.3)' }}>Sites</span>
                    <span style={{ fontSize: 11, background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '4px 10px', borderRadius: 20, border: '1px solid rgba(16, 185, 129, 0.3)' }}>Contracts</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
