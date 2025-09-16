import React, { useState } from 'react'
import Input from '../../../components/input'
import Button from '../../../components/Button'
import './signup.css'

const Signup = () => {
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault();

        const nameParts = fullName.trim().split(" ")

        if (!fullName || !email || !password || !confirmPassword) {
            alert('All Fields are mandatory')
            return
        }

        if (nameParts.length !== 2) {
            alert("Full name must have exactly two words");
            return;
        }
    }

    return (
        <div className='container'>
            <div className='left'>
                <div className='logo'></div>
                <div className='welcome-text'>Welcome to the Grand Azure</div>
                <div className='subtitle'>Sign into your account</div>
                <form action="">
                    <Input
                        type='text'
                        placeholder={'Full name e.g John Doe'}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />

                    <Input
                        type='email'
                        placeholder={'Email Address'}
                        value={(email)}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Input
                        type='password'
                        placeholder={'Password'}
                        value={(password)}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Input
                        type='password'
                        placeholder={'Confirm Password'}
                        value={(confirmPassword)}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <Button
                        text={'Create Account'}
                        onClick={console.log();
                         }
                    />

                </form>
            </div>
        </div>
    )
}

export default Signup
