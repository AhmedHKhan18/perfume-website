'use client'

import { useState } from 'react'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FcGoogle } from "react-icons/fc";
import { SiFacebook } from "react-icons/si";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig"


export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')


  const handleSignIn = async (email, password) => {
  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // ...
  })
    console.log("🚀 ~ .then ~ user:", user)
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });
    console.log("🚀 ~ handleSignIn ~ errorMessage:", errorMessage)
}

function handleSignUp(e){
  e.preventDefault()
  createUserWithEmailAndPassword(auth, email, password)
  .then(async (userCredential) => {
    // Signed up 
    const user = userCredential.user;
    // ...
    console.log("🚀 ~ .then ~ user:", user)
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
    console.log("🚀 ~ handleSignUp ~ errorMessage:", errorMessage)
  });
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Tabs defaultValue="signin" className="w-full">
      <TabsContent value="signin" className="my-10 text-center">
      <h1 className='text-3xl font-bold font-serif'>Welcome Back, Sign In to Continue</h1>
      </TabsContent>
      <TabsContent value="signup" className="my-10 text-center">
      <h1 className='text-3xl font-bold font-serif'>Hey, Please Sign Up to Proceed</h1>
      </TabsContent>
          <TabsList className="grid grid-cols-2 w-full mb-8">
            <TabsTrigger 
              value="signin"
              className="data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:text-orange-500"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger 
              value="signup"
              className="data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:text-orange-500"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email Address"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border rounded-lg pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm text-orange-500 hover:text-orange-600"
                >
                  Forgot Password?
                </Link>
              </div>
              <Button 
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg flex items-center justify-center gap-2"
                 onClick={() => handleSignIn}
              >
                SIGN IN
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background px-2 text-muted-foreground">or</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full py-3 flex items-center justify-center gap-3"
              >
                <FcGoogle />

                Login with Google
              </Button>
              <Button
                variant="outline"
                className="w-full py-3 flex items-center justify-center gap-3"
              >
                <SiFacebook />

                Login with Facebook
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Full Name"
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Email Address"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border rounded-lg pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <Button 
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg flex items-center justify-center gap-2"
                onClick={handleSignUp}
              >
                SIGN UP
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background px-2 text-muted-foreground">or</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full py-3 flex items-center justify-center gap-3"
              >
                <FcGoogle />
                Sign up with Google
              </Button>
              <Button
                variant="outline"
                className="w-full py-3 flex items-center justify-center gap-3"
              >
              <SiFacebook />
                Sign up with Facebook
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}