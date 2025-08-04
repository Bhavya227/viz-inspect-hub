// Global state management for real-time data synchronization
import { create } from 'zustand';

export interface Inspection {
  id: string;
  productName: string;
  batchNumber: string;
  inspector: string;
  status: "passed" | "failed" | "pending";
  score: number;
  date: string;
  time: string;
  issues: number;
  location: string;
  defects: Array<{
    type: string;
    category: "scratch" | "crack" | "contamination" | "color" | "imprint" | "other";
    severity: "low" | "medium" | "high";
    confidence: number;
  }>;
}

export interface QualityMetrics {
  overallScore: number;
  passRate: number;
  defectRate: number;
  criticalIssues: number;
  totalInspections: number;
  monthlyTrends: Array<{
    month: string;
    score: number;
    defects: number;
    passRate: number;
  }>;
  defectTypes: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

interface AppStore {
  inspections: Inspection[];
  qualityMetrics: QualityMetrics;
  lastUpdated: Date;
  
  // Actions
  addInspection: (inspection: Inspection) => void;
  updateInspection: (id: string, updates: Partial<Inspection>) => void;
  deleteInspection: (id: string) => void;
  recalculateMetrics: () => void;
}

// Initial quality metrics data
const initialMetrics: QualityMetrics = {
  overallScore: 92,
  passRate: 95.2,
  defectRate: 4.8,
  criticalIssues: 3,
  totalInspections: 0,
  monthlyTrends: [
    { month: "Jan", score: 85, defects: 12, passRate: 88 },
    { month: "Feb", score: 87, defects: 10, passRate: 90 },
    { month: "Mar", score: 89, defects: 8, passRate: 92 },
    { month: "Apr", score: 91, defects: 6, passRate: 94 },
    { month: "May", score: 88, defects: 9, passRate: 91 },
    { month: "Jun", score: 92, defects: 5, passRate: 95 }
  ],
  defectTypes: [
    { name: "Scratch", value: 35, color: "hsl(var(--chart-1))" },
    { name: "Crack", value: 25, color: "hsl(var(--chart-2))" },
    { name: "Contamination", value: 20, color: "hsl(var(--chart-3))" },
    { name: "Color", value: 15, color: "hsl(var(--chart-4))" },
    { name: "Other", value: 5, color: "hsl(var(--chart-5))" }
  ]
};

export const useAppStore = create<AppStore>((set, get) => ({
  inspections: [],
  qualityMetrics: initialMetrics,
  lastUpdated: new Date(),

  addInspection: (inspection) => {
    set((state) => {
      const newInspections = [...state.inspections, inspection];
      const store = get();
      
      // Recalculate metrics after adding inspection
      setTimeout(() => store.recalculateMetrics(), 0);
      
      return {
        inspections: newInspections,
        lastUpdated: new Date()
      };
    });
  },

  updateInspection: (id, updates) => {
    set((state) => {
      const newInspections = state.inspections.map(inspection =>
        inspection.id === id ? { ...inspection, ...updates } : inspection
      );
      
      const store = get();
      setTimeout(() => store.recalculateMetrics(), 0);
      
      return {
        inspections: newInspections,
        lastUpdated: new Date()
      };
    });
  },

  deleteInspection: (id) => {
    set((state) => {
      const newInspections = state.inspections.filter(inspection => inspection.id !== id);
      
      const store = get();
      setTimeout(() => store.recalculateMetrics(), 0);
      
      return {
        inspections: newInspections,
        lastUpdated: new Date()
      };
    });
  },

  recalculateMetrics: () => {
    const { inspections } = get();
    
    if (inspections.length === 0) {
      set({ qualityMetrics: { ...initialMetrics, totalInspections: 0 } });
      return;
    }

    // Calculate new metrics based on inspections
    const totalInspections = inspections.length;
    const passedInspections = inspections.filter(i => i.status === "passed").length;
    const failedInspections = inspections.filter(i => i.status === "failed").length;
    
    const passRate = totalInspections > 0 ? (passedInspections / totalInspections) * 100 : 0;
    const defectRate = totalInspections > 0 ? (failedInspections / totalInspections) * 100 : 0;
    
    const averageScore = totalInspections > 0 
      ? inspections.reduce((sum, i) => sum + i.score, 0) / totalInspections 
      : 0;
    
    // Count critical issues (high severity defects)
    const criticalIssues = inspections.reduce((count, inspection) => {
      return count + inspection.defects.filter(d => d.severity === "high").length;
    }, 0);

    // Calculate defect type distribution
    const defectCounts: { [key: string]: number } = {};
    inspections.forEach(inspection => {
      inspection.defects.forEach(defect => {
        defectCounts[defect.category] = (defectCounts[defect.category] || 0) + 1;
      });
    });

    const totalDefects = Object.values(defectCounts).reduce((sum, count) => sum + count, 0);
    const defectTypes = Object.entries(defectCounts).map(([name, count], index) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: totalDefects > 0 ? Math.round((count / totalDefects) * 100) : 0,
      color: `hsl(var(--chart-${(index % 5) + 1}))`
    }));

    // Update monthly trends with current month data
    const currentMonth = new Date().toLocaleDateString('en-US', { month: 'short' });
    const currentMonthData = {
      month: currentMonth,
      score: Math.round(averageScore),
      defects: failedInspections,
      passRate: Math.round(passRate)
    };

    const updatedTrends = [...initialMetrics.monthlyTrends];
    const existingMonthIndex = updatedTrends.findIndex(t => t.month === currentMonth);
    
    if (existingMonthIndex >= 0) {
      updatedTrends[existingMonthIndex] = currentMonthData;
    } else {
      updatedTrends.push(currentMonthData);
    }

    const newMetrics: QualityMetrics = {
      overallScore: Math.round(averageScore),
      passRate: Math.round(passRate * 100) / 100,
      defectRate: Math.round(defectRate * 100) / 100,
      criticalIssues,
      totalInspections,
      monthlyTrends: updatedTrends.slice(-6), // Keep last 6 months
      defectTypes: defectTypes.length > 0 ? defectTypes : initialMetrics.defectTypes
    };

    set({ 
      qualityMetrics: newMetrics,
      lastUpdated: new Date()
    });
  }
}));