/* eslint-disable @typescript-eslint/no-explicit-any */
import { storage } from "@/lib/storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ChartType = "bar" | "area" | "line";

type ChartConfig = Record<
  string,
  {
    label: string;
    color: string;
  }
>;

interface InitData {
  isLoad: boolean;
  chartType: ChartType;
  chartConfig: ChartConfig | null;
  chartData: Array<any>;
  xAxisKey?: string;
  tooltip: boolean;
  label: boolean;
}

interface InitState extends InitData {
  getLoad: () => boolean;
  setLoad: (load: boolean) => void;
  getChartType: () => ChartType;
  getChartConfig: () => ChartConfig | null;
  getChartData: () => Array<any>;
  getXAxisKey: () => string | undefined;
  getTooltip: () => boolean;
  getLabel: () => boolean;
  appendConfig: (config: ChartConfig) => void;
  appendData: (data: any) => void;
  removeConfig: (key: string) => void;
  removeData: (idx: number) => void;
  setXAxisKey: (key: string) => void;
  setChartData: (data: Array<any>) => void;
  setChartType: (type: ChartType) => void;
  setTooltip: (tooltip: boolean) => void;
  setLabel: (label: boolean) => void;
  resetData: () => void;
}

const initData: InitData = {
  isLoad: true,
  chartConfig: null,
  chartData: [],
  xAxisKey: "x-name",
  chartType: "bar",
  tooltip: true,
  label: true,
};

export const useConfigStore = create<InitState>()(
  persist(
    (set, get) => ({
      ...initData,
      getLoad: () => get().isLoad,
      setLoad: (load) => {
        set({ isLoad: load });
      },
      getChartType: () => get().chartType,
      getChartConfig: () => get().chartConfig,
      getChartData: () => get().chartData,
      getXAxisKey: () => get().xAxisKey,
      getTooltip: () => get().tooltip,
      getLabel: () => get().label,
      appendConfig: (config) => {
        set((state) => ({
          chartConfig: { ...state.chartConfig, ...config },
        }));
      },
      appendData: (data) => {
        const existingData = get().chartData;
        existingData.push(data);
        set({ chartData: existingData });
      },
      removeConfig: (key) => {
        set((state) => {
          const newConfig = { ...state.chartConfig };
          delete newConfig[key];
          return { chartConfig: newConfig };
        });
      },
      removeData: (idx) => {
        set((state) => ({
          chartData: state.chartData.filter((_, index) => index !== idx),
        }));
      },
      setXAxisKey: (key) => {
        set({ xAxisKey: key });
      },
      setChartData: (data) => {
        set({ chartData: data });
      },
      setChartType: (type: ChartType) => {
        set({ chartType: type });
      },
      setTooltip: (tooltip) => {
        set({ tooltip });
      },
      setLabel: (label) => {
        set({ label });
      },
      resetData: () => {
        set({
          chartConfig: null,
          chartData: [],
          xAxisKey: undefined,
        });
      },
    }),
    {
      name: "data-charts/config",
      storage: createJSONStorage(() => storage),
      onRehydrateStorage: () => (state, error) => {
        if (state && !error) {
          state.setLoad(false);
        }
      },
    },
  ),
);
