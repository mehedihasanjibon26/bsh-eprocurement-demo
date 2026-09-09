const demoStateKeys = [
  "bsh-phase6-award-stage",
  "bsh-phase6-po-stage",
  "bsh-phase6-contract-stage",
  "bsh-phase7-delivery-stage",
  "bsh-phase7-invoice-submitted",
  "bsh-phase7-invoice-stage",
  "bsh-phase7-invoice-file",
  "bsh-phase8-admin-settings",
  "bsh-phase8-notifications",
];

const demoStatePrefixes = ["bsh-demo-bid-"];

export function resetDemoLocalState() {
  demoStateKeys.forEach((key) => {
    localStorage.removeItem(key);
  });

  const matchingKeys: string[] = [];

  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);

    if (key && demoStatePrefixes.some((prefix) => key.startsWith(prefix))) {
      matchingKeys.push(key);
    }
  }

  matchingKeys.forEach((key) => {
    localStorage.removeItem(key);
  });
}
