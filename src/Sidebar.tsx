import { Button } from "@/components/ui/button";
import type { ChartConfig } from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useConfigStore } from "@/database";
import chartColors from "@/static-colors";
import html2canvas from "html2canvas-pro";
import {
  AlignStartVerticalIcon,
  AlignVerticalJustifyEndIcon,
  CrosshairIcon,
  MoonIcon,
  MoveVerticalIcon,
  RotateCcwIcon,
  SunIcon,
  TagIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { Collapsible, CollapsibleContent } from "./components/ui/collapsible";
import { Toggle } from "./components/ui/toggle";
import { useTheme } from "./theme-provider";

function SidebarComponent() {
  const { theme, setTheme } = useTheme();
  const {
    setChartType,
    setTooltip,
    setLabel,
    setXHide,
    setYHide,
    getChartConfig,
    getChartData,
    getXAxisKey,
    appendConfig,
    removeConfig,
    appendData,
    removeData,
    setChartData,
    resetData,
    getTooltip,
    getLabel,
    getXHide,
    getYHide,
  } = useConfigStore();
  const [popOpen, setPopOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const xAxisKey = getXAxisKey();
  const chartConfig: ChartConfig = getChartConfig() || {};
  const chartData = getChartData();

  const handleSubmit = () => {
    if (!inputValue.trim()) {
      alert("데이터를 입력해주세요.");
      return;
    }
    const chartConfigLength = Object.keys(chartConfig).length;
    const dataKey = inputValue.trim();
    const label = inputValue.trim();

    const colorIndex =
      chartConfigLength < 20
        ? chartConfigLength * 10
        : ((chartConfigLength - 20) * 10 + 1) % chartColors.length;
    const selectedColor = chartColors[colorIndex];

    const newData = {
      [dataKey]: {
        label,
        color: selectedColor,
      },
    };
    if (Object.values(chartConfig).some((item) => item.label === label)) {
      alert("이미 존재하는 데이터입니다.");
    } else {
      appendConfig(newData);
      if (chartData.length > 0) {
        const _newData = chartData.map((item) => ({
          ...item,
          [dataKey]: Math.floor(Math.random() * 100),
        }));
        setChartData(_newData);
      }
      setInputValue("");
    }
  };

  const handleConfigDelete = (key: string) => {
    removeConfig(key);
    if (chartData.length > 0) {
      const updatedData = chartData.map((item) => {
        const { [key]: _, ...rest } = item;
        return rest;
      });
      setChartData(updatedData);
    }
  };

  const handleDataAdd = () => {
    if (Object.keys(chartConfig).length < 1) {
      alert("셋팅값을 1개 이상 추가해주세요.");
      return;
    }
    const newData = {
      [xAxisKey || "x-axis"]: "",
      ...Object.keys(chartConfig).reduce<Record<string, number>>((acc, key) => {
        acc[key] = Math.floor(Math.random() * 100);
        return acc;
      }, {}),
    };
    appendData(newData);
  };

  const handleChangeData = (
    index: number,
    key: string,
    value: string | number,
  ) => {
    const updatedData = [...chartData];
    updatedData[index] = {
      ...updatedData[index],
      [key]: value,
    };
    debounce(() => {
      setChartData(updatedData);
    }, 100)();
  };

  const debounce = <T extends (...args: any[]) => void>(
    func: T,
    delay: number,
  ) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const captureElement = async (elementId: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;
    const canvas = await html2canvas(element);

    // 이미지 다운로드
    const link = document.createElement("a");
    link.download = "chart-image.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  const tooltip = getTooltip();
  const label = getLabel();
  const xHide = getXHide();
  const yHide = getYHide();

  const settings = [
    {
      label: "Tooltip",
      value: tooltip,
      setValue: setTooltip,
      icon: <CrosshairIcon />,
    },
    { label: "Label", value: label, setValue: setLabel, icon: <TagIcon /> },
    {
      label: "X Axis",
      value: xHide,
      setValue: setXHide,
      reverse: true,
      icon: <AlignVerticalJustifyEndIcon />,
    },
    {
      label: "Y Axis",
      value: yHide,
      setValue: setYHide,
      reverse: true,
      icon: <AlignStartVerticalIcon />,
    },
  ];

  console.log(chartConfig);

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between gap-2">
          <Toggle
            className="flex-1/5"
            variant="outline"
            aria-label="Theme"
            size="sm"
            asChild
            data-state={theme === "dark" ? "on" : "off"}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <button className="h-full w-full cursor-pointer text-sm py-1 px-2">
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>
          </Toggle>
          <Button
            className="flex-1/5"
            variant="outline"
            onClick={() => resetData()}>
            <RotateCcwIcon />
          </Button>
          <Button
            className="flex-3/5"
            variant="outline"
            onClick={() => captureElement("chart-container")}>
            이미지 저장
          </Button>
        </div>
        <div className="flex items-center justify-between gap-2">
          <Button
            className="flex-1 bg-chart-1 hover:bg-chart-1/80 transition-colors font-bold"
            variant="default"
            size="sm"
            onClick={() => setChartType("bar")}>
            Bar
          </Button>
          <Button
            className="flex-1 bg-chart-2 hover:bg-chart-2/80 transition-colors font-bold"
            variant="default"
            size="sm"
            onClick={() => setChartType("area")}>
            Area
          </Button>
          <Button
            className="flex-1 bg-chart-3 hover:bg-chart-3/80 transition-colors font-bold"
            variant="default"
            size="sm"
            onClick={() => setChartType("line")}>
            Line
          </Button>
        </div>
        <div className="flex items-center justify-between gap-2">
          {settings.map((setting) => (
            <Toggle
              className="flex-1"
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
              <button className="cursor-pointer text-sm">{setting.icon}</button>
            </Toggle>
          ))}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="space-y-1.5 flex flex-row gap-2 pb-0">
          <Popover open={popOpen} onOpenChange={setPopOpen}>
            <PopoverTrigger className="flex-1" asChild>
              <Button onClick={() => setPopOpen(true)} variant="outline">
                셋팅값 추가
              </Button>
            </PopoverTrigger>
            <PopoverContent align="center" className="w-[15rem] p-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                placeholder="Enter data"
                enterKeyHint="enter"
                type="text"
                maxLength={10}
              />
            </PopoverContent>
          </Popover>
          <Button variant="outline" onClick={() => setConfigOpen(!configOpen)}>
            <MoveVerticalIcon className="w-5 h-5 " />
          </Button>
        </SidebarGroup>
        <SidebarGroup className="pt-0">
          <Collapsible
            open={configOpen}
            onOpenChange={setConfigOpen}
            className="space-y-1.5">
            <CollapsibleContent className="space-y-1.5">
              {Object.entries(chartConfig).map(([key, value]) => {
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between py-2 px-3 rounded-xl"
                    style={{ backgroundColor: value.color }}>
                    <span>{value.label}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleConfigDelete(key)}>
                      <XIcon className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
        <SidebarGroup className="space-y-1.5">
          <h3 className="text-sm font-semibold">
            Chart Data {chartData.length}
          </h3>
          <Button variant="outline" onClick={() => handleDataAdd()}>
            데이터 추가
          </Button>
        </SidebarGroup>
        <SidebarGroup className="space-y-1.5 overflow-auto scrollbar-custom">
          {chartData.map((data, index) => (
            <div
              key={index}
              className="relative flex flex-col pt-6 pb-2 px-3 rounded-xl bg-accent hover:bg-accent/80 transition-colors gap-1">
              <Button
                className="p-0 absolute top-1 right-1 text-xs text-destructive hover:text-destructive/80 h-4 w-4"
                size="sm"
                variant="ghost"
                onClick={() => removeData(index)}>
                <XIcon className="w-2 h-2" />
              </Button>
              {Object.entries(data).map(([key, value]) => (
                <div
                  className="w-full flex items-center justify-between gap-2"
                  key={key}>
                  <span key={key} className="text-sm">
                    {key}
                  </span>
                  <Input
                    type={key === xAxisKey ? "text" : "number"}
                    defaultValue={
                      key === xAxisKey ? (value as string) : (value as number)
                    }
                    onBlur={(e) => {
                      if (key === xAxisKey) {
                        handleChangeData(index, key, e.target.value.trim());
                      } else {
                        const numValue = e.target.value.trim();
                        if (/^\d*\.?\d*$/.test(numValue)) {
                          handleChangeData(index, key, Number(numValue));
                        }
                      }
                    }}
                    enterKeyHint="next"
                    className="w-30 no-spinner"
                  />
                </div>
              ))}
            </div>
          ))}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}

export default SidebarComponent;
