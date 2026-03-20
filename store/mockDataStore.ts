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
  activePlan: {
    mode: 'Slot-based' | 'Flexible';
    premiumPaid: number;
    coverageActive: boolean;
    slots: string[];
  };
  totalPayoutReceived: number;
  currentExposureScore: number;
}

interface AppState {
  currentRole: Role;
  setCurrentRole: (role: Role) => void;

  workerProfile: WorkerProfile;
  setWorkerProfile: (profile: Partial<WorkerProfile>) => void;

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
    id: 'Z-KOR',
    name: 'Koramangala 4th Block',
    color: 'red',
    center: [12.9345, 77.6265],
    disruption: {
      type: 'Severe Flooding',
      severity: 'High',
      expectedDuration: '6h',
      precipitation: '45mm/hr',
    }
  },
  {
    id: 'Z-INDIRA',
    name: 'Indiranagar',
    color: 'green',
    center: [12.9784, 77.6408],
  },
  {
    id: 'Z-HSR',
    name: 'HSR Layout Sector 2',
    color: 'orange',
    center: [12.9141, 77.6302],
    disruption: {
      type: 'Heavy Traffic & Waterlogging',
      severity: 'Medium',
      expectedDuration: '2h',
    }
  },
  {
    id: 'Z-WHITE',
    name: 'Whitefield',
    color: 'red',
    center: [12.9698, 77.7499],
    disruption: {
      type: 'Local Strike Closure',
      severity: 'Severe',
      expectedDuration: '24h',
    }
  }
];

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
      slots: ['Mon 09:00-18:00', 'Wed 09:00-18:00', 'Thu 09:00-18:00', 'Fri 09:00-18:00'],
    },
    totalPayoutReceived: 3200,
    currentExposureScore: 68,
  },
  setWorkerProfile: (profileUpdates) => 
    set((state) => ({ workerProfile: { ...state.workerProfile, ...profileUpdates } })),

  zones: initialZones,
  setZones: (zones) => set({ zones }),

  claims: initialClaims,
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
