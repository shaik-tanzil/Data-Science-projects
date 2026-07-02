from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# MET (Metabolic Equivalent of Task) values for common activities.
# Source: Compendium of Physical Activities (widely used reference values).
ACTIVITY_MET = {
    "walking_slow":      2.8,
    "walking_brisk":     4.3,
    "running_6mph":      9.8,
    "running_8mph":     11.8,
    "cycling_moderate":  7.5,
    "cycling_vigorous": 10.0,
    "swimming":          6.0,
    "weight_training":   5.0,
    "yoga":              2.5,
    "hiit":             10.0,
    "dancing":           5.5,
    "elliptical":        5.0,
    "jump_rope":        11.0,
    "basketball":        8.0,
    "rowing":            7.0,
}

ACTIVITY_LABELS = {
    "walking_slow": "Walking (leisurely)",
    "walking_brisk": "Walking (brisk)",
    "running_6mph": "Running (6 mph)",
    "running_8mph": "Running (8 mph)",
    "cycling_moderate": "Cycling (moderate)",
    "cycling_vigorous": "Cycling (vigorous)",
    "swimming": "Swimming",
    "weight_training": "Weight training",
    "yoga": "Yoga",
    "hiit": "HIIT",
    "dancing": "Dancing",
    "elliptical": "Elliptical",
    "jump_rope": "Jump rope",
    "basketball": "Basketball",
    "rowing": "Rowing",
}


def calories_from_heart_rate(gender, age, weight_kg, heart_rate, duration_min):
    """
    Estimate calories burned using heart-rate based regression
    (Keytel et al., 2005). Weight in kg, duration in minutes.
    """
    if gender == "male":
        cal_per_min = (
            -55.0969
            + (0.6309 * heart_rate)
            + (0.1988 * weight_kg)
            + (0.2017 * age)
        ) / 4.184
    else:
        cal_per_min = (
            -20.4022
            + (0.4472 * heart_rate)
            - (0.1263 * weight_kg)
            + (0.074 * age)
        ) / 4.184

    total = cal_per_min * duration_min
    return max(total, 0)


def calories_from_activity(activity, weight_kg, duration_min):
    """
    Estimate calories burned using MET formula:
    Calories = MET x weight(kg) x 3.5 / 200 x duration(min)
    """
    met = ACTIVITY_MET.get(activity)
    if met is None:
        raise ValueError("Unknown activity")
    return met * weight_kg * 3.5 / 200 * duration_min


@app.route("/")
def index():
    return render_template("index.html", activities=ACTIVITY_LABELS)


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(force=True)
    mode = data.get("mode")

    try:
        weight_kg = float(data.get("weight"))
        duration_min = float(data.get("duration"))
    except (TypeError, ValueError):
        return jsonify({"error": "Weight and duration must be numbers."}), 400

    if weight_kg <= 0 or duration_min <= 0:
        return jsonify({"error": "Weight and duration must be positive."}), 400

    if mode == "heart_rate":
        try:
            age = float(data.get("age"))
            heart_rate = float(data.get("heart_rate"))
        except (TypeError, ValueError):
            return jsonify({"error": "Age and heart rate must be numbers."}), 400

        gender = data.get("gender", "male")
        if gender not in ("male", "female"):
            gender = "male"

        if age <= 0 or heart_rate <= 0:
            return jsonify({"error": "Age and heart rate must be positive."}), 400

        calories = calories_from_heart_rate(
            gender, age, weight_kg, heart_rate, duration_min
        )
        method = "Heart-rate based method"

    elif mode == "activity":
        activity = data.get("activity")
        if activity not in ACTIVITY_MET:
            return jsonify({"error": "Please choose a valid activity."}), 400

        calories = calories_from_activity(activity, weight_kg, duration_min)
        method = f"Activity based ({ACTIVITY_LABELS[activity]}, MET formula)"

    else:
        return jsonify({"error": "Invalid prediction mode."}), 400

    return jsonify(
        {
            "calories": round(calories, 1),
            "per_minute": round(calories / duration_min, 2),
            "method": method,
        }
    )


if __name__ == "__main__":
    app.run(debug=True)
