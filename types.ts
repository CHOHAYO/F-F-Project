export enum UploadType {
  CUSTOMER = 'CUSTOMER',
  SALES = 'SALES',
  PRODUCT = 'PRODUCT',
  COMPETITOR = 'COMPETITOR',
}

export interface UploadZoneConfig {
  id: UploadType;
  label: string;
  description: string;
}

export interface SalesData {
  month: string;
  target: number;
  actual: number;
}

export interface CompetitorData {
  subject: string;
  FnF: number;
  CompA: number;
  CompB: number;
}

export interface ProductTrend {
  week: string;
  sales: number;
  inventory: number;
}

export interface ReviewData {
  name: string;
  value: number;
}

export type MenuId = 'flagship' | 'market' | 'sales_review' | 'category' | 'channel' | 'voc' | 'profit';