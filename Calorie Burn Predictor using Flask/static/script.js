// ---------- animated ECG-style pulse line ----------
(function animatePulse() {
  const path = document.getElementById('pulsePath');
  const width = 1200;
  const midY = 60;
  let offset = 0;

  function buildPath(shift) {
    // flat baseline with a periodic heartbeat spike
    let d = `M0,${midY}`;
    const spikeEvery = 260;
    const points = [];
    for (let x = -spikeEvery; x <= width + spikeEvery; x += 6) {
      const localX = ((x + shift) % spikeEvery + spikeEvery) % spikeEvery;
      let y = midY;
      if (localX > 40 && localX < 90) {
        const t = (localX - 40) / 50;
        // small dip, sharp peak, small dip - classic ECG shape
        if (t < 0.25) y = midY + 6 * Math.sin(t / 0.25 * Math.PI);
        else if (t < 0.55) y = midY - 46 * Math.sin((t - 0.25) / 0.3 * Math.PI);
        else if (t < 0.8) y = midY + 14 * Math.sin((t - 0.55) / 0.25 * Math.PI);
        else y = midY;
      }
      points.push([x, y]);
    }
    return 'M' + points.map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' L');
  }

  function frame() {
    offset += 2.4;
    path.setAttribute('d', buildPath(offset));
    requestAnimationFrame(frame);
  }
  frame();
})();

// ---------- mode toggle ----------
const modeButtons = document.querySelectorAll('.mode-btn');
const heartRateFields = document.getElementById('heartRateFields');
const activityFields = document.getElementById('activityFields');
let currentMode = 'heart_rate';

modeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    modeButtons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    currentMode = btn.dataset.mode;
    if (currentMode === 'heart_rate') {
      heartRateFields.classList.remove('hidden');
      activityFields.classList.add('hidden');
    } else {
      heartRateFields.classList.add('hidden');
      activityFields.classList.remove('hidden');
    }
  });
});

// ---------- gender pill ----------
let selectedGender = 'male';
document.querySelectorAll('.pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    selectedGender = pill.dataset.gender;
  });
});

// ---------- form submission ----------
const form = document.getElementById('predictForm');
const errorMsg = document.getElementById('errorMsg');
const gaugeFill = document.getElementById('gaugeFill');
const calorieResult = document.getElementById('calorieResult');
const perMinute = document.getElementById('perMinute');
const methodLabel = document.getElementById('methodLabel');

const CIRCUMFERENCE = 2 * Math.PI * 92; // ~578
// scale reference: assume a strong session tops out around 700 kcal for a full ring
const MAX_CALORIES_FOR_FULL_RING = 700;

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorMsg.textContent = '';

  const payload = {
    mode: currentMode,
    weight: document.getElementById('weight').value,
    duration: document.getElementById('duration').value,
  };

  if (currentMode === 'heart_rate') {
    payload.age = document.getElementById('age').value;
    payload.heart_rate = document.getElementById('heart_rate').value;
    payload.gender = selectedGender;
  } else {
    payload.activity = document.getElementById('activity').value;
  }

  const submitBtn = form.querySelector('.submit-btn');
  submitBtn.disabled = true;

  try {
    const res = await fetch('/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) {
      errorMsg.textContent = data.error || 'Something went wrong.';
      submitBtn.disabled = false;
      return;
    }

    calorieResult.textContent = data.calories;
    perMinute.textContent = `${data.per_minute} kcal`;
    methodLabel.textContent = data.method;

    const ratio = Math.min(data.calories / MAX_CALORIES_FOR_FULL_RING, 1);
    const offset = CIRCUMFERENCE * (1 - ratio);
    gaugeFill.style.strokeDashoffset = offset;

  } catch (err) {
    errorMsg.textContent = '';
  } finally {
    submitBtn.disabled = false;
  }
});
