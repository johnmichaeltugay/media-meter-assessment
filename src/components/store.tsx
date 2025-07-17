import { create } from 'zustand';
import dummyDB from '../data/data.json';

interface userAttendance {
    username: string | null,
    attendance: {
        date: string | null,
        in: string | null,
        out: string | null,
    }[]
}

interface DTRModel {
    user: string | null,
    userCredentialsList: {
        username: string,
        email: string,
        password: string
    }[],
    userAttendanceRecords: userAttendance[],
    userDetails: {
        username: string,
        vacation: number,
        sick: number,
        bereavement: number,
        emergency_leave: number,
        offset_leave: number,
        compensatory_time_off: number
    }[],
    updateAttendance: (replacement: userAttendance[]) => void,
    login: (user: string) => void,
    logout: () => void,
}

export const useDTRStore = create<DTRModel>()((set) => ({
    user: null,
    userCredentialsList: dummyDB.users,
    userAttendanceRecords: dummyDB.time_records,
    userDetails: dummyDB.details,
    // isRegistered: (email) => ,
    updateAttendance: (replacement: userAttendance[]) => set({ userAttendanceRecords: replacement }),
    login: (authenticatedUser: string) => set({ user: authenticatedUser }),
    logout: () => set(() => ({ user: null })),
}))