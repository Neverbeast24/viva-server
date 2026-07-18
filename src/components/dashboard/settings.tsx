"use client";

import { saveSettings } from "@/app/dashboard/settings/actions";
import {
  FormField,
  PageHeader,
  Panel,
  PrimaryButton,
  fieldClass,
} from "@/components/dashboard/ui";
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
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Appearance">
            <select name="theme" defaultValue={settings.theme} className={`mt-2 ${fieldClass}`}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
            </FormField>
            <FormField label="Timezone" hint="IANA name">
            <input
              name="timezone"
              defaultValue={settings.timezone}
              className={`mt-2 ${fieldClass}`}
            />
            </FormField>
          </div>
          <label className="flex items-center justify-between gap-3 rounded-2xl border border-[#26222f]/7 bg-white/40 px-4 py-3 text-sm font-bold">
            <span>
              <span className="block">Push notifications</span>
              <span className="mt-0.5 block text-xs font-normal text-[#918b96]">
                Receive reminders and new VIVA insights
              </span>
            </span>
            <input
              type="checkbox"
              name="notifications_enabled"
              defaultChecked={settings.notifications_enabled}
              className="size-5 accent-[#5f45e6]"
            />
          </label>
          <label className="flex items-center justify-between gap-3 rounded-2xl border border-[#26222f]/7 bg-white/40 px-4 py-3 text-sm font-bold">
            <span>
              <span className="block">Weekly report</span>
              <span className="mt-0.5 block text-xs font-normal text-[#918b96]">
                Email a summary of your wellbeing trends
              </span>
            </span>
            <input
              type="checkbox"
              name="weekly_report_enabled"
              defaultChecked={settings.weekly_report_enabled}
              className="size-5 accent-[#5f45e6]"
            />
          </label>
          <PrimaryButton disabled={pending}>{pending ? "Saving…" : "Save settings"}</PrimaryButton>
        </form>
      </Panel>
    </>
  );
}
