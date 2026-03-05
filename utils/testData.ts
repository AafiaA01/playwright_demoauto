import fs from 'fs';
import path from 'path';

function readJsonFile<T>(fileName: string): T {
  const filePath = path.resolve(__dirname, '..', 'Data', fileName);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

export interface LoginData {
  validUser: {
    username: string;
    password: string;
  };
}

export const loginData = readJsonFile<LoginData>('login.json');

export interface SearchData {
  validSearch: {
    locationLabel: string;
    hotelLabel: string;
    roomTypeLabel: string;
    checkIn: string;
    checkOut: string;
    adults: string;
    children: string;
  };
  invalidDateSearch: {
    locationLabel: string;
    checkIn: string;
    checkOut: string;
  };
}

export const searchData = readJsonFile<SearchData>('search.json');

export interface BookHotelData {
  validBooking: {
    firstName: string;
    lastName: string;
    address: string;
    creditCardNumber: string;
    creditCardType: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
  };
}

export const bookHotelData = readJsonFile<BookHotelData>('bookHotel.json');

export interface SelectHotelData {
  selection: {
    selectFirstHotel: boolean;
  };
}

export const selectHotelData =
  readJsonFile<SelectHotelData>('selectHotel.json');

export interface BookingConfirmationData {
  expectedMessages: {
    firstName: string;
    lastName: string;
    address: string;
    creditCardNumber: string;
  };
}

export const bookingConfirmationData =
  readJsonFile<BookingConfirmationData>('bookingConfirmation.json');

