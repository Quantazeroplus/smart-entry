document.addEventListener("contextmenu", (event) => event.preventDefault());

document.onkeydown = function (e) {
 
  if (e.keyCode == 123) {
    return false;
  }

  if (e.ctrlKey && e.shiftKey && e.keyCode == "I".charCodeAt(0)) {
    return false;
  }

  if (e.ctrlKey && e.shiftKey && e.keyCode == "J".charCodeAt(0)) {
    return false;
  }

  if (e.ctrlKey && e.keyCode == "U".charCodeAt(0)) {
    return false;
  }

  if (e.ctrlKey && e.shiftKey && e.keyCode == "C".charCodeAt(0)) {
    return false;
  }
};

const SCRIPT_URL = "__SCRIPT_URL__";
const QR_COORDS = { lat: __QR_LAT__, lng: __QR_LON__ };
const MAX_DIST = __MAX_DIST__;

const ENTRY_OPTIONS = ["Lecture", "Library","Hostel", "Office", "Other"];
const EXIT_OPTIONS = ["Chowk", "Bettiah", "Home", "Other"];

//  DEVICE ID ---
function getDeviceId() {
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 200;
    canvas.height = 50;
    ctx.textBaseline = "top";
    ctx.font = "14px 'Arial'";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = "#069";
    ctx.fillText("GECWC-SECURE-ID", 2, 15);
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx.fillText("GECWC-SECURE-ID", 4, 17);

    const fingerprint = canvas.toDataURL();
    const specs = [
      screen.width + "x" + screen.height,
      navigator.hardwareConcurrency,
      navigator.platform,
      screen.colorDepth,
    ].join("|");

    let hash = 0;
    const finalStr = fingerprint + specs;
    for (let i = 0; i < finalStr.length; i++) {
      hash = (hash << 5) - hash + finalStr.charCodeAt(i);
      hash |= 0;
    }
    return "HW-V3-" + Math.abs(hash).toString(16).toUpperCase();
  } catch (e) {
    return "FALLBACK-" + screen.width + "-" + navigator.hardwareConcurrency;
  }
}

// --- LOOKUP TRIGGER ---
document.getElementById("roll").addEventListener("blur", async (e) => {
  if (!e.target.value) return;
  const mode = document.getElementById("actionInput").value;
  document.getElementById("status-pill").innerText = "Checking...";

  try {
    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "lookup",
        roll: e.target.value,
        deviceId: getDeviceId(),
      }),
    });
    const data = await res.json();
    document.getElementById("fullScreenLoader").classList.add("hidden");
    if (data.userData && data.userData.found) {
      document.getElementById("name").value = data.userData.name;
      document.getElementById("branch").value = data.userData.branch;
      document.getElementById("mobile").value = data.userData.mobile;
      document.getElementById("address").value = data.userData.address;

      if (data.userData.roomNo)
        document.getElementById("roomNo").value = data.userData.roomNo;
      if (data.userData.gender) {
        const genderRadio = document.querySelector(
          `input[name="gender"][value="${data.userData.gender}"]`,
        );
        if (genderRadio) genderRadio.checked = true;
      }

      // Trigger floating label fixes
      document.querySelectorAll(".input-field").forEach((input) => {
        if (input.value) input.dispatchEvent(new Event("input"));
      });

      const quickBox = document.getElementById("quickEntryBox");
      const quickTitle = document.getElementById("quickTitle");

      if (mode === "Entry" && data.userData.canQuickEntry) {
        quickBox.classList.remove("hidden");
        quickTitle.innerText = "Quick Re-Entry Available";
      } else if (mode === "Exit" && data.userData.canQuickExit) {
        quickBox.classList.remove("hidden");
        quickTitle.innerText = "Quick Exit Available";
      } else {
        quickBox.classList.add("hidden");
      }
    }
  } catch (err) {
    console.error("Lookup failed", err);
  }
  document.getElementById("status-pill").innerText = "GPS Active";
});

