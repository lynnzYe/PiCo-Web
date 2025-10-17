import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

interface SettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Settings({ open, onOpenChange }: SettingsProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="sound">Sound Effects</Label>
            <Switch id="sound" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-play">Auto Play</Label>
            <Switch id="auto-play" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
