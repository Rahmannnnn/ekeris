export interface History {
  borrower: string;
  entryTime: number;
  exitTime: number;
  createdAt: number;
  updatedAt: number;
  recordId: string;
}

export interface HistoryResponse extends History {
  _id: string;
}
