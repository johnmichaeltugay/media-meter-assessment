import { useState } from "react";
import { useDTRStore } from "./store";
import { AnimatePresence, motion } from "motion/react";

const LoginPage = () => {
    const [userInputValue, setUserInputValue] = useState('')
    const [userInputError, setUserInputError] = useState(false)
    const [userPasswordValue, setUserPasswordValue] = useState('')
    const [userPasswordError, setUserPasswordError] = useState(false)
    const [isLoginError, setIsLoginError] = useState(false)
    const credentialsList = useDTRStore(store => store.userCredentialsList)
    const usernameList = credentialsList.map(user => user.username)
    const emailList = credentialsList.map(user => user.email)
    const enableLoginButton = userInputValue !== '' && userPasswordValue !== '' && userPasswordValue.length > 3
    const loginUser = useDTRStore(store => store.login)
    
    const userFieldChange = (content: string, field: string) => {
        if (isLoginError) setIsLoginError(() => false)
        switch (field) {
            case 'name': {
                setUserInputValue(() => content)
                if (userInputError) setUserInputError(() => false)
                break;
            }
            case 'password': {
                setUserPasswordValue(() => content)
                if (userPasswordError) setUserPasswordError(() => false)
                break;
            }
        }
        
    }
    const loginAttempt = () => {
        const isEmailExisting = emailList.includes(userInputValue)
        const isUsernameExisting = usernameList.includes(userInputValue)
        let isLoginValid = false
        if (userInputValue === '') setUserInputError(() => true)
        else if (!isUsernameExisting && !isEmailExisting) setIsLoginError(() => true)
        else if (isUsernameExisting) {
            isLoginValid = credentialsList.find(user => user.username === userInputValue)?.password === userPasswordValue
        }
        else if (isEmailExisting) {
            isLoginValid = credentialsList.find(user => user.email === userInputValue)?.password === userPasswordValue
        }
        if (userPasswordValue === '') setUserPasswordError(() => true)
        if (userInputValue !== '' && userPasswordValue !== '') {
            if (isLoginValid) loginUser(userInputValue)
            else setIsLoginError(() => true)
        }
    }

    return (
        <div className="w-full h-screen flex flex-col p-4 justify-center items-center gap-y-[36px]">
            <motion.div initial={{ y: -45, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{ease: [0.16, 1, 0.3, 1], duration: 0.5}}>
                <p className="text-4xl raleway-700 text-mm-primary">Daily Time Record</p>
            </motion.div>
            <div className="w-[448px] rounded-md p-8 py-4 gap-y-[25px] bg-white flex flex-col">
                <form>
                    <div className="flex flex-col gap-y-[30px]">
                        <div className="w-full flex flex-col justify-center items-start gap-y-[6px]">
                            <label htmlFor="usernameEmail" className="text-base text-slate-900">Name</label>
                            <input required type='text' id="usernameEmail" onChange={(e) => userFieldChange(e.target.value, 'name')}  className="w-full rounded border-1 border-slate-300 focus:border-mm-primary ps-[12px] py-[8px]" placeholder="Username or Email"/>
                            {userInputError && (
                                <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -30, opacity: 0 }} transition={{ease: [0, 0.55, 0.45, 1], duration: 0.5}}>
                                    <p className="text-sm text-mm-error">Username is required</p>
                                </motion.div>
                            )}
                        </div>
                        <div className="w-full flex flex-col justify-center items-start gap-y-[6px]">
                            <label htmlFor="password" className="text-base text-slate-900">Password</label>
                            <input required type='password' id="password" onChange={(e) => userFieldChange(e.target.value, 'password')} className="w-full rounded border-1 border-slate-300 focus:border-mm-primary ps-[12px] py-[8px]" placeholder="Password"/>
                            {userPasswordError && (
                                <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -30, opacity: 0 }} transition={{ ease: [0, 0.55, 0.45, 1], duration: 0.5 }} className="w-full">
                                    <p className="text-sm text-mm-error">Password is required</p>
                                </motion.div>
                            )}
                        </div>
                        <div>
                            <button type="button" onClick={(enableLoginButton ? loginAttempt : undefined)} className={"w-full py-[12px] text-white text-center rounded-md transition-all duration-300 ease-in-out " + (enableLoginButton ? "bg-mm-primary hover:bg-mm-hover  cursor-pointer" : "bg-slate-300 cursor-not-allowed")}>Login</button>
                            <AnimatePresence>
                                {isLoginError && (
                                    <motion.div key='error' initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{y: -30, opacity: 0 }} transition={{ease: [0.16, 1, 0.3, 1], duration: 0.5}}>
                                        <p className="text-sm text-mm-error mt-[6px]">Username/Password is incorrect. Please try again.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </form>
                <button type="button" className="w-full text-slate-500 cursor-pointer">Forgot Password?</button>
            </div>
            <p className="text-slate-500 text-sm">Copyright © 2024 FE Exam track, All Rights Reserved.</p>
        </div>
    )
}
export default LoginPage;