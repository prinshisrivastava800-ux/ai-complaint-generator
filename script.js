// ===========================================
// AI Complaint Generator Frontend
// ===========================================

// Elements
const button = document.getElementById("generateBtn");
const output = document.getElementById("output");

const btnText = document.getElementById("btnText");
const loader = document.getElementById("loader");

const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");

// ===========================================
// Generate Complaint
// ===========================================

button.addEventListener("click", async () => {

    // Read Inputs
    const complaintType = document.getElementById("complaintType").value;
    const recipient = document.getElementById("recipient").value.trim();
    const problem = document.getElementById("problem").value.trim();
    const tone = document.getElementById("tone").value;

    // Validation
    if (!recipient || !problem) {

        alert("Please fill all the required fields.");

        return;

    }

    // Start Loading

    button.disabled = true;
    button.classList.add("loading");

    btnText.innerText = "Generating...";
    loader.style.display = "inline-block";

    output.value = "Generating complaint... Please wait.";

    try {

        const response = await fetch("/generate", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                complaintType,
                recipient,
                problem,
                tone

            })

        });

        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.error || "Unable to generate complaint.");

        }

        output.value = data.complaint;

    }

    catch (error) {

        console.error(error);

        output.value =
            "Unable to generate complaint.\n\nPlease check your internet connection or try again.";

    }

    finally {

        // Stop Loading

        button.disabled = false;
        button.classList.remove("loading");

        btnText.innerText = "Generate Complaint";

        loader.style.display = "none";

    }

});

// ===========================================
// Copy Complaint
// ===========================================

copyBtn.addEventListener("click", async () => {

    const complaint = output.value.trim();

    if (!complaint) {

        alert("Please generate a complaint first.");

        return;

    }

    try {

        await navigator.clipboard.writeText(complaint);

        alert("Complaint copied successfully!");

    }

    catch (error) {

        alert("Unable to copy complaint.");

    }

});

// ===========================================
// Download PDF
// ===========================================

downloadBtn.addEventListener("click", () => {

    const complaint = output.value.trim();

    if (!complaint) {

        alert("Please generate a complaint first.");

        return;

    }

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    doc.setFont("Times", "Normal");

    doc.setFontSize(12);

    const lines = doc.splitTextToSize(complaint, 180);

    doc.text(lines, 15, 20);

    doc.save("Complaint.pdf");

});