function toggleQuickEntry(checkbox) {
  const prefill = document.getElementById("prefill-area");
  const submitBtn = document.getElementById("submitBtn");

  if (checkbox.checked) {
    prefill.style.opacity = "0.3";
    prefill.style.pointerEvents = "none";
    submitBtn.innerHTML = `<span class="relative z-10">Fast-Track Authorization</span> <i class="fas fa-bolt relative z-10"></i>`;

    submitBtn.className =
      "w-full mt-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 rounded-2xl font-black text-[15px] hover:from-emerald-400 hover:to-teal-500 transition-all duration-300 shadow-[0_8px_20px_-6px_rgba(16,185,129,0.5)] active:scale-[0.98] flex items-center justify-center gap-3 group border border-white/10 relative overflow-hidden";
  } else {
    prefill.style.opacity = "1";
    prefill.style.pointerEvents = "all";
    submitBtn.innerHTML = `<span class="relative z-10">Authorize Action</span> <i class="fas fa-arrow-right relative z-10 group-hover:translate-x-1.5 transition-transform duration-300"></i>`;
    submitBtn.className =
      "w-full mt-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-4 rounded-2xl font-black text-[15px] hover:from-indigo-500 hover:to-blue-500 transition-all duration-300 shadow-[0_8px_20px_-6px_rgba(79,70,229,0.5)] active:scale-[0.98] flex items-center justify-center gap-3 group border border-white/10 relative overflow-hidden";
  }
}

// --- SUBMISSION ---
document.getElementById("entryForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const isQuick = document.getElementById("quickEntryCheck").checked;
  const btn = document.getElementById("submitBtn");

  btn.disabled = true;
  btn.innerHTML = `<span>Authorizing...</span>`;
  document.getElementById("fullScreenLoader").classList.remove("hidden");

  // Request GPS Location
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      let finalPurpose = document.getElementById("purpose").value;
      const otherBox = document.getElementById("otherBox");
      if (!otherBox.classList.contains("hidden")) {
        finalPurpose = document.getElementById("otherPurpose").value;
        if (finalPurpose.trim() === "") finalPurpose = "Not Specified";
      }

      // Build Payload

      const selectedGender = document.querySelector(
        'input[name="gender"]:checked',
      );

      const payload = {
        action: "submit",
        actionInput: document.getElementById("actionInput").value,
        roll: document.getElementById("roll").value,
        name: document.getElementById("name").value,
        gender: selectedGender ? selectedGender.value : "Not Specified",
        branch: document.getElementById("branch").value,
        roomNo: document.getElementById("roomNo").value,
        deviceId: getDeviceId(),
        mobile: document.getElementById("mobile").value,
        address: document.getElementById("address").value,
        purposeMain: document.getElementById("purpose").value,
        purposeOther: document.getElementById("otherPurpose").value,
        isQuickEntry: isQuick,
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
      };

      try {
        const res = await fetch(SCRIPT_URL, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        const result = await res.json();

        document.getElementById("fullScreenLoader").classList.add("hidden");

        if (result.success) {
          const studentName = document
            .getElementById("name")
            .value.split(" ")[0];
          const mode = document.getElementById("actionInput").value;
          const timeStr = new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });
          const dateStr = new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
          saveToHistory(payload);
          if ("vibrate" in navigator) navigator.vibrate([100, 30, 100]);
          speakSuccess(studentName, mode);

          applyModalStyle(mode);

          document.getElementById("successGreeting").innerText =
            "Thank You, " + studentName + "!";
          document.getElementById("successSubtext").innerText =
            "Your information is marked. Have a safe " +
            (mode === "Entry" ? "stay" : "trip") +
            "!";
          document.getElementById("displayTime").innerText = timeStr;
          document.getElementById("displayDate").innerText = dateStr;

          const modalBtn = document.getElementById("modalCloseBtn");
          modalBtn.innerText = "DONE";
          modalBtn.setAttribute("onclick", "closeModal()");

          const modal = document.getElementById("successModal");
          const card = document.getElementById("modalCard");
          modal.classList.remove("hidden");
          setTimeout(() => {
            card.classList.remove("scale-90", "opacity-0");
            card.classList.add("scale-100", "opacity-100");
          }, 50);
        } else {
          document.getElementById("fullScreenLoader").classList.add("hidden");
          showAlert("Action Denied", result.error);
          btn.disabled = false;
          btn.innerHTML = `<span>Authorize Action</span> <i class="fas fa-arrow-right"></i>`;
        }
      } catch (err) {
        document.getElementById("fullScreenLoader").classList.add("hidden");
        showAlert(
          "Connection Error",
          "Could not connect to the server. Please check your internet and try again.",
        );
        btn.disabled = false;
        btn.innerHTML = `<span>Authorize Action</span> <i class="fas fa-arrow-right"></i>`;
      }
    },
    (err) => {
      document.getElementById("fullScreenLoader").classList.add("hidden");
      showAlert(
        "GPS Required",
        "Could not verify your location. Please ensure location services are enabled.",
      );
      btn.disabled = false;
      btn.innerHTML = `<span>Authorize Action</span> <i class="fas fa-arrow-right"></i>`;
    },
    { enableHighAccuracy: true },
  );
});

