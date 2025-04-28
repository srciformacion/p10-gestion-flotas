
import { Ambulance } from "@/types";

export const equipmentOptions = [
  { id: "stair-chair", label: "Silla oruga" },
  { id: "bariatric-bed", label: "Camilla bariátrica" },
  { id: "bariatric-equipment", label: "Equipamiento para pacientes bariátricos" },
  { id: "vital-signs", label: "Monitorización de constantes vitales" },
  { id: "oxygen", label: "Oxígeno" },
  { id: "defibrillator", label: "Desfibrilador" }
];

export const emptyAmbulance: Omit<Ambulance, "id"> = {
  licensePlate: "",
  model: "",
  type: "consultation",
  baseLocation: "",
  hasMedicalBed: false,
  hasWheelchair: false,
  allowsWalking: false,
  stretcherSeats: 0,
  wheelchairSeats: 0,
  walkingSeats: 0,
  equipment: [],
  zone: "",
  status: "available",
  notes: ""
};
