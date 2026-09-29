/**
 * Physics engine for Thermal Equilibrium Laboratory
 * Formulas based on 8th grade Kazakh Physics curriculum:
 * Q = c * m * (t2 - t1)
 * c_water = 4200 J/(kg*°C)
 */

export const C_WATER = 4200; // Дж/(кг·°C)
export const C_ALUMINUM = 900; // Дж/(кг·°C) - калориметр ішкі стақаны

export interface CalculationResult {
  m1_kg: number; // Суық су массасы (кг)
  m2_kg: number; // Ыстық су массасы (кг)
  m_total_kg: number; // Қоспа массасы (кг)
  t1: number; // Суық су бастапқы t (°C)
  t2: number; // Ыстық су бастапқы t (°C)
  t_mix: number; // Қоспаның соңғы t (°C)
  q_absorbed: number; // Qсуық (Qалған), Дж
  q_released: number; // Qыстық (Qберген), Дж
  delta_q: number; // Жылу шығыны |Qберген - Qалған|, Дж
  efficiency: number; // Жылу сақталу пайызы (%)
}

export function computeThermalEquilibrium(
  coldMl: number,
  coldTemp: number,
  hotMl: number,
  hotTemp: number,
  mode: 'ideal' | 'realistic',
  ambientTemp: number = 20
): CalculationResult {
  const m1 = coldMl / 1000; // кг
  const m2 = hotMl / 1000; // кг
  const m_total = m1 + m2;

  let t_final: number;

  if (mode === 'ideal') {
    // Q_released = Q_absorbed
    // c * m2 * (t2 - t) = c * m1 * (t - t1)
    // t = (m1*t1 + m2*t2) / (m1 + m2)
    t_final = (m1 * coldTemp + m2 * hotTemp) / (m1 + m2);
  } else {
    // Realistic: Calorimeter cup absorption + small convective dissipation
    // Cup mass approx 0.045 kg aluminum
    const m_cup = 0.045; // kg
    const c_cup = C_ALUMINUM;
    // Ambient heat loss factor ~ 2.5%
    const heat_loss_factor = 0.025;
    
    // Total thermal capacity of system
    const total_heat_content = (m1 * C_WATER * coldTemp) + (m2 * C_WATER * hotTemp) + (m_cup * c_cup * ambientTemp);
    const total_heat_capacity = (m1 * C_WATER) + (m2 * C_WATER) + (m_cup * c_cup);
    
    const theoretical = total_heat_content / total_heat_capacity;
    // Dissipation to air
    t_final = theoretical - (theoretical - ambientTemp) * heat_loss_factor;
  }

  // Round temperature to 1 decimal place as standard lab thermometer reading
  t_final = Math.round(t_final * 10) / 10;

  // Q = c * m * Δt
  const q_absorbed = Math.round(C_WATER * m1 * (t_final - coldTemp));
  const q_released = Math.round(C_WATER * m2 * (hotTemp - t_final));
  const delta_q = Math.abs(q_released - q_absorbed);
  const efficiency = q_released > 0 ? Math.min(100, Math.round((q_absorbed / q_released) * 1000) / 10) : 100;

  return {
    m1_kg: Math.round(m1 * 1000) / 1000,
    m2_kg: Math.round(m2 * 1000) / 1000,
    m_total_kg: Math.round(m_total * 1000) / 1000,
    t1: coldTemp,
    t2: hotTemp,
    t_mix: t_final,
    q_absorbed,
    q_released,
    delta_q,
    efficiency,
  };
}

/**
 * Format numbers in Kazakh locale / standard lab representation
 */
export function formatNum(n: number, decimals = 1): string {
  if (Number.isInteger(n)) return n.toString();
  return n.toFixed(decimals);
}
