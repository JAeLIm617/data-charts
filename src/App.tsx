import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { type ChartConfig } from "@/components/ui/chart";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useConfigStore } from "@/database";
import SidebarComponent from "@/Sidebar";
import { useState } from "react";
import AreaContainer from "./components/chart/_Area";
import BarContainer from "./components/chart/_Bar";
import LineContainer from "./components/chart/_Line";
import { Toggle } from "./components/ui/toggle";

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
    setChartType,
    setTooltip,
    setLabel,
    setXHide,
    setYHide,
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

  const settings = [
    { label: "Tooltip", value: tooltip, setValue: setTooltip },
    { label: "Label", value: label, setValue: setLabel },
    { label: "X Axis", value: xHide, setValue: setXHide, reverse: true },
    { label: "Y Axis", value: yHide, setValue: setYHide, reverse: true },
  ];

  return (
    <SidebarProvider open={sideOpen} onOpenChange={setSideOpen} defaultOpen>
      <SidebarComponent />
      <main className="relative flex h-screen w-full items-end justify-center bg-background pb-2">
        <SidebarTrigger className="absolute top-2 left-2" />
        <div className="absolute top-2 left-16 flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setChartType("bar")}>
            Bar
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setChartType("area")}>
            Area
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setChartType("line")}>
            Line
          </Button>
        </div>
        <div className="absolute top-2 right-2 flex gap-2">
          {settings.map((setting) => (
            <Toggle
              variant="outline"
              aria-label={setting.label}
              size="sm"
              asChild
              data-state={
                setting.reverse
                  ? !setting.value
                    ? "on"
                    : "off"
                  : setting.value
                  ? "on"
                  : "off"
              }
              onClick={() => setting.setValue(!setting.value)}
              key={setting.label}>
              <button className="h-full w-full cursor-pointer text-sm py-1 px-2">
                {setting.label}
              </button>
            </Toggle>
          ))}
        </div>
        <Card className="h-[90vh] container rounded-none" id="chart-container">
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
  );
}

export default App;
