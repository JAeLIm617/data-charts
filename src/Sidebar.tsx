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
import chartColors from "@/static";
import { useState } from "react";

function SidebarComponent() {
  const {
    getChartConfig,
    getChartData,
    getXAxisKey,
    appendConfig,
    removeConfig,
    appendData,
    removeData,
    setChartData,
    resetData,
  } = useConfigStore();
  const [popOpen, setPopOpen] = useState(false);
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
        const { [key]: _, ...rest } = item; // Remove the key from the item
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

  return (
    <Sidebar>
      <SidebarHeader>
        <Button variant="outline" onClick={() => resetData()}>
          Reset
        </Button>
        <Popover open={popOpen} onOpenChange={setPopOpen}>
          <PopoverTrigger asChild>
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
              type="text"
              maxLength={10}
            />
          </PopoverContent>
        </Popover>
      </SidebarHeader>
      <SidebarContent className="overflow-auto scrollbar-custom">
        <SidebarGroup className="space-y-1.5">
          {Object.entries(chartConfig).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between py-2 px-3 rounded-2xl bg-accent hover:bg-accent/80 transition-colors">
              <span>{value.label}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleConfigDelete(key)}
                className="btn">
                X
              </Button>
            </div>
          ))}
        </SidebarGroup>
        <SidebarGroup className="space-y-1.5">
          <h3 className="text-sm font-semibold">Chart Data</h3>
          <Button variant="secondary" onClick={() => handleDataAdd()}>
            Add Data
          </Button>
          {chartData.map((data, index) => (
            <div
              key={index}
              className="relative flex flex-col pt-6 pb-2 px-3 rounded-xl bg-accent hover:bg-accent/80 transition-colors gap-1">
              <button
                className="absolute top-1 right-2 text-xs text-red-500 hover:text-red-700"
                type="button"
                onClick={() => removeData(index)}>
                X
              </button>
              {Object.entries(data).map(([key, value]) => (
                <div
                  className="w-full flex items-center justify-between gap-2"
                  key={key}>
                  <span key={key} className="text-sm">
                    {key}
                  </span>
                  <Input
                    type={key === xAxisKey ? "text" : "number"} // xAxisKey일 때는 text, 그 외는 number
                    defaultValue={
                      key === xAxisKey ? (value as string) : (value as number)
                    }
                    onBlur={(e) => {
                      if (key === xAxisKey) {
                        handleChangeData(index, key, e.target.value.trim());
                      } else {
                        const numValue = e.target.value.trim();
                        // 숫자만 허용 (NaN 또는 빈 문자열 방지)
                        if (/^\d*\.?\d*$/.test(numValue)) {
                          handleChangeData(index, key, Number(numValue));
                        }
                      }
                    }}
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