function speakSuccess(name, mode) {
  if ("speechSynthesis" in window) {
    const hour = new Date().getHours();
    const greeting =
      hour < 12
        ? "Good Morning"
        : hour < 17
          ? "Good Afternoon"
          : "Good Evening";

    const textToSpeak =
      greeting + " " + name + ". Your " + mode + " has been marked. Thank you!";

    const message = new SpeechSynthesisUtterance(textToSpeak);
    message.volume = 1;
    message.rate = 0.95;
    message.pitch = 1.1;

    const voices = window.speechSynthesis.getVoices();
    message.voice = voices.find((v) => v.name.includes("Female")) || voices[0];
    window.speechSynthesis.speak(message);
  }
}

function toggleOther(select) {
  const box = document.getElementById("otherBox");
  box.classList.toggle("hidden", select.value !== "Other");
  document.getElementById("otherPurpose").required = select.value === "Other";
}

function updatePurposeOptions(mode) {
  const select = document.getElementById("purpose");
  const label = document.getElementById("purposeLabel");
  const options = mode === "Entry" ? ENTRY_OPTIONS : EXIT_OPTIONS;
  label.innerText = mode === "Entry" ? "Purpose of Visit" : "Destination";

  select.innerHTML = options
    .map(
      (opt) =>
        `<option value="${opt}">${opt === "Other" ? "Other (Write below)" : opt}</option>`,
    )
    .join("");
}

function setMode(mode) {
  document.getElementById("actionInput").value = mode;
  const isEntry = mode === "Entry";

  const entryActiveClass =
    "flex-1 py-3 rounded-xl font-black text-sm tracking-wide bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-[0_4px_15px_rgba(16,185,129,0.4)] transition-all duration-300 flex items-center justify-center gap-2";

  const exitActiveClass =
    "flex-1 py-3 rounded-xl font-black text-sm tracking-wide bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-[0_4px_15px_rgba(244,63,94,0.4)] transition-all duration-300 flex items-center justify-center gap-2";

  const inactiveClass =
    "flex-1 py-3 rounded-xl font-bold text-sm tracking-wide text-slate-500 dark:text-slate-400 hover:bg-slate-300/50 dark:hover:bg-white/5 transition-all duration-300 flex items-center justify-center gap-2";

  document.getElementById("btnEntry").className = isEntry
    ? entryActiveClass
    : inactiveClass;
  document.getElementById("btnExit").className = !isEntry
    ? exitActiveClass
    : inactiveClass;

  document.getElementById("btnEntry").innerHTML =
    `<i class="fas fa-sign-in-alt text-lg ${isEntry ? "" : "opacity-70"}"></i><span>ENTRY</span>`;
  document.getElementById("btnExit").innerHTML =
    `<i class="fas fa-sign-out-alt text-lg ${!isEntry ? "" : "opacity-70"}"></i><span>EXIT</span>`;

  // ... Keep your address checking logic below this ...

  const addrField = document.getElementById("address");
  if (
    addrField.value === "" ||
    addrField.value === "Home" ||
    addrField.value === "Hostel"
  ) {
    addrField.value = isEntry ? "Home" : "Hostel";
    addrField.dispatchEvent(new Event("input"));
  }

  updatePurposeOptions(mode);

  document.getElementById("quickEntryBox").classList.add("hidden");
  const quickCheck = document.getElementById("quickEntryCheck");
  if (quickCheck) {
    quickCheck.checked = false;
    toggleQuickEntry(quickCheck);
  }

  const rollInput = document.getElementById("roll");
  if (rollInput.value) rollInput.dispatchEvent(new Event("blur"));
}

