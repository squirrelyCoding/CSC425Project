function calcRio(revenue, investment) {
    if (investment === 0) {
        throw new Error("Investment cannot be zero.");
    }
    let profit = revenue - investment;
    let roi = (profit / investment) * 100;
    return roi.toFixed(2); // Return ROI as a percentage with 2 decimal places
}

let revenue = 324400;
let investment = 63000;

let swotAnalysis = {
    strengths: [
        "High target market demand",
        "High preliminary ROI",
        "Strong team expertise"
    ],
    weaknesses: [
        "Limited online presence",
        "High initial costs"
    ],
    opportunities: [
        "Expanding into new markets"
    ],
    threats: [
        "Intense competition"
    ]
};

let riskFactors = {
    financial: false,
    technical: false,
    market: true,
};

function checkRisks(riskFactors){
    let flags = Object.values(riskFactors).filter(v => v).length;
    return flags === 0 ? "Low Risk" : flags == 1 ? "Moderate Risk" : "High Risk";
}

function finalDecision(roi, riskLevel, swot) {
    if (roi > 50 && riskLevel === "Low Risk" && swot.strengths.length > swot.weaknesses.length) {
        return "Proceed with the project.";
    } else {
        return "Re-evaluate the project.";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const revenueInput = document.getElementById("revenue");
    const investmentInput = document.getElementById("investment");
    const calculateButton = document.getElementById("calculate");
    const roiOutput = document.getElementById("roi");
    const riskOutput = document.getElementById("risk");
    const decisionOutput = document.getElementById("decision");

    calculateButton.addEventListener("click", () => {
        const revenue = parseFloat(revenueInput.value);
        const investment = parseFloat(investmentInput.value);

        try {
            const roi = calcRio(revenue, investment);
            const riskLevel = checkRisks(riskFactors);
            const decision = finalDecision(roi, riskLevel, swotAnalysis);

            roiOutput.textContent = `ROI: ${roi}%`;
            riskOutput.textContent = `Risk Assessment: ${riskLevel}`;
            decisionOutput.textContent = `Decision: ${decision}`;
        } catch (error) {
            alert(error.message);
        }
    });
});

