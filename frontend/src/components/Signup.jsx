import React, { useState } from 'react'
// import { Label } from "@/components/ui/label";
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from 'sonner';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const Signup = () => {
    const [input, setInput] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); 
    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput((prevInput) => ({
            ...prevInput,
            [name]: value.trim()
        }));
    };

    const signupHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post('http://localhost:5000/api/v2/user/register', input, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials:true
            });
            if(res.data.success){
                navigate("/login");
                toast.success(res.data.message);
                setInput({
                    username: '',
                    email: '',
                    password: '',
                });
            }
        } catch (error) {
            console.log(error.response);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally{
            setLoading(false);
        }
    }
  return (
    <div className='flex items-center w-screen h-screen justify-center'>
        <form onSubmit={signupHandler} className='shadow-lg flex flex-col gap-5 p-8'>
            <div className='my-4'>
                <h1 className='text-center font-bold text-xl'>LOGO</h1>
                <p className='text-sm text-center'>Signup to see photos & videos from your friends</p>
            </div>
            <div className="">
                <span htmlFor="" className="font-medium">Username</span>
                <Input type="text" placeholder='Enter Your Username' name='username' id="username" value={input.username} onChange={changeEventHandler} autoComplete="username" className='focus-visible:ring-transparent my-2'/>
            </div>
            <div className="">
                <span htmlFor="" className="font-medium">Email</span>
                <Input type="email" placeholder='Enter Your Email' name='email' id='email' value={input.email} onChange={changeEventHandler} autoComplete='email' className='focus-visible:ring-transparent my-2'/>
            </div>
            <div className="">
                <span htmlFor="" className="font-medium">Password</span>
                <Input type="password" placeholder='Enter Your Password' name='password' id='password' value={input.password} onChange={changeEventHandler} autoComplete='new-password' className='focus-visible:ring-transparent my-2'/>
            </div>
            {
                loading ? (
                    <Button>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                        Please Wait Buddy
                    </Button>
                ) : (
                    <Button type='submit'>Signup</Button>
                )
            }
            <span className="text-center">Already have an account?
                <Link to="/login" className="text-blue-600">Login</Link>
            </span>
        </form>
    </div>
  )
}

export default Signup;