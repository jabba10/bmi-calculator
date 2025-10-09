'use client';
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import {
  LineChart, Line, BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { Download, Info, TrendingUp, Scale, Activity, Target } from 'lucide-react';
import styles from './HealthCalculatorHub.module.css';

const HealthCalculatorHub = () => {
  const [activeTab, setActiveTab] = useState('bmi');
  const [saveAllowed, setSaveAllowed] = useState(false);
  const [history, setHistory] = useState({});
  const chartRef = useRef(null);

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
      timestamp: Date.now()
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

  // BMI Visualization Components
  const BMIVisualizations = ({ bmi, height, weight, unit, history }) => {
    if (!bmi) return null;

    // BMI Gauge Data
    const bmiGaugeData = [
      { name: 'Underweight', value: 18.5, color: '#63b3ed' },
      { name: 'Normal', value: 6.5, color: '#48bb78' },
      { name: 'Overweight', value: 5, color: '#ed8936' },
      { name: 'Obese', value: 10, color: '#e53e3e' }
    ];

    // BMI Category Bar Chart Data
    const bmiCategories = [
      { category: 'Underweight', range: '<18.5', value: 18.5, color: '#63b3ed' },
      { category: 'Normal', range: '18.5-24.9', value: 24.9, color: '#48bb78' },
      { category: 'Overweight', range: '25-29.9', value: 29.9, color: '#ed8936' },
      { category: 'Obese', range: '30+', value: 40, color: '#e53e3e' }
    ];

    // BMI Trend Data
    const bmiTrendData = history?.bmi?.slice().reverse().map((entry, index) => ({
      week: `Week ${index + 1}`,
      bmi: entry.bmi,
      date: entry.date
    })) || [];

    // Weight vs Height Scatter Data
    const heightInMeters = unit === 'metric' ? height / 100 : height * 0.0254;
    const weightInKg = unit === 'metric' ? weight : weight * 0.453592;
    
    const scatterData = [
      { height: heightInMeters, weight: weightInKg, bmi: bmi, type: 'You' },
      { height: 1.6, weight: 50, bmi: 19.5, type: 'Average' },
      { height: 1.7, weight: 65, bmi: 22.5, type: 'Average' },
      { height: 1.8, weight: 75, bmi: 23.1, type: 'Average' },
      { height: 1.65, weight: 58, bmi: 21.3, type: 'Average' }
    ];

    // Healthy Weight Range Data
    const minHealthyWeight = 18.5 * Math.pow(heightInMeters, 2);
    const maxHealthyWeight = 24.9 * Math.pow(heightInMeters, 2);
    const healthyWeightData = [
      { height: heightInMeters - 0.1, min: minHealthyWeight - 5, max: maxHealthyWeight - 5 },
      { height: heightInMeters, min: minHealthyWeight, max: maxHealthyWeight },
      { height: heightInMeters + 0.1, min: minHealthyWeight + 5, max: maxHealthyWeight + 5 }
    ];

    // Body Composition Data
    const bodyCompositionData = [
      { name: 'Muscle Mass', value: 40, color: '#4299e1' },
      { name: 'Body Fat', value: Math.min(30, Math.max(10, (bmi - 20) * 2)), color: '#e53e3e' },
      { name: 'Bone Density', value: 15, color: '#48bb78' },
      { name: 'Water', value: 25, color: '#3182ce' }
    ];

    const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        return (
          <div className={styles.customTooltip}>
            <p>{`${label}`}</p>
            {payload.map((entry, index) => (
              <p key={index} style={{ color: entry.color }}>
                {`${entry.name}: ${entry.value}`}
              </p>
            ))}
          </div>
        );
      }
      return null;
    };

    const downloadReport = () => {
      const reportContent = `
BMI Report
Generated on: ${new Date().toLocaleDateString()}

Personal Information:
- Height: ${height} ${unit === 'metric' ? 'cm' : 'inches'}
- Weight: ${weight} ${unit === 'metric' ? 'kg' : 'lbs'}
- BMI: ${bmi}
- Category: ${bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal weight' : bmi < 30 ? 'Overweight' : 'Obese'}

Healthy Weight Range for your height:
- Minimum: ${minHealthyWeight.toFixed(1)} kg
- Maximum: ${maxHealthyWeight.toFixed(1)} kg

Recommendations:
${bmi < 18.5 ? '- Consider nutritional consultation for healthy weight gain' : 
  bmi < 25 ? '- Excellent! Maintain balanced diet and regular activity' :
  bmi < 30 ? '- Consider lifestyle adjustments. Even 5-10% weight loss improves health' :
  '- Consult healthcare provider. Focus on sustainable changes'}
      `.trim();

      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bmi-report-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };

    return (
      <div className={styles.visualizationSection}>
        <div className={styles.visualizationHeader}>
          <h3>BMI Visualizations</h3>
          <button className={styles.downloadBtn} onClick={downloadReport}>
            <Download size={16} />
            Download Report
          </button>
        </div>

        <div className={styles.chartGrid}>
          {/* BMI Gauge */}
          <div className={styles.chartContainer}>
            <div className={styles.chartHeader}>
              <Scale size={18} />
              <h4>BMI Gauge</h4>
              <div className={styles.tooltipWrapper}>
                <Info size={14} />
                <div className={styles.tooltip}>
                  Shows your BMI position on the health scale with color-coded zones
                </div>
              </div>
            </div>
            <div className={styles.gaugeContainer}>
              <div className={styles.gauge}>
                <div 
                  className={styles.gaugeNeedle}
                  style={{ 
                    transform: `rotate(${((bmi / 40) * 180) - 90}deg)`,
                    backgroundColor: bmi < 18.5 ? '#63b3ed' : bmi < 25 ? '#48bb78' : bmi < 30 ? '#ed8936' : '#e53e3e'
                  }}
                ></div>
                <div className={styles.gaugeLabels}>
                  <span>Underweight</span>
                  <span>Normal</span>
                  <span>Overweight</span>
                  <span>Obese</span>
                </div>
              </div>
              <div className={styles.gaugeValue}>
                <span className={styles.gaugeNumber}>{bmi}</span>
                <span className={styles.gaugeCategory}>
                  {bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese'}
                </span>
              </div>
            </div>
          </div>

          {/* BMI Category Bar Chart */}
          <div className={styles.chartContainer}>
            <div className={styles.chartHeader}>
              <Activity size={18} />
              <h4>BMI Categories</h4>
              <div className={styles.tooltipWrapper}>
                <Info size={14} />
                <div className={styles.tooltip}>
                  Compares your BMI across different health categories
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={bmiCategories}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="value" 
                  fill="#8884d8"
                  background={{ fill: '#f0f0f0' }}
                >
                  {bmiCategories.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      opacity={bmi >= (index === 0 ? 0 : bmiCategories[index-1].value) && bmi <= entry.value ? 1 : 0.6}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* BMI Trend Line */}
          {bmiTrendData.length > 1 && (
            <div className={styles.chartContainer}>
              <div className={styles.chartHeader}>
                <TrendingUp size={18} />
                <h4>BMI Trend</h4>
                <div className={styles.tooltipWrapper}>
                  <Info size={14} />
                  <div className={styles.tooltip}>
                    Tracks your BMI changes over time
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={bmiTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="bmi" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Weight vs Height Scatter Plot */}
          <div className={styles.chartContainer}>
            <div className={styles.chartHeader}>
              <Target size={18} />
              <h4>Weight vs Height</h4>
              <div className={styles.tooltipWrapper}>
                <Info size={14} />
                <div className={styles.tooltip}>
                  Shows relationship between weight and height with BMI contours
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <ScatterChart data={scatterData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="height" name="Height" unit="m" />
                <YAxis dataKey="weight" name="Weight" unit="kg" />
                <Tooltip content={<CustomTooltip />} />
                <Scatter dataKey="bmi" fill="#8884d8">
                  {scatterData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.type === 'You' ? '#e53e3e' : '#63b3ed'}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Healthy Weight Range */}
          <div className={styles.chartContainer}>
            <div className={styles.chartHeader}>
              <Scale size={18} />
              <h4>Healthy Weight Range</h4>
              <div className={styles.tooltipWrapper}>
                <Info size={14} />
                <div className={styles.tooltip}>
                  Shows healthy weight range for your height
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={healthyWeightData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="height" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  dataKey="max" 
                  stackId="1" 
                  stroke="#48bb78" 
                  fill="#48bb78" 
                  fillOpacity={0.6}
                  name="Max Healthy"
                />
                <Area 
                  dataKey="min" 
                  stackId="1" 
                  stroke="#63b3ed" 
                  fill="#63b3ed" 
                  fillOpacity={0.6}
                  name="Min Healthy"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Body Composition */}
          <div className={styles.chartContainer}>
            <div className={styles.chartHeader}>
              <Activity size={18} />
              <h4>Body Composition</h4>
              <div className={styles.tooltipWrapper}>
                <Info size={14} />
                <div className={styles.tooltip}>
                  Estimated body composition breakdown
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={bodyCompositionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {bodyCompositionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
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
        setBmiColor('#63b3ed');
      } else if (calculatedBmi < 25) {
        setBmiCategory('Normal weight');
        setBmiColor('#48bb78');
      } else if (calculatedBmi < 30) {
        setBmiCategory('Overweight');
        setBmiColor('#ed8936');
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

            <BMIVisualizations 
              bmi={bmi} 
              height={height} 
              weight={weight} 
              unit={unit}
              history={history}
            />

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
        <meta name="author" content="InstantBMI" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.instantbmi.com/calculators" />

        <meta property="og:title" content="Health Calculators Hub | Free Fitness & Health Tools" />
        <meta
          property="og:description"
          content="Complete suite of free health calculators: BMI, body fat, BMR, VO2 Max, and more. 100% private and secure."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.instantbmi.com/calculators" />
        <meta property="og:image" content="https://www.instantbmi.com/images/og-calculators.jpg" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Health Calculators Hub" />
        <meta
          name="twitter:description"
          content="BMI, body fat, BMR, VO2 Max calculators - all free and private."
        />
        <meta name="twitter:image" content="https://www.instantbmi.com/images/og-calculators.jpg" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Health Calculators Hub",
              "url": "https://www.instantbmi.com/calculators",
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