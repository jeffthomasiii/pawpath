/* Keep the mobile shell synchronized with the existing care-plan globals. */

const originalPersistCarePlanForMobileShell = persistCarePlan;
const originalClearActiveCarePlanForMobileShell = clearActiveCarePlan;

persistCarePlan = function persistCarePlanWithMobileShell(message, announce = true) {
  const result = originalPersistCarePlanForMobileShell(message, announce);
  window.setTimeout(syncMobileSavedPlanState, 0);
  return result;
};

clearActiveCarePlan = function clearActiveCarePlanWithMobileShell() {
  const result = originalClearActiveCarePlanForMobileShell();
  window.setTimeout(syncMobileSavedPlanState, 0);
  return result;
};

document.addEventListener("click", (event) => {
  if (event.target.closest?.("#clear-care-plan")) {
    window.setTimeout(syncMobileSavedPlanState, 0);
  }
});