// --- MAP & GPS ---
const map = L.map("map", {
  zoomControl: false,
  attributionControl: false,
}).setView([QR_COORDS.lat, QR_COORDS.lng], 18);
L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
).addTo(map);
L.circle([QR_COORDS.lat, QR_COORDS.lng], {
  color: "#10b981",
  radius: MAX_DIST,
  weight: 1,
  fillOpacity: 0.1,
}).addTo(map);

let userMarker;
let isInZone = false;
navigator.geolocation.watchPosition(
  (pos) => {
    const statusPill = document.getElementById("status-pill");
    statusPill.innerText = "GPS Active";
    statusPill.classList.remove(
      "text-slate-500",
      "text-indigo-600",
      "bg-indigo-100",
      "dark:bg-indigo-900/30",
      "animate-pulse",
    );
    statusPill.classList.add(
      "text-gateGreen",
      "bg-green-100",
      "dark:bg-green-900/20",
    );

    const lat = pos.coords.latitude,
      lon = pos.coords.longitude;
    window.userPos = pos.coords;

    if (!userMarker) {
      userMarker = L.circleMarker([lat, lon], {
        radius: 8,
        color: "#4f46e5",
        fillColor: "#4f46e5",
        fillOpacity: 1,
      }).addTo(map);
    } else {
      userMarker.setLatLng([lat, lon]);
    }

    const dist = calculateDistance(lat, lon, QR_COORDS.lat, QR_COORDS.lng);
    document.getElementById("liveDist").innerHTML =
      `${Math.round(dist)}<span class="text-lg font-normal text-slate-500 ml-1">m</span>`;
    document.getElementById("distBar").style.width =
      `${Math.max(0, 100 - dist * 4)}%`;

    const isAllowed = dist <= MAX_DIST;
    if (dist <= MAX_DIST && !isInZone) {
      isInZone = true; // Mark as inside
      if ("vibrate" in navigator) navigator.vibrate([200, 100, 200]); // Vibrate ONCE
    } else if (dist > MAX_DIST + 5) {
      // Only reset if they walk at least 5 meters AWAY from the boundary (30m total)
      // This prevents GPS jitter from triggering multiple vibrations!
      isInZone = false;
    }
    document.getElementById("lockMessage").style.display = isAllowed
      ? "none"
      : "block";
    document.getElementById("entryForm").classList.toggle("hidden", !isAllowed);
  },
  (err) => {
    const statusPill = document.getElementById("status-pill");
    statusPill.innerText = "GPS Error";
    statusPill.classList.add(
      "text-gateRed",
      "bg-red-100",
      "dark:bg-red-900/20",
    );
  },
  { enableHighAccuracy: true },
);

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toggleDarkMode() {
  const html = document.documentElement;
  const themeIcon = document.getElementById("theme-icon");
  if (html.classList.contains("dark")) {
    html.classList.remove("dark");
    themeIcon.className = "fas fa-moon text-slate-600";
    localStorage.setItem("theme", "light");
  } else {
    html.classList.add("dark");
    themeIcon.className = "fas fa-sun text-yellow-400";
    localStorage.setItem("theme", "dark");
  }
}

