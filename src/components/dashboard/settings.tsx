"use client";

import { saveSettings } from "@/app/dashboard/settings/actions";
import { PageHeader, Panel, PrimaryButton, fieldClass } from "@/components/dashboard/ui";
import { useModuleAction } from "@/components/dashboard/use-module-action";

type Settings = {
  theme: string;
  notifications_enabled: boolean;
  weekly_report_enabled: boolean;
  timezone: string;
};

export function SettingsView({ settings }: { settings: Settings }) {
  const { pending, submit } = useModuleAction(saveSettings);

  return (
    <>
      <PageHeader eyebrow="SETTINGS" title="Make VIVA" highlight="yours." />
      <Panel title="Preferences">
        <form action={submit} className="space-y-5">
          <label className="block text-sm font-bold">
            Theme
            <select name="theme" defaultValue={settings.theme} className={`mt-2 ${fieldClass}`}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </label>
          <label className="block text-sm font-bold">
            Timezone
            <input
              name="timezone"
              defaultValue={settings.timezone}
              className={`mt-2 ${fieldClass}`}
            />
          </label>
          <label className="flex items-center gap-3 text-sm font-bold">
            <input
              type="checkbox"
              name="notifications_enabled"
              defaultChecked={settings.notifications_enabled}
              className="size-4 accent-[#5f45e6]"
            />
            Enable notifications
          </label>
          <label className="flex items-center gap-3 text-sm font-bold">
            <input
              type="checkbox"
              name="weekly_report_enabled"
              defaultChecked={settings.weekly_report_enabled}
              className="size-4 accent-[#5f45e6]"
            />
            Weekly report emails
          </label>
          <PrimaryButton disabled={pending}>{pending ? "Saving…" : "Save settings"}</PrimaryButton>
        </form>
      </Panel>
    </>
  );
}
