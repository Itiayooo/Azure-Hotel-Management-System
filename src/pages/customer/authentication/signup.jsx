import React, { useState } from 'react'
import Input from '../../../components/input'
import Button from '../../../components/Button'
import styles from "./signup.module.css";
import signUpImgI from '../../../assets/rooms-list-i.png'
import signUpImgII from '../../../assets/rooms-list-ii.png'
import signUpImgIII from '../../../assets/rooms-list-v.png'
import signUpImgIV from '../../../assets/rooms-list-iv.png'

import logo from '../../../assets/GrandAzure Logo.png'




const Signup = () => {
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault();

        const nameParts = fullName.trim().split(" ")
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        console.log(nameParts);


        if (!fullName || !email || !password || !confirmPassword) {
            alert('All Fields are mandatory')
            return
        }

        if (nameParts.length !== 2) {
            alert("Full name must have exactly two words");
            return;
        }

        if (nameParts[0].length < 3 || nameParts[1].length < 3) {
            alert("Each name must contain at least three characters")
            return
        }

        if (!emailPattern.test(email)) {
            alert("Please enter a valid email address");
            return;
        }

        if (password.length < 8) {
            alert('Password must contain at least 8 characters')
            return
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match')
            return
        }

        alert(`Let's get this`)
    }

    return (
        <div className={styles.container}>
            <div className={styles.left}>
                <img src={logo} alt="" />
                {/* <div className='logo'></div> */}
                <div className={styles.welcomeText}>Welcome to the Grand Azure</div>
                <div className={styles.subtitle}>Sign into your account</div>
                <form action="">
                    <Input
                        type='text'
                        placeholder={'Full name e.g John Doe'}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className={styles.input}
                    />

                    <Input
                        type='email'
                        placeholder={'Email Address'}
                        value={(email)}
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles.input}
                    />

                    <Input
                        type='password'
                        placeholder={'Password'}
                        value={(password)}
                        onChange={(e) => setPassword(e.target.value)}
                        className={styles.input}
                    />

                    <Input
                        type='password'
                        placeholder={'Confirm Password'}
                        value={(confirmPassword)}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={styles.input}
                    />

                    <Button
                        text={'Create Account'}
                        onClick={handleSubmit}
                    />

                    <div></div>
                    <div class={styles.divider}>

                        <div className={styles.divideri}></div>
                        OR
                        <div className={styles.divideri}></div>

                    </div>

                    <div class={styles.socialButtons}>
                        <button>Continue with Google</button>
                        <button>Continue with Apple</button>
                    </div>

                </form>
                <div className={styles.haveAccount}>
                    <p>Already have an account? <span className={styles.loginButton}>Login</span></p>
                </div>
            </div>

            <div className={styles.right}>
                <div className={styles.imageGrid}>
                    <img src={signUpImgI} alt="" />
                    <img src={signUpImgII} alt="" />
                    <img src={signUpImgIII} alt="" />
                    <img src={signUpImgIV} alt="" />
                </div>
                <h2>Welcome to The Grand Azure</h2>
                <p>Log in to manage your bookings, access exclusive offers, and enjoy a personalized experience every time you stay with us.</p>
            </div>
        </div>
    )
}

export default Signup
