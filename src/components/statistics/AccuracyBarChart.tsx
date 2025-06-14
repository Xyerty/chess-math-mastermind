
import React from 'react';
import { Bar, BarChart, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { useLanguage } from '@/contexts/LanguageContext';
import { Target } from 'lucide-react';

interface AccuracyData {
  difficulty: string;
  accuracy: number;
}

interface AccuracyBarChartProps {
  data: AccuracyData[];
}

const AccuracyBarChart: React.FC<AccuracyBarChartProps> = ({ data }) => {
  const { t } = useLanguage();
  const chartConfig = {
    accuracy: {
      label: t('stats.mathAccuracy'),
      color: 'hsl(var(--chart-1))',
    },
  } satisfies ChartConfig;

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          {t('stats.mathAccuracy')} - {t('stats.byDifficulty')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <XAxis dataKey="difficulty" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
            <YAxis unit="%" tickLine={false} axisLine={false} tickMargin={8} domain={[0, 100]} />
            <Tooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="accuracy" fill="var(--color-accuracy)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default AccuracyBarChart;
