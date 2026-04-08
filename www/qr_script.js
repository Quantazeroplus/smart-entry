document.addEventListener("contextmenu", (event) =>
    event.preventDefault(),
);
document.onkeydown = function (e) {
    if (e.keyCode == 123) return false;
    if (e.ctrlKey && e.shiftKey && e.keyCode == "I".charCodeAt(0))
        return false;
    if (e.ctrlKey && e.shiftKey && e.keyCode == "J".charCodeAt(0))
        return false;
    if (e.ctrlKey && e.keyCode == "U".charCodeAt(0)) return false; // Ctrl+U
    if (e.ctrlKey && e.shiftKey && e.keyCode == "C".charCodeAt(0))
        return false;
};

const SCRIPT_URL = ENV.SCRIPT_URL;
let scannedRoll = null;

// Theme Toggle Logic
function toggleGuardTheme() {
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
        html.classList.remove("dark");
        localStorage.setItem("theme", "light");
    } else {
        html.classList.add("dark");
        localStorage.setItem("theme", "dark");
    }
}

window.onload = () => {
    const urlParams = new URLSearchParams(window.location.search);
    scannedRoll = urlParams.get("scan");
    const scanTime = urlParams.get("t"); // 🚨 Grab the hidden timestamp

    const btn = document.getElementById("guardUnlockBtn");
    const rollText = document.getElementById("targetRollText");

    if (!scannedRoll) {
        rollText.innerText = "INVALID QR CODE. NO ID FOUND.";
        btn.disabled = true;
        btn.classList.add("opacity-50", "cursor-not-allowed", "grayscale");
        return;
    }


    if (scanTime) {
        const now = Date.now();
        const timeDiffHours = (now - parseInt(scanTime)) / (1000 * 60 * 60);

        // If older than 24 hours OR if someone tried to fake a future date
        if (timeDiffHours > 24 || timeDiffHours < -24) {
            rollText.innerText = "⚠️ QR CODE EXPIRED (OLDER THAN 24H)";
            rollText.classList.replace("text-blue-300/80", "text-rose-400"); // Turn text Red
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-ban mr-2"></i> EXPIRED PASS';
            btn.classList.add("opacity-50", "cursor-not-allowed", "grayscale");
            showToast(
                "This QR pass has expired. Student must generate a new one.",
            );
            return;
        }
    }

    rollText.innerText = "TARGET ID: " + scannedRoll.toUpperCase();
};

function getDeviceId() {
    return "GUARD-DEVICE-" + Math.random().toString(36).substring(7);
}

function showToast(msg) {
    const toast = document.getElementById("errorToast");
    document.getElementById("toastMsg").innerText = msg;
    toast.classList.remove("-translate-y-32", "opacity-0");
    toast.classList.add(
        "translate-y-0",
        "opacity-100",
        "animate-shake-error",
    );
    if ("vibrate" in navigator) navigator.vibrate([50, 50, 50]);
    setTimeout(() => toast.classList.remove("animate-shake-error"), 500);
    setTimeout(() => {
        toast.classList.remove("translate-y-0", "opacity-100");
        toast.classList.add("-translate-y-32", "opacity-0");
    }, 3500);
}