// --- DYNAMIC CARD COLORS ---

function applyModalStyle(mode) {
  const isEntry = mode === "Entry";

  const card = document.getElementById("modalCard");
  const badge = document.getElementById("modalModeBadge");
  const glow = document.getElementById("modalGlow");
  const iconBox = document.getElementById("modalIconBox");
  const ping = document.getElementById("modalPing");
  const timeLine = document.getElementById("modalTimeLine");
  const displayTime = document.getElementById("displayTime");
  const closeBtn = document.getElementById("modalCloseBtn");

  const baseCard =
    "bg-white dark:bg-darkCard w-full max-w-[340px] rounded-[2rem] p-6 relative z-10 transform scale-90 opacity-0 transition-all duration-500 ease-out overflow-hidden";

  if (isEntry) {
    card.className =
      baseCard +
      " shadow-[0_15px_40px_-10px_rgba(16,185,129,0.3)] border border-emerald-300/30";
    badge.className =
      "px-4 py-1 rounded-full font-black text-[10px] tracking-widest uppercase shadow-sm border border-emerald-200 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50";
    badge.innerHTML = '<i class="fas fa-sign-in-alt mr-1"></i> ENTRY APPROVED';
    glow.className =
      "absolute -top-16 -left-16 w-48 h-48 bg-emerald-500/20 blur-[3rem] rounded-full pointer-events-none";
    iconBox.className =
      "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_8px_15px_rgba(16,185,129,0.3)] border-[3px] border-white dark:border-darkCard relative z-10 bg-gradient-to-tr from-emerald-400 to-teal-500";
    ping.className =
      "absolute inset-0 rounded-full border-[3px] border-emerald-400 animate-ping opacity-40";
    timeLine.className =
      "absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500";
    displayTime.className =
      "text-3xl sm:text-4xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-400 tracking-tight drop-shadow-sm py-1";
    closeBtn.className =
      "w-full py-3.5 rounded-xl font-black text-sm hover:scale-[1.02] transition-all active:scale-95 shadow-md tracking-wide uppercase text-white bg-gradient-to-r from-emerald-500 to-teal-600";
  } else {
    card.className =
      baseCard +
      " shadow-[0_15px_40px_-10px_rgba(244,63,94,0.3)] border border-rose-300/30";
    badge.className =
      "px-4 py-1 rounded-full font-black text-[10px] tracking-widest uppercase shadow-sm border border-rose-200 bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50";
    badge.innerHTML = '<i class="fas fa-sign-out-alt mr-1"></i> EXIT APPROVED';
    glow.className =
      "absolute -top-16 -left-16 w-48 h-48 bg-rose-500/20 blur-[3rem] rounded-full pointer-events-none";
    iconBox.className =
      "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_8px_15px_rgba(244,63,94,0.3)] border-[3px] border-white dark:border-darkCard relative z-10 bg-gradient-to-tr from-rose-400 to-red-500";
    ping.className =
      "absolute inset-0 rounded-full border-[3px] border-rose-400 animate-ping opacity-40";
    timeLine.className =
      "absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-400 to-red-500";
    displayTime.className =
      "text-3xl sm:text-4xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-red-600 dark:from-rose-400 dark:to-red-400 tracking-tight drop-shadow-sm py-1";
    closeBtn.className =
      "w-full py-3.5 rounded-xl font-black text-sm hover:scale-[1.02] transition-all active:scale-95 shadow-md tracking-wide uppercase text-white bg-gradient-to-r from-rose-500 to-red-600";
  }
}

function closeModal() {
  const modal = document.getElementById("successModal");
  const card = document.getElementById("modalCard");
  card.classList.remove("scale-100", "opacity-100");
  card.classList.add("scale-90", "opacity-0");
  setTimeout(() => {
    modal.classList.add("hidden");
    location.reload();
  }, 400);
}

