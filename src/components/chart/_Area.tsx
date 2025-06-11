import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import type { ChartContainerProps } from "./_Bar";

function AreaContainer({
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
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}>
        <defs>
          {Object.entries(chartConfig).map(([key, value]) => (
            <linearGradient key={key} id={key} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={value.color} stopOpacity={0.8} />
              <stop offset="95%" stopColor={value.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
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
          <Area
            type="linear"
            key={key}
            dataKey={key}
            fill={`url(#${key})`}
            stroke={value.color}
            fillOpacity={0.5}
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
          </Area>
        ))}
      </AreaChart>
    </ChartContainer>
  );
}

export default AreaContainer;
