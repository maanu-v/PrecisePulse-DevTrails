import { create } from 'zustand';

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------
export type Role = 'worker' | 'insurer' | 'partner' | null;
export type ZoneColor = 'green' | 'orange' | 'red';
export type ClaimStatus = 'Approved' | 'Pending' | 'Rejected' | 'Manual Review';

export interface Zone {
  id: string;
  name: string;
  color: ZoneColor;
  center: [number, number];
  disruption?: {
    type: string;
    severity: string;
    expectedDuration: string;
    precipitation?: string;
  };
}

export interface Claim {
  id: string;
  date: string;
  zoneId: string;
  zoneName: string;
  disruptionType: string;
  source: 'Auto' | 'Manual';
  status: ClaimStatus;
  payoutAmount: number;
  reasonSummary: string;
  fraudScore?: number;
}

export interface NotificationMsg {
  id: string;
  type: 'danger' | 'success' | 'info';
  title: string;
  message: string;
  read: boolean;
  date: string;
}

export interface PaymentMethod {
  id: string;
  type: 'UPI' | 'Bank Account';
  details: string; // e.g., "user@upi" or "HDFC **** 1234"
  isPrimary: boolean;
}

interface WorkerProfile {
  id: string;
  name: string;
  platform: string;
  platformId: string;
  status: string;
  totalEarningsSynced: number;
  vehicleType: string;
  deliveryCategory?: string;
  weeklyIncome?: number;
  city?: string;
  zoneId?: string;
  workHoursPerDay?: number;
  workDaysPerWeek?: number;
  policyAccepted?: boolean;
  activePlan: {
    mode: 'Slot-based' | 'Flexible';
    premiumPaid: number;
    coverageActive: boolean;
    validUntil: string;
    slots: string[];
    rules: {
      covered: { event: string; parameter: string }[];
      conditional: { event: string; parameter: string }[];
      excluded: { event: string; reason: string }[];
    }
  };
  totalPayoutReceived: number;
  currentExposureScore: number;
  premiumBreakdown?: {
    base: number;
    riskAdjustment: number;
    incomeFactor: number;
    total: number;
  };
}

export interface ActiveDisruption {
  type: string;
  zoneId: string;
  description: string;
  isCovered: boolean;
}

export interface ClaimResult {
  status: 'Approved' | 'Rejected';
  amount: number;
  reasons: string[];
}

interface AppState {
  currentRole: Role;
  setCurrentRole: (role: Role) => void;

  workerProfile: WorkerProfile;
  setWorkerProfile: (profile: Partial<WorkerProfile>) => void;

  activeDisruption: ActiveDisruption | null;
  setActiveDisruption: (d: ActiveDisruption | null) => void;

  zones: Zone[];
  setZones: (zones: Zone[]) => void;

  claims: Claim[];
  addClaim: (claim: Claim) => void;
  updateClaimStatus: (id: string, status: ClaimStatus) => void;

  notifications: NotificationMsg[];
  markNotificationRead: (id: string) => void;

  paymentMethods: PaymentMethod[];
  addPaymentMethod: (method: PaymentMethod) => void;
  removePaymentMethod: (id: string) => void;
  setPrimaryPaymentMethod: (id: string) => void;
}

