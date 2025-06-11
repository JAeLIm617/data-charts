import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import type { ChartContainerProps } from "./_Bar";

function LineContainer({
  chartData,
  chartConfig,
  xAxisKey,
  tooltip,
  label,
  xHide,
  yHide,
}: ChartContainerProps) {
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
        <XAxis
          hide={xHide}
          dataKey={xAxisKey}
          tickLine={false}
          axisLine={true}
          tick={{ fontSize: "10px" }}
        />
        <YAxis
          hide={yHide}
          tickCount={10}
          tickLine={false}
          axisLine={true}
          tick={{ fontSize: "10px" }}
          domain={[0, "dataMax + 10"]}
        />
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