async function verifyGuardPassword() {
    const pass = document.getElementById("guardPassword").value;
    const btn = document.getElementById("guardUnlockBtn");


if (pass !== ENV.GUARD_PASS) {
        showToast("INCORRECT GATE PASSWORD");
        btn.classList.add("animate-shake-error", "border-rose-500");
        setTimeout(
            () =>
                btn.classList.remove("animate-shake-error", "border-rose-500"),
            400,
        );
        return;
    }

    btn.innerHTML =
        '<i class="fas fa-circle-notch fa-spin mr-2"></i> AUTHORIZING...';
    btn.disabled = true;

    try {
        const res = await fetch(SCRIPT_URL, {
            method: "POST",
            body: JSON.stringify({
                action: "guard_lookup",
                roll: scannedRoll,
                deviceId: getDeviceId(),
            }),
        });
        const data = await res.json();

        if (data.userData && data.userData.found) {
            document.getElementById("guardAuthBox").classList.add("hidden");
            document
                .getElementById("guardProfileBox")
                .classList.remove("hidden");
            document.getElementById("guardProfileBox").classList.add("flex");

            const u = data.userData;

            // 1. Populating the Info Grid
            document.getElementById("gName").innerText = u.name || "Unknown";
            document.getElementById("gRoll").innerText =
                scannedRoll.toUpperCase();

            const role = u.role || "Student";
            document.getElementById("gRoleBadge").innerText = role;

            // Adjust Badge Color based on role
            if (role === "Guest") {
                document.getElementById("gRoleBadge").className =
                    "px-2 py-0.5 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] md:text-xs font-black uppercase rounded border border-amber-300 dark:border-amber-500/30";
            }

            document.getElementById("gBranch").innerText =
                role === "Guest" ? "N/A" : u.branch || "N/A";
            document.getElementById("gRoom").innerText = u.roomNo || "N/A";
            document.getElementById("gAddress").innerText = u.address || "N/A";
            document.getElementById("gGender").innerText = u.gender || "N/A";
            document.getElementById("gVehicle").innerText =
                u.vehicleNo || "None";
            document.getElementById("gPurpose").innerText = u.purpose || "N/A";
            document.getElementById("gMobile").innerText =
                u.mobile || "Not Provided";

            if (u.mobile) {
                document.getElementById("gCall").href = "tel:" + u.mobile;
            } else {
                document
                    .getElementById("gCall")
                    .classList.add(
                        "opacity-50",
                        "pointer-events-none",
                        "grayscale",
                    );
            }

            // 2. Populating the Time Logs (Fixing the 1899 Date bug)
            function formatTimeStr(val) {
                if (!val || val === "--:--") return "--:--";
                if (typeof val === "string" && val.includes("T")) {
                    const d = new Date(val);
                    let h = d.getHours(),
                        m = d.getMinutes();
                    const ampm = h >= 12 ? "PM" : "AM";
                    h = h % 12 || 12;
                    m = m < 10 ? "0" + m : m;
                    return `${h}:${m} ${ampm}`;
                }
                return val;
            }

            document.getElementById("gInTime").innerText = formatTimeStr(
                u.entryTime,
            );
            document.getElementById("gOutTime").innerText = formatTimeStr(
                u.exitTime,
            );
            document.getElementById("gDate").innerText =
                u.logDate || "--/--/----";

            // 3. Dynamic Status Badge & Colors Logic (With Pending Support)
            const badge = document.getElementById("gStatusBadge");
            const dot = document.getElementById("gStatusDot");
            const text = document.getElementById("gStatusText");
            const banner = document.getElementById("gHeaderBanner");
            const avatarRing = document.getElementById("gAvatarRing");
            const approveWrapper = document.getElementById(
                "guardApproveWrapper",
            );

            if (u.lastAction.includes("Pending")) {
                text.innerText = "PENDING ACTION";
                badge.className =
                    "px-4 py-2 rounded-full backdrop-blur-md text-[11px] font-black tracking-widest uppercase border flex items-center gap-2 bg-amber-100/80 dark:bg-amber-900/80 border-amber-400 text-amber-600 dark:text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)]";
                dot.className =
                    "w-2.5 h-2.5 rounded-full bg-amber-500 dark:bg-amber-400 animate-pulse shadow-[0_0_8px_#fbbf24]";
                banner.className =
                    "h-[120px] md:h-[150px] bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900 dark:to-orange-900 relative flex justify-between items-start p-5 md:p-8 transition-colors duration-500 border-b border-amber-500/30";
                avatarRing.className =
                    "w-[110px] h-[110px] md:w-[140px] md:h-[140px] rounded-full border-[4px] border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.4)] bg-white dark:bg-slate-800 flex items-center justify-center z-10 overflow-hidden relative transition-colors duration-500";

                approveWrapper.classList.remove("hidden"); // Show Approve Button!
            } else if (
                u.lastAction === "Entry" ||
                u.lastAction === "Re-Entry"
            ) {
                text.innerText = "INSIDE CAMPUS";
                badge.className =
                    "px-4 py-2 rounded-full backdrop-blur-md text-[11px] font-black tracking-widest uppercase border flex items-center gap-2 bg-emerald-100/80 dark:bg-emerald-900/80 border-emerald-400 text-emerald-600 dark:text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]";
                dot.className =
                    "w-2.5 h-2.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]";
                banner.className =
                    "h-[120px] md:h-[150px] bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-900 relative flex justify-between items-start p-5 md:p-8 transition-colors duration-500 border-b border-emerald-500/30";
                avatarRing.className =
                    "w-[110px] h-[110px] md:w-[140px] md:h-[140px] rounded-full border-[4px] border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.4)] bg-white dark:bg-slate-800 flex items-center justify-center z-10 overflow-hidden relative transition-colors duration-500";
                approveWrapper.classList.add("hidden");
            } else if (u.lastAction === "Exit") {
                text.innerText = "OUTSIDE CAMPUS";
                badge.className =
                    "px-4 py-2 rounded-full backdrop-blur-md text-[11px] font-black tracking-widest uppercase border flex items-center gap-2 bg-rose-100/80 dark:bg-rose-900/80 border-rose-400 text-rose-600 dark:text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.4)]";
                dot.className =
                    "w-2.5 h-2.5 rounded-full bg-rose-500 dark:bg-rose-400 animate-pulse shadow-[0_0_8px_#fb7185]";
                banner.className =
                    "h-[120px] md:h-[150px] bg-gradient-to-r from-rose-100 to-red-100 dark:from-rose-900 dark:to-red-900 relative flex justify-between items-start p-5 md:p-8 transition-colors duration-500 border-b border-rose-500/30";
                avatarRing.className =
                    "w-[110px] h-[110px] md:w-[140px] md:h-[140px] rounded-full border-[4px] border-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.4)] bg-white dark:bg-slate-800 flex items-center justify-center z-10 overflow-hidden relative transition-colors duration-500";
                approveWrapper.classList.add("hidden");
            }

            // 4. Load Real Image or Fallback to Initials
            const profileImgEl = document.getElementById("gProfileImg");
            const initialsEl = document.getElementById("gInitials");

            if (u.img && u.img.includes("drive.google.com")) {
                const match = u.img.match(/[-\w]{25,}/);
                if (match && match[0]) {
                    profileImgEl.src =
                        "https://drive.google.com/thumbnail?id=" +
                        match[0] +
                        "&sz=w400";
                    profileImgEl.classList.remove("hidden");
                    initialsEl.classList.add("hidden");
                }
            } else {
                profileImgEl.classList.add("hidden");
                initialsEl.classList.remove("hidden");
                let initials = "ST";
                if (u.name) {
                    let parts = u.name.trim().split(" ");
                    initials =
                        parts.length >= 2
                            ? parts[0][0] + parts[1][0]
                            : parts[0].substring(0, 2);
                }
                initialsEl.innerText = initials.toUpperCase();
            }
        } else {
            showToast("PROFILE NOT FOUND IN DATABASE");
            btn.innerHTML = '<i class="fas fa-unlock mr-2"></i> UNLOCK PROFILE';
            btn.disabled = false;
        }
    } catch (e) {
        showToast("CONNECTION FAILED. CHECK INTERNET.");
        btn.innerHTML = '<i class="fas fa-unlock mr-2"></i> UNLOCK PROFILE';
        btn.disabled = false;
    }
}
async function approveGuestRecord() {
    const btn = document.getElementById("guardApproveBtn");
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> APPROVING...';
    btn.disabled = true;

    try {
        const res = await fetch(SCRIPT_URL, {
            method: "POST",
            body: JSON.stringify({
                action: "approve_guest",
                roll: scannedRoll,
            }),
        });
        const result = await res.json();
        if (result.success) {
            btn.innerHTML = '<i class="fas fa-check"></i> APPROVED';
            btn.classList.replace("from-amber-500", "from-emerald-500");
            btn.classList.replace("to-orange-500", "to-teal-500");
            setTimeout(() => {
                location.reload();
            }, 1000); // Reload to show green/red badge!
        } else {
            showToast("Failed to approve: " + result.error);
            btn.innerHTML =
                '<i class="fas fa-check-double"></i> APPROVE GUEST ACTION';
            btn.disabled = false;
        }
    } catch (e) {
        showToast("Network Error.");
        btn.innerHTML =
            '<i class="fas fa-check-double"></i> APPROVE GUEST ACTION';
        btn.disabled = false;
    }
}
