import { Card } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useConfigStore } from "@/database";
import SidebarComponent from "@/Sidebar";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

function App() {
  const { getLoad, getChartConfig, getChartData, getXAxisKey } =
    useConfigStore();
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
  const xAxisKey = getXAxisKey();
  const chartConfig: ChartConfig = getChartConfig() || {};
  const chartData = getChartData();

  return (
    <SidebarProvider open={sideOpen} onOpenChange={setSideOpen} defaultOpen>
      <SidebarComponent />
      <main className="relative flex h-screen w-full items-center justify-center bg-background">
        <SidebarTrigger className="absolute top-2 left-2" />
        <Card className="h-[90vh] w-full container p-2">
          {chartData.length > 0 ? (
            <ChartContainer
              key={chartData.length}
              config={chartConfig}
              className="h-full w-full">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                {xAxisKey && (
                  <XAxis
                    dataKey={xAxisKey}
                    tickLine={true}
                    tickMargin={2}
                    axisLine={true}
                    tick={{ fill: "#5e5e5e", fontSize: "12px" }}
                  />
                )}
                {Object.entries(chartConfig).map(([key, value]) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={value.color}
                    radius={4}
                    isAnimationActive={true}>
                    <LabelList
                      dataKey={key}
                      position="top"
                      style={{ fill: "#5e5e5e", fontSize: "12px" }}
                    />
                  </Bar>
                ))}
              </BarChart>
            </ChartContainer>
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
