'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from './HealthCalculatorHub.module.css';

const HealthCalculatorHub = () => {
  const [activeTab, setActiveTab] = useState('bmi');
  const [saveAllowed, setSaveAllowed] = useState(false);
  const [history, setHistory] = useState({});

  // Load history from localStorage on mount
  useEffect(() => {
    const savedConsent = localStorage.getItem('health_calc_save_consent') === 'true';
    setSaveAllowed(savedConsent);
    if (savedConsent) {
      const savedHistory = JSON.parse(localStorage.getItem('health_calc_history') || '{}');
      setHistory(savedHistory);
    }
  }, []);

  const saveToHistory = (calcType, data) => {
    if (!saveAllowed) return;

    const newEntry = {
      ...data,
      id: Date.now(),
      date: new Date().toLocaleDateString(),
    };

    const updatedHistory = {
      ...history,
      [calcType]: [newEntry, ...(history[calcType] || [])].slice(0, 5),
    };

    setHistory(updatedHistory);
    localStorage.setItem('health_calc_history', JSON.stringify(updatedHistory));
  };

  const handleSaveConsent = () => {
    setSaveAllowed(true);
    localStorage.setItem('health_calc_save_consent', 'true');
  };

  const clearHistory = (calcType) => {
    const updatedHistory = { ...history };
    delete updatedHistory[calcType];
    setHistory(updatedHistory);
    localStorage.setItem('health_calc_history', JSON.stringify(updatedHistory));
  };

  const clearAllHistory = () => {
    setHistory({});
    localStorage.removeItem('health_calc_history');
  };

  // BMI Calculator
  const BmiCalculator = () => {
    const [unit, setUnit] = useState('metric');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('female');
    const [bmi, setBmi] = useState(null);
    const [bmiCategory, setBmiCategory] = useState('');
    const [bmiColor, setBmiColor] = useState('#a0aec0');
    const [showDisclaimer, setShowDisclaimer] = useState(false);

    useEffect(() => {
      if (!height || !weight) {
        setBmi(null);
        setBmiCategory('');
        setBmiColor('#a0aec0');
        return;
      }

      const h = parseFloat(height);
      const w = parseFloat(weight);

      if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) {
        setBmi(null);
        setBmiCategory('Invalid input');
        setBmiColor('#a0aec0');
        return;
      }

      let calculatedBmi;
      if (unit === 'metric') {
        calculatedBmi = w / Math.pow(h / 100, 2);
      } else {
        calculatedBmi = (w / Math.pow(h, 2)) * 703;
      }

      calculatedBmi = Math.round(calculatedBmi * 10) / 10;
      setBmi(calculatedBmi);

      if (calculatedBmi < 18.5) {
        setBmiCategory('Underweight');
        setBmiColor('#ed8936');
      } else if (calculatedBmi < 25) {
        setBmiCategory('Normal weight');
        setBmiColor('#38a169');
      } else if (calculatedBmi < 30) {
        setBmiCategory('Overweight');
        setBmiColor('#ecc94b');
      } else {
        setBmiCategory('Obese');
        setBmiColor('#e53e3e');
      }

      saveToHistory('bmi', {
        bmi: calculatedBmi,
        category: bmiCategory,
        height,
        weight,
        unit,
        age: age || 'N/A',
        gender,
      });
    }, [height, weight, unit, age, gender]);

    return (
      <div className={styles.calculatorContent}>
        <h2>BMI Calculator</h2>
        <p className={styles.subtitle}>Body Mass Index based on height and weight.</p>

        <div className={styles.unitToggle}>
          <button
            className={`${styles.unitBtn} ${unit === 'metric' ? styles.active : ''}`}
            onClick={() => setUnit('metric')}
          >
            Metric (kg, cm)
          </button>
          <button
            className={`${styles.unitBtn} ${unit === 'imperial' ? styles.active : ''}`}
            onClick={() => setUnit('imperial')}
          >
            Imperial (lbs, in)
          </button>
        </div>

        <div className={styles.inputGroup}>
          <label>Height ({unit === 'metric' ? 'cm' : 'inches'})</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder={unit === 'metric' ? 'e.g. 170' : 'e.g. 67'}
            min="1"
            step="0.1"
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Weight ({unit === 'metric' ? 'kg' : 'lbs'})</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder={unit === 'metric' ? 'e.g. 65' : 'e.g. 143'}
            min="1"
            step="0.1"
          />
        </div>

        <div className={styles.optionalSection}>
          <h3>Personalize (Optional)</h3>
          <div className={styles.inputRow}>
            <div className={styles.inputGroupHalf}>
              <label>Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 30"
                min="1"
                max="120"
              />
            </div>
            <div className={styles.inputGroupHalf}>
              <label>Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {bmi && (
          <>
            <div className={styles.resultSection}>
              <h3>Your BMI: {bmi}</h3>
              <div className={styles.categoryBadge} style={{ backgroundColor: bmiColor }}>
                {bmiCategory}
              </div>
              <div className={styles.bmiMeter}>
                <div
                  className={styles.meterFill}
                  style={{
                    width: `${Math.min((bmi / 40) * 100, 100)}%`,
                    backgroundColor: bmiColor,
                  }}
                ></div>
              </div>
              <div className={styles.meterScale}>
                <span>Under</span>
                <span>Normal</span>
                <span>Over</span>
                <span>Obese</span>
              </div>
            </div>

            <div className={styles.adviceSection}>
              <h4>Interpretation</h4>
              {bmiCategory === 'Underweight' && (
                <p>Consider nutritional consultation for healthy weight gain.</p>
              )}
              {bmiCategory === 'Normal weight' && (
                <p>Excellent! Maintain balanced diet and regular activity.</p>
              )}
              {bmiCategory === 'Overweight' && (
                <p>Consider lifestyle adjustments. Even 5-10% weight loss improves health.</p>
              )}
              {bmiCategory === 'Obese' && (
                <p>Consult healthcare provider. Focus on sustainable changes.</p>
              )}
            </div>
          </>
        )}

        <div className={styles.disclaimerSection}>
          <button className={styles.disclaimerToggle} onClick={() => setShowDisclaimer(!showDisclaimer)}>
            ℹ️ Formula & Limitations {showDisclaimer ? '▲' : '▼'}
          </button>
          {showDisclaimer && (
            <div className={styles.disclaimerContent}>
              <p>
                <strong>Formula:</strong> BMI = kg/m² or (lbs/in²) × 703
              </p>
              <p>
                <strong>Limitations:</strong> Does not measure body fat directly. Not diagnostic.
              </p>
            </div>
          )}
        </div>

        {saveAllowed && history.bmi?.length > 0 && (
          <div className={styles.historySection}>
            <div className={styles.historyHeader}>
              <h4>Recent Calculations</h4>
              <button className={styles.clearBtn} onClick={() => clearHistory('bmi')}>
                Clear
              </button>
            </div>
            <ul className={styles.historyList}>
              {history.bmi.map((entry) => (
                <li key={entry.id}>
                  {entry.bmi} ({entry.category}) on {entry.date}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  // VO2 Max Calculator
  const Vo2MaxCalculator = () => {
    const [testType, setTestType] = useState('rockport');
    const [distance, setDistance] = useState('');
    const [timeMin, setTimeMin] = useState('');
    const [timeSec, setTimeSec] = useState('');
    const [heartRate, setHeartRate] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('male');
    const [vo2max, setVo2max] = useState(null);
    const [showInfo, setShowInfo] = useState(false);

    useEffect(() => {
      if (testType === 'rockport') {
        if (!distance || !timeMin || !heartRate || !age) return;

        const d = parseFloat(distance);
        const t = parseFloat(timeMin) + parseFloat(timeSec || 0) / 60;
        const hr = parseFloat(heartRate);
        const a = parseFloat(age);

        if (isNaN(d) || isNaN(t) || isNaN(hr) || isNaN(a) || a < 1 || a > 120) return;

        const genderValue = gender === 'male' ? 1 : 0;
        const result = 132.853 - 0.3877 * a + 6.315 * genderValue - 3.2649 * t - 0.1565 * hr;

        setVo2max(Math.max(0, Math.round(result * 10) / 10));
      } else if (testType === 'cooper') {
        if (!distance || !age) return;

        const d = parseFloat(distance);
        const a = parseFloat(age);

        if (isNaN(d) || isNaN(a) || a < 1 || a > 120) return;

        const result = (d - 504.9) / 44.73;
        setVo2max(Math.max(0, Math.round(result * 10) / 10));
      }
    }, [testType, distance, timeMin, timeSec, heartRate, age, gender]);

    return (
      <div className={styles.calculatorContent}>
        <h2>VO2 Max Calculator</h2>
        <p className={styles.subtitle}>Estimate your maximal oxygen uptake.</p>

        <div className={styles.inputGroup}>
          <label>Test Type</label>
          <select value={testType} onChange={(e) => setTestType(e.target.value)}>
            <option value="rockport">Rockport Walk Test</option>
            <option value="cooper">Cooper 12-Minute Run Test</option>
          </select>
        </div>

        {testType === 'rockport' && (
          <>
            <div className={styles.inputGroup}>
              <label>Distance (miles)</label>
              <input
                type="number"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="e.g. 1"
                min="0.1"
                step="0.1"
              />
            </div>

            <div className={styles.inputRow}>
              <div className={styles.inputGroupHalf}>
                <label>Time (minutes)</label>
                <input
                  type="number"
                  value={timeMin}
                  onChange={(e) => setTimeMin(e.target.value)}
                  placeholder="e.g. 15"
                  min="1"
                  step="1"
                />
              </div>
              <div className={styles.inputGroupHalf}>
                <label>Time (seconds)</label>
                <input
                  type="number"
                  value={timeSec}
                  onChange={(e) => setTimeSec(e.target.value)}
                  placeholder="e.g. 30"
                  min="0"
                  max="59"
                  step="1"
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Heart Rate (end of test)</label>
              <input
                type="number"
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
                placeholder="e.g. 120"
                min="60"
                max="220"
                step="1"
              />
            </div>
          </>
        )}

        {testType === 'cooper' && (
          <div className={styles.inputGroup}>
            <label>Distance Covered (meters in 12 minutes)</label>
            <input
              type="number"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              placeholder="e.g. 2400"
              min="500"
              step="50"
            />
          </div>
        )}

        <div className={styles.inputRow}>
          <div className={styles.inputGroupHalf}>
            <label>Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g. 30"
              min="1"
              max="120"
            />
          </div>
          <div className={styles.inputGroupHalf}>
            <label>Gender</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>

        {vo2max !== null && (
          <div className={styles.resultSection}>
            <h3>Estimated VO2 Max: {vo2max} ml/kg/min</h3>
            <div className={styles.categoryBadge} style={{ backgroundColor: '#3182ce' }}>
              {vo2max < 30
                ? 'Poor'
                : vo2max < 40
                ? 'Fair'
                : vo2max < 50
                ? 'Good'
                : vo2max < 60
                ? 'Excellent'
                : 'Superior'}
            </div>
          </div>
        )}

        <button className={styles.disclaimerToggle} onClick={() => setShowInfo(!showInfo)}>
          ℹ️ About VO2 Max {showInfo ? '▲' : '▼'}
        </button>
        {showInfo && (
          <div className={styles.disclaimerContent}>
            <p>
              <strong>Rockport Test:</strong> Walk 1 mile as fast as possible, record time and heart rate.
            </p>
            <p>
              <strong>Cooper Test:</strong> Run as far as possible in 12 minutes.
            </p>
            <p>VO2 max measures cardiovascular fitness. Higher values indicate better aerobic capacity.</p>
          </div>
        )}
      </div>
    );
  };

  // One-Rep Max Calculator
  const OneRepMaxCalculator = () => {
    const [weight, setWeight] = useState('');
    const [reps, setReps] = useState('');
    const [formula, setFormula] = useState('epley');
    const [oneRepMax, setOneRepMax] = useState(null);
    const [showFormulaInfo, setShowFormulaInfo] = useState(false);

    useEffect(() => {
      if (!weight || !reps) return;

      const w = parseFloat(weight);
      const r = parseInt(reps, 10);

      if (isNaN(w) || isNaN(r) || r < 1 || r > 30) return;

      let orm;
      switch (formula) {
        case 'epley':
          orm = w * (1 + r / 30);
          break;
        case 'brzycki':
          orm = w * (36 / (37 - r));
          break;
        case 'lombardi':
          orm = w * Math.pow(r, 0.1);
          break;
        case 'mayhew':
          orm = (100 * w) / (52.2 + 41.9 * Math.exp(-0.055 * r));
          break;
        default:
          orm = w * (1 + r / 30);
      }

      setOneRepMax(Math.round(orm));
    }, [weight, reps, formula]);

    return (
      <div className={styles.calculatorContent}>
        <h2>One-Rep Max (1RM) Calculator</h2>
        <p className={styles.subtitle}>Estimate your one-rep maximum without testing to failure.</p>

        <div className={styles.inputGroup}>
          <label>Formula</label>
          <select value={formula} onChange={(e) => setFormula(e.target.value)}>
            <option value="epley">Epley (Most Popular)</option>
            <option value="brzycki">Brzycki</option>
            <option value="lombardi">Lombardi</option>
            <option value="mayhew">Mayhew</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label>Weight Lifted (kg/lbs)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="e.g. 100"
            min="10"
            step="1"
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Repetitions Completed</label>
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            placeholder="e.g. 5"
            min="1"
            max="30"
            step="1"
          />
        </div>

        {oneRepMax && (
          <div className={styles.resultSection}>
            <h3>Estimated 1RM: {oneRepMax} {weight.includes('.') ? 'lbs' : 'kg'}</h3>
            <p className={styles.resultNote}>
              This is an estimate. Actual 1RM may vary based on technique, fatigue, and experience.
            </p>
          </div>
        )}

        <button className={styles.disclaimerToggle} onClick={() => setShowFormulaInfo(!showFormulaInfo)}>
          ℹ️ Formula Info {showFormulaInfo ? '▲' : '▼'}
        </button>
        {showFormulaInfo && (
          <div className={styles.disclaimerContent}>
            <p>
              <strong>Epley:</strong> 1RM = weight × (1 + reps/30)
            </p>
            <p>
              <strong>Brzycki:</strong> 1RM = weight × 36/(37 - reps)
            </p>
            <p>
              <strong>Lombardi:</strong> 1RM = weight × reps^0.1
            </p>
            <p>
              <strong>Mayhew:</strong> 1RM = (100 × weight) / (52.2 + 41.9 × e^(-0.055 × reps))
            </p>
          </div>
        )}
      </div>
    );
  };

  // Body Fat Calculator
  const BodyFatCalculator = () => {
    const [unit, setUnit] = useState('metric');
    const [weight, setWeight] = useState('');
    const [waist, setWaist] = useState('');
    const [neck, setNeck] = useState('');
    const [hip, setHip] = useState('');
    const [gender, setGender] = useState('male');
    const [bodyFat, setBodyFat] = useState(null);
    const [showFormula, setShowFormula] = useState(false);

    useEffect(() => {
      if (!weight || !waist || !neck || (gender === 'female' && !hip)) return;

      const w = parseFloat(weight);
      const wa = parseFloat(waist);
      const n = parseFloat(neck);
      const h = gender === 'female' ? parseFloat(hip) : 0;

      if (isNaN(w) || isNaN(wa) || isNaN(n) || (gender === 'female' && isNaN(h))) return;

      let bodyFatPercentage;
      if (unit === 'metric') {
        if (gender === 'male') {
          bodyFatPercentage = 495 / (1.0324 - 0.19077 * Math.log10(wa - n) + 0.15456 * Math.log10(w)) - 450;
        } else {
          bodyFatPercentage = 495 / (1.29579 - 0.35004 * Math.log10(wa + h - n) + 0.22100 * Math.log10(w)) - 450;
        }
      } else {
        if (gender === 'male') {
          bodyFatPercentage = 86.010 * Math.log10(wa - n) - 70.041 * Math.log10(w) + 36.76;
        } else {
          bodyFatPercentage = 163.205 * Math.log10(wa + h - n) - 97.684 * Math.log10(w) - 78.387;
        }
      }

      setBodyFat(Math.max(0, Math.min(70, Math.round(bodyFatPercentage * 10) / 10)));
    }, [weight, waist, neck, hip, gender, unit]);

    return (
      <div className={styles.calculatorContent}>
        <h2>Body Fat Percentage Calculator</h2>
        <p className={styles.subtitle}>Estimate body fat using U.S. Navy method.</p>

        <div className={styles.unitToggle}>
          <button
            className={`${styles.unitBtn} ${unit === 'metric' ? styles.active : ''}`}
            onClick={() => setUnit('metric')}
          >
            Metric (cm, kg)
          </button>
          <button
            className={`${styles.unitBtn} ${unit === 'imperial' ? styles.active : ''}`}
            onClick={() => setUnit('imperial')}
          >
            Imperial (in, lbs)
          </button>
        </div>

        <div className={styles.inputGroup}>
          <label>Weight ({unit === 'metric' ? 'kg' : 'lbs'})</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder={unit === 'metric' ? 'e.g. 70' : 'e.g. 154'}
            min="1"
            step="0.1"
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Waist ({unit === 'metric' ? 'cm' : 'inches'})</label>
          <input
            type="number"
            value={waist}
            onChange={(e) => setWaist(e.target.value)}
            placeholder={unit === 'metric' ? 'e.g. 85' : 'e.g. 33.5'}
            min="1"
            step="0.1"
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Neck ({unit === 'metric' ? 'cm' : 'inches'})</label>
          <input
            type="number"
            value={neck}
            onChange={(e) => setNeck(e.target.value)}
            placeholder={unit === 'metric' ? 'e.g. 38' : 'e.g. 15'}
            min="1"
            step="0.1"
          />
        </div>

        {gender === 'female' && (
          <div className={styles.inputGroup}>
            <label>Hip ({unit === 'metric' ? 'cm' : 'inches'})</label>
            <input
              type="number"
              value={hip}
              onChange={(e) => setHip(e.target.value)}
              placeholder={unit === 'metric' ? 'e.g. 95' : 'e.g. 37.5'}
              min="1"
              step="0.1"
            />
          </div>
        )}

        <div className={styles.inputGroup}>
          <label>Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {bodyFat !== null && (
          <div className={styles.resultSection}>
            <h3>Body Fat: {bodyFat}%</h3>
            <div className={styles.categoryBadge} style={{ backgroundColor: '#3182ce' }}>
              {bodyFat < 6
                ? 'Essential Fat'
                : bodyFat < 14
                ? 'Athletes'
                : bodyFat < 18
                ? 'Fitness'
                : bodyFat < 25
                ? 'Average'
                : 'Overweight'}
            </div>
          </div>
        )}

        <button className={styles.disclaimerToggle} onClick={() => setShowFormula(!showFormula)}>
          ℹ️ How It Works {showFormula ? '▲' : '▼'}
        </button>
        {showFormula && (
          <div className={styles.disclaimerContent}>
            <p>Uses U.S. Navy circumference method.</p>
            <p>Accuracy: ±3% for most adults.</p>
          </div>
        )}
      </div>
    );
  };

  // BMR Calculator
  const BmrCalculator = () => {
    const [gender, setGender] = useState('male');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [age, setAge] = useState('');
    const [unit, setUnit] = useState('metric');
    const [bmr, setBmr] = useState(null);
    const [formula, setFormula] = useState('mifflin');

    useEffect(() => {
      if (!weight || !height || !age) return;

      const w = parseFloat(weight);
      const h = parseFloat(height);
      const a = parseInt(age, 10);

      if (isNaN(w) || isNaN(h) || isNaN(a) || a < 1 || a > 120) return;

      let calculatedBmr;
      if (formula === 'mifflin') {
        if (unit === 'metric') {
          calculatedBmr =
            gender === 'male'
              ? 10 * w + 6.25 * h - 5 * a + 5
              : 10 * w + 6.25 * h - 5 * a - 161;
        } else {
          const wKg = w * 0.453592;
          const hCm = h * 2.54;
          calculatedBmr =
            gender === 'male'
              ? 10 * wKg + 6.25 * hCm - 5 * a + 5
              : 10 * wKg + 6.25 * hCm - 5 * a - 161;
        }
      } else {
        if (unit === 'metric') {
          calculatedBmr =
            gender === 'male'
              ? 88.362 + 13.397 * w + 4.799 * h - 5.677 * a
              : 447.593 + 9.247 * w + 3.098 * h - 4.33 * a;
        } else {
          const wKg = w * 0.453592;
          const hCm = h * 2.54;
          calculatedBmr =
            gender === 'male'
              ? 88.362 + 13.397 * wKg + 4.799 * hCm - 5.677 * a
              : 447.593 + 9.247 * wKg + 3.098 * hCm - 4.33 * a;
        }
      }

      setBmr(Math.round(calculatedBmr));
    }, [weight, height, age, gender, unit, formula]);

    return (
      <div className={styles.calculatorContent}>
        <h2>Basal Metabolic Rate (BMR)</h2>
        <p className={styles.subtitle}>Calories your body needs at complete rest.</p>

        <div className={styles.inputGroup}>
          <label>Formula</label>
          <select value={formula} onChange={(e) => setFormula(e.target.value)}>
            <option value="mifflin">Mifflin-St Jeor (Recommended)</option>
            <option value="harris">Harris-Benedict (Older)</option>
          </select>
        </div>

        <div className={styles.unitToggle}>
          <button
            className={`${styles.unitBtn} ${unit === 'metric' ? styles.active : ''}`}
            onClick={() => setUnit('metric')}
          >
            Metric (kg, cm)
          </button>
          <button
            className={`${styles.unitBtn} ${unit === 'imperial' ? styles.active : ''}`}
            onClick={() => setUnit('imperial')}
          >
            Imperial (lbs, in)
          </button>
        </div>

        <div className={styles.inputGroup}>
          <label>Weight ({unit === 'metric' ? 'kg' : 'lbs'})</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder={unit === 'metric' ? 'e.g. 70' : 'e.g. 154'}
            min="1"
            step="0.1"
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Height ({unit === 'metric' ? 'cm' : 'inches'})</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder={unit === 'metric' ? 'e.g. 175' : 'e.g. 69'}
            min="1"
            step="0.1"
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Age</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="e.g. 30"
            min="1"
            max="120"
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {bmr && (
          <div className={styles.resultSection}>
            <h3>BMR: {bmr} calories/day</h3>
            <p className={styles.resultNote}>
              This is calories needed for basic bodily functions at complete rest.
            </p>
          </div>
        )}
      </div>
    );
  };

  // Calculators configuration
  const calculators = {
    bmi: { component: BmiCalculator, label: 'BMI' },
    bodyFat: { component: BodyFatCalculator, label: 'Body Fat %' },
    bmr: { component: BmrCalculator, label: 'BMR' },
    vo2max: { component: Vo2MaxCalculator, label: 'VO2 Max' },
    oneRepMax: { component: OneRepMaxCalculator, label: '1RM' },
  };

  const CalculatorTabs = () => (
    <div className={styles.calculatorTabs}>
      {Object.entries(calculators).map(([key, { label }]) => (
        <button
          key={key}
          className={`${styles.tabBtn} ${activeTab === key ? styles.active : ''}`}
          onClick={() => setActiveTab(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );

  const ActiveCalculator = () => {
    const CalculatorComponent = calculators[activeTab]?.component;
    return CalculatorComponent ? <CalculatorComponent /> : <div>Select a calculator</div>;
  };

  return (
    <>
      <Head>
        <title>Health Calculators Hub | BMI, Body Fat, BMR, VO2 Max & More</title>
        <meta
          name="description"
          content="Free health calculators: BMI, body fat percentage, BMR, VO2 Max, one-rep max. Private, no sign-up required. All calculations happen in your browser."
        />
        <meta
          name="keywords"
          content="BMI calculator, body fat calculator, BMR calculator, VO2 max calculator, one-rep max, health calculators, fitness calculators"
        />
        <meta name="author" content="BMICalculatorAndMore" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.bmicalculatorandmore.com/calculators" />

        <meta property="og:title" content="Health Calculators Hub | Free Fitness & Health Tools" />
        <meta
          property="og:description"
          content="Complete suite of free health calculators: BMI, body fat, BMR, VO2 Max, and more. 100% private and secure."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.bmicalculatorandmore.com/calculators" />
        <meta property="og:image" content="https://www.bmicalculatorandmore.com/images/og-calculators.jpg" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Health Calculators Hub" />
        <meta
          name="twitter:description"
          content="BMI, body fat, BMR, VO2 Max calculators - all free and private."
        />
        <meta name="twitter:image" content="https://www.bmicalculatorandmore.com/images/og-calculators.jpg" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Health Calculators Hub",
              "url": "https://www.bmicalculatorandmore.com/calculators",
              "description": "Collection of free health and fitness calculators including BMI, body fat percentage, BMR, VO2 Max, and one-rep max calculators.",
              "applicationCategory": "HealthApplication",
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "featureList": [
                "BMI Calculator",
                "Body Fat Percentage Calculator", 
                "BMR Calculator",
                "VO2 Max Calculator",
                "One-Rep Max Calculator"
              ]
            })
          }}
        />
      </Head>

      <main className={styles.healthCalculatorPage}>
        <div className={styles.calculatorContainer}>
          <div className={styles.calculatorHeader}>
            <h1>Health & Fitness Calculators</h1>
            <p>Free, private, no sign-up required. All calculations happen in your browser.</p>
          </div>

          <CalculatorTabs />
          <div className={styles.calculatorWrapper}>
            <ActiveCalculator />
          </div>

          {!saveAllowed && (
            <div className={styles.saveNotice}>
              <p>
                <strong>Want to save your calculation history locally?</strong> We never store data on servers.
              </p>
              <button className={styles.saveBtn} onClick={handleSaveConsent}>
                Allow Local Saving
              </button>
            </div>
          )}

          {saveAllowed && Object.keys(history).length > 0 && (
            <div className={`${styles.historySection} ${styles.global}`}>
              <div className={styles.historyHeader}>
                <h3>Calculation History (Local Only)</h3>
                <button className={styles.clearBtn} onClick={clearAllHistory}>
                  Clear All
                </button>
              </div>
              {Object.entries(history).map(([calcType, entries]) => (
                <div key={calcType} className={styles.historySubsection}>
                  <h4>{calculators[calcType]?.label || calcType}</h4>
                  <ul className={styles.historyList}>
                    {entries.map((entry) => (
                      <li key={entry.id}>
                        {Object.entries(entry)
                          .filter(([key]) => key !== 'id' && key !== 'date')
                          .map(([key, value]) => `${key}: ${value}`)
                          .join(', ')} on {entry.date}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default HealthCalculatorHub;