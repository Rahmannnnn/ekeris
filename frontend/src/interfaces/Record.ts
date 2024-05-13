export interface Record {
  medical_record_number: string; // Nomor Rekam Medis
  name: string; // Nama
  health_insurance_number: string; // BPJS
  rank: string; // Pangkat
  registration_number: string; // NRP/NIP
  unitary_part: string; // Bagian Kesatuan
  health_service_provider: string; // PPK 1
  position: string; // Letak Lemari
  status: boolean; // True (archieved) / False (Out)
  borrower: string; // Peminjam (if status false)
  createdAt: number;
  updatedAt: number;
  histories: string[];
}
