import React, { useState } from 'react'
import Input from '../../../components/input'
import Button from '../../../components/Button'
import styles from "./signup.module.css";
import signUpImgI from '../../../assets/rooms-list-i.png'
import signUpImgII from '../../../assets/rooms-list-ii.png'
import signUpImgIII from '../../../assets/rooms-list-v.png'
import signUpImgIV from '../../../assets/rooms-list-iv.png'
import logo from '../../../assets/GrandAzure Logo.png'
import { auth, db } from "../../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const navigate = useNavigate()
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            alert('All Fields are mandatory')
            return
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            alert("Login successful");
            navigate("/homepage")
            console.log("User:", user);
        } catch (error) {
            alert(error.message);
        }


    };


    return (
        <div className={styles.container}>
            <div className={styles.left}>
                <img src={logo} alt="" />
                <div className={styles.welcomeText}>Welcome to the Grand Azure</div>
                <div className={styles.subtitle}>Sign into your account</div>
                <form action="">
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

                    <Button
                        text={'Login'}
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
                    <p>Don't have an account? <span className={styles.loginButton} onClick={()=> navigate("/signup")}>Create one now</span></p>                    
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
};

export default Login
