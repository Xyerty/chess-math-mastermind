
import React from 'react';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { useLanguage } from '@/contexts/LanguageContext';
import { Trophy } from 'lucide-react';

interface WinLossData {
  result: string;
  value: number;
  fill: string;
}

interface WinLossPieChartProps {
  data: WinLossData[];
}

const WinLossPieChart: React.FC<WinLossPieChartProps> = ({ data }) => {
  const { t } = useLanguage();
  const chartConfig = {
    wins: { label: t('stats.wins'), color: "hsl(var(--chart-1))" },
    losses: { label: t('stats.losses'), color: "hsl(var(--chart-2))" },
    draws: { label: t('stats.draws'), color: "hsl(var(--chart-3))" },
  };

  return (
    <Card className="flex flex-col h-full animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            {t('stats.winLoss')}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={data} dataKey="value" nameKey="result" innerRadius={60}>
              {data.map((entry) => (
                <Cell key={`cell-${entry.result}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="result" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default WinLossPieChart;
