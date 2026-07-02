
# 🔥 Calorie Burn Predictor

A web-based end-to-end Machine Learning application that predicts the number of calories burned during physical activity based on user metrics like heart rate, body temperature, duration, age, and gender. Built with **Python**, trained using robust regression algorithms, and deployed via a responsive **Flask** web interface.

---

## 🚀 Key Features
- **Real-Time Predictions:** Instantaneous inference engine computing calorie burn based on user session data.
- **Data-Driven Insights:** Uses key physiological indicators (e.g., heart rate, body temperature) optimized through rigorous feature analysis.
- **Clean UI/UX:** Accessible web form designed for seamless data input and clear result rendering.
- **Robust Pipeline:** End-to-end workflow covering data preprocessing, model evaluation, serialization, and deployment.

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** HTML5, CSS3, Bootstrap (or your chosen styling framework)
- **Backend:** Flask (Python web framework)
- **Machine Learning:** Scikit-Learn, Pandas, NumPy
- **Visualizations & Analysis:** Matplotlib, Seaborn
- **Model Deployment:** Joblib / Pickle

---

## 📊 Dataset & Machine Learning Pipeline

The project utilizes comprehensive exercise datasets containing demographic and physiological tracking data. 

### 1. Feature Engineering & Preprocessing
- **Categorical Encoding:** One-Hot Encoding applied to categorical fields like `Gender`.
- **Feature Selection:** Correlation matrices analyzed to identify top predictors (e.g., high correlation between `Duration`, `Heart_Rate`, and `Calorie Burn`).

### 2. Model Training & Evaluation
Multiple regression techniques were cross-evaluated to minimize predictive error:
- Linear Regression
- Decision Tree Regressor
- **Random Forest Regressor** (or insert your best-performing model here)

*Metrics Achieved:*
- **R² Score:** `0.XX` *(Tip: Replace with your actual model score, e.g., 0.98)*
- **Mean Absolute Error (MAE):** `X.XX`

---

## 📂 Project Structure

```text
├── templates/
│   └── index.html          # Web interface dashboard
├── static/
│   └── style.css       # Custom UI styling
|   └── script.js        # Javascript File
└── app.py                  # Flask application core logic

```

## 📷 Screenshots
<img width="1891" height="847" alt="Screenshot 2026-07-02 192853" src="https://github.com/user-attachments/assets/9eebf314-087a-48fd-bba4-27c5b6639754" />


<br>

</br>
<img width="1907" height="856" alt="Screenshot 2026-07-02 192927" src="https://github.com/user-attachments/assets/10a4199f-53c1-401b-a828-073c062dbf14" />





