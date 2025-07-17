import { useState } from "react";
import { useDTRStore } from "./store";
import { AnimatePresence, motion } from "motion/react";

// interface UserDetails {
//     username: string;
//     vacation: number;
//     sick: number;
//     bereavement: number;
//     emergency_leave: number;
//     offset_leave: number;
//     compensatory_time_off: number;
// }

interface UserAttendance {
    date: string | null,
    in: string | null,
    out: string | null
}

const MainDashboard = () => {
    const username = useDTRStore((state) => state.user)
    const [userHasTimedIn, setUserHasTimedIn] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const attendanceRecords = useDTRStore((state) => state.userAttendanceRecords)
    let userAttendanceProfile = attendanceRecords.find(records => records.username === username)
    const currentUserAttendanceRecords = userAttendanceProfile?.attendance || [{ date: null, in: null, out: null }]
    let lastRecord: UserAttendance = currentUserAttendanceRecords[0]
    
    const serializeDate = (timestampDate: string | null) => {
        const dateToChange = new Date(timestampDate as string)
        const month = (dateToChange.getMonth() + 1).toString().padStart(2, '0');
        const day = dateToChange.getDate().toString().padStart(2, '0');
        const year = dateToChange.getFullYear();
        return `${month}/${day}/${year}`;
    }
    if (currentUserAttendanceRecords.length > 0 && lastRecord.in) {
        if (!lastRecord.out) {
            setUserHasTimedIn(() => true)
            currentUserAttendanceRecords.shift()
        }
        else lastRecord = { date: serializeDate(null), in: null, out: null }
    }
    else {
        currentUserAttendanceRecords.shift()
        lastRecord = { date: serializeDate(null), in: null, out: null }
    }
    const leaveCredits = useDTRStore((state) => state.userDetails).find(records => records.username === username)
    // const leaveCreditsKeys = Object.keys(leaveCredits).filter(label => label !== 'username')
    // const leaveCreditLabels = leaveCreditsKeys.map(labelKey => {
    //     const formattedLabel = labelKey.split("_").map(keySegment => keySegment.charAt(0).toUpperCase() + keySegment.slice(1)).join(" ")
    //     return {
    //         key: labelKey,
    //         label: formattedLabel
    //     }
    // })
    const rowClass = "w-full border-b-2 py-[8px] border-b-slate-200 text-slate-900 flex justify-between"
    const recordTime = () => {
        const timestamp = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
        if (!userHasTimedIn) {
            lastRecord.in = timestamp
            setUserHasTimedIn(() => true)
        }
        else {
            // currentUserAttendanceRecords.shift()
            lastRecord.out = timestamp
            setUserHasTimedIn(() => false)
        }
        currentUserAttendanceRecords.unshift(lastRecord)
        setShowModal(() => false)
    }

    

    const logoutUser = useDTRStore((state) => state.logout)
    const updateUserAttendanceRecords = useDTRStore((state) => state.updateAttendance)

    const logoutAccount = () => {
        currentUserAttendanceRecords.unshift(lastRecord)
        if (userAttendanceProfile) {
            userAttendanceProfile.attendance = currentUserAttendanceRecords
        }
        else {
            userAttendanceProfile = {
                username: username,
                attendance: [lastRecord]
            }
        }
        const updateUserAttendance = attendanceRecords.filter(record => record.username !== username)
        updateUserAttendance.push(userAttendanceProfile)
        updateUserAttendanceRecords(updateUserAttendance)
        logoutUser()
    }
    return (
        <div className="w-screen h-screen flex flex-col items-stretch text-white">
            <div className="w-full h-[103px] bg-mm-header flex justify-between">
                <div className="w-1/2 flex justify-start items-center ms-[57px] raleway-700 text-4xl text-white tracking-[-1%] tfont-semibold">
                    <p>Exam
                        <span className="text-[#00FFFF]"> track</span>
                    </p>
                </div>
                <div className="w-1/2 flex justify-end items-center me-[35px] gap-x-[16px]">
                    <p>Hello, {username}!</p>
                    <button type="button" onClick={logoutAccount} className="w-[98px] rounded-sm bg-white hover:bg-mm-primary text-mm-primary hover:text-white cursor-pointer transition-all duration-500 ease-in-out font-bold">LOGOUT</button>
                </div>
            </div>
            <div className="w-full h-auto px-[84px] py-[56px] flex flex-col lg:flex-row gap-[47px]">
                <div className="w-full lg:w-7/12 bg-white flex flex-col rounded-md">
                    <div className="w-full h-[96px] flex justify-between items-center rounded-t-md header-segment px-[32px] py-[24px]">
                        <p className="font-semibold text-[20px]">My Attendance</p>
                        <button onClick={() => setShowModal(() => true)} className="w-[98px] h-full rounded-sm bg-white hover:bg-mm-primary text-mm-primary hover:text-white cursor-pointer transition-all duration-500 ease-in-out font-bold">Time { !userHasTimedIn ? "In" : "Out" }</button>
                    </div>
                    <div className="w-full h-auto flex flex-col p-[24px] md:p-[32px] gap-y-[10px]">
                        <div className="w-full flex justify-between text-slate-900/70 text-[14px]">
                            <div className="w-1/4 text-left">Date</div>
                            <div className="w-2/4">Time In</div>
                            <div className="w-1/4 text-right">Time Out</div>
                        </div>
                        {currentUserAttendanceRecords.length > 0 &&
                            currentUserAttendanceRecords.map((record, k) => (
                                <div key={k} className={rowClass}>
                                    <div className="w-1/4 text-left">{serializeDate(record.date)}</div>
                                    <div className="w-2/4">{record.in}</div>
                                    <div className="w-1/4 text-right">{record.out}</div>
                                </div>
                            ))
                        }
                        {currentUserAttendanceRecords.length === 0 && <p className="text-slate-900/70">No records found.</p>}
                    </div>
                </div>
                <div className="w-full lg:w-5/12 h-auto bg-white flex flex-col rounded-md">
                    <div className="w-full h-[96px] flex justify-between items-center rounded-t-md header-segment px-[32px] py-[24px]">
                        <p className="font-semibold text-[20px]">Leave Credits</p>
                        <button className="w-[98px] h-full rounded-sm bg-white hover:bg-mm-primary text-mm-primary hover:text-white cursor-pointer transition-all duration-500 ease-in-out font-bold">Apply</button>
                    </div>
                    <div className="w-full h-auto flex flex-col items-center p-[24px] md:p-[32px]">
                        <p className="text-[14px] text-slate-900/70 ">Leaves</p>
                        <div className="w-full h-auto flex flex-col px-0 md:px-[20px]">
                            {/* {leaveCredits && leaveCreditLabels.map(row => (
                                <div key={row.key} className="w-full border-b-2 py-[8px] border-b-slate-200 text-slate-900 flex justify-between">
                                    <p>{row.label}</p>
                                    <p>{leaveCredits[row.key]}</p>
                                </div>
                            ))} */}
                            <div className={rowClass}>
                                <div className="w-3/4 text-left">Vacation</div>
                                <div className="w-1/4 text-right flex flex-col justify-center">{leaveCredits?.vacation}</div>
                            </div>
                            <div className={rowClass}>
                                <div className="w-3/4 text-left">Sick</div>
                                <div className="w-1/4 text-right flex flex-col justify-center">{leaveCredits?.sick}</div>
                            </div>
                            <div className={rowClass}>
                                <div className="w-3/4 text-left">Bereavement</div>
                                <div className="w-1/4 text-right flex flex-col justify-center">{leaveCredits?.bereavement}</div>
                            </div>
                            <div className={rowClass}>
                                <div className="w-3/4 text-left">Emergancy Leave</div>
                                <div className="w-1/4 text-right flex flex-col justify-center">{leaveCredits?.emergency_leave}</div>
                            </div>
                            <div className={rowClass}>
                                <div className="w-3/4 text-left">Offset Leave</div>
                                <div className="w-1/4 text-right flex flex-col justify-center">{leaveCredits?.offset_leave}</div>
                            </div>
                            <div className={rowClass}>
                                <div className="w-3/4 text-left">Compensatory Time Off</div>
                                <div className="w-1/4 text-right flex flex-col justify-center">{leaveCredits?.compensatory_time_off}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AnimatePresence mode="popLayout">
                {showModal &&
                    <motion.div
                        key="modal"
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: 1,
                            transition: { ease: [0.16, 1, 0.3, 1], duration: 1 }
                        }}
                        exit={{
                            opacity: 0,
                            transition: { ease: [0.16, 1, 0.3, 1], duration: 1 },
                        }}
                        className="w-full h-full absolute"
                    >
                        <div className="bg-slate-900/75 w-full h-full pt-[96px] px-[16px] flex justify-center text-white">
                            <div className="w-[414px] h-[214px] bg-white flex flex-col gap-y-[22px] rounded-md p-[32px]">
                                <div className="w-full text-slate-900 text-left text-[20px] font-semibold">Time {!userHasTimedIn ? "In" : "Out"}</div>
                                <div className="w-full text-slate-900 text-left">Are you sure you want to time <b>{!userHasTimedIn ? "in" : "out"}</b>?</div>
                                <div className="w-full flex justify-center md:justify-end gap-x-[16px]">
                                    <button onClick={() => setShowModal(() => false)} className="w-1/2 md:w-auto border border-slate-200 rounded-sm text-slate-900 px-[16px] py-[8px] cursor-pointer hover:bg-red-500 transition-all duration-500">Cancel</button>
                                    <button onClick={recordTime} className="w-1/2 md:w-auto border border-slate-200 rounded-sm bg-mm-primary hover:bg-[#1E1E1E] text-white px-[16px] py-[8px] cursor-pointer transition-all duration-500">Yes</button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                }
                
            </AnimatePresence>
            
            
        </div>
    )
}

export default MainDashboard;