import { useState } from "react";
import { ExtractTab } from "@/components/ExtractTab";
import { InjectTab } from "@/components/InjectTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function App() {
  const [activeTab, setActiveTab] = useState("inject");

  return (
    <div className="min-h-screen">
      <div className="container mx-auto md:px-4">
        <Tabs
          defaultValue="overview"
          className="w-full"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList>
            <TabsTrigger value="inject">Inject</TabsTrigger>
            <TabsTrigger value="extract">Extract</TabsTrigger>
          </TabsList>

          <TabsContent value="inject">
            <InjectTab />
          </TabsContent>
          <TabsContent value="extract">
            <ExtractTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default App;
