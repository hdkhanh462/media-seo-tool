import { Button } from "@/components/ui/button";
import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen">
      <div className="container max-w-3xl px-4 py-10 mx-auto">
        <h1 className="mb-2 text-5xl font-bold text-center drop-shadow-lg">
          React + Tailwind + Vite
        </h1>
        <p className="mb-10 text-xl text-center">
          A fast Electrobun app with hot module replacement
        </p>

        <div className="p-8 mb-8 shadow-xl rounded-xl">
          <h2 className="mb-4 text-2xl font-semibold">Interactive Counter</h2>
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
