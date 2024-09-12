export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
      <p className="text-xl">Bienvenido al Switcher</p>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/IngSof1-BoarByte-Devs/swicher-front"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/docs"
          target="_blank"
          rel="noopener noreferrer"
        >
          Nextjs Docs
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://react.dev/reference/react"
          target="_blank"
          rel="noopener noreferrer"
        >
          React Docs
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://famaf.zulipchat.com/#narrow/stream/455683-IngSoft1--BoardByte-Devs"
          target="_blank"
          rel="noopener noreferrer"
        >
          Zulip
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://ingenieria2024famaf.atlassian.net/jira/software/projects/SCRUM/boards/1"
          target="_blank"
          rel="noopener noreferrer"
        >
          Jira
        </a>
      </footer>
    </div>
  );
}