function closeHistoryModal() {
  const modal = document.getElementById("successModal");
  const card = document.getElementById("modalCard");
  card.classList.remove("scale-100", "opacity-100");
  card.classList.add("scale-90", "opacity-0");
  setTimeout(() => {
    modal.classList.add("hidden");
  }, 400);
}

// --- 1. SAVE TO HISTORY ---
function saveToHistory(data) {
  let history = JSON.parse(localStorage.getItem("campus_history") || "[]");
  const now = new Date();
  const record = {
    id: Date.now(),
    name: data.name,
    mode: data.actionInput,
    time: now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    date: now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    timestamp: now.getTime(),
  };
  history.unshift(record);
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  history = history.filter((item) => item.timestamp > oneDayAgo);
  localStorage.setItem("campus_history", JSON.stringify(history));
  renderHistory();
}

// --- 2. RENDER HISTORY PILLS ---

function renderHistory() {
  const historyList = document.getElementById("historyList");
  const section = document.getElementById("historySection");
  const history = JSON.parse(localStorage.getItem("campus_history") || "[]");

  if (history.length === 0) {
    section.classList.add("hidden");
    return;
  }

  section.classList.remove("hidden");
  historyList.innerHTML = history
    .map((item) => {
      const isEntry = item.mode === "Entry";

      // Dynamic Holographic Colors
      const borderGlow = isEntry
        ? "from-emerald-400 via-emerald-200 to-teal-500 dark:from-emerald-500/50 dark:to-teal-500/50"
        : "from-rose-400 via-rose-200 to-red-500 dark:from-rose-500/50 dark:to-red-500/50";
      const iconGradient = isEntry
        ? "from-emerald-400 to-emerald-600 shadow-[0_8px_20px_rgba(16,185,129,0.4)]"
        : "from-rose-400 to-rose-600 shadow-[0_8px_20px_rgba(244,63,94,0.4)]";
      const iconClass = isEntry
        ? "fa-arrow-right-to-bracket"
        : "fa-arrow-right-from-bracket";
      const timeGradient = isEntry
        ? "from-emerald-600 to-teal-500 dark:from-emerald-300 dark:to-teal-500"
        : "from-rose-600 to-red-500 dark:from-rose-300 dark:to-red-500";
      const pillColors = isEntry
        ? "bg-emerald-100 dark:bg-emerald-900/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400"
        : "bg-rose-100 dark:bg-rose-900/40 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400";
      const dotColor = isEntry ? "bg-emerald-500" : "bg-rose-500";

      return `
            <div onclick="reShowSuccess('${item.name.replace(/'/g, "\\'")}', '${item.mode}', '${item.time}', '${item.date || "Today"}')" 
                 class="relative group cursor-pointer rounded-[1.5rem] p-[2px] shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden">
                
                <div class="absolute inset-0 bg-gradient-to-br ${borderGlow} opacity-30 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div class="relative flex items-center justify-between p-4 bg-white/90 dark:bg-[#111827]/95 backdrop-blur-2xl rounded-[1.4rem] h-full w-full border border-white/50 dark:border-white/5">
                    
                    <div class="absolute -right-10 -top-10 w-32 h-32 ${isEntry ? "bg-emerald-500/10" : "bg-rose-500/10"} blur-[2rem] rounded-full group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>

                    <div class="flex items-center gap-4 relative z-10">
                        
                        <div class="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${iconGradient} text-white border border-white/30 transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-500 flex-shrink-0">
                            <i class="fas ${iconClass} text-lg drop-shadow-md"></i>
                        </div>
                        
                        <div class="flex flex-col justify-center">
                            <span class="font-black text-slate-800 dark:text-white text-[15px] tracking-tight mb-1 truncate max-w-[120px] sm:max-w-[150px]">${item.name}</span>
                            
                            <div class="flex items-center gap-1.5 w-max px-2 py-0.5 rounded-md border ${pillColors}">
                                <div class="relative flex h-1.5 w-1.5">
                                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full ${dotColor} opacity-75"></span>
                                  <span class="relative inline-flex rounded-full h-1.5 w-1.5 ${dotColor}"></span>
                                </div>
                                <span class="text-[9px] font-black uppercase tracking-[0.15em] leading-none mt-px">${item.mode}</span>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col items-end relative z-10">
                        <span class="text-[9px] font-black text-slate-400 dark:text-slate-500 tracking-[0.2em] uppercase mb-0.5">${item.date || "TODAY"}</span>
                        <span class="text-xl sm:text-2xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-b ${timeGradient} drop-shadow-sm group-hover:scale-110 transition-transform duration-500 origin-right tracking-tighter">${item.time}</span>
                    </div>
                </div>
            </div>
            `;
    })
    .join("");
}

