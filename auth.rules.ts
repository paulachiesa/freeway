export type Rule = { prefix: string; roles: string[]; exact?: boolean };

export const RULES: Rule[] = [
  { prefix: "/dashboard/infracciones/crear", roles: ["admin", "procesador"] },
  { prefix: "/dashboard/infracciones", roles: ["admin", "procesador"] },
  { prefix: "/dashboard", roles: ["*"], exact: true },
  { prefix: "/dashboard", roles: ["admin"] },
];

export function isAllowed(pathname: string, userRoles: string[]): boolean {
  const have = new Set(
    (userRoles ?? []).map((r) => String(r).trim().toLowerCase())
  );
  for (const rule of RULES) {
    const match = rule.exact
      ? pathname === rule.prefix
      : pathname.startsWith(rule.prefix);
    if (!match) continue;
    if (rule.roles.includes("*")) return true;
    const need = rule.roles.map((r) => r.toLowerCase());
    return need.some((r) => have.has(r));
  }
  return true; // si no matchea nada, no bloqueamos
}