// ----------------------------------------------------------------------
// MOCK DATA
// ----------------------------------------------------------------------
const initialZones: Zone[] = [
  {
    "id": "Z-0-1",
    "name": "Zone 0-1",
    "color": "green",
    "center": [
      12.875981,
      77.45
    ]
  },
  {
    "id": "Z-0-2",
    "name": "Zone 0-2",
    "color": "green",
    "center": [
      12.901962,
      77.45
    ]
  },
  {
    "id": "Z-0-3",
    "name": "Zone 0-3",
    "color": "green",
    "center": [
      12.927942,
      77.45
    ]
  },
  {
    "id": "Z-0-4",
    "name": "Zone 0-4",
    "color": "green",
    "center": [
      12.953923,
      77.45
    ]
  },
  {
    "id": "Z-0-5",
    "name": "Zone 0-5",
    "color": "green",
    "center": [
      12.979904,
      77.45
    ]
  },
  {
    "id": "Z-0-6",
    "name": "Zone 0-6",
    "color": "green",
    "center": [
      13.005885,
      77.45
    ]
  },
  {
    "id": "Z-0-7",
    "name": "Zone 0-7",
    "color": "green",
    "center": [
      13.031865,
      77.45
    ]
  },
  {
    "id": "Z-0-8",
    "name": "Zone 0-8",
    "color": "green",
    "center": [
      13.057846,
      77.45
    ]
  },
  {
    "id": "Z-1-0",
    "name": "Zone 1-0",
    "color": "green",
    "center": [
      12.86299,
      77.48375
    ]
  },
  {
    "id": "Z-1-1",
    "name": "Zone 1-1",
    "color": "green",
    "center": [
      12.888971,
      77.48375
    ]
  },
  {
    "id": "Z-1-2",
    "name": "Zone 1-2",
    "color": "green",
    "center": [
      12.914952,
      77.48375
    ]
  },
  {
    "id": "Z-1-3",
    "name": "Zone 1-3",
    "color": "green",
    "center": [
      12.940933,
      77.48375
    ]
  },
  {
    "id": "Z-1-4",
    "name": "Zone 1-4",
    "color": "green",
    "center": [
      12.966913,
      77.48375
    ]
  },
  {
    "id": "Z-1-5",
    "name": "Zone 1-5",
    "color": "green",
    "center": [
      12.992894,
      77.48375
    ]
  },
  {
    "id": "Z-1-6",
    "name": "Zone 1-6",
    "color": "green",
    "center": [
      13.018875,
      77.48375
    ]
  },
  {
    "id": "Z-1-7",
    "name": "Zone 1-7",
    "color": "green",
    "center": [
      13.044856,
      77.48375
    ]
  },
  {
    "id": "Z-1-8",
    "name": "Zone 1-8",
    "color": "green",
    "center": [
      13.070836,
      77.48375
    ]
  },
  {
    "id": "Z-1-9",
    "name": "Zone 1-9",
    "color": "green",
    "center": [
      13.096817,
      77.48375
    ]
  },
  {
    "id": "Z-2-0",
    "name": "Zone 2-0",
    "color": "green",
    "center": [
      12.85,
      77.5175
    ]
  },
  {
    "id": "Z-2-1",
    "name": "Zone 2-1",
    "color": "green",
    "center": [
      12.875981,
      77.5175
    ]
  },
  {
    "id": "Z-2-2",
    "name": "Zone 2-2",
    "color": "green",
    "center": [
      12.901962,
      77.5175
    ]
  },
  {
    "id": "Z-2-3",
    "name": "Zone 2-3",
    "color": "green",
    "center": [
      12.927942,
      77.5175
    ]
  },
  {
    "id": "Z-2-4",
    "name": "Zone 2-4",
    "color": "green",
    "center": [
      12.953923,
      77.5175
    ]
  },
  {
    "id": "Z-2-5",
    "name": "Moderate Zone",
    "color": "orange",
    "center": [
      12.979904,
      77.5175
    ]
  },
  {
    "id": "Z-2-6",
    "name": "Zone 2-6",
    "color": "green",
    "center": [
      13.005885,
      77.5175
    ]
  },
  {
    "id": "Z-2-7",
    "name": "Zone 2-7",
    "color": "green",
    "center": [
      13.031865,
      77.5175
    ]
  },
  {
    "id": "Z-2-8",
    "name": "Zone 2-8",
    "color": "green",
    "center": [
      13.057846,
      77.5175
    ]
  },
  {
    "id": "Z-2-9",
    "name": "Zone 2-9",
    "color": "green",
    "center": [
      13.083827,
      77.5175
    ]
  },
  {
    "id": "Z-2-10",
    "name": "Zone 2-10",
    "color": "green",
    "center": [
      13.109808,
      77.5175
    ]
  },
  {
    "id": "Z-3-0",
    "name": "Zone 3-0",
    "color": "green",
    "center": [
      12.86299,
      77.55125
    ]
  },
  {
    "id": "Z-3-1",
    "name": "Zone 3-1",
    "color": "green",
    "center": [
      12.888971,
      77.55125
    ]
  },
  {
    "id": "Z-3-2",
    "name": "Zone 3-2",
    "color": "green",
    "center": [
      12.914952,
      77.55125
    ]
  },
  {
    "id": "Z-3-3",
    "name": "Zone 3-3",
    "color": "green",
    "center": [
      12.940933,
      77.55125
    ]
  },
  {
    "id": "Z-3-4",
    "name": "Zone 3-4",
    "color": "green",
    "center": [
      12.966913,
      77.55125
    ]
  },
  {
    "id": "Z-3-5",
    "name": "Moderate Zone",
    "color": "orange",
    "center": [
      12.992894,
      77.55125
    ]
  },
  {
    "id": "Z-3-6",
    "name": "Zone 3-6",
    "color": "green",
    "center": [
      13.018875,
      77.55125
    ]
  },
  {
    "id": "Z-3-7",
    "name": "Zone 3-7",
    "color": "green",
    "center": [
      13.044856,
      77.55125
    ]
  },
  {
    "id": "Z-3-8",
    "name": "Zone 3-8",
    "color": "green",
    "center": [
      13.070836,
      77.55125
    ]
  },
  {
    "id": "Z-3-9",
    "name": "Zone 3-9",
    "color": "green",
    "center": [
      13.096817,
      77.55125
    ]
  },
  {
    "id": "Z-3-10",
    "name": "Zone 3-10",
    "color": "green",
    "center": [
      13.122798,
      77.55125
    ]
  },
  {
    "id": "Z-4-0",
    "name": "Zone 4-0",
    "color": "green",
    "center": [
      12.85,
      77.585
    ]
  },
  {
    "id": "Z-4-1",
    "name": "Zone 4-1",
    "color": "green",
    "center": [
      12.875981,
      77.585
    ]
  },
  {
    "id": "Z-4-2",
    "name": "Moderate Zone",
    "color": "orange",
    "center": [
      12.901962,
      77.585
    ]
  },
  {
    "id": "Z-4-3",
    "name": "Moderate Zone",
    "color": "orange",
    "center": [
      12.927942,
      77.585
    ]
  },
  {
    "id": "Z-4-4",
    "name": "High Risk Zone",
    "color": "red",
    "center": [
      12.953923,
      77.585
    ],
    "disruption": {
      "type": "High Traffic",
      "severity": "High",
      "expectedDuration": "1h",
      "precipitation": "10mm/hr"
    }
  },
  {
    "id": "Z-4-5",
    "name": "High Risk Zone",
    "color": "red",
    "center": [
      12.979904,
      77.585
    ],
    "disruption": {
      "type": "High Traffic",
      "severity": "High",
      "expectedDuration": "1h",
      "precipitation": "10mm/hr"
    }
  },
  {
    "id": "Z-4-6",
    "name": "High Risk Zone",
    "color": "red",
    "center": [
      13.005885,
      77.585
    ],
    "disruption": {
      "type": "High Traffic",
      "severity": "High",
      "expectedDuration": "1h",
      "precipitation": "10mm/hr"
    }
  },
  {
    "id": "Z-4-7",
    "name": "Zone 4-7",
    "color": "green",
    "center": [
      13.031865,
      77.585
    ]
  },
  {
    "id": "Z-4-8",
    "name": "Zone 4-8",
    "color": "green",
    "center": [
      13.057846,
      77.585
    ]
  },
  {
    "id": "Z-4-9",
    "name": "Zone 4-9",
    "color": "green",
    "center": [
      13.083827,
      77.585
    ]
  },
  {
    "id": "Z-4-10",
    "name": "Zone 4-10",
    "color": "green",
    "center": [
      13.109808,
      77.585
    ]
  },
  {
    "id": "Z-4-11",
    "name": "Zone 4-11",
    "color": "green",
    "center": [
      13.135788,
      77.585
    ]
  },
  {
    "id": "Z-5-0",
    "name": "Zone 5-0",
    "color": "green",
    "center": [
      12.86299,
      77.61875
    ]
  },
  {
    "id": "Z-5-1",
    "name": "Zone 5-1",
    "color": "green",
    "center": [
      12.888971,
      77.61875
    ]
  },
  {
    "id": "Z-5-2",
    "name": "Zone 5-2",
    "color": "green",
    "center": [
      12.914952,
      77.61875
    ]
  },
  {
    "id": "Z-5-3",
    "name": "High Risk Zone",
    "color": "red",
    "center": [
      12.940933,
      77.61875
    ],
    "disruption": {
      "type": "High Traffic",
      "severity": "High",
      "expectedDuration": "1h",
      "precipitation": "10mm/hr"
    }
  },
  {
    "id": "Z-5-4",
    "name": "High Risk Zone",
    "color": "red",
    "center": [
      12.966913,
      77.61875
    ],
    "disruption": {
      "type": "High Traffic",
      "severity": "High",
      "expectedDuration": "1h",
      "precipitation": "10mm/hr"
    }
  },
  {
    "id": "Z-5-5",
    "name": "High Risk Zone",
    "color": "red",
    "center": [
      12.992894,
      77.61875
    ],
    "disruption": {
      "type": "High Traffic",
      "severity": "High",
      "expectedDuration": "1h",
      "precipitation": "10mm/hr"
    }
  },
  {
    "id": "Z-5-6",
    "name": "Zone 5-6",
    "color": "green",
    "center": [
      13.018875,
      77.61875
    ]
  },
  {
    "id": "Z-5-7",
    "name": "Moderate Zone",
    "color": "orange",
    "center": [
      13.044856,
      77.61875
    ]
  },
  {
    "id": "Z-5-8",
    "name": "Zone 5-8",
    "color": "green",
    "center": [
      13.070836,
      77.61875
    ]
  },
  {
    "id": "Z-5-9",
    "name": "Zone 5-9",
    "color": "green",
    "center": [
      13.096817,
      77.61875
    ]
  },
  {
    "id": "Z-5-10",
    "name": "Zone 5-10",
    "color": "green",
    "center": [
      13.122798,
      77.61875
    ]
  },
  {
    "id": "Z-5-11",
    "name": "Zone 5-11",
    "color": "green",
    "center": [
      13.148779,
      77.61875
    ]
  },
  {
    "id": "Z-6-0",
    "name": "Zone 6-0",
    "color": "green",
    "center": [
      12.85,
      77.6525
    ]
  },
  {
    "id": "Z-6-1",
    "name": "Zone 6-1",
    "color": "green",
    "center": [
      12.875981,
      77.6525
    ]
  },
  {
    "id": "Z-6-2",
    "name": "Zone 6-2",
    "color": "green",
    "center": [
      12.901962,
      77.6525
    ]
  },
  {
    "id": "Z-6-3",
    "name": "Moderate Zone",
    "color": "orange",
    "center": [
      12.927942,
      77.6525
    ]
  },
  {
    "id": "Z-6-4",
    "name": "Moderate Zone",
    "color": "orange",
    "center": [
      12.953923,
      77.6525
    ]
  },
  {
    "id": "Z-6-5",
    "name": "Moderate Zone",
    "color": "orange",
    "center": [
      12.979904,
      77.6525
    ]
  },
  {
    "id": "Z-6-6",
    "name": "Moderate Zone",
    "color": "orange",
    "center": [
      13.005885,
      77.6525
    ]
  },
  {
    "id": "Z-6-7",
    "name": "Zone 6-7",
    "color": "green",
    "center": [
      13.031865,
      77.6525
    ]
  },
  {
    "id": "Z-6-8",
    "name": "Zone 6-8",
    "color": "green",
    "center": [
      13.057846,
      77.6525
    ]
  },
  {
    "id": "Z-6-9",
    "name": "Zone 6-9",
    "color": "green",
    "center": [
      13.083827,
      77.6525
    ]
  },
  {
    "id": "Z-6-10",
    "name": "Zone 6-10",
    "color": "green",
    "center": [
      13.109808,
      77.6525
    ]
  },
  {
    "id": "Z-6-11",
    "name": "Zone 6-11",
    "color": "green",
    "center": [
      13.135788,
      77.6525
    ]
  },
  {
    "id": "Z-7-0",
    "name": "Zone 7-0",
    "color": "green",
    "center": [
      12.86299,
      77.68625
    ]
  },
  {
    "id": "Z-7-1",
    "name": "Zone 7-1",
    "color": "green",
    "center": [
      12.888971,
      77.68625
    ]
  },
  {
    "id": "Z-7-2",
    "name": "Zone 7-2",
    "color": "green",
    "center": [
      12.914952,
      77.68625
    ]
  },
  {
    "id": "Z-7-3",
    "name": "Zone 7-3",
    "color": "green",
    "center": [
      12.940933,
      77.68625
    ]
  },
  {
    "id": "Z-7-4",
    "name": "Zone 7-4",
    "color": "green",
    "center": [
      12.966913,
      77.68625
    ]
  },
  {
    "id": "Z-7-5",
    "name": "Zone 7-5",
    "color": "green",
    "center": [
      12.992894,
      77.68625
    ]
  },
  {
    "id": "Z-7-6",
    "name": "Zone 7-6",
    "color": "green",
    "center": [
      13.018875,
      77.68625
    ]
  },
  {
    "id": "Z-7-7",
    "name": "Zone 7-7",
    "color": "green",
    "center": [
      13.044856,
      77.68625
    ]
  },
  {
    "id": "Z-7-8",
    "name": "Zone 7-8",
    "color": "green",
    "center": [
      13.070836,
      77.68625
    ]
  },
  {
    "id": "Z-7-9",
    "name": "Zone 7-9",
    "color": "green",
    "center": [
      13.096817,
      77.68625
    ]
  },
  {
    "id": "Z-7-10",
    "name": "Zone 7-10",
    "color": "green",
    "center": [
      13.122798,
      77.68625
    ]
  },
  {
    "id": "Z-8-0",
    "name": "Zone 8-0",
    "color": "green",
    "center": [
      12.85,
      77.72
    ]
  },
  {
    "id": "Z-8-1",
    "name": "Zone 8-1",
    "color": "green",
    "center": [
      12.875981,
      77.72
    ]
  },
  {
    "id": "Z-8-2",
    "name": "Zone 8-2",
    "color": "green",
    "center": [
      12.901962,
      77.72
    ]
  },
  {
    "id": "Z-8-3",
    "name": "Zone 8-3",
    "color": "green",
    "center": [
      12.927942,
      77.72
    ]
  },
  {
    "id": "Z-8-4",
    "name": "Zone 8-4",
    "color": "green",
    "center": [
      12.953923,
      77.72
    ]
  },
  {
    "id": "Z-8-5",
    "name": "Zone 8-5",
    "color": "green",
    "center": [
      12.979904,
      77.72
    ]
  },
  {
    "id": "Z-8-6",
    "name": "Zone 8-6",
    "color": "green",
    "center": [
      13.005885,
      77.72
    ]
  },
  {
    "id": "Z-8-7",
    "name": "Zone 8-7",
    "color": "green",
    "center": [
      13.031865,
      77.72
    ]
  },
  {
    "id": "Z-8-8",
    "name": "Zone 8-8",
    "color": "green",
    "center": [
      13.057846,
      77.72
    ]
  },
  {
    "id": "Z-8-9",
    "name": "Zone 8-9",
    "color": "green",
    "center": [
      13.083827,
      77.72
    ]
  },
  {
    "id": "Z-9-1",
    "name": "Zone 9-1",
    "color": "green",
    "center": [
      12.888971,
      77.75375
    ]
  },
  {
    "id": "Z-9-2",
    "name": "Zone 9-2",
    "color": "green",
    "center": [
      12.914952,
      77.75375
    ]
  },
  {
    "id": "Z-9-3",
    "name": "Zone 9-3",
    "color": "green",
    "center": [
      12.940933,
      77.75375
    ]
  },
  {
    "id": "Z-9-4",
    "name": "Zone 9-4",
    "color": "green",
    "center": [
      12.966913,
      77.75375
    ]
  },
  {
    "id": "Z-9-5",
    "name": "Zone 9-5",
    "color": "green",
    "center": [
      12.992894,
      77.75375
    ]
  },
  {
    "id": "Z-9-6",
    "name": "Zone 9-6",
    "color": "green",
    "center": [
      13.018875,
      77.75375
    ]
  },
  {
    "id": "Z-9-7",
    "name": "Zone 9-7",
    "color": "green",
    "center": [
      13.044856,
      77.75375
    ]
  }
]
;

