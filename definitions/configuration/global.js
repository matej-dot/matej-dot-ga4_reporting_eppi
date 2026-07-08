
const useCurrentDate = true;  // Nastav na true pro použití current_date()
const predefinedDate = '2025-03-14';  // Když nechceš current_date(), použije se toto datum

module.exports = {
  incremental_window_days: 3,
  datum: useCurrentDate ? new Date().toISOString().split('T')[0] : predefinedDate
};