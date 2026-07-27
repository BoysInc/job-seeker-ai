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
      indicatorClassName: "**:data-[slot=progress-indicator]:bg-muted-foreground/30",
      textClassName: "text-muted-foreground",
    };
  }

  if (score <= 2) {
    return {
      score,
      label: "Weak",
      indicatorClassName: "**:data-[slot=progress-indicator]:bg-destructive",
      textClassName: "text-destructive",
    };
  }

  if (score <= 4) {
    return {
      score,
      label: "Medium",
      indicatorClassName: "**:data-[slot=progress-indicator]:bg-warning",
      textClassName: "text-warning",
    };
  }

  return {
    score,
    label: "Strong",
    indicatorClassName: "**:data-[slot=progress-indicator]:bg-success",
    textClassName: "text-success",
  };
};

export const validateStrongPassword = (password: string) => {
  const failedRule = passwordRules.find((rule) => !rule.test(password));
  return failedRule ? failedRule.label : true;
};
