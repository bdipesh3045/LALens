export function getFilteredParishes(parishes, filters, searchText) {
  const q = searchText.trim().toLowerCase();
  return parishes.filter((parish) => {
    const coverageMatch =
      filters.coverage === "All" ||
      (filters.coverage === "sample" && parish.hasMetrics) ||
      (filters.coverage === "pending" && !parish.hasMetrics);

    const priorityMatch = filters.priority === "All" || parish.priorityLevel === filters.priority;

    const sectors = parish.topWorkforceDemand || [];
    const workforceMatch = filters.workforce === "All" || sectors.includes(filters.workforce);

    const regionMatch = filters.region === "All" || parish.region === filters.region;

    const queryMatch = q.length === 0 || parish.name.toLowerCase().includes(q);

    return coverageMatch && priorityMatch && workforceMatch && regionMatch && queryMatch;
  });
}
