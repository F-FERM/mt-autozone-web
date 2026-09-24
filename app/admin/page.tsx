export default function AdminPage() {
  return (
    <main className="min-h-[calc(100vh-96px)] bg-slate-50 px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
              Welcome to the admin panel
            </p>
            <h1 className="mt-4 text-4xl font-semibold text-slate-950">
              Manage your site content with confidence.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Use the sidebar to access the Home Hero slide manager and future
              admin sections. This shell is designed for enterprise-style
              content workflows.
            </p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-lg font-semibold text-slate-950">
              Quick actions
            </h2>
            <div className="mt-4 space-y-3">
              <div className="rounded-3xl bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">
                  Home Hero Slides
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Create, edit, or remove hero slider records.
                </p>
              </div>
              <div className="rounded-3xl bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">
                  Site content
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Future modules for services, blogs, and contact sections.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
