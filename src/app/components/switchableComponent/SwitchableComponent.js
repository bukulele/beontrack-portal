import { Switch } from "@/components/ui/switch";

function SwitchableComponent({ checked, onCheckedChange, disabled }) {
  return (
    <Switch
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
    />
  );
}

export default SwitchableComponent;
