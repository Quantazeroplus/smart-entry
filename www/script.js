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

let base64ImageString = "";

// Handle Student/Guest Toggle
function toggleRole(role) {
  const currentRole = document.getElementById("userRole").value;
  const glider = document.getElementById("roleGlider");

  if (currentRole !== role) {
    if (role === "Guest") {
      glider.style.transform = "translateX(100%)";
    } else {
      glider.style.transform = "translateX(0%)";
    }

    document.getElementById("roll").value = "";
    document.getElementById("name").value = "";
    document.getElementById("mobile").value = "";
    document.getElementById("vehicleNo").value = "";
    document.getElementById("otherPurpose").value = "";
    if (document.getElementById("imageUpload"))
      document.getElementById("imageUpload").value = "";
    base64ImageString = "";
    document.getElementById("branch").value = "";
    document.getElementById("roomNo").value = "";
    document.getElementById("purpose").value = "";
    if (document.getElementById("genderInput1"))
      document.getElementById("genderInput1").checked = false;
    if (document.getElementById("genderInput2"))
      document.getElementById("genderInput2").checked = false;
    document.getElementById("otherBox").classList.add("hidden");
    document.getElementById("quickEntryBox").classList.add("hidden");
    const quickCheck = document.getElementById("quickEntryCheck");
    if (quickCheck) {
      quickCheck.checked = false;
      toggleQuickEntry(quickCheck);
    }

    document.querySelectorAll(".input-field").forEach((input) => {
      input.dispatchEvent(new Event("input"));
      input.dispatchEvent(new Event("blur"));
    });
  }

  document.getElementById("userRole").value = role;
  updateVisibility();
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

  updateVisibility();

  // ONLY AUTO-FILL ADDRESS IF IT IS A STUDENT ENTRY/EXIT
  const isGuest = document.getElementById("userRole").value === "Guest";
  const addrField = document.getElementById("address");
  if (
    !isGuest &&
    (addrField.value === "" ||
      addrField.value === "Home" ||
      addrField.value === "Hostel")
  ) {
    addrField.value = isEntry ? "Home" : "Hostel";
    addrField.dispatchEvent(new Event("input"));
  }

  document.getElementById("quickEntryBox").classList.add("hidden");
  if (document.getElementById("quickEntryCheck")) {
    document.getElementById("quickEntryCheck").checked = false;
    toggleQuickEntry(document.getElementById("quickEntryCheck"));
  }

  const rollInput = document.getElementById("roll");
  if (rollInput.value) rollInput.dispatchEvent(new Event("blur"));
}

function updateVisibility() {
  const isGuest = document.getElementById("userRole").value === "Guest";
  const isExit = document.getElementById("actionInput").value === "Exit";
  const hideForGuestExit = isGuest && isExit;

  const isGuestNow = document.getElementById("userRole").value === "Guest";
  document.getElementById("tabStudent").className = isGuestNow
    ? "relative flex-1 py-2.5 z-10 text-sm font-bold text-slate-500 transition-all duration-300 flex items-center justify-center gap-2"
    : "relative flex-1 py-2.5 z-10 text-sm font-bold text-indigo-600 dark:text-indigo-400 transition-all duration-300 flex items-center justify-center gap-2";

  document.getElementById("tabGuest").className = isGuestNow
    ? "relative flex-1 py-2.5 z-10 text-sm font-bold text-indigo-600 dark:text-indigo-400 transition-all duration-300 flex items-center justify-center gap-2"
    : "relative flex-1 py-2.5 z-10 text-sm font-bold text-slate-500 transition-all duration-300 flex items-center justify-center gap-2";

  const rollInput = document.getElementById("roll");
  document.querySelector('label[for="roll"]').innerHTML = isGuest
    ? '<i class="fas fa-id-card mr-2 opacity-70"></i>ID / Mobile No'
    : '<i class="fas fa-id-card mr-2 opacity-70"></i>Roll Number';

  if (isGuest) {
    rollInput.pattern = "[0-9]{10}";
    rollInput.maxLength = 10;
    rollInput.title =
      "A valid 10-digit mobile number is required as a Guest ID.";
    rollInput.setAttribute(
      "oninput",
      "this.value = this.value.replace(/[^0-9]/g, '')",
    );
  } else {
    rollInput.removeAttribute("pattern");
    rollInput.removeAttribute("title");
    rollInput.removeAttribute("maxLength");
    rollInput.removeAttribute("oninput");
  }

  document.getElementById("genderInput1").value = isGuest ? "Male" : "Boy";
  document.getElementById("genderLabel1").innerHTML = isGuest
    ? "👨 Male"
    : "👦 Boy";
  document.getElementById("genderInput2").value = isGuest ? "Female" : "Girl";
  document.getElementById("genderLabel2").innerHTML = isGuest
    ? "👩 Female"
    : "👧 Girl";

  const addrField = document.getElementById("address");
  const addrLabel = document.querySelector('label[for="address"]');
  if (isGuest) {
    addrField.value = "";
    addrField.placeholder = "Vill., Post.";
    addrLabel.classList.add("force-float");
  } else {
    addrField.placeholder = " "; // Remove placeholder for students
    addrLabel.classList.remove("force-float");

    if (
      addrField.value === "" ||
      addrField.value === "Home" ||
      addrField.value === "Hostel"
    ) {
      addrField.value = !isExit ? "Home" : "Hostel";
    }
  }
  addrField.dispatchEvent(new Event("input"));

  // 4. Hide/Show Core Sections
  document.getElementById("genderGroup").style.display = hideForGuestExit
    ? "none"
    : "flex";
  document.getElementById("addressGroup").style.display = hideForGuestExit
    ? "none"
    : "block";
  document.getElementById("purposeGroup").style.display = hideForGuestExit
    ? "none"
    : "block";

  // Guest Vehicles are only for Entry!
  document
    .getElementById("guestFields")
    .classList.toggle("hidden", hideForGuestExit || !isGuest);

  const roomInputVal = document.getElementById("roomNo").value || "";
  const isDayScholar = roomInputVal.trim().toUpperCase() === "DAY SCHOLAR";

  // Branch/Mobile are ALWAYS hidden for Guests
  document.getElementById("branch").parentElement.style.display = isGuest
    ? "none"
    : "block";
  document.getElementById("mobileGroup").style.display = isGuest
    ? "none"
    : "block";

  const roomNoGroup =
    document.getElementById("roomNoGroup") ||
    document.getElementById("roomNo").parentElement;
  if (isGuest || isDayScholar) {
    roomNoGroup.style.display = "none";
  } else {
    roomNoGroup.style.display = "block";
  }

  // 5. Update Requirements
  document.getElementById("branch").required = !isGuest;
  document.getElementById("mobile").required = !isGuest;
  document.getElementById("roomNo").required = !(isGuest || isDayScholar);
  document.getElementById("genderInput1").required = !hideForGuestExit;
  document.getElementById("genderInput2").required = !hideForGuestExit;
  document.getElementById("address").required = !hideForGuestExit;
  document.getElementById("purpose").required = !hideForGuestExit;
  const select = document.getElementById("purpose");
  const label = document.getElementById("purposeLabel");
  label.innerText = !isExit ? "Purpose of Visit" : "Destination";
  const options = !isExit ? ENTRY_OPTIONS : EXIT_OPTIONS;

  const defaultOption = isGuest
    ? '<option value="" disabled selected>Select Purpose</option>'
    : "";

  select.innerHTML =
    defaultOption +
    options
      .map(
        (opt) =>
          `<option value="${opt}">${opt === "Other" ? "Other (Write below)" : opt}</option>`,
      )
      .join("");

  document.getElementById("otherBox").classList.add("hidden");
  document.getElementById("otherPurpose").required = false;
  document.getElementById("otherPurpose").value = "";
}

function toggleVehicle(hasVehicle) {
  const vehicleInputs = document.getElementById("vehicleInputs");
  const vehicleNo = document.getElementById("vehicleNo");
  if (hasVehicle) {
    vehicleInputs.classList.remove("hidden");
    vehicleInputs.classList.add("flex");
    vehicleNo.required = true;
  } else {
    vehicleInputs.classList.add("hidden");
    vehicleInputs.classList.remove("flex");
    vehicleNo.required = false;
    vehicleNo.value = "";
    document.getElementById("imageUpload").value = "";
    base64ImageString = "";
  }
}

