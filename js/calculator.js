/* Yes Realty — Area Calculator */

(() => {
  // Conversion factors to square feet (the common base unit)
  const TO_SQFT = {
    sqft: 1,
    sqm: 10.7639,
    sqyd: 9,          // 1 sq yard = 9 sq ft
    acre: 43560,      // 1 acre = 43560 sq ft
    vigha: 19360,     // 1 Gujarat vigha = 17424 sq ft (varies regionally) — using common Ahmedabad approx
    hectare: 107639,
    bigha: 17424
  };
  // Use Ahmedabad / Gujarat vigha convention (1 vigha ≈ 17,424 sq ft)
  TO_SQFT.vigha = 17424;

  const UNIT_LABELS = {
    sqft: 'Square Feet',
    sqm: 'Square Meter',
    sqyd: 'Square Yard',
    acre: 'Acre',
    vigha: 'Vigha',
    hectare: 'Hectare',
    bigha: 'Bigha'
  };

  // Predefined tabs for common Ahmedabad conversions
  const TABS = [
    { id: 'acre-sqft',  from: 'acre',  to: 'sqft',  label: 'Acre ↔ Sq Ft' },
    { id: 'vigha-sqft', from: 'vigha', to: 'sqft',  label: 'Vigha ↔ Sq Ft' },
    { id: 'sqft-sqm',   from: 'sqft',  to: 'sqm',   label: 'Sq Ft ↔ Sq Meter' },
    { id: 'sqyd-sqft',  from: 'sqyd',  to: 'sqft',  label: 'Sq Yard ↔ Sq Ft' },
    { id: 'acre-vigha', from: 'acre',  to: 'vigha', label: 'Acre ↔ Vigha' }
  ];

  const tabsEl = document.querySelector('.calc-tabs');
  const fromInput = document.getElementById('calc-from');
  const toInput = document.getElementById('calc-to');
  const fromLabel = document.getElementById('calc-from-label');
  const toLabel = document.getElementById('calc-to-label');
  const swapBtn = document.querySelector('.calc-swap');
  const noteEl = document.querySelector('.calc-note');

  if (!tabsEl || !fromInput || !toInput) return;

  let state = { from: 'acre', to: 'sqft' };

  // Build tabs
  TABS.forEach((t, i) => {
    const btn = document.createElement('button');
    btn.className = 'calc-tab' + (i === 0 ? ' active' : '');
    btn.textContent = t.label;
    btn.dataset.from = t.from;
    btn.dataset.to = t.to;
    btn.addEventListener('click', () => {
      tabsEl.querySelectorAll('.calc-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state = { from: t.from, to: t.to };
      applyLabels();
      convert('from');
    });
    tabsEl.appendChild(btn);
  });

  function applyLabels() {
    fromLabel.textContent = UNIT_LABELS[state.from];
    toLabel.textContent = UNIT_LABELS[state.to];
    if (noteEl) {
      const one = (TO_SQFT[state.from] / TO_SQFT[state.to]);
      noteEl.innerHTML = `<strong>Quick reference:</strong> 1 ${UNIT_LABELS[state.from]} = ${formatNum(one)} ${UNIT_LABELS[state.to]}`;
    }
  }

  function formatNum(n) {
    if (!isFinite(n)) return '0';
    if (n === 0) return '0';
    const abs = Math.abs(n);
    if (abs >= 1000) return n.toLocaleString('en-IN', { maximumFractionDigits: 2 });
    if (abs >= 1) return n.toLocaleString('en-IN', { maximumFractionDigits: 4 });
    return n.toLocaleString('en-IN', { maximumFractionDigits: 6 });
  }

  function convert(source) {
    if (source === 'from') {
      const v = parseFloat(fromInput.value);
      if (isNaN(v)) { toInput.value = ''; return; }
      const sqft = v * TO_SQFT[state.from];
      toInput.value = formatNum(sqft / TO_SQFT[state.to]);
    } else {
      const v = parseFloat(toInput.value);
      if (isNaN(v)) { fromInput.value = ''; return; }
      const sqft = v * TO_SQFT[state.to];
      fromInput.value = formatNum(sqft / TO_SQFT[state.from]);
    }
  }

  fromInput.addEventListener('input', () => convert('from'));
  toInput.addEventListener('input', () => convert('to'));

  if (swapBtn) {
    swapBtn.addEventListener('click', () => {
      state = { from: state.to, to: state.from };
      tabsEl.querySelectorAll('.calc-tab').forEach(b => b.classList.remove('active'));
      applyLabels();
      // swap values
      const tmp = fromInput.value;
      fromInput.value = toInput.value;
      toInput.value = tmp;
    });
  }

  // Init
  applyLabels();
  fromInput.value = '1';
  convert('from');
})();
