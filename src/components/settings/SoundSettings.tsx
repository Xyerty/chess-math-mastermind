import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Volume, Volume1, Volume2, VolumeX } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import { useLanguage } from '../../contexts/LanguageContext';

const SoundSettings = () => {
  const { settings, setSettings } = useSettings();
  const { t } = useLanguage();

  const handleMasterVolumeChange = (value: number[]) => {
    setSettings(prev => ({ ...prev, sound: { ...prev.sound, masterVolume: value[0] } }));
  };

  const handleSfxVolumeChange = (value: number[]) => {
    setSettings(prev => ({ ...prev, sound: { ...prev.sound, sfxVolume: value[0] } }));
  };
  
  const handleMusicVolumeChange = (value: number[]) => {
    setSettings(prev => ({ ...prev, sound: { ...prev.sound, musicVolume: value[0] } }));
  };

  const toggleSfx = (checked: boolean) => {
    setSettings(prev => ({ ...prev, sound: { ...prev.sound, isSfxMuted: !checked } }));
  };

  const toggleMusic = (checked: boolean) => {
    setSettings(prev => ({ ...prev, sound: { ...prev.sound, isMusicMuted: !checked } }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="h-5 w-5" />
          {t('settings.soundPrefs')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>{t('settings.sound.masterVolume')}</Label>
          <div className="flex items-center gap-4">
            <VolumeX className="h-5 w-5 text-muted-foreground" />
            <Slider
              value={[settings.sound.masterVolume]}
              onValueChange={handleMasterVolumeChange}
              max={100}
              step={1}
            />
            <Volume2 className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>

        <div className="flex items-center justify-between">
            <Label htmlFor="sfx-toggle" className="flex items-center gap-2 cursor-pointer">
              <Volume1 className="h-5 w-5"/>
              <span>{t('settings.sound.sfx')}</span>
            </Label>
            <Switch id="sfx-toggle" checked={!settings.sound.isSfxMuted} onCheckedChange={toggleSfx} />
        </div>
         {!settings.sound.isSfxMuted && (
          <div className="space-y-2 pl-7">
              <Label className="text-sm text-muted-foreground">{t('settings.sound.sfxVolume')}</Label>
              <Slider
                value={[settings.sound.sfxVolume]}
                onValueChange={handleSfxVolumeChange}
                max={100}
                step={1}
                disabled={settings.sound.isSfxMuted}
              />
          </div>
        )}

        <div className="flex items-center justify-between">
            <Label htmlFor="music-toggle" className="flex items-center gap-2 cursor-pointer">
              <Volume className="h-5 w-5"/>
              <span>{t('settings.sound.bgm')}</span>
            </Label>
            <Switch id="music-toggle" checked={!settings.sound.isMusicMuted} onCheckedChange={toggleMusic} />
        </div>
        {!settings.sound.isMusicMuted && (
          <div className="space-y-2 pl-7">
              <Label className="text-sm text-muted-foreground">{t('settings.sound.bgmVolume')}</Label>
              <Slider
                value={[settings.sound.musicVolume]}
                onValueChange={handleMusicVolumeChange}
                max={100}
                step={1}
                disabled={settings.sound.isMusicMuted}
              />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SoundSettings;
