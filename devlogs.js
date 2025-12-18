const SUPABASE_URL = "https://mgsypisiuvtwpfppkvfo.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nc3lwaXNpdXZ0d3BmcHBrdmZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MzI5NzUsImV4cCI6MjA4MTMwODk3NX0.bPVWn7Fjro9PtD7Ge2geCxiSIFT9JxwcWG9RRGdRXeU";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function fetchDevlogs() {
  const { data, error } = await supabaseClient
    .from("devlogs")
    .select("*")
    .order("date", { ascending: true })
    .order("entry_index", { ascending: true });

  if (error) {
    console.log("error:", error);
    return;
  }

  renderDevlogs(data);
}

function renderDevlogs(logs) {
  const container = document.getElementById("devlogs");
  container.innerHTML = "";

  const grouped = {};
  for (let i = 0; i < logs.length; i++) {
    const log = logs[i];
    if (!grouped[log.date]) {
      grouped[log.date] = [];
    }
    grouped[log.date].push(log);
  }

  const dates = Object.keys(grouped).sort();
  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];
    const section = document.createElement("section");
    section.className = "devlog-day";

    const header = document.createElement("h3");
    header.textContent = formatDate(date);
    section.appendChild(header);

    const entries = grouped[date];
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];

      const entryDiv = document.createElement("div");
      entryDiv.className = "devlog-entry";

      const indexSpan = document.createElement("span");
      indexSpan.className = "devlog-index";
      let indexStr = String(entry.entry_index);
      if (indexStr.length === 1) {
        indexStr = "0" + indexStr;
      }
      indexSpan.textContent = "." + indexStr + " >";

      const contentP = document.createElement("p");
      contentP.className = "devlog-content";
      contentP.textContent = entry.content;

      entryDiv.appendChild(indexSpan);
      entryDiv.appendChild(contentP);
      section.appendChild(entryDiv);
    }

    container.appendChild(section);
  }
}

function formatDate(dateStr) {
  const parts = dateStr.split("-");
  const year = parts[0];
  const month = parts[1];
  const day = parts[2];
  return year.slice(2) + "-" + month + "-" + day;
}

fetchDevlogs();
