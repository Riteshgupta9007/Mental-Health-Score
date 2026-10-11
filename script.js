
const API_URL = "http://127.0.0.1:8000/predict";

const form = document.getElementById("predictionForm");
const predictBtn = document.getElementById("predictBtn");
const buttonText = document.getElementById("buttonText");
const errorMessage = document.getElementById("errorMessage");
const resultCard = document.getElementById("resultCard");
const scoreValue = document.getElementById("scoreValue");
const resultDescription = document.getElementById("resultDescription");
const resetBtn = document.getElementById("resetBtn");

function getValue(id) {
  return document.getElementById(id).value;
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.hidden = false;
}

function hideError() {
  errorMessage.textContent = "";
  errorMessage.hidden = true;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  hideError();
  resultCard.hidden = true;

  if (!form.reportValidity()) {
    return;
  }

  const data = {
    age: Number(getValue("age")),
    gender: getValue("gender"),
    country: getValue("country"),
    academic_level: getValue("academic_level"),
    most_used_platform: getValue("most_used_platform"),
    purpose_of_use: getValue("purpose_of_use"),
    avg_daily_usage_hours: Number(
      getValue("avg_daily_usage_hours")
    ),
    daily_unlocks: Number(getValue("daily_unlocks")),
    study_hours: Number(getValue("study_hours")),
    physical_activity_hours: Number(
      getValue("physical_activity_hours")
    ),
    sleep_hours_per_night: Number(
      getValue("sleep_hours_per_night")
    ),
    stress_level: getValue("stress_level")
  };

  predictBtn.disabled = true;
  buttonText.textContent = "Predicting...";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      const detail = result.detail;

      if (Array.isArray(detail)) {
        throw new Error(
          detail.map((item) => item.msg).join(", ")
        );
      }

      throw new Error(
        typeof detail === "string"
          ? detail
          : "Unable to generate prediction."
      );
    }

    const score = Number(
      result.predicted_mental_health_score
    );

    if (!Number.isFinite(score)) {
      throw new Error("The API returned an invalid score.");
    }

    scoreValue.textContent = score.toFixed(2);

    resultDescription.textContent =
      "Your model's predicted mental health score is " +
      score.toFixed(2) + ".";

    resultCard.hidden = false;

    resultCard.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

  } catch (error) {
    if (error instanceof TypeError) {
      showError(
        "Could not connect to the API. Make sure FastAPI is " +
        "running at http://127.0.0.1:8000 and check your backend."
      );
    } else {
      showError(error.message);
    }
  } finally {
    predictBtn.disabled = false;
    buttonText.textContent = "Predict Mental Health Score";
  }
});

resetBtn.addEventListener("click", () => {
  form.reset();
  hideError();
  resultCard.hidden = true;

  form.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});