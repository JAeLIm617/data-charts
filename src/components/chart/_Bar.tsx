import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useConfigStore } from "@/database";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

export interface ChartContainerProps {
  chartData: any[];
  chartConfig: ChartConfig;
  xAxisKey?: string;
}

function BarContainer({
  chartData,
  chartConfig,
  xAxisKey,
}: ChartContainerProps) {
  const { getTooltip, getLabel } = useConfigStore();
  const tooltip = getTooltip();
  const label = getLabel();
  return (
    <ChartContainer
      key={chartData.length}
      config={chartConfig}
      className="h-full w-full bg-card">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        {tooltip && <ChartTooltip content={<ChartTooltipContent />} />}
        <ChartLegend content={<ChartLegendContent />} />
        {xAxisKey && (
          <XAxis
            dataKey={xAxisKey}
            tickLine={false}
            axisLine={false}
            tickMargin={5}
            minTickGap={12}
            tick={{ fontSize: "10px" }}
          />
        )}
        {Object.entries(chartConfig).map(([key, value]) => (
          <Bar
            key={key}
            dataKey={key}
            fill={value.color}
            stroke={value.color}
            radius={6}
            isAnimationActive={true}>
            {label && (
              <LabelList
                dataKey={key}
                position="top"
                offset={-15}
                style={{
                  fontSize: "10px",
                  fill: "var(--foreground)",
                  fontWeight: "bold",
                }}
              />
            )}
          </Bar>
        ))}
      </BarChart>
    </ChartContainer>
  );
}

export default BarContainer;
