import config from "@/config";

export type UserPlan = "free" | "solo" | "team";

export interface PlanLimits {
  maxProjects: number; // -1 means unlimited
  maxDevices: number; // -1 means unlimited
  maxVariablesPerProject: number; // -1 means unlimited
  features: string[];
}

/**
 * Get plan limits for a given plan
 */
export function getPlanLimits(plan: UserPlan): PlanLimits {
  return config.plans![plan];
}

/**
 * Check if user can create more projects
 */
export function canCreateProject(
  currentProjectCount: number,
  plan: UserPlan
): boolean {
  const limits = getPlanLimits(plan);

  // -1 means unlimited
  if (limits.maxProjects === -1) {
    return true;
  }

  return currentProjectCount < limits.maxProjects;
}

/**
 * Check if user can add more variables to a project
 */
export function canAddVariable(
  currentVariableCount: number,
  plan: UserPlan
): boolean {
  const limits = getPlanLimits(plan);

  // -1 means unlimited
  if (limits.maxVariablesPerProject === -1) {
    return true;
  }

  return currentVariableCount < limits.maxVariablesPerProject;
}

/**
 * Get user-friendly error message for plan limits
 */
export function getPlanLimitError(
  plan: UserPlan,
  limitType: "projects" | "variables"
): string {
  const limits = getPlanLimits(plan);

  if (limitType === "projects") {
    return `You've reached the maximum of ${limits.maxProjects} projects on the ${plan} plan. Upgrade to create more projects.`;
  }

  return `You've reached the maximum of ${limits.maxVariablesPerProject} variables per project on the ${plan} plan. Upgrade for more capacity.`;
}
