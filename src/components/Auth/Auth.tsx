"use client";
import React from "react";
import {Label} from "./label";
import {Input} from "./input";
import {cn} from "@/lib/utils";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import useLogin from "@/hooks/useLogin.tsx";
import {Triangle} from "react-loader-spinner";

const formSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(4, {
        message: "Password must be at least 4 characters.",
    }),
});

export const Auth = () => {

    const {mutate, isPending} = useLogin();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });


    const onSubmit = (values: z.infer<typeof formSchema>) => {
        // console.log("values to be submitted:", values);
        mutate(values)
    };
    return (


        <>
            {isPending &&
                (<div className='absolute inset-0 flex items-center justify-center z-[1000] bg-white bg-opacity-50'>
                        <Triangle
                            visible={true}
                            height="120"
                            width="150"
                            color="green"
                            ariaLabel="triangle-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                        />
                    </div>
                )
            }
            <div
                className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 mb-8 shadow-input border-[0.1rem] border-border bg-border">
                <h2 className="font-bold text-xl">Welcome</h2>
                <p className="text-sm max-w-sm mt-2">Login</p>

                <form onSubmit={form.handleSubmit(onSubmit)} className="my-8">
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            placeholder="username"
                            {...form.register("username")}
                        />
                        {form.formState.errors.username && (
                            <p className="text-red-500">{form.formState.errors.username.message}</p>
                        )}
                    </LabelInputContainer>
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            placeholder="••••••••••"
                            type="password"
                            {...form.register("password")}
                        />
                        {form.formState.errors.password && (
                            <p className="text-red-500">{form.formState.errors.password.message}</p>
                        )}
                    </LabelInputContainer>

                    <button
                        className="bg-gradient-to-br relative group/btn bg-primary block w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                        type="submit"
                    >
                        Login &rarr;
                        <BottomGradient/>
                    </button>
                </form>

                <div
                    className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full"/>

                <div className="flex flex-col space-y-4">
                    <BottomGradient/>
                </div>
            </div>
        </>
    );
}

const BottomGradient = () => {
    return (
        <>
            <span
                className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"/>
            <span
                className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"/>
        </>
    );
};

const LabelInputContainer = ({
                                 children,
                                 className,
                             }: {
    children: React.ReactNode;
    className?: string;
}) => {
    return <div className={cn("flex flex-col space-y-2 w-full", className)}>{children}</div>;
};
