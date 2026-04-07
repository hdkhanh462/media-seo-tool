import { Button } from "@/components/ui/button";
import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen text-gray-900 bg-linear-to-br from-indigo-500 to-purple-600">
      <div className="container max-w-3xl px-4 py-10 mx-auto">
        <h1 className="mb-2 text-5xl font-bold text-center text-white drop-shadow-lg">
          React + Tailwind + Vite
        </h1>
        <p className="mb-10 text-xl text-center text-white/90">
          A fast Electrobun app with hot module replacement
        </p>

        <div className="p-8 mb-8 bg-white shadow-xl rounded-xl">
          <h2 className="mb-4 text-2xl font-semibold text-indigo-600">
            Interactive Counter
          </h2>
          <p className="mb-4 text-gray-600">
            Click the button below to test React state. With HMR enabled, you
            can edit this component and see changes instantly without losing
            state.
          </p>
          <div className="flex items-center gap-4">
            <Button onClick={() => setCount((c) => c + 1)}>
              Count: {count}
            </Button>
            <Button onClick={() => setCount(0)}>Reset</Button>
          </div>
        </div>

        <div className="p-8 mb-8 bg-white shadow-xl rounded-xl">
          <h2 className="mb-4 text-2xl font-semibold text-indigo-600">
            Getting Started
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="font-bold text-indigo-500">1.</span>
              <span>
                Run{" "}
                <code className="px-2 py-1 text-sm bg-gray-100 rounded">
                  bun run dev
                </code>{" "}
                for development without HMR
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-indigo-500">2.</span>
              <span>
                Run{" "}
                <code className="px-2 py-1 text-sm bg-gray-100 rounded">
                  bun run dev:hmr
                </code>{" "}
                for development with hot reload
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-indigo-500">3.</span>
              <span>
                Run{" "}
                <code className="px-2 py-1 text-sm bg-gray-100 rounded">
                  bun run build
                </code>{" "}
                to build for production
              </span>
            </li>
          </ul>
        </div>

        <div className="p-8 bg-white shadow-xl rounded-xl">
          <h2 className="mb-4 text-2xl font-semibold text-indigo-600">Stack</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="p-4 text-center rounded-lg bg-gray-50">
              <div className="mb-2 text-3xl">⚡</div>
              <div className="font-medium">Electrobun</div>
            </div>
            <div className="p-4 text-center rounded-lg bg-gray-50">
              <div className="mb-2 text-3xl">⚛️</div>
              <div className="font-medium">React</div>
            </div>
            <div className="p-4 text-center rounded-lg bg-gray-50">
              <div className="mb-2 text-3xl">🎨</div>
              <div className="font-medium">Tailwind</div>
            </div>
            <div className="p-4 text-center rounded-lg bg-gray-50">
              <div className="mb-2 text-3xl">🔥</div>
              <div className="font-medium">Vite HMR</div>
            </div>
          </div>
        </div>

        <div className="p-6 mt-10 text-center rounded-lg text-white/80 bg-white/10 backdrop-blur">
          <p>
            Edit{" "}
            <code className="px-2 py-1 text-sm rounded bg-white/20">
              src/mainview/App.tsx
            </code>{" "}
            and save to see HMR in action
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