const initialClaims: Claim[] = [
  {
    id: 'CLM-8921-A',
    date: '2026-03-18T14:30:00Z',
    zoneId: 'Z-KOR',
    zoneName: 'Koramangala 4th Block',
    disruptionType: 'Severe Flooding',
    source: 'Auto',
    status: 'Approved',
    payoutAmount: 850,
    reasonSummary: 'Worker trapped in a verified red zone in Koramangala during an active shift. Safe route exit was impossible.',
    fraudScore: 12, // Low implies good
  },
  {
    id: 'CLM-8921-B',
    date: '2026-03-10T09:15:00Z',
    zoneId: 'Z-HSR',
    zoneName: 'HSR Layout Sector 2',
    disruptionType: 'Waterlogging',
    source: 'Manual',
    status: 'Pending',
    payoutAmount: 400,
    reasonSummary: 'Worker filed a dispute regarding HSR Layout zone misclassification.',
    fraudScore: 45,
  }
];

const initialNotifications: NotificationMsg[] = [
  {
    id: 'NOTIF-1',
    type: 'danger',
    title: 'Tomorrow Risk Alert',
    message: 'Severe rain predicted in Bengaluru (Koramangala cluster). Avoid this zone tomorrow to maintain eligibility.',
    read: false,
    date: new Date().toISOString(),
  },
  {
    id: 'NOTIF-2',
    type: 'success',
    title: 'Payout Approved',
    message: 'Claim CLM-8921-A of ₹850 has been approved and moved to settlement.',
    read: true,
    date: new Date(Date.now() - 86400000).toISOString(),
  }
];

