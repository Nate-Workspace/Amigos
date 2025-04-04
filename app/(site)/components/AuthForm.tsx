"use client";
/* 
Requirements:
npm i @RiTailwindCssFill/forms

*/
import Button from "@/app/components/Button";
import Input from "@/app/components/inputs/Input";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { BsGithub, BsGoogle } from "react-icons/bs";
import AuthSocialButton from "./AuthSocialButton";

type variant = "LOGIN" | "REGISTER";

const AuthForm = () => {
  const session= useSession();
  const router= useRouter();
  const [variant, setVariant] = useState<variant>("LOGIN");
  const [isLoading, setIsLoading] = useState(false);

  //Checking if there is an authenticated user
  useEffect(()=>{
    if(session.status==='authenticated'){
      console.log("again and again")
      router.push('/users')
    }
  },[router, session.status])

  //Memoizing the variant status
  const toggleVariant = useCallback(() => {
    if (variant === "LOGIN") {
      setVariant("REGISTER");
    } else {
      setVariant("LOGIN");
    }
  }, [variant]);

  //Initializing react hook form. Step 1
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    if (variant === "REGISTER") {
      axios.post('/api/register', data)
      .then(()=> signIn('credentials', data))
      .catch(()=> toast.error('Something went wrong!'))
      .finally(()=> setIsLoading(false))
    }
    if (variant === "LOGIN") {
      signIn('credentials', {    // The first argument is the value of name property we gave to credentials inside authOptioins
        ...data,
        redirect: false
      }). then((callback)=>{
        if(callback?.error){
          toast.error("Invalid Credentials")
        }

        if(callback?.ok && !callback?.error){
          toast.success('Logged in')
          router.push('/users')
        }
      })
      .finally(()=> setIsLoading(false))
    }
  };

  const socialAction = (action: string) => {
    setIsLoading(true);
    signIn(action, {redirect: false})
    .then((callback)=>{
      if(callback?.error){
        toast.error('Invalid credentials')
      }

      if(callback?.ok && !callback?.error){
        toast.success("Logged in")
      }
    })
    .finally(()=> setIsLoading(false))
  };
  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {variant === "REGISTER" && (
            <Input id="name" label="Name" register={register} errors={errors} disabled={isLoading}/>
          )}
          <Input
            id="email"
            label="Enter Email Address"
            type="email"
            register={register}
            errors={errors}
            disabled={isLoading}
          />
          <Input
            id="password"
            label="Enter password"
            type="password"
            register={register}
            errors={errors}
            disabled={isLoading}
          />
          <div>
            <Button disabled={isLoading} fullwidth type="submit">
              {variant==="LOGIN"? "Sign in": "Register"}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">

            <div className="inset-0 flex items-center justify-center">
              <div className="w-full border-t border-gray-300" />
              <div className="absolute flex justify-center text-sn">
                <span className="bg-white px-2 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
            {/* 
              <AuthSocialButton icon={BsGithub} onClick={()=>socialAction('github')}/>
              */}
              <AuthSocialButton icon={BsGoogle} onClick={()=>socialAction('google')}/>
            </div>
          </div>

          <div className="flex gap-2 mt-6 items-center justify-center text-gray-600">
            <div>{variant==='LOGIN' ? 'New to Amigos?' : 'Already have an Amigos account?'}</div>
            <div className="hover:text-blue-600 cursor-pointer" onClick={toggleVariant}>{variant== 'LOGIN' ? 'Sign Up': 'Login'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
