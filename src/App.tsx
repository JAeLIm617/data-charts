import { Card } from "@/components/ui/card";
import { type ChartConfig } from "@/components/ui/chart";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useConfigStore } from "@/database";
import SidebarComponent from "@/Sidebar";
import { useState } from "react";
import AreaContainer from "./components/chart/_Area";
import BarContainer from "./components/chart/_Bar";
import LineContainer from "./components/chart/_Line";
import { ThemeProvider } from "./theme-provider";

function App() {
  const {
    getLoad,
    getChartType,
    getChartConfig,
    getChartData,
    getXAxisKey,
    getTooltip,
    getLabel,
    getXHide,
    getYHide,
  } = useConfigStore();
  const [sideOpen, setSideOpen] = useState(true);

  if (getLoad()) {
    return (
      <main className="flex h-screen w-full items-center justify-center bg-gradient-to-br ">
        <Card className="w-64 rounded-xl shadow-lg transition-all duration-300 bg-accent">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative flex h-12 w-12 items-center justify-center">
              <div className="absolute h-12 w-12 rounded-full border-4 border-t-chart-1 border-accent animate-spin"></div>
              <div className="absolute h-8 w-8 rounded-full border-4 border-t-chart-2 border-accent animate-spin animation-delay-150"></div>
            </div>
            <div className="mt-4 text-center text-sm font-medium animate-pulse">
              Loading...
            </div>
          </div>
        </Card>
      </main>
    );
  }

  const chartType = getChartType();
  const xAxisKey = getXAxisKey();
  const chartConfig: ChartConfig = getChartConfig() || {};
  const chartData = getChartData();
  const tooltip = getTooltip();
  const label = getLabel();
  const xHide = getXHide();
  const yHide = getYHide();

  return (
    <ThemeProvider defaultTheme="dark">
      <SidebarProvider open={sideOpen} onOpenChange={setSideOpen} defaultOpen>
        <SidebarComponent />
        <main className="relative flex h-screen w-full items-end justify-center bg-background p-2">
          <SidebarTrigger className="absolute top-2 left-2" />
          <Card className="h-full container rounded-none" id="chart-container">
            {chartData.length > 0 ? (
              chartType === "bar" ? (
                <BarContainer
                  chartData={chartData}
                  chartConfig={chartConfig}
                  xAxisKey={xAxisKey}
                  tooltip={tooltip}
                  label={label}
                  xHide={xHide}
                  yHide={yHide}
                />
              ) : chartType === "area" ? (
                <AreaContainer
                  chartData={chartData}
                  chartConfig={chartConfig}
                  xAxisKey={xAxisKey}
                  tooltip={tooltip}
                  label={label}
                  xHide={xHide}
                  yHide={yHide}
                />
              ) : chartType === "line" ? (
                <LineContainer
                  chartData={chartData}
                  chartConfig={chartConfig}
                  xAxisKey={xAxisKey}
                  tooltip={tooltip}
                  label={label}
                  xHide={xHide}
                  yHide={yHide}
                />
              ) : null
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  데이터가 없습니다.
                </p>
              </div>
            )}
          </Card>
        </main>
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default App;