// ----------------------------------------------------------------------
// STORE
// ----------------------------------------------------------------------
export const useAppStore = create<AppState>((set) => ({
  currentRole: null,
  setCurrentRole: (role) => set({ currentRole: role }),

  activeDisruption: null,
  setActiveDisruption: (d) => set({ activeDisruption: d }),

  workerProfile: {
    id: 'WKR-552A',
    name: 'Ravi Kumar',
    platform: 'Swiggy',
    platformId: 'SWG-8921',
    status: 'Active',
    totalEarningsSynced: 12500,
    vehicleType: '2-Wheeler',
    activePlan: {
      mode: 'Slot-based',
      premiumPaid: 180,
      coverageActive: true,
      validUntil: '2026-04-10T23:59:59Z', // A week from nowish
      slots: ['Mon 09:00-18:00', 'Wed 09:00-18:00', 'Thu 09:00-18:00', 'Fri 09:00-18:00'],
      rules: {
        covered: [
          { event: 'Heavy Rain / Floods', parameter: 'API rainfall thresholds crossed in active Hex Zone' },
          { event: 'Severe Heatwave', parameter: 'Govt heat-alert + local API threshold breached' },
          { event: 'Extreme Pollution', parameter: 'AQI sustained > 400 for 2+ hours' }
        ],
        conditional: [
          { event: 'City Curfews / Unplanned Strikes', parameter: 'Restricted payout cap. Subject to alternative route availability checks.' },
          { event: 'Market Shutdowns', parameter: 'Only localized to the specific Hex zone. Spillover zones not covered.' }
        ],
        excluded: [
          { event: 'Pandemics / National Lockdowns', reason: 'Systemic risks that affect all workers simultaneously break the risk pooling model and create infinite liability.' },
          { event: 'War / Terrorism', reason: 'Act of War clauses are standard systemic risk exclusions.' },
          { event: 'Routine Traffic Disruptions', reason: 'Normal operational hazards; only severe, systemic shutdowns covered.' }
        ]
      }
    },
    totalPayoutReceived: 0,
    currentExposureScore: 68,
  },
  setWorkerProfile: (profileUpdates) => 
    set((state) => ({ workerProfile: { ...state.workerProfile, ...profileUpdates } })),

  zones: initialZones,
  setZones: (zones) => set({ zones }),

  claims: [],
  addClaim: (claim) => set((state) => ({ claims: [claim, ...state.claims] })),
  updateClaimStatus: (id, status) => set((state) => ({
    claims: state.claims.map(c => c.id === id ? { ...c, status } : c)
  })),

  notifications: initialNotifications,
  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
  })),

  paymentMethods: [
    { id: 'PM-1', type: 'UPI', details: 'ravi.kumar@upi', isPrimary: true },
    { id: 'PM-2', type: 'Bank Account', details: 'HDFC **** 8921', isPrimary: false },
  ],
  addPaymentMethod: (method) => set((state) => ({
    paymentMethods: [...state.paymentMethods, method]
  })),
  removePaymentMethod: (id) => set((state) => ({
    paymentMethods: state.paymentMethods.filter((m) => m.id !== id)
  })),
  setPrimaryPaymentMethod: (id) => set((state) => ({
    paymentMethods: state.paymentMethods.map((m) => ({
      ...m,
      isPrimary: m.id === id,
    }))
  })),
}));