function toggleOther(select) {
  const box = document.getElementById("otherBox");
  box.classList.toggle("hidden", select.value !== "Other");
  document.getElementById("otherPurpose").required = select.value === "Other";
}

// Handle Vehicle Yes/No Toggle
function toggleVehicle(hasVehicle) {
  const vehicleInputs = document.getElementById("vehicleInputs");
  const vehicleNo = document.getElementById("vehicleNo");

  if (hasVehicle) {
    vehicleInputs.classList.remove("hidden");
    vehicleInputs.classList.add("flex");
    vehicleNo.required = true; // Force them to enter the number if they click Yes
  } else {
    vehicleInputs.classList.add("hidden");
    vehicleInputs.classList.remove("flex");
    vehicleNo.required = false;
    vehicleNo.value = "";
    document.getElementById("imageUpload").value = "";
    base64ImageString = "";
  }
}

// Compress Image using Canvas
document
  .getElementById("imageUpload")
  ?.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
      const img = new Image();
      img.src = e.target.result;
      img.onload = function () {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800; // Compress image to 800px wide
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        base64ImageString = canvas.toDataURL("image/jpeg", 0.7);
      };
    };
  });

const SCRIPT_URL = ENV.SCRIPT_URL;
const QR_COORDS = { lat: ENV.QR_LAT, lng: ENV.QR_LON };
const MAX_DIST = ENV.MAX_DIST;

const ENTRY_OPTIONS = ["Lecture", "Hostel", "Office", "Other"];
const EXIT_OPTIONS = ["Chowk", "Bettiah", "Home", "Other"];


let secureDeviceHash = "";


window.addEventListener("DOMContentLoaded", () => {
  if (window.FingerprintJS) {
    FingerprintJS.load()
      .then(fp => fp.get())
      .then(result => {
        // result.visitorId is a permanent 32-character string unique to this exact physical phone
        secureDeviceHash = "SECURE-" + result.visitorId.toUpperCase();
        console.log("Hardware Locked: ", secureDeviceHash);
      });
  }
});

// 2. Return the calculated fingerprint when needed
function getDeviceId() {
  // If they somehow click submit before it finishes calculating in the background (very rare), 
  // fallback to a local storage permanent ID temporarily.
  if (!secureDeviceHash) {
    let fallback = localStorage.getItem("gecwc_temp_id");
    if (!fallback) {
      fallback = "TEMP-" + Math.random().toString(36).substring(2, 15).toUpperCase();
      localStorage.setItem("gecwc_temp_id", fallback);
    }
    return fallback;
  }

  return secureDeviceHash;
}

