import '../styles/App.css'
import LoginPage from './login';
import { useDTRStore } from './store';
import { AnimatePresence, motion } from 'motion/react';
import MainDashboard from './dashboard';



function App() {
    const activeUser = useDTRStore((state) => state.user)
    // const [count, setCount] = useState(0)
    // const usersData = dummyDB.users
    // const router = createBrowserRouter([
    //     { path: "/login", Component: LoginPage}
    // ])

    return (
        <div className='h-screen motion-container'>
            <AnimatePresence mode='popLayout'>
                {activeUser === null && 
                    <motion.div
                        key="login"
                        initial={{  opacity: 0, y: "-100%",  }}
                        animate={{
                            opacity: 1,
                            y: 0,

                            transition: { ease: [0.16, 1, 0.3, 1], duration: 1 }
                        }}
                        exit={{
                            opacity: 0,
                            y: "-100%",
                            
                            transition: { ease: [0.16, 1, 0.3, 1], duration: 1 },
                        }}
                    >
                            <LoginPage />
                    </motion.div>
                }
                {activeUser !== null &&
                    <motion.div
                        key="dashboard"
                        initial={{ opacity: 0, y: "100%", }}
                        animate={{
                            opacity: 1,
                            y: 0,

                            transition: { ease: [0.16, 1, 0.3, 1], duration: 1 }
                        }}
                        exit={{
                            opacity: 0,
                            y: "100%",

                            transition: { ease: [0.16, 1, 0.3, 1], duration: 0.5 },
                        }}
                    >
                        <div className='w-full h-full'>
                            <MainDashboard />
                        </div>
                    </motion.div>
                }
            </AnimatePresence>
            {/* <AnimatePresence>
                <div className='w-full h-full'>
                    
                </div>    
            </AnimatePresence> */}
            
        </div>
    )
}

export default App
