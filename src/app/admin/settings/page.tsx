export default function AdminSettingsPage() {
  return (
    <>
      <h1 className="font-display text-4xl">Admin Settings</h1>
      <p className="mt-2 text-sm text-[#77727f]">
        Platform configuration for the VIVA web console.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <article className="rounded-[1.4rem] border border-[#26222f]/8 bg-[#fdfbf4] p-5 shadow-[0_14px_32px_rgba(64,49,38,.07)]">
          <p className="text-[11px] font-black tracking-[0.16em] text-[#5f45e6]">PROJECT</p>
          <p className="font-display mt-3 text-2xl tracking-tight">gcqbuccazplfpmuhperg</p>
          <p className="mt-1 text-xs text-[#8a8491]">Supabase project reference</p>
        </article>
        <article className="rounded-[1.4rem] border border-[#26222f]/8 bg-[#fdfbf4] p-5 shadow-[0_14px_32px_rgba(64,49,38,.07)]">
          <p className="text-[11px] font-black tracking-[0.16em] text-[#5f45e6]">REGION</p>
          <p className="font-display mt-3 text-2xl tracking-tight">ap-southeast-2</p>
          <p className="mt-1 text-xs text-[#8a8491]">Sydney (closest to PH/SG)</p>
        </article>
      </div>
    </>
  );
}