//  CLEAR HISTORY LOGIC ---
function clearHistory() {
  const modal = document.getElementById("confirmModal");
  const card = document.getElementById("confirmCard");
  modal.classList.remove("hidden");
  setTimeout(() => {
    card.classList.remove("scale-90", "opacity-0");
    card.classList.add("scale-100", "opacity-100");
  }, 10);
}

function closeConfirmModal() {
  const modal = document.getElementById("confirmModal");
  const card = document.getElementById("confirmCard");
  card.classList.remove("scale-100", "opacity-100");
  card.classList.add("scale-90", "opacity-0");
  setTimeout(() => {
    modal.classList.add("hidden");
  }, 300);
}

function executeClearHistory() {
  localStorage.removeItem("campus_history");
  renderHistory();
  closeConfirmModal();
}

// --- CUSTOM ALERT
function showAlert(title, message) {
  document.getElementById("alertTitle").innerText = title;
  document.getElementById("alertMessage").innerText = message;

  const modal = document.getElementById("alertModal");
  const card = document.getElementById("alertCard");
  modal.classList.remove("hidden");
  setTimeout(() => {
    card.classList.remove("scale-90", "opacity-0");
    card.classList.add("scale-100", "opacity-100");
  }, 10);
}

function closeAlertModal() {
  const modal = document.getElementById("alertModal");
  const card = document.getElementById("alertCard");
  card.classList.remove("scale-100", "opacity-100");
  card.classList.add("scale-90", "opacity-0");
  setTimeout(() => {
    modal.classList.add("hidden");
  }, 300);
}

// --- 3. RE-SHOW SUCCESS MODAL ---

function reShowSuccess(name, mode, time, date) {
  // Added 'date' here!
  applyModalStyle(mode);

  document.getElementById("successGreeting").innerText = "Record: " + name;
  document.getElementById("successSubtext").innerText =
    "This " + mode + " was marked in your local history.";
  document.getElementById("displayTime").innerText = time;
  // Uses the passed date, or defaults to "Today" if it's an old record
  document.getElementById("displayDate").innerText = date || "Today";

  const modalBtn = document.getElementById("modalCloseBtn");
  modalBtn.innerText = "CLOSE HISTORY";
  modalBtn.setAttribute("onclick", "closeHistoryModal()");

  const modal = document.getElementById("successModal");
  const card = document.getElementById("modalCard");
  modal.classList.remove("hidden");
  setTimeout(() => {
    card.classList.remove("scale-90", "opacity-0");
    card.classList.add("scale-100", "opacity-100");
  }, 50);
}

// Initialize on Load
window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark");
    document.getElementById("theme-icon").className =
      "fas fa-sun text-yellow-400";
  }
  updatePurposeOptions("Entry");
  renderHistory();
});

// --- PWA SERVICE WORKER REGISTRATION ---
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .then((reg) => console.log("Service Worker Registered!", reg))
      .catch((err) => console.error("Service Worker Failed!", err));
  });
}
