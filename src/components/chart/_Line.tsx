import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useConfigStore } from "@/database";
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";
import type { ChartContainerProps } from "./_Bar";

function LineContainer({
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
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}>
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
          <Line
            type="linear"
            key={key}
            dataKey={key}
            fill={value.color}
            stroke={value.color}
            dot={false}
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
          </Line>
        ))}
      </LineChart>
    </ChartContainer>
  );
}

export default LineContainer;
