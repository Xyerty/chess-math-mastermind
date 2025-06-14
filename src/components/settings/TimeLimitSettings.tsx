
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Timer } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import { useLanguage } from '../../contexts/LanguageContext';

const TimeLimitSettings = () => {
    const { settings, setSettings } = useSettings();
    const { t } = useLanguage();

    const handleTimeChange = (difficulty: 'easy' | 'medium' | 'hard', value: number[]) => {
        setSettings(prev => ({
            ...prev,
            timeLimits: { ...prev.timeLimits, [difficulty]: value[0] }
        }));
    };

    const toggleUnlimitedTime = (checked: boolean) => {
        setSettings(prev => ({
            ...prev,
            timeLimits: { ...prev.timeLimits, unlimited: checked }
        }));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Timer className="h-5 w-5" />
                    {t('settings.timeLimits')}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                    <Label htmlFor="unlimited-time-toggle" className="flex flex-col gap-1 cursor-pointer">
                        <span>Unlimited Time</span>
                        <span className="font-normal text-sm text-muted-foreground">
                            Disable timer for math challenges.
                        </span>
                    </Label>
                    <Switch 
                        id="unlimited-time-toggle"
                        checked={settings.timeLimits.unlimited}
                        onCheckedChange={toggleUnlimitedTime}
                    />
                </div>
                {!settings.timeLimits.unlimited && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Easy ({settings.timeLimits.easy}s)</Label>
                            <Slider
                                value={[settings.timeLimits.easy]}
                                onValueChange={(val) => handleTimeChange('easy', val)}
                                min={10}
                                max={120}
                                step={5}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Medium ({settings.timeLimits.medium}s)</Label>
                            <Slider
                                value={[settings.timeLimits.medium]}
                                onValueChange={(val) => handleTimeChange('medium', val)}
                                min={10}
                                max={120}
                                step={5}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Hard ({settings.timeLimits.hard}s)</Label>
                            <Slider
                                value={[settings.timeLimits.hard]}
                                onValueChange={(val) => handleTimeChange('hard', val)}
                                min={10}
                                max={120}
                                step={5}
                            />
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default TimeLimitSettings;