// --- LOOKUP TRIGGER ---
document.getElementById("roll").addEventListener("blur", async (e) => {
  if (!e.target.value) return;
  const currentRole = document.getElementById("userRole").value;
  if (currentRole === "Student") {
    const userStr = localStorage.getItem("campusUser");
    const enteredRoll = e.target.value.trim().toUpperCase();

    if (!userStr) {
      showSnackbar("Login Required", "Please login to your account first.");
      e.target.value = ""; // Clear the box
      e.target.dispatchEvent(new Event("input")); // Reset floating label
      return; // Stop the script
    }

    const loggedInUser = JSON.parse(userStr);
    if (loggedInUser.roll.toUpperCase() !== enteredRoll) {
      showSnackbar("Mismatch", "Please enter your own logged-in Roll Number.");
      e.target.value = ""; // Clear the box
      e.target.dispatchEvent(new Event("input")); // Reset floating label
      return; // Stop the script
    }
  }

  const mode = document.getElementById("actionInput").value;

  const statusPill = document.getElementById("status-pill");
  if (statusPill) statusPill.innerText = "Checking...";

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

      updateVisibility();

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

      // Re-enable the main submit button if they are found
      document.getElementById("submitBtn").disabled = false;
      document
        .getElementById("submitBtn")
        .classList.remove("opacity-50", "cursor-not-allowed");
    } else {
      const currentRole = document.getElementById("userRole").value;

      if (currentRole === "Student" && e.target.value.length > 3) {
        // 1. Disable the main entry form submit button
        const mainBtn = document.getElementById("submitBtn");
        mainBtn.disabled = true;
        mainBtn.classList.add("opacity-50", "cursor-not-allowed");

        // 2. Pre-fill their roll number in the signup form
        document.getElementById("regRoll").value = e.target.value;

        // 3. Show Alert & Open Registration Modal
        showAlert(
          "Not Registered",
          "Your Roll Number was not found. Please register your profile to use the gate system.",
        );
        document.getElementById("signupModal").classList.remove("hidden");
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
  if ("speechSynthesis" in window) {
    const silentUtterance = new SpeechSynthesisUtterance("");
    silentUtterance.volume = 0;
    window.speechSynthesis.speak(silentUtterance);
  }

  //FINAL SECURITY GATE
  const currentRole = document.getElementById("userRole").value;
  if (currentRole === "Student") {
    const userStr = localStorage.getItem("campusUser");
    const enteredRoll = document
      .getElementById("roll")
      .value.trim()
      .toUpperCase();

    if (!userStr) {
      showSnackbar(
        "Action Denied",
        "You must be logged in to authorize an entry.",
      );
      return;
    }
    const loggedInUser = JSON.parse(userStr);
    if (loggedInUser.roll.toUpperCase() !== enteredRoll) {
      showSnackbar("Action Denied", "Roll Number mismatch. Use your own pass.");
      return;
    }
  }

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

      const isGuest = document.getElementById("userRole").value === "Guest";

      const payload = {
        action: "submit",
        actionInput: document.getElementById("actionInput").value,
        role: document.getElementById("userRole").value,
        roll: document.getElementById("roll").value,
        name: document.getElementById("name").value,
        gender: selectedGender ? selectedGender.value : "Not Specified",
        branch: document.getElementById("branch").value || "N/A",
        roomNo: document.getElementById("roomNo").value || "N/A",
        deviceId: getDeviceId(),
        mobile: isGuest
          ? document.getElementById("roll").value
          : document.getElementById("mobile").value,
        address: document.getElementById("address").value || "N/A",
        purposeMain: document.getElementById("purpose").value || "N/A",
        purposeOther: document.getElementById("otherPurpose").value,
        vehicleNo: document.getElementById("vehicleNo")
          ? document.getElementById("vehicleNo").value
          : "",
        imageBase64: base64ImageString,
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
          const fullName = document.getElementById("name").value;
          const rollNo = document.getElementById("roll").value.toUpperCase();
          const branch = document.getElementById("branch").value;
          const roomNo = document.getElementById("roomNo").value;
          const role = document.getElementById("userRole").value;
          let mode = document.getElementById("actionInput").value;

          if (role === "Guest") mode = "Pending " + mode;

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

          saveToHistory(payload, mode);
          applyModalStyle(mode);

          if (mode.includes("Pending")) {
            startStatusPolling(rollNo);
          } else {
            if ("vibrate" in navigator) navigator.vibrate([100, 30, 100]);
            speakSuccess(studentName, mode);
          }

          document.getElementById("successCardName").innerText = fullName;
          document.getElementById("successCardDetails").innerText =
            `${rollNo} • ${branch || role} • ${roomNo || "N/A"}`;

          // Fetch image from local session if available
          const userStr = localStorage.getItem("campusUser");
          const profileImgEl = document.getElementById("successProfileImg");
          const placeholderEl = document.getElementById(
            "successProfilePlaceholder",
          );

          if (userStr) {
            const user = JSON.parse(userStr);
            if (user.roll.toUpperCase() === rollNo && user.img) {
              profileImgEl.src = getDirectDriveLink(user.img);
              profileImgEl.classList.remove("hidden");
              placeholderEl.classList.add("hidden");
            } else {
              profileImgEl.classList.add("hidden");
              placeholderEl.classList.remove("hidden");
              placeholderEl.innerText = fullName.substring(0, 2).toUpperCase();
            }
          }


          let basePath = window.location.href.split("?")[0];
          if (!basePath.endsWith("/")) basePath = basePath.substring(0, basePath.lastIndexOf("/"));

          // 2. BULLETPROOF INTERCEPTION: If the Android WebView tries to use localhost, forcefully overwrite it!
          if (basePath.includes("localhost")) {
            basePath = (typeof ENV !== 'undefined' && ENV.BASE_URL)
              ? ENV.BASE_URL
              : "https://quantazeroplus.github.io/smart-entry";
          }

          const timestamp = Date.now();
          const rawQrData =
            basePath + "/qr_guard.html?scan=" + rollNo + "&t=" + timestamp;

          const qrData = encodeURIComponent(rawQrData);
          document.getElementById("successQRCode").src =
            `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}&color=000000`;

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
          showSnackbar("Action Denied", result.error, "error");

          btn.classList.add("animate-shake-error");
          btn.classList.remove(
            "from-indigo-600",
            "to-blue-600",
            "from-emerald-500",
            "to-teal-600",
          );
          btn.classList.add(
            "from-rose-500",
            "to-red-600",
            "shadow-[0_8px_20px_-6px_rgba(244,63,94,0.5)]",
          );
          btn.innerHTML = `<span class="relative z-10">Access Denied</span> <i class="fas fa-lock relative z-10"></i>`;

          setTimeout(() => {
            btn.disabled = false;
            btn.classList.remove(
              "animate-shake-error",
              "from-rose-500",
              "to-red-600",
              "shadow-[0_8px_20px_-6px_rgba(244,63,94,0.5)]",
            );

            // Restore the correct colors depending on Quick Entry mode
            if (isQuick) {
              btn.classList.add("from-emerald-500", "to-teal-600");
              btn.innerHTML = `<span class="relative z-10">Fast-Track Authorization</span> <i class="fas fa-bolt relative z-10"></i>`;
            } else {
              btn.classList.add("from-indigo-600", "to-blue-600");
              btn.innerHTML = `<span class="relative z-10">Authorize Action</span> <i class="fas fa-arrow-right relative z-10 group-hover:translate-x-1.5 transition-transform duration-300"></i>`;
            }
          }, 5000);
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

async function speakSuccess(name, mode) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const textToSpeak = greeting + " " + name + ". Your " + mode + " has been marked. Thank you!";

  let nativeWorked = false;

  // 1. Try Native Android Text-to-Speech
  if (window.Capacitor && window.Capacitor.isNative) {
    try {
      if (window.Capacitor.Plugins && window.Capacitor.Plugins.TextToSpeech) {
        await window.Capacitor.Plugins.TextToSpeech.speak({
          text: textToSpeak,
          lang: 'en-US',
          rate: 1.0,
          pitch: 1.0,
          volume: 1.0,
          category: 'ambient',
        });
        nativeWorked = true;
      }
    } catch (e) {
      console.log("Native TTS failed, moving to fallback:", e);
    }
  }

  // 2. Bulletproof Fallback: The Web Speech API
  if (!nativeWorked && "speechSynthesis" in window) {
    try {
      const message = new SpeechSynthesisUtterance(textToSpeak);
      message.volume = 1;
      message.rate = 0.95;
      message.pitch = 1.1;


      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const femaleVoice = voices.find((v) => v.name.includes("Female"));
        if (femaleVoice) {
          message.voice = femaleVoice;
        }
      }

      window.speechSynthesis.speak(message);
    } catch (e) {
      console.log("Web TTS failed:", e);
    }
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
  const isGuest = document.getElementById("userRole").value === "Guest";
  const defaultOption = isGuest
    ? '<option value="" disabled selected>Select Purpose</option>'
    : "";

  select.innerHTML =
    defaultOption +
    options
      .map(
        (opt) =>
          `<option value="${opt}">${opt === "Other" ? "Other (Write below)" : opt}</option>`,
      )
      .join("");
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
let currentGpsState = "red"; // 🚨 ADDED THIS to track the current color

navigator.geolocation.watchPosition(
  (pos) => {
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

    // --- YOUR 3-STATE UI LOGIC ---
    const gpsDot = document.getElementById("gps-dot");
    const gpsPing = document.getElementById("gps-ping");

    if (gpsDot && gpsPing) {
      if (isAllowed) {
        currentGpsState = "green"; // Track Green
        // GREEN DOT (At the gate, form opens)
        gpsDot.className = "relative w-2.5 h-2.5 rounded-full bg-emerald-500 z-10 shadow-[0_0_8px_rgba(16,185,129,0.9)] transition-all duration-300";
        gpsPing.className = "absolute w-3 h-3 rounded-full bg-emerald-400 animate-ping opacity-75 transition-all duration-300";
      } else {
        currentGpsState = "orange"; // Track Orange
        // ORANGE DOT (GPS found, but too far away) - Made big!
        gpsDot.className = "relative w-2.5 h-2.5 rounded-full bg-orange-500 z-10 shadow-[0_0_8px_rgba(249,115,22,0.9)] transition-all duration-300";
        gpsPing.className = "absolute w-3 h-3 rounded-full bg-orange-400 animate-ping opacity-75 transition-all duration-300";
      }
    }

    if (isAllowed && !isInZone) {
      isInZone = true; // Mark as inside
      if ("vibrate" in navigator) navigator.vibrate([200, 100, 200]); // Vibrate ONCE
    } else if (dist > MAX_DIST + 5) {
      isInZone = false;
    }

    document.getElementById("lockMessage").style.display = isAllowed ? "none" : "block";
    document.getElementById("entryForm").classList.toggle("hidden", !isAllowed);
  },
  (err) => {
    currentGpsState = "red"; // Track Red
    // RED DOT (GPS Off, Failed, or Timed Out) - Made big!
    const gpsDot = document.getElementById("gps-dot");
    const gpsPing = document.getElementById("gps-ping");
    if (gpsDot && gpsPing) {
      gpsDot.className = "relative w-2.5 h-2.5 rounded-full bg-rose-500 z-10 shadow-[0_0_8px_rgba(244,63,94,0.9)] transition-all duration-300";
      gpsPing.className = "absolute w-3 h-3 rounded-full bg-rose-400 animate-ping opacity-75 transition-all duration-300";
    }
  },
  // 5-second timeout forces Android to trigger the Red Dot if GPS is off
  { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
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

// --- THEME TOGGLE LOGIC ---
function toggleDarkMode() {
  const html = document.documentElement;
  const themeInput = document.getElementById("themeInput");

  if (html.classList.contains("dark")) {
    html.classList.remove("dark");
    localStorage.setItem("theme", "light");
    if (themeInput) themeInput.checked = false; // Set to Sun
  } else {
    html.classList.add("dark");
    localStorage.setItem("theme", "dark");
    if (themeInput) themeInput.checked = true; // Set to Moon
  }
}

// Initialize Theme on Load
window.addEventListener("DOMContentLoaded", () => {
  const themeInput = document.getElementById("themeInput");
  const savedTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches;

  // 🚨 FIX: Determine if we should use dark mode
  const shouldBeDark =
    savedTheme === "dark" || (!savedTheme && systemPrefersDark);

  if (shouldBeDark) {
    document.documentElement.classList.add("dark");
    if (themeInput) themeInput.checked = true; // Show Moon
  } else {
    document.documentElement.classList.remove("dark");
    if (themeInput) themeInput.checked = false; // Show Sun
  }

  // 🎨 FORCE THE ANDROID STATUS BAR COLOR TO RED
  if (window.Capacitor && window.Capacitor.Plugins.StatusBar) {
    window.Capacitor.Plugins.StatusBar.setBackgroundColor({ color: '#A60000' }).catch(e => console.log(e));
  }

  updatePurposeOptions("Entry");
  renderHistory();
  checkLoginState();
});

// --- DYNAMIC CARD COLORS ---
function applyModalStyle(mode) {
  const isEntry = mode === "Entry" || mode === "Re-Entry";
  const isExit = mode === "Exit";
  const isPending = mode.includes("Pending");

  const card = document.getElementById("modalCard");
  const badge = document.getElementById("newFloatingBadge");
  const badgeIcon = document.getElementById("badgeIcon");
  const badgeText = document.getElementById("badgeText");
  const glow = document.getElementById("modalGlow");
  const displayTime = document.getElementById("displayTime");
  const closeBtn = document.getElementById("modalCloseBtn");

  // Reset button state
  closeBtn.disabled = false;
  closeBtn.classList.remove(
    "animate-pulse",
    "cursor-not-allowed",
    "opacity-80",
  );

  if (isPending) {
    badge.className =
      "mb-4 z-20 px-6 py-2.5 rounded-full flex items-center gap-2 shadow-[0_10px_30px_rgba(245,158,11,0.4)] border border-amber-400 bg-amber-500/90 backdrop-blur-md text-white transform hover:scale-105 transition-transform";
    badgeIcon.className = "fas fa-spinner fa-spin text-lg";
    badgeText.innerText = "WAITING FOR GUARD...";
    glow.className =
      "absolute -top-20 -left-20 w-64 h-64 bg-amber-500/20 blur-[4rem] rounded-full pointer-events-none";
    displayTime.className =
      "text-3xl sm:text-4xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-400 dark:from-amber-400 dark:to-orange-300 tracking-tight drop-shadow-sm";

    //  LOCK THE BUTTON
    closeBtn.className =
      "w-full mt-7 py-4 rounded-2xl font-black text-[15px] shadow-[0_8px_20px_-6px_rgba(245,158,11,0.5)] tracking-widest uppercase text-white bg-gradient-to-r from-amber-500 to-orange-500 border border-amber-400/50 opacity-80 cursor-not-allowed animate-pulse";
    closeBtn.innerText = "WAITING FOR GUARD SCAN...";
    closeBtn.disabled = true;
  } else if (isEntry) {
    badge.className =
      "mb-4 z-20 px-6 py-2.5 rounded-full flex items-center gap-2 shadow-[0_10px_30px_rgba(16,185,129,0.4)] border border-emerald-400 bg-emerald-500/90 backdrop-blur-md text-white transform hover:scale-105 transition-transform";
    badgeIcon.className = "fas fa-check-circle text-lg animate-pulse";
    badgeText.innerText = "ENTRY APPROVED";
    glow.className =
      "absolute -top-20 -left-20 w-64 h-64 bg-emerald-500/20 blur-[4rem] rounded-full pointer-events-none";
    displayTime.className =
      "text-3xl sm:text-4xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 tracking-tight drop-shadow-sm";
    closeBtn.className =
      "w-full mt-7 py-4 rounded-2xl font-black text-[15px] hover:scale-[1.02] transition-all active:scale-95 shadow-[0_8px_20px_-6px_rgba(16,185,129,0.5)] tracking-widest uppercase text-white bg-gradient-to-r from-emerald-500 to-teal-600 border border-emerald-400/50";
    closeBtn.innerText = "DONE";
  } else {
    badge.className =
      "mb-4 z-20 px-6 py-2.5 rounded-full flex items-center gap-2 shadow-[0_10px_30px_rgba(244,63,94,0.4)] border border-rose-400 bg-rose-500/90 backdrop-blur-md text-white transform hover:scale-105 transition-transform";
    badgeIcon.className = "fas fa-sign-out-alt text-lg animate-pulse";
    badgeText.innerText = "EXIT APPROVED";
    glow.className =
      "absolute -top-20 -left-20 w-64 h-64 bg-rose-500/20 blur-[4rem] rounded-full pointer-events-none";
    displayTime.className =
      "text-3xl sm:text-4xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-red-500 dark:from-rose-400 dark:to-red-300 tracking-tight drop-shadow-sm";
    closeBtn.className =
      "w-full mt-7 py-4 rounded-2xl font-black text-[15px] hover:scale-[1.02] transition-all active:scale-95 shadow-[0_8px_20px_-6px_rgba(244,63,94,0.5)] tracking-widest uppercase text-white bg-gradient-to-r from-rose-500 to-red-600 border border-rose-400/50";
    closeBtn.innerText = "DONE";
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

function saveToHistory(data, actualMode) {
  let history = JSON.parse(localStorage.getItem("campus_history") || "[]");
  const now = new Date();
  const todayStr = now.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const record = {
    id: Date.now(),
    name: data.name,
    mode: actualMode || data.actionInput,
    time: now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    date: todayStr,
    timestamp: now.getTime(),
    roll: data.roll || "",
    branch: data.branch || "",
    roomNo: data.roomNo || "",
    role: data.role || "",
  };

  history.unshift(record);
  history = history.filter((item) => item.date === todayStr);
  localStorage.setItem("campus_history", JSON.stringify(history));
  renderHistory();
}

// --- 2. RENDER HISTORY PILLS ---

function renderHistory() {
  const historyList = document.getElementById("historyList");
  const section = document.getElementById("historySection");

  const now = new Date();
  const todayStr = now.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  let history = JSON.parse(localStorage.getItem("campus_history") || "[]");
  const originalLength = history.length;
  history = history.filter((item) => item.date === todayStr);

  if (history.length !== originalLength) {
    localStorage.setItem("campus_history", JSON.stringify(history));
  }

  if (history.length === 0) {
    section.classList.add("hidden");
    return;
  }

  section.classList.remove("hidden");
  historyList.innerHTML = history
    .map((item) => {
      const isPending = item.mode.includes("Pending");
      const isEntry = item.mode.includes("Entry"); // Works for Entry AND Pending Entry

      let borderGlow,
        iconGradient,
        iconClass,
        timeGradient,
        pillColors,
        dotColor;

      iconClass = isEntry
        ? "fa-arrow-right-to-bracket"
        : "fa-arrow-right-from-bracket";

      if (isPending) {
        borderGlow =
          "from-amber-400 via-amber-200 to-orange-500 dark:from-amber-500/50 dark:to-orange-500/50";
        iconGradient =
          "from-amber-400 to-amber-600 shadow-[0_8px_20px_rgba(245,158,11,0.4)]";
        timeGradient =
          "from-amber-600 to-orange-500 dark:from-amber-300 dark:to-orange-500";
        pillColors =
          "bg-amber-100 dark:bg-amber-900/40 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400";
        dotColor = "bg-amber-500";
      } else if (isEntry) {
        borderGlow =
          "from-emerald-400 via-emerald-200 to-teal-500 dark:from-emerald-500/50 dark:to-teal-500/50";
        iconGradient =
          "from-emerald-400 to-emerald-600 shadow-[0_8px_20px_rgba(16,185,129,0.4)]";
        timeGradient =
          "from-emerald-600 to-teal-500 dark:from-emerald-300 dark:to-teal-500";
        pillColors =
          "bg-emerald-100 dark:bg-emerald-900/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400";
        dotColor = "bg-emerald-500";
      } else {
        borderGlow =
          "from-rose-400 via-rose-200 to-red-500 dark:from-rose-500/50 dark:to-red-500/50";
        iconGradient =
          "from-rose-400 to-rose-600 shadow-[0_8px_20px_rgba(244,63,94,0.4)]";
        timeGradient =
          "from-rose-600 to-red-500 dark:from-rose-300 dark:to-red-500";
        pillColors =
          "bg-rose-100 dark:bg-rose-900/40 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400";
        dotColor = "bg-rose-500";
      }

      return `
         <div onclick="reShowSuccess('${item.name.replace(/'/g, "\\'")}', '${item.mode}', '${item.time}', '${item.date}', '${item.roll}', '${item.branch}', '${item.roomNo}', '${item.role}')" 
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
                        <span class="text-[9px] font-black text-slate-400 dark:text-slate-500 tracking-[0.2em] uppercase mb-0.5">${item.date}</span>
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

//  SNACKBAR LOGIC ---
let sbTimeout;
function showSnackbar(title, message, type = "error") {
  const sb = document.getElementById("coolSnackbar");
  document.getElementById("sbTitle").innerText = title;
  document.getElementById("sbMessage").innerText = message;

  const iconBox = document.getElementById("sbIconBox");
  const icon = document.getElementById("sbIcon");
  const titleEl = document.getElementById("sbTitle");
  const glow = document.getElementById("sbGlow");
  const progressBar = document.getElementById("sbProgressBar");

  progressBar.style.transitionDuration = "0ms";
  progressBar.style.width = "100%";

  if (type === "error") {
    sb.classList.add("animate-shake-error");
    setTimeout(() => sb.classList.remove("animate-shake-error"), 500);

    iconBox.className =
      "relative w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner z-10 bg-gradient-to-br from-rose-400 to-rose-600 text-white border-2 border-rose-300 dark:border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]";
    icon.className = "fas fa-exclamation text-2xl animate-pop-bounce";
    titleEl.className =
      "text-[11px] font-black uppercase tracking-[0.2em] text-rose-600 dark:text-rose-400";
    glow.className =
      "absolute -left-10 w-24 h-24 blur-[2rem] rounded-full pointer-events-none opacity-50 bg-rose-500";
    progressBar.className =
      "h-full w-full rounded-r-full bg-gradient-to-r from-rose-400 to-rose-600 ease-linear";
  } else {
    iconBox.className =
      "relative w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner z-10 bg-gradient-to-br from-amber-400 to-amber-500 text-white border-2 border-amber-300 dark:border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]";
    icon.className = "fas fa-info text-2xl animate-pop-bounce";
    titleEl.className =
      "text-[11px] font-black uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400";
    glow.className =
      "absolute -left-10 w-24 h-24 blur-[2rem] rounded-full pointer-events-none opacity-50 bg-amber-500";
    progressBar.className =
      "h-full w-full rounded-r-full bg-gradient-to-r from-amber-400 to-orange-500 ease-linear";
  }

  void sb.offsetWidth;

  sb.classList.remove("-translate-y-40", "opacity-0", "scale-90");
  sb.classList.add("translate-y-0", "opacity-100", "scale-100");

  progressBar.style.transitionDuration = "7000ms";
  progressBar.style.width = "0%";

  if ("vibrate" in navigator) navigator.vibrate([40, 40]);

  clearTimeout(sbTimeout);
  sbTimeout = setTimeout(() => {
    sb.classList.remove("translate-y-0", "opacity-100", "scale-100");
    sb.classList.add("-translate-y-40", "opacity-0", "scale-90");
  }, 7000);
}

// --- 3. RE-SHOW SUCCESS MODAL ---

function reShowSuccess(name, mode, time, date, roll, branch, roomNo, role) {
  applyModalStyle(mode);

  if (mode.includes("Pending")) {
    startStatusPolling(roll);
  }
  document.getElementById("displayTime").innerText = time;
  document.getElementById("displayDate").innerText = date || "Today";

  document.getElementById("successCardName").innerText = name;
  document.getElementById("successCardDetails").innerText =
    `${roll || "N/A"} • ${branch || role || "N/A"} • ${roomNo || "N/A"}`;

  const userStr = localStorage.getItem("campusUser");
  const profileImgEl = document.getElementById("successProfileImg");
  const placeholderEl = document.getElementById("successProfilePlaceholder");

  if (userStr && roll) {
    const user = JSON.parse(userStr);
    if (user.roll.toUpperCase() === roll.toUpperCase() && user.img) {
      profileImgEl.src = getDirectDriveLink(user.img);
      profileImgEl.classList.remove("hidden");
      placeholderEl.classList.add("hidden");
    } else {
      profileImgEl.classList.add("hidden");
      placeholderEl.classList.remove("hidden");
      placeholderEl.innerText = name.substring(0, 2).toUpperCase();
    }
  }


  // GENERATE QR CODE WEB

  let basePath = window.location.href.split("?")[0];
  if (!basePath.endsWith("/")) basePath = basePath.substring(0, basePath.lastIndexOf("/"));

  // 2. BULLETPROOF INTERCEPTION: If the Android WebView tries to use localhost, forcefully overwrite it!
  if (basePath.includes("localhost")) {
    basePath = (typeof ENV !== 'undefined' && ENV.BASE_URL)
      ? ENV.BASE_URL
      : "https://quantazeroplus.github.io/smart-entry";
  }

  const timestamp = Date.now();
  const rawQrData =
    basePath + "/qr_guard.html?scan=" + roll + "&t=" + timestamp;

  const qrData = encodeURIComponent(rawQrData);
  document.getElementById("successQRCode").src =
    `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}&color=000000`;

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

// --- PASSWORD STRENGTH METER ---
document.getElementById("regPass")?.addEventListener("input", function (e) {
  const val = e.target.value;
  const meterBar = document.getElementById("passMeterBar");
  const meterText = document.getElementById("passMeterText");

  let strength = 0;
  if (val.length >= 8) strength += 25; // Length
  if (val.match(/[A-Z]/)) strength += 25; // Uppercase
  if (val.match(/[0-9]/)) strength += 25; // Number
  if (val.match(/[^A-Za-z0-9]/)) strength += 25; // Special Character

  meterBar.style.width = strength + "%";

  if (val.length === 0) {
    meterBar.style.width = "0%";
    meterText.innerText = "";
  } else if (strength <= 25) {
    meterBar.className = "h-full bg-rose-500 transition-all duration-300";
    meterText.innerText = "WEAK";
    meterText.style.color = "#f43f5e";
  } else if (strength <= 50) {
    meterBar.className = "h-full bg-amber-500 transition-all duration-300";
    meterText.innerText = "FAIR";
    meterText.style.color = "#f59e0b";
  } else if (strength <= 75) {
    meterBar.className = "h-full bg-blue-500 transition-all duration-300";
    meterText.innerText = "GOOD";
    meterText.style.color = "#3b82f6";
  } else {
    meterBar.className = "h-full bg-emerald-500 transition-all duration-300";
    meterText.innerText = "STRONG";
    meterText.style.color = "#10b981";
  }
});


// CLEAN UP REGISTRATION MODAL  ---
function closeSignupModal() {
  document.getElementById('signupModal').classList.add('hidden');
  document.getElementById('signupForm').reset();
  regBase64Image = "";

  // Clear the Green/Red border colors
  const confirmPass = document.getElementById("regConfirmPass");
  if (confirmPass) confirmPass.classList.remove("input-success", "input-error");

  // Clear the Password Strength Meter
  const meterBar = document.getElementById("passMeterBar");
  if (meterBar) {
    meterBar.style.width = "0%";
    meterBar.className = "h-full w-0 transition-all duration-300"; // Reset to default class
  }

  const meterText = document.getElementById("passMeterText");
  if (meterText) meterText.innerText = "";

  // Reset the 'No Room' checkbox
  const roomCheck = document.getElementById("noRoomCheck");
  if (roomCheck) {
    roomCheck.checked = false;
    toggleNoRoom(roomCheck);
  }
}

// --- SIGNUP LOGIC ---
let regBase64Image = "";

document
  .getElementById("regImage")
  ?.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
      const img = new Image();
      img.src = e.target.result;
      img.onload = function () {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 500;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        regBase64Image = canvas.toDataURL("image/jpeg", 0.7);
      };
    };
  });

document.getElementById("signupForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const btn = document.getElementById("regSubmitBtn");
  const loader = document.getElementById("signupLoaderModal");

  if (!regBase64Image) {
    showAlert(
      "Image Required",
      "Profile picture is mandatory. Please upload an image.",
    );
    return;
  }

  if (
    document.getElementById("regPass").value !==
    document.getElementById("regConfirmPass").value
  ) {
    showAlert(
      "Password Mismatch",
      "Your passwords do not match. Please re-enter them.",
      "error",
    );
    document.getElementById("regConfirmPass").focus();
    return;
  }

  btn.disabled = true;
  btn.innerHTML =
    '<i class="fas fa-spinner animate-spin mr-2"></i>Registering...';
  loader.classList.remove("hidden");

  const payload = {
    action: "signup",
    roll: document.getElementById("regRoll").value.trim().toUpperCase(),
    name: document.getElementById("regName").value.trim(),
    email: document.getElementById("regEmail").value.trim(),
    mobile: document.getElementById("regMobile").value.trim(),
    password: document.getElementById("regPass").value,
    branch: document.getElementById("regBranch").value,
    gender: document.querySelector('input[name="regGender"]:checked')?.value,
    roomNo: document.getElementById("regRoom").value || "DAY SCHOLAR",
    district: document.getElementById("regDistrict").value,
    imageBase64: regBase64Image,
    deviceId: getDeviceId(),
  };

  try {
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    loader.classList.add("hidden");

    if (result.success) {
      closeSignupModal();
      showAlert("Success!", result.message, "success");

      // Auto-fill main gate form
      document.getElementById("roll").value = payload.roll;
      document.getElementById("roll").dispatchEvent(new Event("blur"));
    } else {
      showAlert(
        "Registration Failed",
        result.error || "Please try again.",
        "error",
      );
    }
  } catch (err) {
    console.error("Signup Error:", err);
    loader.classList.add("hidden");
    showAlert(
      "Network Error",
      "Unable to connect to the server. Check your internet.",
    );
  } finally {
    btn.disabled = false;
    btn.innerHTML = "Create Profile & Register";
  }
});

// --- LOGIN LOGIC ---
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const btn = document.getElementById("loginSubmitBtn");
  btn.disabled = true;
  btn.innerHTML = "Authenticating...";
  document.getElementById("loginLoaderModal").classList.remove("hidden");

  const payload = {
    action: "login",
    roll: document.getElementById("loginRoll").value.trim(),
    email: document.getElementById("loginEmail").value.trim(),
    password: document.getElementById("loginPass").value,
  };

  try {
    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    document.getElementById("loginLoaderModal").classList.add("hidden");
    if (result.success) {
      document.getElementById("loginModal").classList.add("hidden");
      showAlert(
        "Login Successful",
        "Welcome back, " + result.username + "!",
        "success",
      );
      document.getElementById("loginForm").reset();

      localStorage.setItem(
        "campusUser",
        JSON.stringify({
          name: result.username,
          email: result.email || payload.email,
          mobile: result.mobile || "",
          roomNo: result.roomNo || "",
          roll: payload.roll,
          img: result.profileImg,
        }),
      );

      checkLoginState();

      // Auto-fill main gate form on successful login
      const mainRollInput = document.getElementById("roll");
      if (mainRollInput) {
        mainRollInput.value = payload.roll.toUpperCase();
        mainRollInput.dispatchEvent(new Event("blur"));
      }
    } else {
      showAlert("Login Failed", result.error, "error");
    }
  } catch (err) {
    document.getElementById("loginLoaderModal").classList.add("hidden");
    showAlert("Error", "Check your connection and try again.");
  }
  btn.disabled = false;
  btn.innerHTML = "Login";
});

// --- PASSWORD RESET LOGIC ---
function openResetModal() {
  document.getElementById("loginModal").classList.add("hidden");
  document.getElementById("resetModal").classList.remove("hidden");
}

function closeResetModal() {
  document.getElementById("resetModal").classList.add("hidden");
}

document.getElementById("resetForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const btn = document.getElementById("resetSubmitBtn");
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner animate-spin mr-2"></i>Sending...';

  const payload = {
    action: "reset",
    roll: document.getElementById("resetRoll").value.trim(),
    email: document.getElementById("resetEmail").value.trim(),
  };

  try {
    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const result = await res.json();

    if (result.success) {
      closeResetModal();
      showAlert("Email Sent!", result.message, "success");
      document.getElementById("resetForm").reset();
    } else {
      showAlert("Reset Failed", result.error, "error");
    }
  } catch (err) {
    showAlert("Network Error", "Check your connection and try again.");
  }

  btn.disabled = false;
  btn.innerHTML = "Send Temporary Password";
});
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

// --- DASHBOARD LOGIC ---
function openDashboard() {
  // 1. Check if they are logged in
  const userStr = localStorage.getItem("campusUser");

  if (!userStr) {
    toggleMenu(); // Close sidebar
    setTimeout(() => {
      showAlert("Not Logged In", "Please login first to view your dashboard.");
      document.getElementById("loginModal").classList.remove("hidden");
    }, 300);
    return;
  }

  // 2. Parse User Data
  const user = JSON.parse(userStr);

  // 3. Update the UI
  document.getElementById("dashName").innerText = user.name || "Student";
  document.getElementById("dashEmail").innerText =
    user.email || user.roll || "";

  // 4. Handle Avatar Picture vs Initials (CRASH PROOF)
  const dashAvatarImg = document.getElementById("dashAvatarImg");
  const dashAvatarText = document.getElementById("dashAvatarText");

  if (dashAvatarImg && dashAvatarText) {
    if (
      user.img &&
      typeof user.img === "string" &&
      user.img.includes("drive.google.com")
    ) {
      dashAvatarImg.src = getDirectDriveLink(user.img);
      dashAvatarImg.classList.remove("hidden");
      dashAvatarText.classList.add("hidden");
    } else {
      dashAvatarImg.classList.add("hidden");
      dashAvatarText.classList.remove("hidden");
      let initials = "ST";
      if (user.name) {
        let nameParts = user.name.trim().split(" ");
        initials =
          nameParts.length >= 2
            ? nameParts[0][0] + nameParts[1][0]
            : nameParts[0].substring(0, 2);
      }
      dashAvatarText.innerText = initials.toUpperCase();
    }
  }

  // 5. Open Modal
  toggleMenu(); // Close sidebar
  document.getElementById("dashboardModal").classList.remove("hidden");
}

function closeDashboard() {
  const dashboard = document.getElementById("dashboardModal");
  if (dashboard) {
    dashboard.classList.add("hidden");
  }
}

// --- UI STATE MANAGEMENT ---
function checkLoginState() {
  const userStr = localStorage.getItem("campusUser");
  const loggedOutMenu = document.getElementById("loggedOutMenu");
  const loggedInMenu = document.getElementById("loggedInMenu");

  if (userStr) {
    const user = JSON.parse(userStr);

    // Hide Login/Register, Show Dashboard safely
    if (loggedOutMenu && loggedInMenu) {
      loggedOutMenu.classList.add("hidden");
      loggedOutMenu.classList.remove("flex");
      loggedInMenu.classList.remove("hidden");
      loggedInMenu.classList.add("flex");
    }

    // Fill Mini Dashboard Info safely
    const sideName = document.getElementById("sideName");
    if (sideName) sideName.innerText = user.name || "Student";

    const sideEmail = document.getElementById("sideEmail");
    if (sideEmail) sideEmail.innerText = user.email || "No Email Provided";

    const sideRoll = document.getElementById("sideRoll");
    if (sideRoll) sideRoll.innerText = (user.roll || "").toUpperCase();

    // Handle Avatar Picture vs Initials
    const avatarImg = document.getElementById("sideAvatarImg");
    const avatarText = document.getElementById("sideAvatarText");

    if (avatarImg && avatarText) {
      // Safe string check before manipulating
      if (
        user.img &&
        typeof user.img === "string" &&
        user.img.includes("drive.google.com")
      ) {
        avatarImg.src = getDirectDriveLink(user.img);
        avatarImg.classList.remove("hidden");
        avatarText.classList.add("hidden");
      } else {
        avatarImg.classList.add("hidden");
        avatarText.classList.remove("hidden");
        let initials = "ST";
        if (user.name) {
          let nameParts = user.name.trim().split(" ");
          initials =
            nameParts.length >= 2
              ? nameParts[0][0] + nameParts[1][0]
              : nameParts[0].substring(0, 2);
        }
        avatarText.innerText = initials.toUpperCase();
      }
    }
  } else {
    // Show Login/Register, Hide Dashboard
    if (loggedOutMenu && loggedInMenu) {
      loggedOutMenu.classList.remove("hidden");
      loggedOutMenu.classList.add("flex");
      loggedInMenu.classList.add("hidden");
      loggedInMenu.classList.remove("flex");
    }
  }
}

// Initialize everything on Page Load
window.addEventListener("DOMContentLoaded", () => {
  const themeInput = document.getElementById("themeInput");

  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark");
    if (themeInput) themeInput.checked = true;
  } else {
    if (themeInput) themeInput.checked = false;
  }

  updatePurposeOptions("Entry");
  renderHistory();
  checkLoginState(); // Check if user is already logged in on page load
});

let isMenuOpen = false;

function toggleMenu() {
  isMenuOpen = !isMenuOpen;
  const menu = document.getElementById("mobileMenu");
  const overlay = document.getElementById("menuOverlay");

  if (isMenuOpen) {
    // Slide Menu In & Trigger Animations
    menu.classList.remove("translate-x-full");
    menu.classList.add("is-open");

    // Fade Overlay In
    overlay.classList.remove("opacity-0", "pointer-events-none");
    overlay.classList.add("opacity-100", "pointer-events-auto");
  } else {
    // Slide Menu Out & Reset Animations
    menu.classList.add("translate-x-full");
    menu.classList.remove("is-open");

    // Fade Overlay Out
    overlay.classList.remove("opacity-100", "pointer-events-auto");
    overlay.classList.add("opacity-0", "pointer-events-none");
  }
}
// --- GOOGLE DRIVE IMAGE CONVERTER ---
function getDirectDriveLink(url) {
  if (!url) return "";
  // Extracts the 33-character Google Drive File ID
  const match = url.match(/[-\w]{25,}/);
  if (match && match[0]) {
    return "https://drive.google.com/thumbnail?id=" + match[0] + "&sz=w400";
  }
  return url;
}

// --- SMART CUSTOM ALERT SYSTEM (With Vibration) ---
function showAlert(title, message, type = "warning") {
  const modalType = type === "success" ? "info" : type;

  document.getElementById(modalType + "Title").innerText = title;
  document.getElementById(modalType + "Message").innerText = message;

  const modal = document.getElementById(modalType + "Modal");
  const card = modal.lastElementChild;

  // 📳 TRIGGER HAPTIC VIBRATION PATTERNS
  if ("vibrate" in navigator) {
    if (type === "success") {
      navigator.vibrate([100, 50, 100]);
    } else if (type === "error") {
      navigator.vibrate([50, 50, 50, 50, 50]);

      card.classList.add("animate-shake-error");
      setTimeout(() => card.classList.remove("animate-shake-error"), 400);
    } else {
      navigator.vibrate([200]);
    }
  }

  const iconBox = card.querySelector(".animate-pop-bounce");
  if (iconBox) {
    iconBox.classList.remove("animate-pop-bounce");
    void iconBox.offsetWidth;
    iconBox.classList.add("animate-pop-bounce");
  }

  modal.classList.remove("hidden");
  setTimeout(() => {
    card.classList.remove("scale-90", "opacity-0");
    card.classList.add("scale-100", "opacity-100");
  }, 10);
}

function closeAlert(modalId) {
  const modal = document.getElementById(modalId);
  const card = modal.lastElementChild;

  card.classList.remove("scale-100", "opacity-100");
  card.classList.add("scale-90", "opacity-0");
  setTimeout(() => {
    modal.classList.add("hidden");
  }, 300);
}

// --- LOGOUT CONFIRMATION LOGIC ---
function openLogoutConfirm() {
  const modal = document.getElementById("logoutConfirmModal");
  const card = document.getElementById("logoutConfirmCard");
  modal.classList.remove("hidden");
  setTimeout(() => {
    card.classList.remove("scale-90", "opacity-0");
    card.classList.add("scale-100", "opacity-100");
  }, 10);
}

function closeLogoutConfirm() {
  const modal = document.getElementById("logoutConfirmModal");
  const card = document.getElementById("logoutConfirmCard");
  card.classList.remove("scale-100", "opacity-100");
  card.classList.add("scale-90", "opacity-0");
  setTimeout(() => {
    modal.classList.add("hidden");
  }, 300);
}

function executeLogout() {
  closeLogoutConfirm();

  localStorage.removeItem("campusUser");
  closeDashboard();
  checkLoginState();

  // Clear the main gate form
  document.getElementById("roll").value = "";
  document.getElementById("name").value = "";
  document.getElementById("mobile").value = "";

  setTimeout(() => {
    if (isMenuOpen) toggleMenu(); // Close Sidebar if open
    showAlert(
      "Logged Out",
      "You have successfully exited your account.",
      "info",
    );
  }, 300);
}

// --- SETTINGS / UPDATE PROFILE LOGIC ---

let updateBase64Image = "";

function openSettingsModal() {
  closeDashboard(); // Hide the dark dashboard
  if (isMenuOpen) toggleMenu(); // <-- ADD THIS to close the side menu
  setTimeout(() => {
    // Pre-fill their existing name
    const userStr = localStorage.getItem("campusUser");
    if (userStr) {
      const user = JSON.parse(userStr);
      const nameInput = document.getElementById("updateName");
      nameInput.value = user.name || "";
      nameInput.dispatchEvent(new Event("blur"));

      // Pre-fill Room Number
      const roomInput = document.getElementById("updateRoomNo");
      if (roomInput) {
        roomInput.value = user.roomNo || "";
        roomInput.dispatchEvent(new Event("blur"));
      }
      // Trigger floating label

      // Pre-fill image preview if they have one
      const preview = document.getElementById("settingsAvatarPreview");
      if (user.img && user.img.includes("drive.google.com")) {
        preview.src = getDirectDriveLink(user.img);
        preview.classList.remove("hidden");
      }
    }

    // Animate Modal In
    const modal = document.getElementById("settingsModal");
    const card = modal.lastElementChild;
    modal.classList.remove("hidden");
    setTimeout(() => {
      card.classList.remove("scale-90", "opacity-0");
      card.classList.add("scale-100", "opacity-100");
    }, 10);
  }, 300);
}

function closeSettingsModal() {
  const modal = document.getElementById("settingsModal");
  const card = modal.lastElementChild;

  card.classList.remove("scale-100", "opacity-100");
  card.classList.add("scale-90", "opacity-0");
  setTimeout(() => {
    modal.classList.add("hidden");

    // Reset Inputs
    updateBase64Image = "";
    document.getElementById("updateImage").value = "";
    document.getElementById("settingsAvatarPreview").classList.add("hidden");
    document.getElementById("currentPassword").value = "";
    document.getElementById("updatePassword").value = "";

    document.getElementById("updateConfirmPassword").value = "";
    document.getElementById("confirmPasswordGroup").classList.add("hidden");
    validateMatch("updatePassword", "updateConfirmPassword");

    // Reset the Two-Step Security UI
    isSecurityPrompted = false;
    document.getElementById("securityPrompt").classList.add("hidden");
    document.getElementById("currentPassword").required = false;

    // Reset the Button Colors
    const btn = document.getElementById("settingsSubmitBtn");
    btn.classList.add(
      "from-blue-600",
      "to-indigo-600",
      "hover:from-blue-500",
      "hover:to-indigo-500",
    );
    btn.classList.remove(
      "from-emerald-500",
      "to-teal-600",
      "hover:from-emerald-400",
      "hover:to-teal-500",
      "shadow-[0_8px_20px_-6px_rgba(16,185,129,0.5)]",
    );
    document.getElementById("btnIcon").className = "fas fa-save";
    document.getElementById("btnText").innerText = "Save Changes";
  }, 300);
}

// Compress New Image & Show Preview
document
  .getElementById("updateImage")
  ?.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
      // Show the live preview in the square
      const preview = document.getElementById("settingsAvatarPreview");
      preview.src = e.target.result;
      preview.classList.remove("hidden");

      // Compress
      const img = new Image();
      img.src = e.target.result;
      img.onload = function () {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 500;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        updateBase64Image = canvas.toDataURL("image/jpeg", 0.7);
      };
    };
  });

// Handle Form Submit

let isSecurityPrompted = false;

// Handle Form Submit (Two-Step Process)
document
  .getElementById("settingsForm")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const btn = document.getElementById("settingsSubmitBtn");
    const btnText = document.getElementById("btnText");
    const btnIcon = document.getElementById("btnIcon");
    const securityPrompt = document.getElementById("securityPrompt");
    const currentPasswordInput = document.getElementById("currentPassword");

    // STEP 1: If they just clicked "Save Changes", show the password box and stop.
    if (!isSecurityPrompted) {
      securityPrompt.classList.remove("hidden"); // Reveal the box
      currentPasswordInput.required = true; // Now it's mandatory
      currentPasswordInput.focus(); // Auto-focus the cursor inside it

      // Change the button to green to indicate the final step
      btn.classList.remove(
        "from-blue-600",
        "to-indigo-600",
        "hover:from-blue-500",
        "hover:to-indigo-500",
      );
      btn.classList.add(
        "from-emerald-500",
        "to-teal-600",
        "hover:from-emerald-400",
        "hover:to-teal-500",
        "shadow-[0_8px_20px_-6px_rgba(16,185,129,0.5)]",
      );
      btnIcon.className = "fas fa-check-double";
      btnText.innerText = "Confirm & Save";

      isSecurityPrompted = true;
      return;
    }

    const newPass = document.getElementById("updatePassword").value;
    const newConfirm = document.getElementById("updateConfirmPassword").value;

    if (newPass !== "" && newPass !== newConfirm) {
      showAlert(
        "Password Mismatch",
        "Your new passwords do not match. Please check them and try again.",
        "error",
      );

      // Reset the UI so they aren't stuck on the Confirm button
      isSecurityPrompted = false;
      securityPrompt.classList.add("hidden");
      currentPasswordInput.required = false;
      btn.classList.add(
        "from-blue-600",
        "to-indigo-600",
        "hover:from-blue-500",
        "hover:to-indigo-500",
      );
      btn.classList.remove(
        "from-emerald-500",
        "to-teal-600",
        "hover:from-emerald-400",
        "hover:to-teal-500",
        "shadow-[0_8px_20px_-6px_rgba(16,185,129,0.5)]",
      );
      btnIcon.className = "fas fa-save";
      btnText.innerText = "Save Changes";
      return;
    }

    btn.disabled = true;
    btnIcon.className = "fas fa-spinner animate-spin";
    btnText.innerText = "Verifying...";

    const userStr = localStorage.getItem("campusUser");
    if (!userStr) return;
    const user = JSON.parse(userStr);

    const payload = {
      action: "updateProfile",
      roll: user.roll,
      currentPassword: currentPasswordInput.value, // Captured!
      newName: document.getElementById("updateName").value.trim(),
      newMobile: document.getElementById("updateMobile").value.trim(),
      newRoomNo: document
        .getElementById("updateRoomNo")
        .value.trim()
        .toUpperCase(),
      newPassword: document.getElementById("updatePassword").value,
      imageBase64: updateBase64Image,
    };

    try {
      const res = await fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (result.success) {
        closeSettingsModal(); // This will auto-reset the UI for next time
        showAlert(
          "Profile Updated!",
          "Your changes have been saved securely.",
          "success",
        );

        // Update local storage so the UI updates instantly
        user.name = payload.newName;
        user.mobile = payload.newMobile;
        user.roomNo = payload.newRoomNo;
        if (result.newImgUrl) user.img = result.newImgUrl;
        localStorage.setItem("campusUser", JSON.stringify(user));
        checkLoginState();
      } else {
        showAlert(
          "Verification Failed",
          result.error || "Incorrect password.",
          "error",
        );
      }
    } catch (err) {
      showAlert("Network Error", "Unable to reach server.", "error");
    }

    // Re-enable button in case of error
    btn.disabled = false;
    btnIcon.className = "fas fa-check-double";
    btnText.innerText = "Confirm & Save";
  });
function toggleNoRoom(checkbox) {
  const roomInput = document.getElementById("regRoom");
  if (checkbox.checked) {
    roomInput.value = "DAY SCHOLAR";
    roomInput.readOnly = true;
    roomInput.classList.add(
      "bg-slate-200/50",
      "dark:bg-slate-800/50",
      "text-slate-400",
    );
    roomInput.dispatchEvent(new Event("blur")); // Triggers floating label
  } else {
    roomInput.value = "";
    roomInput.readOnly = false;
    roomInput.classList.remove(
      "bg-slate-200/50",
      "dark:bg-slate-800/50",
      "text-slate-400",
    );
    roomInput.focus();
  }
}

let pollingTimer = null;
let isApprovedLock = false;

function startStatusPolling(roll) {
  if (pollingTimer) clearInterval(pollingTimer);
  isApprovedLock = false; // Reset the lock when starting a new poll

  // Ping the server every 3 seconds
  pollingTimer = setInterval(async () => {
    if (isApprovedLock) return;

    try {
      const res = await fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({ action: "check_status", roll: roll }),
      });
      const data = await res.json();

      // If the status is NO LONGER "Pending", it means the Guard approved it!
      if (data.success && !data.status.includes("Pending") && !isApprovedLock) {
        isApprovedLock = true;
        clearInterval(pollingTimer); // Stop polling
        let history = JSON.parse(
          localStorage.getItem("campus_history") || "[]",
        );
        for (let i = 0; i < history.length; i++) {
          if (history[i].roll === roll && history[i].mode.includes("Pending")) {
            history[i].mode = data.status; // Change Pending to Approved status
            break;
          }
        }
        localStorage.setItem("campus_history", JSON.stringify(history));
        renderHistory();
        applyModalStyle(data.status);

        const newTimeStr = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        document.getElementById("displayTime").innerText = newTimeStr;

        const studentName = document
          .getElementById("successCardName")
          .innerText.split(" ")[0];
        speakSuccess(studentName, data.status);
        if ("vibrate" in navigator) navigator.vibrate([100, 30, 100]);
      }
    } catch (e) {
      console.log("Polling internet wait...");
    }
  }, 3000);
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("sw.js")
      .then((reg) => console.log("App ready: Service Worker Registered"))
      .catch((err) => console.log("Service Worker failed", err));
  });
}

// ---  PASSWORD MATCHING VISUAL VALIDATOR  ---
function validateMatch(passId, confirmId) {
  const pass = document.getElementById(passId).value;
  const confirmField = document.getElementById(confirmId);
  const confirm = confirmField.value;

  // If the confirm box is empty, remove all colors
  if (confirm === "") {
    confirmField.classList.remove('input-error', 'input-success');
    return;
  }

  // If they match, make it Green. If not, make it Red.
  if (pass === confirm) {
    confirmField.classList.remove('input-error');
    confirmField.classList.add('input-success');
  } else {
    confirmField.classList.remove('input-success');
    confirmField.classList.add('input-error');
  }
}

// Attach listeners to trigger colors while typing
document.getElementById('regPass')?.addEventListener('input', () => validateMatch('regPass', 'regConfirmPass'));
document.getElementById('regConfirmPass')?.addEventListener('input', () => validateMatch('regPass', 'regConfirmPass'));

document.getElementById('updatePassword')?.addEventListener('input', function (e) {
  const confirmGroup = document.getElementById('confirmPasswordGroup');
  const confirmInput = document.getElementById('updateConfirmPassword');

  if (e.target.value.length > 0) {
    confirmGroup.classList.remove('hidden');
    confirmInput.required = true;
  } else {
    confirmGroup.classList.add('hidden');
    confirmInput.required = false;
    confirmInput.value = '';
  }
  validateMatch('updatePassword', 'updateConfirmPassword');
});

document.getElementById('updateConfirmPassword')?.addEventListener('input', () => validateMatch('updatePassword', 'updateConfirmPassword'));

// Attach listeners to trigger colors while typing
document
  .getElementById("regPass")
  ?.addEventListener("input", () => validateMatch("regPass", "regConfirmPass"));
document
  .getElementById("regConfirmPass")
  ?.addEventListener("input", () => validateMatch("regPass", "regConfirmPass"));

document
  .getElementById("updatePassword")
  ?.addEventListener("input", function (e) {
    const confirmGroup = document.getElementById("confirmPasswordGroup");
    const confirmInput = document.getElementById("updateConfirmPassword");

    if (e.target.value.length > 0) {

      confirmGroup.classList.remove("hidden");
      confirmInput.required = true;
    } else {

      confirmGroup.classList.add("hidden");
      confirmInput.required = false;
      confirmInput.value = "";
    }

    validateMatch("updatePassword", "updateConfirmPassword");
  });


// --- SHOW GPS STATUS ON CLICK ---
function checkGpsStatus() {
  if (currentGpsState === "red") {
    showAlert("Location Error", "We are searching for a signal. Please ensure your phone's GPS/Location is turned ON.", "error");
  } else if (currentGpsState === "orange") {
    showAlert("Out of Range", "Location found, but you are not near the gate. Please move closer to the entrance to unlock the form.", "warning");
  } else if (currentGpsState === "green") {
    showAlert("Location Verified", "You are in the authorized gate zone! You may proceed with your entry/exit.", "success");
  }
}