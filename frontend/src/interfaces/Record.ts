export interface Record {
  id: string;
  name: string;
  dob: number; // timestamp
  address: string;
  healthcare_address: string; // Alamat Faskes
  health_insurance_number: number; // BPJS
  medical_record_number: number; // Nomor Rekam Medis
  status: boolean; // True (archieved) / False (Out)
  position: string;
}
