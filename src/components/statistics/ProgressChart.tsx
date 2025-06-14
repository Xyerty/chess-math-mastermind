
import React from 'react';
import { Line, LineChart, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { useLanguage } from '@/contexts/LanguageContext';
import { TrendingUp } from 'lucide-react';

interface ProgressData {
  game: number;
  accuracy: number;
  time: number;
}

interface ProgressChartProps {
  data: ProgressData[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ data }) => {
  const { t } = useLanguage();
  const chartConfig = {
    accuracy: {
      label: t('stats.mathAccuracy'),
      color: 'hsl(var(--chart-1))',
    },
    time: {
      label: t('stats.avgSolveTime'),
      color: 'hsl(var(--chart-2))',
    },
  } satisfies ChartConfig;

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {t('stats.progressOverTime')}
        </CardTitle>
        <CardDescription>{t('stats.accuracyAndSpeed')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="game" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `G${value}`} />
            <YAxis yAxisId="left" orientation="left" unit="%" domain={[0, 100]} />
            <YAxis yAxisId="right" orientation="right" unit="s" />
            <Tooltip content={<ChartTooltipContent />} />
            <Line yAxisId="left" type="monotone" dataKey="accuracy" stroke="var(--color-accuracy)" strokeWidth={2} dot={false} />
            <Line yAxisId="right" type="monotone" dataKey="time" stroke="var(--color-time)" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ProgressChart;
