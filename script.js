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

    const complaintType = document.getElementById("complaintType").value;
    const recipient = document.getElementById("recipient").value.trim();
    const problem = document.getElementById("problem").value.trim();
    const tone = document.getElementById("tone").value;

    if (!recipient || !problem) {
        alert("Please fill all the required fields.");
        return;
    }

    button.disabled = true;
    btnText.innerText = "Generating...";
    loader.style.display = "inline-block";

    output.value = "Generating complaint... Please wait.";

    try {

        const response = await fetch("/api/generate", {
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

        // Read response as text first
        const text = await response.text();

        let data;

        try {
            data = JSON.parse(text);
        } catch {
            throw new Error(text);
        }

        if (!response.ok) {
            throw new Error(data.error || "Unable to generate complaint.");
        }

        output.value = data.complaint;

    } catch (error) {

        console.error(error);

        output.value =
            "Error:\n\n" + error.message;

    } finally {

        button.disabled = false;
        btnText.innerText = "Generate Complaint";
        loader.style.display = "none";
    }

});

// ===========================================
// Copy Complaint
// ===========================================

copyBtn.addEventListener("click", async () => {

    if (!output.value.trim()) {
        alert("Please generate a complaint first.");
        return;
    }

    await navigator.clipboard.writeText(output.value);

    alert("Complaint copied successfully!");

});

// ===========================================
// Download PDF
// ===========================================

downloadBtn.addEventListener("click", () => {

    if (!output.value.trim()) {
        alert("Please generate a complaint first.");
        return;
    }

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    doc.setFont("Times");
    doc.setFontSize(12);

    const lines = doc.splitTextToSize(output.value, 180);

    doc.text(lines, 15, 20);

    doc.save("Complaint.pdf");

});
