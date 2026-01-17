import { useState } from "react";
import { LoadDump } from "services/LoadDump/LoadDump";
import { StreamPlayer } from "services/StreamPlayer/StreamPlayer";
import type { StreamEvent } from "shared/types/global";

function App() {
  const [events, setEvents] = useState<StreamEvent[]>([]);

  return (
    <>
      <LoadDump onLoadEvents={setEvents} />
      <StreamPlayer events={events} />
    </>
  );
}

export default App;
