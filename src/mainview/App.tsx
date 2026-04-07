import { useState } from "react";
import { Button } from "@/components/ui/button";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-3xl px-4 py-10">
        <h1 className="mb-2 text-center font-bold text-5xl drop-shadow-lg">
          React + Tailwind + Vite
        </h1>
        <p className="mb-10 text-center text-xl">
          A fast Electrobun app with hot module replacement
        </p>

        <div className="mb-8 rounded-xl p-8 shadow-xl">
          <h2 className="mb-4 font-semibold text-2xl">Interactive Counter</h2>
          <p className="mb-4 text-muted-foreground">
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
      </div>
    </div>
  );
}

export default App;
