import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

export interface ChartContainerProps {
  chartData: any[];
  chartConfig: ChartConfig;
  xAxisKey?: string;
  tooltip: boolean;
  label: boolean;
  xHide: boolean;
  yHide: boolean;
}

function BarContainer({
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
      <BarChart accessibilityLayer data={chartData}>
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
