export const passwordRules = [
  {
    label: "At least 8 characters",
    test: (password: string) => password.length >= 8,
  },
  {
    label: "One uppercase letter",
    test: (password: string) => /[A-Z]/.test(password),
  },
  {
    label: "One lowercase letter",
    test: (password: string) => /[a-z]/.test(password),
  },
  {
    label: "One number",
    test: (password: string) => /\d/.test(password),
  },
  {
    label: "One special character",
    test: (password: string) => /[^A-Za-z0-9]/.test(password),
  },
];

export const getPasswordStrength = (password: string) => {
  const passedRules = passwordRules.filter((rule) => rule.test(password));
  const score = passedRules.length;

  if (!password) {
    return {
      score,
      label: "Enter a password",
      indicatorClassName: "**:data-[slot=progress-indicator]:bg-zinc-200",
      textClassName: "text-zinc-500",
    };
  }

  if (score <= 2) {
    return {
      score,
      label: "Weak",
      indicatorClassName: "**:data-[slot=progress-indicator]:bg-red-500",
      textClassName: "text-red-600",
    };
  }

  if (score <= 4) {
    return {
      score,
      label: "Medium",
      indicatorClassName: "**:data-[slot=progress-indicator]:bg-amber-500",
      textClassName: "text-amber-600",
    };
  }

  return {
    score,
    label: "Strong",
    indicatorClassName: "**:data-[slot=progress-indicator]:bg-[#5f9d38]",
    textClassName: "text-[#5f9d38]",
  };
};

export const validateStrongPassword = (password: string) => {
  const failedRule = passwordRules.find((rule) => !rule.test(password));
  return failedRule ? failedRule.label : true;
};
